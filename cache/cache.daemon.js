/*
	Cache accounts with actions > 500k
*/
const MongoClient 	= require('mongodb').MongoClient;
const CONFIG		= require('../config.js');
const async 		= require('async');
const fs 			= require('fs');

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
		getAccounts(DBO);       

		// Cache logic =====
		let cursor = 0;
		function getAccounts(){
				async.waterfall([
					(callback) => {
						DBO.collection("accounts").count(callback);
					},
					(accounts, callback) => {
						console.log(accounts);
						if (cursor > accounts){
							return callback(null, 'FINISH');
						}
						let skip = (cursor === 0) ? 0 : cursor;
					   	let elements = Array.from({length: MAX_ELEMS }, (v, k) => cursor += 1);
					   	
					   	console.log('skip =', skip, 'limit =', MAX_ELEMS);
					   	DBO.collection("accounts").find({}).skip(skip).limit(MAX_ELEMS).toArray((err, accountsArr) => {
							if (err){
								return callback(err);
							};
							accountActionCount(accountsArr, callback);
			    		}); 
					}
				], (err, result) => {
					if (err){
						console.error('getAccounts callback error', err);
						getAccounts();
						//process.exit(1);
					}
					if (result === 'FINISH'){
						console.log(`Scanned ${cursor} accounts :)`);
						process.exit();
					}
					getAccounts();	
				});
		}
		
		let counter = 0;
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
										fs.appendFile(__dirname + '/accounts.thebiggest.txt', elem.name + '\n', 'utf8', cb);
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
									fs.appendFile(__dirname + '/accounts.big.txt', `${elem.name} = ${result[0].sum}\n`, 'utf8', cb);
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




