const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require ('cors');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j70me.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
require('dotenv').config()
const app = express()
app.use(express.json());
app.use(cors());
const port = 5500;


app.get('/', (req, res) =>{
  res.send("hello from db it's working")
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  
  app.post('/addProducts', (req, res) => {
    const product = req.body;
    collection.insertMany(product)
    .then(result => {
     res.send(result.insertedCount > 0)
    })
  })


  app.get('/products', (req, res) => {
    const search = req.query.search;
    collection.find({name: {$regex: search}})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  app.get('/product/:key', (req, res) => {
    collection.find({key:req.params.key})
    .toArray((err, documents) => {
      res.send(documents [0])
    })
  })


  app.post('/productsByKeys', (req, res) =>{
    const productKeys = req.body;
    collection.find({key: {$in: productKeys}})
    .toArray ((err, documents) => {
      res.send(documents)
    })
  })
  app.post('/addOrders', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
     res.send(result.insertedCount >0)
    })
  })


});


app.listen(process.env.PORT || port)