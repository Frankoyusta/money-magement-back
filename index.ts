import express from 'express';
import 'dotenv/config';
import { router as authRouter } from './routes/auth.routes';
import cors from 'cors'
import cookieParser from 'cookie-parser';

// Creamos el servidor de express
const app = express();

//Directorio publico
app.use(express.static('public'));

// CORS
app.use(cors())

// Para poder ller las cookies
app.use(cookieParser());


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