import pickle
from flask import jsonify


def digit_prediction_for_robot(Xnew, session_id):
    # Right now this works perfectly wel with the digit classifier. We have to see if the code to get to X_new might need some alteration for other robot scripts!
    X = Xnew.split(",")
    print(X)
    X_float = [float(i) for i in X]
    print(X_float)
    X_new = []
    X_new.append(X_float)
    print(X_new)
    loaded_model = pickle.load(open('./pickled_models/digit_classifier'+ session_id + '.sav', 'rb'))
    y_new = loaded_model.predict(X_new)
    y_new = y_new.tolist()
    return jsonify(y_new)


def ghost_prediction_for_robot(time, mode, session_id):
    X_new = [[float(time)]]
    print(X_new)
    if mode == "one":
        loaded_model = pickle.load(open('./pickled_models/ghost_regressor'+ session_id + '.sav', 'rb'))
        y_new = loaded_model.predict(X_new)
        y_new = y_new.tolist()
    else:
        loaded_model_heading = pickle.load(open('./pickled_models/heading_regressor' + session_id + '.sav', 'rb'))
        loaded_model_distance = pickle.load(open('./pickled_models/distance_regressor' + session_id + '.sav', 'rb'))
        y_new_heading = loaded_model_heading.predict(X_new)
        y_new_distance = loaded_model_distance.predict(X_new)
        y_new_heading = y_new_heading.tolist()
        y_new_distance = y_new_distance.tolist()
        y_new = y_new_heading + y_new_distance

    print(y_new)
    print(jsonify(y_new))
    return jsonify(y_new)
