const interfaces=require("os").networkInterfaces();

module.exports=function(app){
    app.get("/address",(req,res)=>{
        console.log("Me piden las interfaces");
        console.log(interfaces);
        for(interface in interfaces){
            let currentInterface=interfaces[interface];
            console.log("!!!!!!!!!!!!!")
            console.log(currentInterface);
            for(let current of currentInterface){
                console.log("**********")
                console.log(current)

                if(!current.internal && current.family=="IPv4"){
                    if(( current.netmask.match(/255/g) || []).length==3){
                        console.log("ENVIO:")
                        console.log(current.address);
                        res.send(current.address+":3030");
                    }
                }
            }
        }
    })
}