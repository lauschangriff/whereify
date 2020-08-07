import React, {useState, useEffect} from 'react';
import {Map, ZoomControl, TileLayer, LayersControl} from 'react-leaflet';
import axios from 'axios';
import Dropzone from 'react-dropzone'
import {Button, Modal, Image, ListGroup} from "react-bootstrap";
import GPXPolylines from "./GPXPolylines";
import {getBackendHost, getLatLngCenter} from "./Util";
import logo from '../assets/title.png'


const {BaseLayer} = LayersControl

function MapView() {

    const [zoom, setZoom] = useState(6);
    const [currentLocation, setCurrentLocation] = useState([51.097488, 10.424834]);
    const [userTrackData] = useState([]);
    const [files] = useState([]);
    const [showDownload, setShowDownload] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);
    const [showImpressum, setImpressum] = useState(false);
    const [distances, setDistances] = useState([]);

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
                let gpxData = response.data.points;
                distances.push(response.data.distance)
                let firstCoordinates = gpxData[0];
                let lastCoordinates = gpxData[gpxData.length - 1];
                let gpxObject = {
                    last: lastCoordinates,
                    first: firstCoordinates,
                    points: gpxData,
                    name: acceptedFiles[0].name
                }
                setZoom(11);
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
            <div className="header-box">
                <Image src={logo} rounded/>
            </div>
            <div className="button-box">
                <Button className="menu-button-help" size="xxl" variant="primary"
                        onClick={() => setShowHelp(true)}>Info</Button>
                <Button className="menu-button-download" size="xxl" variant="primary"
                        onClick={() => setShowFeatures(true)}>Features</Button>
                <Button className={files.length < 1 ? "menu-button-download invisible" : "menu-button-download"}
                        size="xxl" variant="primary"
                        onClick={() => setShowDownload(true)}>Download</Button>
            </div>
            <div className={distances.length > 0 ? "trackinfo" : "trackinfo invisible"}>
                <ListGroup defaultActiveKey="#link1">
                    <ListGroup.Item>Tracklänge</ListGroup.Item>
                    {distances.map((dist, id) => {
                        return <ListGroup.Item>{id + 1}: {dist} km</ListGroup.Item>
                    })}
                </ListGroup>
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
                        <Button variant="dark" size="xxl" onClick={createFile}>DOWNLOAD</Button>
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
                        <p>Die App befindet sich noch im Entwicklungstatus, keine Garantie für Richtigkeit der
                            Daten!</p>

                        <p>Um die Dateien zusammen zu führen einfach mehrere .gpx Dateien auf die vorgesehene Fläche
                            ziehen und anschließend auf den Download Button klicken</p>

                        <p>Es werden keine Daten gespeichert</p>

                        <p>Optimiert für Desktop</p>


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
                        <p>- Files zusammenführen</p>
                        <hr/>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={showImpressum}
                    onHide={() => setImpressum(false)}
                    dialogClassName="modal-90w"
                    aria-labelledby="example-custom-modal-styling-title"
                    style={{opacity: 1}}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            <h1>Impressum</h1>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modalStyleBody">
                        <div className='impressum'>
                            <p>Angaben gemäß § 5 TMG</p>
                            <p>Alexander Lotz <br/>
                                Argelsrieder Straße 52<br/>
                                81475 München<br/>
                                alexlotz [at] posteo.de</p>


                            <p>Wir verwenden <strong>keine</strong> Cookies und speichern auch keine sonstigen,
                                nutzerspezifischen Daten. Die GPS Daten werden nur zur Verarbeitung verwendet und nicht
                                persistiert.</p>
                            <p>Made with</p>
                            <ul>
                                <li>React - https://reactjs.org/</li>
                                <li>Leaflet - https://react-leaflet.js.org/</li>
                                <li>Python - https://www.python.org/</li>
                            </ul>
                        </div>
                    </Modal.Body>
                </Modal>
                <section className="container">
                    <Dropzone onDrop={acceptedFiles => handleFile(acceptedFiles)}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p className="inner_font"><strong>.gpx Datei hinzufügen</strong> [Drag'n'Drop oder
                                        Klick]</p>
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
            <div className="footer">
                <Button className="menu-button-impressum" size="xl" variant="secondary"
                        onClick={() => setImpressum(true)}>Impressum</Button>
            </div>
        </div>
    )

}

export default MapView

