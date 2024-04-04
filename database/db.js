const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb+srv://aboood:UNBFqjTpLgeUMQkl@cluster0.bn3dcrh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = MONGODB_URI;
const options = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global;
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Adding a console log for successful connection
clientPromise.then(() => {
  console.log("Successfully connected to MongoDB!");
});

module.exports = clientPromise;
