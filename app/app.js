"use strict";

const express = require("express");

const path = require('path');

const multer = require('multer');

require("dotenv").config();

const app = express();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './data/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-'
           + uniqueSuffix
           // Add extension of original uploaded file
           + path.extname(file.originalname)
           );
    },
    mimetype: 'csv',
    fileFilter: (req, file, cb) => {
        let extension = path.extname(file.originalname);
        // Qualify extension of upload
        if (extension !== '.csv' && extension !== 'xlsx') {
            return cb(new Error('Only speadsheet files are allowed'))
        }
        cb(null, true)
    }
});

let upload = multer({
    storage: storage
});


let host = process.env.HOST || "localhost";
let port = process.env.PORT || 3000;

let static_dir = {
    root: path.join(__dirname, '../public/')
};

async function run () {

    try {

        app.use(express.static("public"));

        app.get("/", (req, res) => {
            res.sendFile("upload.html", static_dir);
        });

        app.get("*", (req, res) => {
            res.sendFile("404.html", static_dir);
        });

        app.post('/api/upload', upload.single('spreadsheet'), (req, res, err) => {
            if (err) {
                return console.error(err.message);
            }
            res.send("OK");
            return console.log("File Uploaded.")
        });

        app.listen(port, host, () => {
            console.log(`Server working on ${host}:${port}`);
        });

    } catch (err) {

        return console.error(err.message);

    }

}

run();