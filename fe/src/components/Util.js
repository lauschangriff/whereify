const rad2degr = (rad) => {
    return rad * 180 / Math.PI;
}

const degr2rad = (degr) => {
    return degr * Math.PI / 180;
}

export const getLatLngCenter = (userTracks) => {

    let allPoints = [];
    for (let v of userTracks) {
        for (let point of v.points) {
            const mTemp = {lat: point.lat, lon: point.lon}
            allPoints.push(mTemp);
        }
    }

    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    for (let i = 0; i < allPoints.length; i++) {
        let lat = degr2rad(allPoints[i].lat);
        let lng = degr2rad(allPoints[i].lon);
        // sum of cartesian coordinates
        sumX += Math.cos(lat) * Math.cos(lng);
        sumY += Math.cos(lat) * Math.sin(lng);
        sumZ += Math.sin(lat);
    }

    let avgX = sumX / allPoints.length;
    let avgY = sumY / allPoints.length;
    let avgZ = sumZ / allPoints.length;

    // convert average x, y, z coordinate to latitude and longtitude
    let lng = Math.atan2(avgY, avgX);
    let hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    let lat = Math.atan2(avgZ, hyp);

    return ([rad2degr(lat), rad2degr(lng)]);
}

export const getBackendHost = () => {
    let port = 5000;

    if (window.location.host.includes("localhost")) {
        return "http://localhost:" + port;
    } else {
        return "https://gpxtool.de:" + port;
    }
}