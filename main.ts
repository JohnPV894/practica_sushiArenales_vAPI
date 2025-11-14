import  express  from "express";
import dotenv from "dotenv";
import { MongoClient,ObjectId } from "mongodb";
dotenv.config();


const NOMBRE_DB = process.env.db_nombre || "fichas_ae";

let coleccionPedidos: any;
let coleccionMesas:any;
let cliente:any;


async function main() {

      try {
            cliente = new MongoClient(process.env.URI_MONGO || "mongodb://localhost:27017");
            await cliente.connect();
            coleccionMesas =await cliente.db("sushi").collection("mesas");
            coleccionPedidos =await cliente.db("sushi").collection("pedidos");

      } catch (error) {
            console.error("Fallo conexion a mongo"+error)
            process.exit(1); // Salir si la DB falla
      }

      const puerto = 3000;
      const app = express();

      app.use(express.json());

      app.listen(puerto,() =>{
            console.log("Escuchando en el puerto 3000, http://localhost:"+puerto);
      });

}
main();



async function obtenerColeccion_pedidos() {
      try {
            return ( await cliente.db("sushi").collection("pedidos").find().toArray() );
      } catch (error) {
            return {mensaje:"Error: " + error};
      }
}
async function obtenerColeccion_mesas() {
      try {
            return( await cliente.db("sushi").collection("mesas").find().toArray() );
      } catch (error) {
            return{mensaje:"Error: " + error};
      }
}
async function obtenerColeccion_productos() {
      try {
            return( await cliente.db("sushi").collection("productos").find().toArray() );
      } catch (error) {
            return{mensaje:"Error: " + error};
      }
}



