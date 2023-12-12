const { PrismaClient } = require("@prisma/client");
const slugify = require("slugify");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");
const errorHandler = require("../middleware/errorHandler");


const index = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;


        const total = await prisma.post.count();
        const totalPages = Math.ceil(total / +pageSize);

        const data = await prisma.post.findMany({
            take: +pageSize,
            skip: (+page - 1) * +pageSize,
            include: {
                category: { select: { title: true } },
                tags: { select: { title: true } }
            }
        });

        res.json({
            currentPage: +page,
            totalPages: totalPages,
            totalResult:total,
            data: data
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};



const show = async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await prisma.post.findUnique({
            where: { slug: slug },
            include: {
                category: { select: { title: true } },
                tags: { select: { title: true } }
            }
        });

        if (!data) {
            res.status(404).send("Risorsa non trovata");
        } else {
            res.json(data);
        }

    } catch (e) {
        res.status(500).send("Errore server interno");
    }
};



const store = async (req, res, next) => {
    try {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            console.log(validation);
            return next(new Error(errorHandler));
        }


        const { title, content, image, published, category, tags } = req.body;

        // Verifica se la categoria esiste
        const existingCategory = await prisma.category.findUnique({
            where: { id: category }
        });

        if (!existingCategory) {
            return next(new Error("La categoria specificata non esiste"));
        }


        // Verifica se i tag esistono
        const tagEsistenti = await prisma.tag.findMany({
            where: { id: { in: tags } }
        });

        const missingTags = tags.filter(tag => !tagEsistenti.some(existingTag => existingTag.id === tag));

        if (missingTags.length > 0) {
            return next(new Error(`I seguenti tag non esistono: ${missingTags.join(', ')}`));
        }


        // Crea il nuovo post connettendo la categoria
        const newPost = await prisma.post.create({
            data: {
                title: title,
                slug: slugify(title, { lower: true }),
                image: image,
                content: content,
                published: published,
                category: {
                    connect: { id: category }
                },
                tags: {
                    connect: tagEsistenti.map(tag => ({ id: tag.id }))
                }
            }
        });

        res.json({ data: newPost, comment: "Post creato correttamente" });
    } catch (e) {
        console.error(e);
        if (!res.headersSent) {
            res.status(500).json("Si è verificato un errore durante la creazione del post");
        }
    }
};






const update = async (req, res) => {
    try {
        const { title, image, content, published } = req.body;
        const { slug } = req.params;

        const postUpdate = await prisma.post.findUnique({
            where: { slug: slug }
        });

        if (!postUpdate) {
            res.status(404).send("Risorsa non trovata");
        } else {

            const updatedPost = await prisma.post.update({
                data: {
                    title: title,
                    slug: slugify(title, { lower: true }),
                    image: image,
                    content: content,
                    published: published,
                },
                where: {
                    slug: slug
                }
            });

            res.json(`Post ${updatedPost.title} modificato correttamente`);

        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Errore server interno");
    }
};


const destroy = async (req, res) => {
    //prima gestisce da solo l'esistenza della risorsa
    try {
        const deletePost = await prisma.post.delete({
            where: {
                slug: req.params.slug
            }
        });

        res.json(`Post ${deletePost.title} eliminato correttamente`);
    } catch (e) {
        console.error(e);
        res.status(500).send("Errore server interno");
    }
};


module.exports = { index, show, store, update, destroy };