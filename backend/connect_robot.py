import pysftp
from flask import jsonify
import re
import csv
import paramiko

DATA_DIRECTORY = 'csv_on_pi'
SCRIPTS_DIRECTORY = 'ml_scripts'

def check_ip_connection(ip, user, pw):
    try:
        sftp = pysftp.Connection(ip, username=user, password=pw)
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


def run_script(ip, user, pw, script, picklepath):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(ip, username=user, password=pw)

    pickled_model = "pickled_models/" + picklepath + ".sav"

    sftp = client.open_sftp()
    sftp.put(pickled_model, './ml_scripts/trained_model.sav')
    sftp.close()

    client.exec_command('python3 ./ml_scripts/' + script)
    client.close()
    return jsonify(True)
