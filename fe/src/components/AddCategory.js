import React from "react";
import {Form, Button} from 'react-bootstrap';

function AddCategory() {
    return (
        <Form className="add-category-overlay">
            <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="text" label="Category name" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Category
            </Button>
        </Form>
    )
};

export default AddCategory