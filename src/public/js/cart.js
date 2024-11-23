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
async function Payment({}) {
  const main = document.querySelector("#pay");
  const Payment = document.createElement("div");
  Payment.onclick = function (e) {
    if (e.target.closest(".close")) {
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
        style="display: block; width: 40%; background-color:aliceblue; border-radius: 4px; border: 1px solid black; padding: 20px;  position: relative;"
      >
        <button class="close" style="position: absolute; top:0; right:0; background-color:red; border-radius: 4px; border: 1px solid black"><i
            class="bi bi-x-lg"
            style="color: aliceblue;"
          ></i></button>
        <form class="row g-3" id="PaymentForm">
          <div class="col-md-6">
            <label for="validationDefault01" class="form-label">First name</label>
            <select class="form-select" id="users_address" required>
              <option value="0" selected>Nhập địa chỉ mới</option>
            </select>
            <input type="text" class="form-control" id="validationDefault01" required />
          </div>
          <div class="col-md-6">
            <label for="validationDefault02" class="form-label">Phone Number</label>
            <input type="text" class="form-control" id="validationDefault02" required />
          </div>
          <div style="display: flex; justify-content:center; align-items:center; width: 100%; height: 100%">
            <div class="col-md-3" style=" margin: 12px 0">
              <label for="validationDefault03" class="form-label" style="display: block;">City</label>
              <select class="form-select" id="validationDefault03" required>
                <option disabled selected>Chose your City</option>
              </select>
            </div>
            <div class="col-md-3" style=" margin: 12px 0">
              <label for="validationDefault04" class="form-label" style="display: block;">District</label>
              <select class="form-select" id="validationDefault04" required>
              </select>
            </div>
            <div class="col-md-6" style=" margin: 12px 0">
              <label for="validationDefault05" class="form-label">Address</label>
              <input type="text" class="form-control" id="validationDefault05" required />
            </div>

          </div>
          <div class="col-12" style="display: inline-flex; justify-content:stretch; align-items:center; width: 100%; margin: 12px 0">
            <label class="form-check-label" for="invalidCheck2" style="margin-right:12px;">
              Choose your Payment
            </label>
            <div class="form-check form-check-inline" style="margin: 0 12px;">
              <select class="form-select" id="select_payment" required>
              </select>
            </div>
            
          </div>
          
          <div class="col-12" style="display: inline-flex; justify-content:stretch; align-items:center; width: 100%; margin: 12px 0" >
            <div id="selectedProducts" style="margin-top: 20px;"></div>
          </div>
          <div class="col-12" style="display: flex; justify-content: flex-end; margin-top:12px;">
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

async function showPayment(citys, user_address, payment) {
  checkedProducts = document.querySelectorAll('td input[type="checkbox"]:checked');
  console.log(checkedProducts); // Kiểm tra các checkbox đã chọn

  if (checkedProducts.length > 0) {
    // Tạo mảng chứa thông tin của các sản phẩm đã được chọn
    const selectedProducts = Array.from(checkedProducts).map((checkbox) => {
      const row = checkbox.closest("tr"); // Tìm dòng chứa checkbox
      const id_cart = row.querySelector('input[name="id_cart"]').value; //
      const quantity = row.querySelector('input[type="number"]').value; // Lấy quantity
      return { id_cart, quantity }; // Trả về đối tượng chứa thông tin sản phẩm
    });

    console.log(selectedProducts); // Kiểm tra các sản phẩm đã chọn

    // Gọi hàm Payment và truyền mảng selectedProducts
    Payment({ selectedProducts });

    const selectElement = document.getElementById("validationDefault03");
    const selectuser = document.getElementById("users_address");
    const paymentSelect = document.getElementById("select_payment");
    // Thêm các option từ mảng city
    citys.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.id_city;
      option.textContent = city.name;
      selectElement.appendChild(option);
    });

    // Thêm sự kiện onchange để gọi hàm district khi chọn city
    selectElement.onchange = function () {
      const selectedCityId = selectElement.value;
      if (selectedCityId) {
        district(selectedCityId); // Gọi hàm district với id_city
      }
    };

    // Thêm các option từ mảng user_address
    if (Array.isArray(user_address) && user_address.length > 0) {
      user_address.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.id_useraddress;
        option.textContent = user.name;
        selectuser.appendChild(option);
      });
    }
    // Thêm các option cho payment
    if (Array.isArray(payment) && payment.length > 0) {
      payment.forEach((pay) => {
        const option = document.createElement("option");
        option.value = pay.id_pay;
        option.textContent = pay.name_pay;
        paymentSelect.appendChild(option);
      });
    }
    // Thêm sự kiện onchange để gọi hàm district khi chọn user
    selectuser.onchange = function () {
      const selecteduserId = selectuser.value;
      const selecteduser = user_address.find((user) => user.id_useraddress === parseInt(selecteduserId));

      if (selecteduser) {
        // Điền thông tin vào các ô nhập liệu
        document.querySelector("#validationDefault01").value = selecteduser.name;
        document.querySelector("#validationDefault02").value = selecteduser.phone;
        document.querySelector("#validationDefault05").value = selecteduser.ip_address;
        const citySelect = document.querySelector("#validationDefault03");
        const cityOption = Array.from(citySelect.options).find((option) => option.textContent === selecteduser.city_name);
        if (cityOption) {
          citySelect.value = cityOption.value;
        }

        district(selecteduser.id_city).then(() => {
          const districtSelect = document.querySelector("#validationDefault04");
          const districtOption = Array.from(districtSelect.options).find((option) => option.textContent === selecteduser.district_name);
          if (districtOption) {
            districtSelect.value = districtOption.value;
          }
        });
      } else {
        document.querySelector("#validationDefault01").value = "";
        document.querySelector("#validationDefault02").value = "";
        document.querySelector("#validationDefault05").value = "";
      }
    };
  } else {
    alert("Vui lòng chọn ít nhất một sản phẩm để nhập.");
  }
}

async function district(id_city) {
  try {
    // Gửi request đến API để lấy danh sách district theo city_id
    const response = await axios.get(`/homepage/district/${id_city}`);
    console.log(response);
    const districts = response.data; // Giả sử dữ liệu trả về là một mảng districts
    console.log(districts);
    const selectElement = document.getElementById("validationDefault04");

    // Xóa tất cả option cũ
    selectElement.innerHTML = "";

    // Thêm option mặc định "Choose your District"
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Chose your District";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    // Thêm các option quận
    districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district.id_district;
      option.textContent = district.name;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert("An error occurred while processing your Payment. Please try again later.");
  }
}

// Gửi thông tin thanh toán lên server
async function submitPayment() {
  const name = document.getElementById("validationDefault01").value.trim();
  const phone = document.getElementById("validationDefault02").value.trim();
  // const city = document.getElementById("validationDefault03").value;
  const district = document.getElementById("validationDefault04").value;
  const address = document.getElementById("validationDefault05").value.trim();
  const payment = parseInt(document.querySelector("#select_payment").value);
  const user_address = parseInt(document.getElementById("users_address").value);
  // Kiểm tra hợp lệ thông tin
  if (!isValidName(name)) {
    alert("Tên không hợp lệ. Vui lòng kiểm tra lại.");
    return;
  }
  if (!isValidPhoneNumber(phone)) {
    alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.");
    return;
  }
  if (!district) {
    alert("Vui lòng chọn Thành phố và Quận/Huyện.");
    return;
  }
  if (!isValidAddress(address)) {
    alert("Địa chỉ không hợp lệ. Vui lòng kiểm tra lại.");
    return;
  }
  console.log(name, phone, district, payment);
  // Xử lý danh sách sản phẩm được chọn
  const selectedProducts = Array.from(checkedProducts).map((checkbox) => {
    const row = checkbox.closest("tr"); // Tìm dòng chứa checkbox
    const id_cart = row.querySelector('input[name="id_cart"]').value; //
    const quantity = row.querySelector('input[type="number"]').value; // Lấy quantity
    return { id_cart, quantity }; // Trả về đối tượng chứa thông tin sản phẩm
  });

  if (selectedProducts.length === 0) {
    alert("Vui lòng chọn ít nhất một sản phẩm.");
    return;
  }
  try {
    // Gửi dữ liệu thanh toán lên server
    const response = await axios.post("/cart/address", {
      user_address,
      name,
      phone,
      // city,
      district,
      address,
      payment,
      products: selectedProducts,
    });

    if (response.data.success) {
      alert("Thanh toán thành công!");
      window.location.reload(); // Tải lại trang
    } else {
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
  }
}
async function updateQuantity(data) {
  try {
    const response = await axios.post("/cart/quantity", data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
    if (error.response) {
      // Nếu có phản hồi từ server và có mã lỗi
      alert("An error occurred while updating quantity: " + error.response.data.message);
    } else {
      // Nếu không có phản hồi từ server hoặc không có mã lỗi
      alert("An error occurred while updating quantity. Please try again later.");
    }
  }
}

function increaseQuantity(event) {
  const row = event.target.closest("tr");
  const quantity = row.querySelector("input[type='number']").value;
  const id_cart = row.querySelector("input[name='id_cart']").value;
  updateQuantity({ id_cart, quantity }); // Gọi hàm để cập nhật số lượng, truyền brand, name và số lượng mới
}
// Thêm spinner khi đợi API
// async function district(id_city) {
//   try {
//     const response = await axios.get(`/homepage/district/${id_city}`);
//     const districts = response.data;

//     const selectElement = document.getElementById("validationDefault04");
//     selectElement.innerHTML = ""; // Xóa option cũ

//     if (districts.length > 0) {
//       districts.forEach((district) => {
//         const option = document.createElement("option");
//         option.value = district.id_district;
//         option.textContent = district.name;
//         selectElement.appendChild(option);
//       });
//     } else {
//       alert("Không có quận/huyện nào trong thành phố đã chọn.");
//     }
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách quận/huyện:", error);
//     alert("Không thể tải danh sách quận/huyện. Vui lòng thử lại.");
//   }
// }
