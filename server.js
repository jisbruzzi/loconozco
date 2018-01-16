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
    
    let secreto=Math.random();
    let frecuencia=Math.random()*10000;
    socket.emit("bienvenida",{secreto,frecuencia})
    descriptores[secreto]={frecuencia};
    enviarCambios(socket);

    console.log(descriptores);
    socket.on("disconnect",()=>{
        //descriptores[secreto]=undefined;
        delete descriptores[secreto];
        console.log(descriptores);
        enviarCambios(socket);
    })
})

function enviarCambios(socket){
    socket.broadcast.emit(
        "cambios",
        Object.keys(descriptores).map((k)=>descriptores[k])
    )
}

require("./myHost")(app)