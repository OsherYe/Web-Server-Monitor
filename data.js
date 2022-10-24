const csv = require('csv-parser') // module
const fs = require('fs');   // file stream
const { type } = require('os');
const { mainModule } = require('process');

//Store users by different keys in map. Faster Search then linear time.
const HttpURLMap = new Map();
const HealthyMap = new Map();
const UnhealthyMap = new Map();
const statusMap = new map();
const urlList = []

fs.createReadStream('data.csv')
  .pipe(csv({ mapHeaders: ({ header }) => header.toLowerCase() }))
  .on('data', async(server) => {
    await initAll(server);
    })
    .on('end', () => {
      console.log("Connected");
    });

async function initAll(server) {
  addToHttpURLMap(server);
  urlList.push(server.HttpURL);
  addToCountryMap(server);
  addToNameMap(server);
}
    
//GET METHODS
function getServerByHttp(HttpURL) {
  const ans = HttpURLMap.get(HttpURL);
  return ans ? ans : "Doesn't Exist";
}

function getServerByHealthy(healthy) {
  const ans = HealthyMap.get(healthy);
  return ans ? ans : "Doesn't Exist";
}

function getServerByUnhealthy(unhealthy) {
  const ans = UnhealthyMap.get(unhealthy);
  return ans ? ans : "Doesn't Exist";
}

function getServerByStatus(status) {
  const ans = statusMap.get(status);
  return ans ? ans : "Doesn't Exist";
}

//ADD METHODS
function addToHttpURLMap(server) {
  HttpURLMap.set(server.HttpURL, server);
}

function addToCountryMap(server) {
  const healthy = server.healthy;
  if (!HealthyMap.has(healthy)) {
    HealthyMap.set(healthy, new Map());
  }
  HealthyMap.get(healthy).set(server.HttpURL,server);
}

//DELETE METHODS
function deleteServer(HttpURL) {
  const server = HttpURLMap.get(HttpURL);
  if (server) {
      const {healthy,unhealthy} = server;
      deleteByHttpURL(HttpURL);
      deleteByHealthy(HttpURL, healthy);
      deleteByUnhealthy((HttpURL, unhealthy))
      console.log("Server Deleted")
  } else {
    console.log("No such URL, please check again.")
  }
}

function deleteByHealthy(HttpURL, healthy) {
  const healthyList = HealthyMap.get(healthy)
  if (healthyList) {
      healthyList.delete(HttpURL);
  }
}

function deleteByUnhealthy(HttpURL, healthy) {
  const unhealthyList = HealthyMap.get(healthy)
  if (unhealthyList) {
      unhealthyList.delete(HttpURL);
  }
}

function deleteByHttpURL(HttpURL) {
  HttpURLMap.delete(HttpURL);
}

module.exports = {
  getServerByHttp,
  getServerByHealthy,
  getServerByUnhealthy,
  getServerByStatus,
  deleteServer,
  urlList,
  HealthyMap,
  UnhealthyMap,
  HttpURLMap,
  statusMap
}