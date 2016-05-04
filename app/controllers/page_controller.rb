class PageController < ApplicationController
  before_filter :authenticate_user!
  
  def timeline   
    respond_to do |format|
      format.html
    end
  end
  
  def home
    if current_user.id == 1
      render "page/admin"
    else
      respond_to do |format|
        if params[:go].present?
          @go = params[:go]
        end
        format.html
      end
    end
  end
end
