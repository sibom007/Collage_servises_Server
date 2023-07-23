const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send('hello');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgfbklm.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const collagecardcollaction = client.db("colage-servise").collection("collage-card collaction");
    const Candidatedatacollaction = client.db("colage-servise").collection("Candidatedata");
    const reviewcollaction = client.db("colage-servise").collection("reviewcollaction");

    app.get("/carddata", async (req, res) => {
      const query = {};
      const options = {
        limit: 6,
      };
      const result = await collagecardcollaction.find(query, options).toArray();
      res.send(result);
    });

    app.get("/carddetels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collagecardcollaction.findOne(query);
      res.send(result);
    });

    const indexKeys = { collegeName: 1 };
    const indexOptions = { name: "collegeName" };
    const result = await collagecardcollaction.createIndex(
      indexKeys,
      indexOptions
    );

    app.get("/carddata/:text", async (req, res) => {
      const searchText = req.params.text;

      const result = await collagecardcollaction
        .find({
          $or: [{ collegeName: { $regex: searchText, $options: "i" } }],
        })
        .toArray();
      res.send(result);
    });

    app.post('/Candidatedata',async(req,res)=>{
        const Candidatedata = req.body
        const result = await Candidatedatacollaction.insertOne(Candidatedata)
        res.send(result)
      
    })
    app.get('/Candidatedata',async(req,res)=>{
        const Candidatedata = req.body
        const result = await Candidatedatacollaction.find().toArray()
        res.send(result)
      
    })

    app.get("/rivewerdata/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Candidatedatacollaction.findOne(query);
      res.send(result);
    });

    app.post('/rivewerdata',async(req,res)=>{
      const Candidatedata = req.body
      const result = await reviewcollaction.insertOne(Candidatedata)
      res.send(result)
    
  })

  app.get('/rivewerdata',async(req,res)=>{
    const Candidatedata = req.body
    const result = await reviewcollaction.find().toArray()
    res.send(result)
  
})


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
