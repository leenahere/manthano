from flask import make_response, abort, jsonify, send_from_directory, send_file
import matplotlib as mpl
import matplotlib.pyplot as plt
import seaborn as sns
mpl.style.use('ggplot')
import pandas as pd



def get_plot(filename):
    path = "./../../server-thesis/data/" + filename
    data = pd.read_csv(path)
    pairplot = sns.pairplot(data, vars=data.columns[0:-1], hue=data.columns[-1])
    plt.show()
    pairplot.savefig("plot.png")
    return send_file('./plot.png')


get_plot('iris.csv')