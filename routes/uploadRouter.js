const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');


const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb = callback function
        cb(null, 'public/images'); //null = there is no error, 'public/images' = path to save the file
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname) // name of the file on server = name of the file on client side
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false); // false = to reject this file upload
    }
    cb(null, true); // true = will tell MULTER to ACCEPT this FILE
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))//to handle a pre-flight request
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;