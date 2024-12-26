import React, { useState } from "react";
import "./ChangePass.css"; // Import file CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import các icon

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="change-password-page">
      <div className="container" style={{ width: '28%' }}>
        <h2>Đổi Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Mật khẩu cũ:</label>
            <div className="input-container">
              <input
                className="input-style"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
                required
              />
              <FontAwesomeIcon
                icon={showOldPassword ? faEye:faEyeSlash}
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="eye-icon"
              />
            </div>
          </div>
          <div className="input-group">
            <label>Mật khẩu mới:</label>
            <div className="input-container">
              <input
                className="input-style"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                required
              />
              <FontAwesomeIcon
                icon={showNewPassword ?faEye:faEyeSlash}
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="eye-icon"
              />
            </div>
          </div>
          <div className="input-group">
            <label>Xác nhận mật khẩu:</label>
            <div className="input-container">
              <input
                className="input-style"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ?   faEye:faEyeSlash}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="eye-icon"
              />
            </div>
          </div>
          <button style={{ marginTop: '10px' }} type="submit">Đổi Mật Khẩu</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
