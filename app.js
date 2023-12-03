const express = require("express");
require("dotenv").config();
const routerPost = require("./routers/post");
const routerTag = require("./routers/tag");
const categoryRouter = require("./routers/category");

const app = express();
const port = +process.env.PORT || 5555;
const { log } = require("console");

//middleware per parsing body
app.use(express.json());

app.use("/post", routerPost);
app.use("/tag", routerTag);
app.use("/category", categoryRouter);

// Middleware di gestione degli errori
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});
//avvio app
app.listen(port, () => {
    log(`App avviata su https://localhost:${port}`);
});
