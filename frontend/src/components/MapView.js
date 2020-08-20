import React, {useState, useEffect} from 'react';
import {Map, ZoomControl, TileLayer, LayersControl} from 'react-leaflet';
import axios from 'axios';
import Dropzone from 'react-dropzone'
import {Button, Modal, Image, ListGroup, Navbar, Nav} from "react-bootstrap";
import GPXPolylines from "./GPXPolylines";
import {getLatLngCenter} from "./Util";
import logo from '../assets/logo.png'
import navstyle from '../clientlibs/nav.module.scss';
import trackstyle from '../clientlibs/trackinfo.module.scss';
import menustyle from '../clientlibs/menu.module.scss';
import modalstyle from '../clientlibs/modal.module.scss';
import dropstyle from '../clientlibs/dropzone.module.scss'
import '../clientlibs/leaflet-custom.css'
import '../clientlibs/merger.scss'


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
    const [distances] = useState([]);

    let firstLoad = true;


    useEffect(() => {
        if (firstLoad) {
            axios.get("api/user")
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
        axios.post("api/pathweb", formData)
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
                setZoom(12);
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

        axios.post("api/createmergedfile", fd)
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
            <Navbar bg="light" variant="light" className={navstyle.navbar_custom}>
                <Navbar.Brand><Image className={navstyle.titleimage} src={logo} rounded/></Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link className={navstyle.header_link} onClick={() => setShowHelp(true)}>Info</Nav.Link>
                    <Nav.Link className={navstyle.header_link} onClick={() => setShowFeatures(true)}>Features</Nav.Link>
                    <Nav.Link className={navstyle.header_link} onClick={() => setImpressum(true)}>Impressum</Nav.Link>
                    <Nav.Link
                        className={ files.length < 1 ? navstyle.invisible : navstyle.headerDownload}
                        onClick={() => setShowDownload(true)}>Download</Nav.Link>
                </Nav>
            </Navbar>
            <div className={distances.length > 0 ? trackstyle.trackinfo : trackstyle.trackinfo_invisible}>
                <ListGroup defaultActiveKey="#link1">
                    <ListGroup.Item>Tracklänge</ListGroup.Item>
                    {distances.map((dist, id) => {
                        return <ListGroup.Item className={trackstyle.custom_list_item}
                                               key={id}>Track {id + 1}: {dist} km</ListGroup.Item>
                    })}
                </ListGroup>
            </div>
            <div className={menustyle.menubox}>
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
                    <Modal.Body className={modalstyle.modalStyleBody}>
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
                    <Modal.Body className={modalstyle.modalStyleBody}>
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
                    <Modal.Body className={modalstyle.modalStyleBody}>
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
                    <Modal.Body className={modalstyle.modalStyleBody}>
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
                <section className={dropstyle.container}>
                    <Dropzone onDrop={acceptedFiles => handleFile(acceptedFiles)}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                                <div {...getRootProps()} className={dropstyle.dropzone}>
                                    <input {...getInputProps()} />
                                    <p className={dropstyle.inner_font}><strong>.gpx Datei
                                        hinzufügen</strong> [Drag'n'Drop oder
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
        </div>
    )

}

export default MapView

