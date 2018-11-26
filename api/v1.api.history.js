'use strict';

const MAX_ELEMENTS 	= 1000;
const async 		= require('async');
const request 		= require('request');
const config 		= require('../config');

const MAX_SKIP 		= 1000000;

module.exports = (app, DB, swaggerSpec, ObjectId) => {

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
	 *       - in: query
	 *         name: filter
	 *         description: Filter actions by action name.
	 *         required: false
	 *         type: string
	 */
	app.get('/v1/history/get_actions/:account', getActions);

	/**
	 * @swagger
	 *
	 * /v1/history/get_actions_delta/cryptolions1:
	 *   get:
	 *     description: get delta actions 
	 *     produces:
	 *       - application/json
	 */
	app.get('/v1/history/get_actions_delta/:account', getActionsDelta);

	// Heavy mongo operation (disabled)
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

    app.get('/v1/history/get_actions_transactions', getActionsTransactions);

	// ========= Custom functions
	let latencySkip = {};
	function getActions(req, res){
	    // default values
	    let skip = (isNaN(Number(req.query.skip))) ? 0 : Number(req.query.skip);
	    let limit = (isNaN(Number(req.query.limit))) ? 10 : Number(req.query.limit);
	    let sort = (isNaN(Number(req.query.sort))) ? -1 : Number(req.query.sort);

	    if (limit > MAX_ELEMENTS){
	    	return res.status(401).send(`Max elements ${MAX_ELEMENTS}!`);
	    }
	    if (skip < 0 || limit < 0){
	    	return res.status(401).send(`Skip (${skip}) || (${limit}) limit < 0`);
	    }
	    if (sort !== -1 && sort !== 1){
	    	return res.status(401).send(`Sort param must be 1 or -1`);
	    }

	    let accountName = String(req.params.account);
	    let action = String(req.params.action);
	    let counter = Number(req.query.counter);
	    let actionsNamesArr = (typeof req.query.filter === "string") ? req.query.filter.split(","): null;

	    if (latencySkip[accountName] > +new Date()){
	    	return res.status(500).send("Large skip for account, please wait until previous request will end! Max skip per request " + MAX_SKIP);
	    }
		if (!latencySkip[accountName] && skip > MAX_SKIP){
			latencySkip[accountName] = +new Date() + 60000;
	    }

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
	    if (actionsNamesArr){
	    	query['act.name'] = { $in : [query['act.name']]};
	    	actionsNamesArr.forEach(elem => {
	    			query['act.name']['$in'].push(elem);
	    	});
	    }

	    let parallelObject = {
		   actions: (callback) => {
		   		DB.collection("action_traces").find(query).sort({ "_id": 1 }).skip(skip).limit(limit).toArray(callback);
				/*DB.collection("action_traces").find(query).sort({ "_id": 1 }).project({ "_id": 1 }).skip(skip).limit(1).toArray((err, result) => {
						if (err){
							return callback(err);
						}
						if (!result || !result[0] || !result[0]._id){
							return callback(null, []);
						}
						let start_id = result[0]._id;
						query["_id"] = { $gte: new ObjectId(start_id) };
						if (skip > 1000000){
							console.log(query, "skip=", skip);
						}
           				DB.collection("action_traces").find(query).sort({"_id": sort}).limit(limit).toArray(callback);
				});*/
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
			if (latencySkip[accountName] && skip > MAX_SKIP){
				delete latencySkip[accountName];
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
	    	limit = Math.abs(offset + 1);
	    	skip = (pos < 0) ? Math.abs(pos + 1) : Math.abs(pos - 1);
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

	   if (latencySkip[accountName] > +new Date()){
	    	return res.status(500).send("Large skip for account, please wait until previous request will end! Max skip per request " + MAX_SKIP);
	    }
		if (!latencySkip[accountName] && skip > MAX_SKIP){
			latencySkip[accountName] = +new Date() + 60000;
	    }

	    let parallelObject = {
		   actions: (callback) => {
		   		DB.collection("action_traces").find(query).sort({ "_id": 1 }).skip(skip).limit(limit).toArray(callback);
           		/*DB.collection("action_traces").find(query).sort({ "_id": 1 }).project({ "_id": 1 }).skip(skip).limit(1).toArray((err, result) => {
						if (err){
							return callback(err);
						}
						if (!result || !result[0] || !result[0]._id){
							return callback(null, []);
						}
						let start_id = result[0]._id;
						query["_id"] = { $gte: new ObjectId(start_id) };
						if (skip > 1000000){
							console.log(query, "skip=", skip);
						}
           				DB.collection("action_traces").find(query).sort({"_id": sort}).limit(limit).toArray(callback);
				});*/
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
			if (latencySkip[accountName] && skip > MAX_SKIP){
				delete latencySkip[accountName];
			}
			res.json(result)
	    });
	}

	// ========= Get actions by multiple filet or actions names
	function getActionsDelta(req, res){
	    // default values
	    let skip = (isNaN(Number(req.query.skip))) ? 0 : Number(req.query.skip);
	    let limit = (isNaN(Number(req.query.limit))) ? 10 : Number(req.query.limit);
	    let sort = (isNaN(Number(req.query.sort))) ? -1 : Number(req.query.sort);
	    
	    if (limit > MAX_ELEMENTS){
	    	return res.status(401).send(`Max elements ${MAX_ELEMENTS}!`);
	    }
	    if (skip < 0 || limit < 0){
	    	return res.status(401).send(`Skip (${skip}) || (${limit}) limit < 0`);
	    }
	    if (sort !== -1 && sort !== 1){
	    	return res.status(401).send(`Sort param must be 1 or -1`);
	    }
	    let accountName = String(req.params.account);

	    let query = { $or: [
				{"act.account": accountName}, 
				{"act.data.receiver": accountName}, 
				{"act.data.from": accountName}, 
				{"act.data.to": accountName},
				{"act.data.name": accountName},
				{"act.data.voter": accountName},
				{"act.authorization.actor": accountName}
		], "account_ram_deltas.account": { $exists: true } };

	    DB.collection("action_traces").find(query).sort({"_id": sort}).skip(skip).limit(limit).toArray((err, result) => {
			if (err){
					console.error(err);
					return res.status(500).end();
			}
			res.json({ actions: result })
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

	    let queryObject = {
	    	accounts: (callback) => {
           		DB.collection("accounts").find(query).skip(skip).limit(limit).toArray(callback);
            }
	    };

	    if (counterAccounts){
	    	queryObject['allEosAccounts'] = (callback) => {
	       		DB.collection("accounts").estimatedDocumentCount(callback);
	        };
	    }

	    async.parallel(queryObject, (err, result) => {
			if (err){
					console.error(err);
					return res.status(500).end();
			}
			res.json(result)
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
	       		DB.collection("action_traces").countDocuments(query, callback);
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

	function getActionsTransactions(req, res){
		async.parallel({
	       actions: (callback) => {
	       		DB.collection("action_traces").estimatedDocumentCount(callback);
	       },
           transactions: (callback) => {
           		DB.collection("transaction_traces").estimatedDocumentCount(callback);
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



