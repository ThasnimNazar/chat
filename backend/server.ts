import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import { connectDB } from './Connections/connection';
import userroute from './Routes/userRoutes';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http';
import { initializeSocketIO } from './Connections/socket';
import { setupSwagger } from './swaggerConfig';




dotenv.config()

const app = express();
connectDB();

const port = process.env.PORT || 5000;
const server = http.createServer(app);
initializeSocketIO(server);   


const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  sameSite: 'Lax'
};




app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(req.method, req.path, req.body); // Log method, path, and body
  next();
});


app.use('/api/user',userroute)


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Node.js + Express!');
});

setupSwagger(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});