// Import modules
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


// Setting up ejs as view engine
app.set("view engine", "ejs");


// Setting up parsers for form
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Setting up a middleware for accessing public static files
app.use(express.static(path.join(__dirname, "public")));


// Initialized an empty string
let oldName = "";


// Create a '/' route
app.get("/", function(req, res) {
    fs.readdir("./files", function(err, files) {
        res.render("index", {files: files});
    });
});


// Create a '/create' route to render index.ejs AND for form submission
app.post("/create", function(req, res) {
    fs.writeFile(`./files/${req.body.title}.txt`, `${req.body.details}`, function(err) {
        res.redirect("/");
    });
});


// Create a '/file' route to render file.ejs
app.get("/file/:filename", function(req, res) {
    fs.readFile(`./files/${req.params.filename}.txt`, "utf-8", function(err, filedata) {
        res.render("file", {filename: req.params.filename, filedata: filedata});
    });
});


// Create a '/edit' route to render edit.ejs
app.get("/edit/:filename", function(req, res) {
    fs.readFile(`./files/${req.params.filename}.txt`, "utf-8", function(err, filedata) {
        res.render("edit", {filename: req.params.filename, filedata: filedata});
        oldName = req.params.filename;
    });
});


// Create a '/edit' route for form submission
app.post("/edit", function(req, res) {
    if (!(req.body.title == oldName)) {
        fs.writeFile(`./files/${req.body.title}.txt`, `${req.body.details}`, function(err) {
            res.redirect(`/file/${req.body.title}`);
        });
        fs.unlink(`./files/${oldName}.txt`, function(err) {
        });
    }
    else {
        fs.writeFile(`./files/${req.body.title}.txt`, `${req.body.details}`, function(err) {
            res.redirect(`/file/${req.body.title}`);
        });
    }
})


// Create a '/delete' route to render delete.ejs
app.get("/delete/:filename", function(req, res) {
    fs.readFile(`./files/${req.params.filename}.txt`, "utf-8", function(err, filedata) {
        res.render("delete", {filename: req.params.filename, filedata: filedata});
        oldName = req.params.filename;
    });
    
});


// Create two '/delete' routes for form submissions
app.post("/delete-1", function(req, res) {
    fs.unlink(`./files/${oldName}.txt`, function(err) {});
    res.redirect("/");
});

app.post("/delete-2", function(req, res) {
    res.redirect(`/file/${oldName}`);
});


// Setup port for server
app.listen(3000);