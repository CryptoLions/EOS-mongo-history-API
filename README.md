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
    mongodb-store-action-traces = 1
    mongodb-block-start = 1

## indexing fields for get_actions (collection - action_traces)
  	act.account
  	act.name
	act.data.receiver 
	act.data.from 
	act.data.to
	act.data.name
	act.data.voter
	act.authorization.actor
  
## Change Log  
  
v1.0.0:  
- Get account history with possibility filtering by actions also pagenation and ASC/DESC sorting  
- support only GET && POST requests  

