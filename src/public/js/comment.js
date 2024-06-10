let totalCommentsLoaded = 0; // Số bình luận đã hiển thị
const commentsPerPage = 3; // Số bình luận cần hiển thị mỗi lần

document.getElementById('loadMoreComments').addEventListener('click', loadMoreComments);

function loadMoreComments() {
    const comments = document.querySelectorAll('.comments-list .comment');
    for (let i = totalCommentsLoaded; i < totalCommentsLoaded + commentsPerPage && i < comments.length; i++) {
        comments[i].style.display = 'block';
    }
    totalCommentsLoaded += commentsPerPage;

    // Nếu không còn bình luận nào để hiển thị, ẩn nút tải thêm
    if (totalCommentsLoaded >= comments.length) {
        document.getElementById('loadMoreComments').style.display = 'none';
    }
}

// Hiển thị 5 bình luận đầu tiên khi trang được tải
window.onload = function() {
    loadMoreComments();
}
const cmt = `
<div class="reply-form ms-4 mt-3" style="min-width: 88%; max-width: 92%;float:right; margin-top:0px;">
    <div class="mb-3">
        <label for="reply-content" class="form-label fs-6"><b>Trả lời</b></label>
        <textarea name="content" class="form-control" rows="2" required></textarea>
    </div>
    <button type="submit" class="btn btn-outline-secondary btn-sm" style="float: right; margin-right:12px;margin-bottom:20px;" onclick="ReplyComment(event)">Gửi</button>
</div>
`;
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Thêm '0' phía trước nếu tháng chỉ có một chữ số
    const day = String(d.getDate()).padStart(2, '0'); // Thêm '0' phía trước nếu ngày chỉ có một chữ số
    return `${day}-${month}-${year}`;
};

function renderComment(event) {
    // Tìm phần tử cha gần nhất chứa phần tử cần chèn
    const commentElement = event.target.closest(".comments-list");
    if (commentElement) {
        // Kiểm tra xem phần tử cha đã có form trả lời chưa
        const replyFormContainer = commentElement.querySelector(
            ".reply-form-container"
        );
        // Hiển thị form trả lời nếu chưa trả lời hoặc đã trả lời nhưng được đặt lại về "false"
        if (replyFormContainer.dataset.replied !== "true") {
            // Tạo một đối tượng HTML từ chuỗi HTML cmt
            const tempDiv = document.createElement("div");
            tempDiv.className = "reply-div";
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
        await axios.post('/cmt/add_comment', { id_product, description })
            .then(function(response) {
                console.log(response);
                const viewcomment = document.querySelector('.comments-list');
                const comment = `<div class="comment border-bottom pb-3 mb-3 form-control" id="cmt-${response.data.id_cmt}" style="width:100%;">
                                    <!-- Hiển thị thông tin của người dùng -->
                                        <img class="img-comment" src="/image/${response.data.gender}.jpg" alt="" srcset="">
                                        <span><b>${response.data.name}</b></span>
                                        <span style="float: right;">đã đăng vào ngày ${formatDate(Date.now())}</span>
                                        <p class="form-control description-comment">${response.data.description}</p>
                                    <ul class="list-option-cmt reply-cmt">
                                        <li onclick="DeleteComment(${response.data.id_cmt}, ${response.data.id_product})" style="cursor:pointer;"><i class="bi bi-trash3" style="margin-right: 12px;"> Remove</i></li>
                                    </ul>
                                </div>`;
                viewcomment.innerHTML += comment;
            });
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
        const respond = await axios.post('/cmt/add_comment', { id_product, description, id_rep });
        const commentreply = document.getElementById(`cmt-${id_rep}`);
        const comment = `<div class="reply border-bottom pb-2 mb-2" id="cmt-${respond.data.id_cmt}" style="width: 96%; margin-right: auto; float:right;">
                        <div style="display: inline-flex;">
                            <img src="/image/${respond.data.gender}.jpg" alt="" srcset="" style="max-width: 56px; max-height: 36px; margin-right: 10px;">
                            <p><b>${respond.data.name}</b></p>
                        </div>
                        <span class="text-muted fs-6" style="float: right;">đã trả lời vào ngày: ${formatDate(Date.now())}</span>
                        <p>${respond.data.description}</p>
                        <ul class="list-option-cmt reply-cmt" >
                          <li onclick="DeleteComment('${respond.data.id_cmt}', '${respond.data.id_product}')" style="margin-right: 12px; margin-bottom:12px; cursor:pointer;"><i class="bi bi-trash3" style="margin-right: 12px;"> Remove</i></li>
                        </ul>
                    </div>`;
        const reply = commentreply.querySelector('.replies');
        reply.innerHTML += comment;
        document.querySelector('.reply-form').remove();
        // Đặt lại replied về "false" để cho phép render lại form trả lời
        const replyFormContainer = document.querySelector(".comments-list").querySelector(".reply-form-container");
        replyFormContainer.dataset.replied = "false";

        // Gọi lại hàm renderComment để kiểm tra xem form trả lời có cần hiển thị lại không
        renderComment(event);
    } catch (err) {
        console.error('Error:', err);
    }
}
async function DeleteComment(data1, data2) {
    try {
        await axios.get(`/cmt/delete/${data1}-${data2}`);
        const commentdelete = document.getElementById(`cmt-${data1}`);
        commentdelete.remove();
        // window.location.reload();
    } catch (err) {
        console.error('Error:', err);
    }
}