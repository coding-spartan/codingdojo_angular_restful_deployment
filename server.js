var express = require('express');
var app = express();
var path = require('path');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/task_api');
mongoose.Promise = global.Promise;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(express.static( __dirname + '/firstangular/dist/firstangular' ));


var TaskSchema = new mongoose.Schema({
    title: {type: String, required: [true, "Name cannot be blank."], minlength: [3, "Names must have at least 3 characters"]},
    description:{type: String, required: true, default: " "},
    completed:{type: Boolean, default: false },
  }, {timestamps: true});

mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');

app.get('/tasks', function(req, res){
        Task.find({}, function(err, task){
            if(err){
                res.json({message:"Error", error: err});
            }
            else {
                res.json({message:"Success", data: task});
            }
        })
    });

app.get('/tasks/:id', function(req, res){
        Task.findOne({_id: req.params.id}, 'title description', function(err, task){
               console.log("yyyyyyyyyyyy");
            if(err){
                res.json({message:"Error", error: err});
                console.log("ERRRORRRRR");
            }
            else {
                res.json({message:"Success", data: task});
                console.log(task);
                console.log("YEAHHHHHHHHHHHH");
            }
        })
    });


app.post('/tasks', function(req, res){
        Task.create({title: req.body.title, 
                     description: req.body.description,
                     completed: req.body.completed}, 
                     function(err, task){
        if(err){
            res.json({message:"Error", error: err});
            console.log("ERRRRRORRRRRR")
        }
        else {
            console.log(task);
            res.redirect("/tasks");
            console.log("YEAH");
        }
    });
});

app.put('/tasks/:id', function(req, res){
    Task.update({_id: req.params.id}, {$set: req.body}, 
                 function(err){
    if(err){
        res.json({message:"Error", error: err});
    }
    else {
        res.redirect("/tasks");
    }
    });
});

app.delete('/tasks/:id', function(req,res){
    Task.remove({_id: req.params.id}, function(err){
        if(err){
            res.json({message:"Error", error: err});
        }
        else {
            res.redirect("/tasks");
        }
    })
});
  
app.listen(8000, function(){
    console.log("listening on port 8000");
})

