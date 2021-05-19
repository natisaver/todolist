const express = require("express");

const https = require("https");
const {check, validationResult} = require("express-validator");

const app = express();

app.use(express.static("public")); //indicates the directory for static items e.g css
app.use(express.urlencoded()); //bodyparser
app.set("view engine", "ejs"); //integrating ejs into express


//must define the array here, scope, to res.render ejs before item is added
var itemArr = [];


//sorting array in ascending order
var sortList = function(x) {
  x.sort((a,b) => (a.st < b.st) ? -1 : ((a.st > b.st) ? 1 : 0))
  // the sort function -> if return -ve1, no diff, if +ve1, swap the elements, if 0 dont swap but change the rest
  // condition ? value-if-true : value-if-false
  for(var i=0; i<x.length; x++) {
    x[i].id = i;
  }
}

app.get("/", function (req, res) {
  var today = new Date();
  var getToday = today.getDay();
  var typeofDay = "";

  var dd = String(today.getDate()).padStart(2, "0"); //pad start juz adds 0 if the string length is < 2
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0! pad a 0 in front of each month if <2
  var yyyy = today.getFullYear();

  getDate = dd + "/" + mm + "/" + yyyy;

  // if(getToday === 6 || 0) {
  //     typeofDay = "Weekend";
  // }
  // else {
  //     typeofDay = "Weekday"
  // }

  switch (getToday) {
    case 0:
      typeofDay = "Sunday...wah sian tmr work";
      break;
    case 1:
      typeofDay = "Monday. Blues.";
      break;
    case 2:
      typeofDay = "Tuesday, shag";
      break;
    case 3:
      typeofDay = "Wednesday, almost there";
      break;
    case 4:
      typeofDay = "Thursday, quite shiok";
      break;
    case 5:
      typeofDay = "Friday, YES!!!!";
      break;
    case 6:
      typeofDay = "Saturday, nice weekend vibes";
      break;
    default:
        typeofDay = "idk the day anymore, time just passes";
  }

  //only can render ejs one time.
  res.render("list", { EJSINPUT: typeofDay, EJSINPUT2: getDate, ITEMARRAY: itemArr}); //pass an object into list.ejs with keyval pair


});

app.post("/", function(req,res){
    var newItem = req.body.newItem;
    var starttime = req.body.startTime;
    var endtime = req.body.endTime;
    var id = 0;

    //checking validity of range
    var start = parseInt(starttime.split(":"));
    var end = parseInt(endtime.split(":"));

    var difference = (end - start) / (86400000 * 7);
    if (difference < 0) {
        // throw new Error("The start time must come before the end time.");
        res.render("fail");
    }
    else
      itemArr.push({name:newItem, st:starttime, et:endtime, id:id}); //if all ok, then push to arr
      sortList(itemArr); 
      res.redirect("/");


})

app.post("/fail", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("started on port 3k");
});
