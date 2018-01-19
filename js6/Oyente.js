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
        }
        window.setInterval(f,100);

        console.log("LOs jugadores son:")
        console.log(this.props.jugadores)
        console.log("vos sos")
        console.log(this.props.nombre)
    }

    escuchaDesconocido(){
        this.props.escuchaDesconocido();
    }

    render(){

        let desconocido=""

        let miNombre=this.props.jugadores.filter(j=>j.nombre===this.props.nombre);
        if(miNombre.length>0){
            desconocido=miNombre[0].pareja;
        }

        if(desconocido==null){
            desconocido="";
        }

        let escuchados=[];
        if(this.state.audioContext && this.analyser){
            
            escuchados=this.props.jugadores.map((j)=>{
                    let callback=()=>{};
                    if(j.nombre==desconocido){
                        callback=this.escuchaDesconocido.bind(this);
                    }
                    return <EscuchaFrecuencia 
                        callback={callback}
                        datos={this.state.dataArray} 
                        frecuencia={j.frecuencia}
                        nombre={j.nombre}
                        puntaje={j.puntaje}
                        sampleRate={this.state.audioContext.sampleRate}
                        fftSize={this.analyser.fftSize}
                    />
                }
            )
            
        }


        return <div style={{
            width:"100vw",
            flexGrow:2
        }}>
            
            <ul>{escuchados}</ul>
            {desconocido!==""?
                <span>tu desconocido es :{desconocido}</span>:
                <span></span>
            }

            
        </div>

        /*
        <canvas id="canvas" width="20" height="20"></canvas>
            <Graficador datos={this.state.dataArray}/>
            **/
        

        //
        
    }
}