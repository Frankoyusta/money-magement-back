import express from 'express';
import 'dotenv/config';
import { router as authRouter } from './routes/auth.routes';


// Creamos el servidor de express
const app = express();

//Directorio publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());


// Rutas de autenticación
app.use('/api/auth', authRouter)

// // Rutas de gastos
// app.use('/', (req, res) => { })

// // Rutas de administración
// app.use('/', (req, res) => { })


// Escuchar peticiones

app.listen(process.env.PORT ?? 3001, () => {
    console.log('servidor corriendo en el puerto', process.env.PORT ?? 3001);
})