FactoryBot.define do
  factory :project do
    sequence(:name) { |n| "Project-#{n}" }

    start_date { Date.current.beginning_of_week }
    end_date { Date.current.beginning_of_week + 4.days }
  end
end
