class CreateDepartments < ActiveRecord::Migration[7.1]
  def change
    create_table :departments do |t|
      t.string :name, null: false
      t.references :team, null: false, foreign_key: { on_delete: :cascade }

      t.timestamps
    end
  end
end