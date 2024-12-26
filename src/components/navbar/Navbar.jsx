import "./navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MenuIcon from "@mui/icons-material/Menu"; // Biểu tượng menu
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link,useNavigate } from "react-router-dom";
import { useContext,useState , useEffect ,useRef  } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import axios from "axios";
import config from "../../config"
import coinImage from '../../assets/rice.png'
import { AuthContext } from "../../context/authContext";
import user_image from '../../assets/user.jpg'
const Navbar = () => {
  const dropdownRef = useRef(null); 
  const { logout } = useContext(AuthContext);
  const { toggle, darkMode } = useContext(DarkModeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const navigate = useNavigate();
  useEffect(() => {
    // Lắng nghe sự kiện click trên toàn bộ trang
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Ẩn dropdown nếu click ngoài phạm vi
      }
    };
  
    // Thêm sự kiện khi component mount
    document.addEventListener("click", handleClickOutside);
  
    // Xóa sự kiện khi component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("đây là hàm gọi để biêys giá")
      if (currentUser && currentUser.access_token) {
        try {
          const response = await axios.get(`${config.API_BASE_URL}/api/v1/auth/me`, {
            headers: {
              "Authorization": `Bearer ${currentUser.access_token}`// Sending the access token
            },
          });
          setUserData(response.data); 
          console.log("thanh cong ")
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
     // Cập nhật liên tục sau mỗi 5 giây
  const interval = setInterval(fetchUserData, 1000);

  // Dọn dẹp khi component unmount
  return () => clearInterval(interval);
  }, []);
  
  // const handleLogout = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:8800/api/auth/logout", {}, {
  //        withCredentials: true,
  //     });

  //     if (response.status === 200) {
  //       console.log("Logout successful");
  //       localStorage.removeItem("user"); 
  //       navigate("/login");

  //     } else {
  //       console.error("Logout failed");
  //     }
  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //   }
  // };
  
const handleHome=async()=>{
   navigate("/login")
}
const handleSelect = async()=>{
  navigate("/select")
}
const handleUpdateUser = () => {
  navigate("/update-user");
};

const handleChangePassword = () => {
  navigate("/changepass");
};
const handleChangeRecharge = () => {
  navigate("/recharge");
};
const handleUpdate = () => {
  navigate("/update");
};
const handeLogout = () => {
   logout(); // Xóa thông tin người dùng
    navigate("/login"); // Chuyển hướng về trang login
};
console.log({currentUser})
  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Đại Việt</span>
        </Link>
        {/* <HomeOutlinedIcon onClick={handleHome} /> */}
        {darkMode ?(
          <DarkModeOutlinedIcon onClick={toggle} />
        ): (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) }
        {/* < ChatBubbleOutlineIcon  onClick={handleSelect}/> */}
        {/* <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div> */}
      </div>
      <div className="right">
        {/* <PersonOutlinedIcon /> */}
        <div className="balance">
        {userData.balance?.toLocaleString('vi-VN')}
        <img src={coinImage} alt="Product Image" class="product-image"></img>
        </div>

        {/* <NotificationsOutlinedIcon /> */}
        <div className="user">
          <img
            src = {user_image}
            alt=""
          />
          <span>{currentUser.user.name}</span>
          <MenuIcon onClick={(e) => {
      e.stopPropagation(); // Ngừng sự kiện bubbling để dropdown không bị đóng
      toggleDropdown(); // Mở dropdown
    }} style={{ cursor: "pointer", marginLeft: '8px' }} /> {/* Nút biểu tượng menu */}
          {dropdownOpen && (
            <div ref={dropdownRef} className="dropdown">
              <div onClick={handleUpdate}>Update user</div>
              <div onClick={handleChangePassword}>Change password</div>
              <div onClick={handleChangeRecharge}>Recharge</div>
              <div onClick={handeLogout}>Log out</div>
            </div>
          )}
        </div>
        {/* <LogoutOutlinedIcon onClick={handleHome} />  */}
      </div>
    </div>
  );
};

export default Navbar;
