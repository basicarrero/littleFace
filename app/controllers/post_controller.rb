class PostController < ApplicationController
  before_filter :authenticate_user!
  before_filter :adminCheck
  include PostResourceResolver
  
  def new
    return Post.new
  end
  
  def likeIt (p)
    existingNotif = Notif.where(user_id: p.user_id, from: @target.id, n_type: 'like', n_type_aux: p.id)
    if existingNotif.empty?
      Notif.create(
        user_id: p.user_id,
        from: @target.id,
        message: @target.name + ' Likes your post: ' + p.title,
        n_type: 'like',
        n_type_aux: p.id,
        link: '/page/home#p-' + p.id.to_s)
    end
  end
  
  def like
    respond_to do |format|
      @post = Post.where('id = ' + paramID).first
      if @post.likes.include? @target.id
        @post.likes.delete(@target.id)
      else
        @post.likes.push(@target.id)
      end
      @post.save!
      likeIt(@post)
      format.json { render json: post_resolver(@post), status: 200}
    end
  end
  
  def index
    respond_to do |format|
      @user = User.where('id = ?', userID).first
      if @user
        if index_params[:start].present?
          startPost = @user.posts.where('id = ?', index_params[:start])
          @posts = @user.posts.where('created_at < ?', startPost.first.created_at).order('created_at DESC').limit(index_params[:limit])
        else
          @posts = @user.posts.order('created_at DESC').limit(index_params[:limit])
        end
        format.json { render json: postArray_resolver(@posts), status: 200}
      else
        format.json { render :nothing => true, :status => 404}
      end
    end
  end
  
  def share
    @post = Post.where('id = ?', paramID)
    if @post.empty?
      format.json { render :nothing => true, :status => 404}
    else
      @post = @target.posts.create(title: @post.first.title, text: @post.first.text, photos: @post.first.photos)
      if @post.persisted?
        statusCode = 201
      else
        statusCode = 500
      end
      format.json { render json:  post_resolver(@post), status: statusCode}
    end
  end
   
  def range
    respond_to do |format|
      startPost = @target.posts.where('id = ?', range_params[:begin])
      endPost = @target.posts.where('id = ?', range_params[:end])
      if startPost.first && endPost.first
        @posts = @target.posts.where('created_at < ? AND created_at >= ?', startPost.first.created_at, endPost.first.created_at).order('created_at DESC')
        if range_params[:tailSize].present?
          @posts += @target.posts.where('created_at < ?', endPost.first.created_at).order('created_at DESC').limit(range_params[:tailSize])
        end
        format.json { render json: postArray_resolver(@posts), status: 200}
      else
        format.json { render :nothing => true, :status => 400}
      end  
    end
  end
  
  def show
    @post = @target.posts.where('id = ' + paramID)
    respond_to do |format|
      if @post.empty?
        format.json { render :nothing => true, :status => 404}
      else
        format.json { render json: post_resolver(@post.first), status: 200}     
      end
    end
  end
  
  def destroy
    respond_to do |format|
      @post = @target.posts.destroy(paramID).first
      if @post.destroyed?
        if !@post.photos.empty?
          Cloudinary::Api.delete_resources(@post.photos)
        end
        format.json { render json: @post, status: 200}
      else
        format.json { render :nothing => true, :status => 500}
      end
    end
  end
  
  def recent
    # get posts of the present year
      respond_to do |format|
      posts = @target.posts.select('id, title, created_at').where('extract(year from created_at) = extract(year from CURRENT_DATE)').order('created_at DESC')
      @monthsPosts = [[],[],[],[],[],[],[],[],[],[],[],[]]
      posts.each do |p|
        @monthsPosts[p.created_at.to_time.month - 1].push({id: p.id, title: p.title})
      end
      format.json { render json: @monthsPosts, status: 200}
    end
  end
  
  def update
    respond_to do |format|
      @post = @target.posts.where('id = ' + paramID).first
      beforePhotos = @post.photos
      res = @post.update(update_params)
      if res
        photosForDeletion = beforePhotos - @post.photos
        if !photosForDeletion.empty?
          Cloudinary::Api.delete_resources(photosForDeletion)
        end
        format.json { render json:  post_resolver(@post), status: 200}
      else
        format.json { render :nothing => true, :status => 500}
      end
    end
  end
  
  def create
    @post = @target.posts.create(post_params)
    respond_to do |format|
      if @post.persisted?
        statusCode = 201
      else
        statusCode = 500
      end
      format.json { render json:  post_resolver(@post), status: statusCode}
    end
  end
  
  private
    def post_params
      params.require(:title)
      my_params = params.permit(:title, :text, :photos => [])
      if my_params[:title].present?
        my_params[:title].capitalize!
        return my_params
      else
        raise 'Missing post title!'
      end
    end
    
    def update_params
      my_params = params.permit(:title, :text, :photos => [])
      if params[:photos].present? and params[:photos] == 0
        my_params[:photos]  = []
      end
      return my_params
    end
    
    def index_params
      return params.permit(:limit, :start)
    end
    
    def range_params
      params.require(:begin)
      params.require(:end)
      return params.permit(:begin, :end, :tailSize)
    end
    
    def paramID
      return params.require(:id)
    end
    
    
    def userID
      return params.require(:user_id)
    end
    
    def  adminCheck
      if params[:user_id].present? && current_user
        if current_user.id == 1
          @target = User.where('id = ?', userID)
          if @target.empty?
            render :nothing => true, :status => 404
          else
            @target = @target.first
          end
        else
          @target = current_user
        end
      end
    end
end
