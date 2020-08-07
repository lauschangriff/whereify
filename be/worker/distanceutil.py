from geopy import distance


class DistanceUtil:

    @staticmethod
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
