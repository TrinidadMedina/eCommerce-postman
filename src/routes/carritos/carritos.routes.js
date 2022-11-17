const express = require('express');
const {v4: uuidv4} = require('uuid');
const _ = require('lodash');
const CarritosServices = require('../../services/carritos/carritos.services')

const router = express.Router();

const carritosServices = new CarritosServices();

let admin = false;
//let admin = true;

router.post('/', async (req, res, next)=>{
    try{
        const {body} = req;
        if(!admin){
            res.status(400).json({ error: -1, message: `ruta ${req.baseUrl} método ${req.method} no autorizado` })
        }else if(_.isEmpty(body)){
            res.status(400).json({success: false, message: 'REQ ERROR (Name missing)'})
        }else{
            Object.assign(body, {
                uuid: uuidv4(),
                time: new Date(),
                products: []   
            });
            const data = await carritosServices.createCarrito(body);
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

router.post('/:idCarro/producto/:idProducto', async (req, res, next)=>{
    try{
        const {idCarro} = req.params;
        const {idProducto} = req.params;
        if(!admin){
            res.status(400).json({ error: -1, message: `ruta ${req.baseUrl} método ${req.method} no autorizado` })
        }else{
            const data = await carritosServices.insertProduct(idCarro, idProducto);
            if(!data.success){
                res.status(400).json(data)
            }else{
                res.status(200).json(data) 
            }    
        }
    }catch(err){
       next(err) 
    } 
});

router.get('/', async (_req, res, next)=>{
    try{
        const data = await carritosServices.getCarritos();
        if(!data.success){
            res.status(400).json(data)
        }else {
            res.status(200).json(data.data)
        }
    }catch(err){
        next(err) 
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        const data = await carritosServices.getCarrito(id)
        if(!data.success){
            res.status(400).json(data)
        }else {
            res.status(200).json(data.data)
        }
    }catch(err){
        next(err);
    }
});

router.get('/:id/productos', async (req, res, next) => {
    try{
        const {id} = req.params;
        const data = await carritosServices.getCarritoProducts(id)
        if(!data.success){
            res.status(400).json(data)
        }else{
            res.status(200).json(data.data)
        }
    }catch(err){
        next(err);
    }
});

router.delete('/:idCarro/productos/:idProducto', async (req, res, next)=>{
    try{
        const {idCarro} = req.params;
        const {idProducto} = req.params;
        if(!admin){
            res.status(400).json({ error: -1, message: `ruta ${req.baseUrl} método ${req.method} no autorizado` })
        }else {
            const data = await carritosServices.deleteCarritoProduct(idCarro, idProducto);
            if(!data.success){
                res.status(400).json(data)
            }else{
                res.status(200).json(data) 
            } 
        }
    }catch(err){
       next(err) 
    } 
});

router.delete('/:idCarro', async (req, res, next)=>{
    try{
        const {idCarro} = req.params;
        if(!admin){
            res.status(400).json({ error: -1, message: `ruta ${req.baseUrl} método ${req.method} no autorizado` })
        }else {
            const data = await carritosServices.deleteCarrito(idCarro);
            if(!data.success){
                res.status(400).json(data)
            }else{
                res.status(200).json(data) 
            } 
        }
    }catch(err){
       next(err) 
    } 
});

module.exports = router;