import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import router from './routes/web';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);

app.set('view engine', 'ejs');
app.set('views', './views');


mongoose.connect(MONGODB_URI).then(result => {
    app.listen(PORT, process.env.URL, () => {
        console.clear(); 
        console.info(`Server bạn chạy trên ${process.env.URL}:${PORT}.`);
    });
}).catch(err => console.log(err));
                                                                                       