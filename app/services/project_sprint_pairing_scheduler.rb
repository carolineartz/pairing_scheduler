class ProjectSprintPairingScheduler
  attr_reader :project

  def initialize(project:)
    @project = project
  end

  def schedule
    eligible_sprints = project.sprints.future.or(project.sprints.current).to_a

    engs = project.engineers.to_a
    engineer_count = engs.size
    pairs_per_week = engineer_count / 2

    reset = false
    eligible_sprints.each_with_index do |sprint, index|
      pairs_per_week.times do |match_index|
        Pairing.create_for_pair!(pair: Pair.new(*[engs[match_index], engs.reverse[match_index]]), sprint: sprint)
      end

      if reset
        engs = project.engineers.to_a
        reset = false
      elsif engineer_count.odd? && (index + 2) % engineer_count == 0
        engs = engs[1..-1]
        reset = true
      else
        engs = [engs[0]] + engs[1..-1].rotate(-1)
      end
    end
  end
end