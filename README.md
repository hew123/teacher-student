# teacher-student
subscription service

I am using ts-node to run the TS codes instead of compiling TS to JS and then run node js.
"ts-node": "3.3.0",
"@types/node": "^8.0.29",
"npm" : "6.13.4"
"node" : "v12.16.1"
Running npm install will install the ts-node dependencies in package.json.

TO RUN EXISTING IMPLEMENTED PROJECT
- run docker image for sql: docker-compose up
- connect to database in mySQL workbench at port:3308 using the user="root"&pw="helloworld" run query: {ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'helloworld';FLUSH PRIVILEGES;}
(DB setting is in ormconfig.json)
- npm install
- ts-node src/inject.ts to inject some initial data (optional)
- npm start
- (send api request to localhost:3000)

assumption for usecase 4: notification:
the recipient list will not show a student who is not found in the database
even if he/she is tagged @ at the notification message.

-------------------------------------------------------
 TO START A NEW EMPTY PROJECT with typeorm (for my own reference)
- npm install typeorm -g
- typeorm init --name MyProject --database mysql
- npm install 
