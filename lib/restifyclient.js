/*
 * Copyright (c) 2012, Joyent, Inc. All rights reserved.
 *
 * Generic restify client with basic auth
 */

var restify = require('restify');


/**
 * Constructor
 *
 * Note that in options you can pass in any parameters that the restify
 * RestClient constructor takes (for example retry/backoff settings).
 *
 * @param {Object} options
 *    - username {String} username for basic auth.
 *    - password {String} password for basic auth.
 *    - url {String} NAPI url.
 *    - ... any other options allowed to `restify.createJsonClient`
 *
 */
function RestifyClient(options) {
  if (!options)
    throw new TypeError('options required');
  if (!options.url)
    throw new TypeError('options.url (String) is required');
  if (!options.username)
    throw new TypeError('options.username (String) is required');
  if (!options.password)
    throw new TypeError('options.password (String) is required');

  this.client = restify.createJsonClient(options);
  this.client.basicAuth(options.username, options.password);
}


/**
 * Generic GET method
 *
 * Note that you can call this with or without params,
 * eg: f(path, cb) or f(path, params, cb)
 *
 * @param {String} path : the path to get
 * @param {Object} params : the parameters to filter on (optional)
 * @param {Function} callback : of the form f(err, res).
 */
RestifyClient.prototype.get = function(path, params, callback) {
  if (!path)
    throw new TypeError('path is required');
  if (!params)
    throw new TypeError('callback (Function) is required');
  if (typeof(params) !== 'function' && typeof(params) !== 'object')
    throw new TypeError('params must be an object');

  // Allow calling .get(path, callback):
  if (typeof(params) == 'function')
    callback = params;
  if (!callback || typeof(callback) !== 'function')
    throw new TypeError('callback (Function) is required');

  var getParams = { path: path };
  if (typeof(params) === 'object' && Object.keys(params).length != 0)
    getParams.query = params;

  return this.client.get(getParams, function(err, req, res, obj) {
    if (err) {
      return callback(err);
    }
    return callback(null, obj);
  });
}


/**
 * Generic PUT method
 *
 * @param {String} path : the path to put
 * @param {Object} params : the parameters to put
 * @param {Function} callback : of the form f(err, res).
 */
RestifyClient.prototype.put = function(path, params, callback) {
  if (!path)
    throw new TypeError('path is required');
  if (!params || typeof(params) !== 'object')
    throw new TypeError('params is required (object)');
  if (!callback || typeof(callback) !== 'function')
    throw new TypeError('callback (Function) is required');

  return this.client.put(path, params, function(err, req, res, obj) {
    if (err) {
      return callback(err);
    }
    return callback(null, obj);
  });
}


/**
 * Generic POST method
 *
 * @param {String} path : the path to post
 * @param {Object} params : the parameters to post
 * @param {Function} callback : of the form f(err, res).
 */
RestifyClient.prototype.post = function(path, params, callback) {
  if (!path)
    throw new TypeError('path is required');
  if (!params || typeof(params) !== 'object')
    throw new TypeError('params is required (object)');
  if (!callback || typeof(callback) !== 'function')
    throw new TypeError('callback (Function) is required');

  return this.client.post(path, params, function(err, req, res, obj) {
    if (err) {
      return callback(err);
    }
    return callback(null, obj);
  });
}


module.exports = RestifyClient;