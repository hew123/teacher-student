# Teacher-Student Subscription Service

I am using ts-node to run the TS codes instead of running node js after compiling TS to JS.
- "ts-node": "3.3.0",
- "@types/node": "^8.0.29",
- "npm" : "6.13.4"
- "node" : "v12.16.1"

**TO RUN EXISTING IMPLEMENTED PROJECT**
- docker-compose up (run docker image for sql)
- OR use one's own sql db & change db settings in ormconfig.json
- npm install
- ts-node src/inject.ts (to inject some initial data -- optional)
- npm start (app running at localhost:3000)

**DEBUGGING FOR MYSQL AUTH ISSUE**
- connect to database in mySQL workbench at port:3308 using below credentials 
- user="root"&pw="helloworld" 
- run sql query: {ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'helloworld'; FLUSH PRIVILEGES;}



*assumption for usecase 4: notification:*
- the recipient list will not show a student who is not found in the database
even if he/she is tagged @ at the notification message.

-------------------------------------------------------
**TO START A NEW EMPTY PROJECT with typeorm (for my own reference)**
- npm install typeorm -g
- typeorm init --name MyProject --database mysql
- npm install 
