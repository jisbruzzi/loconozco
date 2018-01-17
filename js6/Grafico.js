import ReactDOM from 'react-dom';
import React from 'react';

let audioStreamPromise=navigator.mediaDevices.getUserMedia({audio: true, video:false})

export function Graficador(props){

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

        if(canvas==null) return <span></span>;

        let ctx=canvas.getContext("2d");
        let dataArray = props.datos;
        
        ctx.fillStyle="blue";
        
            
            ctx.clearRect(0,0,canvas.width,canvas.height);
            
            ctx.fillRect(0,0,300,300);
            ctx.strokeStyle="black";
            ctx.beginPath();
            ctx.moveTo(0,300);

            /*

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
                

            }
            */

            







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


            return <span></span>

}