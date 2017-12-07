const express = require("express");
const app=express();
app.use("/",express.static("./"));
//app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3030,()=>console.log("listening!"));

require("./myHost")(app)