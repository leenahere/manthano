from flask import make_response, abort
from config import db
from models import Data, DataSchema


def read_relevant(session_id):
    print("I am reading data from db.")
    data = Data.query.filter(Data.session_id == session_id).all()
    if data is not None:
        print(data)
        data_schema = DataSchema(many=True)
        return data_schema.dump(data).data
    else:
        abort(
            404, "data for {session} not found".format(session_id=session_id)
        )


def create(data):
    session_id = data.get("session_id", None)
    data_name = data.get("data_name", None)
    csv = data.get("csv", None)
    split = data.get("split", None)
    shuffle = data.get("shuffle", None)
    test = data.get("test", None)
    train = data.get("train", None)

    schema = DataSchema()
    new_data = schema.load(data, session=db.session).data

    db.session.add(new_data)
    db.session.commit()

    return schema.dump(new_data).data
