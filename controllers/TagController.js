const { PrismaClient } = require("@prisma/client");
const slugify = require("slugify");
const prisma = new PrismaClient();


const index = async (req, res) => {
    try {
        const data = await prisma.tag.findMany();

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

        const newTag = await prisma.tag.create({
            data: {
                title: title
            }
        });

        res.json({ data: newTag, comment: "Tag creato correttamente" });

    } catch (e) {
        console.error(e);
        if (!res.headersSent) {
            res.status(500).json("Si è verificato un errore durante la creazione del tag");
        }
    }
};


const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const searchTag = await prisma.tag.findUnique({ where: { id: +id } });

        if (!searchTag) {
            return next(new Error("Questo tag non esiste"));
        }

        const updatedTag = await prisma.tag.update({
            where: { id: parseInt(id) },
            data: {
                title: title
            }
        });

        res.json({ data: updatedTag, comment: "Tag aggiornato correttamente" });

    } catch (error) {
        console.error(error);
        next(error);
    }
};


const destroy = async (req, res, next) => {
    try {
        await prisma.tag.delete({ where: { id: +req.params } });

        res.json({ message: "Tag eliminato correttamente" });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


module.exports = { index, store, update, destroy };
