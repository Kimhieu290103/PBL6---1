import React, { useState } from "react";
import "./ChangePass.css"; // Import file CSS

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    const isSuccess = mockChangePasswordAPI(oldPassword, newPassword);

    if (isSuccess) {
      setMessage("Đổi mật khẩu thành công!");
    } else {
      setMessage("Mật khẩu cũ không chính xác hoặc lỗi xảy ra.");
    }
  };

  const mockChangePasswordAPI = (oldPass, newPass) => {
    return oldPass === "123456" && newPass.length >= 6;
  };

  return (
    <div className="hange-password-page" >
    <div className="container" style={{
      width: '28%'
    }}>
      <h2>Đổi Mật Khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Mật khẩu cũ:</label>
          <input
              className="input-style"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu cũ"
            required
          />
        </div>
        <div className="input-group">
          <label>Mật khẩu mới:</label>
          <input
                 className="input-style"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            required
          />
        </div>
        <div className="input-group">
          <label>Xác nhận mật khẩu:</label>
          <input
           className="input-style"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            required
          />
        </div>
        <button style={{
            marginTop: '10px'
        }} type="submit">Đổi Mật Khẩu</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
    </div>
  );
};

export default ChangePassword;
