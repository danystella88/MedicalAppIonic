/**
 * Created by lucaluke on 05/07/16.
 */
/* VARIABILI D'AMBIENTE */
var ipserver = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var portserver= process.env.OPENSHIFT_NODEJS_PORT || 8081;
var logmongodb= process.env.OPENSHIFT_MONGODB_DB_LOG_DIR;
var mongodburl = process.env.OPENSHIFT_MONGODB_DB_URL;


var UTENTI_COLLECTION = "utenti";

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/YOUR_APP_NAME';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
};


module.exports.mongodburl = mongodburl;
module.exports.ipserver =ipserver;
module.exports.portserver =portserver;
module.exports.connection_string = connection_string;

console.log('[Variabili] caricato correttamente');