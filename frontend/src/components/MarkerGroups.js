import React, {useState, useEffect} from "react";
import MarkerData from "./MarkerData";

function MarkerGroups({activeMarkerLabels}) {
    const [markersFue, setMarkersFue] = useState([]);
    const [markersNeu, setMarkersNeu] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:7223/locations/neuried`)
            .then(response => response.json())
            .then(json => {
                const markerData = [];
                json.map(m => {
                    const mTemp = {
                        position: m.latlng, description: m.desc, title: m.title
                    }
                    markerData.push(mTemp);
                });
                setMarkersNeu(markerData);
            });
        fetch(`http://localhost:7223/locations/fuerstenried_west`)
            .then(response => response.json())
            .then(json => {
                const markerData = [];
                json.map(m => {
                    const mTemp = {
                        position: m.latlng, description: m.desc, title: m.title
                    }
                    markerData.push(mTemp);
                });
                setMarkersFue(markerData);
            });
    }, []);


    return (
        <div>
            <MarkerData markers={markersFue}/>
            <MarkerData markers={markersNeu}/>
        </div>
    )

}

export default MarkerGroups