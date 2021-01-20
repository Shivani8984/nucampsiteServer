const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443']; //array of string values
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) { //if an origin can be found in the whitelist,if not -1 then it's found
        corsOptions = { origin: true }; //origin = true means we're allowing this request to be accepted
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions); // null=no errors has occur
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);