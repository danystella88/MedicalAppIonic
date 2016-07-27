#!/bin/env node
//  OpenShift sample Node application
// integrazione repo

// LIBRERIE VARIE
var express = require('express'); // passaggio dei dati tra client e server
var fs      = require('fs'); // legge su filesystem
var http = require('http'); // richieste web
var path = require('path'); // libreria file system
var bodyParser = require('body-parser');
var assert = require('assert');

var onesignal = require('node-opensignal-api');
var onesignal_client = onesignal.createClient();

var userAuthKey = 'YWMzNjE5ZTMtZTlmZC00ZDcxLThjMDItZDAyN2E3ZGExMDJk';
var app_id = 'a2c8861e-abb3-4300-99de-82c5a6ba6813'
var restApiKey;


// VARIABILI D'AMBIENTE
var variabili = require('./models/variabili');  // variabili di connessione

var mongojs = require('mongojs');
var db = mongojs(variabili.connection_string, ['medicalappmongodb']);

db.on('error', function (err) {
    console.log('Database error', err)
})

var COLLECTION_UTENTI = db.collection('utenti');
var COLLECTION_MEDICI = db.collection('medici');
var COLLECTION_PAZIENTI = db.collection('pazienti');
var COLLECTION_ESAMI = db.collection('esami');
var COLLECTION_MISURAZIONI = db.collection('misurazioni');

db.on('connect', function () {
    console.log('Database connesso');

});


/* Express Framework */
var app = express();
app.use(express.static('file'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Enable CORS requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//root per le richieste al sito
app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
});
app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
});

/* UTENTI  ------------------------------------------------ */

app.post('/utenti/all', function (req, res) {

    res.setHeader("Content-Type","application/json");

    COLLECTION_UTENTI.find(function (err, docs) {
        // docs is an array of all the documents in mycollection
        assert.equal(err, null);
        res.send(docs);
    });
});

app.post('/utenti/get', function (req, res) {

    res.setHeader("Content-Type","application/json");

    var submitted_userid = req.query.userId;
    COLLECTION_UTENTI.findOne({
        _id: mongojs.ObjectId(submitted_userid)
    }, function (err, doc) {
        res.send(doc);
    });
});

app.post('/utenti/getbylogin', function (req, res) {


    res.setHeader("Content-Type","application/json");

    var submitted_user = req.query.username;
    var submitted_password = req.query.password;

    COLLECTION_UTENTI.findOne({
        user : submitted_user,
        password : submitted_password
    }, function (err, doc) {
        res.send(doc);
    });
});

// FIXATO
app.post('/login', function (req, res) {

    //notification request id


    res.setHeader("Content-Type","application/json");

    var submitted_user = req.query.username;
    var submitted_password = req.query.password;
    var submitted_playerId = req.query.playerId;
    console.log("User:",submitted_user);
    var risposta = {};

    console.log(submitted_playerId)


    COLLECTION_UTENTI.findOne({

        user : submitted_user,
        password : submitted_password

    }, function (err, utente) {
        console.log(utente)
        console.log("user", submitted_user,  "pass", submitted_password)
        if (utente && utente!= null) {
            // ho effettivamente trovato un utente
            risposta.user = utente.user;
            risposta.role = utente.role;
            risposta.id = utente._id + ""; // altrimenti non viene presa come stringa
            risposta.anagrafica = {};
            risposta.medico = {};




            COLLECTION_UTENTI.update(
                { _id:mongojs.ObjectId(utente._id)},
                { $set: {playerId: submitted_playerId} },
                function (err, doc) {

                });

            // Recupero i dati anagrafici

            if (risposta.role == "1") // medico
            {
                // Cerco i dati anagrafici del medico
                COLLECTION_MEDICI.findOne({
                    idUtente: risposta.id
                }, function(err, doc) {
                    risposta.anagrafica = doc;
                    COLLECTION_ESAMI.find({idMedico: risposta.id},function (err, docs) {
                        risposta.elenco_esami = docs;
                        COLLECTION_PAZIENTI.find({idMedico: risposta.id},function (err, docs) {
                            risposta.elenco_pazienti = docs;
                            COLLECTION_MISURAZIONI.find({idMedico: risposta.id},function (err, docs) {
                                risposta.elenco_misurazioni = docs;
                                // finalmente posso inviare!
                                res.send(risposta);
                            });
                        });
                    });
                });
            }
            else if (risposta.role == "2") // paziente
            {
                COLLECTION_PAZIENTI.findOne({
                    idUtente : risposta.id
                }, function(err, doc) {
                    // doc._id.toString() === '523209c4561c640000000001'
                    risposta.anagrafica = doc;

                    // Cerco i dati anagrafici del suo medico
                    COLLECTION_MEDICI.findOne({
                        idUtente: risposta.anagrafica.idMedico + ""
                    }, function(err, doc) {
                        risposta.medico = doc;
                        COLLECTION_ESAMI.find({idPaziente: risposta.id},function (err, docs) {
                            risposta.elenco_esami = docs;
                            COLLECTION_PAZIENTI.find({idUtente: risposta.id},function (err, docs) {
                                risposta.elenco_pazienti = docs;
                                COLLECTION_MISURAZIONI.find({idPaziente: risposta.id},function (err, docs) {
                                    risposta.elenco_misurazioni = docs;
                                    // finalmente posso inviare!
                                    res.send(risposta);
                                });
                            });
                        });
                    });
                });
            }
        }
        else    // NON HO TROVATO L'UTENTE
        {
            res.send(JSON.stringify(false));
            console.log("Api Login - Errore nella ricerca dell'utente");
        }
    });
});

// FIXATO
app.post("/registrazione", function (req, res)
{
    res.setHeader("Content-Type","application/json");
    var submitted_user = req.query.username;
    var submitted_password = req.query.password;
    var submitted_role = req.query.role;

    var submitted_sesso = (req.query.sesso == 1) ? "M" : "F";
    var submitted_nome = req.query.nome;
    var submitted_cognome = req.query.cognome;
    var submitted_datadinascita = req.query.dataNascita;
    var submitted_luogodinascita = req.query.luogoNascita;
    var submitted_provinciadinascita = req.query.provinciaNascita;
    var submitted_patologia = req.query.patologia;
    var submitted_specializzazione = req.query.specializzazione;

    // Controlla se già un utente con la stessa mail è già nel DB
    COLLECTION_UTENTI.findOne({
       // user: req.params.username,
        user : submitted_user
    }, function (err, doc) {
        if (doc != null) {
            // ho trovato un utente
            console.log("Api Registrazione - Utente già presente"); // devo comunicare che l'utente già esiste
            console.log("Trovato:",JSON.stringify(doc));
            console.log("Inviati:",submitted_user);
            res.end(JSON.stringify(false)); // restituisco l'username che ho trovato nel sistema
        }
        else {
            // Non avendo trovato utenti con la stessa mail, posso inserire
            COLLECTION_UTENTI.insert({
                "user" : submitted_user,
                "password" : submitted_password,
                "role" : submitted_role
            }, function (err, result) {

                var id_utente = result._id.toString();

                if(submitted_role == "1")
                {
                    COLLECTION_MEDICI.insert({
                        "cognome": submitted_cognome,
                        "dataNascita": submitted_datadinascita,
                        "idUtente": id_utente,
                        "luogoNascita": submitted_luogodinascita,
                        "nome": submitted_nome,
                        "provinciaNascita": submitted_provinciadinascita,
                        "sesso": submitted_sesso,
                        "specializzazione": submitted_specializzazione
                   }, function (err, result) {

                        console.log('Inserito nel db medici.');

                    });
                }
                else if(submitted_role == "2")
                {
                    COLLECTION_PAZIENTI.insert({
                        "cognome": submitted_cognome,
                        "dataNascita": submitted_datadinascita,
                        "idUtente": id_utente,
                        "luogoNascita": submitted_luogodinascita,
                        "nome": submitted_nome,
                        "provinciaNascita": submitted_provinciadinascita,
                        "sesso": submitted_sesso,
                        "patologia": submitted_patologia
                    }, function (err, result) {

                        console.log('inserito nel db pazienti');
                    });
                }
                // registrazione andata a buon fine!
                res.end(JSON.stringify(true));
            });
        }
    });
});

/* MEDICI  ------------------------------------------------ */

app.post('/medici/all', function (req, res) {

    res.setHeader("Content-Type","application/json");
    COLLECTION_MEDICI.find(function (err, docs) {

        res.send(docs);
    });
});

app.post('/medici/get', function (req, res)
{
    res.setHeader("Content-Type","application/json");
    var submitted_medicoId = req.query.medicoId;
    COLLECTION_MEDICI.findOne({
        idUtente : submitted_medicoId
    }, function(err, doc) {
        res.send(doc);
    });
});

/* PAZIENTI  ------------------------------------------------ */

// FIXATO
app.post('/pazienti/all', function (req, res) {
    res.setHeader("Content-Type","application/json");
    COLLECTION_PAZIENTI.find(function (err, docs) {

        res.send(docs);
    });
});

// FIXATO
app.post('/pazienti/setmedico', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_pazienteId = req.query.pazienteId.toString();
    var submitted_medicoId = req.query.medicoId.toString();

    COLLECTION_PAZIENTI.findAndModify({
        query: { idUtente: submitted_pazienteId},
        update: { $set: { idMedico: submitted_medicoId } },
        new: true
    }, function (err, doc, lastErrorObject) {

        res.send(doc);
    });
});

app.post('/paziente/setpatologia', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_pazienteId = req.query.pazienteId.toString();
    var submitted_patologia = req.query.patologia.toString();

    COLLECTION_PAZIENTI.findAndModify({
        query: { idUtente: submitted_pazienteId},
        update: { $set: { patologia: submitted_patologia } },
        new: true
    }, function (err, doc, lastErrorObject) {

        res.send(doc);
    });
});


app.post('/pazienti/get', function (req, res)
{
    res.setHeader("Content-Type","application/json");
    var submitted_pazienteId = req.query.pazienteId;
    COLLECTION_PAZIENTI.findOne({
        idUtente : submitted_pazienteId
    }, function(err, doc) {
        res.send(doc);
    });
});

app.post('/pazienti/bymedico', function (req, res)
{
    res.setHeader("Content-Type","application/json");
    var submitted_medicoId = req.query.medicoId;
    COLLECTION_PAZIENTI.find({
        idMedico : submitted_medicoId
    }, function(err, docs) {

        res.send(docs);
    });
});

/* ESAMI  ------------------------------------------------ */

app.post('/esami/all', function (req, res) {
    res.setHeader("Content-Type","application/json");
    COLLECTION_ESAMI.find(function (err, docs)
    {
        res.send(docs);
    });
});

app.post('/esami/get', function (req, res)
{
    res.setHeader("Content-Type","application/json");
    var submitted_esameId = req.query.esameId;
    COLLECTION_ESAMI.findOne({
        _id: mongojs.ObjectId(submitted_esameId)
    }, function (err, doc) {
        res.send(doc);
    });
});

app.post('/esami/bymedico', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_medicoId = req.query.medicoId;
    COLLECTION_ESAMI.find({idMedico: submitted_medicoId},function (err, docs) {

        res.send(docs);
    });
});

app.post('/esami/bypaziente', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_pazienteId = req.query.pazienteId;
    COLLECTION_ESAMI.find({idPaziente: submitted_pazienteId},function (err, docs) {

        res.send(docs);
    });
});

app.post('/esami/segnacompletato', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_esameId = req.query.esameId;
    COLLECTION_ESAMI.findAndModify({
        query: { _id: mongojs.ObjectId(submitted_esameId) },
        update: { $set: { completato: "1" } },
        new: true
    }, function (err, doc, lastErrorObject) {
        res.send(doc);
    });
});

app.post('/esami/segnanoncompletato', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_esameId = req.query.esameId;
    COLLECTION_ESAMI.findAndModify({
        query: { _id: mongojs.ObjectId(submitted_esameId) },
        update: { $set: { completato: "0" } },
        new: true
    }, function (err, doc, lastErrorObject) {
        res.send(doc);
    });
});


app.post('/esami/add', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_pazienteId = req.query.pazienteId;
    var submitted_medicoId = req.query.medicoId;
    var submitted_descrizione = req.query.descrizione;

    COLLECTION_ESAMI.insert({
        "idMedico": submitted_medicoId,
        "idPaziente": submitted_pazienteId,
        "descrizione": submitted_descrizione,
        "completato" : "0"
    }, function (err, result) {

        notifyClient(submitted_pazienteId, "Esame Aggiunto", "Il tuo medico ti ha inviato un nuovo esame!")
        res.send(result);
    });
});

// PUSH -------------------------------------------


app.get('/esami/segnanoncompletato', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_esameId = req.query.esameId;
    COLLECTION_ESAMI.findAndModify({
        query: { _id: mongojs.ObjectId(submitted_esameId) },
        update: { $set: { completato: "0" } },
        new: true
    }, function (err, doc, lastErrorObject) {
        res.send(doc);
    });
});


app.post('/misurazioni/add', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_pazienteId = req.query.pazienteId;
    var submitted_medicoId = req.query.medicoId;
    var submitted_esameId =req.query.esameId;
    var submitted_descrizione = req.query.descrizione;
    var submitted_dato1 = req.query.dato1;
    var submitted_dato2 =req.query.dato2;

    var data = new Date(parseInt(this.toString().slice(0,8), 16)*1000);

    COLLECTION_MISURAZIONI.insert({
        "idPaziente": submitted_pazienteId,
        "idMedico": submitted_medicoId,
        "idEsame": submitted_esameId,
        "descrizione" : submitted_descrizione,
        "dato1" : submitted_dato1,
        "dato2" : submitted_dato2,
        "data" : data
    }, function (err, result) {
        res.send(result);
    });
});



app.post('/misurazioni/getbyesame', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_esameId =req.query.esameId;

    COLLECTION_MISURAZIONI.find({idEsame: submitted_esameId},function (err, docs) {

        res.send(docs);
    });
});

app.post('/misurazioni/getbypaziente', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_pazienteId =req.query.pazienteId;

    COLLECTION_MISURAZIONI.find({idPaziente: submitted_pazienteId},function (err, docs) {

        res.send(docs);
    });
});

app.post('/misurazioni/getbymedico', function (req, res) {
    res.setHeader("Content-Type","application/json");
    var submitted_medicoId =req.query.medicoId;

    COLLECTION_MISURAZIONI.find({idMedico: submitted_medicoId},function (err, docs) {

        res.send(docs);
    });
});

app.post('/esame/deletemisurazione', function(req,res) {

    var idesame = req.query.idesame;
    var nomemisurazione = req.query.nomemisurazione;




    COLLECTION_ESAMI.update(
        { _id:mongojs.ObjectId(idesame)},
        { $pull: { misurazioni: { nome: nomemisurazione } } },
        function (err, doc) {
            res.send("ok")
    });

});

app.post('/esame/addmisurazione', function(req,res) {

    var idesame = req.query.esameId;
    var descrizione = req.query.descrizione;
    var valore = req.query.valore;
    var giorno = req.query.giorno;
    var orario = req.query.orario;
    console.log(idesame, descrizione, valore)


    COLLECTION_ESAMI.update(
        { _id:mongojs.ObjectId(idesame)},
        { $push: { misurazioni: { nome: descrizione,valore: valore, giorno: giorno, orario: orario } } },
        function (err, doc) {


            COLLECTION_ESAMI.findOne({
                _id: mongojs.ObjectId(idesame)
            }, function(err, doc) {
                var idMedico = doc.idMedico;
                notifyClient(idMedico, "Misurazione Aggiunta", "Il tuo paziente ha inserito una nuova misurazione!");
            })

            // console.log(doc)
            //var idMedico =doc.idMedico;

            res.send("ok")
        });


});



/* AVVIA IL SERVER FINALMENTE */

var server = app.listen(variabili.portserver,variabili.ipserver, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("MedicalApp Server listening at", host, port);
});

function notifyClient(userId, title, msg) {
    COLLECTION_UTENTI.findOne({
        _id: mongojs.ObjectId(userId)
    }, function (err, doc) {
        console.log(doc.playerId)
        var restApiKey = 'ODVhM2NkZTctN2Q4MC00Zjg5LTk4OGItNDg4Mjc4ZThlMTk5';
        var params = {
            app_id: app_id,
            contents: {
                'en': msg,
                'it': msg
            },
            headings: {
                'en': title,
                'it' : title
            },
            include_player_ids : [doc.playerId]


        };
        onesignal_client.notifications.create(restApiKey, params, function (err, response) {
            if (err) {
                console.log('Encountered error', err);
            } else {
                return true;
            }
        });
    });


}
