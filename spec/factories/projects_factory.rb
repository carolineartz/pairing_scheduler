FactoryBot.define do
  factory :project do
    sequence(:name) { |n| "Project-#{n}" }

    start_date { Date.current }
    end_date { start_date + 10.days }

    trait :with_sprints do
      transient do
        sprint_count { 4 }

        after(:create) do |project, evaluator|
          min_end_date = project.start_date + (evaluator.sprint_count * 2).days

          if project.end_date.before?(min_end_date)
            project.update!(end_date: min_end_date)
          end

          next_start_end_end_dates = lambda do |project, prev_sprint = nil|
            if prev_sprint
              { start_date: prev_sprint.end_date + 1.day, end_date: prev_sprint.end_date + 2.days }
            else
              { start_date: project.start_date, end_date: project.start_date + 1.day }
            end
          end

          if evaluator.sprint_count >= 1
            FactoryBot.create(:sprint, project: project, **next_start_end_end_dates.call(project))
          end

          if evaluator.sprint_count > 1
            2.upto(evaluator.sprint_count) do
              FactoryBot.create(:sprint, project: project, **next_start_end_end_dates.call(project, Sprint.last))
            end
          end
        end
      end
    end

    trait :with_engineers do
      transient do
        engineer_count { 4 }
        members { FactoryBot.create_list(:engineer, engineer_count) }

        after(:create) do |project, evaluator|
          evaluator.members.to_a.each do |eng|
            project.engineers << eng
          end
        end
      end
    end
  end
end
