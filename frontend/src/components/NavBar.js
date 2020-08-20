import React, {useState} from "react";
import {ToggleButton,ButtonGroup} from "react-bootstrap";


function NavBar(){

    const radios = [
        { name: 'GPX Upload', value: '1' },
        { name: 'my Tracks', value: '2' },
        { name: 'my Locations', value: '3' },
    ];

    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('1');

    return(
        <ButtonGroup toggle>
            {radios.map((radio, idx) => (
                <ToggleButton
                    key={idx}
                    size="LG"
                    type="radio"
                    variant="primary"
                    name="radio"
                    value={radio.value}
                    checked={radioValue === radio.value}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                    {radio.name}
                </ToggleButton>
            ))}
        </ButtonGroup>
        )
}

export default NavBar