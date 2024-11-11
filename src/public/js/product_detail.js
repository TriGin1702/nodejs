// Hàm toast để hiển thị thông báo
function toast({ title = '', message = '', type = 'info', duration = 3000 }) {
    const main = document.getElementById('toast');
    if (main) {
        const toast = document.createElement('div');

        // Xóa tự động toast
        const autoRemoveId = setTimeout(function() {
            main.removeChild(toast);
        }, duration + 1000);

        // Xóa toast khi được nhấp
        toast.onclick = function(e) {
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: 'bi bi-check-circle-fill',
            info: 'bi bi-info-circle-fill',
            warning: 'bi bi-exclamation-circle-fill',
            error: 'bi bi-bug-fill',
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add('toast', `toast--${type}`);
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

// Hàm xử lý khi nhấn vào nút thêm vào giỏ hàng
async function showSuccessToast(event) {
    event.preventDefault();

    // Lấy thông tin sản phẩm
    const input = event.target
        .closest('.figure-product')
        .querySelector("input[name='id_product']");

    if (input) {
        const idProduct = input.value;
        const formData = new FormData();
        formData.append('idProduct', idProduct);

        try {
            // Gửi dữ liệu sử dụng Axios
            const response = await axios.post('/cart', formData);

            // Xử lý phản hồi thành công
            if (response.data) {
                toast({
                    title: 'Thành công!',
                    message: 'Bạn đã thêm sản phẩm vào giỏ hàng thành công!',
                    type: 'success',
                    duration: 5000,
                });
            }
        } catch (error) {
            // Xử lý lỗi
            console.error('Đã xảy ra lỗi khi gửi dữ liệu tới /cart:', error);
            toast({
                title: 'Lỗi!',
                message: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau!',
                type: 'error',
                duration: 5000,
            });
        }
    } else {
        console.error("Không tìm thấy phần tử input[name='id_product']");
    }
}