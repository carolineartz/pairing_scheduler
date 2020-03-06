FactoryBot.define do
  factory :project do
    sequence(:name) { |n| "Sprint-#{n}" }
  end
end
