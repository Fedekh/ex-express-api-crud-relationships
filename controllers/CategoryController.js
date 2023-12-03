const { PrismaClient } = require("@prisma/client");
const slugify = require("slugify");
const prisma = new PrismaClient();


const index = async (req, res) => {
    try {
        const data = await prisma.category.findMany();

        res.json({
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


const store = async (req, res) => {
    try {
        const { title } = req.body;

        const newCategory = await prisma.category.create({
            data: {
                title: title
            }
        });

        res.json({ data: newCategory, comment: "categoria creato correttamente" });

    } catch (e) {
        console.error(e);
        if (!res.headersSent) {
            res.status(500).json("Si è verificato un errore durante la creazione della categoria");
        }
    }
};


const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const searchcategory = await prisma.category.findUnique({ where: { id: +id } });

        if (!searchcategory) {
            return next(new Error("Questa categoria non esiste"));
        }

        const updatedcategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                title: title
            }
        });

        res.json({ data: updatedcategory, comment: "category aggiornato correttamente" });

    } catch (error) {
        console.error(error);
        next(error);
    }
};


const destroy = async (req, res, next) => {
    try {
        await prisma.category.delete({ where: { id: +req.params } });

        res.json({ message: "categoria eliminata correttamente" });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


module.exports = { index, store, update, destroy };
