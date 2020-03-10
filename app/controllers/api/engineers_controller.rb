class Api::EngineersController < ApplicationController
  # GET /engineers
  def index
    @engineers = Engineer.all

    render json: @engineers
  end
end
