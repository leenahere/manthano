from flask import Flask
import connexion

import config

# Get the application instance
connex_app = config.connex_app

# Read the swagger.yml file to configure the endpoints
connex_app.add_api("swagger.yml")

@connex_app.route('/')
def index():
    return "Hello, World!"


if __name__ == '__main__':
    connex_app.run(debug=True, port=80)
