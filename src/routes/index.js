const express = require('express');
const router = express.Router();
const productsRoutes = require('./products/products.routes');
const carritosRoutes = require('./carritos/carritos.routes');

let admin = false;

router.get('/health', async (_req, res)=>{
    res.status(200).json({
        siccess: true,
        enviroment: process.env.ENVIROMENT || 'undefined',
        health: 'Up'
    })
})
.use('/productos', productsRoutes)
.use('/carrito', carritosRoutes )

module.exports = router

