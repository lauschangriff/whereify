from flask import Flask, request, jsonify
from flask_cors import CORS
import lxml.etree as etree
from geopy import distance
import datetime
from bson.json_util import dumps

app = Flask(__name__)

CORS(app)


@app.route('/api/pathweb', methods=['POST'])
def route_get_path_web():
    print('/api/pathweb')
    file = request.files['file']
    trkpts = get_path_from_web(file)
    distance = calculate_distance_of_track(trkpts)
    response = {"distance": distance, "points": trkpts}
    return dumps(response)


def get_path_from_web(track):
    doc = etree.parse(track)
    root = doc.getroot()
    points = []
    # iterate through all
    for child in root:
        if 'trk' in child.tag:
            for point in child:
                if 'trkseg' in point.tag:
                    for trkpt in point:
                        points.append(trkpt.attrib)
    return points


def calculate_distance_of_track(trkpoints):
    dist = 0
    i = 0
    tkrcount = len(trkpoints)
    while i < tkrcount:
        if i == tkrcount - 1:
            break
        pt1 = (float(trkpoints[i]['lat']), float(trkpoints[i]['lon']))
        pt2 = (float(trkpoints[i + 1]['lat']), float(trkpoints[i + 1]['lon']))
        dist = dist + distance.distance(pt1, pt2).km
        i = i + 1
    return round(dist, 2)


@app.route('/api/createmergedfile', methods=['POST'])
def route_get_merged_file():
    trks = []
    for file in request.files.getlist("file"):
        trks.append(get_full_trk(file))

    gpxString = get_gpx_head("tour_zusammengefuehrt")

    for wrapper in trks:
        for trkpoint in wrapper:
            gpxString = gpxString + '<trkpt lat="' + trkpoint["lat"] + '" lon="' + trkpoint["lon"] + '"><ele>' + \
                        trkpoint["ele"] + '</ele><time>' + trkpoint["time"] + '</time></trkpt>'

    gpxString = gpxString + get_gpx_footer()

    return gpxString


def get_full_trk(track):
    doc = etree.parse(track)
    root = doc.getroot()
    trks = []

    # iterate through all
    for child in root:
        if 'trk' in child.tag:
            for point in child:
                if 'trkseg' in point.tag:
                    for trkpt in point:
                        trkdict = {"lat": trkpt.attrib["lat"], "lon": trkpt.attrib["lon"], "ele": "", "time": ""}
                        for trkpt_child in trkpt:
                            for el in trkpt_child.iter():
                                if 'ele' in el.tag:
                                    trkdict["ele"] = el.text
                                if 'time' in el.tag:
                                    trkdict["time"] = el.text
                        trks.append(trkdict)
    return trks


def get_gpx_head(name):
    return '<?xml version="1.0" encoding="UTF-8"?><gpx creator="Garmin Connect" version="1.1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/11.xsd" xmlns:ns3="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns2="http://www.garmin.com/xmlschemas/GpxExtensions/v3"><metadata><link href="connect.garmin.com"><text>Garmin Connect</text></link><time>2020-07-22T13:22:33.000Z</time></metadata><trk><name>' + name + '</name><type>cycling</type><trkseg>'


def get_gpx_footer():
    return '</trkseg></trk></gpx>'


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5000)
