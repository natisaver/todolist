# todolist EJS📝
## Installation
cd to project directory
Use the package manager [npm](https://nodejs.org/en/download/) to install modules.

```bash
npm i express ejs mongoose
npm i -g nodemon
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
use dbnametoaccess
show collections
//some cmds
db.collectionitems.find()
db.collectionitems.remove({copypasteidhere})
```

currently, this app is unable to fully store the checklist state, intend to do so via localstorage
