class PostController < ApplicationController
  def new
    @post = Post.new
  end
  
  def create
    @post = Post.new(post_params)
    @post.save
    redirect_to controller: 'page', action: 'home'
  end
   
  private
    def post_params
      params.permit(:title, :text, :photos => [])
    end
# gett photo id
#  if params[:image_id].present?
#    preloaded = Cloudinary::PreloadedFile.new(params[:image_id])         
#    raise "Invalid upload signature" if !preloaded.valid?
#    @model.image_id = preloaded.identifier
#  end
end
