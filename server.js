const express = require("express");
const app=express();
app.use("/",express.static("./"));
//app.get('/', (req, res) => res.send('Hello World!'))
let server = app.listen(3030,()=>console.log("listening!"));

let io=require("socket.io")(server);

let descriptores={};
io.on("connection",function(socket){
    console.log("SE CONECTO ALGIUEN WTF");
    console.log(descriptores);
    let secreto=Math.random();
    let frecuencia=Math.random()*10000;
    socket.emit("bienvenida",{secreto,frecuencia})
    descriptores[secreto]={};
    socket.on("disconnect",()=>{
        descriptores[secreto]=undefined;
        delete descriptores[secreto];
        console.log(descriptores);
    })
})

require("./myHost")(app)