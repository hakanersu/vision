module BelongsToTeam
  extend ActiveSupport::Concern

  included do
    belongs_to :team

    before_validation :set_team, on: :create

    scope :by_team, ->(team) { where(team: team) }
  end

  private

  def set_team
    self.team = Current.user.current_team if team.blank? && Current.user
  end
end
