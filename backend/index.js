 import authRoutes from './src/routes/auth.route.js';
 import messageRoutes from './src/routes/message.route.js';
 import dotenv from 'dotenv';
 import {app,server} from './src/lib/socket.js';
 dotenv.config();

import express from 'express';
import { connectDB } from './src/lib/db.js';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const port = process.env.PORT;
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json())
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log("Server running on PORT:", port);
  connectDB();
});

