# == Schema Information
#
# Table name: projects
#
#  id         :bigint           not null, primary key
#  end_date   :date             not null
#  name       :string           not null
#  start_date :date             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_projects_on_name  (name)
#

class Project < ApplicationRecord
  has_and_belongs_to_many :engineers

  has_many :sprints, -> { order(:start_date) }
  has_many :pairings, through: :sprints
end
