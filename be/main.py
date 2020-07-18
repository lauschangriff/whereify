from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from be.initSampleData import SampleData
from bson.json_util import dumps

app = Flask(__name__)
CORS(app)

client = MongoClient(host='localhost', port=27017)
db = client.wherify
SampleData.addSampleData()

@app.route('/locations', methods=['GET'])
def route_get_locations():
    res = db.locations.find()
    l = list(res)
    return dumps(l)




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7223)

