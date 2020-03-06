class CreateJoinTableEngineersProjects < ActiveRecord::Migration[6.0]
  class Project < ActiveRecord::Base
    has_many :sprints
    has_and_belongs_to_many :engineers
  end

  class Sprint < ActiveRecord::Base
    has_many :pairings
  end

  class Engineer < ActiveRecord::Base
    has_and_belongs_to_many :projects
  end

  def up
    create_join_table :engineers, :projects

    Project.find_each do |project|
      project_engineers = project.sprints.flat_map(&:pairings).flat_map(&:members).uniq
      project.engineers = project_engineers
    end
  end

  def down
    drop_table :engineers_projects
  end
end
