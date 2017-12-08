const interfaces=require("os").networkInterfaces();

module.exports=function(app){
    app.get("/address",(req,res)=>{
        for(interface in interfaces){
            let currentInterface=interfaces[interface];
            for(let current of currentInterface){
                if(!current.internal && current.family=="IPv4"){
                    if(( current.netmask.match(/255/g) || []).length==3){
                        res.send(current.address+":3030");
                    }
                }
            }
        }
    })
}