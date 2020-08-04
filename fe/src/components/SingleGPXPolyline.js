import React from "react";
import {Marker, Polyline} from "react-leaflet";

function SingleGPXPolyline(gpxData) {


    function extractPoints() {
        const points = [];
        for (let v of gpxData.gpxData.points) {
            const mTemp = {lat: v.lat, lon: v.lon}
            points.push(mTemp);
        }
        return points;
    }

    return (
        <div>
            <Polyline
                positions={extractPoints()}
                color="blue"
                weight="4"/>
            <Marker position={gpxData.gpxData.first}/>
            <Marker position={gpxData.gpxData.last}/>
        </div>
    )
}

export default SingleGPXPolyline