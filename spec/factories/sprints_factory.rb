FactoryBot.define do
  factory :sprint do
    project
    start_date { Date.today.beginning_of_week } # monday
    end_date { Date.today.beginning_of_week.advance(days: 4) } #friday
  end
end
