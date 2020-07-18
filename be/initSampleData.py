from pymongo import MongoClient


class SampleData:

    @staticmethod
    def addSampleData():
        client = MongoClient(host='localhost', port=27017)
        db = client.wherify
        location1 = {
            'latlng': [48.083339, 11.472681],
            'title': 'Argelsrieder Straße 52',
            'desc': 'Home'
        }

        location2 = {
            'latlng': [48.088477, 11.481218],
            'title': 'Ubahn Fürstenried West',
            'desc': 'Öffi'
        }

        location3 = {
            'latlng': [48.084445, 11.494873],
            'title': 'Alter Wirt',
            'desc': 'Speisegaststätte Alter Wirt'
        }

        # drop the table
        db.locations.drop()

        db.locations.insert_one(location1)
        db.locations.insert_one(location2)
        db.locations.insert_one(location3)
