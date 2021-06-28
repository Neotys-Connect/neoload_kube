const { MongoClient } = require("mongodb");

const MAX_DURATION_IN_MINUTES = 5;
const LIMIT = 200;

const uri = "mongodb://<user>:<password>@<server>:<port>";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("neoload-on-premise");
    const shortBenchs = await db.collection('bench-definition').aggregate([
        {$match: {o: {$lte: MAX_DURATION_IN_MINUTES*60*1000}}},
        {$project: {o:1, k:1, tsid:1, i:1, j:1, b:1}},
        {$sort: {o:1}},
        {$limit: LIMIT}
      ])
      .toArray();
    console.log("\n\n")
    console.log("Result ID\t\t\t\t\t| Duration (min) \t| Date\t\t\t\t\t| Test settings ID\t| Readable Name");
    for(var i=0; i<shortBenchs.length; i++) {
      const b = shortBenchs[i];
      const date = new Date(b.k).toLocaleString("en-US");
      const dateSeparator = date.length == 21 ? "\t\t\t| ":"\t\t| ";
      console.log(b._id+"\t\t| "+Math.ceil(b.o/60/1000)+"\t\t| "+date+dateSeparator+b.tsid+"\t\t|" + (b.i?b.i.n+"-":"")+(b.j?b.j.n:"")+"-"+b.b)
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
