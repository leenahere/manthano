from flask import make_response, abort, jsonify, send_file, abort
import os
import matplotlib.pyplot as plt
from config import db
from models import Data
import pandas as pd
import seaborn as sns
import urllib
import numpy as np
from io import StringIO
from yellowbrick.classifier import ClassificationReport, ConfusionMatrix
from yellowbrick.contrib.classifier import DecisionViz
from yellowbrick.regressor import ResidualsPlot, PredictionError
import matplotlib
matplotlib.use("Agg")
import pickle

import sklearn as skl
import sklearn.model_selection
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB, BernoulliNB, MultinomialNB, ComplementNB
from sklearn.linear_model import LogisticRegression
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures, StandardScaler, Normalizer, MinMaxScaler
from sklearn.pipeline import Pipeline
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import chi2, f_regression
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.preprocessing import LabelEncoder
from sklearn.kernel_ridge import KernelRidge
from sklearn.linear_model import Lasso, ElasticNet

df = None
X, y = None, None
X_train, X_test, y_train, y_test = None, None, None, None
cols = None
model = None
problem_class = None
order = 0


def import_dataset(data):
    global df, X_train, X_test, y_train, y_test, X, y, features_df_new, cols
    data_entry = Data.query.filter(Data.data_name == data).first()
    data_scale = data_entry.scale
    print(data_scale)
    data_shuffle = data_entry.shuffle
    print(data_shuffle)
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

    if data_scale is "MinMax":
        scaler = MinMaxScaler()
        scaler.fit_transform(X)
    elif data_scale is "Normalization":
        scaler = Normalizer()
        scaler.fit_transform(X)
    elif data_scale is "Standard":
        scaler = StandardScaler()
        scaler.fit_transform(X)

    y = df.drop(df.columns[drop_labels_arr], axis=1)
    drop_more = sorted(to_drop)
    df = df.drop(df.columns[drop_more], axis=1)

    print("works")
    print(X.shape)
    print(y.shape)

    if X.shape[1] > 2:
        if problem_class == 'classification':
            two_best = SelectKBest(chi2, k=2).fit(X, y)
            cols = two_best.get_support()
            print(cols)
        elif problem_class == 'regression':
            two_best = SelectKBest(f_regression, k=2).fit(X, y)
            cols = two_best.get_support()
            print(cols)
    else:
        cols = [True for i in range(0, X.shape[1])]
        print(cols)

    print("tada")

    X_train, X_test, y_train, y_test = sklearn.model_selection.train_test_split(X, y, train_size=train_size, shuffle=data_shuffle)
    print("Split worked")


def execute_classification_code(code, session):
    global df, model, problem_class, order
    code_str = urllib.parse.unquote(code)
    code_arr = code_str.split("\n")
    print(code_arr)
    problem_class = code_arr[0]
    print(problem_class)
    order = code_arr[1]
    print(order)
    exec(code_arr[2])
    print(df)
    exec(code_arr[3], globals())

    viz = ClassificationReport(model, cmap='PiYG')
    viz.fit(X_train, y_train)
    viz.score(X_test, y_test)
    viz.poof(outpath="./plots/classificationmatrix" + session + ".png")
    image_path_class = "classificationmatrix"

    plt.clf()
    plt.cla()
    plt.close()

    le = LabelEncoder()
    dec_viz = DecisionViz(model, title="Decision Boundaries", features=np.where(cols == True)[0].tolist(), classes=list(map(str, y.iloc[:, 0].unique())).sort())
    dec_viz.fit(X_train.to_numpy(), le.fit_transform(y_train))
    dec_viz.draw(X_test.to_numpy(), le.fit_transform(y_test))
    dec_viz.poof(outpath="./plots/decviz" + session + ".png")
    image_path_dec = "decviz"

    plt.clf()
    plt.cla()
    plt.close()

    print(list(map(str, y.iloc[:, 0].unique())))
    cm = ConfusionMatrix(model, classes=list(map(str, y.iloc[:, 0].unique())).sort())
    cm.fit(X_train, y_train)
    cm.score(X_test, y_test)
    plt.tight_layout()
    cm.poof(outpath="./plots/cm" + session + ".png")
    image_path_cm = "cm"

    plt.clf()
    plt.cla()
    plt.close()

    model.fit(X_train, y_train)

    file = 'pickled_models/trained_model' + session + '.sav'
    pickle_path = 'trained_model'
    pickle.dump(model, open(file, 'wb'))

    return jsonify(image_path_class, image_path_dec, image_path_cm, pickle_path)


def send_image(imagepath, timestamp):
    path = "./plots/" + imagepath + '.png'
    if os.path.isfile(path):
        return send_file(path, mimetype='image/png')
    else:
        abort(400)


def execute_regression_code(code, session):
    try:
        global df, model, problem_class, order
        code_str = urllib.parse.unquote(code)
        code_arr = code_str.split("\n")
        print(code_arr)
        problem_class = code_arr[0]
        print(problem_class)
        order = code_arr[1]
        print(order)
        exec(code_arr[2])
        print(df)
        exec(code_arr[3], globals())

        feature_vis = X_test[X_test.columns[pd.Series(cols)]]

        plt.clf()
        plt.cla()
        plt.close()

        model.fit(X_train, y_train)
        y_predict = model.predict(X_test)

        print(X_test[feature_vis.columns[0]].shape, y_test.shape)
        print(y_test.to_numpy().ravel().shape)
        print(y_predict.ravel().shape)
        print(X_test[feature_vis.columns[0]].to_numpy(), y_predict)

        sns.regplot(x=X_test[feature_vis.columns[0]], y=y_test.to_numpy().ravel(), color='blue', order=int(order))
        sns.regplot(x=X_test[feature_vis.columns[0]], y=y_predict.ravel(), color='green', order=int(order))
        #plt.scatter(X_test[feature_vis.columns[1]].to_numpy(), y_test, s=10)
        #plt.scatter(X_test[feature_vis.columns[1]].to_numpy(), y_predict, color='r')
        plt.savefig("./plots/regression" + session + ".png")
        image_path = "regression"
        r2 = r2_score(y_test, y_predict)
        mse = mean_squared_error(y_test, y_predict)

        plt.clf()
        plt.cla()
        plt.close()

        file = 'pickled_models/trained_model' + session + '.sav'
        pickle_path = 'trained_model'
        pickle.dump(model, open(file, 'wb'))

        return jsonify(image_path, mse, r2, pickle_path)
    except:
        abort(400)



# This is all code for visualizing the regression models. Nothing convincing...
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
