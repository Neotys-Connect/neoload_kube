const { MongoClient } = require("mongodb");

const LIMIT = 10;

const uri = "mongodb://<user>:<password>@<server>:<port>";

const client = new MongoClient(uri);


async function collectStatistics(db, id) {
  const exp = new RegExp("^"+id);
  const colls = await db.listCollections({name: {$regex: exp}}).toArray();
  const collNames = colls.map(c => c.name);
  let sizes = [];
  for(var i=0; i<collNames.length; i++) {
    const collStats = await db.collection(collNames[i]).stats({scale: 1024});
    sizes.push({name: collNames[i], size: collStats.size, indexSize: collStats.totalIndexSize})
  }
  const reducer = (accumulator, curr) => accumulator + curr;
  const totalSize = sizes.map(s => s.size).reduce(reducer);
  const totalIndexSize = sizes.map(s => s.indexSize).reduce(reducer);
  console.log("========= " + id + " =========");
  console.log("Total size = " + Math.ceil(totalSize/1024) + " MB");
  console.log("Total size = " + Math.ceil(totalIndexSize/1024) + " MB");
}


async function run() {
  try {
    await client.connect();
    const db = client.db("neoload-on-premise");
    const biggestBenchs = await db.collection('stm-agg-dataset').find({tag:"INCOMING"}, {benchId:1}).sort({countPoints:-1}).limit(LIMIT).toArray();
    for(var i=0; i<biggestBenchs.length; i++) {
      const bench = biggestBenchs[i];
      await collectStatistics(db, bench.benchId);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
