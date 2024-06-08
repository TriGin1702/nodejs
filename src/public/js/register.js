document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#registerForm');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Lấy giá trị từ các trường input
    const accountName = document.getElementById('accountName').value.trim();
    const password = document.getElementById('password').value.trim();
    const username = document.getElementById('name').value.trim();
    const age = document.getElementById('Age').value.trim(); // Lấy giá trị tuổi
    // Kiểm tra độ dài của tên tài khoản và mật khẩu
    if (accountName.length < 6 || accountName.length > 18) {
      alert('Tên tài khoản phải có từ 6 đến 18 ký tự.');
      return;
    }

    if (password.length < 6 || password.length > 18) {
      alert('Mật khẩu phải có từ 6 đến 18 ký tự.');
      return;
    }

    // Kiểm tra username
    if (!isValidUsername(username)) {
      alert(
        "UserName phải chứa ít nhất 2 chữ cái và không chứa số hoặc ký tự đặc biệt '@'."
      );
      return;
    }

    // Kiểm tra accountName
    if (!isValidAccountName(accountName)) {
      alert(
        'Account phải chứa ít nhất 2 chữ cái ở đầu, không chứa ký tự đặc biệt và khoảng trắng.'
      );
      return;
    }

    // Kiểm tra xem tuổi có là số hợp lệ không
    if (isNaN(age) || parseInt(age) < 6 || parseInt(age) >= 100) {
      alert('Tuổi phải là một số hợp lệ từ 6 trở lên và nhỏ hơn 100.');
      return;
    }

    // Nếu tất cả điều kiện đều đáp ứng, gửi dữ liệu đăng ký
    form.action = '/register';

    // Gửi dữ liệu đăng ký
    form.submit();
  });

  function isValidUsername(username) {
    // Sử dụng biểu thức chính quy để kiểm tra xem username không chứa số, không chứa ký tự đặc biệt "@" và phải có ít nhất 2 chữ cái
    return /^[^\d@]{2,}$/.test(username);
  }

  function isValidAccountName(accountName) {
    // Sử dụng biểu thức chính quy để kiểm tra xem accountName có ít nhất 2 chữ cái ở đầu, không chứa ký tự đặc biệt và khoảng trắng
    return /^[^\W\d_ ][a-zA-Z]{2,}\d*$/.test(accountName);
  }
});
