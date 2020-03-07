FactoryBot.define do
  factory :engineer do
    display_name { Faker::Name.first_name }

    projects { |e| [e.association(:project)] }
  end
end
