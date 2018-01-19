import ReactDOM from 'react-dom';
import React from 'react';

export function ListaJugadores(props){
    console.log(props.jugadores);
    
    let itemsJugadores=props.jugadores.map((j)=>{
        return <li key={j.nombre}>{j.nombre}</li>
    })
    console.log(itemsJugadores)

    return <ul>
        {itemsJugadores}
    </ul>

}