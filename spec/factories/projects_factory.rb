FactoryBot.define do
  factory :project do
    sequence(:name) { |n| "Project-#{n}" }

    start_date { Date.current }
    end_date { Date.current + 10.days }
  end
end
