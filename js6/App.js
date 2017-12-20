import ReactDOM from 'react-dom';
import React from 'react';
//export class App extends React.Component

let audioStreamPromise=navigator.mediaDevices.getUserMedia({audio: true, video:false})

export class App extends React.Component{

    constructor(props){
        
        super(props);
        this.analyser=null;
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
            oscillator.stop(audioContext.currentTime+2);
        })

        audioStreamPromise.then((stream)=>{
            
            let audioContext=new AudioContext();
            let source=audioContext.createMediaStreamSource(stream);
            var analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 2048;
            this.analyser=analyser;
            
            
        })
    }

    componentDidMount(){
        let canvas=document.getElementById("canvas");
        let ctx=canvas.getContext("2d");
        let dataArray = null;
        ctx.strokeStyle="black";
        ctx.fillStyle="blue";
        let f = (t)=>{
            window.requestAnimationFrame(f)
            if(this.analyser==null) return;

            if(dataArray==null) dataArray=new Uint8Array(this.analyser.frequencyBinCount); 
 
            this.analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0,0,canvas.width,canvas.height);
            
            ctx.fillRect(0,0,300,300);
            ctx.beginPath();
            ctx.moveTo(0,300);
            //dataArray=[0,0.5,0.3];
            for(let i=0;i<dataArray.length;i++){
                ctx.lineTo(i/dataArray.length*300,300-dataArray[i]/256*300);
            }
            ctx.stroke();

            
        };
        window.requestAnimationFrame(f);
    }

    render(){
        return <span>
            <span>hola, conectate entrando a {this.state.address}</span>
            <canvas id="canvas" width="300" height="300"></canvas>
        </span>
    }
    
}