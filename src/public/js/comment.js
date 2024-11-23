let totalCommentsLoaded = 0; // Số bình luận đã hiển thị
const commentsPerPage = 3; // Số bình luận cần hiển thị mỗi lần
// // Kết nối với `socket.io`
// const socket = io('http://localhost:3000');
const id_socket = document.getElementById("addcmt").value;
const socket = io();
socket.emit("joinRoom", `product_${id_socket}`);
document.getElementById("loadMoreComments").addEventListener("click", loadMoreComments);

function loadMoreComments() {
  const comments = document.querySelectorAll(".comments-list .comment");
  for (let i = totalCommentsLoaded; i < totalCommentsLoaded + commentsPerPage && i < comments.length; i++) {
    comments[i].style.display = "block";
  }
  totalCommentsLoaded += commentsPerPage;

  // Nếu không còn bình luận nào để hiển thị, ẩn nút tải thêm
  if (totalCommentsLoaded >= comments.length) {
    document.getElementById("loadMoreComments").style.display = "none";
  }
}

function findParentElementByClass(element, className) {
  while (element) {
    if (element.classList && element.classList.contains(className)) {
      return element; // Trả về phần tử cha nếu có className
    }
    element = element.parentElement; // Di chuyển lên phần tử cha
  }
  return null; // Trả về null nếu không tìm thấy
}

// Hiển thị 5 bình luận đầu tiên khi trang được tải
window.onload = function () {
  loadMoreComments();
};
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
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Thêm '0' phía trước nếu tháng chỉ có một chữ số
  const day = String(d.getDate()).padStart(2, "0"); // Thêm '0' phía trước nếu ngày chỉ có một chữ số
  return `${day}-${month}-${year}`;
};

function renderComment(event) {
  // Tìm phần tử cha gần nhất chứa phần tử cần chèn
  const commentElement = document.querySelector(".comments-list");
  if (commentElement) {
    // Kiểm tra xem phần tử cha đã có form trả lời chưa
    const replyForm = findParentElementByClass(event.target, "comment-render");
    // console.log(replyForm);
    const replyFormContainer = replyForm.querySelector(".reply-form-container");
    // console.log(commentElement, replyFormContainer);
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
// Lắng nghe sự kiện `new_comment`
socket.on("new_comment", function (comment) {
  const viewcomment = document.querySelector(".comments-list");
  const newComment = `
        <div class="comment border-bottom pb-3 mb-3 form-control" id="cmt-${comment.id_cmt}" style="width:100%;">
            <img class="img-comment" src="/image/${comment.gender}.jpg" alt="" srcset="">
            <span><b>${comment.name}</b></span>
            <span style="float: right;">đã đăng vào ngày ${formatDate(Date.now())}</span>
            <p class="form-control description-comment">${comment.description}</p>
            <ul class="list-option-cmt reply-cmt">
                <li class="reply-Comment" onclick="renderComment(event)" style="margin-right: 12px; margin-bottom:12px;"><i class="bi bi-chat" style="margin-right: 12px;"> Reply</i></li>
            </ul>
        </div>`;
  viewcomment.innerHTML += newComment;
});

async function AddComment() {
  const id_product = document.getElementById("addcmt").value;
  const description = document.getElementById("comment-content").value;
  try {
    await axios.post("/cmt/add_comment", { id_product, description });
  } catch (err) {
    console.error("Error:", err);
  } finally {
    document.getElementById("comment-content").value = "";
  }
}
async function ReplyComment(event) {
  const id_rep = event.target.closest(".reply-form-container").querySelector('input[name="comment_id"]').value;
  const id_product = event.target.closest(".reply-form-container").querySelector('input[name="product_id"]').value;
  const textarea = event.target.closest(".reply-form").querySelector('textarea[name="content"]');
  // console.log(textarea, textarea.value);
  const description = textarea.value;
  // console.log(id_rep, id_product, description);
  try {
    await axios.post("/cmt/add_comment", { id_product, description, id_rep });
    // renderComment(event);
    textarea.value = "";
  } catch (err) {
    console.error("Error:", err);
  }
}
socket.on("reply_comment", (comment) => {
  const commentreply = document.getElementById(`cmt-${comment.id_rep}`);
  const comments = `<div class="reply border-bottom pb-2 mb-2" id="cmt-${comment.id_cmt}" style="width: 96%; margin-right: auto; float:right;">
                <div style="display: inline-flex;">
                    <img src="/image/${comment.gender}.jpg" alt="" srcset="" style="max-width: 56px; max-height: 36px; margin-right: 10px;">
                    <p><b>${comment.name}</b></p>
                </div>
                <span class="text-muted fs-6" style="float: right;">đã trả lời vào ngày: ${formatDate(Date.now())}</span>
                <p>${comment.description}</p>
                <ul class="list-option-cmt reply-cmt" >
                  <li class="reply-Comment" onclick="renderComment(event)" style="margin-right: 12px; margin-bottom:12px;"><i class="bi bi-chat" style="margin-right: 12px;"> Reply</i></li>
                </ul>
            </div>`;
  const reply = commentreply.querySelector(".replies");
  reply.innerHTML += comments;
  // document.querySelector('.reply-form').remove();
  // Đặt lại replied về "false" để cho phép render lại form trả lời
  const replyFormContainer = document.querySelector(".comments-list").querySelector(".reply-form-container");
  replyFormContainer.dataset.replied = "false";
});
// Lắng nghe sự kiện `delete_comment` để xóa bình luận trên client
socket.on("delete_comment", function (id_cmt) {
  const commentdelete = document.getElementById(`cmt-${id_cmt}`);
  if (commentdelete) {
    commentdelete.remove();
  }
});
async function DeleteComment(data1, data2) {
  try {
    await axios.get(`/cmt/delete/${data1}-${data2}`);
    const commentdelete = document.getElementById(`cmt-${data1}`);
    commentdelete.remove();
    // window.location.reload();
  } catch (err) {
    console.error("Error:", err);
  }
}
