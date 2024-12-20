import { Link,useNavigate } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import axios from "axios"
import config from "../../config"
const Register = () => {
  const navigate =useNavigate()
  
  const [inputs,setInputs]= useState({
    name:"",
    username:"",
    email:"",
    password:""
    
  })
  const [err, setErr]=useState(null)
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false); 
  const handleChange= (e) =>{
    setInputs(prev=>({
      ...prev,[e.target.name]:e.target.value
    }))
  }
  const handleCloseModal = () => {
    setShowModal(false); // Đóng modal
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(inputs)
    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/api/v1/auth/signup`,
        inputs
      );
      console.log(res.data); // Kiểm tra phản hồi từ API
      setSuccess(true); // Đăng ký thành công
      setShowModal(true); 
      //navigate("/login");
    } catch (err) {
      setErr(err.response?.data?.message || "Đã xảy ra lỗi.");
    }
  };

  console.log(err)
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Character AI</h1>
          <p>
          Tham gia cùng chúng tôi để sống lại những câu chuyện lịch sử Việt Nam qua những cuộc trò chuyện trực tiếp cùng các nhân vật huyền thoại. Đăng ký ngay để khám phá quá khứ!
          </p>
          <span>Bạn đã có tài khoản?</span>
          <Link to="/login">
          <button>Đăng nhập ngay</button>
          </Link>
        </div>
        <div className="right">
          <h1>Đăng kí</h1>
          <form>
          <input type="text" placeholder="Tên người dùng"  name="name" onChange={handleChange} />
            <input type="text" placeholder="Tên tài khoản" name="username" onChange={handleChange} />
            <input type="email" placeholder="Email"  name="email" onChange={handleChange} />
            <input type="password" placeholder="Mật khẩu" name="password" onChange={handleChange}  />
         
            {err &&
            <div style={{
              fontSize: '14px',
              color:'red'
            }}>
              {err}
            </div>
             }
            <button onClick={handleClick}>Đăng kí</button>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Đăng ký thành công!</h2>
            <p>Bạn đã đăng ký thành công. Vui lòng đăng nhập để tiếp tục.</p>
            <button onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
