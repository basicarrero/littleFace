class PageController < ApplicationController
  #before_filter :authenticate_user!
  
  def home
    @monthsLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    @postList = Post.where("created_at > date_trunc('month', CURRENT_DATE) - INTERVAL '6 months'").order("created_at DESC")
    #@posts = Post.order("created_at DESC")
    
    respond_to do |format|
      format.html
    end
  end
end
