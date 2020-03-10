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
    let(:project) { FactoryBot.create(:project, :with_sprints, :with_engineers, sprint_count: 3, engineer_count: 4) }
    let(:engineers) { project.engineers }

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
    let(:engineers) { FactoryBot.create_list(:engineer, 4) }
    let(:project1) { FactoryBot.create(:project, :with_sprints, :with_engineers, members: engineers, sprint_count: 3) }
    let(:project2) { FactoryBot.create(:project, :with_sprints, :with_engineers, members: engineers, sprint_count: 3, start_date: project1.end_date + 2.days) }

    let(:engineer) { engineers[0] }
    let(:proj1_sprint1_partner) { engineers[1] }
    let(:proj1_sprint2_partner) { engineers[2] }
    let(:proj2_sprint1_partner) { engineers[3] }
    let(:proj2_sprint2_partner) { engineers[2] }

    let!(:pairing1_proj1) { FactoryBot.create(:pairing, pair: Pair.new(engineer, proj1_sprint1_partner), sprint: project1.sprints.first!) }
    let!(:pairing2_proj1) { FactoryBot.create(:pairing, pair: Pair.new(engineer, proj1_sprint2_partner), sprint: project1.sprints.second!) }
    let!(:pairing3_proj2) { FactoryBot.create(:pairing, pair: Pair.new(engineer, proj2_sprint1_partner), sprint: project2.sprints.first!) }
    let!(:pairing4_proj2) { FactoryBot.create(:pairing, pair: Pair.new(engineer, proj2_sprint2_partner), sprint: project2.sprints.second!) }
    # a pairing that doesn't include the subject engineer
    let!(:other_pairing) { FactoryBot.create(:pairing, pair: Pair.new(proj2_sprint1_partner, proj1_sprint1_partner), sprint: project2.sprints.second!) }

    context "unscoped" do
      it "returns all of an engineer's pairings across all projects" do
        expect(engineer.pairings).to contain_exactly(
          pairing1_proj1,
          pairing2_proj1,
          pairing3_proj2,
          pairing4_proj2
        )
      end
    end

    context "scoped to a specific project" do
      it "returns all of an engineer's pairings for a specific project" do
        expect(engineer.pairings(project: project2)).to contain_exactly(
          pairing3_proj2,
          pairing4_proj2
        )
      end
    end
  end
end
