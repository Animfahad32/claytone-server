const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://claytone:giUF07Y4YVVbdV6X@cluster0.zdqqn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    // console.log('database connected')
    const database = client.db("claytone");
    const productsCollections = database.collection("products");
    const usersCollections = database.collection("users");
    const reviewsCollections = database.collection("reviews");
    const ordersCollections = database.collection("orders");

    // Post all products api
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollections.insertOne(product);
      res.json(result);
    });
    // get all products api

    app.get("/products", async (req, res) => {
      const cursor = productsCollections.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // add reviews post api
    app.post("/addreviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollections.insertOne(review);
      res.json(result);
    });

    // add review get api

    app.get("/addreviews", async (req, res) => {
      const cursor = reviewsCollections.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //  single product api
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollections.findOne(query);
      res.json(product);
    });

    // delete single product api
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollections.deleteOne(query);
      res.json(result);
    });

    // post order api

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollections.insertOne(order);
      console.log("Hitting the post api!");
      res.json(result);
    });

    // get orders api

    app.get("/orders", async (req, res) => {
      const cursor = ordersCollections.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // delete single order api
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollections.deleteOne(query);
      res.json(result);
    });

    // Admin email check api
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollections.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // Post user info api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollections.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // Admin user API
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollections.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello ClaytoneMoka!");
});

app.listen(port, () => {
  console.log(`${port}`);
});
