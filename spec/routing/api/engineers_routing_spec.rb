require "rails_helper"

RSpec.describe Api::EngineersController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/api/engineers").to route_to("api/engineers#index")
    end
  end
end
