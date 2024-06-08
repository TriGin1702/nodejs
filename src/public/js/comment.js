const cmt = `
<div class="reply-form ms-4 mt-3" style="min-width: 88%; max-width: 92%;float:right; margin-top:0px;">
    <div class="mb-3">
        <label for="reply-content" class="form-label fs-6"><b>Trả lời</b></label>
        <textarea name="content" class="form-control" rows="2" required></textarea>
    </div>
    <button type="submit" class="btn btn-outline-secondary btn-sm" style="float: right; margin-right:12px;margin-bottom:20px;" onclick="ReplyComment(event)">Gửi</button>
</div>
`;

function renderComment(event) {
    // Tìm phần tử cha gần nhất chứa phần tử cần chèn
    const commentElement = event.target.closest(".comments-list");
    console.log(event.target);
    console.log(commentElement);
    if (commentElement) {
        // Kiểm tra xem phần tử cha đã có form trả lời chưa
        const replyFormContainer = commentElement.querySelector(
            ".reply-form-container"
        );
        if (!replyFormContainer.dataset.replied) {
            // Tạo một đối tượng HTML từ chuỗi HTML cmt
            const tempDiv = document.createElement("div");
            tempDiv.style.display = "flex";
            tempDiv.style.alignItems = "flex-start";
            tempDiv.style.justifyContent = "flex-end";
            tempDiv.innerHTML = cmt;
            // Chèn form trả lời vào phần tử cha
            replyFormContainer.appendChild(tempDiv);
            // Đánh dấu phần tử cha đã có form trả lời
            replyFormContainer.dataset.replied = "true";
        }
    }
}
async function AddComment() {
    const id_product = document.getElementById('addcmt').value;
    const description = document.getElementById('comment-content').value;
    try {
        await axios.post('/cmt/add_comment', { id_product, description });
        window.location.reload();
    } catch (err) {
        console.error('Error:', err);
    }
}
async function ReplyComment(event) {
    const id_rep = event.target.closest('.reply-form-container').querySelector('input[name="comment_id"]').value;
    const id_product = event.target.closest('.reply-form-container').querySelector('input[name="product_id"]').value;
    const description = event.target.closest('.reply-form').querySelector('textarea[name="content"]').value;
    console.log(id_rep, id_product, description);
    try {
        await axios.post('/cmt/add_comment', { id_product, description, id_rep });
        window.location.reload();
    } catch (err) {
        console.error('Error:', err);
    }
}
async function DeleteComment(data1, data2) {
    try {
        await axios.get(`/cmt/delete/${data1}-${data2}`);
        window.location.reload();
    } catch (err) {
        console.error('Error:', err);
    }
}