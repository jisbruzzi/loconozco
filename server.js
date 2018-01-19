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


function sacarCualquiera(array){
    let i=Math.floor(Math.random()*array.length);
    let elem=array[i];
    array.splice(i,1);
    return {array,e:elem};
}

console.log(sacarCualquiera([1]))
console.log(sacarCualquiera([1,2]))
console.log(sacarCualquiera([1,2,3]))

let descriptores={};


function reasignar(){
    console.log("REASIGNANDO")
    let noAsignados=Object.keys(descriptores);
    while(noAsignados.length>1){
        console.log("NoAsignados1:",noAsignados)

        let o1=sacarCualquiera(noAsignados)
        noAsignados=o1.array;

        console.log("NoAsignados2:",noAsignados)

        let o2=sacarCualquiera(noAsignados)
        noAsignados=o2.array;

        console.log("NoAsignados3:",noAsignados)

        descriptores[o1.e].pareja=o2.e;
        descriptores[o2.e].pareja=o1.e;

        console.log("descriptores:",descriptores)
    }
}

let sockets=[];

io.on("connection",function(socket){
    console.log("SE CONECTO ALGIUEN WTF");
    sockets.push(socket);

    let nombre="";

    setInterval(()=>{
        enviarCambios();
    },5000)

    socket.on("hola",(m)=>{
        nombre=m.nombre;
        console.log("Se conecto uno y me mando el hola")
        console.log(m);

        let frecuencia=Math.random()*3000+5000;
        socket.emit("bienvenida",{nombre,frecuencia})
        descriptores[nombre]={frecuencia,puntaje:0,pareja:null,escuchaDesconocido:0};
        enviarCambios();
    });

    socket.on("pantalla",(m)=>{
        enviarCambios();
    })

    socket.on("empezar",(m)=>{
        console.log("Empiezo")
        reasignar();
        enviarCambios();
    })


    socket.on("escuchoDesconocido",(m)=>{
        if(! descriptores[nombre]) return;

        let desconocido=descriptores[nombre].pareja;
        if(!descriptores[desconocido]) return;

        
        if(descriptores[nombre].pareja===m){
            console.log(nombre," escucha a su desconocido!")
            descriptores[nombre].escuchaDesconocido=Date.now();
            let diferencia = descriptores[nombre].escuchaDesconocido - descriptores[m].escuchaDesconocido;
            if(diferencia<500){
                descriptores[nombre].puntaje+=1;
                descriptores[m].puntaje+=1;
                for(let n in descriptores){
                    descriptores[n].pareja="nadie";
                }
                enviarCambios();

                setTimeout(()=>{
                    reasignar();
                    enviarCambios();
                },3000)
                
            }
        }
    })
    
    console.log(descriptores);
    socket.on("disconnect",()=>{
        delete descriptores[nombre];
        console.log(descriptores);
        enviarCambios();
    })
})

function enviarCambios(socket){
    let cambios = Object.keys(descriptores).map((k)=>{
        return {
            nombre:k,
            frecuencia:descriptores[k].frecuencia,
            puntaje:descriptores[k].puntaje,
            pareja:descriptores[k].pareja
        }
    })

    for(let s of sockets){
        s.emit(
            "cambios",
            cambios
        )

    }
    console.log("envie los cambios",cambios)
}

require("./myHost")(app)