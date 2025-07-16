class RemoveUserIdFromTeams < ActiveRecord::Migration[8.0]
  def change
    remove_column :teams, :user_id, :integer
  end
end
