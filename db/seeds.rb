# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
#
project = FactoryBot.create(:project, :with_sprints, :with_engineers, sprint_count: 4, sprint_days: 4, engineer_count: 5)
scheduler = ProjectSprintPairingScheduler.new(project: project)
scheduler.schedule!
