require("dotenv").config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const port = process.env.PORT || 3001 ;
//API security
app.use(helmet())

//handle CORS error
app.use(cors({
  origin: true, // Allow all origins (or specify your frontend URL)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


//MongoDB connection setup
const mongoose = require('mongoose');

// 1. Verify MONGO_URL is loaded
if (!process.env.MONGO_URL) {
  console.error('❌ Missing MONGO_URL in environment variables');
  process.exit(1);
}

// 2. Simplified connection (Mongoose 7+ needs no extra options)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// 3. Event listeners for monitoring
mongoose.connection.on('connected', () => 
  console.log('📊 MongoDB event connected'));

mongoose.connection.on('disconnected', () => 
  console.log('⚠️  MongoDB event disconnected'));

mongoose.connection.on('error', (err) => 
  console.error('❌ MongoDB event error:', err.message));




// Set body parser

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//Load routers
const userRouter = require("./src/routers/UserRouter")
const ticketRouter = require("./src/routers/TicketRouter")


// use Routers
app.use("/v1/user", userRouter)
app.use("/v1/ticket",ticketRouter)

//Error Handleer
const handleError = require("./src/utils/ErrorHandler")

app.use('*',(req, res, next)=>{
    const error = new Error("Resources not found")
    error.status = 404
    next(error)

})

app.use('*',(error, req,res,next)=>{
    handleError(error,res)
})






app.listen(port, () =>{
    console.log(`API is ready on http://localhost:${port}`)
});