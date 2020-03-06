# == Schema Information
#
# Table name: engineers
#
#  id           :bigint           not null, primary key
#  display_name :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Engineer < ApplicationRecord
  has_and_belongs_to_many :projects

  validates :display_name, presence: true, uniqueness: true


  #
  # An engineer's pairing for a given sprint, if exists
  #
  # @param [Sprint] sprint
  #
  # @return [Pairing,nil]
  #
  def pairing(sprint:)
    Pairing
      .for_sprint(sprint)
      .where(member1_id: id)
      .or(
        Pairing
        .for_sprint(sprint)
        .where(member2_id: id)
      )
      .first
  end

  #
  # All pairings for an engineer, optionally scoped to a given project
  #
  # @param [Project] project to scope results
  #
  # @return [ActiveRecord::Relation<Pairing>]
  #
  def pairings(project: nil)
    Pairing
      .joins(sprint: :project)
      .where(member1_id: id, sprint: { project: project || Project.all.ids })
      .or(
        Pairing
        .joins(sprint: :project)
        .where(member2_id: id, sprint: { project: project || Project.all.ids })
      )
  end
end
