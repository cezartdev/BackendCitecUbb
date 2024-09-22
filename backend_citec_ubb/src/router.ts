import {Router} from "express"
import db from "./config/db"


const router = Router()

router.get('/regiones', (req, res) => {
    const query = 'SELECT * FROM region_cl';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json('Error en el servidor');
        return;
      }
      
      res.status(200).json(results);
    });
  });


export default router