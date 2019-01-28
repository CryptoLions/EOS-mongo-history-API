echo "IDX 1/12: action_traces: act.account + createdAt"
mongo EOS --eval 'db.action_traces.createIndex({"act.account": 1, "createdAt":1},{background: true, sparse: true})'

echo "IDX 2/12: action_traces: act.name + createdAt"
mongo EOS --eval 'db.action_traces.createIndex({"act.name": 1, "createdAt":1},{background: true, sparse: true})'

echo "IDX 3/12: action_traces: act.data.receiver + createdAt"
mongo EOS --eval 'db.action_traces.createIndex({"act.data.receiver": 1, "createdAt":1},{background: true, sparse: true})'

echo "IDX 4/12: action_traces: act.data.from + createdAt"
mongo EOS --eval 'db.action_traces.createIndex({"act.data.from": 1, "createdAt":1},{background: true, sparse: true})'

echo "IDX 5/12: action_traces: act.data.to + createdAt"
mongo EOS --eval 'db.action_traces.createIndex({"act.data.to": 1, "createdAt":1},{background: true, sparse: true})'

echo "IDX 6/12: action_traces: act.data.name + createdAt"
mongo EOS --eval 'db.action_traces.createIndex({"act.data.name": 1, "createdAt":1},{background: true, sparse: true})'

echo "IDX 7/12: action_traces: act.data.voter + createdAt"
mongo EOS --eval 'db.action_traces.createIndex({"act.data.voter": 1, "createdAt":1},{background: true, sparse: true})'

echo "IDX 8/12: action_traces: act.authorization.actor + createdAt"
mongo EOS --eval 'db.action_traces.createIndex({"act.authorization.actor": 1, "createdAt":1},{background: true, sparse: true})'

echo "IDX 10/12: account_controls: controlling_account"
mongo EOS --eval 'db.account_controls.createIndex({"controlling_account": 1},{background: true, sparse: true})'  

echo "IDX 11/12: pub_keys: public_key "
mongo EOS --eval 'db.pub_keys.createIndex({"public_key": 1},{background: true, sparse: true})'  

echo "IDX 12/12: accounts: name"
mongo EOS --eval 'db.accounts.createIndex({"name": 1},{background: true, sparse: true})'  
