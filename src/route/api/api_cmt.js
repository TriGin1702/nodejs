const express = require("express");
const connect = require("../../app/control/connect");
const router = express.Router();
const authenticateToken = require("./authenticateToken");
router.get("/:id_product", authenticateToken, async function (req, res) {
  try {
    const { id_product } = req.params;
    const comments = await new Promise((resolve, reject) => {
      connect.query(
        "SELECT user.gender, user.name, comment.* FROM user JOIN comment ON comment.id_user = user.id_user and comment.id_product = ? ORDER BY comment.date DESC;",
        [id_product],
        (error, results) => {
          if (error) {
            console.error("Error processing data:", error);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  } finally {
    // await connect.end();
  }
});
router.delete("/delete/:id", authenticateToken, async function (req, res) {
  const id = req.params.id;
  const [id_cmt, user_id] = id.split("-");
  await new Promise((resolve, reject) => {
    connect.query("CALL DeleteComment(?, ?);", [id_cmt, user_id], (error, results) => {
      if (error) {
        console.error("Error processing data:", error);
        res.status(500).json({ error: "Failed to add comment" });
      } else {
        resolve(results);
      }
    });
  });
  console.log(id_cmt, user_id);
  // await connect.end();
  res.send("Comment deleted successfully");
});

router.post("/", async function (req, res) {
  const { user, id_product, description, id_rep } = req.body;
  const idRepValue = id_rep || null;
  try {
    const result = await new Promise((resolve, reject) => {
      connect.query("CALL AddComment(?, ?, ?, ?);", [user.id_user, id_product, description, idRepValue], (error, results) => {
        if (error) {
          console.error("Error processing data:", error);
          return reject(error); // Reject the promise on error
        } else {
          // Lấy đối tượng bình luận vừa thêm từ kết quả
          const addedComment = {
            id_cmt: results[0][0].last_insert_id,
            gender: user.gender,
            name: user.name,
            id_product: id_product,
            description: description,
            id_rep: idRepValue,
          };
          resolve(addedComment); // Resolve the promise with the added comment
        }
      });
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
    console.error("Error during the add comment operation:", error);
  }
});

module.exports = router;
