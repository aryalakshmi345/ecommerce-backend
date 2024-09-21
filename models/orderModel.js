const { MongoTailableCursorError } = require('mongodb');
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    products: 
      {
        type: Array,
        required: true
      },
    payment: {
      type:String,
      required:true
    },
    buyer: {
        type: mongoose.ObjectId,
        ref: "users",
      },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);


const orders = mongoose.model('orders',orderSchema)
module.exports = orders