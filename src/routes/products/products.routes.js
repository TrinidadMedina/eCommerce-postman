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
        body.userType === 'admin' ? admin = true : admin = false;
        console.log(admin)
        res.redirect('/api/productos')
    }catch(err){
       next(err) 
    } 
})

 router.post('/create', async (req, res, next)=>{
    try{
        const {body} = req;
        if(_.isNil(body))(res.status(400).json({success: false, message: 'REQ ERROR (Body missing'}))
        Object.assign(body, {
            uuid: uuidv4()
        });
        const data = await productService.createProduct(body);
        if(!data.success)(res.status(500).json(data))
        res.redirect('/api/productos')
    }catch(err){
       next(err) 
    } 
}) 

router.get('/', async (_req, res, next)=>{
    try{
        const data = await productService.getProducts();
        if(!data.success)(res.status(500).json(data))
        data.admin = admin;
        res.render('index.ejs', {options: data})
    }catch(err){
        next(err) 
    }
})

/* router.get('/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const data = await productService.getProducts();
        if(!data.success)(res.status(500).json(data));
        const selected = data.data.filter(i => i.uuid === id);
        data.data = selected;
        if(selected.length===0){
            return res.status(400).json({
                error: 'Producto no encontrado'
            })
        }
        res.render('index.ejs', {options: data})
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}); */

/* router.put('/:id', (req, res)=>{
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
}); */

/* router.delete('/', (req, res)=>{
    try{
        const id = parseInt(req.params.id);
        const prod = productos.find(i=>i.id===id);
        if(!prod){
            return res.status(400).json({
                error: 'Producto no encontrado'
            })
        }
        productos = productos.filter(i => i.uuid !== id);
        res.status(200).json({productos})
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}); */

router.put('/:productUuid', async(req, res, next) => {
    try{
        const { productUuid } = req.params;
        const {body} = req;
        console.log(body)
        //if(_.isNil(productUuid) || _.isNil(body))(res.status(400).json({success: false, message: "Req error"}));
        //if(body)(res.status(400).json({success: false, message: "Req error"}));
        const data = await productService.updateProduct(productUuid, body)
        if(!data.success)(res.status(500).json(data))
        res.status(200).json(data);
    }catch(err){
        next(err);
    }
});

router.get('/:productUuid', async (req, res, next) => {
    try{
        const {productUuid} = req.params;
        if(_.isNil(productUuid))(res.status(400).json({success: false, message: "Req error"}));
        const data = await productService.getProduct(productUuid)
        if(!data.success)(res.status(500).json(data))
        res.render('index.ejs', {options: data})
    }catch(err){
        next(err);
    }
});

router.delete('/:productUuid', async (req, res, next) => {
    try{
        const {productUuid} = req.params;
        if(_.isNil(productUuid))(res.status(400).json({success: false, message: "Req error"}));
        const data = await productService.deleteProduct(productUuid);
        if(!data.success)(res.status(500).json(data))
        res.status(200).json(data);
    }catch(err){
        next(err);
    }
})

module.exports = router;