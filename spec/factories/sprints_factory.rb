FactoryBot.define do
  factory :sprint do
    project { FactoryBot.create(:project) }

    start_date { project.start_date }
    end_date { project.end_date }

    after(:build) do |sprint, evaluator|
      if evaluator.project
        # why is this being weird and I have to do these associations manually?
        evaluator.project.save! if evaluator.project.new_record?
        sprint.project = evaluator.project
        # sprint.project = evaluator.project
        # evaluator.project.sprints << sprint
        ap sprint
        ap evaluator.project
      end

      # evaluator.project.sprints << sprint
    end
  end
end
