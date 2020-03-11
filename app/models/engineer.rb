# == Schema Information
#
# Table name: engineers
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Engineer < ApplicationRecord
  has_and_belongs_to_many :projects

  validates :name, presence: true, uniqueness: true

  #
  # An engineer's pairing for a given sprint, if exists
  #
  # @param [Sprint] sprint
  #
  # @return [Pairing, nil]
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
  # All pairings for an engineer, optionally scoped to sprints a given project
  #
  # @param [Project] project to scope results
  #
  # @return [Pairing::ActiveRecord_Relation]
  #
  def pairings(project: nil)
    sprints = project&.sprints.presence || Sprint.all

    Pairing
      .for_sprint(sprints)
      .where(member1_id: id)
      .or(
        Pairing
          .for_sprint(sprints)
          .where(member2_id: id)
      )
  end
end
