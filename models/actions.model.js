/*
   Created by orange1337
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'action_traces';
var TABLE_NAME = 'action_traces';
var MODEL;

// Model without any fixed schema
var action_traces = new mongoose.Schema({}, { strict: false });

module.exports = function (connection) {
  if ( !MODEL ) {
    if ( !connection ) {
      connection = mongoose;
    }
    MODEL = connection.model(MODEL_NAME, action_traces, TABLE_NAME);
  }
  return MODEL;
};



