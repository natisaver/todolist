# todolist EJS📝
## Installation
cd to project directory
Use the package manager [npm](https://nodejs.org/en/download/) to install modules.

```bash
npm i express
npm i -g nodemon
npm i ejs
npm i mongoose
```

1) To Run:
```bash
nodemon app.js
```

2) In another bash window, To Run DB:
```bash
mongod
```
3) Another bash window:
```bash
mongo
show dbs
use whateverdbnameuwant
show collections
//some cmds
db.collectionitems.find()
db.collectionitems.remove({copypasteidhere})
```

currently, this app is unable to remove items. the "X" button is just for show.
