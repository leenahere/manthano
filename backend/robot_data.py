from flask import make_response, abort, jsonify, send_from_directory, send_file
import csv
import pysftp
import re
import time

# needs to be changed once running on ev3 (same directory name on every ev3!)
DATA_DIRECTORY = 'csv_data'

def read_all(ip, user, pw):
    print("read_all")
    time_prior = time.time()
    print(time_prior)
    with pysftp.Connection(ip, username=user, password=pw) as sftp:
        print("now connections is established")
        time_now = time.time() - time_prior
        print(time_now)
        with sftp.cd(DATA_DIRECTORY):
            r = re.compile(".*\.csv")
            return jsonify(list(filter(r.match, sftp.listdir())))


def read_file(ip, user, pw, filename):
    time_prior= time.time()
    print(time_prior)
    with pysftp.Connection(ip, username=user, password=pw) as sftp:
        print("now connections is established")
        time_now = time.time() - time_prior
        print(time_now)
        with sftp.cd(DATA_DIRECTORY):
            time_2 = time.time()
            sftp.get(filename, 'file.csv')
            time_3 = time.time() - time_2
            print(time_3)
            return send_from_directory('./', 'file.csv', as_attachment=True)


def get_delimiter(ip, user, pw, filename):
    time_prior = time.time()
    print(time_prior)
    with pysftp.Connection(ip, username=user, password=pw) as sftp:
        print("now connections is established")
        time_now = time.time() - time_prior
        print(time_now)
        with sftp.cd(DATA_DIRECTORY):
            time_2 = time.time()
            sftp.get(filename, 'file.csv')
            time_3 = time.time() - time_2
            print(time_3)
            with open('file.csv', 'r') as f1:
                time_4 = time.time()
                dialect = csv.Sniffer().sniff(f1.readline(), delimiters=';,')
                time_5 = time.time() - time_4
                print(time_5)
                return jsonify(dialect.delimiter)


#read_file('192.168.100.107', 'pi', 'raspberry', 'data-collection-human-drive-7AA7DF.csv')