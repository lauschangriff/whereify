from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from be.initSampleData import SampleData
from bson.json_util import dumps
from be.path import Points

app = Flask(__name__)
CORS(app)

client = MongoClient(host='localhost', port=27017)
db = client.wherify
SampleData.addSampleData()


@app.route('/locations/neuried', methods=['GET'])
def route_get_locations_neuried():
    res = db.locations.find({'layer': 'neuried'})
    return dumps(list(res))


@app.route('/locations/fuerstenried_west', methods=['GET'])
def route_get_locations_fuewest():
    res = db.locations.find({'layer': 'fuerstenried_west'})
    return dumps(list(res))


@app.route('/locations/add', methods=['POST'])
def route_post_add_location():
    data = request.get_json()
    location = {
        'latlng': data['latlng'],
        'title': data['title'],
        'desc': data['desc'],
        'layer': data['layer']
    }
    db.locations.insert_one(location)
    return jsonify(success=True)


@app.route('/trackdata/merge', methods=['POST'])
def route_post_merge_tracks():
    data = request.get_json()
    print(data)
    return jsonify(success=True)


@app.route('/locations/path', methods=['GET'])
def route_get_path():
    res = Points.get_path()
    print(res)
    return dumps(res)


@app.route('/locations/pathweb', methods=['POST'])
def route_get_path_web():
    print("/locations/pathweb ->")
    file = request.files['file']
    filename = file.filename
    print(filename)
    res = Points.get_path_from_web(file)
    return dumps(res)


@app.route('/locations/createmergedfile', methods=['POST'])
def route_get_merged_file():
    trks = []
    for file in request.files.getlist("file"):
        trks.append(Points.get_full_trk(file))

    gpxString = Points.get_gpx_head("tour_zusammengefuehrt")

    for wrapper in trks:
        for trkpoint in wrapper:
            gpxString = gpxString + '<trkpt lat="' + trkpoint["lat"] + '" lon="' + trkpoint["lon"] + '"><ele>' + \
                        trkpoint["ele"] + '</ele><time>' + trkpoint["time"] + '</time></trkpt>'

    gpxString = gpxString + Points.get_gpx_footer()

    return gpxString


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7223)
