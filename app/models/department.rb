class Department < ApplicationRecord
  include TeamScoped

  validates :name, presence: true, length: { minimum: 3 }
end
