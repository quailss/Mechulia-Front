import React, {useState} from "react";

function ToggleButton() {
    const [isOn, setIsOn] = useState(false);

    const toggle = () => {
        setIsOn(!isOn);
    };

    return (
        <button onClick={toggle}>
            {isOn ? 'ON' : 'OFF'}
        </button>
    );
}

export default ToggleButton;