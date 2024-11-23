function updateSelectedOptions(selectId, displayAreaId, where) {
  const select = document.getElementById(selectId);
  const selectedOptions = Array.from(select.selectedOptions);
  const displayArea = document.getElementById(displayAreaId);
  // Tạo một tập hợp để theo dõi các mục đã hiển thị
  const displayedOptions = new Set(Array.from(displayArea.children).map((span) => span.textContent.replace("✖", "").trim()));

  selectedOptions.forEach((option) => {
    if (!displayedOptions.has(option.text)) {
      const span = document.createElement("span");
      span.className = "badge badge-secondary mr-2";
      span.style.fontSize = "1.2rem";
      span.textContent = option.text;

      // Cập nhật giá trị của thẻ input ẩn khi thêm mới
      updateHiddenInput(option.text, "add", where);
      const removeBtn = document.createElement("span");
      removeBtn.className = "ml-1 text-danger cursor-pointer";
      removeBtn.textContent = "✖";
      removeBtn.style.fontSize = "1.5rem";

      removeBtn.onclick = () => {
        option.selected = false;
        displayArea.removeChild(span);
        // Cập nhật lại giá trị thẻ input ẩn khi xóa
        updateHiddenInput(option.text, "remove", where);
      };

      span.appendChild(removeBtn);
      displayArea.appendChild(span);
    }
  });
}

// Sử dụng lại hàm này cho cả hai thao tác:
function updateHiddenInput(optionText, action, where) {
  const hiddenInput = document.getElementById(where);
  let selectedValues = hiddenInput.value ? hiddenInput.value.split(",") : [];

  if (action === "add") {
    // Thêm giá trị vào danh sách
    selectedValues.push(optionText);
  } else if (action === "remove") {
    // Loại bỏ giá trị khỏi danh sách
    selectedValues = selectedValues.filter((value) => value !== optionText);
  }

  // Cập nhật giá trị của input ẩn dưới dạng chuỗi các giá trị phân cách bằng dấu phẩy
  hiddenInput.value = selectedValues.join(",");
}

// function updateSelectedRoles() {
//   updateSelectedOptions("createUserRole", "selectedRoles", "selectedRolesInput");
// }
function deleteUser(id_user) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`/homepage/user/${id_user}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
          alert("User deleted successfully!");
        } else {
          alert("Failed to delete user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while deleting the user");
      });
  }
}

function deleteRole(id_role) {
  if (confirm("Are you sure you want to delete this role?")) {
    fetch(`/homepage/role/${id_role}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Role deleted successfully!");
          window.location.reload();
        } else {
          alert("Failed to delete role");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while deleting the role");
      });
  }
}

function updateSelectedAuthority() {
  updateSelectedOptions("createRoleAuthority", "selectedAuthorities", "selectedAuthoritiesInput");
}

function showCreateUser(role, user = {}) {
  const { id_user = "", id_role = "", name = "", gender = "", email = "", account = "", password = "" } = user;
  const isEdit = !!id_user;

  const parent = document.getElementById("createUserModal");
  parent.innerHTML = `<div class="modal-dialog" role="document" id="createUser">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createUserModalLabel">${isEdit ? "Edit User" : "Create User"}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span onclick="deleteCreateUser()">&times;</span>
          </button>
        </div>
        <form action="/homepage/user" method="POST">
          <div class="modal-body">
            <div class="form-group">
              <label for="createUserRole">Role</label>
              <select class="form-control" id="createUserRole" name="id_role">
                <option disabled ${!isEdit ? "selected" : ""}>Choose the role</option>
                ${role.map((r) => `<option value="${r.id_role}" ${id_role == r.id_role ? "selected" : ""}>${r.name}</option>`).join("")}
              </select>
              <div id="selectedRoles" class="mt-2 text-muted" style="width: 100%;"></div>
            </div>
            <input type="hidden" name="id_user" id="id_user" value="${id_user ? id_user : 0}">
            <div class="form-group">
              <label for="createUserName">Name</label>
              <input type="text" class="form-control" id="createUserName" name="name" value="${name}" />
            </div>
            <div class="form-group">
              <label for="createUserGender">Gender</label>
              <select class="form-control" id="createUserGender" name="gender">
                <option value="Nam" ${gender === "Male" ? "selected" : ""}>Nam</option>
                <option value="Nữ" ${gender === "Female" ? "selected" : ""}>Nữ</option>
              </select>
            </div>
            <div class="form-group">
              <label for="createUserEmail">Email</label>
              <input type="email" class="form-control" id="createUserEmail" name="email" value="${email}" />
            </div>
            <div class="form-group">
              <label for="createUserAccount">Account</label>
              <input type="text" class="form-control" id="createUserAccount" name="account" value="${account}" />
            </div>
            <div class="form-group">
              <label for="createUserPassword">Password</label>
              <input type="password" class="form-control" id="createUserPassword" name="password" value="${password}" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="deleteCreateUser()">Close</button>
            <button type="submit" class="btn btn-primary">${isEdit ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>`;

  $("#createUserModal").modal("show");
}

function deleteCreateUser() {
  $("#createUserModal").modal("hide");
  document.getElementById("createUserModal").innerHTML = "";
}

function showCreateRole(authority, role = {}) {
  const { id_role = "", name = "" } = role;
  const parent = document.getElementById("createRoleModal");

  // Tạo các option động cho authority
  let authorityOptions = "";
  if (Array.isArray(authority)) {
    // Tạo một Set để lưu các id_au đã chèn
    const insertedIds = new Set();

    authority.forEach((auth) => {
      if (!insertedIds.has(auth.id_au)) {
        // Nếu id_au chưa tồn tại, thêm vào Set và chèn vào option
        insertedIds.add(auth.id_au);
        authorityOptions += `<option value="${auth.id_au}-${auth.name}">${auth.id_au}-${auth.name}</option>`;
      }
    });
  }

  parent.innerHTML = `<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createRoleModalLabel">Create Role</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span onclick="deleteCreateRole()">&times;</span>
        </button>
      </div>
      <form action ="/homepage/role" method="POST">
        <div class="modal-body">
          <div class="form-group">
            <label for="createRoleAuthority">ID Authority</label>
            <select class="form-control" id="createRoleAuthority" onchange="updateSelectedAuthority()">
              <option disabled selected>Choose the Authority</option>
              ${authorityOptions} <!-- Chèn các option động -->
            </select>
            <div id="selectedAuthorities" class="mt-2 text-muted" style="width: 100%;"></div>
            <input type="hidden" name="selectedAuthorities" id="selectedAuthoritiesInput">
          </div>
          <div class="form-group">
            <input type="hidden" name="id_role" id="id_role" value="${id_role ? id_role : 0} ">
            <label for="createRoleName">Role Name</label>
            <input type="text" class="form-control" name="name" id="name" value="${role ? name : ""}" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="deleteCreateRole()">Close</button>
          <button type="submit" class="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  </div>`;

  $("#createRoleModal").modal("show");
}

function deleteCreateRole() {
  $("#createRoleModal").modal("hide");
  document.getElementById("createRoleModal").innerHTML = "";
}
