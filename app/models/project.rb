# == Schema Information
#
# Table name: projects
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_projects_on_name  (name)
#

class Project < ApplicationRecord
  has_many :sprints
  has_many :pairings, through: :sprints

  def engineers
    Engineer
      .joins("JOIN pairings ON pairings.member1_id = engineers.id OR pairings.member2_id = engineers.id")
      .merge(pairings)
      .distinct
  end
end
