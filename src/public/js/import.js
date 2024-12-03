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
async function Import({ checkedProducts }, import_order_id) {
  const main = document.querySelector("#pay");
  const Import = document.createElement("div");
  Import.onclick = function (e) {
    if (e.target.closest(".close")) {
      main.removeChild(Import);
    }
  };
  Import.innerHTML = `<div
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
        <form class="row g-3" id="ImportForm">
          <div class="col-md-6">
            <label for="validationDefault01" class="form-label">First name</label>
            <select class="form-select" id="manufacturers" required>
              <option value="0" selected>Nhập nhà sản xuất mới</option>
            </select>
            <input type="hidden" id="id_import_bill" value="${import_order_id}" />
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
              Choose your Import
            </label>
            <div class="form-check form-check-inline" style="margin: 0 12px;">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Đã đặt hàng" />
              <label class="form-check-label label-ordered" for="inlineRadio3" style="padding-bottom: 2px;">Đã đặt hàng</label>
            </div>
            <div class="form-check form-check-inline" style="margin: 0 12px;">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Đang giao hàng nhập" />
              <label class="form-check-label label-shipping" for="inlineRadio3" style="padding-bottom: 2px;">Đang giao hàng nhập</label>
            </div>
            <div class="form-check form-check-inline" style="margin: 0 12px;">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="Đã nhận hàng và thanh toán" checked />
              <label class="form-check-label label-paid" for="inlineRadio3" style="padding-bottom: 2px;">Đã nhận hàng và thanh toán</label>
            </div>
          </div>
          
          <div class="col-12" style="display: inline-flex; justify-content:stretch; align-items:center; width: 100%; margin: 12px 0" >
            <div id="selectedProducts" style="margin-top: 20px;"></div>
          </div>
          <div class="col-12" style="display: flex; justify-content: flex-end; margin-top:12px;">
            <button class="btn btn-primary" type="button" onclick="submitImport()">Submit form</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `;
  main.appendChild(Import);
  const selectedProductsContainer = document.getElementById("selectedProducts");
  checkedProducts.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("d-flex", "align-items-center", "mb-2");
    productElement.style.width = "100%";
    productElement.id = `product-${product.id}`;

    productElement.innerHTML = `
        <img src="/image/${product.image}" alt="${product.name}" style="width: 70px; height: 70px; margin-right: 12px;">
        <span class="badge badge-secondary role-label" style="font-size: 1.2rem; margin-right: 12px; background-color: rgb(130, 150, 167);">${product.name}</span>
        <input type="number" class="form-control mr-2" placeholder="Nhập giá" style="width: 36%;" data-id="${product.id}" data-field="price" value="${product.unit_price}">
        <input type="number" class="form-control" placeholder="Nhập số lượng" style="width: 36%;" data-id="${product.id}" data-field="quantity" value="${product.import_quantity}">
        <button class="btn btn-danger btn-sm" style="margin-left: 8px; background-color: rgb(241, 93, 107);" onclick="removeProduct('${product.id}')">✖</button>
      `;

    selectedProductsContainer.appendChild(productElement);
  });
}

var checkedProducts = [];
let id_address2 = 0;
async function showImport(products, citys, manufacturers, id_address, import_order_id) {
  checkedProducts = Array.from(products).map((product) => {
    return {
      id: product.id_product,
      name: product.product_name, // Lấy tên sản phẩm
      image: product.product_image, // Lấy URL hình ảnh sản phẩm
      import_quantity: product.import_quantity,
      unit_price: product.unit_price,
    };
  });
  if (checkedProducts.length > 0) {
    Import({ checkedProducts }, import_order_id);
    const selectElement = document.getElementById("validationDefault03");
    const selectmanufacturer = document.getElementById("manufacturers");
    // Xóa tất cả option cũ (nếu có)

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
    manufacturers.forEach((manufacturer) => {
      const option = document.createElement("option");
      option.value = manufacturer.id_manufacturer;
      option.textContent = manufacturer.name;
      selectmanufacturer.appendChild(option);
    });
    // Thêm sự kiện onchange để gọi hàm district khi chọn city
    if (id_address) {
      const selectedManufacturerId = id_address;
      id_address2 = id_address;
      // Tìm thông tin manufacturer từ danh sách dựa vào id
      const selectedManufacturer = manufacturers.find((manufacturer) => manufacturer.id_manufacturer === parseInt(selectedManufacturerId));

      if (selectedManufacturer) {
        // Điền thông tin vào các ô nhập liệu
        document.querySelector("#validationDefault01").value = selectedManufacturer.name;
        document.querySelector("#validationDefault02").value = selectedManufacturer.phone;
        document.querySelector("#validationDefault05").value = selectedManufacturer.ip_address; // Điền address vào ô address
        // Điền city vào ô city (Lấy value của option trong select)
        const citySelect = document.querySelector("#validationDefault03");
        const cityOption = Array.from(citySelect.options).find((option) => option.textContent === selectedManufacturer.city_name);
        if (cityOption) {
          citySelect.value = cityOption.value; // Chọn city tương ứng
        }

        // Điền district vào ô district (Lấy value của option trong select)
        district(selectedManufacturer.id_city).then(() => {
          const districtSelect = document.querySelector("#validationDefault04");
          const districtOption = Array.from(districtSelect.options).find((option) => option.textContent === selectedManufacturer.district_name);
          if (districtOption) {
            districtSelect.value = districtOption.value; // Chọn district tương ứng
          }
        });
      } else {
        document.querySelector("#validationDefault01").value = "";
        document.querySelector("#validationDefault02").value = "";
        document.querySelector("#validationDefault05").value = "";
      }
    }
    selectmanufacturer.onchange = function () {
      const selectedManufacturerId = selectmanufacturer.value;
      id_address = null;
      id_address2 = parseInt(selectedManufacturerId);
      // Tìm thông tin manufacturer từ danh sách dựa vào id
      const selectedManufacturer = manufacturers.find((manufacturer) => manufacturer.id_manufacturer === parseInt(selectedManufacturerId));

      if (selectedManufacturer) {
        // Điền thông tin vào các ô nhập liệu
        document.querySelector("#validationDefault01").value = selectedManufacturer.name;
        document.querySelector("#validationDefault02").value = selectedManufacturer.phone;
        document.querySelector("#validationDefault05").value = selectedManufacturer.ip_address; // Điền address vào ô address
        // Điền city vào ô city (Lấy value của option trong select)
        const citySelect = document.querySelector("#validationDefault03");
        const cityOption = Array.from(citySelect.options).find((option) => option.textContent === selectedManufacturer.city_name);
        if (cityOption) {
          citySelect.value = cityOption.value; // Chọn city tương ứng
        }

        // Điền district vào ô district (Lấy value của option trong select)
        district(selectedManufacturer.id_city).then(() => {
          const districtSelect = document.querySelector("#validationDefault04");
          const districtOption = Array.from(districtSelect.options).find((option) => option.textContent === selectedManufacturer.district_name);
          if (districtOption) {
            districtSelect.value = districtOption.value; // Chọn district tương ứng
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
    alert("An error occurred while processing your Import. Please try again later.");
  }
}

function removeProduct(productId) {
  // Xoá sản phẩm ra khỏi danh sách checkedProducts
  checkedProducts = checkedProducts.filter((product) => product.id !== productId);

  // Cập nhật lại giao diện
  const productElement = document.getElementById(`product-${productId}`);
  if (productElement) {
    productElement.remove();
  }
}
async function submitImport() {
  const name = document.querySelector("#validationDefault01").value;
  const phoneNumber = document.querySelector("#validationDefault02").value;
  const id_district = document.querySelector("#validationDefault04").value;
  const address = document.querySelector("#validationDefault05").value;
  const import_order_id = document.querySelector("#id_import_bill").value;
  // Lấy giá trị từ select của nhà sản xuất
  const id_manufacturer = id_address2;
  console.log(id_manufacturer);
  // Lấy giá trị của radio button đã chọn
  const importStatus = document.querySelector('input[name="inlineRadioOptions"]:checked').value;

  // Duyệt qua từng sản phẩm và lấy giá trị price và quantity
  const productsWithDetails = checkedProducts.map((product) => {
    const priceInput = document.querySelector(`input[data-id="${product.id}"][data-field="price"]`);
    const quantityInput = document.querySelector(`input[data-id="${product.id}"][data-field="quantity"]`);

    return {
      id_product: product.id,
      name: product.name,
      price: priceInput ? parseFloat(priceInput.value) : 0,
      quantity: quantityInput ? parseInt(quantityInput.value) : 0,
    };
  });

  // Kiểm tra nếu danh sách sản phẩm có ít nhất một sản phẩm
  if (productsWithDetails.length > 0) {
    const data = {
      id_manufacturer,
      name,
      phoneNumber,
      id_district,
      address,
      products: productsWithDetails,
      importStatus, // Thêm giá trị trạng thái import
      import_order_id,
    };

    if (isValidAddress(address) && isValidPhoneNumber(phoneNumber) && isValidName(name)) {
      try {
        await axios.post("/homepage/import_bill", data);
        alert("Import successful!");
        checkedProducts = [];
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("An error occurred while processing your Import. Please try again later.");
      }
    } else {
      alert("Xin hãy nhập đúng các thông tin!");
    }
  } else {
    alert("Please select products to import.");
  }
}
async function DeleteimportData(import_order_id) {
  // Hiển thị hộp thoại xác nhận bằng confirm() (alert thông thường)
  const isConfirmed = confirm("Bạn có chắc chắn muốn xóa hóa đơn này?");

  if (isConfirmed) {
    try {
      // Gửi yêu cầu DELETE với Axios
      const response = await axios.delete("/homepage/delete_import_order", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu bạn sử dụng token xác thực
        },
        data: { import_order_id }, // Gửi id_bill dưới dạng JSON trong phần `data`
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
