import { useContext,useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate =useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: inputs.email, // Điều chỉnh nếu input sử dụng "username"
        password: inputs.password,
      });
      navigate("/"); // Điều hướng đến trang chủ
    } catch (err) {
      setErr("Sai tài khoản hoặc mật khẩu"); // Hiển thị lỗi nếu có
    }
  };
  const handleLoginClick = () => {
    navigate("/"); // Điều hướng đến trang chủ
  };
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Character AI</h1>
          <p>
          Khám phá lịch sử Việt Nam qua những cuộc trò chuyện độc đáo cùng các nhân vật lịch sử! Đăng nhập để bắt đầu hành trình khám phá quá khứ.
          </p>
          <span>Bạn chưa có tài khoản?</span>
          <Link to="/register">
            <button>Đăng kí ngay</button>
          </Link>
        </div>
        <div className="right">
          <h1>Đăng nhập</h1>
          <form>
            <input type="text" placeholder="Tên tài khoản" name ="email" onChange={handleChange}/>
            <input type="password" placeholder="Mật khẩu" name="password" onChange={handleChange}/>
            {err &&
            <div style={{
              fontSize: '14px',
              color:'red'
            }}>
              {err}
            </div>
             }
            <button onClick={handleLogin}>Đăng nhập</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
