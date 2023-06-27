const express = require('express');
const PORT = 3001;
const cors = require('cors');
const app = express();

//config
app.use(express.json());
app.use(cors());

//import function
let {upsertGoodsReceive, upsertIssueStock, getProductList, getGoodsReceiveHistory, getIssueStockHistory, getGoodsReceiveByNameQuery, getIssueStockByNameQuery, getProductByNameQuery} = require('./services/warehouse');

//routes
app.post('/goods-recieve', upsertGoodsReceive);
app.post('/issue-stock', upsertIssueStock);
app.get('/stock-all', getProductList);
app.get('/history-gr', getGoodsReceiveHistory);
app.get('/history-is', getIssueStockHistory);
app.get('/search-gr', getGoodsReceiveByNameQuery);
app.get('/search-is', getIssueStockByNameQuery);
app.get('/search-product', getProductByNameQuery);

//port
app.listen(PORT, () => {
    console.log('Warehose server is running on ' + PORT);
});


