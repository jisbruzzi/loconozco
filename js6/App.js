import ReactDOM from 'react-dom';
import React from 'react';
import {Instrucciones} from "./Instrucciones.js"
import {BotonPulso} from "./BotonPulso.js"
import {Oyente} from "./Oyente.js"

export class App extends React.Component{

    constructor(props){
        super(props);
        this.state={
            frecuencia:0
        }
        this.frecuenciasEscucho=[];
        
        this.analyser=null;
        
        let socket=io();
        socket.emit("hola");
        socket.on("bienvenida",(args)=>{
            console.log(args);
            this.setState({frecuencia:args.frecuencia});
        })

        socket.on("cambios",(args)=>{
            console.log("LOS JUGADORES QUE TENGO SON:")
            console.log(args);
            this.frecuenciasEscucho=args.map((o)=>o.frecuencia);
        })
    }

    render(){
        return <span>
            <Instrucciones/>
            <Oyente/>
            <BotonPulso frecuencia={this.state.frecuencia}/>
        </span>
    }
    
}