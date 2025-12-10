from sqlalchemy.orm import Session
from scams_backend.schemas.resource.building import BuildingDetail, BuildingListResponse
from scams_backend.models.building import Building


class BuildingService:
    def __init__(self, db_session: Session):
        self.db_session: Session = db_session
        self.buildings = []

    def get_buildings(self):
        self.buildings = self.db_session.query(Building.id, Building.name).all()

    def invoke(self):
        self.get_buildings()
        return BuildingListResponse(
            buildings=[
                BuildingDetail.model_validate(building) for building in self.buildings
            ]
        )
