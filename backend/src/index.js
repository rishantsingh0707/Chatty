import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { server, app } from './lib/socket.js';
import path from 'path';

const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(
    cors({
        origin: true,        // reflect request origin automatically
        credentials: true,
    })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);


server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});