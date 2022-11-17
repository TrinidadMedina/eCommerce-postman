const fs = require('fs')
const path = require("path");

class CarritosServices{
    constructor(){}

    async createCarrito(data){
        try{
            const carritos = fs.readFileSync(__dirname + '/carritos.json');
            const carritosObject = JSON.parse(carritos);
            carritosObject.push(data);
            fs.writeFileSync(__dirname + '/carritos.json', JSON.stringify(carritosObject, null, 2));
            return{
                success: true,
                message: `Carrito ${data.name} id: ${data.uuid} creado con éxito`,
                data
            }
        }catch(err){
            console.error(err);
            return{
                success: false,
                message: err.message
            }
        }
    }

    async insertProduct(idCarro, idProducto){
        try{
            const carritos = JSON.parse(fs.readFileSync(__dirname + '/carritos.json'));
            const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'products/products.json')));
            const selectedCarro = await carritos.find(i => i.uuid === idCarro);
            const selectedProduct = await products.find(i => i.uuid === idProducto);
            if (selectedCarro === undefined){
                return {
                    success: false,
                    message: `No hay carro con ID: ${idCarro}`
                }
            }
            if (selectedProduct === undefined){
                return {
                    success: false,
                    message: `No hay producto con ID: ${idProducto}`
                }
            }
            const newList = await carritos.map(i => {
                if(i.uuid === idCarro){
                    i.products.push(selectedProduct)
                }
                return i;
            });
            fs.writeFileSync(__dirname + '/carritos.json', JSON.stringify(newList, null, 2));
            return{
                success: true,
                message: `Producto ${selectedProduct.title} agregado al carro ${selectedCarro.name}`,
            }
        }catch(err){
            console.error(err);
            return{
                success: false,
                message: err.message
            }
        }
    }

    async getCarritos(){
        try{
            const data = fs.readFileSync(__dirname + '/carritos.json')
            return{
                success: true,
                data: JSON.parse(data)
            }
        }catch(err){
            console.error(err);
            return{
                success: false,
                message: err.message
            }
        }
    }

    async getCarrito(uuid){
        try{
            const carritos = await this.getCarritos();
            const carrito = carritos.data.filter(i => i.uuid === uuid);
            if(carrito.length===0){
                return {
                    success: false,
                    message: `No hay carrito con ID: ${uuid}`
                }
            }
            return {
                success: true,
                data: carrito
            }
        }catch(err){
            console.error(err);
            return {
                success: false,
                message: err.message
            }
        }
    }

    async getCarritoProducts(uuid){
        try{
            const carritos = await this.getCarritos();
            const carrito = carritos.data.filter(i => i.uuid === uuid);
            if(carrito.length===0){
                return {
                    success: false,
                    message: `No hay carrito con ID: ${uuid}`
                }
            }
            return {
                success: true,
                data: carrito[0].products
            }
        }catch(err){
            console.error(err);
            return {
                success: false,
                message: err.message
            }
        }
    };

    async deleteCarrito(uuid){
        try{
            const carritos = await this.getCarritos();
            const newList = carritos.data.filter(i => i.uuid !== uuid);
            if(carritos.data.length === newList.length){
                return {
                    success: false,
                    message: `No hay carrito con ID: ${uuid}`
                }
            } 
            fs.writeFileSync(__dirname + '/carritos.json', JSON.stringify(newList, null, 2)); 
            return {
                success: true,
                data: `Carrito id: ${uuid} fue eliminado`
            } 
        }catch(err){
            console.error(err);
            return {
                success: false,
                message: err.message
            }
        }
    };

   // e. DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

   async deleteCarritoProduct(idCarro, idProducto){
    try{
        const carritos = await this.getCarritos();
        const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'products/products.json')));
        const selectedCarro = carritos.data.find(i => i.uuid === idCarro);
        const selectedProduct = await products.find(i => i.uuid === idProducto);

        if (selectedCarro === undefined){
            return {
                success: false,
                message: `No hay carro con ID: ${idCarro}`
            }
        }
        if (selectedProduct === undefined){
            return {
                success: false,
                message: `No hay producto con ID: ${idProducto}`
            }
        }

        const newList = await carritos.data.map(i => {
            if(i.uuid === idCarro){
               i.products = i.products.filter(j => j.uuid !== idProducto);
            }
            return i;
        });  

        fs.writeFileSync(__dirname + '/carritos.json', JSON.stringify(newList, null, 2));
        return {
            success: true,
            data: `Product deleted successfully`
        } 
        }catch(err){
            console.error(err);
            return {
                success: false,
                message: err.message
            }
        }
    };
}

module.exports = CarritosServices;