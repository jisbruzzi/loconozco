import ReactDOM from 'react-dom';
import React from 'react';
import {Instrucciones} from "./Instrucciones.js"
import {ListaJugadores} from "./ListaJugadores.js"

export class Pantalla extends React.Component{
    constructor(props){
        super(props);
        this.state={
            empezado:false,
            jugadores:[]
        }
        let socket=io();
        this.socket=socket;

        socket.emit("pantalla")

        socket.on("cambios",(args)=>{
            console.log("LOS JUGADORES QUE TENGO SON:")
            console.log(args);
            this.setState({jugadores:args});
        })
    }
    empezar(){
        alert("Y empieza")
        this.setState({empezado:true})
        this.socket.emit("empezar")
    }
    render(){
        return <div>
        <Instrucciones/>
        {!this.state.empezado?
            <span>
                <ListaJugadores jugadores={this.state.jugadores}/>
                <button onClick={this.empezar.bind(this)}>Ya estamos todos:Empezar</button>
            </span>:
            <ListaJugadores jugadores={this.state.jugadores}/>
        }
        
    </div>

    }
    
}