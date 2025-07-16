class Team < ApplicationRecord
  belongs_to :user
  has_many :users
  has_many :departments, dependent: :destroy

  validates :name, presence: true
end
