import ReactDOM from 'react-dom';
import React from 'react';
import {Graficador} from "./Grafico.js"


let audioStreamPromise=navigator.mediaDevices.getUserMedia({audio: true, video:false})

export class Oyente extends React.Component{
    constructor(props){
        super(props);
        audioStreamPromise.then((stream)=>{
            let audioContext=new AudioContext();
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
        return <span>
            <canvas id="canvas" width="300" height="300"></canvas>
            <Graficador datos={this.state.dataArray}/>
        </span>
    }
}