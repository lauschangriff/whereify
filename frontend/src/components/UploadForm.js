import React from "react";
import {Form, Button} from "react-bootstrap";

function UploadForm(){
    return(
        <Form inline>
            <Form.Group>
                <Form.File
                    className="position-relative"
                    required
                    name="file"
                    label="choose local GPX file"
                    id="validationFormik107"
                    feedbackTooltip
                />
            </Form.Group>
            <Button type="submit">Hochladen</Button>
        </Form>
    )
}

export default UploadForm