FactoryBot.define do
  factory :pairing do
    sprint

    transient do
      pair { Pair.new(*FactoryBot.create_pair(:engineer)) }
    end

    initialize_with { Pairing.build_for_pair(pair: pair, sprint: sprint) }
  end
end
