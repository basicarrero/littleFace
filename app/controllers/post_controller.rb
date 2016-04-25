class PostController < ApplicationController
  before_filter :authenticate_user!
  include PostResourceResolver
  
  def new
    return Post.new
  end
  
  def index
    respond_to do |format|
      if index_params[:start].present?
        startPost = Post.where('id = ?', index_params[:start])
        @posts = current_user.posts.where('created_at < ?', startPost.first.created_at).order("created_at DESC").limit(index_params[:limit])
      else
        @posts = current_user.posts.order("created_at DESC").limit(index_params[:limit])
      end
      format.json { render json: postArray_resolver(@posts), status: 200}
    end
  end
  
  def range
    respond_to do |format|
      startPost = Post.where('id = ?', range_params[:begin])
      endPost = Post.where('id = ?', range_params[:end])
      if startPost && endPost
        @posts = current_user.posts.where('created_at < ? AND created_at >= ?', startPost.first.created_at, endPost.first.created_at).order("created_at DESC")
      else
        format.json { render :nothing => true, :status => 400}
      end  
      if range_params[:tailSize].present?
        @posts += current_user.posts.where('created_at < ?', endPost.first.created_at).order("created_at DESC").limit(range_params[:tailSize])
      end
      format.json { render json: postArray_resolver(@posts), status: 200}
    end
  end
  
  def show
    @post = current_user.posts.where("id = " + paramID)
    respond_to do |format|
      if @post.first
          format.json { render json: post_resolver(@post.first), status: 200}
      else
          format.json { render :nothing => true, :status => 404}
      end
    end
  end
  
  def destroy
    @post = current_user.posts.destroy(paramID)
    respond_to do |format|
      if @post.first && !@post.first.persisted?
          format.json { render json: @post.first, status: 200}
      else
          format.json { render :nothing => true, :status => 500}
      end
    end
  end
  
  def recent
    # get posts of the present year
    posts = current_user.posts.select('id, title, created_at').where('extract(year from created_at) = extract(year from CURRENT_DATE)').order("created_at DESC")
    @monthsPosts = [[],[],[],[],[],[],[],[],[],[],[],[]]
    posts.each do |p|
      @monthsPosts[p.created_at.to_time.month - 1].push({id: p.id, title: p.title})
    end
    respond_to do |format|
      format.json { render json: @monthsPosts, status: 200}
    end
  end
  
def update
  @post = current_user.posts.update(paramID, update_params)
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
        raise "Missing post title!"
      end
    end
    
    def update_params
      return params.permit(:title, :text, :photos => [])
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
