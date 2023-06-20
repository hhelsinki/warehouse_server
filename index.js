const express = require('express');
const PORT = 3001;
const cors = require('cors');
const app = express();

//config
app.use(express.json());
app.use(cors());

//import function
let {upsertGoodsReceive, upsertIssueStock, productList} = require('./services/warehouse');

//routes
app.post('/goods-recieve', upsertGoodsReceive);
app.post('/issue-stock', upsertIssueStock);
app.get('/stock-all', productList);

//port
app.listen(PORT, () => {
    console.log('Warehose server is running on ' + PORT);
})


