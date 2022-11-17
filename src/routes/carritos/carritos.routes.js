const express = require('express');
const {v4: uuidv4} = require('uuid');
const _ = require('lodash');
const CarritosServices = require('../../services/carritos/carritos.services')

const router = express.Router();

const carritosServices = new CarritosServices();

/* 
b. DELETE: '/:id' - Vacía un carrito y lo elimina.
c. GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
d. POST: '/:id/:id_prod' - Para incorporar productos al carrito por su id de producto
e. DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de
producto
 */

router.post('/', async (req, res, next)=>{
    try{
        const {body} = req;
        if(_.isEmpty(body))(res.status(400).json({success: false, message: 'REQ ERROR (Name missing)'}))
        Object.assign(body, {
            uuid: uuidv4(),
            time: new Date(),
            products: []   
        });
        const data = await carritosServices.createCarrito(body);
        if(!data.success)(res.status(400).json(data))
        res.status(200).json(data) 
    }catch(err){
       next(err) 
    } 
}) 

router.post('/:idCarro/:idProducto', async (req, res, next)=>{
    try{
        const {idCarro} = req.params;
        const {idProducto} = req.params;
        const data = await carritosServices.insertProduct(idCarro, idProducto);
        if(!data.success){
            res.status(400).json(data)
        }else{
            res.status(200).json(data) 
        }    
    }catch(err){
       next(err) 
    } 
});

router.get('/', async (_req, res, next)=>{
    try{
        const data = await carritosServices.getCarritos();
        if(!data.success)(res.status(400).json(data))
        res.status(200).json(data.data)
    }catch(err){
        next(err) 
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        const data = await carritosServices.getCarrito(id)
        if(!data.success)(res.status(400).json(data))
        res.status(200).json(data.data)
    }catch(err){
        next(err);
    }
});

router.get('/:id/productos', async (req, res, next) => {
    try{
        const {id} = req.params;
        const data = await carritosServices.getCarritoProducts(id)
        if(!data.success)(res.status(400).json(data))
        res.status(200).json(data.data)
    }catch(err){
        next(err);
    }
});

router.delete('/:idCarro/productos/:idProducto', async (req, res, next)=>{
    try{
        const {idCarro} = req.params;
        const {idProducto} = req.params;
        const data = await carritosServices.deleteCarritoProduct(idCarro, idProducto);
        if(!data.success){
            res.status(400).json(data)
        }else{
            res.status(200).json(data) 
        }    
    }catch(err){
       next(err) 
    } 
});

router.delete('/:idCarro', async (req, res, next)=>{
    try{
        const {idCarro} = req.params;
        const data = await carritosServices.deleteCarrito(idCarro);
        if(!data.success){
            res.status(400).json(data)
        }else{
            res.status(200).json(data) 
        }    
    }catch(err){
       next(err) 
    } 
});

/* 
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
}); */

module.exports = router;