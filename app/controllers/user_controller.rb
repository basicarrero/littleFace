class UserController < ApplicationController
  before_filter :authenticate_user!
  
  def current
    respond_to do |format|
      result = {user: current_user}
      @friends = User.where('id IN (?)', current_user.friends)
      @requests = current_user.notifs.where('n_type_aux = ?', 'pending')
      if !@friends.empty?
        result[:friends] = @friends
      end
      if !@requests.empty?
        result[:requests] = @requests
      end
      format.json { render json: result, status: 200}
    end
  end

  def show
     respond_to do |format|
       @user = User.where('id = ?', userID)
       if @user.first
         format.json { render json: @user, status: 200}
       else
         format.json { render :nothing => true, :status => 404}
       end
     end
  end
  
  def unfriends
    unless (current_user && current_user.id == 1) || (current_user && current_user.id == userID.to_i)
      render file: "#{Rails.root}/public/403.html", layout: false, status: 403
    else
      respond_to do |format|
        @user = User.where('id = ?', friends_params).first
        if @user
          current_user.friends.delete(@user.id)
          @user.friends.delete(current_user.id)
          current_user.save!
          @user.save!
          format.json { render json: current_user, status: 200}
        else
          format.json { render :nothing => true, :status => 404}
        end
      end
    end
  end
  
  def friends
    unless (current_user && current_user.id == 1) || (current_user && current_user.id == userID.to_i)
      render file: "#{Rails.root}/public/403.html", layout: false, status: 403
    else
      respond_to do |format|
        @user = User.where('id = ?', friends_params).first
        if @user
          current_user.friends.push(@user.id)
          @user.friends.push(current_user.id)
          current_user.save!
          @user.save!
          format.json { render json: current_user, status: 200}
        else
          format.json { render :nothing => true, :status => 404}
        end
      end
    end
  end
  
  def search
     respond_to do |format|
       @users = User.where('name LIKE ? OR email LIKE ?', search_params, search_params)
       if @users.empty?
         format.json { render :nothing => true, :status => 404}
       else
         format.json { render json: @users, status: 200}
       end
     end
  end

  private
    def  search_params
      return params.require(:searchToken)
    end
    
    def  friends_params
      return params.require(:friendId)
    end
    
    def  userID
      return params.require(:user_id)
    end
end


