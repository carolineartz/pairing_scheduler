FactoryBot.define do
  factory :sprint do
    project { FactoryBot.create(:project) }

    start_date { project.start_date }
    end_date { project.end_date }
  end
end