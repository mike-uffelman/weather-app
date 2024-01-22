import axios from "axios";

export const handler = async (event) => {
    function buildNewOptions(opt) {
        let newOpts = {}
    
        newOpts.url = opt.apiURL;
        newOpts.methods = 'get';
        
        newOpts.params = Object.entries(opt)
            .filter(item => item[0] !== 'apiURL')
            .reduce((acc, curr) => {
                acc[curr[0]] = curr[1]
                return acc;
            }, {})
        newOpts.params.appid = process.env.OWM_APIKEY
        // newOpts.headers['content-type'] = 'application/json'
        return newOpts;
    }

  try {
    // console.log(axios.getUri(buildNewOptions(event.queryStringParameters)))

    const {data} =  await axios.request(buildNewOptions(event.queryStringParameters))
        
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      }
    }  


  } catch (error) {
    const { status, statusText, headers, data } = error.response
    return { 
      statusCode: status,
      body: JSON.stringify({ status, statusText, headers, data })
    }
  }
}

