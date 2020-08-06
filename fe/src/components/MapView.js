import React, {useState, useEffect} from 'react';
import {Map, ZoomControl, TileLayer, LayersControl} from 'react-leaflet';
import axios from 'axios';
import Dropzone from 'react-dropzone'
import {Button, Modal} from "react-bootstrap";
import GPXPolylines from "./GPXPolylines";
import {getBackendHost, getLatLngCenter} from "./Util";


const {BaseLayer} = LayersControl

function MapView() {

    const [zoom] = useState(10);
    const [currentLocation, setCurrentLocation] = useState([48.082898, 11.474817]);
    const [userTrackData] = useState([]);
    const [files] = useState([]);
    const [showDownload, setShowDownload] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);

    let firstLoad = true;


    useEffect(() => {
        if (firstLoad) {
            axios.get("http://" + getBackendHost() + "/stats/user")
                .then((response) => {
                    console.log("visit count!")
                });
        }
        setCurrentLocation(currentLocation);
    }, [currentLocation]);

    useEffect(() => {
    }, [userTrackData]);


    const handleFile = (acceptedFiles) => {
        const formData = new FormData();
        formData.append(
            "file",
            acceptedFiles[0],
            acceptedFiles[0].name
        );
        axios.post("http://" + getBackendHost() + "/locations/pathweb", formData)
            .then((response) => {
                let gpxData = response.data;
                let firstCoordinates = gpxData[0];
                let lastCoordinates = gpxData[gpxData.length - 1];
                let gpxObject = {
                    last: lastCoordinates,
                    first: firstCoordinates,
                    points: gpxData,
                    name: acceptedFiles[0].name
                }
                userTrackData.push(gpxObject);
                setCurrentLocation(getLatLngCenter(userTrackData));
                files.push(acceptedFiles[0]);
            });
    }

    const createFile = () => {
        const fd = new FormData();
        console.log(files);
        for (const k of files) {
            fd.append('file', k, k.name);
        }

        axios.post("http://" + getBackendHost() + "/locations/createmergedfile", fd)
            .then((response) => {
                let data = new Blob([response.data], {type: 'text/xml'});
                const element = document.createElement("a");
                element.href = URL.createObjectURL(data);
                element.download = "tour_zusammengefuehrt.gpx";
                document.body.appendChild(element);
                element.click();
            });
    }


    return (
        <div>
            <style type="text/css">
                {`

    .btn-xxl {
      font-size: 2rem;
    }
    `}
            </style>
            <div className="header-box"><p className="headertext">GPX Viewer & Merger</p></div>
            <div className="button-box">
                <Button className="menu-button-help" size="xxl" variant="primary"
                        onClick={() => setShowHelp(true)}>Info</Button>
                <Button className="menu-button-download" size="xxl" variant="primary"
                        onClick={() => setShowDownload(true)}>Download</Button>
                <Button className="menu-button-download" size="xxl" variant="primary"
                        onClick={() => setShowFeatures(true)}>Features</Button>
            </div>
            <div className="menu-box">
                <Modal
                    show={showDownload}
                    onHide={() => setShowDownload(false)}
                    dialogClassName="modal-90w"
                    aria-labelledby="example-custom-modal-styling-title"
                    style={{opacity: 1}}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            <h1>Zusammengeführte Datei herunterladen</h1>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modalStyleBody">
                        {files.length > 1 ?
                            <Button variant="dark" onClick={createFile}>DOWNLOAD</Button> :
                            <p>Es müssen mindestens zwei Dateien
                                hochgeladen werden</p>}
                        <p>Du kannst die entsprechenden Dateien über dein Garmin Gerät erstellen.</p>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={showHelp}
                    onHide={() => setShowHelp(false)}
                    dialogClassName="modal-90w"
                    aria-labelledby="example-custom-modal-styling-title"
                    style={{opacity: 1}}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            <h1>Wie funktioniert es?</h1>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modalStyleBody">
                        <p>Es werden keine persönlichen Daten gesammelt bzw. gespeichert</p>
                        <p>- keine Cookies!</p>
                        <p>- JS muss aktiviert sein</p>

                        <p>Bei Fragen schreib mir eine Email an: blabla@email.de</p>

                        <div className='impressum'>
                            <h1>Impressum</h1>
                            <p>Angaben gemäß § 5 TMG</p>
                            <p>Alexander Lotz <br/>
                                Argelsrieder Straße 52<br/>
                                81475 München</p>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={showFeatures}
                    onHide={() => setShowFeatures(false)}
                    dialogClassName="modal-90w"
                    aria-labelledby="example-custom-modal-styling-title"
                    style={{opacity: 1}}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            <h1>Features</h1>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modalStyleBody">
                        <p>- GPX Files auf der Karte ansehen</p>
                        <p>- Zusammenhängende Files zusammenführen</p>
                        <hr/>
                    </Modal.Body>
                </Modal>
                <section className="container">
                    <Dropzone onDrop={acceptedFiles => handleFile(acceptedFiles)}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p className="inner_font">hinzufügen per Drag n´Drop</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </section>
            </div>
            <Map
                center={currentLocation}
                zoom={zoom}
                zoomControl={false}>
                <LayersControl position="topright">
                    <BaseLayer checked name="Openstreetmap Default">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
                    </BaseLayer>
                </LayersControl>
                <ZoomControl position="topright"/>
                <GPXPolylines userTrackData={userTrackData}/>
            </Map>
        </div>
    )

}

export default MapView

