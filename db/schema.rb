# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_03_05_230412) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "engineers", force: :cascade do |t|
    t.string "display_name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "pairings", force: :cascade do |t|
    t.bigint "sprint_id", null: false
    t.bigint "member1_id", null: false
    t.bigint "member2_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["sprint_id"], name: "index_pairings_on_sprint_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_projects_on_name"
  end

  create_table "sprints", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.date "start_date", null: false
    t.date "end_date", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_sprints_on_project_id"
  end

  add_foreign_key "pairings", "sprints"
  add_foreign_key "sprints", "projects"
end
