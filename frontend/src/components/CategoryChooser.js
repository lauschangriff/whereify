import React, {useState} from "react";
import {Carousel, Form, Button} from 'react-bootstrap';
import img_cat from "../assets/categories.png"
import img_merge from "../assets/merge_files.png"
import img_loc from "../assets/gpx_show.png"

function CategoryChooser() {

    const [index, setIndex] = useState(2);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const mergeFiles = (event) => {
        event.preventDefault();
        console.log(event);
        fetch('http://localhost:7223/trackdata/merge', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify("")
        }).then(response => response.json())
    }

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
            <Carousel.Item style={{'height': "300px"}}>
                <img
                    className="d-block w-100"
                    src={img_cat}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h3></h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item style={{'height': "300px"}}>
                <img
                    className="d-block w-100"
                    src={img_merge}
                    alt="Third slide"
                />

                <Carousel.Caption>
                    <h3>Merge GPX tracks</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item style={{'height': "300px"}}>
                <img
                    className="d-block w-100"
                    src=""
                    alt="Third slide"
                />
                <Carousel.Caption>
                    <h3>Location Services</h3>
                    <Form onSubmit={mergeFiles}>
                        <Form.Group>
                            <Form.File
                                className="position-relative"
                                required
                                name="track1"
                                label="Track 1"
                                id="gpx_tracK_01"
                                feedbackTooltip
                            />
                            <Form.File
                                className="position-relative"
                                required
                                name="track2"
                                label="Track2"
                                id="gpx_tracK_02"
                                feedbackTooltip
                            />
                        </Form.Group>
                        <Button type="submit">Submit form</Button>
                    </Form>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
};

export default CategoryChooser;