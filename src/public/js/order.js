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

async function Payment({ id_bill }) {
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
          <!-- Thêm input ẩn để lưu id_bill -->
          <input type="hidden" id="hidden_id_bill" value="${id_bill}" />
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
var id_ad = "";

async function showPayment(event, citys, user_address) {
  const selectedRowInput = event.target.closest("tr").querySelector('input[name="id_bill"]');
  // if (!selectedRowInput) {
  //   // Không có hàng nào được chọn, bạn có thể hiển thị một thông báo hoặc thực hiện hành động khác ở đây
  //   console.error("Không có hàng nào được chọn.");
  //   return;
  // }
  id_bill = selectedRowInput.value;
  Payment({ id_bill });
  console.log(citys, user_address);

  const selectuser = document.getElementById("users_address");
  const selectElement = document.getElementById("validationDefault03");
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
  selectuser.onchange = function () {
    const selecteduserId = selectuser.value;
    const selecteduser = user_address.find((user) => user.id_useraddress == parseInt(selecteduserId));

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
}

async function submitPayment() {
  const name = document.getElementById("validationDefault01").value.trim();
  const phone = document.getElementById("validationDefault02").value.trim();
  // const city = document.getElementById("validationDefault03").value;
  const ipdistrict = document.getElementById("validationDefault04").value;
  const address = document.getElementById("validationDefault05").value.trim();
  const user_address = parseInt(document.getElementById("users_address").value);
  const id_bill = document.getElementById("hidden_id_bill").value;
  // Kiểm tra hợp lệ thông tin
  if (!isValidName(name)) {
    alert("Tên không hợp lệ. Vui lòng kiểm tra lại.");
    return;
  }
  if (!isValidPhoneNumber(phone)) {
    alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.");
    return;
  }
  if (!ipdistrict) {
    alert("Vui lòng chọn Thành phố và Quận/Huyện.");
    return;
  }
  if (!isValidAddress(address)) {
    alert("Địa chỉ không hợp lệ. Vui lòng kiểm tra lại.");
    return;
  }
  if (isValidAddress(address) && isValidPhoneNumber(phone) && isValidName(name)) {
    await axios
      .post("/order/address", {
        user_address,
        name,
        phone,
        ipdistrict,
        address,
        id_bill,
      })
      .then(function (response) {
        console.log(response);
        window.location.reload();
        // Xử lý phản hồi từ server sau khi gửi thành công
      })
      .catch(function (error) {
        console.error(error);
        // Xử lý lỗi khi gửi dữ liệu
      });
  } else {
    alert("Xin hãy nhập đúng các thông tin !");
  }
}
async function DeleteBillData(event) {
  // Lấy giá trị id_bill từ hidden input
  const id_bill = event.target.closest("tr").querySelector('input[name="id_bill"]').value;

  // Hiển thị hộp thoại xác nhận bằng confirm() (alert thông thường)
  const isConfirmed = confirm("Bạn có chắc chắn muốn xóa hóa đơn này?");

  if (isConfirmed) {
    try {
      // Gửi yêu cầu DELETE với Axios
      const response = await axios.delete("/order/delete", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu bạn sử dụng token xác thực
        },
        data: { id_bill }, // Gửi id_bill dưới dạng JSON trong phần `data`
      });

      // Kiểm tra phản hồi từ server
      if (response.data.success) {
        alert("Thành công! Hóa đơn đã được xóa.");
        window.location.reload();
      } else {
        alert(response.data.message || "Có lỗi xảy ra khi xóa hóa đơn.");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      alert("Đã xảy ra lỗi trong quá trình xóa hóa đơn.");
    }
  } else {
    // Nếu người dùng không xác nhận, chỉ thông báo và không làm gì thêm
    console.log("Hành động xóa bị hủy bỏ.");
  }
}
