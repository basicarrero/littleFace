class TimelineController < ApplicationController
  before_filter :authenticate_user!
  before_filter :permissionsCheck
  include PostResourceResolver
  
  def index
    respond_to do |format|
      if index_params[:start].present?
        startPost = Post.where('id = ?', index_params[:start])
        @posts = Post.where('created_at < ? AND user_id IN (?)', startPost.first.created_at, current_user.friends).order("created_at DESC").limit(index_params[:limit])
      else
        @posts = Post.where('user_id IN (?)', current_user.friends).order("created_at DESC").limit(index_params[:limit])
      end
      format.json { render json: postArray_resolver(@posts), status: 200}
    end
  end
  
  private
    def index_params
      return params.permit(:limit, :start)
    end
    
    def  userID
      return params.require(:user_id)
    end
    
    def  permissionsCheck
      unless (current_user && current_user.id == 1) || (current_user && current_user.id == userID.to_i)
        render file: "#{Rails.root}/public/403.html", layout: false, status: 403
      end
    end
end
