function sortproducts() {
  var selectedValue = document.getElementById("sortingSelect").value;
  var currentUrl = window.location.href;
  // var baseUrl = currentUrl.split("?")[0]; // Lấy phần URL cơ bản, bỏ qua phần query string

  // Loại bỏ query string hiện tại nếu nó đã tồn tại trong URL
  if (currentUrl.includes("?sort=top") || currentUrl.includes("&sort=top")) {
    currentUrl = currentUrl.replace("?sort=top", "");
    currentUrl = currentUrl.replace("&sort=top", "");
  }
  if (currentUrl.includes("?sort=down") || currentUrl.includes("&sort=down")) {
    currentUrl = currentUrl.replace("?sort=down", "");
    currentUrl = currentUrl.replace("&sort=down", "");
  }
  // Tạo query string dựa trên giá trị được chọn
  var queryString = currentUrl.includes("?") ? "&" : "?";

  // Tạo URL mới bằng cách thêm query string dựa trên giá trị được chọn
  if (selectedValue === "top") {
    window.location.href = currentUrl + queryString + "sort=top";
  } else if (selectedValue === "down") {
    window.location.href = currentUrl + queryString + "sort=down";
  }
}

// Toast function
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
  const main = document.getElementById("toast");
  if (main) {
    const toast = document.createElement("div");

    // Auto remove toast
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 1000);

    // Remove toast when clicked
    toast.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: "bi bi-check-circle-fill",
      info: "bi bi-info-circle-fill",
      warning: "bi bi-exclamation-circle-fill",
      error: "bi bi-bug-fill",
    };
    const icon = icons[type];
    const delay = (duration / 1000).toFixed(2);

    toast.classList.add("toast", `toast--${type}`);
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

    toast.innerHTML = `
                    <div class="toast__icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="toast__body">
                        <h3 class="toast__title">${title}</h3>
                        <p class="toast__msg">${message}</p>
                    </div>
                    <div class="toast__close">
                        <i class="bi bi-x-lg"></i>
                    </div>
                `;
    main.appendChild(toast);
  }
}
const numbergoods = document.getElementById("numbergoods");
async function showSuccessToast(event) {
  event.preventDefault();

  // Lấy thông tin sản phẩm
  const inputone = event.target.closest(".col-3");

  if (inputone) {
    const idProductElement = inputone.querySelector("input[name='id_product']");
    console.log(idProductElement.value);
    if (idProductElement) {
      const idProduct = idProductElement.value;
      const formData = new FormData();
      formData.append("idProduct", idProduct);

      console.log("ID Product:", idProduct);

      try {
        // Gửi dữ liệu sử dụng Axios
        const response = await axios.post("/cart", formData);
        if (response.data) {
          var goods = parseInt(numbergoods.value, 10);
          goods = goods + 1;
          toast({
            title: "Thành công!",
            message: "Bạn đã thêm sản phẩm vào giỏ hàng thành công!",
            type: "success",
            duration: 5000,
          });
          numbergoods.value = goods;
          // Xử lý phản hồi thành công
          console.log(" goods:", goods);
          console.log("Dữ liệu đã được gửi thành công tới /cart");
        }
      } catch (error) {
        // Xử lý lỗi
        console.error("Đã xảy ra lỗi khi gửi dữ liệu tới /cart:", error);
        toast({
          title: "Lỗi!",
          message: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau!",
          type: "error",
          duration: 5000,
        });
      }
    } else {
      console.error("Không tìm thấy phần tử input[name='id_product']");
    }
  } else {
    console.error("Không tìm thấy phần tử cha với class 'col-3'");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const images = ["/image/cuahang1.jpg", "/image/cuahang2.jpg", "/image/cuahang3.jpg", "/image/cuahang4.jpg"];
  const slide = document.querySelector("#slide");
  let currentSlide = 0;

  // Hàm nextSlide sẽ được gọi sau mỗi 3 giây
  function nextSlide() {
    const nextIndex = currentSlide + 1 < images.length ? currentSlide + 1 : 0;
    slide.style.opacity = 0; // Tạm thời ẩn slide hiện tại
    setTimeout(function () {
      slide.src = images[nextIndex]; // Thay đổi ảnh của slide
      slide.style.opacity = 1; // Hiển thị slide mới
    }, 800); // Delay để đảm bảo slide đã ẩn hoàn toàn trước khi thay đổi ảnh và hiển thị
    currentSlide = nextIndex;
  }
  setInterval(nextSlide, 3000);
});
