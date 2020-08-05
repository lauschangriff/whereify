from flask import Flask, request, jsonify
from flask_cors import CORS
from bson.json_util import dumps
from be.worker.path import Points

app = Flask(__name__)
CORS(app)



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
    file = request.files['file']
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


app.run(host="0.0.0.0", port=7223)
