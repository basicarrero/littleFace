class PageController < ApplicationController
  def home
    @monthsLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    @posts = Post.order("created_at DESC").page(params[:page])
    @postList = Post.where("created_at > date_trunc('month', CURRENT_DATE) - INTERVAL '6 months'").order("created_at DESC")

    respond_to do |format|
      format.html
      format.js
    end
  end
end
