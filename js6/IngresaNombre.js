import ReactDOM from 'react-dom';
import React from 'react';

export class  IngresaNombre extends React.Component{
    constructor(props){
        super(props);
        this.state={
            nombre:""
        }
    }
    render(){
        return <div>
            Tu nombre: 
            <input 
                type="text" 
                value={this.state.nombre} 
                onChange={this.onChange.bind(this)}
            /> 
            <button 
                onClick={this.onSubmit.bind(this)} 
            >enviar</button>
        </div>
    }
    onSubmit(){
        this.props.callback(this.state.nombre);
    }
    onChange(e){
        this.setState({nombre:e.target.value})
    }
    
}