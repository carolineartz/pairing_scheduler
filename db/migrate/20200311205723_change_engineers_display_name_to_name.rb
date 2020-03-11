class ChangeEngineersDisplayNameToName < ActiveRecord::Migration[6.0]
  def change
    rename_column :engineers, :display_name, :name
  end
end
