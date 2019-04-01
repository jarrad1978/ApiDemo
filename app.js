const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

const PersonModel = Mongoose.model("person", {
    firstname: String,
    middlename: String,
    lastname: String,
    address: String
});

const authAttempt = {
    username: String,
    password: String
};

Mongoose.connect("mongodb://localhost/apidemonosqldb");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.post("/person", async (request, response) => {
    try {
        var person = new PersonModel(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/people", async (request, response) => {
    try {
        var result = await PersonModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/person/:id", async (request, response) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        response.send(person);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.put("/person/:id", async (request, response) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        person.__v = person.__v +1;
        person.set(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.delete("/person/:id", async (request, response) => {
    try {
        var result = await PersonModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/auth", async (request, response) => {
    try{
        var auth = await AuthAttempt(request.body);
    } catch(error){
        response.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log("Listening at :3000...");
});