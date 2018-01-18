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
            jugadores:[],
            volumen:0.1,
            nombre:""
        }
        
        this.analyser=null;
        
        this.socket=io();

        
        this.socket.on("bienvenida",(args)=>{
            console.log(args);
            this.setState({frecuencia:args.frecuencia});
        })

        this.socket.on("cambios",(args)=>{
            console.log("LOS JUGADORES QUE TENGO SON:")
            console.log(args);
            this.setState({jugadores:args});
        })
    }

    cambiaVolumen(nuevo){
        this.setState({volumen:nuevo})
    }

    nuevoNombre(nombre){
        this.setState({nombre})
        this.socket.emit("hola",{nombre});
    }

    render(){
        let preNombre=<IngresaNombre callback={this.nuevoNombre.bind(this)}/>
        let postNombre=<div style={{
            display:"flex",
            flexDirection:"column",
            width:"100%",
            height:"100%",
            overflow:"hidden"
        }}>
            
            <Oyente jugadores={this.state.jugadores}/>
            <BotonPulso frecuencia={this.state.frecuencia} volumen={this.state.volumen}/>
            
            <CambiaVolumen volumen={this.state.volumen} callback={this.cambiaVolumen.bind(this)}/>
        
        </div>

        //

        

        return <span>
            {this.state.nombre===""?preNombre:postNombre}
        </span>
    }
    
}