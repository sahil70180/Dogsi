import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js"

const seedProdcuts = async () =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/ShOPIT");
        
        await Product.deleteMany();
        console.log("Products are deleted");

        await Product.insertMany(products);
        console.log("Products are Added");

        process.exit();
        
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
};

seedProdcuts();