from flask import make_response, abort, jsonify, send_file, abort
import os
import matplotlib.pyplot as plt
from config import db
from models import Data
import pandas as pd
import seaborn as sns
import urllib
from io import StringIO
from yellowbrick.classifier import ClassificationReport
from yellowbrick.regressor import ResidualsPlot, PredictionError
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
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import chi2, f_regression
from sklearn.metrics import r2_score, mean_squared_error

df = None
X, y = None, None
X_train, X_test, y_train, y_test = None, None, None, None
cols = None
model = None
problem_class = None


def import_dataset(data):
    global df, X_train, X_test, y_train, y_test, X, y, features_df_new, cols
    data_entry = Data.query.filter(Data.data_name == data).first()
    df = pd.read_csv(StringIO(data_entry.csv), delimiter=data_entry.delimiter)
    max = len(df.columns)
    all = sorted(data_entry.features + data_entry.labels)
    print(all)
    to_drop = list(set(range(0, max)) - set(all))
    print(to_drop)
    train_size = data_entry.train * 0.01

    drop_features_arr = sorted(to_drop + data_entry.labels)
    drop_labels_arr = sorted(to_drop + data_entry.features)
    X = df.drop(df.columns[drop_features_arr], axis=1)
    y = df.drop(df.columns[drop_labels_arr], axis=1)
    drop_more = sorted(to_drop)
    df = df.drop(df.columns[drop_more], axis=1)

    if problem_class == 'classification':
        two_best = SelectKBest(chi2, k=2).fit(X, y)
        cols = two_best.get_support()
        print(cols)
    elif problem_class == 'regression':
        two_best = SelectKBest(f_regression, k=2).fit(X, y)
        cols = two_best.get_support()
        print(cols)

    X_train, X_test, y_train, y_test = sklearn.model_selection.train_test_split(X, y, train_size=train_size)



def execute_code(code):
    try:
        global df, model, problem_class
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
            model.fit(X_train, y_train)
            y_predict = model.predict(X_test)
            r2 = r2_score(y_test, y_predict)
            mse = mean_squared_error(y_test, y_predict)
            print(r2)
            print(mse)
            # _, ax = plt.subplots()
            #
            # ax.scatter(x=range(0, y_test.size), y=y_test, c='blue', label='Actual', alpha=0.3)
            # ax.scatter(x=range(0, y_predict.size), y=y_predict, c='red', label='Predicted', alpha=0.3)
            #
            # plt.title('Actual and predicted values')
            # plt.xlabel('bla')
            # plt.ylabel('mpg')
            # plt.legend()
            # plt.savefig("pcoords1.png")
            # plt.figure()
            # print(X[X.columns[cols]])
            # X_some = X[X.columns[cols]]
            # print(X_some.columns[1])
            # print(y.columns[0])
            # sns.lmplot(x=X_some.columns[1], y=y.columns[0], data=df)
            # plt.savefig('pcoords1.png')

        plt.clf()

        image_path = "pcoords1.png"
        print(os.path.isfile(image_path))
        return send_file(image_path, mimetype='image/png')
    except:
        abort(400)



