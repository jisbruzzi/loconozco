import ReactDOM from 'react-dom';
import React from 'react';
export class Instrucciones extends React.Component{
    constructor(props){
        super(props);
        this.state={
            address:""
        }
        
        fetch("/address").then(r => r.text()).then( address =>this.setState({address}));
    }

    render(){
        return <span>hola, conectate entrando a https://{this.state.address}</span>
    }
}