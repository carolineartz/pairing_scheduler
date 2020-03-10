Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do
    resources :projects, only: %i(index show create)
    resources :engineers, only: :index
  end
end
