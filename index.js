const express = require('express');
const { dbConnect } = require('./config/dbConnect');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

dbConnect();

app.use(express.json());

app.use('/api/user', authRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () =>
{
    console.log(`Server is running on port ${PORT}`);
})