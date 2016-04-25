class UserController < ApplicationController
  before_filter :authenticate_user!
  
  def current
    @friends = User.where('id IN (?)', current_user.friends)
    respond_to do |format|
      format.json { render json: {user: current_user, friends: @friends}, status: 200}
    end
  end
end
