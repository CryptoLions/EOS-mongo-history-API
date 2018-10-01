/*###############################################################################
#
# EOS Mongo History API
# API to get actions using EOS mongo plugin (similar to history plugin)
#
# Git Hub: https://github.com/CryptoLions/EOS-mongo-history-API
#
# Created by http://CryptoLions.io
#
###############################################################################  */


#!/bin/bash
DATADIR="./"

./stop.sh
node index.js  > $DATADIR/mongo-out.log 2> $DATADIR/mongo-err.log &  echo $! > $DATADIR/mongo.pid
