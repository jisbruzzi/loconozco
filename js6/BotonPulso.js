import ReactDOM from 'react-dom';
import React from 'react';

export class BotonPulso extends React.Component{
    constructor(props){
        super(props);
        this.audioContext=new AudioContext();
    }

    mouseDown(){
        console.log("DOWMM")
        this.gainNode=this.oscillator=this.audioContext.createGain();
        this.gainNode.gain.value=this.props.volumen;


        this.oscillator=this.audioContext.createOscillator();
        this.oscillator.frequency.setValueAtTime(this.props.frecuencia,this.audioContext.currentTime);

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        this.oscillator.start();
    }
    mouseUp(){
        console.log("UP")
        this.oscillator.stop(this.audioContext.currentTime);
    }

    render(){
        return <button
                onTouchStart={this.mouseDown.bind(this)}
                onTouchEnd={this.mouseUp.bind(this)}
                onTouchCancel={this.mouseUp.bind(this)}
                onMouseDown={this.mouseDown.bind(this)} 
                onMouseUp={this.mouseUp.bind(this)}
                style={{
                    width:"100%",
                    height:"30vw"
                }}

            ></button>
    }

}