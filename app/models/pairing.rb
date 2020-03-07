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
  attr_readonly :member1_id, :member2_id, :sprint_id

  composed_of :pair,
    class_name: "Pair",
    mapping: [%w(member1_id members), %w(member2_id members)],
    constructor: Proc.new { |member1_id, member2_id| Pair.new(Engineer.find(member1_id), Engineer.find(member2_id)) }

  belongs_to :sprint

  validates :member1_id, :member2_id, :sprint_id, presence: true
  validate :project_membership
  validate :one_engineer_membership_per_sprint

  scope :for_sprint, ->(sprint) { where(sprint: sprint) }

  delegate :members, to: :pair

  def self.build_for_pair(pair:, sprint:)
    eng_1, eng_2 = pair.members

    new(sprint: sprint, member1_id: eng_1.id, member2_id: eng_2.id)
  end

  def self.create_for_pair!(pair:, sprint:)
    build_for_pair(pair, sprint).save!
  end

  private

  def project_membership
    return unless member1_id.present? && member2_id.present? && sprint_id.present?

    eng_1, eng_2 = members
    not_on_project_msg = "Engineer has not been added to project."

    unless sprint.project.engineer_ids.include?(eng_1.id)
      errors.add(member1_id == eng_1.id ? :member1_id : :member2_id, not_on_project_msg)
    end

    unless sprint.project.engineer_ids.include?(eng_2.id)
      errors.add(member2_id == eng_2.id ? :member2_id : :member1_id, not_on_project_msg)
    end
  end

  def one_engineer_membership_per_sprint
    return unless member1_id.present? && member2_id.present? && sprint_id.present?

    eng_1, eng_2 = pair.members
    already_paired_msg = "Engineer already paired for sprint."
    if eng_1.pairing(sprint: sprint).present?
      errors.add(member1_id == eng_1.id ? :member1_id : :member2_id, already_paired_msg)
    end

    if eng_2.pairing(sprint: sprint).present?
      errors.add(member2_id == eng_2.id ? :member2_id : :member1_id, already_paired_msg)
    end
  end
end
