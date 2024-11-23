const express = require("express");
const router = express.Router();
const axios = require("axios");
const Handlebars = require("handlebars");
// const io = require("../index");
Handlebars.registerHelper("formatDate", function (date) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB");
  return formattedDate;
});

// io.on('connection', (socket) => {
//     console.log('A user connected');

//     // Xử lý các sự kiện khác tại đây
//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const [id_cmt, id_product] = id.split("-");
  const user = req.session.user || null;
  const token = req.cookies.token;
  // Sử dụng id_cmt và id_product theo yêu cầu của bạn
  console.log("id_cmt:", id_cmt);
  console.log("id_product:", id_product);
  if (user === null) {
    return res.redirect("/");
  }
  try {
    await axios.delete(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_COMMENT}/delete/${id_cmt}-${user.id_user}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
      },
    });
    global.io.emit("delete_comment", id_cmt); // Phát id của bình luận đã xóa đến tất cả client
    console.log(user);
    return res.redirect(`/cmt/${id_product}`);
  } catch (err) {
    console.error(err);
    return res.send("error");
  }
});
router.get("/:id", async (req, res) => {
  const id_product = req.params.id;
  const user = req.session.user || null;
  const token = req.cookies.token;
  if (user === null) {
    return res.redirect("/");
  }
  try {
    const listproducts = await axios.get(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_PRODUCT}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
      },
    });
    const listcomments = await axios.get(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_COMMENT}/${id_product}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
      },
    });
    const products = listproducts.data;
    const allcomments = listcomments.data;
    const comments = allcomments.filter((item) => item.id_rep === null);
    const replies = allcomments.filter((item) => item.id_rep !== null);
    const product = products.find((item) => item.id_product == id_product);
    const comments_and_replies = comments.map((comment) => {
      return {
        ...comment,
        replies: replies.filter((reply) => reply.id_rep == comment.id_cmt),
      };
    });
    console.log(product);
    console.log(user);
    console.log(allcomments);
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

router.post("/add_comment", async (req, res) => {
  const user = req.session.user || null;
  const { description, id_product, id_rep } = req.body;
  const token = req.cookies.token;
  console.log(description, id_product, id_rep);

  // Sử dụng một biến khác để lưu giá trị đã xử lý
  const id_rep_processed = id_rep === undefined ? null : id_rep;

  if (user === null) {
    return res.redirect("/");
  }
  try {
    const respond = await axios.post(
      `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_COMMENT}`,
      {
        user: user,
        description: description,
        id_product: id_product,
        id_rep: id_rep_processed, // Truyền biến đã xử lý
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
        },
      }
    );

    // Phát bình luận mới đến tất cả client qua `socket.io`
    if (id_rep_processed === null) {
      global.io.to(`product_${id_product}`).emit("new_comment", respond.data.comment);
    } else {
      global.io.to(`product_${id_product}`).emit("reply_comment", respond.data.comment);
    }

    return res.status(200).send(respond.data.comment);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
});

module.exports = router;
