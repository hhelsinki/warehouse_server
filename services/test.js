//NOTICE** json version doesn't support loop writeFile, use mysql version instead.
//it will work only the last index.

const fs = require('fs');

//import func
const { jsonReader } = require('./json-reader');

//import json
var product = require('../json/product.json');
const { resolve } = require('path');

const path_product = '../json/product.json';

const productObj = Object.values(product);

const newData = [
    {
        "code": "601-1041", //find this in product
        "total": 1,
    },
    {
        "code": "601-1042", //find this in product
        "total": 2,
    },
    {
        "code": "601-1043", //find this in product
        "total": 3,
    },

]

//console.log(productObj.length);
//console.log(newData[0].code)
//console.log(product[`${newData[1].code}`])


function upsert() {
    // check if newData['code'] include in product['code']
    for (let i = 0; i < newData.length; i++) {
        if (product[newData[i].code]) { //TRUE, sum update
            console.log(newData[i].code, 'match', true);


            jsonReader(path_product, async (err, data) => {
                if (err) {
                    console.log("Error reading file:", err);
                    return;
                }

                data[newData[i].code] = {
                    ...data[newData[i].code],
                    total: (data[newData[i].code].total) + newData[i].total,
                    //amount: (data[newData[i].code].amount) + (newData[i].total) * (data[newData[i].code].price_per_unit)
                }

                setTimeout(() => {
                    fs.writeFileSync(path_product, JSON.stringify(data, null, 2),  (err) => {
                        if (err) console.log('Error writing file:', err);
                    });
                }, i * 3000)


            });


        }
        else { //FALSE create 
            console.log(newData[i].code, 'not match', false);

            /*jsonReader(path_product, (err, data) => {
                if (err) {
                    console.log("Error reading file:", err);
                    return;
                }
    
                //console.log(newData[i])
                data[newData[i].code] = newData[i]
    
                fs.writeFile(path_product, JSON.stringify(data, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                });
            });*/
        }
    }
}

upsert();




