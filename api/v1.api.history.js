'use strict';

const MAX_ELEMENTS 	= 1000;
const async 		= require('async');
const request 		= require('request');
const config 		= require('../config');

module.exports = (app, DB, swaggerSpec) => {

	app.get('/api-docs.json', (req, res) => {
	  res.setHeader('Content-Type', 'application/json');
	  res.send(swaggerSpec);
	});
	
	/**
	 * @swagger
	 *
	 * /v1/history/get_accounts?counter=on:
	 *   get:
	 *     description: get_accounts
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: query
	 *         name: counter
	 *         description: Counter of all EOS Accounts (default off).
	 *         required: false
	 *         type: string
	 *       - in: query
	 *         name: skip
	 *         description: Skip elements (default 0).
	 *         required: false
	 *         type: number
	 *       - in: query
	 *         name: limit
	 *         description: Limit elements (default 10).
	 *         required: false
	 *         type: number
	 */
    app.get('/v1/history/get_accounts', getAccounts);

	/**
	 * @swagger
	 *
	 * /v1/history/get_voters/cryptolions1:
	 *   get:
	 *     description: get_voters
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: query
	 *         name: skip
	 *         description: Skip elements (default 0).
	 *         required: false
	 *         type: number
	 *       - in: query
	 *         name: limit
	 *         description: Limit elements (default 100).
	 *         required: false
	 *         type: number
	 */
    app.get('/v1/history/get_voters/:account', getVoters);

	/**
	 * @swagger
	 *
	 * /v1/history/get_actions:
	 *   post:
	 *     description: get_actions
	 *     requestBody:
 	 *       content:
 	 *         application/json:
 	 *           schema:
 	 *             type: object
 	 *             properties:
 	 *               pos:
 	 *                 type: number
 	 *                 default: -1
 	 *               offset:
 	 *                 type: number
 	 *                 default: 10
 	 *               account_name:
 	 *                 type: string
 	 *                 default: cryptolions1
 	 *               action_name:
 	 *                 type: string
 	 *                 default: all
 	 *               counter:
 	 *                 type: number
 	 *                 default: 0
	 */
    app.post('/v1/history/get_actions', getActionsPOST);

	/**
	 * @swagger
	 *
	 * /v1/history/get_actions/cryptolions1:
	 *   get:
	 *     description: Get Account actions
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: query
	 *         name: skip
	 *         description: Skip elements default (0).
	 *         required: false
	 *         type: number
	 *       - in: query
	 *         name: limit
	 *         description: Limit elements default (10).
	 *         required: false
	 *         type: number
	 *       - in: query
	 *         name: sort
	 *         description: Sort elements default (-1).
	 *         required: false
	 *         type: number
	 *       - in: query
	 *         name: counter
	 *         description: Enable counter if you need actionsTotal (?counter=1).
	 *         required: false
	 *         type: number
	 */
	app.get('/v1/history/get_actions/:account', getActions);

	/**
	 * @swagger
	 *
	 * /v1/history/get_actions_unique/cryptolions1:
	 *   get:
	 *     description: get_actions_unique
	 *     produces:
	 *       - application/json
	 */
	app.get('/v1/history/get_actions_unique/:account', getActionsDistinct);

	/**
	 * @swagger
	 *
	 * /v1/history/get_actions/cryptolions1/sethash:
	 *   get:
	 *     description: Get Account actions by action name
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: query
	 *         name: skip
	 *         description: Skip elements default (0).
	 *         required: false
	 *         type: number
	 *       - in: query
	 *         name: limit
	 *         description: Limit elements default (10).
	 *         required: false
	 *         type: number
	 *       - in: query
	 *         name: sort
	 *         description: Sort elements default (-1).
	 *         required: false
	 *         type: number
	 */
    app.get('/v1/history/get_actions/:account/:action', getActions);

	/**
	 * @swagger
	 *
	 * /v1/history/get_transaction:
	 *   post:
	 *     description: get_transaction
	 *     requestBody:
 	 *       content:
 	 *         application/json:
 	 *           schema:
 	 *             type: object
 	 *             properties:
 	 *               id:
 	 *                 type: string
	 */
    app.post('/v1/history/get_transaction', getTransactionPOST);

	/**
	 * @swagger
	 *
	 * /v1/history/get_transaction/${id}:
	 *   get:
	 *     description: Get Transaction by id
	 *     produces:
	 *       - application/json
	 */
    app.get('/v1/history/get_transaction/:id', getTransaction);

	/**
	 * @swagger
	 *
	 * /v1/history/get_controlled_accounts:
	 *   post:
	 *     description: get_controlled_accounts
	 *     requestBody:
 	 *       content:
 	 *         application/json:
 	 *           schema:
 	 *             type: object
 	 *             properties:
 	 *               controlling_account:
 	 *                 type: string
	 */
    app.post('/v1/history/get_controlled_accounts', getControlledAccountsPOST);

	/**
	 * @swagger
	 *
	 * /v1/history/get_controlled_accounts/${controlling_account}:
	 *   get:
	 *     description: Get controlled accounts
	 *     produces:
	 *       - application/json
	 */
    app.get('/v1/history/get_controlled_accounts/:controlling_account', getControlledAccounts);

	/**
	 * @swagger
	 *
	 * /v1/history/get_key_accounts:
	 *   post:
	 *     description: get_key_accounts
	 *     requestBody:
 	 *       content:
 	 *         application/json:
 	 *           schema:
 	 *             type: object
 	 *             properties:
 	 *               public_key:
 	 *                 type: string
	 */
    app.post('/v1/history/get_key_accounts', getKeyAccountsPOST);

	/**
	 * @swagger
	 *
	 * /v1/history/get_key_accounts/${public_key}:
	 *   get:
	 *     description: Get key accounts
	 *     produces:
	 *       - application/json
	 */
    app.get('/v1/history/get_key_accounts/:public_key', getKeyAccounts);

    /**
	 * @swagger
	 *
	 * /v1/chain/${chain_rpc_method_name}:
	 *   post:
	 *     description: Proxy for chain RPC endpoints
	 *     produces:
	 *       - application/json
	 */
    app.post('/v1/chain/*', (req, res) => {
    	request.post({ url: `${config.chainUrl}${req.originalUrl}`, json: req.body }).pipe(res);
    });

    app.get('/v1/chain/get_info', (req, res) => {
    	request.get(`${config.chainUrl}${req.originalUrl}`).pipe(res);
    });

	// ========= Custom functions
	function getActions(req, res){
	    // default values
	    let skip = 0;
	    let limit = 10;
	    let sort = -1;
	    let accountName = String(req.params.account);
	    let action = String(req.params.action);
	    let counter = Number(req.query.counter);
	
	    let query = { $or: [
				{"act.account": accountName}, 
				{"act.data.receiver": accountName}, 
				{"act.data.from": accountName}, 
				{"act.data.to": accountName},
				{"act.data.name": accountName},
				{"act.data.voter": accountName},
				{"act.authorization.actor": accountName}
		]};
	    if (action !== "undefined" && action !== "all"){
	    	query["act.name"] = action;
	    }
	
	    skip = (isNaN(Number(req.query.skip))) ? skip : Number(req.query.skip);
	    limit = (isNaN(Number(req.query.limit))) ? limit : Number(req.query.limit);
	    sort = (isNaN(Number(req.query.sort))) ? sort : Number(req.query.sort);
	
	    if (limit > MAX_ELEMENTS){
	    	return res.status(401).send(`Max elements ${MAX_ELEMENTS}!`);
	    }
	    if (skip < 0 || limit < 0){
	    	return res.status(401).send(`Skip (${skip}) || (${limit}) limit < 0`);
	    }
	    if (sort !== -1 && sort !== 1){
	    	return res.status(401).send(`Sort param must be 1 or -1`);
	    }

	    let parallelObject = {
		   actions: (callback) => {
           		DB.collection("action_traces").find(query).sort({"_id": sort}).skip(skip).limit(limit).toArray(callback);
           }
	    };

	    if (counter === 1){
	    	parallelObject["actionsTotal"] = (callback) => {
	       		/*DB.collection("action_traces").aggregate([
				   { $match: query },
				   { $group: { _id: null, sum: { $sum: 1 } } } 
				]).toArray((err, result) => {
					if (err){
						return callback(err);
					}
					if (!result || !result[0] || !result[0].sum){
						return callback('counter error')
					}
					callback(null, result[0].sum);
				});*/
				callback(null, 'Under construction');
	       }
	    }
	    
	    async.parallel(parallelObject, (err, result) => {
			if (err){
					console.error(err);
					return res.status(500).end();
			}
			res.json(result)
	    });
	}

	function getActionsPOST(req, res){
		// default values
	    let skip = 0;
	    let limit = 10;
	    let sort = -1;
	    let accountName = String(req.body.account_name);
	    let action = String(req.body.action_name);
	    let counter = Number(req.body.counter);
	
	    let query = { $or: [
				{"act.account": accountName}, 
				{"act.data.receiver": accountName}, 
				{"act.data.from": accountName}, 
				{"act.data.to": accountName},
				{"act.data.name": accountName},
				{"act.data.voter": accountName},
				{"act.authorization.actor": accountName}
		]};
	    if (action !== "undefined"){
	    	query["act.name"] = action;
	    }

	    let pos = Number(req.body.pos);
	    let offset = Number(req.body.offset);
	    if (!isNaN(pos) && !isNaN(offset)){
	    	sort = (pos < 0) ? -1: 1;
	    	limit = Math.abs(offset);
	    	skip =  (pos < 0) ? Math.abs(offset * ( pos * -1 - 1 )) : Math.abs(offset * ( pos - 1 ));
	    }
	
	    if (limit > MAX_ELEMENTS){
	    	return res.status(401).send(`Max elements ${MAX_ELEMENTS}!`);
	    }
	    if (skip < 0 || limit < 0){
	    	return res.status(401).send(`Skip (${skip}) || (${limit}) limit < 0`);
	    }
	    if (sort !== -1 && sort !== 1){
	    	return res.status(401).send(`Sort param must be 1 or -1`);
	    }

	    let parallelObject = {
		   actions: (callback) => {
           		DB.collection("action_traces").find(query).sort({"_id": sort}).skip(skip).limit(limit).toArray(callback);
           }
	    };

	    if (counter === 1){
	    	parallelObject["actionsTotal"] = (callback) => {
	       		/*DB.collection("action_traces").aggregate([
				   { $match: query },
				   { $group: { _id: null, sum: { $sum: 1 } } } 
				]).toArray((err, result) => {
					if (err){
						return callback(err);
					}
					if (!result || !result[0] || !result[0].sum){
						return callback('counter error')
					}
					callback(null, result[0].sum);
				});*/
				callback(null, 'Under construction');
	       }
	    }
	    
	    async.parallel(parallelObject, (err, result) => {
			if (err){
					console.error(err);
					return res.status(500).end();
			}
			res.json(result)
	    });
	}

	function getActionsDistinct(req, res){
	    // default values
	    let accountName = String(req.params.account);
	    let query = { $or: [
				{"act.account": accountName}, 
				{"act.data.receiver": accountName}, 
				{"act.data.from": accountName}, 
				{"act.data.to": accountName},
				{"act.data.name": accountName},
				{"act.data.voter": accountName},
				{"act.authorization.actor": accountName}
		]};
	    
	    DB.collection("action_traces").distinct("act.name", query, (err, result) => {
				if (err){
					console.error(err);
					return res.status(500).end();
				};
				res.json(result);
	    });
	}

	function getTransactionPOST(req, res){
		 let key = String(req.body.id);
		 if (key === "undefined"){
		 	return res.status(401).send("Wrong transactions ID!");
		 } 
		 let query = { id: key };
		 DB.collection("transaction_traces").findOne(query, (err, result) => {
				if (err){
					console.error(err);
					return res.status(500).end();
				};
				res.json(result);
	    });
	}

	function getTransaction(req, res){
		 let key = String(req.params.id);
		 if (key === "undefined"){
		 	return res.status(401).send("Wrong transactions ID!");
		 } 
		 let query = { id: key };
		 DB.collection("transaction_traces").findOne(query, (err, result) => {
				if (err){
					console.error(err);
					return res.status(500).end();
				};
				res.json(result);
	    });
	}

	function getControlledAccountsPOST(req, res){
		 let key = String(req.body.controlling_account);
		 if (key === "undefined"){
		 	return res.status(401).send("Wrong transactions ID!");
		 } 
		 let query = { controlling_account: key };
		 DB.collection("account_controls").find(query).toArray((err, result) => {
				if (err){
					console.error(err);
					return res.status(500).end();
				};
				res.json(result);
	    });
	}

	function getControlledAccounts(req, res){
		 let key = String(req.params.controlling_account);
		 if (key === "undefined"){
		 	return res.status(401).send("Wrong transactions ID!");
		 } 
		 let query = { controlling_account: key };
		 DB.collection("account_controls").find(query).toArray((err, result) => {
				if (err){
					console.error(err);
					return res.status(500).end();
				};
				res.json(result);
	    });
	}

	function getKeyAccountsPOST(req, res){
		 let key = String(req.body.public_key);
		 if (key === "undefined"){
		 	return res.status(401).send("Wrong transactions ID!");
		 } 
		 let query = { public_key: key };
		 DB.collection("pub_keys").find(query).toArray((err, result) => {
				if (err){
					console.error(err);
					return res.status(500).end();
				};
				res.json(result);
	    });
	}

	function getKeyAccounts(req, res){
		 let key = String(req.params.public_key);
		 if (key === "undefined"){
		 	return res.status(401).send("Wrong transactions ID!");
		 } 
		 let query = { public_key: key };
		 DB.collection("pub_keys").find(query).toArray((err, result) => {
				if (err){
					console.error(err);
					return res.status(500).end();
				};
				res.json(result);
	    });
	}

	function getAccounts(req, res){
	    let skip = 0;
	    let limit = 10;
	    let counterAccounts = false;
	    let accountName = String(req.query.account);
	
	    let query = {};
	    if (accountName !== "undefined"){
	    	query.name = accountName;
	    }
	
	    skip = (isNaN(Number(req.query.skip))) ? skip : Number(req.query.skip);
	    limit = (isNaN(Number(req.query.limit))) ? limit : Number(req.query.limit);
	    counterAccounts = (req.query.counter === "on") ? true : false;

	    if (limit > MAX_ELEMENTS){
	    	return res.status(401).send(`Max limit accounts per query = ${MAX_ELEMENTS}`);
	    }
	    if (skip < 0 || limit < 0){
	    	return res.status(401).send(`Skip (${skip}) || (${limit}) limit < 0`);
	    }

		DB.collection("accounts").find(query).skip(skip).limit(limit).toArray((err, result) => {
				if (err){
					console.error(err);
					return res.status(500).end();
				};
				if (counterAccounts){
					DB.collection("accounts").count((err, accs) => {
									if (err){
										console.error(err);
										return res.status(500).end();
									};
									res.json({ allEosAccounts: accs, accounts: result });
					});
				} else {
					res.json({ accounts: result });
				}
	    });
	}

	function getVoters(req, res){
	    // default values
	    let skip = 0;
	    let limit = 100;
	    let sort = -1;
	    let accountName = String(req.params.account);
	
	    let query = { "act.name": "voteproducer",  "act.data.producers": { $in: [accountName] } };
	
	    skip = (isNaN(Number(req.query.skip))) ? skip : Number(req.query.skip);
	    limit = (isNaN(Number(req.query.limit))) ? limit : Number(req.query.limit);
	    sort = (isNaN(Number(req.query.sort))) ? sort : Number(req.query.sort);
	
	    if (limit > MAX_ELEMENTS){
	    	return res.status(401).send(`Max elements ${MAX_ELEMENTS}!`);
	    }
	    if (skip < 0 || limit < 0){
	    	return res.status(401).send(`Skip (${skip}) || (${limit}) limit < 0`);
	    }
	    if (sort !== -1 && sort !== 1){
	    	return res.status(401).send(`Sort param must be 1 or -1`);
	    }

	    async.parallel({
	       votesCounter: (callback) => {
	       		DB.collection("action_traces").find(query).count(callback);
	       },
           voters: (callback) => {
           		DB.collection("action_traces").find(query).sort({"_id": sort}).skip(skip).limit(limit).toArray(callback);
           }
	    }, (err, result) => {
			if (err){
					console.error(err);
					return res.status(500).end();
			}
			res.json(result)
	    });
	}

	//========= end Custom Functions
}



