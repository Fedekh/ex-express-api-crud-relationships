const express = require("express");
require("dotenv").config();
const routerPost = require("./routers/post");
const app = express();
const port = +process.env.PORT || 5555;
const { log } = require("console");

//middleware per parsing body
app.use(express.json());

app.use("/post", routerPost);


//avvio app
app.listen(port, () => {
    log(`App avviata su https://localhost:${port}`);
});
