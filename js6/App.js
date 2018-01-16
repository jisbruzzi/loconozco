import ReactDOM from 'react-dom';
import React from 'react';
//export class App extends React.Component
let audioStreamPromise=navigator.mediaDevices.getUserMedia({audio: true, video:false})
export class App extends React.Component{

    constructor(props){
        super(props);
        this.frecuencia=0;
        
        
        this.audioContext=new AudioContext();
        
        this.analyser=null;
        this.state={
            address:""
        }
        fetch("/address").then(r => r.text()).then( address =>this.setState({address}));

        let socket=io();
        socket.emit("hola");
        socket.on("bienvenida",(args)=>{
            console.log(args);
            this.frecuencia=args.frecuencia;
            
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

        function promediosPorVentana(datos,cantidad){

            let ret=[];
            for(let b=0;b<cantidad;b++){
                
                let semiLargo=Math.floor(datos.length/cantidad);
                let suma=0;
                let q=0;
                for(let i=b*semiLargo;i<(b+1)*semiLargo;i++){
                    suma+=0.0+datos[i];
                    q++;
                }
                ret.push(suma/q);
            }
            return ret;
        }

        function desviacionesPorVentana(datos,cantidad){

            let ret=[];
            for(let b=0;b<cantidad;b++){
                
                let semiLargo=Math.floor(datos.length/cantidad);
                let suma=0;
                let q=0;
                for(let i=b*semiLargo;i<(b+1)*semiLargo;i++){
                    suma+=0.0+datos[i];
                    q++;
                }
                let promedio = suma/q;

                let sumaDifs=0;
                for(let i=b*semiLargo;i<(b+1)*semiLargo;i++){
                    sumaDifs+=(datos[i]-promedio)*(datos[i]-promedio);
                }

                ret.push(Math.sqrt(sumaDifs/q));
                
            }
            return ret;
        }

        let canvas=document.getElementById("canvas");
        let ctx=canvas.getContext("2d");
        let dataArray = null;
        
        ctx.fillStyle="blue";
        let f = (t)=>{
            window.requestAnimationFrame(f)
            if(this.analyser==null) return;

            if(dataArray==null) dataArray=new Uint8Array(this.analyser.frequencyBinCount); 
 
            this.analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0,0,canvas.width,canvas.height);
            
            ctx.fillRect(0,0,300,300);
            ctx.strokeStyle="black";
            ctx.beginPath();
            ctx.moveTo(0,300);
            //dataArray=[0,0.5,0.3];
            for(let i=0;i<dataArray.length;i++){
                ctx.lineTo(i/dataArray.length*300,300-dataArray[i]/256*300);
            }
            ctx.stroke();

            ctx.strokeStyle="red";
            ctx.beginPath();
            ctx.moveTo(0,300);
            let promedios=promediosPorVentana(dataArray,20)
            for(let i=0;i<promedios.length;i++){
                ctx.lineTo(i/promedios.length*300,300-promedios[i]/256*300);
            }
            ctx.stroke();

            ctx.strokeStyle="green";
            ctx.beginPath();
            ctx.moveTo(0,300);
            let desviaciones=desviacionesPorVentana(dataArray,20)
            for(let i=0;i<desviaciones.length;i++){
                ctx.lineTo(i/desviaciones.length*300,300-(promedios[i]+2.5*desviaciones[i])/256*300);
            }
            ctx.stroke();
            
        };
        window.requestAnimationFrame(f);
    }

    mouseDown(){
        console.log("DOWMM")
        this.oscillator=this.audioContext.createOscillator();
        this.oscillator.frequency.setValueAtTime(this.frecuencia,this.audioContext.currentTime);
        this.oscillator.connect(this.audioContext.destination);
        this.oscillator.start();
    }
    mouseUp(){
        console.log("UP")
        this.oscillator.stop(this.audioContext.currentTime);
    }

    render(){
        return <span>
            <span>hola, conectate entrando a {this.state.address}</span>
            <canvas id="canvas" width="300" height="300"></canvas>
            <button
                onTouchStart={this.mouseDown.bind(this)}
                onTouchEnd={this.mouseUp.bind(this)}
                onTouchCancel={this.mouseUp.bind(this)}
                onMouseDown={this.mouseDown.bind(this)} 
                onMouseUp={this.mouseUp.bind(this)}
                style={{
                    width:40,
                    height:40
                }}

            ></button>
        </span>
    }
    
}