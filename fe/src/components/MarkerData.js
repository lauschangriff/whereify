import React from "react";
import CustomMarker from "./CustomMarker"

function MarkerData({markers}) {

    return (
        markers.map((marker, idx) =>
            <CustomMarker
                positionData={marker.position}
                title={marker.title}
                description={marker.description}
                key={`marker-${idx}`}
            />
        )

    )

}

export default MarkerData;