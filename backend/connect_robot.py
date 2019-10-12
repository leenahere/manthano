import pysftp
from flask import jsonify
import re
import csv
import paramiko
import os

DATA_DIRECTORY = 'csv_data'
SCRIPTS_DIRECTORY = 'ml_scripts'

def check_ip_connection(ip, user, pw):
    try:
        cnopts = pysftp.CnOpts()
        cnopts.hostkeys = None
        sftp = pysftp.Connection(ip, username=user, password=pw, cnopts=cnopts)
        print(sftp.listdir())
        all_csv_names = []
        csv_list = []
        delimiter = []
        script_list = []
        with sftp.cd(SCRIPTS_DIRECTORY):
            r = re.compile(".*\.py")
            print(sftp.listdir())
            script_list = list(filter(r.match, sftp.listdir()))
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
        return jsonify(True, all_csv_names, csv_list, delimiter, script_list)
    except:
        return jsonify(False)


def run_script(ip, user, pw, picklepath, modelname, session):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(ip, username=user, password=pw)

    pickled_model = "pickled_models/" + picklepath + ".sav"
    new_name = modelname + session + ".sav"
    new_dst = "pickled_models/" + new_name

    sftp = client.open_sftp()
    sftp.put(pickled_model, "./ml_scripts/models/" + new_name)
    sftp.close()

    os.rename(pickled_model, new_dst)

    #client.exec_command('python3 ./ml_scripts/' + script)
    #client.close()
    return jsonify(True)
