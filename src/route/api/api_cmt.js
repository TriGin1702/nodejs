const express = require("express");
const connect = require("../../app/control/connect");
const router = express.Router();
router.get("/:id_product", async function(req, res) {
    try {
        const { id_product } = req.params;
        const comments = await new Promise((resolve, reject) => {
            connect.query(
                "SELECT customer.gender, customer.name, comment.* FROM customer JOIN comment ON comment.id_kh = customer.id_kh and comment.id_product = ? ORDER BY comment.date DESC;", [id_product],
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
    }
});
router.delete("/delete/:id", async function(req, res) {
    const id = req.params.id;
    const [id_cmt, user_id] = id.split('-');
    await new Promise((resolve, reject) => {
        connect.query(
            "CALL DeleteComment(?, ?);", [id_cmt, user_id],
            (error, results) => {
                if (error) {
                    console.error("Error processing data:", error);
                    res.status(500).json({ error: "Failed to add comment" });
                } else {
                    resolve(results);
                }
            }
        );
    })

    res.send("Comment deleted successfully");
});

router.post("/", function(req, res) {
    const { user_id, id_product, description, id_rep } = req.body;
    const idRepValue = id_rep || null;
    connect.query(
        "CALL AddComment(?, ?, ?, ?);", [user_id, id_product, description, idRepValue],
        (error, results) => {
            if (error) {
                console.error("Error processing data:", error);
                res.status(500).json({ error: "Failed to add comment" });
            } else {
                res.status(201).json({
                    message: "Comment added successfully",
                });
            }
        }
    );
});

module.exports = router;