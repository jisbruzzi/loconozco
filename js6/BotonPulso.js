import ReactDOM from 'react-dom';
import React from 'react';

export class BotonPulso extends React.Component{
    constructor(props){
        super(props);
        this.audioContext=new AudioContext();
    }

    mouseDown(){
        console.log("DOWMM")
        this.oscillator=this.audioContext.createOscillator();
        this.oscillator.frequency.setValueAtTime(this.props.frecuencia,this.audioContext.currentTime);
        this.oscillator.connect(this.audioContext.destination);
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
                    width:40,
                    height:40
                }}

            ></button>
    }

}