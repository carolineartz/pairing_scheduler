class Api::ProjectsController < ApplicationController
  before_action :set_project, only: %i(show)

  # GET /projects
  def index
    projects = Project.all

    render json: serialize_with_all_engineers(projects)
  end

  # GET /projects/1
  def show
    render json: serialize_with_associated(@project)
  end

  # POST /projects
  def create
    @project = ProjectCreator.new(
      start_date: create_project_params[:start_date],
      sprint_count: create_project_params[:sprint_count],
      engineer_names: create_project_params[:engineer_names]
    ).create!

    render json: serialize_with_associated(@project), status: :created
  rescue => e # TODO: error handling
    Rails.logger.error("ERROR!!! #{e.to_s}")
    render json: { errors: e.to_s }, status: :unprocessable_entity
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def create_project_params
    @create_project_params ||= JSON.parse(request.body.read).with_indifferent_access
  end

  def serialize_with_all_engineers(projects)
    {
      projects: projects.as_json,
      engineers: Engineer.all.as_json
    }
  end

  def serialize_with_associated(projects)
    projects.as_json(
      except: %i(created_at updated_at),
      include: {
        sprints: {
          except: %i(created_at updated_at project_id),
          methods: :solo_engineers,
          include: {
            pairings: {
              except: %i(created_at updated_at member1_id member2_id sprint_id),
              methods: :members
            }
          }
        },
        engineers: {
          except: %i(created_at updated_at),
        }
      }
    )
  end
end