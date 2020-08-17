from flask import Flask, request, jsonify
from flask_cors import CORS
from bson.json_util import dumps
from be.worker.gpx import GPX
from be.worker.mongodb import MongoDBWorker
from be.worker.distanceutil import DistanceUtil

app = Flask(__name__)
CORS(app)


@app.route('/trackdata/merge', methods=['POST'])
def route_post_merge_tracks():
    data = request.get_json()
    return jsonify(success=True)


@app.route('/locations/path', methods=['GET'])
def route_get_path():
    res = GPX.get_path()
    return dumps(res)


@app.route('/locations/pathweb', methods=['POST'])
def route_get_path_web():
    file = request.files['file']
    trkpts = GPX.get_path_from_web(file)
    distance = DistanceUtil.calculate_distance_of_track(trkpts)
    response = {"distance": distance, "points": trkpts}
    return dumps(response)


@app.route('/stats/user', methods=['GET'])
def route_handle_page_visit():
    # save date of visit
    MongoDBWorker.handle_page_visit()
    return jsonify(success=True)


@app.route('/locations/createmergedfile', methods=['POST'])
def route_get_merged_file():
    trks = []
    for file in request.files.getlist("file"):
        trks.append(GPX.get_full_trk(file))

    gpxString = GPX.get_gpx_head("tour_zusammengefuehrt")

    for wrapper in trks:
        for trkpoint in wrapper:
            gpxString = gpxString + '<trkpt lat="' + trkpoint["lat"] + '" lon="' + trkpoint["lon"] + '"><ele>' + \
                        trkpoint["ele"] + '</ele><time>' + trkpoint["time"] + '</time></trkpt>'

    gpxString = gpxString + GPX.get_gpx_footer()

    return gpxString


if __name__ == "__main__":
    app.run()
