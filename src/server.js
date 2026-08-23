/*import sequelize from "../src/config/sequelize.js";
import env from "../src/config/env.js"; 
import app from "./app.js";

( async() => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("DB connected");

    app.listen(env.server.port, ()=>{
        console.log("Server is Running");
    })
        
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
})();

*/