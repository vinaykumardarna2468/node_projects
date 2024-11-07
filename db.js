const sql = require('mysql2')

const con = sql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'root',
        database:'node_testdb'
    }
)

// Connect to MySQL
con.connect((err) => {
    if (err) {
        console.error("Failed to connect to MySQL:", err.message);
        process.exit(1); // Exit the app if the connection fails
    }
    console.log("Connected to MySQL database!");
});


function getMobiles(){
    return new Promise(function(success, reject){
        con.query(`SELECT * FROM mobile`,function(err,row,col){
            if(err){
               reject(err)
            }
            else
            {
               success(row)
            }
        }
    )
    })
}


function addMobiles(n,p,s){
    return new Promise(function(success,reject){
        con.query( `INSERT INTO mobile (name,price,storage) VALUES (?,?,?)`, [n,p,s],
        
            function (err,rows,col){
               if(err)
               {
                reject(err)
               }
               else{
                success(rows)
               }
            }
        )
    })   
}


function updateMobiles(n,p,s,id){
    return new Promise((success, reject) => {
        con.query(`UPDATE mobile SET name=?,price=?,storage=? WHERE id=?`, [n,p,s,id],
        
            function (err,rows){
               if(err)
               {
                reject(err)
               }
               else{
                success(rows)
               }
            }
        )
    })
    
}

function deleteMobiles(id){
    return new Promise((success, reject) => {
        con.query(

            `DELETE FROM mobile WHERE id=?`, [id],
        
            function (err,rows){
               if(err)
               {
                reject(err)
               }
               else{
                success(rows)
               }
            }
        )
    })
}

function addMultipleMobiles(mobiles) {
    return new Promise((success, reject) => {
        // Prepare the values array for multiple records
        const values = mobiles.map(mobile => [mobile.name, mobile.price, mobile.storage]);

        // SQL query for bulk insertion
        const query = 'INSERT INTO mobile (name, price, storage) VALUES ?';

        // Execute the query with multiple values
        con.query(query, [values], function (err, result) {
            if (err) {
                reject(err);
            } else {
                success(result);  // Send the result back if insertion is successful
            }
        });
    });
}


module.exports={
    getMobiles,addMobiles,updateMobiles,deleteMobiles,addMultipleMobiles
}
