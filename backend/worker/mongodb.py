from pymongo import MongoClient
import datetime


class MongoDBWorker:

    @staticmethod
    def handle_page_visit():
        client = MongoClient(host='127.0.0.1', port=27017)
        db = client.wherify
        usercount = db.usercount
        countitem = {"date": datetime.datetime.utcnow()}
        usercount.insert_one(countitem)

    @staticmethod
    def add_sample_data():
        client = MongoClient(host='localhost', port=27017)
        db = client.wherify
        location1 = {
            'latlng': [48.083339, 11.472681],
            'title': 'Argelsrieder Straße 52',
            'desc': 'Home',
            'layer': 'fuerstenried_west'
        }

        location2 = {
            'latlng': [48.088477, 11.481218],
            'title': 'Ubahn Fürstenried West',
            'desc': 'Öffi',
            'layer': 'fuerstenried_west'
        }

        location3 = {
            'latlng': [48.084445, 11.494873],
            'title': 'Alter Wirt',
            'desc': 'Speisegaststätte Alter Wirt',
            'layer': 'fuerstenried_west'
        }

        location1a = {
            'latlng': [48.087967, 11.459116],
            'title': 'Neuried',
            'desc': 'Neuried',
            'layer': 'neuried'
        }

        location2a = {
            'latlng': [48.089911, 11.462096],
            'title': 'Neuried',
            'desc': 'Neuried',
            'layer': 'neuried'
        }

        location3a = {
            'latlng': [48.095119, 11.456605],
            'title': 'Neuried',
            'desc': 'Neuried',
            'layer': 'neuried'
        }

        # drop the table
        db.locations.drop()

        db.locations.insert_one(location1)
        db.locations.insert_one(location2)
        db.locations.insert_one(location3)

        db.locations.insert_one(location1a)
        db.locations.insert_one(location2a)
        db.locations.insert_one(location3a)
