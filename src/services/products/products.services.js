const fs = require('fs')

class ProductService{
    constructor(){}

    async createProduct(data){
        try{
            const products = fs.readFileSync(__dirname + '/products.json');
            const productsObject = JSON.parse(products);
            productsObject.push(data);
            fs.writeFileSync(__dirname + '/products.json', JSON.stringify(productsObject, null, 2));
            return{
                success: true,
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

    async getProducts(){
        try{
            const data = fs.readFileSync(__dirname + '/products.json')
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
}

module.exports = ProductService;