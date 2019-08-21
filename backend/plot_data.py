from flask import make_response, abort, jsonify, send_from_directory, send_file
import sys
from io import StringIO
import os
import re
import urllib

import matplotlib.style
import matplotlib
matplotlib.use("Agg")
matplotlib.style.use('ggplot')

import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt


def plot(csv, delimiter, session, features, labels, problem):
    replaced = urllib.parse.unquote(csv)
    features = features.split(',')
    labels = labels.split(',')
    features= list(map(int, features))
    labels = list(map(int, labels))
    data = pd.read_csv(StringIO(replaced), sep=delimiter)
    plt.figure()
    if problem == 'classification':
        colors = list(data.columns.values[labels])[0]
        print(colors)
        pairplot = sns.pairplot(data, vars=data[data.columns[features]], hue=colors)
    else:
        combined = features + labels
        combined.sort()
        print(combined)
        pairplot = sns.pairplot(data[data.columns[combined]])

    plt.savefig('./plots/plot'+ session + '.png')

    plt.clf()
    image_path = './plots/plot'+ session + '.png'
    print(os.path.isfile(image_path))
    return send_file(image_path, mimetype='image/png')
