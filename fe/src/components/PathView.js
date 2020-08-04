import React, {useState, useEffect} from "react";
import {Polyline} from "react-leaflet";

function PathView() {
    const [points, setPoints] = useState([
        [45.51, -122.68],
        [37.77, -122.43],
        [34.04, -118.2]]
    );

    useEffect(() => {
        fetch(`http://localhost:7223/locations/path`)
            .then(response => response.json())
            .then(json => {
                const points = [];
                json.map(m => {
                    const mTemp = {lat: m.lat, lon: m.lon}
                    points.push(mTemp);
                });
                setPoints(points);
            });
    }, []);

    return (
        <Polyline
            positions={points}
            color="red"
            weight="7"/>
    )
}

export default PathView