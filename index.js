const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const route = require("./Routes/route");
const movie = require("./Routes/movie");
const dbconnect = require("./Mongo/dbconfig");
const PORT = process.env.PORT;
const app = express();


dbconnect();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }))
app.use(logger("dev"));
app.use(cors());
app.use("/api", route);
app.use("/movie", movie);




app.listen(PORT, (error) => {
    if (error) {
        console.log(`Server Start fail ${error}`);
    }
    else {
        console.log(`Server start successfully port is ${PORT}`);
    }
})