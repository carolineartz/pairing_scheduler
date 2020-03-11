require "rails_helper"

RSpec.describe Api::ProjectsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/api/projects").to route_to("api/projects#index")
    end

    it "routes to #show" do
      expect(:get => "/api/projects/1").to route_to("api/projects#show", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/api/projects").to route_to("api/projects#create")
    end
  end
end
