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
    let(:project) { create_project_with_engineers_and_sprints(engineer_count: 4, sprint_count: 3) }

    let(:engineer) { project.engineers.first! }
    let(:sprint1_partner) { project.engineers.second! }
    let(:sprint2_partner) { project.engineers.third! }

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

  def create_project_with_engineers_and_sprints(engineer_count:, sprint_count:)
    next_start_end_end_dates = lambda do |project, prev_sprint = nil|
      if prev_sprint
        { start_date: prev_sprint.end_date + 1.day, end_date: prev_sprint.end_date + 2.days }
      else
        { start_date: project.start_date, end_date: project.start_date + 1.day }
      end
    end

    project = FactoryBot.create(:project, start_date: Date.current, end_date: Date.current + (sprint_count * 2).days)
    FactoryBot.create_list(:engineer, engineer_count).tap { |eng| project.engineers << eng }

    if sprint_count >= 1
      FactoryBot.create(:sprint, project: project, **next_start_end_end_dates.call(project))
    end

    if sprint_count > 1
      2.upto(sprint_count) do
        FactoryBot.create(:sprint, project: project, **next_start_end_end_dates.call(project, Sprint.last))
      end
    end

    project
  end
end
