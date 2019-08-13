from flask import make_response, abort, jsonify, send_from_directory, send_file
import csv
import pysftp
import re

# needs to be changed once running on ev3 (same directory name on every ev3!)
DATA_DIRECTORY = 'csv_on_pi'

def read_all(ip, user, pw):
    with pysftp.Connection(ip, username=user, password=pw) as sftp:
        with sftp.cd(DATA_DIRECTORY):
            r = re.compile(".*\.csv")
            return jsonify(list(filter(r.match, sftp.listdir())))


def read_file(ip, user, pw, filename):
    with pysftp.Connection(ip, username=user, password=pw) as sftp:
        with sftp.cd(DATA_DIRECTORY):
            sftp.get(filename, 'file.csv')
            return send_from_directory('./', 'file.csv', as_attachment=True)


def get_delimiter(ip, user, pw, filename):
    with pysftp.Connection(ip, username=user, password=pw) as sftp:
        with sftp.cd(DATA_DIRECTORY):
            sftp.get(filename, 'file.csv')
            with open('file.csv', 'r') as f1:
                dialect = csv.Sniffer().sniff(f1.readline(), delimiters=';,')
                return jsonify(dialect.delimiter)


#read_file('192.168.100.107', 'pi', 'raspberry', 'data-collection-human-drive-7AA7DF.csv')