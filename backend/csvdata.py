from flask import make_response, abort, jsonify, send_from_directory
from git import Repo
import os

#matplotlib No-GUI, otherwise thread issues
import matplotlib as mpl
mpl.use("Agg")

import matplotlib.pyplot as plt
import seaborn as sns
import mpld3
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
    csv_path = os.path.join(DIRNAME, path)
    data = pd.read_csv(csv_path)
    variety = data.iloc[:, len(data.columns)-1]
    print(variety)
    print(set(variety))
    color = ["#"+''.join([random.choice('0123456789ABCDEF') for j in range(6)])
             for i in range(len(set(variety)))]
    print(color)
    colors = dict(zip(list(set(variety)), color))
    num_plots = len(data.columns)
    print(data.columns[0])
    iterator = 1
    size= num_plots*4
    fig, ax = plt.subplots(num_plots-1, num_plots-1, figsize=(size, size))
    for i in range(0,len(data.columns)-1):
        for j in range(0,len(data.columns)-1):
            ax[i, j].scatter(data.iloc[:, i], data.iloc[:, j], c=[colors[r] for r in variety])
            ax[i, j].axis('off')
            ax[i, j].set_title("Comparison: " + data.columns[i] + " and " + data.columns[j])
            print(iterator)
            iterator += 1

    for axi in ax.flat:
        for axis in [axi.xaxis, axi.yaxis]:
            axis.set_major_formatter(plt.NullFormatter())

    fig.tight_layout()

    html_graph = mpld3.fig_to_html(fig)
    cut_1 = html_graph.find("id") + 4
    cut_2 = (html_graph.find("div", cut_1)) - 4
    fig_id = html_graph[cut_1:cut_2]
    cut_3 = html_graph.find("<script>") + 8
    cut_4 = html_graph.find("</script>", cut_3) - 1
    script = html_graph[cut_3:cut_4]
    return jsonify(fig_id, script)
