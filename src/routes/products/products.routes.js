const express = require('express');
const {v4: uuidv4} = require('uuid');
const _ = require('lodash');
const ProductService = require('../../services/products/products.services');

const router = express.Router();

const productService = new ProductService();

let admin = false;
//let admin = true;

 router.post('/', async (req, res, next)=>{
    try{
        const {body} = req;
        if(!admin){
            res.status(400).json({ error: -1, message: `ruta ${req.baseUrl} método ${req.method} no autorizado` })
        }else if(_.isEmpty(body)){
            res.status(400).json({success: false, message: 'Falta llenar los datos en el Body'})
        }else if (_.isNil(body.name) || _.isNil(body.description) || _.isNil(body.code) || _.isNil(body.image) || _.isNil(body.price) || _.isNil(body.stock)){
            res.status(400).json({success: false, message: 'Faltan atributos del producto'})
        } else {
            Object.assign(body, {
                time: new Date(),
                uuid: uuidv4()
            });
            const data = await productService.createProduct(body);
            if(!data.success){
                res.status(400).json(data)
            }else{
                res.status(200).json(data)
            }
        }
    }catch(err){
       next(err) 
    } 
}) 

router.get('/', async (_req, res, next)=>{
    try{
        const data = await productService.getProducts();
        if(!data.success)(res.status(400).json(data))
        res.status(200).json(data.data)
    }catch(err){
        next(err) 
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        const data = await productService.getProduct(id)
        if(!data.success)(res.status(400).json(data))
        res.status(200).json(data.data)
    }catch(err){
        next(err);
    }
});

router.put('/:id', async(req, res, next) => {
    try{
        const { id } = req.params;
        const {body} = req;
        if(!admin){
            res.status(400).json({ error: -1, message: `ruta ${req.baseUrl} método ${req.method} no autorizado` })
        }else if(_.isEmpty(body)){
            res.status(400).json({success: false, message: "Falta llenar los datos en el Body"})
        }else if(_.isNil(body.name) || _.isNil(body.description) || _.isNil(body.code) || _.isNil(body.image) || _.isNil(body.price) || _.isNil(body.stock)){
            res.status(400).json({success: false, message: 'Falta algún atributo del producto'})
        }else{
            const data = await productService.updateProduct(id, body)
            if(!data.success){
                res.status(400).json(data)
            } else {
                res.status(200).json(data);
            } 
        }
    }catch(err){
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        if(!admin){
            res.status(400).json({ error: -1, message: `ruta ${req.baseUrl} método ${req.method} no autorizado` })
        } else {
            const data = await productService.deleteProduct(id);
            if(!data.success){
                res.status(400).json(data)
            }else {
                res.status(200).json(data.data);
            }
        }
    }catch(err){
        next(err);
    }
})

module.exports = router;