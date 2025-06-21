const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

app.use('/api/auth', require('./routes/Auth'));
app.use('/api/notes', require('./routes/Notes'));

app.listen(8080, () => console.log("🚀 Server running on port 8080"));
