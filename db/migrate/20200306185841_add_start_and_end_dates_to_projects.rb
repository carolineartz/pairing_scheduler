class AddStartAndEndDatesToProjects < ActiveRecord::Migration[6.0]
  class Project < ActiveRecord::Base
    has_many :sprints
  end

  class Sprint < ActiveRecord::Base
  end

  def up
    add_column(:projects, :start_date, :date)
    add_column(:projects, :end_date, :date)

    Project.find_each do |project|
      first_sprint = project.sprints.order(:start_date).first
      last_sprint = project.sprints.order(:end_date).last

      project.start_date = first_sprint.start_date
      project.end_date = last_sprint.end_date

      project.save!
    end

    change_column_null(:projects, :start_date, false)
    change_column_null(:projects, :end_date, false)
  end

  def down
    remove_column :projects, :start_date
    remove_column :projects, :end_date
  end
end
