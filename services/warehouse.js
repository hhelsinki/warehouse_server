var fs = require('fs');

//import func
let { jsonReader } = require('./json-reader');

//import json
const goodsReceive = require('../json/goodsReceive.json');
const issueStock = require('../json/issueStock.json');
const product = require('../json/stockList.json');
const historyGR = require('../json/goodsReceiveHistory.json');
const historyIS = require('../json/issueStockHistory.json');

//path json
const pathGoodsReceive = './json/goodsReceive.json';
const pathGoodsReceiveHistory = './json/goodsReceiveHistory.json';
const pathStock = './json/stockList.json';
const pathIssueStock = './json/issueStock.json';
const pathIssueStockHistory = './json/issueStockHistory.json';

//class func
class AllJson {
    constructor(mainJson) {
        this.mainJson = mainJson
    }

    onCalculate(req, res) {
        const getJson = this.mainJson;

        let jsonObject = Object.values(getJson);

        res.send({ status: true, data: jsonObject })
    }
}
class SearchJson {
    constructor(mainJson) {
        this.mainJson = mainJson
    }

    onCalculate(req, res) {
        const getJson = this.mainJson;
        const id = req.query.id;

        res.send({ status: true, data: getJson[id] });
    }

}

//run class func
var getGRHistory = new AllJson(historyGR);
var getISHistory = new AllJson(historyIS);
var getGRHistoryByNameQuery = new SearchJson(goodsReceive);
var getISHistoryByNameQuery = new SearchJson(issueStock);
var getPdByNameQuery = new SearchJson(product);

function upsertGoodsReceive(req, res) { // func all ✅️
    const seller_id = req.body.seller_id; //required
    const seller_name = req.body.seller_name; //required
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
    const remark__i = req.body.remark__i;
    const remark__ii = req.body.remark__ii;
    const total_amount = req.body.total_amount; //required
    const total_price = req.body.total_price; //required
    const dataArray = req.body.dataArray; //required

    console.log(dataArray.length)

    if (seller_id.length < 1 || seller_name.length < 1 || doc_type.length < 1 || doc_no.length < 1 || doc_date.length < 1 || total_amount.length < 1 || total_price.length < 1 || dataArray.length < 1) {
        //res.sendStatus(411);
        res.send({status: false, msg: 'โปรดกรอกข้อมูลดอกจันและรายการสินค้าให้ครบ'});
        return;
    }

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
                "no": doc_no,
                "date": doc_date,
                "ref": doc_ref,
                "ref_date": doc_ref__date
            },
            "recorder": {
                "code": recorder_code,
                "name": recorder_name
            },
            "do": {
                "no": do_no,
                "department": {
                    "code": do_department__code,
                    "title": do_department__title
                },
                "receiver": {
                    "code": do_receiver__code,
                    "name": do_receiver__name
                }
            },
            "remark": {
                "i": remark__i,
                "ii": remark__ii
            },
            "data": dataArray,
            "total_amount": total_amount,
            "total_price": total_price
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

        data[doc_no] = {
            doc_no: doc_no,
            date: doc_date
        }

        fs.writeFile(pathGoodsReceiveHistory, JSON.stringify(data, null, 2), (err) => {
            if (err) console.log('Error writing file:', err);
        });
    });

    //Stock List Addition ✅️
    const newData = dataArray;
    // check if newData['code'] include in stock['code']
    jsonReader(pathStock, (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }

        for (let i = 0; i < newData.length; i++) {
            if (product[newData[i].code]) {

                data[newData[i].code] = {
                    ...data[newData[i].code],
                    amount: (data[newData[i].code].amount * 1) + (newData[i].amount * 1),
                    price_total: (data[newData[i].code].price_total * 1) + (newData[i].amount * 1) * (data[newData[i].code].price_unit * 1)
                }

                setTimeout(() => {
                    fs.writeFileSync(pathStock, JSON.stringify(data, null, 2), (err) => {
                        if (err) console.log('Error writing file:', err);
                    });
                }, i * 3000);

            } else {
                data[newData[i].code] = newData[i];

                setTimeout(() => {
                    fs.writeFileSync(pathStock, JSON.stringify(data, null, 2), (err) => {
                        if (err) console.log('Error writing file:', err);
                    });
                }, i * 3000);
            }
        }


    });

    res.send({ status: true, msg: 'Sucessfully saved!' });
}
function upsertIssueStock(req, res) { // func 3 all ✅️
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
    const dp_no = req.body.dp_no;
    const dp_department__code = req.body.dp_department__code; //required
    const dp_department__title = req.body.dp_department__title; //required
    const dp_receiver__code = req.body.dp_receiver__code; //required
    const dp_receiver__name = req.body.dp_receiver__name; //required
    const remark__i = req.body.remark__i;
    const remark__ii = req.body.remark__ii;
    const total_amount = req.body.total_amount; //required
    const total_price = req.body.total_price; //required
    const dataArray = req.body.dataArray; //required

    if (buyer_id.length < 1 || buyer_name.length < 1 || doc_type.length < 1 || doc_no.length < 1 || doc_date.length < 1 || total_amount.length < 1 || total_price.length < 1 || dataArray.length < 1) {
        //res.sendStatus(411);
        res.send({status: false, msg: 'โปรดกรอกข้อมูลดอกจันและรายการสินค้าให้ครบ'});
        return;
    }

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
                "no": doc_no,
                "date": doc_date,
                "ref": doc_ref,
                "ref_date": doc_ref__date
            },
            "recorder": {
                "code": recorder_code,
                "name": recorder_name
            },
            "dp": {
                "no": dp_no,
                "department": {
                    "code": dp_department__code,
                    "title": dp_department__title
                },
                "receiver": {
                    "code": dp_receiver__code,
                    "name": dp_receiver__name
                }
            },
            "remark": {
                "i": remark__i,
                "ii": remark__ii
            },
            "data": dataArray,
            "total_amount": total_amount,
            "total_price": total_price
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

        data[doc_no] = {
            doc_no: doc_no,
            date: doc_date
        }

        //data[doc_no] = doc_date;

        fs.writeFileSync(pathIssueStockHistory, JSON.stringify(data, null, 2), (err) => {
            if (err) console.log('Error writing file:', err);
        });
    });

    //Stock List Minus ✅️
    const newData = dataArray;
    // check if newData['code'] include in stock['code']
    jsonReader(pathStock, (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }

        for (let i = 0; i < newData.length; i++) {
            if (product[newData[i].code__is]) { //TRUE, sum update
                console.log(newData[i].code__is, 'exit', true);

                data[newData[i].code__is] = {
                    ...data[newData[i].code__is],
                    amount: (data[newData[i].code__is].amount * 1) - (newData[i].amount__is * 1),
                    price_total: (data[newData[i].code__is].price_total * 1) - (newData[i].amount__is * 1) * (data[newData[i].code__is].price_unit * 1)
        

                    //total: (data[newData[i].code].total) - newData[i].total,
                    //amount: (data[newData[i].code].amount) - (newData[i].total) * (data[newData[i].code].price_per_unit)
                }

                setTimeout(() => {
                    fs.writeFileSync(pathStock, JSON.stringify(data, null, 2), (err) => {
                        if (err) console.log('Error writing file:', err);
                    });
                }, i * 3000);

            } else { //FALSE create 
                console.log(newData[i].code, 'exit', false);

                data[newData[i].code] = newData[i];

                setTimeout(() => {
                    fs.writeFileSync(pathStock, JSON.stringify(data, null, 2), (err) => {
                        if (err) console.log('Error writing file:', err);
                    });
                }, i * 3000);
            }
        }
    });


    res.send({ status: true, msg: 'Sucessfully saved!' });
}

let getProductList = (req, res) => { // func ✅️
    const productList = Object.values(product);

    res.send({ status: true, data: productList });
}

//array to object 
//console.log(Object.values(path_products));

//readwrite()

//console.log(goods_receive__all['RS5201-00001'].data);

let getGoodsReceiveHistory = getGRHistory.onCalculate.bind(getGRHistory);
let getIssueStockHistory = getISHistory.onCalculate.bind(getISHistory);
let getGoodsReceiveByNameQuery = getGRHistoryByNameQuery.onCalculate.bind(getGRHistoryByNameQuery);
let getIssueStockByNameQuery = getISHistoryByNameQuery.onCalculate.bind(getISHistoryByNameQuery);
let getProductByNameQuery = getPdByNameQuery.onCalculate.bind(getPdByNameQuery);

module.exports = { upsertGoodsReceive, upsertIssueStock, getProductList, getGoodsReceiveHistory, getIssueStockHistory, getGoodsReceiveByNameQuery, getIssueStockByNameQuery, getProductByNameQuery };