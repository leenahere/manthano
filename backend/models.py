from config import db, ma

class RobotCode(db.Model):
    __tablename__ = 'robotcode'
    robot_id = db.Column(db.Integer, primary_key=True)
    robot = db.Column(db.String(32), index=True)
    code = db.Column(db.String(32))

class RobotCodeSchema(ma.ModelSchema):
    class Meta:
        model = RobotCode
        sqla_session = db.session  
