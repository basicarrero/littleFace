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
  
  def update
    respond_to do |format|
      @notif = current_user.notifs.where('id = ' + update_params[:id]).first
      if @notif
        @notif.update(n_type_aux: update_params[:status])
        format.json { render json: @notif, status: 200}
      else
        format.json { render :nothing => true, :status => 404}
      end
    end
  end
  
  def create
    respond_to do |format|
      # TODO
      format.json { render :nothing => true, :status => 200}
    end
  end
  
  def frRequests
    respond_to do |format|
      # TODO
      format.json { render :nothing => true, :status => 200}
    end
  end
  
  private
    def index_params
      params.permit(:limit, :last)
    end
    
    def update_params
      params.require(:id)
      params.require(:status)
      return params.permit(:id, :status)
    end
end
