import ReactDOM from 'react-dom';
import React from 'react';
//export class App extends React.Component
export class App extends React.Component{

    constructor(props){
        super(props);
        this.state={
            address:""
        }
        fetch("/address").then(r => r.text()).then( address =>this.setState({address}));

        let socket=io();
        socket.emit("hola");
        socket.on("bienvenida",(args)=>{
            console.log(args);
            let audioContext=new AudioContext();
            let oscillator=audioContext.createOscillator();
            oscillator.frequency.value=args.frecuencia;
            oscillator.connect(audioContext.destination);
            oscillator.start();
            oscilator.stop(audioContext.currentTime+2);
            

        })
    }

    render(){
        return <span>hola, conectate entrando a {this.state.address}</span>;
    }
    
}