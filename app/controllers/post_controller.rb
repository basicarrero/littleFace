class PostController < ApplicationController
  def new
    @post = Post.new
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
      end
    end
end
