class NotifController < ApplicationController
  before_filter :authenticate_user!

  def new
    return Notif.new
  end
  
  def index
    # TODO
  end
  
  def show
    # TODO
  end
  
  def create
    # TODO
  end
  
  private
    # TODO: strong params here
end
