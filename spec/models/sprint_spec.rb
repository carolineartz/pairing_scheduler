# == Schema Information
#
# Table name: sprints
#
#  id         :bigint           not null, primary key
#  end_date   :date             not null
#  start_date :date             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  project_id :bigint           not null
#
# Indexes
#
#  index_sprints_on_project_id  (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#

require 'rails_helper'

RSpec.describe Sprint, type: :model do
  describe 'associations' do
    it { should belong_to(:project) }
    it { should have_many(:pairings) }
  end

  describe 'validations' do
    context "required attributes" do
      subject(:sprint) { FactoryBot.build(:sprint, start_date: nil, end_date: nil, project: nil) }

      it { should validate_presence_of(:end_date) }
      it { should validate_presence_of(:start_date) }
      it { should validate_presence_of(:project_id) }
    end

    context "scheduling" do
      it "should not allow a start_date before its end_date" do
        sprint = FactoryBot.build(:sprint, start_date: Date.current, end_date: Date.yesterday)

        sprint.valid?
        error_messages = Hashie::Mash.new(sprint.errors.messages)

        expect(error_messages.start_date).to contain_exactly(/start date cannot occur after its end date/)
      end

      it "should not allow scheduling outside its project's timeline" do
        project = FactoryBot.build(:project, start_date: Date.current, end_date: Date.tomorrow)
        sprint_before = FactoryBot.build(:sprint, project: project, start_date: Date.yesterday, end_date: Date.current)
        sprint_after = FactoryBot.build(:sprint, project: project, start_date: Date.tomorrow, end_date: Date.tomorrow + 1.day)

        sprint_before.valid?
        error_messages = Hashie::Mash.new(sprint_before.errors.messages)
        expect(error_messages.start_date).to contain_exactly(/Cannot begin before its Project start date/)

        sprint_after.valid?
        error_messages = Hashie::Mash.new(sprint_after.errors.messages)
        expect(error_messages.end_date).to contain_exactly(/Cannot end after its Project end date/)
      end

      it "should not allow sprints to overlap" do
        project = FactoryBot.create(:project, start_date: Date.current, end_date: Date.current + 5.days)
        scheduled_sprint = FactoryBot.create(:sprint, project: project, start_date: project.start_date + 1.day, end_date: project.start_date + 3.days)
        sprint_starts_during = FactoryBot.build(:sprint, project: project, start_date: scheduled_sprint.start_date + 1.day, end_date: scheduled_sprint.end_date + 1.day)
        sprint_ends_during = FactoryBot.build(:sprint, project: project, start_date: scheduled_sprint.start_date - 1.day, end_date: scheduled_sprint.end_date - 1.day)

        sprint_starts_during.valid?
        error_messages = Hashie::Mash.new(sprint_starts_during.errors.messages)
        expect(error_messages.start_date).to contain_exactly(/Date cannot overlap with another sprint/)

        sprint_ends_during.valid?
        error_messages = Hashie::Mash.new(sprint_ends_during.errors.messages)
        expect(error_messages.end_date).to contain_exactly(/Date cannot overlap with another sprint/)
      end
    end
  end

  let(:project) { FactoryBot.create(:project, :with_sprints, sprint_count: 1) }
  let(:sprint) { project.sprints.first }

  let(:engineers) do
    FactoryBot.create_list(:engineer, 3).tap { |eng| project.engineers << eng }
    project.engineers
  end
  let!(:eng_1) { engineers.first! }
  let!(:eng_2) { engineers.second! }
  let!(:eng_3) { engineers.third! }

  describe "#paired_engineers" do
    before do
      pair = Pair.new(eng_1, eng_2)
      FactoryBot.create(:pairing, sprint: sprint, pair: pair)
    end

    it "returns only the project engineers paired during the sprint" do
      expect(sprint.paired_engineers).to contain_exactly(eng_1, eng_2)
    end
  end

  describe "#solo_engineer" do
    context "with an odd number of engineers" do
      before do
        pair = Pair.new(eng_1, eng_2)
        FactoryBot.create(:pairing, sprint: sprint, pair: pair)
      end

      it "returns the engineer not part of a pair" do
         expect(project.engineers.count).to be_odd
         expect(sprint.solo_engineer).to eq(eng_3)
      end
    end

    context "with an even number of engineers" do
      before do
        eng_4 = FactoryBot.create(:engineer)
        project.engineers << eng_4

        pair1 = Pair.new(eng_1, eng_2)
        pair2 = Pair.new(eng_3, eng_4)
        FactoryBot.create(:pairing, sprint: sprint, pair: pair1)
        FactoryBot.create(:pairing, sprint: sprint, pair: pair2)
      end

      it "returns nil" do
        expect(project.engineers.count).to be_even
        expect(sprint.solo_engineer).to be_nil
      end
    end
  end
end
