# API Documentation https://history.cryptolions.io

## API url - https://history.cryptolions.io

## add to your nodeos config.ini
	plugin = eosio::mongo_db_plugin
    mongodb-uri = mongodb://127.0.0.1:27017/EOS
    mongodb-filter-on = :transfer:
    #mongodb-filter-out = spammer::
    mongodb-filter-out = eosio:onblock:
    mongodb-filter-out = gu2tembqgage::
    mongodb-filter-out = blocktwitter::
    mongodb-queue-size = 2048
    mongodb-abi-cache-size = 2048
    abi-serializer-max-time-ms = 10000
    mongodb-store-action-traces = 1
    mongodb-block-start = 1
    mongodb-store-blocks = 0
    mongodb-store-transactions = 0
    mongodb-store-transaction-traces = 0
    mongodb-store-action-traces = 1
    
### optional (to speed up syncing)
    # no history plugin, deprecated
    plugin = eosio::bnet_plugin
    bnet-follow-irreversible = 0
    bnet-no-trx = false
    read-mode = read-only
    validation-mode = light
    wasm-runtime = wabt
    chain-state-db-size-mb = 32000

## indexing fields for get_actions (collection - action_traces)
  	act.account
  	act.name
	act.data.receiver 
	act.data.from 
	act.data.to
	act.data.name
	act.data.voter
	act.authorization.actor
  
mongo EOS --eval 'db.action_traces.createIndex({"act.account": 1, "_id":-1},{background: true})'  

mongo EOS --eval 'db.action_traces.createIndex({"act.name": 1, "_id":-1},{background: true})'  

mongo EOS --eval 'db.action_traces.createIndex({"act.data.receiver": 1, "_id":-1},{background: true})'  

mongo EOS --eval 'db.action_traces.createIndex({"act.data.from": 1, "_id":-1},{background: true})'  

mongo EOS --eval 'db.action_traces.createIndex({"act.data.to": 1, "_id":-1},{background: true})'  

mongo EOS --eval 'db.action_traces.createIndex({"act.data.name": 1, "_id":-1},{background: true})'  

mongo EOS --eval 'db.action_traces.createIndex({"act.data.voter": 1, "_id":-1},{background: true})'  

mongo EOS --eval 'db.action_traces.createIndex({"act.authorization.actor": 1, "_id":-1},{background: true})'  

## Other Indexes  
mongo EOS --eval 'db.transaction_traces.createIndex({"id": 1},{background: true})'  
mongo EOS --eval 'db.account_controls.createIndex({"controlling_account": 1},{background: true})'  
mongo EOS --eval 'db.pub_keys.createIndex({"public_key": 1},{background: true})'  
mongo EOS --eval 'db.accounts.createIndex({"name": 1},{background: true})'  

  
## Change Log  
  
v1.0.0:  
- Get account history with possibility filtering by actions also pagenation and ASC/DESC sorting  
- support only GET && POST requests  

