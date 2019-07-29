var express = require("express"); // call the express module which is default provded by Node

var app = express(); // now we need to declare our app which is the envoked express application

var mysql = require('mysql');
// Set the template engine
app.set('view engine', 'ejs');


app.use(express.static("views")); // Allows access to the views folder
app.use(express.static("style")); // Allows access to the styles folder
app.use(express.static("images")); // Allows access to the image folder

// body parser to get information

var fs = require('fs')
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}));

var contact = require("./model/contact.json"); // allow the app to access the contact.json 


// set up simple hello world application using the request and response function
app.get('/', function(req, res) {
res.render("index"); // we set the response to send back the string hello world
console.log("Hello World"); // used to output activity in the console
});
//gets the contacts page
app.get('/contacts', function(req,res){
    res.render("contacts", {contact}); // get the contacts page when somebody visits the /contacts url 
    console.log("I found the contacts page");
});
//gets the contact us page
app.get('/add', function(req,res){
    res.render("add"); // get the contacts page when somebody visits the /add url 
    console.log("I found the contact us page");
});


// ******************************** Start of SQL **************************************** //

// First we need to tell the application where to find the database


const db = mysql.createConnection({
host: 'den1.mysql1.gear.host',
    user: 'nci',
    password: 'Yo7A_B09i4?1',
    database: 'NCI'
 });
// Next we need to create a connection to the database

db.connect((err) =>{
     if(err){
        console.log("go back and check the connection details. Something is wrong.")
        // throw(err)
    } 
     else{
        
        console.log('Looking good the database connected')
    }
    
    
})

// this route will create a database table

// app.get('/createtable', function(req,res){
//     // Create a table that will show product Id, name, price, image and sporting activity
//     let sql = 'CREATE TABLE liammc (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image varchar(255), Activity varchar(255))';
    
//     let query = db.query(sql, (err,res) => {
        
//         if(err) throw err;
        
//         console.log(res);
        
//     });
    
//     res.send("You created your first DB Table")
    
// })

// this route will create a database table

// This route will create a product 


// app.get('/insert', function(req,res){
//     // Create a table that will show product Id, name, price, image and sporting activity
//     let sql = 'INSERT INTO shanec (Name, Price, Image, Activity) VALUES ("polar M400", 199, "polarm400.png", "Running")';
    
//     let query = db.query(sql, (err,res) => {
        
//         if(err) throw err;
        
//         console.log(res);
        
//     });
    
//     res.send("You created your first Product");
    
// })

//URL to get the products
app.get('/products', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'SELECT * FROM shanec';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
       res.render('products', {result}) 
        
    });
    
    //res.send("You created your first Product");
    
})
// URL to get the add product page
app.get('/addproduct', function(req,res){
     // Create a table that will show product Id, name, price, image and sporting activity
       res.render('addproduct'); 
    });

// post request to write info to the database

app.post('/addproduct', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'INSERT INTO shanec (Name, Price, Image, Activity) VALUES ("   '+req.body.name+'   ", '+req.body.price+', "'+req.body.image+'", "'+req.body.activity+'") ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
        res.redirect('/products')
    
    //res.send("You created your first Product");
    
})

// URL to get the edit product page 

app.get('/editproduct/:id', function(req, res) {
    let sql = 'SELECT * FROM shanec WHERE Id =  "'+req.params.id+'" ';
    
     let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
     
       res.render('editproduct', {result}); 
        
    });

});

// URL to edit product


app.post('/editproduct/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'UPDATE shanec SET Name = "   '+req.body.name+'   ", Price = '+req.body.price+', Image = "'+req.body.image+'", Activity = "'+req.body.activity+'" WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/products')
    //res.send("You created your first Product")
    
});


// URL TO delete a product

app.get('/delete/:id', function(req,res){
    
        let sql = 'DELETE FROM shanec WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
       
        
    });
    
    res.redirect('/products')
    
    
});





// post request to send JSON to server
// Write to json file
app.post("/add", function(req,res){

    // Stp 1 is to find the largest id in the JSON file
    
            function getMax(contacts, id){ // function is called getMax
            var max // the max variable is declared here but still unknown
    
                for(var i=0; i<contacts.length; i++){ // loop through the contacts in the json fil as long as there are contcats to read
                    if(!max || parseInt(contact[i][id])> parseInt(max[id]))
                    max = contacts[i];
                        }
    
            return max;
             }

             
             // make a new ID for the next item in the JSON file
             
              maxCid = getMax(contact, "id") // calls the getMax function from above and passes in parameters 
             
             var newId = maxCid.id + 1; // add 1 to old largest to make new largest
             
             // show the result in the console
             console.log("new Id is " + newId)
             
             
             // we need to get access to what the user types in the form
             // and pass it to our JSON file as the new data
             
             var contactsx = {
                 
                 id: newId,
                 name: req.body.name,
                 Comment: req.body.Comment,
                 email: req.body.email
                 
             }
             
             
    fs.readFile('./model/contact.json', 'utf8',  function readfileCallback(err){
        
        if(err) {
            throw(err)
            
        } else {
            
            contact.push(contactsx); // add the new data to the JSON file
            json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
            fs.writeFile('./model/contact.json',json, 'utf8')
            
        }
        
    })         
             
     res.redirect('/contacts') ;
    
});


// Now we code for the edit JSON data


// this is the get page to edit
app.get('/editcontact/:id', function(req,res){
    // Now we build the actual information based on the changes made by the user
    
    function chooseContact(indOne){
        return indOne.id === parseInt(req.params.id)
    }
    
    var indOne = contact.filter(chooseContact)
    
    res.render('editcontact', {res:indOne});
    
    
    
});


// ** Perform the edit

app.post('/editcontact/:id', function(req,res){
    
    // first we need to stringify our JSON data so it can be called as a variable and modified when needed
    
    /*The JSON.stringify() method converts a JavaScript object or value to a JSON string, optionally
    replacing values if a replacer function is specified or optionally including only the specified
    properties if a replacer array is specified.
    
    eg.
    console.log(JSON.stringify({ x: 5, y: 6 }));
    expected output: "{"x":5,"y":6}"
    
    */
    var json = JSON.stringify(contact);
    
    // declare the incoming id from the url as a variable
    var keyToFind = parseInt(req.params.id);
    
    // use predetermined javaScript functionality to map the data and find the information needed
    var index = contact.map(function(contact) {return contact.id}).indexOf(keyToFind);
    
    // the next three lines get the content from the body where the user fills in the form
    var z = parseInt(req.params.id);
    
    var x = req.body.name;
    
    var y = req.body.Comment;
    
    // the next section pushes the new data into the JSON file in place of the data to be updated
    
    contact.splice(index, 1, {name: x, Comment: y, email: req.body.email, id: z})
    
    
    // Now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/contact.json',json, 'utf8');
    
    
    res.redirect("/contacts");
    
});

app.get('/deletecontact/:id', function(req,res){
    
    var json = JSON.stringify(contact);
    
    // declare the incoming id from the url as a variable
    var keyToFind = parseInt(req.params.id);
    
    // use predetermined javaScript functionality to map the data and find the information needed
    var index = contact.map(function(contact) {return contact.id}).indexOf(keyToFind);
    
    
    
    // the next section pushes the new data into the JSON file in place of the data to be updated
    
    contact.splice(index, 1)
    
    
    // Now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/contact.json',json, 'utf8');
    
    
    res.redirect("/contacts");
    
    
})



// this code provides the server port for our application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
console.log("Yippee its running");
  
});
