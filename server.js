const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bcrypt = require("bcrypt");

const HTTP_PORT = process.env.PORT || 8081;
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.use(express.static("static"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.redirect("/index");
});


app.get("/index", function (req, res) {
  res.render("index", { layout: false });
});


app.post("/index", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    
    return res.render("index", {
      errorMsg: "Missing credentials.",
      layout: false,
    });
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      
      res.redirect(`/dashboard?username=${username}&password=${hash}`);
    });
  }
});

app.get("/logout", function (req, res) {
  res.redirect("/index");
});

app.get("/dashboard", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  res.render("dashboard", {
    username: username,
    password: password,
    layout: false,
  });
});

app.listen(HTTP_PORT, () => {
  console.log("Express http server listening on: " + HTTP_PORT);
});