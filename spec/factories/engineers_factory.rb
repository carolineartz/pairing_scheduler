FactoryBot.define do
  factory :engineer do
    display_name { Faker::Name.first_name }
  end
end
