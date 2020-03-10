RSpec.describe ProjectSprintPairingScheduler do
  describe "#schedule!" do
    let(:project) {
      FactoryBot.create(
        :project,
        :with_sprints,
        :with_engineers,
        sprint_count: 4,
        engineer_count: engineer_count
      )
    }

    let(:scheduler) { described_class.new(project: project) }

    context "For a project that has already started" do
      let(:engineer_count) { 6 }

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

    context "for an even number project engineers" do

    end

    context "For an odd number project engineers" do
      it "rotates the unpaired engineer for an odd number team" do

      end
    end
  end
end