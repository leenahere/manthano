from flask import make_response, abort
from config import db
from models import RobotCode, RobotCodeSchema

# Create a handler for our read (GET) people
def read():
    # Create the list of people from our data
    robots = RobotCode.query.order_by(RobotCode.robot).all()

    # Serialize the data for the response
    robotcode_schema = RobotCodeSchema(many=True)
    data = robotcode_schema.dump(robots).data
    return data


def read_one(robot_id):
    # Get the robotcode requested
    robot = RobotCode.query.filter(RobotCode.robot_id == robot_id).one_or_none()

    # Did we find a robotcode?
    if robot is not None:

        # Serialize the data for the response
        robotcode_schema = RobotCodeSchema()
        data = robotcode_schema.dump(robot).data
        return data

    # otherwise, nope, not found
    else:
        abort(
            404, "robot {robot} not found".format(robot_id=robot_id)
        )


def create(robotcode):
    robot = robotcode.get("robot", None)
    code = robotcode.get("code", None)

    existing_robotcode = (
        RobotCode.query.filter(RobotCode.robot == robot)
        .one_or_none()
    )

    if existing_robotcode is None:

        # Create a robotcode instance using the schema and the passed in robotcode
        schema = RobotCodeSchema()
        new_robot = schema.load(robotcode, session=db.session).data

        # Add the robotcode to the database
        db.session.add(new_robot)
        db.session.commit()

        # Serialize and return the newly created robotcode in the response
        data = schema.dump(new_robot).data

        return data, 201

    # Otherwise, they exist, that's an error
    else:
        abort(
            406,
            "robot {robot} already exists".format(robot=robot),
        )


def update(robot_id, robotcode):
    # Get the robotcode requested from the db into session
    update_robotcode = RobotCode.query.filter(
        RobotCode.robot_id == robot_id
    ).one_or_none()

    # Try to find an existing robotcode with the same name as the update
    robot = robotcode.get("robot")
    code = robotcode.get("code")

    existing_robotcode = (
        RobotCode.query.filter(RobotCode.robot == robot)
        .one_or_none()
    )

    # Are we trying to find a robotcode that does not exist?
    if update_robotcode is None:
        abort(
            404,
            "RobotCode not found for Id: {robot_id}".format(robot_id=robot_id),
        )

    # Would our update create a duplicate of another robotcode already existing?
    elif (
        existing_robotcode is not None and existing_robotcode.robot_id != robot_id
    ):
        abort(
            409,
            "RobotCode {robot} {code} exists already".format(
                robot=robot, code=code
            ),
        )

    # Otherwise go ahead and update!
    else:

        # turn the passed in robotcode into a db object
        schema = RobotCodeSchema()
        update = schema.load(robotcode, session=db.session).data

        # Set the id to the robotcode we want to update
        update.robot_id = update_robotcode.robot_id

        # merge the new object into the old and commit it to the db
        db.session.merge(update)
        db.session.commit()

        # return updated robotcode in the response
        data = schema.dump(update_robotcode).data

        return data, 200
