//ISSUE** json version, please use mysql version
// I. dataArray only push the last index loop. 

var fs = require('fs');

//import func
let {jsonReader} = require('./json-reader');

//import json
const product = require('../json/stockList.json');

//path json
const pathGoodsReceive = './json/goodsReceive.json';
const pathGoodsReceiveHistory = './json/goodsReceiveHistory.json';
const pathStock = './json/stockList.json';
const pathIssueStock = './json/issueStock.json';
const pathIssueStockHistory = './json/issueStockHistory.json';


function upsertGoodsReceive(req, res) { // func 2 ✅️, 1 ❌️
    const seller_id = req.body.seller_id; //required
    const seller_name = req.body.seller_name; //required
    const doc_code = req.body.doc_code; //required
    const doc_type = req.body.type; //required
    const doc_no = req.body.doc_no; //required
    const doc_date = req.body.doc_date; //required
    const doc_ref = req.body.ref;
    const doc_ref__date = req.body.doc_ref__date;
    const recorder_code = req.body.recorder_code; //required
    const recorder_name = req.body.recorder_name; //required
    const do_no = req.body.do_no;
    const do_department__code = req.body.do_department__code; //required
    const do_department__title = req.body.do_department__title; //required
    const do_receiver__code = req.body.do_receiver__code; //required
    const do_receiver__name = req.body.do_receiver__name; //required
    const do_remark__i = req.body.do_remark__i;
    const do_remark__ii = req.body.do_remark__ii;
    const dataArray = req.body.dataArray; //required

    //Goods Recive ✅️
    jsonReader(pathGoodsReceive, (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        // add new data to object
        //data['title'] = 'content';
        data[doc_no] = {
            "seller": {
                "id": seller_id,
                "name": seller_name
            },
            "doc": {
                "code": doc_code,
                "type": doc_type,
                "no.": doc_no,
                "date": doc_date,
                "ref": doc_ref,
                "ref_date": doc_ref__date
            },
            "recorder": {
                "code": recorder_code,
                "name": recorder_name
            },
            "DO": {
                "no.": do_no,
                "department": {
                    "code": do_department__code,
                    "title": do_department__title
                },
                "receiver": {
                    "code": do_receiver__code,
                    "name": do_receiver__name
                },
                "remark": {
                    "1": do_remark__i,
                    "2": do_remark__ii
                }
            },
            "data": dataArray
        }
        fs.writeFileSync(pathGoodsReceive, JSON.stringify(data, null, 2), (err) => {
            if (err)
                console.log("Error writing file:", err);
        });
    });

    //Good Receive History ✅️
    jsonReader(pathGoodsReceiveHistory, (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }

        data[doc_no] = doc_date;

        fs.writeFile(pathGoodsReceiveHistory, JSON.stringify(data, null, 2), (err) => {
            if (err) console.log('Error writing file:', err);
        });
    });

    //Stock List Addition ❌️ see issue, go up top 
    const newData = dataArray;
    // check if newData['code'] include in stock['code']
    for (let i = 0; i < newData.length; i++) {
        if (product[newData[i].code]) { //TRUE, sum update
            console.log(newData[i].code, 'exit', true);

            jsonReader(pathStock, (err, data) => {
                if (err) {
                    console.log("Error reading file:", err);
                    return;
                }

                data[newData[i].code] = {
                    ...data[newData[i].code],
                    total: (data[newData[i].code].total) + newData[i].total,
                    amount: (data[newData[i].code].amount) + (newData[i].total) * (data[newData[i].code].price_per_unit)
                }

                setTimeout(() => {
                    fs.writeFileSync(pathStock, JSON.stringify(data, null, 2), (err) => {
                        if (err) console.log('Error writing file:', err);
                    });
                }, i * 3000);
            });


        }
        else { //FALSE create 
            console.log(newData[i].code, 'exit', false);

            jsonReader(pathStock, (err, data) => {
                if (err) {
                    console.log("Error reading file:", err);
                    return;
                }
    
                data[newData[i].code] = newData[i];
    
                fs.writeFileSync(pathStock, JSON.stringify(data, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                });
            });
        }
    }
    

    res.send({status: true, msg: 'Sucessfully saved!'});
}
function upsertIssueStock(req, res) { // func 2 ✅️, 1 ❌️
    const buyer_id = req.body.buyer_id; //required
    const buyer_name = req.body.buyer_name; //required
    const doc_code = req.body.doc_code; //required
    const doc_type = req.body.doc_type; //required
    const doc_no = req.body.doc_no; //required
    const doc_date = req.body.doc_date; //required
    const doc_ref = req.body.doc_ref;
    const doc_ref__date = req.body.doc_ref__date;
    const recorder_code = req.body.recorder_code; //required
    const recorder_name = req.body.recorder_name; //required
    const do_no = req.body.do_no;
    const do_department__code = req.body.do_department__code; //required
    const do_department__title = req.body.do_department__title; //required
    const do_receiver__code = req.body.do_receiver__code; //required
    const do_receiver__name = req.body.do_receiver__name; //required
    const do_remark__i = req.body.do_remark__i;
    const do_remark__ii = req.body.do_remark__ii;
    const dataArray = req.body.dataArray; //required

    //Issue Stock ✅️
    jsonReader(pathIssueStock, (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        // add new data to object
        //data['title'] = 'content';
        data[doc_no] = {
            "buyer": {
                "id": buyer_id,
                "name": buyer_name
            },
            "doc": {
                "code": doc_code,
                "type": doc_type,
                "no.": doc_no,
                "date": doc_date,
                "ref": doc_ref,
                "ref_date": doc_ref__date
            },
            "recorder": {
                "code": recorder_code,
                "name": recorder_name
            },
            "DO": {
                "no.": do_no,
                "department": {
                    "code": do_department__code,
                    "title": do_department__title
                },
                "receiver": {
                    "code": do_receiver__code,
                    "name": do_receiver__name
                },
                "remark": {
                    "1": do_remark__i,
                    "2": do_remark__ii
                }
            },
            "data": dataArray
        }
        fs.writeFile(pathIssueStock, JSON.stringify(data, null, 2), (err) => {
            if (err)
                console.log("Error writing file:", err);
        });
    });

    //Issue stock history ✅️
    jsonReader(pathIssueStockHistory, (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }

        data[doc_no] = doc_date;

        fs.writeFileSync(pathIssueStockHistory, JSON.stringify(data, null, 2), (err) => {
            if (err) console.log('Error writing file:', err);
        });
    });

    //Stock List Minus ❌️ see issue, go up top
    const newData = dataArray;
    // check if newData['code'] include in stock['code']
    for (let i = 0; i < newData.length; i++) {
        if (product[newData[i].code]) { //TRUE, sum update
            console.log(newData[i].code, 'exit', true);

            jsonReader(pathStock, (err, data) => {
                if (err) {
                    console.log("Error reading file:", err);
                    return;
                }

                data[newData[i].code] = {
                    ...data[newData[i].code],
                    total: (data[newData[i].code].total) - newData[i].total,
                    amount: (data[newData[i].code].amount) - (newData[i].total) * (data[newData[i].code].price_per_unit)
                }

                setTimeout(() => {
                    fs.writeFileSync(pathStock, JSON.stringify(data, null, 2), (err) => {
                        if (err) console.log('Error writing file:', err);
                    });
                }, i * 3000);
            });
        }
        else { //FALSE create 
            console.log(newData[i].code, 'exit', false);

            res.send({status: false, msg: `${newData[i].code} is not exit.`});
        }
    }

    res.send({status: true, msg: 'Sucessfully saved!'});
}

let productList = (req, res) => { // func ✅️
    const productList = Object.values(product);

    res.send({status: true, data: productList});
}

//array to object 
//console.log(Object.values(path_products));

//readwrite()

//console.log(goods_receive__all['RS5201-00001'].data);

module.exports = { upsertGoodsReceive, upsertIssueStock, productList };