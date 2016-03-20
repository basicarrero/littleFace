class PageController < ApplicationController
  def home
    @posts = Post.order('created_at DESC').page(params[:page])
    respond_to do |format|
      format.html
      format.js
    end
  end
end