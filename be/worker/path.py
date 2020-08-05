import lxml.etree as etree

class Points:

    @staticmethod
    def get_path():
        doc = etree.parse('starnberg1.gpx')
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

    @staticmethod
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

    @staticmethod
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


    @staticmethod
    def get_gpx_head(name):
        return '<?xml version="1.0" encoding="UTF-8"?><gpx creator="Garmin Connect" version="1.1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/11.xsd" xmlns:ns3="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns2="http://www.garmin.com/xmlschemas/GpxExtensions/v3"><metadata><link href="connect.garmin.com"><text>Garmin Connect</text></link><time>2020-07-22T13:22:33.000Z</time></metadata><trk><name>' + name + '</name><type>cycling</type><trkseg>'

    @staticmethod
    def get_gpx_footer():
        return '</trkseg></trk></gpx>'