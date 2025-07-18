module TeamScoped
  extend ActiveSupport::Concern

  included do
    belongs_to :team
    validates :team_id, presence: true

    before_validation :set_team, on: :create

    default_scope { where(team_id: Current.user.current_team.id) if Current.user&.current_team }
  end

  private

  def set_team
    self.team = Current.user.current_team
  end
end
