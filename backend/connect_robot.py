import pysftp
from flask import jsonify
import re
import csv

DATA_DIRECTORY = 'csv_on_pi'

def check_ip_connection(ip, user, pw):
    try:
        sftp = pysftp.Connection(ip, username=user, password=pw)
        print(sftp.listdir())
        all_csv_names = []
        csv_list = []
        delimiter = []
        with sftp.cd(DATA_DIRECTORY):
            r = re.compile(".*\.csv")
            all_csv_names = list(filter(r.match, sftp.listdir()))
            for item in all_csv_names:
                print(item)
                sftp.get(item, 'file.csv')
                with open('file.csv', 'r') as csvfile:
                    dialect = csv.Sniffer().sniff(csvfile.readline(), delimiters=';,')
                    delimiter.append(dialect.delimiter)
                with open('file.csv', 'r') as csvfile:
                    reader = csv.reader(csvfile, delimiter=dialect.delimiter)
                    csv_string = ""
                    for row in reader:
                        csv_string += ((','.join(row)) + '\n')
                    csv_list.append(csv_string)
        return jsonify(True, all_csv_names, csv_list, delimiter)
    except:
        return jsonify(False)
