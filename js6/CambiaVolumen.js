import ReactDOM from 'react-dom';
import React from 'react';

export function CambiaVolumen(props){
    let actual=props.volumen;

    function haceCallback(q){
        return function(e){
            props.callback(actual+q);
        }
    }
    return <div style={{
        width:"100vw",
        height:"25vw",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center"

    }}>
        <button
            style={{width:"20vw",height:"20vw"}}
            onClick={haceCallback(-0.01)}
        >--</button>
        <button
            style={{width:"20vw",height:"20vw"}}
            onClick={haceCallback(-0.001)}
        >-</button>
        <span>{actual.toFixed(3)}</span>
        <button
            style={{width:"20vw",height:"20vw"}}
            onClick={haceCallback(0.001)}
        >+</button>
        <button
            style={{width:"20vw",height:"20vw"}}
            onClick={haceCallback(0.01)}
        >++</button>
    </div>
}