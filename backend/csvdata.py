from flask import make_response, abort, jsonify, send_from_directory
from git import Repo
import os
import matplotlib as mpl
mpl.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import mpld3
import pandas as pd

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
    """Download a file."""
    return send_from_directory(DATA_PATH, filename, as_attachment=True)


# in order for numpy array to work I had to manually add this fix to mpld3:
# https://github.com/javadba/mpld3/commit/57ed37dbc4749259b1b46cba8bf28de802972adb
def get_plot(filename):
    path = "./../../server-thesis/data/" + filename
    csv_path = os.path.join(DIRNAME, path)
    data = pd.read_csv(csv_path)
    pairplot = sns.pairplot(data)
    fig = pairplot.fig
    html_graph = mpld3.fig_to_html(fig)
    cut_1 = html_graph.find("id") + 4
    cut_2 = (html_graph.find("div", cut_1)) - 4
    fig_id = html_graph[cut_1:cut_2]
    cut_3 = html_graph.find("<script>") + 8
    cut_4 = html_graph.find("</script>", cut_3) - 1
    script = html_graph[cut_3:cut_4]
    return jsonify(fig_id, script)