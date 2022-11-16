const express = require('express');
const router = express.Router();
const productsRoutes = require('./products/products.routes')

router.get('/health', async (_req, res)=>{
    res.status(200).json({
        siccess: true,
        enviroment: process.env.ENVIROMENT || 'undefined',
        health: 'Up'
    })
})
.use('/', productsRoutes)

module.exports = router