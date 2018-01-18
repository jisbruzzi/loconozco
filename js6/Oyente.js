import ReactDOM from 'react-dom';
import React from 'react';
import {Graficador} from "./Grafico.js"
import {EscuchaFrecuencia} from "./EscuchaFrecuencia.js"



export class Oyente extends React.Component{
    constructor(props){
        super(props);
        console.log("La promesa:")
        console.log(audioStreamPromise);

        audioStreamPromise.then((stream)=>{
            console.log("OIGO!")
            let audioContext=new AudioContext();
            this.setState({audioContext});
            let source=audioContext.createMediaStreamSource(stream);
            var analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 2048;
            this.analyser=analyser;
        }).catch((e)=>{
            console.log("HUBO UN ERROR");
            console.log(Object.keys(e))
            console.log(e);
            this.setState({error:e})
        })

        this.state={
            dataArray:[],
            error:{},
            audioContext:null
        }
    }

    componentDidMount(){
        let dataArray = null;

        let f = (t)=>{

            if(this.analyser==null) {
                return;
            }

            if(dataArray==null) dataArray=new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(dataArray);
            this.setState({dataArray});
            console.log("Acá actualizando dataArray!!")
        }
        window.setInterval(f,100);
    }

    render(){

        let escuchados=[];
        console.log(this.props.jugadores)
        console.log(this.state.audioContext)
        if(this.state.audioContext){
            console.log("Hago los escuchados")
            escuchados=this.props.jugadores.map((j)=>
                <EscuchaFrecuencia 
                    datos={this.state.dataArray} 
                    frecuencia={j.frecuencia}
                    nombre={j.nombre}
                    sampleRate={this.state.audioContext.sampleRate}
                    fftSize={this.analyser.fftSize}
                />
            )
            
        }

        console.log(escuchados)

        return <div style={{
            width:"100vw",
            flexGrow:2
        }}>
            
            <ul>{escuchados}</ul>
        </div>
        
    }
}