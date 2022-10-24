const express = require('express');
const bodyParser = require('body-parser');
const serverModel = require('./model/servers');
const { urlList, HealthyMap, statusMap, UnhealthyMap } = require('./data');
const PORT = process.env.PORT || 8000;

const app = express();
const SUPPORTED_QUERY = ['HttpURL', 'Healthy', 'Unhealthy', 'serverStatus'];
const BAD_QUERY_MSG = `Only one query param is supported, and it must be one of the following: ${SUPPORTED_QUERY.join(', ')}`;
app.use(bodyParser.json());

setInterval (function() {
    console.log("Check every 60 seconds");
    urlList.forEach(element => {
        https.get(element, res => {
        let statusCode = res.statusCode;
        checkStatus(statusCode,element);
        });
    });
}, 60*1000 );

function checkStatus(statusCode, url) {
    if(statusCode / 100 == 2) {
        if(HealthyMap.get(url) == 4) {
            statusMap.set(url, "Success");
            HealthyMap.set(url, 0);
        } else {
            HealthyMap.set(url,get(url)+1);
        }
    } else {
        if(UnhealthyMap.get(url) == 3) {
            statusMap.set(url, "Success");
            UnhealthyMap.set(url,0);
        } else {
            UnhealthyMap.set(url,get(url)+1);
        }
    }
}

app.get('/server/:HttpURL', async (req, res, next) => {
    let httpURL = req.params.HttpURL;
    try {
        let server = await serverModel.GetServerByHttp(httpURL);
        return res.json(server);
    } catch (err){
        console.error(err, 'Error during get server');
        return res.status(500).json({
            message: 'Error during get server'
        })
    }
});

app.get('/servers', async (req, res, next) => {
    let query = req.query;
    let result;
    try {
        let queryKeys = Object.keys(query);
        if (queryKeys.length > 1 || queryKeys.length === 0 || !SUPPORTED_QUERY.includes(queryKeys[0].toLowerCase())){
            return res.status(400).json({
                message: BAD_QUERY_MSG
            })
        }

        let queryParam = queryKeys[0].toLowerCase();

        switch (queryParam){
        case 'HttpURL':
            result = await serverModel.GetServerByHttp(query.HttpURL);
            break;
        case 'Healthy':
            result = await serverModel.GetServerByHealthy(query.Healthy);
            break;
        case 'Unhealthy':
            result = await serverModel.GetServerByUnhealthy(query.Unhealthy);
            break;
        case 'serverStatus':
            result = await serverModel.GetServerByStatus(query.serverStatus);
            break;
        default:
            return res.status(400).json({
                message: BAD_QUERY_MSG
            })
        }
    } catch (err){
        console.error(err, 'Error during get servers');
        return res.status(500).json({
            message: 'Error during get servers'
        });
    }
    res.json(result);
});

app.delete('/servers/:HttpURL', async (req, res, next) => {
    let httpURL = req.params.id;
    try {
        await serverModel.DeleteServer(httpURL);
    } catch (err){
        console.error(err, 'Error during delete server');
        return res.status(500).json({
            message: 'Error during delete server'
        });
    }
    // Success
    return res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({ message: 'Path not found, only the following paths are supported: GET /servers/:HttpURL, GET /servers' });
  });

  server = app.listen(PORT, function() {
    console.log(`Test Server listening.. Access it using address: http://localhost:${PORT}`);
  });
