const form = document.getElementById('searchForm');
// Lắng nghe sự kiện "submit" của form
form.addEventListener('submit', function(event) {
    // Ngăn chặn hành vi mặc định của form
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');

    var currentUrl = window.location.href;
    var baseUrl = currentUrl.split('?')[0]; // Lấy phần URL cơ bản, bỏ qua phần query string
    window.location.href = baseUrl + '?search=' + searchInput.value;
});
// form.addEventListener("submit", function (event) {
//   event.preventDefault();

//   const searchInput = document.getElementById("searchInput");
//   let currentUrl = window.location.href;

//   // Loại bỏ tất cả các query string liên quan đến tìm kiếm nếu chúng tồn tại trong URL
//   const url = new URL(currentUrl);
//   url.searchParams.delete("search");
//   url.searchParams.delete("sort");
//   // Thêm tham số tìm kiếm mới vào URL
//   url.searchParams.set("search", searchInput.value);

//   // Chuyển hướng đến URL mới
//   window.location.href = url.toString();
// });