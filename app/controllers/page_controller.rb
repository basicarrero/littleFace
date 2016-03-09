class PageController < ApplicationController
  def home
    @posts = Post.all.paginate(page: params[:page])
    respond_to do |format|
      format.html
      format.js
    end
  end
end