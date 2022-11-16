const express = require('express');
const {v4: uuidv4} = require('uuid');
const _ = require('lodash');
const ProductService = require('../../services/products/products.services')

const router = express.Router();

const productService = new ProductService();

router.post('/', async (req, res, next)=>{
    try{
        const {body} = req;
        if(_.isNil(body))(res.status(400).json({success: false, message: 'REQ ERROR (Body missing'}))
        Object.assign(body, {
            uuid: uuidv4()
        });
        const data = await productService.createProduct(body);
        if(!data.success)(res.status(500).json(data))
        res.redirect('/')
    }catch(err){
       next(err) 
    } 
})

router.get('/', async (_req, res, next)=>{
    try{
        const data = await productService.getProducts();
        if(!data.success)(res.status(500).json(data))
        res.render('index.ejs', {options: data.data})
    }catch(err){
        next(err) 
    }
})

router.get('/:id', (req, res)=>{
    try{
        const id = parseInt(req.params.id);
        const selected = productos.filter(i => i.id === id);
        if(selected.length===0){
            return res.status(400).json({
                error: 'Producto no encontrado'
            })
        }
        res.status(200).json({selected: selected})
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
});

router.put('/:id', (req, res)=>{
    try{
        const {body} = req;
        const id = parseInt(req.params.id);
        body.id = id;
        const prod = productos.find(i=>i.id===id);
        if(!prod){
            return res.status(400).json({
                error: 'Producto no encontrado'
            })
        }
        productos[productos.indexOf(prod)] = body;
        res.status(200).json({productos})
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
});

router.delete('/:id', (req, res)=>{
    try{
        const id = parseInt(req.params.id);
        const prod = productos.find(i=>i.id===id);
        if(!prod){
            return res.status(400).json({
                error: 'Producto no encontrado'
            })
        }
        productos = productos.filter(i => i.id !== id);
        res.status(200).json({productos})
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
});

module.exports = router;