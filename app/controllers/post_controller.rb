class PostController < ApplicationController
  before_filter :authenticate_user!
  
  def post_resolver (p)
    if p
      p_attr = p.attributes
        if p.photos.length > 0
          resources = Cloudinary::Api.resources_by_ids(p.photos)['resources']
          p_attr['resources'] = []
          resources.each do |r|
            p_attr['resources'].push({url: r['url'], public_id: r['public_id']})
          end
        end
      return p_attr
    end
  end
  
  def postArray_resolver (postLst)
    result = []
    if postLst
      postLst.each do |p|
        result.push(post_resolver(p))
      end
    end
    return result
  end
  
  def new
    return Post.new
  end
  
  def index
    @posts = current_user.posts.order("created_at DESC").limit(index_params)
    respond_to do |format|
      format.json { render json: postArray_resolver(@posts), status: 200}
    end
  end
  
  def range
    @posts = current_user.posts.where("id <= " + range_params[:begin].to_s + " AND id >= " + range_params[:end].to_s).order("created_at DESC")
    respond_to do |format|
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
  
  def create
    @post = current_user.posts.create(post_params)
    if @post.valid?
      statusCode = 201
    else
      statusCode = 500
    end
    respond_to do |format|
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
    
    def index_params
      return params.require(:limit)
    end
    
    def range_params
      params.require(:begin)
      params.require(:end)
      return params.permit(:begin, :end)
    end
    
    def  paramID
      return params.require(:id)
    end
end
