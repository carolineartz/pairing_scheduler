FactoryBot.define do
  factory :project do
    start_date { Date.current.next_occurring(:monday) }
    end_date { start_date + 6.days }

    sequence(:name) { |n| "Project-#{start_date.to_s(:long)}#{n > 0 ? ' - ' + n.to_s : ''}" }

    trait :with_sprints do
      transient do
        sprint_count { 4 }
        sprint_days { 2 }

        before(:create) do |project, evaluator|
          min_end_date = project.start_date + (evaluator.sprint_count * evaluator.sprint_days).days

          if project.end_date.before?(min_end_date)
            project.update!(end_date: min_end_date)
          end

          next_start_end_end_dates = lambda do |project, prev_sprint = nil|
            start_date = if prev_sprint
                            prev_sprint.end_date.next_occurring(:monday)
                          else
                            project.start_date.monday? ? project.start_date : project.start_date.next_occurring(:monday)
                          end

            end_date = start_date + evaluator.sprint_days.days
            project.end_date = end_date
            { start_date: start_date, end_date: end_date }
          end

          if evaluator.sprint_count >= 1
            sprint =  FactoryBot.build(:sprint, project: project, **next_start_end_end_dates.call(project))
            project.end_date = sprint.end_date
            project.save!
            sprint.save!
          end

          if evaluator.sprint_count > 1
            2.upto(evaluator.sprint_count) do
              sprint =  FactoryBot.build(:sprint, project: project, **next_start_end_end_dates.call(project, Sprint.last))
              project.end_date = sprint.end_date
              project.save!
              sprint.save!
            end
          end
        end
      end
    end

    trait :with_engineers do
      transient do
        engineer_count { 4 }
        members { FactoryBot.build_list(:engineer, engineer_count) }

        before(:create) do |project, evaluator|
          project.engineers << evaluator.members.to_a
        end
      end
    end
  end
end
