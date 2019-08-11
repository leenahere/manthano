import matplotlib.pyplot as plt
from config import db
from models import Data
import pandas as pd
import seaborn as sns

import sklearn as skl


def train_and_predit_model(code):
    data = pd.read_csv
    return True


def import_data(data):
    data_entry = Data.query.filter(Data.data_name == data).first()
    df = pd.read_csv(data_entry.csv, delimiter=',') #delimiter muss im data model stehen


