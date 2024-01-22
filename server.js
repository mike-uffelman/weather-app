// const port = 5000;
// import express from 'express';
// import 'dotenv/config.js'
// import axios from 'axios';
// import cors from 'cors';
// const app = express();

// app.listen(port, () => console.log(`Server is running on port  ${port}`))

// app.use(cors());

// app.get('/', async (req, res) => {
    
//     if(Object.keys(req.query).length === 0) return;

//     function buildNewOptions(opt) {
//         let newOpts = {}
    
//         newOpts.url = opt.apiURL;
//         newOpts.methods = 'get';
        
//         newOpts.params = Object.entries(opt)
//             .filter(item => item[0] !== 'apiURL')
//             .reduce((acc, curr) => {
//                 acc[curr[0]] = curr[1]
//                 return acc;
//             }, {})
//         newOpts.params.appid = process.env.OWM_APIKEY
//         return newOpts;
//     }

//     axios.getUri(buildNewOptions(req.query))
//     console.log('axios request ++++++++++++++++', req.query)

//     await axios.request(buildNewOptions(req.query))
//         .then(data => {
//             console.log(data.data)
//             res.send(data.data)
//         })
//         .catch(err => console.log(err))
// })