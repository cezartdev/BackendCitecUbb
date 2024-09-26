// import db from "../config/db"

// class BussinessLine {
//     //Modelo SQL de la clase
//     static async initTable(): Promise<void> {
//         const createTableQuery = `
//             CREATE TABLE IF NOT EXISTS giros (
//                 codigo INT PRIMARY KEY,
//                 nombre VARCHAR(200) NOT NULL,
//                 nombre_categoria VARCHAR(200) NOT NULL,,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `;
//         const insertDataQuery = `
//             INSERT INTO giros (nombre) VALUES
//             ('construccion'),
//             ('agricultura'),
//             ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
//         `;

//         try {
//             // Crear la tabla si no existe
//             await db.query(createTableQuery);
//             // Insertar valores por defecto si es necesario
//             await db.query(insertDataQuery);
//         } catch (err) {
//             console.error('Error al inicializar la tabla tipo:', err);
//             throw err;
//         }
//     }

// }

// export default BussinessLine;