import React, { useState } from "react";
import "./UpdateProfile.css"; // Import file CSS

const UpdateProfile = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const isSuccess = mockUpdateProfileAPI(fullName, username, email);

    if (isSuccess) {
      setMessage("Cập nhật thông tin thành công!");
    } else {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const mockUpdateProfileAPI = (name, user, mail) => {
    return name.trim() !== "" && user.trim() !== "" && mail.includes("@");
  };

  return (
    <div className="update-profile-page">
      <div
        className="container"
        style={{
          width: "28%",
        }}
      >
        <h2>Cập Nhật Thông Tin</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tên người dùng:</label>
            <input
              className="input-style"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập tên người dùng"
              required
            />
          </div>
          <div className="input-group">
            <label>Tên đăng nhập:</label>
            <input
              className="input-style"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input
              className="input-style"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
            />
          </div>
          <button
            style={{
              marginTop: "10px",
            }}
            type="submit"
          >
            Cập Nhật
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default UpdateProfile;
