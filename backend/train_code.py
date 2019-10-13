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


CSV_STR = """Id,SepalLengthCm,SepalWidthCm,PetalLengthCm,PetalWidthCm,Species
1,5.1,3.5,1.4,0.2,Iris-setosa
2,4.9,3.0,1.4,0.2,Iris-setosa
3,4.7,3.2,1.3,0.2,Iris-setosa
4,4.6,3.1,1.5,0.2,Iris-setosa
5,5.0,3.6,1.4,0.2,Iris-setosa
6,5.4,3.9,1.7,0.4,Iris-setosa
7,4.6,3.4,1.4,0.3,Iris-setosa
8,5.0,3.4,1.5,0.2,Iris-setosa
9,4.4,2.9,1.4,0.2,Iris-setosa
10,4.9,3.1,1.5,0.1,Iris-setosa
11,5.4,3.7,1.5,0.2,Iris-setosa
12,4.8,3.4,1.6,0.2,Iris-setosa
13,4.8,3.0,1.4,0.1,Iris-setosa
14,4.3,3.0,1.1,0.1,Iris-setosa
15,5.8,4.0,1.2,0.2,Iris-setosa
16,5.7,4.4,1.5,0.4,Iris-setosa
17,5.4,3.9,1.3,0.4,Iris-setosa
18,5.1,3.5,1.4,0.3,Iris-setosa
19,5.7,3.8,1.7,0.3,Iris-setosa
20,5.1,3.8,1.5,0.3,Iris-setosa
21,5.4,3.4,1.7,0.2,Iris-setosa
22,5.1,3.7,1.5,0.4,Iris-setosa
23,4.6,3.6,1.0,0.2,Iris-setosa
24,5.1,3.3,1.7,0.5,Iris-setosa
25,4.8,3.4,1.9,0.2,Iris-setosa
26,5.0,3.0,1.6,0.2,Iris-setosa
27,5.0,3.4,1.6,0.4,Iris-setosa
28,5.2,3.5,1.5,0.2,Iris-setosa
29,5.2,3.4,1.4,0.2,Iris-setosa
30,4.7,3.2,1.6,0.2,Iris-setosa
31,4.8,3.1,1.6,0.2,Iris-setosa
32,5.4,3.4,1.5,0.4,Iris-setosa
33,5.2,4.1,1.5,0.1,Iris-setosa
34,5.5,4.2,1.4,0.2,Iris-setosa
35,4.9,3.1,1.5,0.1,Iris-setosa
36,5.0,3.2,1.2,0.2,Iris-setosa
37,5.5,3.5,1.3,0.2,Iris-setosa
38,4.9,3.1,1.5,0.1,Iris-setosa
39,4.4,3.0,1.3,0.2,Iris-setosa
40,5.1,3.4,1.5,0.2,Iris-setosa
41,5.0,3.5,1.3,0.3,Iris-setosa
42,4.5,2.3,1.3,0.3,Iris-setosa
43,4.4,3.2,1.3,0.2,Iris-setosa
44,5.0,3.5,1.6,0.6,Iris-setosa
45,5.1,3.8,1.9,0.4,Iris-setosa
46,4.8,3.0,1.4,0.3,Iris-setosa
47,5.1,3.8,1.6,0.2,Iris-setosa
48,4.6,3.2,1.4,0.2,Iris-setosa
49,5.3,3.7,1.5,0.2,Iris-setosa
50,5.0,3.3,1.4,0.2,Iris-setosa
51,7.0,3.2,4.7,1.4,Iris-versicolor
52,6.4,3.2,4.5,1.5,Iris-versicolor
53,6.9,3.1,4.9,1.5,Iris-versicolor
54,5.5,2.3,4.0,1.3,Iris-versicolor
55,6.5,2.8,4.6,1.5,Iris-versicolor
56,5.7,2.8,4.5,1.3,Iris-versicolor
57,6.3,3.3,4.7,1.6,Iris-versicolor
58,4.9,2.4,3.3,1.0,Iris-versicolor
59,6.6,2.9,4.6,1.3,Iris-versicolor
60,5.2,2.7,3.9,1.4,Iris-versicolor
61,5.0,2.0,3.5,1.0,Iris-versicolor
62,5.9,3.0,4.2,1.5,Iris-versicolor
63,6.0,2.2,4.0,1.0,Iris-versicolor
64,6.1,2.9,4.7,1.4,Iris-versicolor
65,5.6,2.9,3.6,1.3,Iris-versicolor
66,6.7,3.1,4.4,1.4,Iris-versicolor
67,5.6,3.0,4.5,1.5,Iris-versicolor
68,5.8,2.7,4.1,1.0,Iris-versicolor
69,6.2,2.2,4.5,1.5,Iris-versicolor
70,5.6,2.5,3.9,1.1,Iris-versicolor
71,5.9,3.2,4.8,1.8,Iris-versicolor
72,6.1,2.8,4.0,1.3,Iris-versicolor
73,6.3,2.5,4.9,1.5,Iris-versicolor
74,6.1,2.8,4.7,1.2,Iris-versicolor
75,6.4,2.9,4.3,1.3,Iris-versicolor
76,6.6,3.0,4.4,1.4,Iris-versicolor
77,6.8,2.8,4.8,1.4,Iris-versicolor
78,6.7,3.0,5.0,1.7,Iris-versicolor
79,6.0,2.9,4.5,1.5,Iris-versicolor
80,5.7,2.6,3.5,1.0,Iris-versicolor
81,5.5,2.4,3.8,1.1,Iris-versicolor
82,5.5,2.4,3.7,1.0,Iris-versicolor
83,5.8,2.7,3.9,1.2,Iris-versicolor
84,6.0,2.7,5.1,1.6,Iris-versicolor
85,5.4,3.0,4.5,1.5,Iris-versicolor
86,6.0,3.4,4.5,1.6,Iris-versicolor
87,6.7,3.1,4.7,1.5,Iris-versicolor
88,6.3,2.3,4.4,1.3,Iris-versicolor
89,5.6,3.0,4.1,1.3,Iris-versicolor
90,5.5,2.5,4.0,1.3,Iris-versicolor
91,5.5,2.6,4.4,1.2,Iris-versicolor
92,6.1,3.0,4.6,1.4,Iris-versicolor
93,5.8,2.6,4.0,1.2,Iris-versicolor
94,5.0,2.3,3.3,1.0,Iris-versicolor
95,5.6,2.7,4.2,1.3,Iris-versicolor
96,5.7,3.0,4.2,1.2,Iris-versicolor
97,5.7,2.9,4.2,1.3,Iris-versicolor
98,6.2,2.9,4.3,1.3,Iris-versicolor
99,5.1,2.5,3.0,1.1,Iris-versicolor
100,5.7,2.8,4.1,1.3,Iris-versicolor
101,6.3,3.3,6.0,2.5,Iris-virginica
102,5.8,2.7,5.1,1.9,Iris-virginica
103,7.1,3.0,5.9,2.1,Iris-virginica
104,6.3,2.9,5.6,1.8,Iris-virginica
105,6.5,3.0,5.8,2.2,Iris-virginica
106,7.6,3.0,6.6,2.1,Iris-virginica
107,4.9,2.5,4.5,1.7,Iris-virginica
108,7.3,2.9,6.3,1.8,Iris-virginica
109,6.7,2.5,5.8,1.8,Iris-virginica
110,7.2,3.6,6.1,2.5,Iris-virginica
111,6.5,3.2,5.1,2.0,Iris-virginica
112,6.4,2.7,5.3,1.9,Iris-virginica
113,6.8,3.0,5.5,2.1,Iris-virginica
114,5.7,2.5,5.0,2.0,Iris-virginica
115,5.8,2.8,5.1,2.4,Iris-virginica
116,6.4,3.2,5.3,2.3,Iris-virginica
117,6.5,3.0,5.5,1.8,Iris-virginica
118,7.7,3.8,6.7,2.2,Iris-virginica
119,7.7,2.6,6.9,2.3,Iris-virginica
120,6.0,2.2,5.0,1.5,Iris-virginica
121,6.9,3.2,5.7,2.3,Iris-virginica
122,5.6,2.8,4.9,2.0,Iris-virginica
123,7.7,2.8,6.7,2.0,Iris-virginica
124,6.3,2.7,4.9,1.8,Iris-virginica
125,6.7,3.3,5.7,2.1,Iris-virginica
126,7.2,3.2,6.0,1.8,Iris-virginica
127,6.2,2.8,4.8,1.8,Iris-virginica
128,6.1,3.0,4.9,1.8,Iris-virginica
129,6.4,2.8,5.6,2.1,Iris-virginica
130,7.2,3.0,5.8,1.6,Iris-virginica
131,7.4,2.8,6.1,1.9,Iris-virginica
132,7.9,3.8,6.4,2.0,Iris-virginica
133,6.4,2.8,5.6,2.2,Iris-virginica
134,6.3,2.8,5.1,1.5,Iris-virginica
135,6.1,2.6,5.6,1.4,Iris-virginica
136,7.7,3.0,6.1,2.3,Iris-virginica
137,6.3,3.4,5.6,2.4,Iris-virginica
138,6.4,3.1,5.5,1.8,Iris-virginica
139,6.0,3.0,4.8,1.8,Iris-virginica
140,6.9,3.1,5.4,2.1,Iris-virginica
141,6.7,3.1,5.6,2.4,Iris-virginica
142,6.9,3.1,5.1,2.3,Iris-virginica
143,5.8,2.7,5.1,1.9,Iris-virginica
144,6.8,3.2,5.9,2.3,Iris-virginica
145,6.7,3.3,5.7,2.5,Iris-virginica
146,6.7,3.0,5.2,2.3,Iris-virginica
147,6.3,2.5,5.0,1.9,Iris-virginica
148,6.5,3.0,5.2,2.0,Iris-virginica
149,6.2,3.4,5.4,2.3,Iris-virginica
150,5.9,3.0,5.1,1.8,Iris-virginica
"""

IRIS_EXAMPLE = {
        "csv": CSV_STR,
        "data_name": "irisExample",
        "session_id": 00000,
        "shuffle": True,
        "scale": "None",
        "test": 20,
        "train": 80,
        "features": [1, 2, 3, 4],
        "labels": [5],
        "delimiter": ","
}


def import_dataset(data):
    global df, X_train, X_test, y_train, y_test, X, y, features_df_new, cols

    if data == "irisExample":
        data_entry = IRIS_EXAMPLE
        data_scale = data_entry["scale"]
        print(data_scale)
        data_shuffle = data_entry["shuffle"]
        print(data_shuffle)
        df = pd.read_csv(StringIO(data_entry["csv"]), delimiter=data_entry["delimiter"])
        max = len(df.columns)
        all = sorted(data_entry["features"] + data_entry["labels"])
        print(all)
        to_drop = list(set(range(0, max)) - set(all))
        print(to_drop)
        train_size = data_entry["train"] * 0.01

        drop_features_arr = sorted(to_drop + data_entry["labels"])
        drop_labels_arr = sorted(to_drop + data_entry["features"])
        X = df.drop(df.columns[drop_features_arr], axis=1)
    else:
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

    X_train, X_test, y_train, y_test = sklearn.model_selection.train_test_split(X, y, train_size=train_size, shuffle=data_shuffle)


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

    cmap_pink_green = sns.diverging_palette(352, 136, s=96, l=51, n=7)
    viz = ClassificationReport(model, cmap=cmap_pink_green)
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
    cmap_salmon_dijon = sns.diverging_palette(28, 65, s=98, l=78, n=7)
    cm = ConfusionMatrix(model, classes=list(map(str, y.iloc[:, 0].unique())).sort(), cmap=cmap_salmon_dijon)
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

        sns.regplot(x=X_test[feature_vis.columns[0]], y=y_test.to_numpy().ravel(), color='#17b2e6', order=int(order))
        sns.regplot(x=X_test[feature_vis.columns[0]], y=y_predict.ravel(), color='#e67017', order=int(order))
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
