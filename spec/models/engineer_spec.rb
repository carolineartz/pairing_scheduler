# == Schema Information
#
# Table name: engineers
#
#  id           :bigint           not null, primary key
#  display_name :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

require 'rails_helper'

RSpec.describe Engineer, type: :model do
  describe 'associations' do
    it { should have_and_belong_to_many(:projects) }
  end

  describe 'validations' do
    it { should validate_presence_of(:display_name) }
  end

  describe "#pairing" do
    let(:project) { FactoryBot.create(:project, :with_sprints, sprint_count: 3) }
    let(:engineers) do
      FactoryBot.create_list(:engineer, 4).tap { |eng| project.engineers << eng }
      project.engineers
    end

    let(:engineer) { engineers.first! }
    let(:sprint1_partner) { engineers.second! }
    let(:sprint2_partner) { engineers.third! }

    let(:sprint1) { project.sprints.first! }
    let(:sprint2) { project.sprints.second! }
    let(:sprint3) { project.sprints.third! }

    before do
      FactoryBot.create(:pairing, pair: Pair.new(engineer, sprint1_partner), sprint: sprint1)
      FactoryBot.create(:pairing, pair: Pair.new(engineer, sprint2_partner), sprint: sprint2)
    end

    it "returns nil if no pairing exists for the engineer for the given sprint" do
      expect(engineer.pairing(sprint: sprint3)).to be_nil
    end

    it "returns the correct pairing for the given sprint" do
      expect(engineer.pairing(sprint: sprint1).members).to contain_exactly(engineer, sprint1_partner)
      expect(engineer.pairing(sprint: sprint2).members).to contain_exactly(engineer, sprint2_partner)
    end
  end

  describe "#pairings" do
    context "unscoped" do
      it "does" do
      end
    end

    context "scoped to a specific project" do
    end
  end
end
