require 'rails_helper'

RSpec.describe "Engineers", type: :request do
  describe "GET /engineers" do
    it "works! (now write some real specs)" do
      get api_engineers_path
      expect(response).to have_http_status(200)
    end
  end
end
