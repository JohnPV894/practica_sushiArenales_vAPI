import  express  from "express";
import dotenv from "dotenv";
import { MongoClient,ObjectId } from "mongodb";
dotenv.config();

const puerto = 3000;
const app = express();

app.use(express());

app.listen(puerto,() =>{
      console.log("Escuchando en el puerto 3000 , http://localhost:"+puerto);
});

const NOMBRE_DB = process.env.db_nombre || "fichas_ae";
const NOMBRE_COLECCION = "fichas"; 

let coleccionPedidos: any;
let coleccionMesas:any;

(
      async() =>{
            try {
                  let cliente = new MongoClient(process.env.URI_MONGO || "mongodb://localhost:27017");
                  await cliente.connect();
                  coleccionMesas = cliente.db("sushi").collection("mesas");
                  coleccionPedidos = cliente.db("suhi").collection("pedidos");
            } catch (error) {
                  console.error("Fallo conexion a mongo"+error)
            }

      }
)();

async function obtenerColeccion_pedidos(coleccion:String) {
      try {
            return(await coleccionPedidos.find({}).toArray());
      } catch (error) {
            return{mensaje:"Error: " + error};
      }
}
