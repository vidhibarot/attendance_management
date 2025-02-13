const express = require('express') 
const bodyParser = require('body-parser')
const cors = require('cors') 
require('dotenv').config();
const app = express();
const http = require('http');
require('dotenv').config();

const appRoutes = require('./routes')
// middleware
app.use(cors())
app.use(express.json())

const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


// app.use("/path-path", appRoutes)

try {
  appRoutes(app)
} catch (error) {
  console.log("Route Crash -> ", error)
}


const PORT = process.env.PORT || 9000


server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
