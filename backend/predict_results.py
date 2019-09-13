import pickle
from flask import jsonify


def predicition_for_robot(Xnew, session_id):
    # Right now this works perfectly wel with the digit classifier. We have to see if the code to get to X_new might need some alteration for other robot scripts!
    X = Xnew.split(",")
    print(X)
    X_float = [float(i) for i in X]
    print(X_float)
    X_new = []
    X_new.append(X_float)
    print(X_new)
    loaded_model = pickle.load(open('./pickled_models/trained_model'+ session_id + '.sav', 'rb'))
    y_new = loaded_model.predict(X_new)
    y_new = y_new.tolist()
    return jsonify(y_new)
