#! /bin/bash
mongo nnb-dev --eval "db.dropDatabase()" 
mongorestore -d nnb-dev /Users/brooklynb7/百度云同步盘/nnb/backup/nnb-dev --drop