Rails.application.routes.draw do
  devise_for :users, :controllers => { registrations: 'registrations' }

  get 'page/home' => 'page#home'
  get 'page/timeline' => 'page#timeline'
  get 'page/external/:id' => 'page#timeline'
  
  get 'user/current' => 'user#current'
  get 'user/search' => 'user#search'
  
  put 'user/:user_id/post/:id/like' => 'post#like'
  put 'user/:user_id/post/:id/share' => 'post#share'
  get 'user/:user_id/post/recent' => 'post#recent'
  get 'user/:user_id/post/range' => 'post#range'

  get 'user/:user_id/timeline' => 'timeline#index'
  put 'user/:user_id/friends' => 'user#friends'
  delete 'user/:user_id/unfriends' => 'user#unfriends'
  
  resources :user do
    resources :post, :notif
  end
  
  root 'page#home'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
