var services = angular.module('starter.services', []);

// CONFIGURAZIONE SERVER  --------------------------------
// Host: RedHat Openshift

var hostOptionsOpenShift = {
  host : 'http://medicalappmongodb-danielar.rhcloud.com', // here only the domain name
  method : 'POST' // do GET
};

var hostOptions = hostOptionsOpenShift;

services.service('Utenti',function($http)
{
  this.login = function(username,password,id_player)
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/login',
      params: {username:username,password:password, playerId:id_player}
    });
  };

  this.registra = function(username,password,choice, nome, cognome, cfiscale, sesso, datadinascita, luogodinascita, provinciaNascita, patologia, specializzazione)
  {
    return $http({
      method: 'POST',
      url: hostOptions.host + '/registrazione',
      params:
      {
              username: username,
              password: password,
              role: choice,
              nome: nome,
              cognome: cognome,
              cfiscale: cfiscale,
              sesso: sesso,
              dataNascita: datadinascita,
              luogoNascita: luogodinascita,
              provinciaNascita: provinciaNascita,
              patologia: patologia,
              specializzazione: specializzazione
      }
    });
  };

  this.getUserById = function(userId)
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/utenti/get',
      params: { userId: userId }
    });
  };

  this.getUserByLogin = function(username, password)
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/utenti/getbylogin',
      params: { username: username, password: password }
    });
  };

  this.getAllUsers = function()
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/utenti/all'
    });
  };
  return this;
});

services.factory('Pazienti', function($http)
{
  this.getAllPazienti = function(){
    return $http({
      method: 'POST',
      url : hostOptions.host + '/pazienti/all'
    });
  };

  this.getPazienteById = function(pazienteId){
    return $http({
      method: 'POST',
      url : hostOptions.host + '/pazienti/get',
      params : { pazienteId: pazienteId}
    });
  };

  this.getPazientiByMedico = function(medicoId){
    return $http({
      method: 'POST',
      url : hostOptions.host + '/pazienti/bymedico',
      params : { medicoId: medicoId}
    });
  };

  this.setMedico = function(pazienteId, medicoId){
    return $http({
      method: 'POST',
      url : hostOptions.host + '/pazienti/setmedico',
      params : { pazienteId: pazienteId, medicoId: medicoId}
    });
  };

  this.removeMedico = function(pazienteId){
    return $http({
      method: 'POST',
      url : hostOptions.host + '/pazienti/setmedico',
      params : { pazienteId: pazienteId, medicoId: 0}
    });
  };

  this.setPatologia = function(pazienteId, patologia){
    return $http({
      method: 'POST',
      url : hostOptions.host + '/paziente/setpatologia',
      params : { pazienteId: pazienteId, patologia: patologia}
    });
  };

  return this;
});

services.factory('Medici', function($http)
{

  this.getAllPazienti = function()
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/medici/all'
    });
  };

  this.getMedicoById = function(pazienteId)
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/medici/get',
      params : { medicoId: medicoId}
    });
  };
  return this;
});

services.factory('Esami', function($http)
{


  this.removeMisurazione = function(idesame,nomemisurazione){
    return $http({
      method: 'POST',
      url : hostOptions.host + '/esame/deletemisurazione',
      params:{idesame:idesame,nomemisurazione:nomemisurazione}
    });
  };


  this.getAllEsami = function()
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/esami/all'
    });
  };

  this.getEsameById = function(esameId)
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/esami/get',
      params : {esameId: esameId}
    });
  };

  this.setEsameCompletato = function(esameId)
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/esami/segnacompletato',
      params : { esameId: esameId}
    });
  };

  this.setEsameNonCompletato = function(esameId)
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/esami/segnanoncompletato',
      params : { esameId: esameId}
    });
  };

  this.getEsamiByMedico = function(medicoId)
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/esami/bymedico',
      params : { medicoId: medicoId}
    });
  };

  this.getEsamiByPaziente = function(pazienteId)
  {
    return $http({
      method: 'POST',
      url : hostOptions.host + '/esami/bypaziente',
      params : { pazienteId: pazienteId}
    });
  };

  this.addEsame = function (medicoId, pazienteId, descrizione) {
    return $http({
      method: 'POST',
      url: hostOptions.host + '/esami/add',
      params: {
        pazienteId: pazienteId,
        medicoId: medicoId,
        descrizione: descrizione
      }
    });
  };

  this.addMisurazione = function (esameId, descrizione, valore, giorno, orario) {

    return $http({
      method: 'POST',
      url: hostOptions.host + '/esame/addmisurazione',
      params: {
        esameId: esameId,
        descrizione: descrizione,
        valore: valore,
        giorno: giorno,
        orario: orario
      }
    });
  };

  this.getMisurazioniByEsame = function ( esameId) {
    return $http({
      method: 'POST',
      url: hostOptions.host + '/misurazioni/getbyesame',
      params: {
        esameId: esameId
      }
    });
  };


  return this;
});

/*
services.service('Misurazioni', function ($http) {
  this.addDatiMisurazione = function (pazienteId, medicoId, esameId, descrizione, dato1, dato2) {
    console.log("AddMisurazione",medicoId);
    return $http({
      method: 'POST',
      url: hostOptions.host + '/misurazioni/add',
      params: {
        pazienteId: pazienteId,
        medicoId: medicoId,
        esameId: esameId,
        descrizione: descrizione,
        dato1: dato1,
        dato2: dato2
      }
    });
  };

  this.getMisurazioniByEsame = function (esameId) {
    return $http({
      method: 'POST',
      url: hostOptions.host + '/misurazioni/getbyesame',
      params: {
        esameId: esameId
      }
    });
  };

  this.getMisurazioniByPaziente = function (pazienteId) {
    return $http({
      method: 'POST',
      url: hostOptions.host + '/misurazioni/getbypaziente',
      params: {
        pazienteId: pazienteId
      }
    });
  };

  this.getMisurazioniByMedico = function (medicoId) {
    return $http({
      method: 'POST',
      url: hostOptions.host + '/misurazioni/getbymedico',
      params: {
        medicoId: medicoId
      }
    });
  };

  return this;
});
*/

// ----------------------------------------------------------------

// Servizio che consente di gestire una copia locale dei dati
services.service('Variabili', function() {

  // private variable
  var _userinfo = {};

  // public API

  this.user_info = _userinfo;

  this.getEsameById = function(esameId)
  {
    for(var i=0;i< this.user_info.elenco_esami.length;i++)
    {
      if( this.user_info.elenco_esami[i]._id == esameId)
        return this.user_info.elenco_esami[i];
    }
    return null;
  };

  this.getEsamiByPaziente = function(pazienteId)
  {
    var risultato = [];
    for(var i=0;i< this.user_info.elenco_esami.length;i++)
    {
      if( this.user_info.elenco_esami[i].idPaziente == pazienteId)
        risultato.push(this.user_info.elenco_esami[i]);
    }
    return risultato;
  };



  this.getPazienteById = function(pazienteId)
  {
    console.log(this.user_info.elenco_pazienti);

    for (var i = 0; i < this.user_info.elenco_pazienti.length; i++) {

      if (this.user_info.elenco_pazienti[i].idUtente == pazienteId) {
        return this.user_info.elenco_pazienti[i];
      }
    }
  };

  this.getPazienteArrayPositionById = function(pazienteId)
  {
    for (var i = 0; i < this.user_info.elenco_pazienti.length; i++) {

      if (this.user_info.elenco_pazienti[i].idUtente == pazienteId) {
        return i;
      }
    }
  };

  this.setPazienteById = function(pazienteId, newData)
  {
    // Ottengo l'id di array del paziente con quell'id
    var posizione = this.getPazienteArrayPositionById(pazienteId);
    this.user_info.elenco_pazienti[posizione] = newData;
  };



  this.getPazienteByNomeCognome = function(nome, cognome)
  {
    for (var i = 0; i < this.user_info.elenco_pazienti.length; i++) {
      if (this.user_info.elenco_pazienti[i].nome == nome && this.user_info.elenco_pazienti[i].cognome == cognome) {
        return this.user_info.elenco_pazienti[i].idUtente;
      }
    }
  };

  this.getMisurazioniByEsame = function(esameId)
  {
    var elenco_misurazioni_per_esame = [];
    for (var i = 0; i < this.user_info.elenco_misurazioni.length; i++) {
      if(this.user_info.elenco_misurazioni[i].idEsame == esameId)
      {
        elenco_misurazioni_per_esame.push(this.user_info.elenco_misurazioni[i]);
      }
    }
    return elenco_misurazioni_per_esame;

  };



  return this;
});
