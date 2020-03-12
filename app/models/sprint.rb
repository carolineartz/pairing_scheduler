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

class Sprint < ApplicationRecord
  belongs_to :project

  has_many :pairings

  validates :end_date, :start_date, :project_id, presence: true

  validate :start_date_before_end_date
  validate :within_project_bounds
  validate :no_sprint_overlap


  scope :future, -> { where("start_date > :today", today: Date.current) }
  scope :current, -> { where("start_date <= :today AND end_date >= :today", today: Date.current) }
  scope :past, -> { where("end_date < :today", today: Date.current) }

  #
  # All the project engineers who are members of a pair during this sprint.
  #
  # @return [Array<Engineer>]
  #
  def paired_engineers
    pairings.flat_map(&:members)
  end

  #
  # The engineers working solo during this sprint, if exists. Since a Sprint can exist without Pairings assigned
  # and engineers belong to its Project, we can't make any assumptions about how many engineers should or should
  # not be paired up. In practice, given the scheduler service, once Pairings are created, there will be one
  # solo engineer for projects with an odd number engineer count.
  #
  # @return [Array<Engineer>, nil] should be present for project sprints with an odd number of (working) engineers
  #
  def solo_engineers
    project.engineers - paired_engineers
  end

  private

  def start_date_before_end_date
    return unless start_date.present? && end_date.present?
    errors.add(:start_date, "A Sprint's start date cannot occur after its end date.") unless end_date.after?(start_date)
  end

  def within_project_bounds
    return unless project.present? && start_date.present? && end_date.present?

    if start_date.before?(project.start_date)
      errors.add(:start_date, "Cannot begin before its Project start date.")
    end

    if end_date.after?(project.end_date)
      errors.add(:end_date, "Cannot end after its Project end date.")
    end
  end

  def no_sprint_overlap
    return unless project.present? && start_date.present? && end_date.present?

    other_sprints = project.sprints.where.not(id: id)

    overlapping_msg = "Date cannot overlap with another sprint's dates for the same Project."

    # TODO: Figure out more efficient way to validate this
    other_sprints.each do |other_sprint|
      # +/- 1 day to be start/end day inclusive for triggering an error when checking for overlap
      if start_date.between?(other_sprint.start_date, other_sprint.end_date)
        errors.add(:start_date, overlapping_msg)
      end

      if end_date.between?(other_sprint.start_date, other_sprint.end_date)
        errors.add(:end_date, overlapping_msg)
      end
    end
  end
end
