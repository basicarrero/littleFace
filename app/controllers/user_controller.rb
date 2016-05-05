class UserController < ApplicationController
  before_filter :authenticate_user!
  before_filter :adminCheck
  
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
       if @user.empty?
         format.json { render :nothing => true, :status => 404}
       else
         format.json { render json: @user.first, status: 200}
       end
     end
  end
  
  def unfriends
    respond_to do |format|
      @user = User.where('id = ?', friends_params).first
      if @user
        @target.friends.delete(@user.id)
        @user.friends.delete(@target.id)
        @target.save!
        @user.save!
        format.json { render json: @user, status: 200}
      else
        format.json { render :nothing => true, :status => 404}
      end
    end
  end
  
  def friends
    respond_to do |format|
      @user = User.where('id = ?', friends_params).first
      if @user
        @target.friends.push(@user.id)
        @user.friends.push(@target.id)
        @target.save!
        @user.save!
        format.json { render json: @user, status: 200}
      else
        format.json { render :nothing => true, :status => 404}
      end
    end
  end
  
  def search
     respond_to do |format|
       regexp = '%' + search_params + '%'
       @users = User.where('name LIKE ? OR email LIKE ?', regexp, regexp)
       if @users.empty?
         format.json { render :nothing => true, :status => 404}
       else
         format.json { render json: @users, status: 200}
       end
     end
  end
  
  def index
     respond_to do |format|
       @users = User.all().order('id DESC')
       if index_params[:limit].present?
         @users = @users.limit(index_params[:limit])
       end
       format.json { render json: @users, status: 200}
     end
  end
  
  def create
    @user = User.create(create_params)
    respond_to do |format|
      if @user.persisted?
        statusCode = 201
      else
        statusCode = 500
      end
      format.json { render json:  @user, status: statusCode}
    end
  end
  
  def destroy
    respond_to do |format|
      @target.destroy()
      if @target.destroyed?
          format.json { render json: @target, status: 200}
      else
          format.json { render :nothing => true, :status => 500}
      end
    end
  end
  
  def update
    respond_to do |format|
      res = @target.update(update_params)
      if res
        format.json { render json:  @target, status: 200}
      else
        format.json { render :nothing => true, :status => 500}
      end
    end
  end
  
  def share # Untested
    @post = Post.where('id = ?', share_params)
    if @post.empty?
      format.json { render :nothing => true, :status => 404}
    else
      @target.posts.push(@post.first)
      res = @target.save
      if res
        format.json { render json:  @post, status: 201}
      else
        format.json { render :nothing => true, :status => 500}
      end
    end
  end
  
  private
    def create_params
      params.require(:email)
      params.require(:password)
      params.require(:password_confirmation)
      return params.permit(:name, :email, :password, :password_confirmation, :friends => [])
    end
    
    def update_params
      return params.permit(:name, :email, :password, :password_confirmation, :friends => [])
    end
    
    def index_params
      return params.permit(:limit)
    end

    def search_params
      return params.require(:searchToken)
    end
    
    def friends_params
      return params.require(:friendId)
    end
    
    def share_params
      return params.require(:post_id)
    end
    
    def userID
      return params.require(:id)
    end

    def  adminCheck
      if params[:id].present? && current_user
        if current_user.id == 1
          @target = User.where('id = ?', userID)
          if @target.empty?
            render :nothing => true, :status => 404
          else
            @target = @target.first
          end
        else
          @target = current_user
        end
      end
    end
end
