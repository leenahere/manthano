from flask import make_response, abort, jsonify
import matplotlib.pyplot as plt
from config import db
from models import Data
import pandas as pd
import seaborn as sns
import urllib
from io import StringIO

import sklearn as skl
import sklearn.model_selection
from sklearn.neural_network import MLPClassifier

df = None
X, y = None, None
X_train, X_test, y_train, y_test = None, None, None, None
model = None


def import_dataset(data):
    global df, X_train, X_test, y_train, y_test, X, y
    data_entry = Data.query.filter(Data.data_name == 'iris_configured').first()
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
    exec(code_arr[0])
    print(df)
    exec(code_arr[1], globals())
    exec(code_arr[2])

    c_matrix = skl.metrics.confusion_matrix(y_test, model.predict(X_test))
    print(c_matrix)

    return jsonify("It works")


def train_and_predit_model(code):
    data = pd.read_csv
    return True



