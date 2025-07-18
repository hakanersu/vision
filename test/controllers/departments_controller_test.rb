require "test_helper"

class DepartmentsControllerTest < ActionDispatch::IntegrationTest
  include Rails.application.routes.url_helpers
  setup do
    @department = departments(:one) # Assuming you have fixtures for departments
    @user = users(:admin_user)
    Current.session = @user.sessions.create!(user_agent: "Test Agent", ip_address: "127.0.0.1")
    cookies.signed[:session_id] = Current.session.id
  end

  test "should get index with pagination" do
    get departments_url
    assert_response :success
    assert_not_nil assigns(:departments)
    assert_equal Department.page(1).per(10).to_a, assigns(:departments).to_a
    assert_equal 1, assigns(:departments).current_page
    assert_not_nil assigns(:departments).total_pages
  end
end