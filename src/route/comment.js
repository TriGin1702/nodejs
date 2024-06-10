const express = require("express");
const router = express.Router();
const axios = require("axios");
const Handlebars = require('handlebars');
Handlebars.registerHelper('formatDate', function(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-GB');
    return formattedDate;
});
Handlebars.registerHelper('ifEqual', function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    const [id_cmt, id_product] = id.split('-');
    const user = req.session.user || null;
    // Sử dụng id_cmt và id_product theo yêu cầu của bạn
    console.log("id_cmt:", id_cmt);
    console.log("id_product:", id_product);
    if (user === null) {
        return res.redirect("/");
    }
    try {
        await axios.delete(
            `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_COMMENT}/delete/${id_cmt}-${user.id_kh}`
        );
        console.log(user);
        console.log("id_cmt:", id_cmt);
        console.log("id_product:", id_product);
        return res.redirect(`/cmt/${id_product}`);
    } catch (err) {
        console.error(err);
        return res.send("error");
    }
});
router.get("/:id", async(req, res) => {
    const id_product = req.params.id;
    const user = req.session.user || null;
    if (user === null) {
        return res.redirect("/");
    }
    try {
        const listproducts = await axios.get(
            `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_PRODUCT}`
        );
        const listcomments = await axios.get(
            `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_COMMENT}/${id_product}`
        );

        const products = listproducts.data;
        const allcomments = listcomments.data;
        const comments = allcomments.filter((item) => item.id_rep === null);
        const replies = allcomments.filter((item) => item.id_rep !== null);
        const product = products.find((item) => item.id_product == id_product);
        console.log(user);
        const comments_and_replies = comments.map(comment => {
            return {
                ...comment,
                replies: replies.filter(reply => reply.id_rep == comment.id_cmt)
            };
        });
        return res.render("product", {
            product: product,
            user: user,
            comments_and_replies: comments_and_replies,
        });
    } catch (err) {
        console.error(err);
        return res.send("error");
    }
});
router.post("/add_comment", async(req, res) => {
    const user = req.session.user || null;
    const { description, id_product, id_rep } = req.body;
    console.log(description, id_product, id_rep);
    // if (id_rep === undefined) {
    //     id_rep = null;
    // }
    if (user === null) {
        return res.redirect("/");
    }

    try {
        const respond = await axios.post(
            `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_COMMENT}`, { user: user, description: description, id_product: id_product, id_rep: id_rep }
        );
        return res.status(200).send(respond.data.comment);
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Failed to add comment" });
    }
});
module.exports = router;