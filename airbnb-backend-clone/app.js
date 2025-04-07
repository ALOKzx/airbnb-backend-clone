// core module
const path = require('path');

//external module
const express = require('express');
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const MongoDbStore = require('connect-mongodb-session') (session);
const dbPath = "mongodb+srv://root:root@cluster101.n7yxt5g.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster101";

// local module
const storeRouter = require("./routes/storeRouter");
const {hostRouter} = require("./routes/hostRouter");
const rootdir = require('./utils/path');
const errorsControllers = require("./controllers/errors");
const authRouter = require('./routes/authRouter');



const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDbStore({
  uri : dbPath,
  collection : 'sessions'
})

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  let result = '';
  for(let i=0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result;
}

const storage = multer.diskStorage({
  destination : (req, file, cb) => {
   cb(null, 'uploads/');
  },
  
  filename: (req,file, cb) => {
    cb(null, randomString(12) + "-" + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } {
    cb(null, false);
  }
 
}

const multerOptions = {
  storage, fileFilter
};

app.use(express.urlencoded());
app.use(multer(multerOptions).single('housePic'));
app.use(express.static(path.join(rootdir, 'public')));
app.use("/uploads", express.static(path.join(rootdir, 'uploads')));
app.use("/host/uploads", express.static(path.join(rootdir, 'uploads')));
app.use("/houses/uploads", express.static(path.join(rootdir, 'uploads')));

app.use(session({
  secret: "airbnb",
  resave: false,
  saveUninitialized: true,
  store: store
}))
app.use((req,res,next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
})

app.use(authRouter)
app.use(storeRouter);
app.use('/host',(req, res, next) => {
  if(req.isLoggedIn) {
    return next();
  } else {
   return res.redirect('/login');
  }
});
app.use('/host',hostRouter);
app.use(errorsControllers.PageNotFound);





mongoose.connect(dbPath).then(() => {
  console.log('connected to mongodb');
  app.listen(3001);
}).catch(err => {
    console.log('error while connecting to mongodb :', err)
  })
