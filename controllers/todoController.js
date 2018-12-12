var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to DB
mongoose.connect("mongodb://mash87:131290Mash@ds127624.mlab.com:27624/todo", { useNewUrlParser: true });

//create a schema - blueprint for data
var todoSchema = new mongoose.Schema({
    item: String
});

//model based on schema
var Todo = mongoose.model('Todo', todoSchema);

//create item and save DB
// var itemOne = Todo({item: 'get flowers'}).save(function(err){
//     if (err) throw err;
//     console.log('item saved');
// });

////array to create item
// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'code some stuff'}];
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

    app.get('/todo', function (req, res) {
        //get data from mongoDB and pass it to view
        Todo.find({}, function (err, data) {
            if (err) throw err;
            res.render('todo', { todos: data });
        });
    });

    //add to do item
    app.post('/todo', urlencodedParser, function (req, res) {
        //get data from the view and added to mongoDB
        var newTodo = Todo(req.body).save(function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });

    //delete request
    app.delete('/todo/:item', function (req, res) {
        //delete the requested item from mongoDB
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
            if (err) throw err;
            res.json(data)
        });
    });
}