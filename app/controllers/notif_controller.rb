class NotifController < ApplicationController
  before_filter :authenticate_user!

  def new
    return Notif.new
  end
  
  def index
    respond_to do |format|
      if index_params[:last].present?
        lastNotif = current_user.notifs.where('id = ?', index_params[:last])
        @notifs = current_user.notifs.where('created_at > ?', lastNotif.first.created_at).order("created_at DESC")
      else
        @notifs = current_user.notifs.order("created_at DESC")
      end
      if index_params[:limit].present?
        @notifs = @notifs.limit(index_params[:limit])
      end
      format.json { render json: @notifs, status: 200}
    end
  end

  private
    def index_params
      params.permit(:limit, :last)
    end
end
