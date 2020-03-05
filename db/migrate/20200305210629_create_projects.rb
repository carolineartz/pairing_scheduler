class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :name, null: false, unique: true, index: true

      t.timestamps
    end
  end
end
