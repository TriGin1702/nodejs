function sortproducts() {
  var selectedValue = document.getElementById("sortingSelect").value;
  var currentUrl = window.location.href;
  var baseUrl = currentUrl.split("?")[0]; // Lấy phần URL cơ bản, bỏ qua phần query string

  // Loại bỏ query string hiện tại nếu nó đã tồn tại trong URL
  if (currentUrl.includes("sort=top") || currentUrl.includes("sort=down")) {
    currentUrl = currentUrl.split("?")[0];
  }
  // Tạo query string dựa trên giá trị được chọn
  var queryString = currentUrl.includes("?") ? "&" : "?";

  // Tạo URL mới bằng cách thêm query string dựa trên giá trị được chọn
  if (selectedValue === "top") {
    window.location.href = baseUrl + queryString + "sort=top";
  } else if (selectedValue === "down") {
    window.location.href = baseUrl + queryString + "sort=down";
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

async function showSuccessToast(event) {
  event.preventDefault();

  // Lấy thông tin sản phẩm
  const inputone = event.target.closest(".col-3");

  if (inputone) {
    const nameElement = inputone.querySelector(".card-title");
    const brandElement = inputone.querySelector("h5");

    if (nameElement && brandElement) {
      const name = nameElement.textContent.trim();
      const brand = brandElement.textContent.split(":")[1].trim();
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);

      console.log("Brand:", brand, "Name:", name);

      try {
        // Gửi dữ liệu sử dụng Axios
        const response = await axios.post("/cart", formData);

        // Xử lý phản hồi thành công
        console.log("Dữ liệu đã được gửi thành công tới /cart");
        if (response.data) {
          toast({
            title: "Thành công!",
            message: "Bạn đã thêm sản phẩm vào giỏ hàng thành công!",
            type: "success",
            duration: 5000,
          });
        }
      } catch (error) {
        // Xử lý lỗi
        console.error("Đã xảy ra lỗi khi gửi dữ liệu tới /cart:", error);
        toast({
          title: "Lỗi!",
          message:
            "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau!",
          type: "error",
          duration: 5000,
        });
      }
    } else {
      console.error("Không tìm thấy phần tử 'card-title' hoặc 'h5'");
    }
  } else {
    console.error("Không tìm thấy phần tử cha với class 'col-3'");
  }
}
