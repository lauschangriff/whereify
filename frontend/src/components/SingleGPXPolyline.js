import React from "react";
import {Marker, Polyline} from "react-leaflet";

function SingleGPXPolyline(gpxData, key) {

    let colorarray = ["#EBDAFD", "#1A1C18", "#610536", "#EA1889", "#FFCF00", "#33DDFF", "#0087A2", "#A2000D","#EB9F02"]

    function extractPoints() {
        const points = [];
        for (let v of gpxData.gpxData.points) {
            const mTemp = {lat: v.lat, lon: v.lon}
            points.push(mTemp);
        }
        return points;
    }

    function getColor(){
        return colorarray[Math.floor(Math.random() * 10)];
    }

    return (
        <div>
            <Polyline
                key={key}
                positions={extractPoints()}
                color={getColor()}
                weight="5"/>
            <Marker position={gpxData.gpxData.first}/>
            <Marker position={gpxData.gpxData.last}/>
        </div>
    )
}

export default SingleGPXPolyline