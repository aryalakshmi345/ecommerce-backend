const mongoose = require('mongoose')


mongoose.connect("mongodb://0.0.0.0:27017/ecommerce").then(()=>{
    console.log('Mongodb compass succesfully connected!');
}).catch(err=>{
    console.log('Mongodb connection error',err);
})


