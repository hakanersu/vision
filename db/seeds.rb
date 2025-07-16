# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   %>

User.destroy_all
Team.destroy_all

admin_user = User.create!(
  email_address: "admin@admin.com",
  password: "qasd745im",
  password_confirmation: "qasd745im"
)

gusto_team = Team.create!(
  name: "Gusto",
  personal_team: true,
  user: admin_user
)

admin_user.update!(team: gusto_team)
