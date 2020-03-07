# == Schema Information
#
# Table name: pairings
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  member1_id :bigint           not null
#  member2_id :bigint           not null
#  sprint_id  :bigint           not null
#
# Indexes
#
#  index_pairings_on_sprint_id  (sprint_id)
#
# Foreign Keys
#
#  fk_rails_...  (sprint_id => sprints.id)
#

require 'rails_helper'

RSpec.describe Pairing, type: :model do
  it { should have_readonly_attribute(:member1_id) }
  it { should have_readonly_attribute(:member2_id) }
  it { should have_readonly_attribute(:sprint_id) }

  describe 'associations' do
    it { should belong_to(:sprint) }
  end

  describe 'validations' do
    context 'required attributes' do
      it { should validate_presence_of(:member1_id) }
      it { should validate_presence_of(:member2_id) }
      it { should validate_presence_of(:sprint_id) }
    end

    context 'membership' do
      let!(:project) do
        FactoryBot.create(
          :project,
          :with_sprints,
          :with_engineers,
          sprint_count: 3,
          engineer_count: 4
        )
      end

      it 'only allows pairings with project engineers' do
        non_project_engineer = FactoryBot.create(:engineer)
        expect(non_project_engineer.project_ids).not_to include(project.id)

        sprint = project.sprints.first!
        pair = Pair.new(project.engineers.first!, non_project_engineer)
        pairing = FactoryBot.build(:pairing, sprint: sprint, pair: pair)

        expect(pairing).not_to be_valid
        error_messages = Hashie::Mash.new(pairing.errors.messages)
        expect(error_messages.values.flatten).to include(/Engineer has not been added to project/)
      end

      it 'does not allow the same engineer to be part of multiple pairs for the same sprint', focus: true do
        sprint = project.sprints.first!
        eng_with_multiple_pairs = project.engineers.first!

        pair_1 = Pair.new(eng_with_multiple_pairs, project.engineers.second!)
        pair_2 = Pair.new(eng_with_multiple_pairs, project.engineers.third!)

        existing_pairing = FactoryBot.create(:pairing, sprint: sprint, pair: pair_1)
        pairing = FactoryBot.build(:pairing, sprint: sprint, pair: pair_2)

        expect(pairing).not_to be_valid
        error_messages = Hashie::Mash.new(pairing.errors.messages)
        expect(error_messages.values.flatten).to include(/Engineer already paired for sprint/)
      end

      it 'does allow engineers to have multiple pairs over different sprints on the same project' do
        sprint_1 = project.sprints.first!
        sprint_2 = project.sprints.second!
        eng_with_multiple_pairs = project.engineers.first!

        pair_1 = Pair.new(eng_with_multiple_pairs, project.engineers.second!)
        pair_2 = Pair.new(eng_with_multiple_pairs, project.engineers.third!)

        pairing_sprint_1 = FactoryBot.create(:pairing, sprint: sprint_1, pair: pair_1)
        pairing_sprint_2 = FactoryBot.build(:pairing, sprint: sprint_2, pair: pair_2)

        expect(pairing_sprint_2).to be_valid
      end

      it 'does allow engineers to have the same partner over different sprints on the same project' do
        sprint_1 = project.sprints.first!
        sprint_2 = project.sprints.second!

        eng_1 = project.engineers.first!
        eng_2 = project.engineers.first!

        pairing_sprint_1 = FactoryBot.create(:pairing, sprint: sprint_1, pair: Pair.new(eng_1, eng_2))
        pairing_sprint_2 = FactoryBot.build(:pairing, sprint: sprint_2, pair: Pair.new(eng_1, eng_2))

        expect(pairing_sprint_2).to be_valid
      end
    end
  end

  describe 'delegations' do
    it { should delegate_method(:members).to(:pair) }
  end

  describe 'aggregations' do
    describe '#pair' do

    end
  end

  describe 'scopes' do
    describe '.for_sprint' do

    end
  end

  describe '.build_for_pair' do

  end

  describe '.create_for_pair!' do

  end
end
