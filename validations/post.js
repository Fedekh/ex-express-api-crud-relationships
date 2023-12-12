module.exports = {
    title: {
        in: ["body"],
        isString: true,
        notEmpty: {
            errorMessage: "non puo essere vuoto",
            bail:true //blocca tutto
        },
    },
    content: {
        in: ["body"],
        isString: true,
        notEmpty: true,
    },
}