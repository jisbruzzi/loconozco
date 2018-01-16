import ReactDOM from 'react-dom';
import React from 'react';
//export class App extends React.Component
let audioStreamPromise=navigator.mediaDevices.getUserMedia({audio: true, video:false})
export class App extends React.Component{

    constructor(props){
        super(props);
        this.frecuencia=0;
        this.frecuenciasEscucho=[];
        
        
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

        socket.on("cambios",(args)=>{
            console.log("LOS JUGADORES QUE TENGO SON:")
            console.log(args);
            this.frecuenciasEscucho=args.map((o)=>o.frecuencia);
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

            //---------------chequear las frecuencias
            for(let frecuenciaBusco of this.frecuenciasEscucho){
                let banda=Math.ceil(frecuenciaBusco/this.audioContext.sampleRate*this.analyser.fftSize);
                let valor=dataArray[banda];

                let valorCoeficiente=(new Array(100))
                    .map((v,i,a)=>Math.floor(i-a.length/2))//de -20 a 20
                    .filter((v)=>v!=0)//sin 0
                    .map( v => [v+banda,v/(a.length/2)])//de banda-20 a banda+20, de -1 a 1
                    .map( v => [v[0],1/Math.sqrt(2*Math.PI)*Math.exp(-0.5*v[1]*v[1])])//agrego la distribución en el segundo item
                    .filter((v)=>v[0]>=0 && v[0]<dataArray.length)//filtro los externos
                    .map((v)=>[dataArray[v[0]],v[1]]);//agrego el valor en el primer item
                
                let sumaCoeficientes=valorCoeficiente
                    .map((v)=>v[1])
                    .reduce((a,b)=>a+b,0);
                
                let promedioPonderado=valorCoeficiente
                    .map((v)=>v[0]*v[1]/sumaCoeficientes)
                    .reduce((a,b)=>a+b,0);

                
                
                if(valor>1.5*promedioPonderado && valor>20){
                    console.log("Escucho a este!!",frecuenciaBusco);
                    console.log(valor,promedioPonderado);
                }
                
                

                /*
                let promedioCircundante=0;
                let qt=0;
                for(let i=0;i<40;i++){
                    let bandaPromediar = banda+i-20;
                    if(bandaPromediar>=0){
                        promedioCircundante+=dataArray[bandaPromediar];
                        qt+=1;
                    }
                }
                promedioCircundante/=qt;
                

                if(valor>promedioCircundante*1.5){
                    console.log("Escucho a este!!",frecuenciaBusco);
                }
                */
                

            }

            







            //-----------------listo lo de chequear las frecuencias

            
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