import ReactDOM from 'react-dom';
import React from 'react';
import {Graficador} from "./Grafico.js"
import {EscuchaFrecuencia} from "./EscuchaFrecuencia.js"


let audioStreamPromise=navigator.mediaDevices.getUserMedia({audio: true, video:false})

export class Oyente extends React.Component{
    constructor(props){
        super(props);
        audioStreamPromise.then((stream)=>{
            let audioContext=new AudioContext();
            this.audioContext=audioContext;
            let source=audioContext.createMediaStreamSource(stream);
            var analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 2048;
            this.analyser=analyser;
        })

        this.state={
            dataArray:[]
        }
    }

    componentDidMount(){
        let dataArray = null;

        let f = (t)=>{

            if(this.analyser==null) {
                window.requestAnimationFrame(f)
                return;
            }

            if(dataArray==null) dataArray=new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(dataArray);
            this.setState({dataArray});
            window.requestAnimationFrame(f)
        }
        window.requestAnimationFrame(f);
    }

    render(){

        let escuchados=[];
        if(this.audioContext){
            escuchados=this.props.frecuenciasEscucho.map((f)=>
                <EscuchaFrecuencia 
                    datos={this.state.dataArray} 
                    frecuencia={f}
                    sampleRate={this.audioContext.sampleRate}
                    fftSize={this.analyser.fftSize}
                />
            )
        }
        

        return <span>
            <canvas id="canvas" width="300" height="300"></canvas>
            <Graficador datos={this.state.dataArray}/>
            <ul>{escuchados}</ul>
        </span>
    }
}