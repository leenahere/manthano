import pysftp
from flask import jsonify


def check_ip_connection(ip, user, pw):
    try:
        with pysftp.Connection(ip, username=user, password=pw) as sftp:
            print(sftp.listdir())
        return jsonify(True)
    except:
        return jsonify(False)
