const express = require("express");
const fs = require('fs');
const https = require('https');

const options = {
    cert: fs.readFileSync("./rootCA.pem"),
    key: fs.readFileSync("./rootCA.key")
};


const app=express();



app.use("/",express.static("./"));
//app.get('/', (req, res) => res.send('Hello World!'))
let server = https.createServer(options,app)
server.listen(3030,()=>console.log("listening!"));

let io=require("socket.io")(server);

let descriptores={};
io.on("connection",function(socket){
    console.log("SE CONECTO ALGIUEN WTF");

    let nombre="";

    socket.on("hola",(m)=>{
        nombre=m.nombre;
        console.log("Se conecto uno y me mando el hola")
        console.log(m);

        let frecuencia=Math.random()*3000+5000;
        socket.emit("bienvenida",{nombre,frecuencia})
        descriptores[nombre]={frecuencia};
        enviarCambios(socket);
    });
    
    console.log(descriptores);
    socket.on("disconnect",()=>{
        delete descriptores[nombre];
        console.log(descriptores);
        enviarCambios(socket);
    })
})

function enviarCambios(socket){
    socket.broadcast.emit(
        "cambios",
        Object.keys(descriptores).map((k)=>{
            return {nombre:k,frecuencia:descriptores[k].frecuencia}
        })
    )
    socket.emit(
        "cambios",
        Object.keys(descriptores).map((k)=>{
            return {nombre:k,frecuencia:descriptores[k].frecuencia}
        })
    )
}

require("./myHost")(app)