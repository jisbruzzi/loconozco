import ReactDOM from 'react-dom';
import React from 'react';
//export class App extends React.Component
export class App extends React.Component{

    constructor(props){
        super(props);
        this.state={
            address:""
        }
        fetch("/address").then(r => r.text()).then( address =>this.setState({address}));
    }

    render(){
        return <span>hola, conectate entrando a {this.state.address}</span>;
    }
    
}