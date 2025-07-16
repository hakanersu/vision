class CreateTeams < ActiveRecord::Migration[7.1]
  def change
    create_table :teams do |t|
      t.integer :user_id
      t.string :name, null: false
      t.boolean :personal_team, null: false
      t.boolean :active, null: false, default: true
      t.text :ip_list
      t.boolean :feature_27001, null: false, default: true
      t.boolean :feature_27701, null: false, default: false
      t.boolean :feature_9001, null: false, default: false

      t.timestamps
    end
  end
end
