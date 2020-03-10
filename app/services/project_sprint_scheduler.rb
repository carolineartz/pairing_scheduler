class ProjectSprintScheduler
  attr_reader :project

  def initialize(project:)
    @project = project
  end

  # TODO: should be a bang name
  def add_sprints(sprint_count:, sprint_days: 5)
    return unless sprint_count > 0

    sprints = project.sprints.order(:start_date)
    last_sprint = sprints.last

    1.upto(sprint_count) do
      starting = last_sprint ? last_sprint.end_date.next_weekday : project.start_date
      ending = starting

      begin
        day_counter = sprint_days

        while day_counter > 1
          ending = ending.next_weekday
          day_counter -= 1
        end

        last_sprint = Sprint.new(
          project: project,
          start_date: starting,
          end_date: ending
        )

        last_sprint.save!
      rescue ActiveRecord::RecordInvalid => e
        if last_sprint.errors[:end_date].present? && last_sprint.errors[:end_date].include?("Cannot end after its Project end date.")
          project.end_date = last_sprint.end_date
          project.save!
          project.reload
          last_sprint.save!
        else
          raise e
        end
      end
    end

    true
  end

  private

  def engineers
    @engineers ||= project.engineers
  end
end