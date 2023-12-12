const express = require("express");
require("dotenv").config();
const routerPost = require("./routers/post");
const routerTag = require("./routers/tag");
const categoryRouter = require("./routers/category");
const cors = require("cors");
const app = express();
const port = +process.env.PORT || 5555;
const { log } = require("console");

// Configurazione più dettagliata di cors
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));


//middleware per parsing body
app.use(express.json());


const routeNotFound = require("./middleware/notFound");
const errorsHandler = require("./middleware/errorHandler");



app.use("/post", routerPost);
app.use("/tag", routerTag);
app.use("/category", categoryRouter);


app.use(routeNotFound);

app.use(errorsHandler);


// Middleware di gestione degli errori
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});

//avvio app
app.listen(port, () => {
    log(`App avviata su http://localhost:${port}`);
});
