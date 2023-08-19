const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { dbConnect } = require('./config/dbConnect');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

dbConnect();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
{
    console.log(`Server is running on port ${PORT}`);
})