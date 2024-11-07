const express = require('express')

const app = express();

const path = require('path');

const db = require('./db');

const cors = require('cors');
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(5000,()=>{
    console.log("server started at port 5000")
})

app.get('/mobiles',(req,res)=>{
      db.getMobiles()
      .then((mobiles)=>{
        res.send(mobiles)
      })
      .catch(()=>{
        res.send("error")
      })
    })

app.post('/mobiles',(req, res)=>{
    db.addMobiles(req.body.name, req.body.price, req.body.storage)
    .then((mobiles)=>{
        res.send(mobiles);
    })
    .catch((err)=>{
        res.send("error 123");
    });
});

app.put('/mobiles',(req,res)=>{
    db.updateMobiles(req.body.name,req.body.price,req.body.storage,req.body.id)
    .then(()=>{
        res.send(req.body)
    })

    .catch(()=>{
        res.send("error")
    })
})

app.delete('/mobiles',(req,res)=>{
    db.deleteMobiles(req.body.id)
    .then((mobiles)=>{
        res.send(mobiles)
    })

    .catch(()=>{
        res.send("error")
    })
})

// Add this new route for bulk upload
app.post('/mobiles/bulk', (req, res) => {
    const mobiles = req.body;  // Assuming the body is an array of mobile objects [{ name, price, storage }, ...]

    // Ensure the request body is an array of objects
    if (!Array.isArray(mobiles)) {
        return res.status(400).send("Request body must be an array");
    }

    // Assuming db.addMultipleMobiles is a function in your db module that adds multiple mobiles
    db.addMultipleMobiles(mobiles)
        .then(() => {
            res.status(201).send("Mobiles added successfully!");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Failed to upload mobiles");
        });
});