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

COLORS = ["#e6bc17", "#e67017", "#17e670", "#e6177e", "#1739e6", "#17b2e6", "#dd1a21", "#de8b5f", "#cce197", "#901F76"]

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
        pairplot = sns.pairplot(data, vars=data[data.columns[features]], hue=colors, palette=sns.color_palette(COLORS))
    else:
        combined = features + labels
        combined.sort()
        print(combined)
        pairplot = sns.pairplot(data[data.columns[combined]], palette=sns.color_palette(COLORS))

    plt.savefig('./plots/plot'+ session + '.png')

    plt.clf()
    plt.cla()
    plt.close()

    image_path = './plots/plot'+ session + '.png'
    print(os.path.isfile(image_path))
    return send_file(image_path, mimetype='image/png')


def heatmap(csv, delimiter, session):
    replaced = urllib.parse.unquote(csv)
    data = pd.read_csv(StringIO(replaced), sep=delimiter)
    figure_size = len(data.columns) / 2
    if figure_size < 5:
        figure_size = 5
    plt.figure(figsize=(figure_size,figure_size))
    cmap = sns.diverging_palette(352, 136, s=96, l=51, n=7)
    sns.heatmap(data.corr(), annot=True, cmap=cmap, fmt='.1f', square=True)
    plt.tight_layout()
    plt.savefig('./plots/heatmap' + session + '.png')
    plt.clf()
    plt.cla()
    plt.close()
    image_path = './plots/heatmap' + session + '.png'
    print(os.path.isfile(image_path))
    return send_file(image_path, mimetype='image/png')
