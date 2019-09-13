import pysftp
import re
import csv
import paramiko
from time import sleep


sftp = None
DATA_DIRECTORY = 'csv_on_pi'
SCRIPTS_DIRECTORY = 'ml_scripts'

def check_ip_connection(ip, user, pw):
    global sftp
    sftp = pysftp.Connection(ip, username=user, password=pw)
    print(sftp.listdir())

def get_data():
    global sftp
    with sftp.cd(DATA_DIRECTORY):
        r = re.compile(".*\.csv")
        return list(filter(r.match, sftp.listdir()))

def get_all_csv_files(something):
    global sftp
    csv_list = []
    dialect = None
    with sftp.cd(DATA_DIRECTORY):
        for item in something:
            print(item)
            sftp.get(item, 'file.csv')
            with open('file.csv', 'r') as csvfile:
                dialect = csv.Sniffer().sniff(csvfile.readline(), delimiters=';,')
            with open('file.csv', 'r') as csvfile:
                reader = csv.reader(csvfile, delimiter=dialect.delimiter)
                csv_string = ""
                for row in reader:
                    csv_string += ((','.join(row)) + '\n')
                csv_list.append(csv_string)
    with sftp.cd(SCRIPTS_DIRECTORY):
        r = re.compile(".*\.py")
        print(sftp.listdir())
        print(list(filter(r.match, sftp.listdir())))
    return csv_list, dialect.delimiter


def run_script(ip, user, pw, script, pickle_path):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(ip, username=user, password=pw)

    pickled_model = "pickled_models/" + pickle_path + ".sav"

    sftp = client.open_sftp()
    sftp.put(pickled_model, './ml_scripts/trained_model.sav')
    sftp.close()

    client.exec_command('python3 ./ml_scripts/' + script)
    client.close()


# check_ip_connection('192.168.100.220', 'robot', 'maker')
# lalist = get_data()
# csvs, deli = get_all_csv_files(lalist)
# print(csvs)
# print(deli)

run_script('192.168.100.220', 'robot', 'maker', 'test_drive.py', 'trained_model')


