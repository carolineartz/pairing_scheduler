require 'rails_helper'

RSpec.describe ProjectSprintPairingScheduler do
  describe "#schedule!" do
    let(:project) {
      FactoryBot.create(
        :project,
        :with_sprints,
        :with_engineers,
        sprint_count: sprint_count,
        engineer_count: engineer_count
      )
    }

    let(:scheduler) { described_class.new(project: project) }

    shared_examples "rotate repeated pairings in a round-robin fashion" do
      # the following examples all assume some repeats are necessary
      before { expect(num_weeks_of_unique_pairs).to be < project.sprints.count }

      it "exhausts all unique pairings before necessary repeats" do
        sprints_with_unique_pairs = project.sprints.first(num_weeks_of_unique_pairs)
        unqiue_pairings = sprints_with_unique_pairs.flat_map(&:pairings).map(&:pair)
        possible_pairs = project.engineers.to_a.combination(2).map { |engs| Pair.new(*engs) }

        expect(possible_pairs).to match_array(unqiue_pairings)
      end

      it "starts at the beginning when repeating pairs" do
        first_sprint = project.sprints.first!
        first_repeated_pair_sprint = project.sprints.offset(num_weeks_of_unique_pairs).first!

        expect(first_sprint.pairings.map(&:pair)).to match_array(first_repeated_pair_sprint.pairings.map(&:pair))
      end
    end

    shared_examples "even number of engineers" do
      it "does not have any sprints with solo engineers" do
        expect(project.pairings).to be_present  # make sure the scheduler has been called so as to not get false positive
        expect(project.sprints.flat_map(&:solo_engineers).compact).to be_empty
      end
    end

    shared_examples "odd number of engineers" do
      it "has one solo engineer for each sprint" do
        expect(project.pairings).to be_present # make sure the scheduler has been called so as to not get false positive
        expect(project.sprints.flat_map(&:solo_engineers).compact.count).to eq project.sprints.count
      end
    end

    shared_examples "more unique pairs than sprint pairings" do
      it "has unique pairs across all sprints" do
        expect(project.pairings).to be_present
        expect(project.pairings.map(&:pair).uniq.length).to eq(project.pairings.length)
      end
    end

    context "For a project with more sprints than possible pairings" do
      # 4 engineers => 3 weeks of unique pairings
      #
      #   6 pair combinations
      #   2 pairings / week
      let(:num_unique_pair_combinations) { [*1..engineer_count].combination(2).to_a.length }
      let(:pairings_per_week) { engineer_count / 2 }
      let(:num_weeks_of_unique_pairs) { num_unique_pair_combinations / pairings_per_week }

      context "and an even number of engineers" do
        let(:sprint_count) { 4 }
        let(:engineer_count) { 4 }

        before { scheduler.schedule! }

        include_examples "rotate repeated pairings in a round-robin fashion"
        include_examples "even number of engineers"
      end

      context "and an odd number of engineers" do
        let(:sprint_count) { 5 }
        let(:engineer_count) { 3 }

        before { scheduler.schedule! }

        include_examples "rotate repeated pairings in a round-robin fashion"
        include_examples "odd number of engineers"

        it "starts repeating solo engineers after everyone has taken a turn" do
          first_set_of_solos = project.sprints.first(num_weeks_of_unique_pairs).flat_map(&:solo_engineers)
          # expect(first_set_of_solos.length).to eq(project.engineers.length)
          expect(first_set_of_solos).to match_array(project.engineers)
          expect(project.sprints.offset(num_weeks_of_unique_pairs).first.solo_engineers)
            .to match_array(project.sprints.first.solo_engineers)
        end
      end
    end

    context "For a project with less sprints than possible pairings" do
      context "and an odd number of engineers" do
        let(:sprint_count) { 3 }
        let(:engineer_count) { 5 }

        before { scheduler.schedule! }

        include_examples "odd number of engineers"
        include_examples "more unique pairs than sprint pairings"
      end

      context "and an even number of engineers" do
        let(:sprint_count) { 3 }
        let(:engineer_count) { 6 }

        before { scheduler.schedule! }

        include_examples "even number of engineers"
        include_examples "more unique pairs than sprint pairings"

        it "has a different solo engineer each sprint" do
          expect(project.pairings).to be_present
          expect(project.pairings.map(&:pair).uniq.length).to eq(project.pairings.length)
        end
      end
    end

    context "For a project that has already started" do
      let(:engineer_count) { 4 }
      let(:sprint_count) { 2 }

      it "does not update pairs for that have already ended" do
        first_sprint = project.sprints.first!
        eng1 = project.engineers.third!
        eng2 = project.engineers.fourth!

        expect(project.pairings).to be_empty

        # create a pairing for the first sprint
        FactoryBot.create(:pairing, pair: Pair.new(eng1, eng2), sprint: first_sprint)

        # travel to a time after the first sprint has ended
        travel_to(first_sprint.end_date + 1.day) do
          scheduler.schedule!
          # confirm that the scheduler did schedule something
          expect(project.pairings.length).to be > 1
          # confirm that the scheduler did not add any pairings to the first sprint
          expect(first_sprint.pairings.length).to eq 1
        end
      end
    end
  end
end