class PostController < ApplicationController
  def new
    @post = Post.new
  end
  
  def show
    if params[:id].present? and params[:last].present? and params[:id].to_i < params[:last].to_i
      prev = Post.count(:all) - params[:id].to_i
      page = ((prev + 1) / WillPaginate.per_page.to_f).ceil
      @posts = Post.order("created_at DESC").page(page)
      @gap = Post.where("id > " + @posts.first().id.to_s + " AND id <" + params[:last]).order("created_at DESC")
      @goTo = true

      render :template => 'page/home', :formats => [:js]
    else
      render :nothing => true, :status => 204
    end
  end
  
  def create
    if post_params
      @post = Post.new(post_params)
      @post.save!
      
        respond_to do |format|
          format.js
        end
    end
  end
  
  private
    def post_params
      my_params = params.permit(:title, :text, :photos => [])
      if my_params[:title].present?
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
      else
        raise ArgumentError
      end
    end
end
