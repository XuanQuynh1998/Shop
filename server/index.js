const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
require("./config/passport/passport.config")(passport);

const route = require("./routes/index");
const db = require("./config/db/db.config");
const https = require("https");
const fs = require("fs");

//connect to DB
db.connect();
dotenv.config();
let app = express();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(
    expressSession({
        secret: process.env.TOKEN_SECRET,
        maxAge: new Date(Date.now() + 3600000),
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost:27017/my_shop_dev",
            autoRemove: "native",
        }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));

app.use(express.static(path.join("../", "client", "src", "components")));
app.use(express.static(path.join("../", "client", "public")));
app.use(express.static(path.join("../", "client", "src", "resources")));
app.use(express.static(path.join("../", "client", "src", "utils")));

route(app);

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
    },
    app
);

sslServer.listen(process.env.PORT || 4000, () => {
    console.log("Server is running...");
});
