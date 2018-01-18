import ReactDOM from 'react-dom';
import React from 'react';

export function EscuchaFrecuencia(props){
    let banda=Math.ceil(props.frecuencia/props.sampleRate*props.fftSize);
    let dataArray=props.datos;
    let valor=dataArray[banda];


    let valorCoeficiente=Array.from(Array(100).keys())
        .map((v,i,a)=>Math.floor(i-a.length/2))//de -20 a 20
        .filter((v)=>v!=0)//sin 0
        .map( (v,i,a) => [v+banda,v/(a.length/2)])//de banda-20 a banda+20, de -1 a 1
        .map( v => [v[0],1/Math.sqrt(2*Math.PI)*Math.exp(-0.5*v[1]*v[1])])//agrego la distribución en el segundo item
        .filter((v)=>v[0]>=0 && v[0]<dataArray.length)//filtro los externos
        .map((v)=>[dataArray[v[0]],v[1]]);//agrego el valor en el primer item
    
    let sumaCoeficientes=valorCoeficiente
        .map((v)=>v[1])
        .reduce((a,b)=>a+b,0);
    
    let promedioPonderado=valorCoeficiente
        .map((v)=>v[0]*v[1]/sumaCoeficientes)
        .reduce((a,b)=>a+b,0);

    
        let asd=Array.from(Array(100).keys())
        .map((v,i,a)=>Math.floor(i-a.length/2))//de -20 a 20
    
    if(valor>1.5*promedioPonderado && valor>5){
        return <li>Estoy escuchando a {props.nombre}</li>
    }else{
        return <li> No escucho a {props.nombre}</li>
    }
}