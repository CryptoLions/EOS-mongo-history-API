# EOS Mongo History API  
API to get actions using EOS mongo plugin (similar to history plugin)  

http://history.cryptolions.io:3838/v1/get_actions/<account_name>[/action_name]?limit=XX&skip=XX&sort=1/-1  

http://history.cryptolions.io:3838/v1/get_actions/cryptolions1  
http://history.cryptolions.io:3838/v1/get_actions/cryptolions1/sethash  
http://history.cryptolions.io:3838/v1/get_actions/cryptolions1/sethash?limit=2&skip=1&sort=-1  

  
by <a href="http://CryptoLions.io">CryptoLions</a> | <a href="https://github.com/CryptoLions/EOS-mongo-history-API">GitHub Sources </a>  

  
# Change Log  
  
v0.0.1:  
- Get account history with possibility filtering by actions also pagenatipon and ASC/DESC sorting  
- support only GET requests  

