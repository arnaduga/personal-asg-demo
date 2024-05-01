const express = require("express");
const bodyParser = require("body-parser");
const superagent = require("superagent");

const app = express();
const port = process.env.PORT || 3000;

const red = Math.floor(Math.random() * 244) + 1;
const green = Math.floor(Math.random() * 244) + 1;
const blue = Math.floor(Math.random() * 244) + 1;

const background = "#" + red.toString(16) + green.toString(16) + blue.toString(16);
const text = "#" + (255 - red).toString(16) + (255 - green).toString(16) + (255 - blue).toString(16);

console.log(`Background color: ${background} -- Text color: ${text}`);

var jsonParser = bodyParser.json();

// Preparing the timeout objects
const timeoutSet = 2000;
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeoutSet);

function callApi(url) {
  return new Promise((resolve, reject) => {
    const request = superagent.get(url);

    const timeout = setTimeout(() => {
      request.abort();
      reject("Timeout");
    }, 1000); // temps d'attente maximal en millisecondes avant de rejeter la promesse

    request
      .then((response) => {
        clearTimeout(timeout);
        resolve(response.body);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject("Timeout");
      });
  });
}

function consumeCPU(delay) {
  const endTime = Date.now() + delay * 1000;
  while (Date.now() < endTime) {
    Math.random();
  }
}

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

// Home page
app.get("/", (req, res) => {
  console.log("Homepage requested");
  let machine_id = "Not found";

  callApi("http://169.254.169.254/meta-data/instance-id")
    .then((result) => {
      console.log(machine_id);
      res.render("index", {
        machine_id: JSON.stringify(result),
        text_color: text,
        background_color: background,
      });
    })
    .catch((error) => {
      console.log(error);
      res.render("index", {
        machine_id: "ID not found",
        text_color: text,
        background_color: background,
      });
    });
});

// Small basic endpoint to wait for n seconds...
app.get("/api/waiting", (req, res) => {
  const delay = req.query.delay || 5;
  console.log(`Waiting ${delay} seconds before responding.`);
  consumeCPU(delay);
  res.json({ waited: parseInt(delay) });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
