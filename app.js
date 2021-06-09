const express = require("express");

const https = require("https");
const {check, validationResult} = require("express-validator");
const mongoose = require("mongoose");
const { truncate } = require("fs");

const app = express();

app.use(express.static("public")); //indicates the directory for static items e.g css
app.use(express.urlencoded()); //bodyparser
app.set("view engine", "ejs"); //integrating ejs into express

//mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser:true})

//item schema
const itemSchema = new mongoose.Schema ({
  name: String,
  st: String,
  et: String,
  checked: Boolean
});

//create an item from schema
//mongoose.model(name, [schema], [collection], [skipInit]) => mongoose will auto pluralise the "name" to create the "collection"
const Item = mongoose.model('Item', itemSchema);

//add a specific item
const item1 = new Item({
  name: "Default Task",
  st: "05:00",
  et: "05:10",
  checked: false
});

//must define the array here, to res.render ejs before item is added
var itemArr = [item1];




// //2nd schema created=> listSchema for customListName, where items has a nested itemSchema
// const listSchema = {
//   name: String,
//   items: [itemSchema] 
// };

// const List = mongoose.model("List", listSchema);
// //as for the adding of the list, go to the express route app.get(custom...)




//FUNCTION TO SORT ARRAY in ascending order by start time (st)
var sortList = function(x) {
  x.sort((a,b) => (a.st < b.st) ? -1 : ((a.st > b.st) ? 1 : 0))
  // the sort function -> if return -ve1, no diff, if +ve1, swap the elements, if 0 dont swap but change the rest
  // condition ? value-if-true : value-if-false
  for(var i=0; i<x.length; x++) {
    x[i].id = i;
  }
}

var checkList = function(x) {
  checArr = []
  for(var i=0; i<x.length; x++) {
    if(x[i].checked == true){
      checArr[i] = checked;
    }
    else {checArr[i] = ""}
  }
  return checArr
}

app.get("/", function (req, res) {
  var today = new Date();
  var getToday = today.getDay();
  var typeofDay = "";

  //This is to get the current day
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
      typeofDay = "Sunday...wah sian tmr work.";
      break;
    case 1:
      typeofDay = "Monday. Blues.";
      break;
    case 2:
      typeofDay = "Tuesday, shag.";
      break;
    case 3:
      typeofDay = "Wednesday, almost there.";
      break;
    case 4:
      typeofDay = "Thursday, quite shiok.";
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

  //This is to get the current time in AM/PM

  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();
  let ext = ""

  if (seconds<10){
    seconds = "0" + seconds;
  }

  if (minutes<10){
    minutes = "0" + minutes;
  }

  if (hours>=12){
    ext = "PM"
    if (hours == 12) {
      hours = 12
    }
    else {hours = hours - 12}
    
    if (hours<10){hours = "0" + hours}
  }

  else {
    ext = "AM"
    hours = "0" + hours
  }
  let dateDisplay = hours + ":" + minutes + ":" + seconds + " " + ext;

  //Mongoose find items from the Item Collection

  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0) {
      //insert the items (itemArr) into Item Collection in Mongoose if foundItems arr is empty
      Item.insertMany(itemArr, function(err){
        if (err) {
          console.log(err)
        }
        else {
          console.log("Success to DB")
        }
      });
      res.redirect("/"); 
    } else { //only can render ejs one time.
      sortList(foundItems)
      var ejschec = checkList(foundItems)
      console.log(ejschec)
      res.render("list", { EJSINPUT: typeofDay, EJSINPUT2: getDate, EJSINPUT3: dateDisplay, ITEMARRAY: foundItems, EJSCHECKED:ejschec }); //pass an object into list.ejs with keyval pair 
    } 
  })


});

//custom express route, we can anyhow label (customListName in this case)
//so if they localhost:3000/home -> customListName = home 
// app.get("/:customListName", function(req,res){
//   const customListName = req.params.customListName;
  
  //1. checks to see if such a name alr exists in collection, result of find -> foundList
  //2. if no error and if no list is found(!foundList):
  //3. create the list and save into collection.
//   List.findOne({name: customListName}, function(err, foundList){
//     if (!err) {
//       if (!foundList) {
        
//         //create a new list in the lists collection => schema is found at top of code
//         const list = new List({
//           name: customListName,
//           items: itemArr //passing in an array of items (item schema)
//         });
//         list.save() //save the list to the collection lists
//         res.redirect("/" + customListName);
//       } else {
//         //ejs render
//         res.render("list", { EJSINPUT: typeofDay, EJSINPUT2: getDate, EJSINPUT3: dateDisplay, ITEMARRAY: foundList.items, EJSCHECKED:ejschec })
//       }
//     }
//   })
// })

//post request upon click of "Add" button
app.post("/", function(req,res){
    var newItem = req.body.newItem;
    var starttime = req.body.startTime;
    var endtime = req.body.endTime;
    var id = 0;
    var chek = false;

    //checking validity of range
    var start = parseInt(starttime.split(":"));
    var end = parseInt(endtime.split(":"));

    var difference = (end - start) / (86400000 * 7);
    if (difference < 0) {
        // throw new Error("The start time must come before the end time.");
        res.render("fail");
    }
    else
      var item = new Item({
        name:newItem, st:starttime, et:endtime, id:id, checked:chek
      });
      item.save(); //saves into items collection

      // sortList(itemArr);
    
      res.redirect("/");


})

//returns the value of button which is assigned to _id
app.post("/delete", function(req,res){
  const deleteid = req.body.delbutton; //go list.ejs to see the value of button
  Item.deleteOne({_id: deleteid}, function(err){
    if(err){
      console.log(err);
    } else console.log("removed" + deleteid + "item frm da db")
  })

  res.redirect("/")
})

//storing checkbox state in db
app.post("/check", function(req,res){
  if (req.body.checkboxx.checked === true) {
    Item.updateOne({checked: true}, function(err){
      if(err){
        console.log(err);
      } else console.log("successfully updated db");
    });
  } 
  else {
    Item.updateOne({checked: false}, function(err){
      if(err){
        console.log(err);
      } else (console.log("successfully updated db"));
    });
  }
});

app.post("/fail", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("started on port 3k");
});
