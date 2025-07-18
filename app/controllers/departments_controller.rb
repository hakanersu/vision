class DepartmentsController < ApplicationController
  before_action :set_department, only: [ :show, :edit, :update, :destroy ]

  def index
    @departments = Department.page(params[:page]).per(10) 
    render inertia: "departments/DepartmentIndex", props: { departments: { data: @departments, current_page: @departments.current_page, total_pages: @departments.total_pages}}
  end

  def show
    render inertia: "departments/Show", props: { department: @department }
  end

  def new
    @department = Department.new
    render inertia: "departments/New", props: { department: @department }
  end

  def edit
    render inertia: "departments/DepartmentEdit", props: { department: @department }
  end

  def create
    @department = Department.new(department_params)

    if @department.save
      redirect_to departments_path, notice: "Department was successfully created."
    else
      render inertia: "departments/New", props: { department: @department, errors: @department.errors.full_messages }
    end
  end

  def update
    if @department.update(department_params)
      redirect_to departments_path, notice: "Department was successfully updated."
    else
      render inertia: "Departments/Edit", props: { department: @department, errors: @department.errors.full_messages }
    end
  end

  def destroy
    @department.destroy
    redirect_to departments_path, notice: "Department was successfully destroyed."
  end

  private

  def set_department
    @department = Department.find(params[:id])
  end

  def department_params
    params.require(:department).permit(:name, :team_id)
  end
end
