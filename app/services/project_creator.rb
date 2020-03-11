class ProjectCreator
  def initialize(
    start_date:,
    sprint_count:,
    end_date: "",
    name: "",
    sprint_days: 5,
    engineer_names: []
  )
    # binding.pry
    @start_date = Date.parse(start_date)
    @end_date = end_date.present? ? Date.parse(end_date) : @start_date
    @sprint_count = sprint_count
    @name = name.presence || "Project - #{@start_date.to_s(:long)}"
    @sprint_days = sprint_days
    @engineer_names = engineer_names
  end

  def create!
    Project.transaction do
      project = create_project!

      add_engineers!(project)
      schedule_sprints!(project)
      schedule_pairings!(project)

      project
    end
  end

  private

  def create_project!
    Project.create!(
      start_date: @start_date,
      end_date: @end_date,
      name: title
    )
  end

  def add_engineers!(project)
    engineers = @engineer_names.map do |name|
      Engineer.find_or_create_by!(name: name)
    end

    project.engineers = engineers
  end

  def schedule_sprints!(project)
    sprint_scheduler = ProjectSprintScheduler.new(project: project)

    # TODO: make add_sprints -> add_sprints!
    sprint_scheduler.add_sprints(
      sprint_count: @sprint_count,
      sprint_days: @sprint_days
    )
  end

  def schedule_pairings!(project)
    pairing_scheduler = ProjectSprintPairingScheduler.new(project: project)

    pairing_scheduler.schedule!
  end

  # FIXME: Fragile and could be greatly improved with some criteria for sprint naming or distinction.
  def title
    same_generated_name = Project.where("name LIKE '#{@name}%'")
    return @name unless same_generated_name.present?

    "#{@name} - #{same_generated_name.count + 1}"
  end
end