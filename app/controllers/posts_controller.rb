class PostsController < ApplicationController
  #before_filter :authenticate_user!
  
  def new
    @post = Post.new
  end
  
  def index
    @posts = Posts.order("created_at DESC").limit(index_params)
    respond_to do |format|
      format.json { render json: @posts, status: 200}
    end
  end
  
  def range
    @posts = Posts.where("id <= " + range_params[:begin].to_s + " AND id >= " + range_params[:end].to_s).order("created_at DESC")
    respond_to do |format|
      format.json { render json: @posts, status: 200}
    end
  end
  
  def interval
    @posts = Posts.select('id, title').where("created_at > CURRENT_DATE - INTERVAL '" + interval_params + "'").order("created_at DESC")
    respond_to do |format|
      format.json { render json: @posts, status: 200}
    end
  end
  
  def show
    @post = Posts.where("id = " + show_params)
    respond_to do |format|
      format.json { render json: @post, status: 200}
    end
    #render :nothing => true, :status => 204
  end
  
  def create
    if post_params
      @post = Post.new(createPost_params)
      @post.save!
      render :nothing => true, :status => 201
    end
  end
  
  private
    def createPost_params
      params.require(:title)
      my_params = params.permit(:title, :text, :photos => [])
        my_params[:title].capitalize!
        if my_params[:photos].present?
          id_photos = []
          my_params[:photos].each do |p|
            file = Cloudinary::PreloadedFile.new(p)
            raise "Invalid upload signature" if !file.valid?
            id_photos.push(file.public_id)
          end
          my_params[:photos] = id_photos
        end
        return my_params
    end
    
    def index_params
      return params.require(:limit)
    end
    
    def range_params
      params.require(:begin)
      params.require(:end)
      return params.permit(:begin, :end)
    end
    
    def interval_params
      return params.require(:interval)
    end
    
    def  show_params
      return params.require(:id)
    end
end
