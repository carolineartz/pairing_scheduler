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

class Pairing < ApplicationRecord
  composed_of :pair,
    class_name: "Pair",
    mapping: [%w(member1_id members), %w(member2_id members)],
    constructor: Proc.new { |member1_id, member2_id| Pair.new(Engineer.find(member1_id), Engineer.find(member2_id)) }

  belongs_to :sprint

  validates :member1_id, :member2_id, :sprint_id, presence: true
  validate :one_engineer_pair_membership_per_sprint

  scope :for_sprint, ->(sprint) { sprint ? where(sprint: sprint) : self.all }

  def self.build_for_pair(pair:, sprint:)
    eng1, eng2 = pair.members

    new(sprint: sprint, member1_id: eng1.id, member2_id: eng2.id)
  end

  def self.create_for_pair!(pair:, sprint:)
    build_for_pair(pair, sprint).save!
  end

  private

  def one_engineer_pair_membership_per_sprint
    eng1, eng2 = pair.members
    already_paired_msg = "Engineer already paired for sprint."

    if eng1.pairings(sprint).present?
      errors.add(member1_id == eng1.id ? :member1_id : :member2_id, already_paired_msg )
    end

    if eng2.pairings(sprint).present?
      errors.add(member2_id == eng2.id ? :member2_id : :member1_id, already_paired_msg )
    end
  end
end
