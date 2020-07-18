import React from "react";
import {FormGroup, FormControl} from 'react-bootstrap';

function AddLocation() {
    return (
        <div>
            <FormGroup>
            <FormControl
                input="text"
                placeholder="name"
                value={recipient}
                onChange={updateRecipient}
            />
        </FormGroup>
            <FormGroup>
                <FormControl
                    input="number"
                    placeholder="amount"
                    value={amount}
                    onChange={updateAmount}
                />
            </FormGroup>
        </div>
    )
};

export default AddLocation;