 import authRoutes from './src/routes/auth.route.js';
 import messageRoutes from './src/routes/message.route.js';
 import dotenv from 'dotenv';
 dotenv.config();

import express from 'express';
import { connectDB } from './src/lib/db.js';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
const app = express();
const port = process.env.PORT;
app.use(express.json())
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log("Server running on PORT:", port);
  connectDB();
});

