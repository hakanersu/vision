class User < ApplicationRecord
  has_secure_password
  belongs_to :team, optional: true
  has_many :sessions, dependent: :destroy

  def current_team
    teams.first
  end

  normalizes :email_address, with: ->(e) { e.strip.downcase }
end
