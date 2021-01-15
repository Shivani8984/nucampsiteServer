const mongoose = require('mongoose'); //importing mongoose
const Schema = mongoose.Schema; //making a shorthand to the mongoose.schema function for us so that we can just refer to it as schema

require('mongoose-currency').loadType(mongoose); //this will load the new currency type in the mongoose so that it's available for mongo's schemas to use
const Currency = mongoose.Types.Currency;  // making a shorthand for (mongoose.Types.Currency)

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        require: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,//instead of storing a string with the author name in this field we will store a ref. to a user document through the user documents object id 
        ref: 'User' //hold the name of the document
    }
},{
    timestamps: true
});

const campsiteSchema = new Schema({ //instantiates a new object named campsite schema
    name: {
        type: String,
        required: true,
        unique: true // no 2 documents in this collection should have the same (name) field
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, { //this second argument is used for various configuration options
    timestamps: true //automatically add 2 properties called (created at) & (updated at)
});

//created a model using this schema
const Campsite = mongoose.model('Campsite', campsiteSchema);

module.exports = Campsite;