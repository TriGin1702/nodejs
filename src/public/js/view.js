// // const products = [];

// // async function inputForms() {
// //     const infors = document.querySelectorAll('.more');
// //     infors.forEach((element) => {
// //         const name = element.querySelector('.name').value;
// //         const description = element.querySelector('.description').value;
// //         const price = element.querySelector('.price').value;
// //         const image = element.querySelector('.image').files[0].name;
// //         const brandSelect = element.querySelector('.brand');
// //         const brand = brandSelect.options[brandSelect.selectedIndex].value;
// //         const typeSelect = element.querySelector('.type');
// //         const type = typeSelect.options[typeSelect.selectedIndex].value;
// //         const newProduct1 = new product(brand, name, description, type, price, image);
// //         products.push(newProduct1);
// //         console.log(products);
// //     });
// //     const inputs = document.querySelectorAll('.more input, .more textarea, .more img');
// //     inputs.forEach((input) => {
// //         input.value = '';
// //     });
// //     await send(products);
// //     products.length = 0;
// // }

function inputForm(event) {
  const inputone = event.target.closest(".more");
  console.log(inputone);
  if (event.target.closest(".btn2") === inputone.querySelector(".btn2")) {
    const name = inputone.querySelector(".name").value;
    const description = inputone.querySelector(".description").value;
    const price = inputone.querySelector(".price").value;
    const imageFiles = inputone.querySelector(".image").files; // Lấy tất cả các file ảnh
    const brandSelect = inputone.querySelector(".brand");
    const brand = brandSelect.options[brandSelect.selectedIndex].value;
    const typeSelect = inputone.querySelector(".type");
    const type = typeSelect.options[typeSelect.selectedIndex].value;
    console.log(imageFiles);
    // Tạo đối tượng FormData và thêm dữ liệu và file vào đó
    const formData = new FormData();

    // Thêm các trường dữ liệu vào FormData
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);
    formData.append("type", type);
    // formData.append("image", imageFiles);
    // Thêm tất cả các ảnh vào FormData
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("image", imageFiles[i]); // Gửi mỗi ảnh với tên 'image'
    }

    // Gọi hàm send với đối tượng FormData
    send(formData);

    // Xóa nội dung của các trường sau khi gửi
    inputone.querySelector(".name").value = "";
    inputone.querySelector(".description").value = "";
    inputone.querySelector(".price").value = "";
    inputone.querySelectorAll(".image").value = ""; // Xóa ảnh đã chọn
  }
}

// Kiểm tra số lượng ảnh khi tải lên
function previewImage(event) {
  const input = event.target;
  const previewContainer = input.closest(".col-auto");

  // Xóa các ảnh xem trước trước đó mà không xóa thẻ input
  previewContainer.querySelectorAll(".preview").forEach((img) => img.remove());

  // Giới hạn tối đa 5 file
  const files = Array.from(input.files).slice(0, 5);

  // Tạo bản xem trước cho mỗi file
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgElement = document.createElement("img");
      imgElement.src = e.target.result;
      imgElement.className = "preview";
      imgElement.style.maxWidth = "100px";
      imgElement.style.height = "100px";
      imgElement.style.margin = "5px";
      previewContainer.appendChild(imgElement);
    };
    reader.readAsDataURL(file);
  });
}

// Giới hạn số lần thêm "More product" tối đa 3 lần
let moreProductCount = 1;
var moreProductClicked = false;

function Moreproduct() {
  const elements = document.querySelector(".more");
  if (moreProductCount >= 3) {
    alert("Bạn chỉ có thể thêm tối đa 3 sản phẩm");
    return;
  }
  const form = document.querySelector(".form");
  const newDiv = document.createElement("div");
  if (moreProductClicked == true) {
    const saveAll = document.getElementById("allsave");
    saveAll.remove();
  }
  moreProductClicked = true;
  newDiv.className = "more";
  newDiv.innerHTML = elements.innerHTML;
  const saveAllButton = document.createElement("button");
  saveAllButton.type = "submit";
  saveAllButton.className = "btn btn-success";
  saveAllButton.id = "allsave";
  saveAllButton.style.float = "right";
  saveAllButton.style.marginRight = "20px";
  saveAllButton.textContent = "Save All";
  moreProductCount++;
  newDiv.appendChild(saveAllButton);
  form.appendChild(newDiv);
}

async function send(formData) {
  try {
    await axios.post("/homepage/home", formData);
    // Xử lý kết quả trả về nếu cần
    console.log("Success");
  } catch (error) {
    // Xử lý lỗi nếu có
    console.log("Error:", error);
  }
}

function showAlert(message) {
  alert(message);
}

function elementofProduct({ element, title, addAction, editAction, deleteAction, selectOptions }) {
  const main = document.querySelector("#create");
  const elementofProduct = document.createElement("div");
  elementofProduct.onclick = function (e) {
    if (e.target.closest(".close")) {
      main.removeChild(elementofProduct);
    }
  };

  // Thay đổi HTML dựa trên các tham số được truyền vào (title, action, options)
  elementofProduct.innerHTML = `
  <div class="notify" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center;">
    <div
      class="notify_overlay"
      style="background-color: rgba(0, 0, 0, 0.4); width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
      <div
        class="notify_body"
        style="display: block; width: 40%; height: auto; background-color:aliceblue; border-radius: 10px; border: 1px solid black; padding: 20px; position: relative;">
        
        <button class="close" style="position: absolute; top:0; right:0; background-color:red; border-radius: 4px; border: 1px solid black">
          <i class="bi bi-x-lg" style="color: aliceblue;"></i>
        </button>

        <!-- Form thêm -->
        <form class="row g-3 mb-4 d-flex align-items-center" action="/homepage/create/${addAction}" method="POST" onsubmit="handleFormSubmit(event, '${addAction}', 'Add ${title} successfully!', 'Error adding ${title}.')">
          <div class="col-md-8">
            <h5>Add ${title}</h5>
          </div>
          <div class="col-md-6" style="margin-bottom: 12px;">
            <input type="text" class="form-control" name="name" placeholder="Enter ${title} name" required />
          </div>
          <div style="width:100%;display:flex; justify-content: flex-end;align-items: flex-end; margin-right:12px;">
            <button type="submit" class="btn btn-success">Add ${title}</button>
          </div>
        </form>

        <hr />

        <!-- Form sửa -->
        <form class="row g-3 mb-4" action="/homepage/create/${editAction}" method="POST" onsubmit="handleFormSubmit(event, '${editAction}', 'Edit ${title} successfully!', 'Error editing ${title}.')">
          <div class="col-12">
            <h5>Edit ${title}</h5>
          </div>
          <div class="col-md-6">
            <label class="form-label">Select ${title} to Edit</label>
            <select class="form-select" name="id" required>
              <option selected disabled>Choose a ${title}...</option>
              ${selectOptions}
            </select>
          </div>
          <div class="col-md-6" style="margin-bottom:12px;">
            <label class="form-label">New ${title} Name</label>
            <input type="text" class="form-control" name="newName" placeholder="Enter new ${title} name" required />
          </div>
          <div style="width:100%;display:flex; justify-content: flex-end;align-items: flex-end; margin-right:12px;">
            <button type="submit" class="btn btn-warning">Edit ${title}</button>
          </div>
        </form>

        <hr />

        <!-- Form xóa -->
        <form class="row g-3 mb-4 d-flex align-items-center" action="/homepage/create/${deleteAction}" method="POST" onsubmit="handleFormSubmit(event, '${deleteAction}', 'Delete ${title} successfully!', 'Error deleting ${title}.')">
          <div class="col-md-8">
            <h5>Delete ${title}</h5>
          </div>
          <div class="col-12">
            <label class="form-label">Select ${title} to Delete</label>
            <select class="form-select" name="id" required>
              <option selected disabled>Choose a ${title}...</option>
              ${selectOptions}
            </select>
          </div>
          <div style="width:100%;display:flex; justify-content: flex-end;align-items: flex-end; margin-right:12px;">
            <button type="submit" class="btn btn-danger">Delete ${title}</button>
          </div>
        </form>

      </div>
    </div>
  </div>`;

  main.appendChild(elementofProduct);
}

// Hàm xử lý khi gửi biểu mẫu
async function handleFormSubmit(event, actionUrl, successMessage, errorMessage) {
  event.preventDefault(); // Ngăn chặn hành động mặc định của biểu mẫu

  // Tạo đối tượng từ dữ liệu biểu mẫu
  const formElements = event.target.elements; // Lấy tất cả các phần tử trong biểu mẫu
  const formDataObject = {}; // Khởi tạo một đối tượng rỗng
  console.log(formElements);
  for (let element of formElements) {
    // Chỉ lấy các phần tử có tên (name) và không phải là nút submit
    if (element.name && element.type !== "submit") {
      formDataObject[element.name] = element.value; // Gán giá trị cho đối tượng
    }
  }

  console.log(formDataObject); // Hiển thị đối tượng dữ liệu biểu mẫu

  let target = window.location; // Sử dụng origin của trang
  try {
    // Sử dụng Axios để gửi yêu cầu POST
    const response = await axios.post(`${target}${actionUrl}`, formDataObject, {
      headers: {
        "Content-Type": "application/json", // Đặt header cho JSON
      },
    });

    // Xử lý phản hồi
    if (response.status != 404 || response.status != 301) {
      showAlert(successMessage); // Hiển thị thông báo thành công
      location.reload(); // Tải lại trang sau khi thành công
    } else {
      showAlert(`${errorMessage} ${response.data.message}`); // Hiển thị thông báo lỗi
    }
  } catch (err) {
    showAlert(`${errorMessage} ${err.response ? err.response.data.message : err.message}`); // Hiển thị thông báo lỗi nếu có ngoại lệ
  }
}

// Ví dụ sử dụng cho bảng Brand
function showBrand() {
  const brandSelect = document.querySelector(".brand");
  let brandOptionsHTML = "";
  Array.from(brandSelect.options).forEach((option) => {
    brandOptionsHTML += `<option value="${option.value}">${option.text}</option>`;
  });

  elementofProduct({
    title: "Brand",
    addAction: "/brand/addBrand",
    editAction: "/brand/editBrand",
    deleteAction: "/brand/deleteBrand",
    selectOptions: brandOptionsHTML,
  });
}

// Ví dụ sử dụng cho bảng Product Type
function showType() {
  const typeSelect = document.querySelector(".type");
  let typeOptionsHTML = "";

  // Tạo HTML cho tất cả các option trong type select
  Array.from(typeSelect.options).forEach((option) => {
    typeOptionsHTML += `<option value="${option.value}">${option.text}</option>`;
  });
  elementofProduct({
    title: "Product Type",
    addAction: "/type/addType",
    editAction: "/type/editType",
    deleteAction: "/type/deleteType",
    selectOptions: typeOptionsHTML,
  });
}
