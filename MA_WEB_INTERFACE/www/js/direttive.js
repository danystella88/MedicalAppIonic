/**
 * Created by lucaluke on 16/07/16.
 */

var app = angular.module('starter.direttive', []);

app.directive('esameListDaElenco', function()
{
  return {
    templateUrl: 'direttive/d_esameList_da_elenco_esami.html',
    restrict: 'E'
  };
});

app.directive('esameListDaRiepilogo', function()
{
  return {
    templateUrl: 'direttive/d_esameList_da_riepilogo.html',
    restrict: 'E'
  };
});

app.directive('assegnaEsameForm', function()
{
  return {
    templateUrl: 'direttive/d_assegnaEsameForm.html',
    restrict: 'E'
  };
});

app.directive('dettagliPazienteDaPaziente', function()
{
  return {
    templateUrl: 'direttive/d_dettagli_paziente_dapaziente.html',
    restrict: 'E'
  };
});

app.directive('swypeToRemoveItem', function()
{
  return {
    templateUrl: 'direttive/d_swypetoremove.html',
    restrict: 'E'
  };
});
