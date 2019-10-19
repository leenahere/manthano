from flask import Flask, render_template, redirect
import connexion

import config

# Get the application instance
connex_app = config.connex_app

# Read the swagger.yml file to configure the endpoints
connex_app.add_api("swagger.yml")

@connex_app.route('/pdf')
def index():
    return redirect('/static/maschinelles_lernen.pdf')


if __name__ == '__main__':
    connex_app.run(debug=True, port=8080, threaded=False)
