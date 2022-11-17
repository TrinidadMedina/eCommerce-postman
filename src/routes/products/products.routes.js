const express = require('express');
const {v4: uuidv4} = require('uuid');
const _ = require('lodash');
const ProductService = require('../../services/products/products.services');

const router = express.Router();

const productService = new ProductService();

let admin = false

 router.post('/', async (req, res, next)=>{
    try{
        const {body} = req;
        if(_.isEmpty(body))(res.status(400).json({success: false, message: 'REQ ERROR (Body missing)'}))
        if(_.isNil(body.title) || _.isNil(body.price) || _.isNil(body.thumbnail))(res.status(400).json({success: false, message: 'REQ ERROR (Wrong attributes)'}))
        Object.assign(body, {
            uuid: uuidv4()
        });
        const data = await productService.createProduct(body);
        if(!data.success)(res.status(400).json(data))
        res.status(200).json(data)
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
        if(_.isNil(id))(res.status(400).json({success: false, message: "Req error"}));
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
        if(_.isEmpty(body))(res.status(400).json({success: false, message: "Req error (body missing)"}));
        const data = await productService.updateProduct(id, body)
        if(!data.success)(res.status(400).json(data))
        res.status(200).json(data.data);
    }catch(err){
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        const data = await productService.deleteProduct(id);
        if(!data.success)(res.status(400).json(data))
        res.status(200).json(data.data);
    }catch(err){
        next(err);
    }
})

module.exports = router;