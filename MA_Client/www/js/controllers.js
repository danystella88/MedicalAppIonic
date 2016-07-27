/* Controllers per le pagine comuni (login, logout, registrazione, ecc) */

/*Funzioni e Variabili Ausiliarie*/

var tab_controller;
var login_controller;
var account_controller;

var gestisciErrori = function (Variabili, $state, $ionicPopup) {
  // Se le variabili si svuotano (per esempio, per un refresh, o per modifiche al codice), torniamo alla schermata di login
  if (!Variabili.user_info.id || Variabili.user_info.id == undefined) {
    /*localStorage.clear();
    tab_controller.tabreload();
    $state.go('tab.login');*/
    $window.location.reload(true);
  }
};

function getFormattedDay() {
  var date = new Date();

  var month = date.getMonth() + 1;
  var day = date.getDate();

  month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;

  var str = day + "/" + month + "/" + date.getFullYear();

  /*alert(str);*/

  return str;
}

function getFormattedHour() {
  var date = new Date();

  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();

  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;
  sec = (sec < 10 ? "0" : "") + sec;

  var str = hour + ":" + min;

  /*alert(str);*/

  return str;
}

var app = angular.module('starter.controllers', []);

/*Controllers per schermate COMUNI*/

app.controller('tabController', function ($scope, $state, $ionicHistory, Variabili) {

  $scope.loginType = localStorage.getItem('loginType');


  $scope.tabMedicoShow = function () {
    if ($scope.loginType == '1') {
      return "ng-show";
    } else {
      return "ng-hide";
    }
  };
  $scope.tabPazienteShow = function () {
    if ($scope.loginType == '2') {
      return "ng-show";
    } else {
      return "ng-hide";
    }
  };

  $scope.tabSloggatoShow = function () {
    if ($scope.loginType == '0' || !$scope.loginType || $scope.loginType == null) {
      return "ng-show";
    } else {
      return "ng-hide";
    }
  };

  $scope.tabLoggatoShow = function () {
    if ($scope.loginType == '1' || $scope.loginType == '2') {
      return "ng-show";
    } else {
      return "ng-hide";
    }
  };

  $scope.tabreload = function () {

    $scope.loginType = localStorage.getItem('loginType');


    /*
     if (Variabili.user_info.role == 0) {
     return "ng-show";
     } else {
     return "ng-hide";
     }

     if (Variabili.user_info.role == 2) {
     return "ng-show";
     } else {
     return "ng-hide";
     }

     if (Variabili.user_info.role == 1) {
     return "ng-show";
     } else {
     return "ng-hide";
     } */


    $scope.refreshLayout;
  };


  // Evitiamo che i dettagli di un esame/paziente/ permangano nella view di un tab anche quando l'utente ha cliccato esplicitamente
  $scope.goToPaziente_Riepilogo = function () {
    $ionicHistory.clearHistory();
    $state.go('tab.riepilogo');
  };

  $scope.goToPaziente_ElencoEsami = function () {
    $ionicHistory.clearHistory();
    $state.go('tab.elenco_esami');
  };





  $scope.goToMedico_ElencoPazienti = function () {
    $ionicHistory.clearHistory();
    $state.go('tab.pazienti');
  };

  tab_controller = $scope;


});

app.controller('LoginController', function ($scope, $state, $ionicLoading, $ionicPopup, Pazienti, Esami, Utenti, Variabili) {

  // FUNZIONI DELLO SCOPE

  // ISTRUZIONI DA ESEGUIRE

  localStorage.setItem("loginType", '0'); // verrà modificato se e solo se l'utente viene correttamente loggato
  Variabili.user_info.role = "0";

  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  $scope.submit = function (username, password) {

    $scope.show($ionicLoading);
    window.plugins.OneSignal.getIds(function (ids) {

      /*
       console.log('getIds: ' + JSON.stringify(ids));
       alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);*/

      var id_player = ids.userId;
      var httpPost = Utenti.login(username, password, id_player);

      httpPost.success(function (response) {

        if (response == false) {
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
          $state.go($state.current, {}, {reload: true});
        }
        else {
          Variabili.user_info = response;
          console.log(Variabili);
          if (Variabili.user_info.role != "0") {
            localStorage.setItem('loginType', Variabili.user_info.role);
            localStorage.setItem('id', Variabili.user_info._id);
          }

          if (Variabili.user_info.role == '1') {
            $state.go('tab.pazienti');
          }
          else if (Variabili.user_info.role == '2') {
            $state.go('tab.riepilogo');
          }
          /*
          else {

            // ripristino i tab da non loggato
            localStorage.setItem("loginType", '0'); // verrà modificato se e solo se l'utente viene correttamente loggato
            Variabili.user_info = {};
          }*/
          tab_controller.tabreload();
        }
      }).error(function (data) {

        console.log("Error data");
        console.log(data);

        // Do something on error
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
        localStorage.setItem("loginType", '0'); // verrà modificato se e solo se l'utente viene correttamente loggato
        Variabili.user_info = {};
        tab_controller.tabreload();
      }).finally(function ($ionicLoading) {
        // On both cases hide the loading
        $scope.hide($ionicLoading);
        $scope.refreshLayout;
      });

    });


  };


  login_controller = $scope;
});

app.controller('RegistrazioneController', function ($scope, $state, $ionicLoading, $ionicPopup, Utenti, Variabili) {
  $scope.choice = 2; // Scelta di default nell'interfaccia grafica

  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };


  $scope.submit = function (username, password, choice, nome, cognome, cfiscale, sesso, datadinascita, luogodinascita, provinciaNascita, patologia, specializzazione) {
    $scope.show($ionicLoading);
    var httpPost = Utenti.registra(username, password, choice, nome, cognome, cfiscale, sesso, datadinascita, luogodinascita, provinciaNascita, patologia, specializzazione);
    console.log(httpPost);
    httpPost.success(function (response) {

      console.log("Risposta del server per la registrazione:");
      console.log(response);

      $ionicPopup.alert({
        title: 'Registrazione effettuata!',
        template: "Ti sei registrato correttamente con l'username " + username
      });

      window.plugins.OneSignal.getIds(function (ids) {

        /*
         console.log('getIds: ' + JSON.stringify(ids));
         alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);*/

        var id_player = ids.userId;
        var httpPost = Utenti.login(username, password, id_player);

        httpPost.success(function (response) {

          Variabili.user_info = response;
          console.log(Variabili);
          if (Variabili.user_info.role != "0") {
            localStorage.setItem('loginType', Variabili.user_info.role);
            localStorage.setItem('id', Variabili.user_info._id);
          }

          if (Variabili.user_info.role == '1') {
            $state.go('tab.pazienti');
          }
          else if (Variabili.user_info.role == '2') {
            $state.go('tab.riepilogo');
          }

          tab_controller.tabreload();

        }).error(function (data) {

          console.log("Error data");
          console.log(data);

          // Do something on error
          var alertPopup = $ionicPopup.alert({
            title: 'Login fallito!',
            template: 'Per favore, controlla il tuo username e la tua password.'
          });
        }).finally(function ($ionicLoading) {
          // On both cases hide the loading
          $scope.hide($ionicLoading);
        });

      });

    }).error(function (data) {
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Registrazione fallita!',
        template: "Il server ha risposto con status " + data.statusCode.toString()
      });
    }).finally(function ($ionicLoading) {
      // On both cases hide the loading
      $scope.hide($ionicLoading);
    });
  };
});

/*Controllers per schermate MEDICO*/

app.controller('Medico_InfoAccountController', function ($scope, $state, $ionicPopup, $ionicHistory, Variabili) {
  gestisciErrori(Variabili, $state, $ionicPopup);

  $scope.user_info = Variabili.user_info;

  $scope.role = $scope.user_info.role;


  $scope.logout = function ()
  {
    // Se le variabili si svuotano (per esempio, per un refresh, o per modifiche al codice), torniamo alla schermata di login
    /*
    var alertPopup = $ionicPopup.alert({
      title: 'Logout effettuato!',
      template: "Clicca sui pulsanti in basso per effettuare un' azione"
    });*/

    Variabili = {};
    localStorage.setItem("loginType", '0');
    Variabili.user_info.role = '0';
    tab_controller.tabreload();
    $state.go('tab.login', {}, {reload: true});
  };
  account_controller = $scope;
});

app.controller('Medico_ElencoPazientiController', function ($scope, $state, $ionicLoading, $ionicPopup, Variabili, Pazienti) {

  gestisciErrori(Variabili, $state, $ionicPopup);

  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  $scope.addPaziente = function () {
    $state.go('tab.addPaziente');
  };

  $scope.aggiornaListaPazienti = function () {
    // si può anche pensare di aggiornare questi valori tramite internet

    $scope.show($ionicLoading);
    var httpPost = Pazienti.getPazientiByMedico(Variabili.user_info.id);
    httpPost.success(function (response) {
      Variabili.user_info.elenco_pazienti = response;
      $scope.elenco_pazienti = Variabili.user_info.elenco_pazienti;
      $scope.hide($ionicLoading);
    }).error(function (data) {
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "Errore nel recupero dei dati"
      });
    }).finally(function ($ionicLoading) {
      // On both cases hide the loading
      $scope.hide($ionicLoading);
      $scope.$broadcast('scroll.refreshComplete');
    });


  };

  $scope.removePaziente = function (pazienteId) {

    Pazienti.removeMedico(pazienteId);
    $scope.aggiornaListaPazienti();

  };

  $scope.aggiornaListaPazienti();
});

app.controller('Medico_DettagliPazienteController', function ($scope, $stateParams, $state, $ionicLoading, $ionicPopup, Variabili, Pazienti, Esami) {


  // COMANDI

  // FUNZIONI INTERNE

  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  gestisciErrori(Variabili, $state, $ionicPopup);
  $scope.formPatologiaEnabled = 0;
  $scope.show($ionicLoading);
  $scope.refreshLayout;
  var httpPost = Pazienti.getPazienteById($stateParams.pazienteId);
  httpPost.success(function (response) {
    Variabili.setPazienteById($stateParams.pazienteId, response); // aggiorno la copia locale
    $scope.paziente = response;
  }).error(function (data) {
    var alertPopup = $ionicPopup.alert({
      title: 'Errore!',
      template: "C'è stato un problema con l'elaborazione dei tuoi dati"
    });
  }).finally(function (data) {
    //$scope.hide($ionicLoading);
    scope.$broadcast('scroll.refreshComplete');
    $scope.refreshLayout;
    $scope.hide();
  });

  httpPost = Esami.getEsamiByPaziente($stateParams.pazienteId);
  httpPost.success(function (response) {

    $scope.esami = response;
    $scope.nessunEsameVisible = ($scope.esami.length == 0) ? 1 : 0;
    $scope.esami.forEach(function (esame) {
      $scope.esame = esame;
      $scope.esame.completatoString = (esame.completato == "1") ? "Si" : "No";
    });

  }).error(function (data) {
    var alertPopup = $ionicPopup.alert({
      title: 'Errore!',
      template: "C'è stato un problema con l'elaborazione dei tuoi dati"
    });
  }).finally(function (data) {
    $scope.hide($ionicLoading);
  });



  // BOX ASSEGNA ESAME

  $scope.assegnaEsame = function (descrizione) {
    $scope.show();
    var httpPost = Esami.addEsame(Variabili.user_info.id, $stateParams.pazienteId, descrizione);
    httpPost.success(function (response) {
      var alertPopup = $ionicPopup.alert({
        title: 'OK!',
        template: "Inserimento esame andato a buon fine!"
      });

      $scope.mostraEsameBox = 0;
      //$scope.refreshLayout();
    }).error(function (data) {
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function () {
      // On both cases hide the loading
      $scope.hide();
      $scope.aggiornaDettagliPaziente;
      $scope.refreshLayout;
      var p_id = $stateParams.pazienteId;
      $state.go($state.current, {pazienteId: p_id}, {reload: true});
    });
  };

  $scope.showFormPatologia = function () {
    $scope.formPatologiaEnabled = 1;
  };

  // ausiliaria, poi la tolgo
  $scope.$parent.cambiaPatologia = function (pazienteID, patologia) {
    $scope.cambiaPatologia(pazienteID, patologia);
  };

  $scope.cambiaPatologia = function (pazienteId, patologia) {

    var httpPost = Pazienti.setPatologia(pazienteId, patologia);
    httpPost.success(function (response) {
      var alertPopup = $ionicPopup.alert({
        title: 'Modifica Patologia',
        template: "Patologia modificata con successo!"
      });
      $scope.refreshLayout;
    }).error(function (data) {
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function ($ionicLoading) {
      // On both cases hide the loading
      $scope.hide($ionicLoading);
      $state.go('tab.paziente-detail', {pazienteId: pazienteId}, {reload: true});
    });

  };



  $scope.showAssegnaEsameBox = function () {
    // Qui bisogna aggiungere un esame
    $scope.mostraEsameBox = 1;
  };

  $scope.hideAssegnaEsameBox = function () {
    $scope.mostraEsameBox = 0;
  };



  $scope.toListaPazienti = function () {
    // Indietro alla lista dei pazienti
    $state.go('tab.pazienti');
  };

  $scope.goToAssegnaEsame = function () {
    $state.go('tab.aggiungiEsame', {pazienteId: $stateParams.pazienteId}, {reload: true});
  };



  $scope.aggiornaDettagliPaziente = function () {
    $scope.formPatologiaEnabled = 0;
    $scope.show($ionicLoading);
    $scope.refreshLayout;
    var httpPost = Pazienti.getPazienteById($stateParams.pazienteId);
    httpPost.success(function (response) {
      Variabili.setPazienteById($stateParams.pazienteId, response); // aggiorno la copia locale
      $scope.paziente = response;
    }).error(function (data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function (data) {
      $scope.hide($ionicLoading);
      scope.$broadcast('scroll.refreshComplete');
      $scope.refreshLayout;
      $scope.hide();
    });

    httpPost = Esami.getEsamiByPaziente($stateParams.pazienteId);
    httpPost.success(function (response) {

      $scope.esami = response;
      $scope.nessunEsameVisible = ($scope.esami.length == 0) ? 1 : 0;
      $scope.esami.forEach(function (esame) {
        $scope.esame = esame;
        $scope.esame.completatoString = (esame.completato == "1") ? "Si" : "No";
      });

    }).error(function (data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function (data) {
      $scope.hide($ionicLoading);
    });
  };
});

app.controller('Medico_AggiungiPazienteController', function ($scope, $state, $stateParams, $q, $http, $ionicLoading, $ionicPopup, $ionicHistory, Pazienti, Variabili) {
  gestisciErrori(Variabili, $state);


  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  $scope.goToMedico_ElencoPazienti = function () {
    $ionicHistory.clearHistory();
    $state.go('tab.pazienti', {}, {});
  };

  $scope.toListaPazienti = function () {
    // Indietro alla lista dei pazienti
    $ionicHistory.clearHistory();
    $state.go('tab.pazienti');
  };


  // Con lista filtrata


  var httpPost = Pazienti.getAllPazienti();
  httpPost.success(function (response) {

    $scope.elenco_tutti_pazienti = response;
    for (var i = 0; i < response.length; i++) {
      $scope.elenco_tutti_pazienti[i].nomecognomelabel = response[i].nome + " " + response[i].cognome;

      if ($scope.elenco_tutti_pazienti[i].idMedico == Variabili.user_info.id)
        $scope.elenco_tutti_pazienti[i].enabled = 0;
      else
        $scope.elenco_tutti_pazienti[i].enabled = 1;
    }

    $scope.refreshLayout;
  }, function (error) {
    console.log(error);
  });


  $scope.submit_filtrato = function (chosenID) {

    $scope.show($ionicLoading);

    var httpPost = Pazienti.setMedico(chosenID, Variabili.user_info.id);
    httpPost.success(function (response) {
      var alertPopup = $ionicPopup.alert({
        title: 'Inserimento Paziente',
        template: "Hai inserito un nuovo paziente!"
      });
      //$scope.refreshLayout;
    }).error(function (data) {
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function ($ionicLoading) {
      // On both cases hide the loading
      $scope.hide($ionicLoading);
      $state.go('tab.pazienti', {}, {reload: true});
    });


    $scope.refreshLayout;
  };
});

app.controller('Medico_AggiungiEsameController', function ($scope, $stateParams, $state, $ionicLoading, $ionicPopup, Variabili, Pazienti, Esami) {

  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  $scope.assegnaEsame = function (descrizione) {
    $scope.show();
    var httpPost = Esami.addEsame(Variabili.user_info.id, $stateParams.pazienteId, descrizione);
    httpPost.success(function (response) {
      var alertPopup = $ionicPopup.alert({
        title: 'OK!',
        template: "Inserimento esame andato a buon fine!"
      });

      $scope.mostraEsameBox = 0;
      //$scope.refreshLayout();
    }).error(function (data) {
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'Ã¨ stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function () {
      // On both cases hide the loading
      $scope.hide();
      $scope.aggiornaDettagliPaziente;
      $scope.refreshLayout;
      var p_id = $stateParams.pazienteId;
      $state.go('tab.pazienti', {pazienteId: p_id}, {reload: true});
    });
  };

  $scope.toListaPazienti = function () {
    // Indietro alla lista dei pazienti
    $state.go('tab.pazienti');
  };
});

app.controller('Medico_DettagliEsameController', function ($scope, $state, $stateParams, $ionicLoading, $ionicPopup, Esami, Variabili) {

  // FUNZIONI INTERNE

  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  /*
   $scope.modificaDescrizione = function () {
   alert("Da implementare!");
   }; */

  $scope.segnaEsameCompletato = function () {
    $scope.refreshLayout;
    $scope.show($ionicLoading);
    var httpPost = Esami.setEsameCompletato($stateParams.esameId);
    httpPost.success(function (response) {
      $scope.esame = response; //assign data here to your $scope object
      $scope.esame.completatoString = ($scope.esame.completato == "1") ? "Si" : "No";

      // Devo aggiornare la copia locale dell'elenco degli esami
      Variabili.user_info.elenco_esami = Esami.getEsamiByPaziente($scope.esame.idPaziente);

    }).error(function (data) {
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function ($ionicLoading) {
      // On both cases hide the loading
      $scope.hide($ionicLoading);
      $scope.refreshLayout;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.segnaEsameNonCompletato = function () {
    $scope.refreshLayout;
    $scope.show($ionicLoading);
    var httpPost = Esami.setEsameNonCompletato($stateParams.esameId);
    httpPost.success(function (response) {
      $scope.esame = response; //assign data here to your $scope object
      $scope.esame.completatoString = ($scope.esame.completato == "1") ? "Si" : "No";

      // Devo aggiornare la copia locale dell'elenco degli esami
      Variabili.user_info.elenco_esami = Esami.getEsamiByPaziente($scope.esame.idPaziente);

    }).error(function (data) {
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function ($ionicLoading) {
      // On both cases hide the loading
      $scope.hide($ionicLoading);
      $scope.refreshLayout;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.toDettaglioPaziente = function () {
    window.location.href = "#/tab/pazienti/" + $scope.esame.idPaziente;
  };

  $scope.loadEsame = function () {

    $scope.show();
    $scope.refreshLayout;

    var httpPost = Esami.getEsameById($stateParams.esameId);
    httpPost.success(function (response) {
      $scope.esame = response;
      $scope.esame.completatoString = ($scope.esame.completato == "1") ? "Si" : "No";
      $scope.esistonoMisurazioni = ($scope.esame.misurazioni != undefined && $scope.esame.misurazioni.length > 0) ? "1" : "0";

    }).error(function (data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function (data) {
      $scope.hide();
      $scope.refreshLayout;
      $scope.hide($ionicLoading);
    });
  };

  $scope.aggiornaDettagliEsame = function () {

    $scope.loadEsame();
  };

  // COMANDI

  $scope.loadEsame();

  /*
   var httpPost = Esami.getEsameById($stateParams.esameId);
   httpPost.success(function(response){
   $scope.esame = response;
   $scope.esame.completatoString = ($scope.esame.completato) ? "Si" : "No";
   $scope.nomisurazioni = ($scope.esame.misurazioni == 0 || $scope.esame.misurazioni == undefined) ? "1" : "0";


   }).error(function(data){
   var alertPopup = $ionicPopup.alert({
   title: 'Errore!',
   template: "C'è stato un problema con l'elaborazione dei tuoi dati"
   });
   }).finally(function(data){
   $scope.hide($ionicLoading);
   }); */


  /*
   $scope.aggiornaDettagliEsame = function () {
   // si può anche pensare di aggiornare questi valori tramite internet

   //reimplementare via medico le get delle misurazioni poichè ora è dentro Esami.

   $scope.show($ionicLoading);
   var httpPost = Esami.getMisurazioniByEsame($stateParams.esameId);
   httpPost.success(function (response) {

   Variabili.user_info.elenco_misurazioni = response;
   $scope.elenco_misurazioni = Variabili.getMisurazioniByEsame($stateParams.esameId);
   $scope.nomisurazioni = ($scope.elenco_misurazioni.length == 0) ? "1" : "0";
   $scope.$broadcast('scroll.refreshComplete');
   }).error(function(data) {
   // Do something on error
   var alertPopup = $ionicPopup.alert({
   title: 'Errore!',
   template: "C'è stato un problema con l'elaborazione dei tuoi dati"
   });
   }).finally(function($ionicLoading) {
   // On both cases hide the loading
   $scope.hide($ionicLoading);
   });

   };*/


});

/*Controllers per schermate PAZIENTE*/

app.controller('Paziente_InviaDatiMisurazioniController', function ($scope, $state, $ionicLoading, $ionicPopup, Variabili, Esami) {

  gestisciErrori(Variabili, $state);

  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  $scope.inviaDatiMisurazione = function (descrizione, valore) {

    $scope.show($ionicLoading);
    var fDay = getFormattedDay();
    var fHour = getFormattedHour();
    var httpPost = Esami.addMisurazione(Variabili.esame._id, descrizione, valore, fDay, fHour);

    httpPost.success(function (response) {
      $state.go('tab.dettaglio_esame_paziente', {esameId: Variabili.esame._id});
    }).error(function (data) {
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function ($ionicLoading) {
      // On both cases hide the loading
      $scope.hide($ionicLoading);
    });

  }
});

app.controller('Paziente_DettagliEsameController', function ($scope, $state, $stateParams, $ionicLoading, $ionicPopup, Esami, Variabili) {

  gestisciErrori(Variabili, $state);

  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  $scope.idesame = $stateParams.esameId;


  $scope.loadEsame = function () {
    $scope.show();
    $scope.refreshLayout;
    Esami.getEsameById($scope.idesame).then(function (response) {


      Variabili.esame = response.data;

      $scope.esame = Variabili.esame;


      $scope.esame.completato = ($scope.esame.completato == "1") ? "Si" : "No";


      $scope.elenco_misurazioni = Variabili.getMisurazioniByEsame($stateParams.esameId);
      $scope.nomisurazioni = ($scope.elenco_misurazioni.length == 0) ? "1" : "0";

      $scope.hide();
      $scope.refreshLayout;

    });

  };


  $scope.aggiornaDettagliEsame = function () {
    // si può anche pensare di aggiornare questi valori tramite internet

    $scope.loadEsame();


  };

  $scope.addMisurazione = function () {
    $state.go('tab.inviaMisurazione');
  };

  $scope.removeMisurazione = function (nomemisurazione) {
    Esami.removeMisurazione(Variabili.esame._id, nomemisurazione).then(function (response) {
      $scope.loadEsame();

    });
  }


  $scope.loadEsame();
});

app.controller('Paziente_InfoAccountController', function ($scope, $state,$ionicPopup, Variabili) {
  gestisciErrori(Variabili, $state);

  $scope.user_info = Variabili.user_info;

  $scope.role = $scope.user_info.role;


  $scope.logout = function () {
    // Se le variabili si svuotano (per esempio, per un refresh, o per modifiche al codice), torniamo alla schermata di login

    // Se le variabili si svuotano (per esempio, per un refresh, o per modifiche al codice), torniamo alla schermata di login
    Variabili = {};
    localStorage.setItem("loginType", '0');
    Variabili.user_info.role = 0;
    tab_controller.tabreload();
    $state.go('tab.login', {}, {reload: true});

  };

  //account_controller = $scope;
});

app.controller('Paziente_ElencoEsamiController', function ($scope, $state, $ionicLoading, $ionicPopup, Esami, Variabili) {

  var httpPost = Esami.getEsamiByPaziente(Variabili.user_info.id);
  httpPost.success(function (response) {


    $scope.esami = response;
    $scope.esami.forEach(function (esame) {

      $scope.esame = esame;
      /*
       $scope.esame.completato = (esame.completato == "1") ? 1 : 0;
       $scope.esame.completatoString = (esame.completato == "1") ? "Si" : "No"; */

      if (esame.completato == "1") {
        $scope.esame.completatoString = "Si";

      }
      else if (esame.completato == "0") {
        $scope.esame.completatoString = "No";

      }
      else {
        console.log("Valore diverso da 1 o 0 come stringhe");

      }

    });
    Variabili.elenco_esami = $scope.esami;
    //$scope.$broadcast('scroll.refreshComplete');
  }).error(function (data) {
    // Do something on error
    console.log("Errore! Data content");
    console.log(data);
  }).finally(function (data) {
    $scope.$broadcast('scroll.refreshComplete');
  });

  // FUNZIONI INTERNE
  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  $scope.aggiornaElencoEsami = function () {
    var httpPost = Esami.getEsamiByPaziente(Variabili.user_info.id);
    httpPost.success(function (response) {


      $scope.esami = response;
      $scope.esami.forEach(function (esame) {

        $scope.esame = esame;

        if (esame.completato == "1") {
          $scope.esame.completatoString = "Si";

        }
        else if (esame.completato == "0") {
          $scope.esame.completatoString = "No";
        }
        else {
          console.log("Valore diverso da 1 o 0 come stringhe");
        }
      });
      Variabili.elenco_esami = $scope.esami;
    }).error(function (data) {
      // Do something on error
      console.log("Errore! Data content");
      console.log(data);
    }).finally(function (data) {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.remove = function (esame) {
    Esami.remove(esame);
  };

  // COMANDI

  gestisciErrori(Variabili, $state, $ionicPopup);

  $scope.esami = Variabili.user_info.elenco_esami;
  $scope.nessunEsameVisible = ($scope.esami.length == 0) ? 1 : 0; // C'è almeno un esame


});

app.controller('Paziente_RiepilogoController', function ($scope, $stateParams, $state, $ionicLoading, $ionicPopup, Utenti, Pazienti, Esami, Variabili) {

  gestisciErrori(Variabili, $state);


  $scope.show = function () {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function () {
    $ionicLoading.hide();
  };

  $scope.user_info = Variabili.user_info;

  // Li prendiamo da internet
  $scope.esami = Variabili.user_info.elenco_esami;
  $scope.nessunEsameVisible = ($scope.esami.length == 0) ? 1 : 0; // C'è almeno un esame

  $scope.aggiornaDatiClinici = function () {
    $scope.show($ionicLoading);

    // ESAMI
    var httpPost = Esami.getEsamiByPaziente(Variabili.user_info.id);
    httpPost.success(function (response) {
      $scope.nessunEsameVisible = (response.length == 0) ? 1 : 0; // C'è almeno un esame
      Variabili.user_info.elenco_esami = response;
      $scope.esami = Variabili.user_info.elenco_esami; //assign data here to your $scope object
      $scope.esami.forEach(function (esame) {
        $scope.esame = esame;
        $scope.esame.completatoString = (esame.completato == "1") ? "Si" : "No";
      });
      $scope.$broadcast('scroll.refreshComplete');
    }).error(function (data) { // ERROR PER ESAMI
      // Do something on error
      var alertPopup = $ionicPopup.alert({
        title: 'Errore!',
        template: "C'è stato un problema con l'elaborazione dei tuoi dati"
      });
    }).finally(function ($ionicLoading) {
      // On both cases hide the loading
      $scope.hide($ionicLoading);
    });
  };
});
