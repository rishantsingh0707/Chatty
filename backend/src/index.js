import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { io, server, app } from './lib/socket.js';
import path from 'path';

const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.CLIENT_URL
    ],
    credentials: true,
}));
app.options("*", cors());


app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);


server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});