const data = require('../data');

module.exports = {
    GetServerByHttp: async function(HttpURL) {
        console.log(`getServerByHttp called with HttpURL: ${HttpURL}`);
        return data.getServerByHttp(HttpURL);
    },

    GetServerByHealthy: async function(healthy) {
        console.log(`getServerByHealthy called with healthy: ${healthy}`);
        return data.getServerByHealthy(healthy);
    },

    GetServerByUnhealthy: async function(unhealthy) {
        console.log(`getServerByUnhealthy called with unhealthy: ${unhealthy}`);
        return data.getServerByUnhealthy(unhealthy);  
    },

    GetServerByStatus: async function(serverStatus) {
        console.log(`getServerByUnhealthy called with unhealthy: ${serverStatus}`);
        return data.getServerByStatus(serverStatus);  
    },

    DeleteServer: async function(HttpURL) {
        console.log(`deleteServer called with httpURL: ${HttpURL}`);
        return data.deleteServer(HttpURL);
    }
}