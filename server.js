const port = 5000;
import * as config from './src/js/config.js';

import express from 'express';
import 'dotenv/config.js'
// require('dotenv').config();
import axios from 'axios';
import cors from 'cors';
const app = express();
// const cors = require('cors');

app.listen(port, () => console.log(`Server is running on port  ${port}`))

app.use(cors());


app.get('/', async (req, res) => {
    // const [GEOCODE_DIRECT_URL = 'direct', GEOCODE_REVERSE_URL = 'reverse', FORECAST_URL = 'forecast', ] = config.config;

    const options = {
        method: 'get',
        url: config.GEOCODE_DIRECT_URL,
        params: {
            q: req.query.query,
            limit: 5,
            appid: process.env.OWM_APIKEY
        }
    //     // headers: {
    //     //     api_key: process.env.OWM_APIKEY
    //     // }
    }

    // console.log(req)
    

    await axios.request(options)
        // .then(response => res.json(response))
        .then(data => res.send(data.data))
        .catch(err => console.log(err))
    // console.log('!!!!! rew !!!!', req.query.query)
    // console.log(rez);
    // res.send(rez)
        
})

// app.get('/', async (req, res) => {
//     // console.log(req)
//     console.log(req)
//     res.send('response here')
// })
