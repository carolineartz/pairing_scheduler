class CreateEngineers < ActiveRecord::Migration[6.0]
  def change
    create_table :engineers do |t|
      t.string :display_name, null: false

      t.timestamps
    end
  end
end
