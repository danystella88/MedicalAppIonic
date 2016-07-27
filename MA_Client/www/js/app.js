// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services_paziente.js
// 'starter.controllers' is found in controllers.js

// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function ($ionicPopup) {
  // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

  var notificationOpenedCallback = function(jsonData) {

    /*
    $ionicPopup.alert({
      title: jsonData.title,
      template: jsonData.message
    });*/

    //alert('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    console.log(jsonData.message);
  };

  window.plugins.OneSignal.init("a2c8861e-abb3-4300-99de-82c5a6ba6813",
                                 {googleProjectNumber: "1050542353517"},
                                 notificationOpenedCallback);

  // Show an alert box if a notification comes in when the user is in your app.
  window.plugins.OneSignal.enableInAppAlertNotification(true);
}, false);

// --------------------------------------------------------------

var user_info = null;
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.direttive'])

  .config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // ISTRUZIONI CORDOVA
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      // LOCAL STORAGE LOADING
      // così dovrei finalmente fixare il problema della tab bar che presenta elementi che non dovrebbe avere all'avvio
      localStorage.setItem("loginType", '0');
      tab_controller.tabreload();
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'schermate-comuni/tabs.html'
      })


      /* STATI DEL LATO MEDICO  ---------------------- */

      // Elenco Pazienti (Lato Medico)
      .state('tab.pazienti', {
        url: '/pazienti',
        cache: false,
        views: {
          'tab-pazienti': {
            templateUrl: 'schermate-medico/elenco_pazienti.html',
            controller: 'Medico_ElencoPazientiController'
          }
        }
      })

      // Dettaglio paziente (Lato Medico)
      .state('tab.paziente-detail', {
        url: '/pazienti/:pazienteId',
        cache: false,
        views: {
          'tab-pazienti': {
            templateUrl: 'schermate-medico/dettagli_paziente.html',
            controller: 'Medico_DettagliPazienteController'
          }
        }
      })

      // Form di aggiunta esame (Lato Medico)
      .state('tab.aggiungiEsame', {
        url: '/pazienti/:pazienteId',
        cache: false,
        views: {
          'tab-pazienti': {
            templateUrl: 'schermate-medico/aggiungi_esame.html',
            controller: 'Medico_AggiungiEsameController'
          }
        }
      })



      // Schermata di aggiunta paziente ad un medico (Lato Medico)
      .state('tab.addPaziente', {
        url: '/pazienti/',
        cache: false,
        views: {
          'tab-pazienti': {
            templateUrl: 'schermate-medico/aggiungi_paziente.html',
            controller: 'Medico_AggiungiPazienteController'
          }
        }
      })



      // Informazioni Account (Lato Medico)
      .state('tab.accountmedico', {
        url: '/accountmedico',
        views: {
          'tab-accountmedico': {
            templateUrl: 'schermate-medico/info_account.html',
            controller: 'Medico_InfoAccountController'
          }
        }
      })


      // Dettaglio esame da "Elenco Esami" (Lato Medico)
      .state('tab.dettaglio_esame', {
        url: '/esami/:esameId',
        views: {
          'tab-elenco_esami': {
            templateUrl: 'schermate-medico/dettagli_esame.html',
            controller: 'Medico_DettagliEsameController'
          }
        }
      })

      /* STATI DEL LATO PAZIENTE  ---------------------- */

      // Dati clinici del paziente (Lato Paziente)
      .state('tab.riepilogo', {
        url: '/riepilogo',
        views: {
          'tab-riepilogo': {
            templateUrl: 'schermate-paziente/riepilogo.html',
            controller: 'Paziente_RiepilogoController'

          }
        }
      })

      // Informazioni account (Lato Paziente)
      .state('tab.accountpaziente', {
        url: '/accountpaziente',
        views: {
          'tab-accountpaziente': {
            templateUrl: 'schermate-paziente/info_account.html',
            controller: 'Paziente_InfoAccountController'
          }
        }
      })



      // Elenco esami (Lato Paziente)
      .state('tab.elenco_esami', {
        url: '/esami',
        cache: false,
        views: {
          'tab-elenco_esami': {
            templateUrl: 'schermate-paziente/elenco_esami.html',
            controller: 'Paziente_ElencoEsamiController'
          }
        }
      })



      // Dettaglio esame da "Elenco Esami" (Lato Paziente)
      .state('tab.dettaglio_esame_paziente', {
        url: '/esamip/:esameId',
        views: {
          'tab-elenco_esami': {
            templateUrl: 'schermate-paziente/dettagli_esame_da_elenco_esami.html',
            controller: 'Paziente_DettagliEsameController'
          }
        }
      })

      // Dettaglio esame da "Dati Clinici" (Lato Paziente)
      .state('tab.dettaglio_esame_paziente_dariepilogo', {
        url: '/esamipdar/:esameId',
        views: {
          'tab-riepilogo': {
            templateUrl: 'schermate-paziente/dettagli_esame_da_riepilogo.html',
            controller: 'Paziente_DettagliEsameController'
          }
        }
      })

      // Form di invia misurazione (Lato Paziente)
      .state('tab.inviaMisurazione', {
        url: '/misurazione',
        cache: false,
        views: {
          'tab-elenco_esami': {
            templateUrl: 'schermate-paziente/invia_misurazioni.html',
            controller: 'Paziente_InviaDatiMisurazioniController'
          }
        }
      })

      /* SCHERMATE COMUNI -------------- */

      // Schermata di login
      .state('tab.login', {
        url: '/login',
        cache: false,
        views: {
          'tab-login': {
            templateUrl: 'schermate-comuni/t_login.html',
            controller: 'LoginController'
          }
        }
      })

      // Info sul programma
      .state('tab.about', {
        url: '/about',
        views: {
          'tab-about': {
            templateUrl: 'schermate-comuni/about.html',
            controller: 'LoginController'
          }
        }
      })

      // Modulo di registrazione
      .state('tab.registrazione', {
        url: '/registrazione',
        views: {
          'tab-registrazione': {
            templateUrl: 'schermate-comuni/t_registrazione.html',
            controller: 'RegistrazioneController'
          }
        }
      });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/login');

  });

