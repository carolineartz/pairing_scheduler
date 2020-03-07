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

require 'rails_helper'

RSpec.describe Project, type: :model do
  describe(:associations) do
    it { should have_and_belong_to_many(:engineers) }
    it { should have_many(:sprints).order(:start_date) }
    it { should have_many(:pairings) }
  end
end
