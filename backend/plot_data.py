from flask import make_response, abort, jsonify, send_from_directory, send_file
import sys
from io import StringIO
import os
import re
import urllib

import matplotlib as mpl
mpl.use("Agg")
mpl.style.use('ggplot')

import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt


def plot(csv, delimiter, session):
    replaced = urllib.parse.unquote(csv)
    data = pd.read_csv(StringIO(replaced), sep=delimiter)
    plt.figure()
    pairplot = sns.pairplot(data)
    plt.savefig('./plots/plot'+ session + '.png')
    image_path = './plots/plot'+ session + '.png'
    print(os.path.isfile(image_path))
    return send_file(image_path, mimetype='image/png')
