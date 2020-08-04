import React from "react";
import SingleGPXPolyline from "./SingleGPXPolyline";

function GPXPolylines({userTrackData}) {

    return (
        <div>{
            userTrackData.map((d,key) =>
                (
                    <SingleGPXPolyline gpxData={d} key={key}/>
                ))
        }</div>
    )
}

export default GPXPolylines