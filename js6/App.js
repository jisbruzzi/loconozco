import ReactDOM from 'react-dom';
import React from 'react';
import {Instrucciones} from "./Instrucciones.js"
import {BotonPulso} from "./BotonPulso.js"
import {Oyente} from "./Oyente.js"
import {CambiaVolumen} from "./CambiaVolumen.js"

import {IngresaNombre} from "./IngresaNombre.js"

export class App extends React.Component{

    constructor(props){
        super(props);
        this.state={
            frecuencia:0,
            frecuenciasEscucho:[],
            volumen:0.1,
            nombre:""
        }
        
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
            this.setState({frecuenciasEscucho:args.map((o)=>o.frecuencia)});
        })
    }

    cambiaVolumen(nuevo){
        this.setState({volumen:nuevo})
    }

    nuevoNombre(nombre){
        this.setState({nombre:nombre})
    }

    render(){
        let preNombre=<IngresaNombre callback={this.nuevoNombre.bind(this)}/>
        let postNombre=<span>
            
            <Oyente frecuenciasEscucho={this.state.frecuenciasEscucho}/>
            <BotonPulso frecuencia={this.state.frecuencia} volumen={this.state.volumen}/>
            <CambiaVolumen volumen={this.state.volumen} callback={this.cambiaVolumen.bind(this)}/>
        
        </span>

        

        return <span>
            {this.state.nombre===""?preNombre:postNombre}
        </span>
    }
    
}