const fs = require('fs')

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

    async getCarritos(){
        try{
            const data = fs.readFileSync(__dirname + '/carritos.json')
            return{
                success: true,
                data: JSON.parse(data)
            }
        }catch(err){
            return{
                success: false,
                message: err.message
            }
        }
    }
}

module.exports = CarritosServices;