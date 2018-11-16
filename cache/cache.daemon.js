/*
	Cache accounts with actions > 500k
*/
const MongoClient 	= require('mongodb').MongoClient;
const CONFIG		= require('../config.js');
const async 		= require('async');

const MONGO_OPTIONS = {
    socketTimeoutMS: 10000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true
};
const MAX_ACTIONS 	= 500000;
const MAX_ELEMS 	= 50000; 

process.on('uncaughtException', (err) => {
    console.error(`======= UncaughtException Cache :  ${err}`);
});

MongoClient.connect( CONFIG.mongoURL, MONGO_OPTIONS, (err, db) => {
		if (err){
			return console.error("Database error !!!", err);
		}
        console.log("=== Database Connected!");
        let DBO = db.db(CONFIG.mongoDB);
		
		// Start cache daemon ===== 
		getAccounts(); 

		// clear slow operations
		clearSlowOperations(); 

		function clearSlowOperations(){
			DBO.admin().command({ currentOp: 1, microsecs_running: { $gte: 15000 }, "command.aggregate": { $exists: true } }, (err, result) => {
				if (err){
					console.error(err);
					return setTimeout(clearSlowOperations, 10000);
				}
				console.log(result);
				if(result && result.inprog && result.inprog.length){
					result.inprog.forEach((elem) => {
							console.log('Kill operation: ', elem.opid, elem.command.aggregate);
							DBO.admin().command({ killOp: 1, op: elem.opid });
					});
				}
				setTimeout(clearSlowOperations, 10000);
			});
		}   

		// Cache logic =====
		let cursor = 0;
		let counter = 0;

		function getAccounts(){
				async.waterfall([
					(callback) => {
						DBO.collection("accounts").count(callback);
					},
					(accounts, callback) => {
						console.log('All Accounts -', accounts);
						let skip = (cursor === 0) ? 0 : cursor;
					   	let elements = Array.from({length: MAX_ELEMS }, (v, k) => k);

					   	cursor += MAX_ELEMS;
					   	
					   	console.log('skip =', skip, 'limit =', MAX_ELEMS);
					   	DBO.collection("accounts").find({}).skip(skip).limit(MAX_ELEMS).toArray((err, accountsArr) => {
							if (err){
								return callback(err);
							};
							if (!accountsArr || !accountsArr.length){
								return callback(null, 'FINISH');
							}
							accountActionCount(accountsArr, callback);
			    		}); 
					}
				], (err, result) => {
					if (err){
						console.error('getAccounts callback error', err);
						getAccounts();
						return;
						//process.exit(1);
					}
					if (result === 'FINISH'){
						console.log(`Scanned ${counter} accounts :)`);
						process.exit();
					}
					getAccounts();	
				});
		}
		
		
		function accountActionCount(accountsArr, callback){
				async.eachLimit(accountsArr, CONFIG.limitAsync, (elem, cb) => {
							let query = { $or: [
									{"act.account": elem.name }, 
									{"act.data.receiver": elem.name }, 
									{"act.data.from": elem.name }, 
									{"act.data.to": elem.name },
									{"act.data.name": elem.name },
									{"act.data.voter": elem.name },
									{"act.authorization.actor": elem.name }
							]};
							console.log(counter+=1, ' Account -', elem.name);
					   	 	DBO.collection("action_traces").aggregate([
							   { $match: query },
							   { $group: { _id: null, sum: { $sum: 1 } } } 
							]).toArray((err, result) => {
								if (err){
									if(err.name === 'MongoNetworkError'){
										console.log('MongoNetworkError ---- ', elem.name);
										let query = { name: elem.name };
										DBO.collection("smart_cache").update(query, query, { upsert: true }, cb);
										return;
									}
									return cb();
								}
								if (!result || !result[0] || !result[0].sum){
									console.log('counter error')
									return cb();
								}
								console.log('Account -', elem.name, ' Actions -', result[0].sum);
								if (result[0].sum > MAX_ACTIONS){
									DBO.collection("smart_cache").update({ name: elem.name }, { name: elem.name, actions: result[0].sum }, { upsert: true }, cb);
									return;
								}
								cb();
							});
					   	}, (error) => {
					   		if (error){
					   			return callback(error)
					   		}
					   		callback(null);
				});
		}
});





