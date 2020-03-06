class CreatePairings < ActiveRecord::Migration[6.0]
  def change
    create_table :pairings do |t|
      t.references :sprint, null: false, foreign_key: true
      t.bigint :member1_id, null: false, foreign_key: true
      t.bigint :member2_id, null: false, foreign_key: true

      t.timestamps
    end
  end
end
