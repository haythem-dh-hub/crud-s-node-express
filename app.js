const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const Customer = require("./models/customerSchema")
var moment = require('moment');
var methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));




//================== auto refrech===================================
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
 
 
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// ===============================================


mongoose.connect("mongodb+srv://haythem:7achwech@cluster0.cgg6v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
})
.catch((err) => {
    console.log(err);
});
//====================================================

//get req
app.get('/', (req, res) => {
  Customer.find().then((result)=>{
    res.render("index",{arr:result,moment:moment});
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.get('/user/add.html', (req, res) => {
res.render("user/add");
  })
  
  app.get('/user/:id', (req, res) => {
    Customer.findById(req.params.id)
    .then((result)=>{
      res.render("user/edit",{edit:result});
    })
      })

app.get('/view/:id', (req, res) => {
  Customer.findById(req.params.id)
    .then((result)=>{
      console.log(result.id)
      res.render("user/view",{obj:result,moment:moment})
    }).catch((err)=>{
      console.log(err)
    })
  })
  



// post req 
app.post('/user/add.html', (req, res) => {
  Customer.create(req.body).then(()=>{
    res.redirect('/')
  })
  .catch((err)=>{
    console.log(err)
  })
  
  })

  app.post('/search', (req, res) => {
    Customer.find({firstName: req.body.searchText}) //atributte name="searchText"
    .then((result)=>{
      res.render("user/search",{arr:result, moment:moment});
      
    }).catch((err)=>{
      console.log(err);
    }) 
      }) 

  // put req

app.put('/edit/:id', (req,res)=>{
  console.log(req.body)
  Customer.updateOne({_id:req.params.id}, req.body)
  .then((params)=>{
    res.redirect('/')
  }).catch((err)=>{
    console.log(err)
  })
}) 


// delet req

app.delete('/delete/:id', (req,res)=>{
  console.log(req.body)
  Customer.deleteOne({_id:req.params.id})
  .then((params)=>{
    res.redirect('/')
  }).catch((err)=>{
    console.log(err)
  })
})  

