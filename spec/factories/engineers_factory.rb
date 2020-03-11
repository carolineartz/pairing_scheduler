FactoryBot.define do
  factory :engineer do
    name { Faker::Name.unique.first_name }

    projects { |e| [e.association(:project)] }
  end
end
