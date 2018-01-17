import ReactDOM from 'react-dom';
import React from 'react';
import {Graficador} from "./Grafico.js"
import {EscuchaFrecuencia} from "./EscuchaFrecuencia.js"



export class Oyente extends React.Component{
    constructor(props){
        super(props);
        
        
        audioStreamPromise.then((stream)=>{
            console.log("OIGO!")
            let audioContext=new AudioContext();
            this.audioContext=audioContext;
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
            error:{}
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
            
            <ul>{escuchados}</ul>
            {this.props.frecuenciasEscucho}
            porque {escuchados.length}
            y porque {this.props.frecuenciasEscucho.length}
            y ademas {this.state.dataArray.length}
            Y el error es {this.state.error.toString()} {Object.keys(this.state.error)} {Object.keys(this.state.error).length}
        </span>
        
    }
}