from flask import make_response, abort, jsonify, send_from_directory, send_file
from git import Repo
import os
import io

#matplotlib No-GUI, otherwise thread issues
import matplotlib as mpl
mpl.use("Agg")

import matplotlib.pyplot as plt
import seaborn as sns
mpl.style.use('ggplot')
#import mpld3
import pandas as pd
import random

DIRNAME = os.path.dirname(__file__)
PATH_OF_GIT_REPO = os.path.join(DIRNAME, "./../../server-thesis/.git")

DATA_PATH = os.path.join(DIRNAME, "./../../server-thesis/data")

def list_all_csv(robot_id):
    repo = Repo(PATH_OF_GIT_REPO)
    repo.git.pull()

    files = []

    for filename in os.listdir(DATA_PATH):
        path = os.path.join(DATA_PATH, filename)
        if os.path.isfile(path):
            files.append(filename)

    return jsonify(files)


def get_file(filename):
    return send_from_directory(DATA_PATH, filename, as_attachment=True)


# in order for numpy array to work I had to manually add this fix to mpld3:
# https://github.com/javadba/mpld3/commit/57ed37dbc4749259b1b46cba8bf28de802972adb
def get_plot(filename):
    path = "./../../server-thesis/data/" + filename
    data = pd.read_csv(path)
    pairplot = sns.pairplot(data, vars=data.columns[0:-1], hue=data.columns[-1])
    pairplot.savefig("plot.png")
    image_path = './plot.png'
    print(os.path.isfile(image_path))
    return send_file(image_path, mimetype='image/png')
