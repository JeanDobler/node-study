let express = require('express'),
bodyParser = require('body-parser'),
mongodb = require('mongodb');
var objectId = mongodb.ObjectId;

var app = express();

// body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
'instagram',
new mongodb.Server('192.168.10.10',27017,{}),
{}
);

console.log('Servidor HTTP esta escutando na porta ' + port);

app.get('/',  (req, res)=>{
res.send({msg:'Olá'});
});

// POST(create)
app.post('/api',  (req, res)=>{
var dados = req.body;
db.open(function(err, mongoclient){
    mongoclient.collection('posts',  (err, collection)=>{
        collection.insert(dados,  (err, records)=>{
            if(err){
                res.json({'status': 'erro'});
            }else{
                res.json({'status': 'inclusao realizada com sucesso'});
            }
            mongoclient.close();
        });
    });
});
});



// GET()
app.get('/api',  (req, res)=>{
    var dados = req.body;
    db.open(function(err, mongoclient){
        mongoclient.collection('posts',  (err, collection)=>{
            collection.find().toArray(  (err, records)=>{
                if(err){
                    res.json({'status': 'erro'});
                }else{
                    res.json(records);
                }
                mongoclient.close();
            });
        });
    });
    });


// Find()
app.get('/api/:id',  (req, res)=>{
    console.log(objectId(req.params.id))
      db.open(function(err, mongoclient){
        mongoclient.collection('posts',  (err, collection)=>{
            collection.find(objectId(req.params.id) ).toArray(  (err, records)=>{
                if(err){
                    res.json({'status': 'erro'});
                }else{
                    res.json(records);
                }
                mongoclient.close();
            });
        });
    });  
    });

    

// update()
app.put('/api/:id',  (req, res)=>{
    
      db.open(function(err, mongoclient){
        mongoclient.collection('posts',  (err, collection)=>{
            collection.update(
                {_id : objectId(req.params.id)},
                {$set: req.body  }  ,
                {}, 
            (err, records)=>{
                
                if(err){
                    res.json({'status': 'erro'});
                }else{
                    res.json(records);
                }
                mongoclient.close();
            });
        });  
    });
});



// Delete()
app.delete('/api/:id',  (req, res)=>{
   
      db.open(function(err, mongoclient){
        mongoclient.collection('posts',  (err, collection)=>{
            collection.remove({_id: objectId(req.params.id)}  ,   (err, records)=>{
                if(err){
                    res.json({'status': 'erro'});
                }else{
                    res.json(records);
                }
                mongoclient.close();
            }) ;
        });
    });  
    });
