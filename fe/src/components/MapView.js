import React from 'react';
import {Map, TileLayer} from 'react-leaflet';
import MarkerData from "./MarkerData";

export default class MapView extends React.Component {

    constructor() {
        super();
        this.state = {
            markers: [{
                position: [48.082898, 11.474817], description: "CurrentLocation Marker", title: "CurrentLocation Title"
            }],
            zoom: 15,
            currentLocation: [48.082898, 11.474817]
        };
        this.fetchLocations();
    }

    addMarker = (event) => {
        const {markers} = this.state
        const m = {
            position: event.latlng, description: "Added", title: "Added"
        }
        markers.push(m)
        this.setState({markers})
    }

    fetchLocations = () => {
        console.log("fetch");
        fetch(`http://localhost:7223/locations`)
            .then(response => response.json())
            .then(json => {
                const {markers} = this.state
                json.map(m => {
                    m = {
                        position: m.latlng, description: m.desc, title: m.title
                    }
                    markers.push(m);
                })
                this.setState({markers})
            });
    }


    render() {
        return (<Map
            center={this.state.currentLocation}
            zoom={this.state.zoom}
            onClick={this.addMarker}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <MarkerData markers={this.state.markers}/>
        </Map>)
    }
}

