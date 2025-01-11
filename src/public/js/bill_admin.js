async function deleteBill(id_bill, id_user) {
  // Hiển thị hộp thoại xác nhận bằng confirm() (alert thông thường)
  const isConfirmed = confirm("Bạn có chắc chắn muốn xóa hóa đơn này?");

  if (isConfirmed) {
    try {
      // Gửi yêu cầu DELETE với Axios
      const response = await axios.post(`/api_order/delete/${id_user}`, { id_bill: id_bill });

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
