const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const cookieparser = require("cookie-parser");
const errorController = require("./controllers/error");
const User = require("./models/user");


const MONGODB_URI = process.env.MONGODB_DATABASE;

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_DATABASE,
  collection: "sessions",
});

const csrfProtection = csrf();




app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const mantanes = require("./routes/mantanes");


app.use(cookieparser(process.env.COOKIS_SECRET));



app.use(bodyParser.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);





app.use(flash());
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.adminisAuthenticated = req.session.adminisLoggedIn;
  res.locals.csrfTokenss = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next()
      }
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});


app.use('/admin/*', (req, res, next) => {
  if (!req.session.admin) {
    return next();
  }
  Admin.findById(req.session.admin._id)
    .then(admin => {
      req.admin = admin;
      next();
    })
    .catch(err => console.log(err));
});



app.use("/currency/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(mantanes);
app.get('/500', errorController.get500)



app.use((error, req, res, next) => {
  res.redirect('/500')
})
app.use(errorController.get404);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})


const port = process.env.PORT || 3000

app.listen(port);
