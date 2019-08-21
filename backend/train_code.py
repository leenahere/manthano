from flask import make_response, abort, jsonify, send_file
import os
import matplotlib.pyplot as plt
from config import db
from models import Data
import pandas as pd
import seaborn as sns
import urllib
from io import StringIO
from yellowbrick.classifier import ClassificationReport
from yellowbrick.regressor import ResidualsPlot
import matplotlib
matplotlib.use("Agg")

import sklearn as skl
import sklearn.model_selection
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB, BernoulliNB, MultinomialNB, ComplementNB
from sklearn.linear_model import LogisticRegression
from sklearn.linear_model import LinearRegression

df = None
X, y = None, None
X_train, X_test, y_train, y_test = None, None, None, None
model = None


def import_dataset(data):
    global df, X_train, X_test, y_train, y_test, X, y
    data_entry = Data.query.filter(Data.data_name == data).first()
    df = pd.read_csv(StringIO(data_entry.csv), delimiter=data_entry.delimiter)
    max = len(df.columns)
    all = sorted(data_entry.features + data_entry.labels)
    print(all)
    to_drop = list(set(range(0, max)) - set(all))
    print(to_drop)

    drop_features_arr = sorted(to_drop + data_entry.labels)
    drop_labels_arr = sorted(to_drop + data_entry.features)
    X = df.drop(df.columns[drop_features_arr], axis=1)
    y = df.drop(df.columns[drop_labels_arr], axis=1)
    print(X)
    print(y)
    X_train, X_test, y_train, y_test = sklearn.model_selection.train_test_split(X, y)



def execute_code(code):
    global df, model
    code_str = urllib.parse.unquote(code)
    code_arr = code_str.split("\n")
    print(code_arr)
    problem_class = code_arr[0]
    print(problem_class)
    exec(code_arr[1])
    print(df)
    exec(code_arr[2], globals())

    plt.clf()

    if problem_class == 'classification':
        viz = ClassificationReport(model, cmap='PiYG')
        viz.fit(X_train, y_train)
        viz.score(X_test, y_test)
        viz.poof(outpath="pcoords1.png")
    elif problem_class == 'regression':
        viz = ResidualsPlot(model)
        viz.fit(X_train, y_train)
        viz.score(X_test, y_test)
        viz.poof(outpath="pcoords1.png")

    plt.clf()

    image_path = "pcoords1.png"
    print(os.path.isfile(image_path))
    return send_file(image_path, mimetype='image/png')


def train_and_predit_model(code):
    data = pd.read_csv
    return True



