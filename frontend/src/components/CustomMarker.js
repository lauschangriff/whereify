import React from "react";
import {Popup} from "react-leaflet";
import {Marker} from "react-leaflet";

function CustomMarker({positionData, title, description}) {

    return (
        <Marker position={positionData}>
            <Popup>
                <div>{title}</div>
                <div>{description}</div>
            </Popup>
        </Marker>
    )
}

export default CustomMarker;