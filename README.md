# API Documentation https://history.cryptolions.io

## API url - https://history.cryptolions.io

## add to your nodeos config.ini
    plugin = eosio::mongo_db_plugin
    mongodb-uri = mongodb://127.0.0.1:27017/EOS
    mongodb-filter-on = *
    #mongodb-filter-out = spammer::
    mongodb-filter-out = eosio:onblock:
    mongodb-filter-out = gu2tembqgage::
    mongodb-filter-out = blocktwitter::
    mongodb-queue-size = 2048
    abi-serializer-max-time-ms = 5000
    mongodb-block-start = 1
    mongodb-store-block-states = false
    mongodb-store-blocks = false
    mongodb-store-transactions = false
    mongodb-store-transaction-traces = true
    mongodb-store-action-traces = true
    
    read-mode = read-only


## indexing fields for get_actions (collection - action_traces)

Use build_indexes.sh script to create indexes (the best is to run on start syncronisation)  

```  
mongo EOS --eval 'db.action_traces.createIndex({"act.account": 1, "createdAt":1},{background: true, sparse: true})'  
mongo EOS --eval 'db.action_traces.createIndex({"act.name": 1, "createdAt":1},{background: true, sparse: true})'  
mongo EOS --eval 'db.action_traces.createIndex({"act.data.receiver": 1, "createdAt":1},{background: true, sparse: true})'  
mongo EOS --eval 'db.action_traces.createIndex({"act.data.from": 1, "createdAt":1},{background: true, sparse: true})'  
mongo EOS --eval 'db.action_traces.createIndex({"act.data.to": 1, "createdAt":1},{background: true, sparse: true})'  
mongo EOS --eval 'db.action_traces.createIndex({"act.data.name": 1, "createdAt":1},{background: true, sparse: true})'  
mongo EOS --eval 'db.action_traces.createIndex({"act.data.voter": 1, "createdAt":1},{background: true, sparse: true})'  
mongo EOS --eval 'db.action_traces.createIndex({"act.authorization.actor": 1, "createdAt":1},{background: true, sparse: true})'  
mongo EOS --eval 'db.action_traces.createIndex({"account_ram_deltas.account": 1, "createdAt":1},{background: true, sparse: true})'  
```
## Other Indexes  
```
mongo EOS --eval 'db.account_controls.createIndex({"controlling_account": 1},{background: true, sparse: true})'  
mongo EOS --eval 'db.pub_keys.createIndex({"public_key": 1},{background: true, sparse: true})'  
mongo EOS --eval 'db.accounts.createIndex({"name": 1},{background: true, sparse: true})'  
```  
## Change Log  
  
v1.0.0:  
- Get account history with possibility filtering by actions also pagenation and ASC/DESC sorting  
- support only GET && POST requests 
- get all accounts 
- get voters for producer 

v1.0.1:  
- Proxy all chain RPC endpoints (POST requests)

v1.0.2:
- support of all requests from eosjs

v1.0.3:
- ?filter=buyram,... for get_actions/account_name request
- get_actions_delta - actions that have field - account_ram_deltas.account
