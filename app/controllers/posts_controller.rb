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
  
  def recent
    # get posts of the present year
    posts = Posts.select('id, title, extract(month from created_at) as month').where('extract(year from created_at) = extract(year from CURRENT_DATE)').order("created_at DESC")
    monthsLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    monthsPosts = [[],[],[],[],[],[],[],[],[],[],[],[]]
    @resp = []
    posts.each do |p|
      monthsPosts[p.month.to_i - 1].push(p)
    end
    (0..11).reverse_each do |i|
      @resp.push({label: monthsLabels[i], posts: monthsPosts[i]})
    end
    respond_to do |format|
      format.json { render json: @resp, status: 200}
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
    
    def  show_params
      return params.require(:id)
    end
end
