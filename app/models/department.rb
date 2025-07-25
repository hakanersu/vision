class Department < ApplicationRecord
  include TeamScoped

  has_many :users, dependent: :nullify
  validates :name, presence: true, length: { minimum: 3 }
end
