"use strict";

const express = require("express");

const path = require("path");

const app = express();

require("dotenv").config();

let host = process.env.HOST || "localhost";
let port = process.env.PORT || 3000;

async function run () {

    try {

        app.use(express.static("static"));

        app.get("/", (req, res) => {
            res.sendFile("upload.html", { root: path.join(__dirname, '../static/')});
        });

        app.get("*", (req, res) => {
            res.sendFile("404.html", { root: path.join(__dirname, '../static/')});
        });

        app.listen(port, host, () => {
            console.log(`Server listening on ${host}:${port}`);
        });

    } catch (err) {

        return console.error(err.message);

    }

}

run();