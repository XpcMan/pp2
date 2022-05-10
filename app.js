const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Popup = require("./models/popup");
const app = express();
const Axios = require("axios").default;
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));



var counter = 0;
setInterval(function(){
  counter++;
  Popup.find().then(pop=>{
    var arr = pop[0].links;
    if(counter>= arr.length){
      counter=0;
    }
    return arr;
  }).then(res=>{
  Axios.post('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyByx2MhzNVDWCVZJflVOTWvxdV4yhq97TQ',{
    "client": {
      "clientId":      "PPmanager",
      "clientVersion": "1.0"
    },
    "threatInfo": {
      "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING"],
      "platformTypes":    ["WINDOWS"],
      "threatEntryTypes": ["URL"],
      "threatEntries": [
        {"url": res[counter]}
      ]
    }
  }).then(res=>{
    // console.log(res.data);
    if(res.data.matches){
      Popup.find().then((pop)=>{
        
        console.log(val);
        var arr=pop[0].links;
        var val = arr[counter];
        if(counter>=arr.length()){
          counter=0;
        }
        var new_arr = arr.filter(s=> s !== val);
    
        pop[0].links = new_arr;
    
        return pop[0].save();
      })
    }
  })})
},600000)
//time


app.get("/",(req,res)=>{
  res.status(403).send('<h1>Forbidden: 403</h1> <p>You don\'t have permission to access this URL.</p>');
  res.end();
});

app.get("/extension-69A437",(req,res)=>{
  var link;
  Popup.find().then(pop=>{
    var arr = pop[0].links;
    
    console.log(counter);
    console.log(arr.length);
    link = arr[counter];
    link.toString();
    
    return link;
  }).then(()=>{
    res.writeHead(302,{Location: link});
    res.end();
  })
});


app.get("/form", (req, res, send) => {
  res.render("input-form");
});

app.post("/form", (req, res) => {
  var first = req.body.first;
  var second = req.body.second;
  var third = req.body.third;
  var fourth = req.body.fourth;
  var fifth = req.body.fifth;
  var sixth = req.body.sixth;
  var seventh = req.body.seventh;
  var eighth = req.body.eighth;
  var ninth = req.body.ninth;
  var tenth = req.body.tenth;
  Popup.find()
    .then((pop) => {
      var id = pop[0]._id;
      var new_arr = pop[0].links;
      console.log(pop[0].links);
      new_arr.push(first);
      new_arr.push(second);
      new_arr.push(third);
      new_arr.push(fourth);
      new_arr.push(fifth);
      new_arr.push(sixth);
      new_arr.push(seventh);
      new_arr.push(eighth);
      new_arr.push(ninth);
      new_arr.push(tenth);
      Popup.findById(id)
        .then((pops) => {
          pops.links = new_arr;
          return pops.save();
        })
        .then((result) => {
          console.log(result);
          res.redirect("/links");
        });
    })
    .catch((err) => console.log(err));
});

app.get("/links", (req, res) => {
  Popup.find()
    .then((pop) => {
      var arr = pop[0].links;

        res.render("links", { arr: arr , counter : counter});
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/delete",(req,res)=>{
  Popup.find().then((pop)=>{
    var val = req.body.val;
    console.log(val);
    var arr=pop[0].links;

    var new_arr = arr.filter(s=> s !== val);

    pop[0].links = new_arr;

    return pop[0].save();

    
  }).then(result=>{
    res.redirect("/links");
  });
})
mongoose
  .connect(
    "mongodb+srv://kamal:Bhakuniji02@cluster0.zfyys.mongodb.net/popups?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
