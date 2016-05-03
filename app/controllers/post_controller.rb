class PostController < ApplicationController
  before_filter :authenticate_user!
#  before_filter do 
#    redirect_to :new_user_session_path unless current_user && current_user.admin?
#  end
  include PostResourceResolver
  
  def new
    return Post.new
  end
  
  def likeIt (p)
    existingNotif = Notif.where(user_id: p.user_id, from: current_user.id, nType: 'like', nTypeAux: p.id)
    if existingNotif.empty?
      msg = current_user.name + ' Likes your post: ' + p.title
      Notif.create(user_id: p.user_id, from: current_user.id, message: msg, n_type: 'like', n_type_aux: p.id, link: '/page/home#p-' + p.id.to_s)
    end
  end
  
  def like
    respond_to do |format|
      @post = Post.where('id = ' + paramID).first
      if @post.likes.include? current_user.id
        @post.likes.delete(current_user.id)
      else
        @post.likes.push(current_user.id)
      end
      @post.save!
      likeIt(@post)
      format.json { render json: post_resolver(@post), status: 200}
    end
  end
  
  def index
    respond_to do |format|
      if index_params[:start].present?
        startPost = current_user.posts.where('id = ?', index_params[:start])
        @posts = current_user.posts.where('created_at < ?', startPost.first.created_at).order('created_at DESC').limit(index_params[:limit])
      else
        @posts = current_user.posts.order('created_at DESC').limit(index_params[:limit])
      end
      format.json { render json: postArray_resolver(@posts), status: 200}
    end
  end
  
  def range
    respond_to do |format|
      startPost = current_user.posts.where('id = ?', range_params[:begin])
      endPost = current_user.posts.where('id = ?', range_params[:end])
      if startPost.first && endPost.first
        @posts = current_user.posts.where('created_at < ? AND created_at >= ?', startPost.first.created_at, endPost.first.created_at).order('created_at DESC')
        if range_params[:tailSize].present?
          @posts += current_user.posts.where('created_at < ?', endPost.first.created_at).order('created_at DESC').limit(range_params[:tailSize])
        end
        format.json { render json: postArray_resolver(@posts), status: 200}
      else
        format.json { render :nothing => true, :status => 400}
      end  
    end
  end
  
  def show
    @post = current_user.posts.where('id = ' + paramID)
    respond_to do |format|
      if @post.empty?
        format.json { render :nothing => true, :status => 404}
      else
        format.json { render json: post_resolver(@post.first), status: 200}     
      end
    end
  end
  
  def destroy
    @post = current_user.posts.destroy(paramID).first
    Cloudinary::Api.delete_resources(@post.photos)
    respond_to do |format|
      if !@post.persisted?
          format.json { render json: @post, status: 200}
      else
          format.json { render :nothing => true, :status => 500}
      end
    end
  end
  
  def recent
    # get posts of the present year
    posts = current_user.posts.select('id, title, created_at').where('extract(year from created_at) = extract(year from CURRENT_DATE)').order('created_at DESC')
    @monthsPosts = [[],[],[],[],[],[],[],[],[],[],[],[]]
    posts.each do |p|
      @monthsPosts[p.created_at.to_time.month - 1].push({id: p.id, title: p.title})
    end
    respond_to do |format|
      format.json { render json: @monthsPosts, status: 200}
    end
  end
  
  def update
    @post = current_user.posts.where('id = ' + paramID).first
    beforePhotos = @post.photos
    @post.update(update_params)
    photosForDeletion = beforePhotos - @post.photos
    Cloudinary::Api.delete_resources(photosForDeletion)
    respond_to do |format|
      format.json { render json:  post_resolver(@post), status: 200}
    end
  end
  
  def create
    @post = current_user.posts.create(post_params)
    respond_to do |format|
      if @post.valid?
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
      params.require(:limit)
      return params.permit(:limit, :start)
    end
    
    def range_params
      params.require(:begin)
      params.require(:end)
      return params.permit(:begin, :end, :tailSize)
    end
    
    def  paramID
      return params.require(:id)
    end
end
