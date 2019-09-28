from flask import make_response, abort
from config import db
from models import ExampleData, ExampleDataSchema


def read_all():
    data = ExampleData.query.with_entities(ExampleData.data_name).all()
    data_schema = ExampleDataSchema(many=True)
    return data_schema.dump(data)


def read_file(filename):
    data = ExampleData.query.filter(ExampleData.data_name == filename).one_or_none()

    if data is not None:
        data_schema = ExampleDataSchema()
        return data_schema.dump(data)
    else:
        abort(
            404, "file {filename} not found".format(filename=filename)
        )


print(
    u'\u03BCanthano'
)
