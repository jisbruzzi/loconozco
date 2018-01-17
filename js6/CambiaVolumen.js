import ReactDOM from 'react-dom';
import React from 'react';

export function CambiaVolumen(props){
    let actual=props.volumen;

    function haceCallback(q){
        return function(e){
            props.callback(actual+q);
        }
    }
    return <span>
        <button
            onClick={haceCallback(-0.01)}
            style={{
                width:40,
                height:40
            }}

        >--</button>
        <button
            onClick={haceCallback(-0.001)}
            style={{
                width:40,
                height:40
            }}

        >-</button>
        {actual.toFixed(3)}
        <button
            onClick={haceCallback(0.001)}
            style={{
                width:40,
                height:40
            }}

        >+</button>
        <button
            onClick={haceCallback(0.01)}
            style={{
                width:40,
                height:40
            }}

        >++</button>
    </span>
}