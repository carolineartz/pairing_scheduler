FactoryBot.define do
  factory :engineer do
    name { Faker::Name.unique.first_name }

    trait :with_projects do
      projects { |e| [e.association(:project)] }
    end
  end
end
