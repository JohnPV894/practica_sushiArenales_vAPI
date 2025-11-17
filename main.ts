import  express  from "express";
import dotenv from "dotenv";
import { MongoClient,ObjectId } from "mongodb";
dotenv.config();


const NOMBRE_DB = process.env.db_nombre || "fichas_ae";

let coleccionPedidos: any;
let coleccionMesas:any;
let cliente:any;
const puerto = 3000;
const app = express();

async function main() {

      try {
            cliente = new MongoClient(process.env.URI_MONGO || "mongodb://localhost:27017");
            await cliente.connect();
            coleccionMesas =await cliente.db("sushi").collection("mesas");
            coleccionPedidos =await cliente.db("sushi").collection("pedidos");

      } catch (error) {
            console.error("Fallo conexion a mongo"+error)
            process.exit(1); // Salir si la bd falla
      }


      app.use(express.json());

      app.listen(puerto,() =>{
            console.log("Escuchando en el puerto 3000, http://localhost:"+puerto);
      });

}

main();

app.get("/",
      (req,res) => { res.status(200).json({ mensaje:"peticion raiz" }); }
)
app.get("/mesas",
      async function(req,res){
            try {
                  let coleccion =  ( await cliente.db("sushi").collection("mesas").find().toArray() );
                   res.status(200).json(coleccion ); 
            } catch (error) {
                   res.status(500).json({mensaje:"Error: " + error})
            }
      }
)
app.get("/pedidos",
      async function(req,res){
            try {
                  let coleccion =  ( await cliente.db("sushi").collection("pedidos").find().toArray() );
                   res.status(200).json( coleccion ); 
            } catch (error) {
                   res.status(500).json({mensaje:"Error: " + error})
            }
      }
)
app.get("/productos",
      async function(req,res){
            try {
                  let coleccion =  ( await cliente.db("sushi").collection("productos").find().toArray() );
                   res.status(200).json(coleccion ); 
            } catch (error) {
                   res.status(500).json({mensaje:"Error: " + error})
            }
      }
)
// Obtener producto por su id
app.get("/productos/:id",
      async function(req, res){
            try {
                  let id = req.params.id;
                  let producto = await cliente.db("sushi").collection("productos").findOne({_id: new ObjectId(id) });

                  if (!producto) {
                        res.status(404).json({mensaje:"Producto no encontrado"});
                        return;
                  }
                  res.status(200).json(producto);

            } catch (error) {
                  res.status(500).json({mensaje:"Error: " + error});
            }
      }
);
// Crear un producto nuevo
app.post("/productos",
      async function(req,res){
            try {
                  let datos = req.body;

                  if(!datos.nombre || !datos.precio){
                        res.status(400).json({mensaje:"Faltan datos obligatorios"});
                        return;
                  }

                  let resultado = await cliente.db("sushi").collection("productos").insertOne(datos);

                  res.status(201).json({
                        mensaje:"Producto añadido",
                        id: resultado.insertedId,
                        ...datos
                  });

            } catch (error) {
                  res.status(500).json({mensaje:"Error: " + error});
            }
      }
);
// Crear pedido
app.post("/pedidos",
      async function(req,res){
            try {
                  let datos = req.body;

                  if(!datos.mesa || !datos.productos){
                        res.status(400).json({mensaje:"Datos incompletos"});
                        return;
                  }

                  datos.fecha = new Date();

                  let resultado = await cliente.db("sushi").collection("pedidos").insertOne(datos);

                  res.status(201).json({
                        mensaje:"Pedido registrado",
                        id: resultado.insertedId,
                        ...datos
                  });

            } catch (error) {
                  res.status(500).json({mensaje:"Error: " + error});
            }
      }
);






