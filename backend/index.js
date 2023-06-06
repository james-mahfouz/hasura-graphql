const express = require('express')
const cluster = require("cluster");
const OS = require("os")
const cors = require('cors');
require("dotenv").config();

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// const authRouter = require('./routes/auth.routes')
// app.use('/auth', authRouter)

// const doctorRouter = require("./routes/doctor.routes")
// const { authMiddleware } = require('./middlewares/auth.middleware')
// const { doctorMiddleware } = require("./middlewares/doctor.middleware");
// app.use("/doctor", authMiddleware, doctorMiddleware, doctorRouter)

if (cluster.isMaster) {
    const numCpus = OS.cpus().length;
    for (let i = 0; i < numCpus; i++) {
        cluster.fork();
    }
} else {
    app.listen(process.env.PORT, (err) => {
        if (err) console.error(err)
        console.log(`Worker ${process.pid} is running on port `, process.env.PORT);
        require("./configs/db.config")
    });
}