function resetSearch() {
  // Gửi yêu cầu đến server để đặt req.app.locals.search thành false
  fetch("/news/reset-search", { method: "POST" })
    .then((response) => {
      // Xử lý phản hồi từ server (nếu cần)
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
