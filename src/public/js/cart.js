function isValidName(name) {
  // Kiểm tra xem tên không chứa số
  return /^[^\d]+$/.test(name);
}

function isValidPhoneNumber(phoneNumber) {
  // Kiểm tra xem số điện thoại có đủ 10 số không
  return /^\d{10}$/.test(phoneNumber);
}

function isValidAddress(address) {
  // Kiểm tra xem địa chỉ có chứa cả chữ cái và số không
  return /[a-zA-Z]/.test(address) && /\d/.test(address);
}

function Payment({}) {
  const main = document.querySelector('#pay');
  const Payment = document.createElement('div');
  Payment.onclick = function (e) {
    if (e.target.closest('.close')) {
      main.removeChild(Payment);
    }
  };
  Payment.innerHTML = `<div
class="notify"
style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center;"
>
<div
  class="notify_overlay"
  style="background-color: rgba(0, 0, 0, 0.4); width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;"
>
  <div
    class="notify_body"
    style="display: block; width: 40%; height: 50%; background-color:aliceblue; border-radius: 4px; border: 1px solid black; padding: 20px;  position: relative;"
  >
    <button class="close"
      style="position: absolute; top:0; right:0; background-color:red; border-radius: 4px; border: 1px solid black"
    ><i class="bi bi-x-lg" style="color: aliceblue;"></i></button>
    <form class="row g-3" id="paymentForm">
      <div class="col-md-6">
        <label for="validationDefault01" class="form-label">First name</label>
        <input
          type="text"
          class="form-control"
          id="validationDefault01"
          required
        />
      </div>

      <div class="col-md-6">
        <label for="validationDefault02" class="form-label">Phone Number</label>
        <input
          type="text"
          class="form-control"
          id="validationDefault02"
          required
        />
      </div>
      <div
        style="display: flex; justify-content:center; align-items:center; width: 100%; height: 100%"
      >
        <div class="col-md-3" style=" margin: 12px 0">
          <label
            for="validationDefault03"
            class="form-label"
            style="display: block;"
          >City</label>
          <select class="form-select" id="validationDefault03" required>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Quảng Ngãi">Quảng Ngãi</option>
          </select>
        </div>
        <div class="col-md-3" style=" margin: 12px 0">
          <label
            for="validationDefault04"
            class="form-label"
            style="display: block;"
          >District</label>
          <select class="form-select" id="validationDefault04" required>
            <option value="Quận 1">Quận 1</option>
            <option value="Quận 12">Quận 12</option>
            <option value="Quận 10">Quận 10</option>
          </select>
        </div>
        <div class="col-md-6" style=" margin: 12px 0">
          <label for="validationDefault05" class="form-label">Address</label>
          <input type="text" class="form-control" id="validationDefault05" required />
        </div>

      </div>
      <div
        class="col-12"
        style="display: inline-flex; justify-content:stretch; align-items:center; width: 100%; margin: 12px 0"
      >
        <label
          class="form-check-label"
          for="invalidCheck2"
          style="margin-right:12px;"
        >
          Choose your Payment
        </label>
        <div class="form-check form-check-inline" style="margin: 0 12px;">
          <img
            src="/image/momo.png"
            alt=""
            srcset=""
            style="width: 100%; height: 36px;"
          />
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio1"
            value="option1"
          />
        </div>
        <div class="form-check form-check-inline" style="margin: 0 12px;">
          <img
            src="/image/vnpay.png"
            alt=""
            srcset=""
            style="width: 100%; height: 36px;"
          />
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio2"
            value="option2"
          />
        </div>
        <div class="form-check form-check-inline" style="margin: 0 12px;">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio3"
            value="option3"
            checked
          />
          <label
            class="form-check-label"
            for="inlineRadio3"
            style="padding-bottom: 2px;"
          >Thanh toán khi nhận hàng</label>
        </div>
      </div>
      <div class="col-12">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="invalidCheck2"
            required
            checked
          />
          <label class="form-check-label" for="invalidCheck2">
            Agree to terms and conditions
          </label>
        </div>
      </div>
      <div
        class="col-12"
        style="display: flex; justify-content: flex-end; margin-top:12px;"
      >
        <button class="btn btn-primary" type="button" onclick="submitPayment()">Submit form</button>
      </div>
    </form>
  </div>
</div>
</div>
`;
  main.appendChild(Payment);
}

var checkedProducts = [];

function showPayment() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest('tr');
      const idProduct = row.querySelector("input[name='id_product']").value;
      const index = checkedProducts.indexOf(idProduct);
      if (index === -1) {
        // Nếu sản phẩm chưa có trong danh sách, thêm vào
        checkedProducts.push(idProduct);
      } else {
        // Nếu sản phẩm đã có trong danh sách, loại bỏ khỏi danh sách
        checkedProducts.splice(index, 1);
      }
    }
  });

  if (checkedProducts.length > 0) {
    Payment({ checkedProducts });
  } else {
    alert('Please select at least one product to proceed with payment.');
  }
}

async function submitPayment() {
  const name = document.querySelector('#validationDefault01').value;
  const phoneNumber = document.querySelector('#validationDefault02').value;
  const city = document.querySelector('#validationDefault03').value;
  const district = document.querySelector('#validationDefault04').value;
  const address = document.querySelector('#validationDefault05').value;
  // Lấy giá trị của phương thức thanh toán được chọn
  // const paymentMethod = document.querySelector(
  //   'input[name="paymentMethod"]:checked'
  // ).value;
  console.log(checkedProducts);
  if (checkedProducts.length > 0) {
    const data = {
      name,
      phoneNumber,
      city,
      district,
      address,
      checkedProducts,
    };
    // Gửi dữ liệu đi sử dụng Axios
    if (
      isValidAddress(address) &&
      isValidPhoneNumber(phoneNumber) &&
      isValidName(name)
    ) {
      await axios
        .post('/cart/address', data)
        .then((response) => {
          // console.log(response.data);
          alert('Payment successful!');
          checkedProducts.length = 0;
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          alert(
            'An error occurred while processing your payment. Please try again later.'
          );
        });
    } else {
      alert('Xin hãy nhập đúng các thông tin !');
    }
  }
}
async function updateQuantity(data) {
  try {
    const response = await axios.post('/cart/quantity', data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
    if (error.response) {
      // Nếu có phản hồi từ server và có mã lỗi
      alert(
        'An error occurred while updating quantity: ' +
          error.response.data.message
      );
    } else {
      // Nếu không có phản hồi từ server hoặc không có mã lỗi
      alert(
        'An error occurred while updating quantity. Please try again later.'
      );
    }
  }
}

function increaseQuantity(event) {
  const row = event.target.closest('tr');
  const quantity = row.querySelector("input[type='number']").value;
  const idProduct = row.querySelector("input[name='id_product']").value;
  updateQuantity({ idProduct, quantity }); // Gọi hàm để cập nhật số lượng, truyền brand, name và số lượng mới
}
