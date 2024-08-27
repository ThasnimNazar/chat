"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = require("./Connections/connection");
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./Connections/socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, connection_1.connectDB)();
const port = process.env.PORT || 5000;
const server = http_1.default.createServer(app);
(0, socket_1.initializeSocketIO)(server);
const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    sameSite: 'Lax'
};
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    console.log(req.method, req.path, req.body); // Log method, path, and body
    next();
});
app.use('/api/user', userRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello, TypeScript + Node.js + Express!');
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
