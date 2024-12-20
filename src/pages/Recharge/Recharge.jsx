import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import './PaymentPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../../context/authContext.js";
import axios from "axios";
import config from "../../config.js"
import coinImage from '../../assets/rice.png';
import { v4 as uuidv4 } from "uuid";
import bank1 from '../../assets/bank/Mobifone-SMS.png'
import bank2 from '../../assets/bank/VT-SMS.png'
import bank3 from '../../assets/bank/logo-mastercard-mobile.svg'
import bank4 from '../../assets/bank/tải xuống.png'
import bank5 from '../../assets/bank/vnshopeepay_pc.png'
import bank6 from '../../assets/bank/vn_new_atm_140x87.png'

const serverUrl = "http://localhost:3005";

const toVND = (price) => {
    try {
        return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    } catch {
        return 0;
    }
}

const my_bank = {
    NAME: "Tran Kim Hieu",
    BANK_ID: "BIDV",
    ACCOUNT_NO: "V3CASS5601711413"

}
// https://script.google.com/macros/s/AKfycbwsCShQyL7HQmomx9yMcwihyPXjonm3d7SJnM6Wfih09xSz30QQSh3BSAWm6KC5NDNjJA/exec API DE GOI KIEM TRA GIAO DICH
// so tai khoan ao V3CASS5601711413
// Danh sách các gói thanh toán
const paymentPackages = [
    {
        id: 1,
        coins: 2000,
        price: 2000,
        content: "nap tien 10.000 đong vao web DAIVIET"
    },
    {
        id: 2,
        coins: 20000,
        price: 20000,
        content: "nap tien 20.000 đong vao web DAIVIET"
    },
    {
        id: 3,
        coins: 50000,
        price: 50000,
        content: "nap tien 50.000 đong vao web DAIVIET"
    },
    {
        id: 4,
        coins: 100000,
        price: 100000,
        content: "nap tien 100.000 đong vao web DAIVIET"
    },
];
const paymentMethods = [
    {
        id: 1,
        name: 'ShopeePay',
        img: bank1
    },
    {
        id: 2,
        name: 'MasterCard',
        img: bank2
    },
    {
        id: 3,
        name: 'Viettel',
        img: bank3
    },
    {
        id: 4,
        name: 'Mobifone',
        img: bank4
    },
    {
        id: 5,
        name: 'ZaloPay',
        img: bank5
    },
    {
        id: 6,
        name: 'ATM',
        img: bank6
    }
]

const Recharge = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [money, setMoney] = useState('')
    const [content, setContent] = useState('')
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [generatedVariable, setGeneratedVariable] = useState("");
    const [done, setDone] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    let intervalId = null;
    const handleSelectPackage = (pkg) => {
        setSelectedPackage(pkg);
        setMoney(pkg.price)
        setContent(pkg.content)

    };
    useEffect(() => {
        // Tạo biến tự phát sinh mỗi lần trang được tải lại
        const newVariable = uuidv4(); // Hoặc sử dụng Date.now(), Math.random(), tùy ý
        const newVariableWithoutDashes = newVariable.replace(/-/g, "");
        const fixedVariable = "a63f547f326e45ba95a5d6ba0b2289c5";
        setGeneratedVariable(newVariableWithoutDashes);
        console.log("Biến tự phát sinh:", newVariableWithoutDashes);
    }, []); // [] đảm bảo chỉ chạy khi component được mount
    const callApi = async () => {

        try {
            const response = await axios.get(
                "https://script.google.com/macros/s/AKfycbyMWWr-tarZqebEhyya_qCEaCX2E3-CwArTUEVozz1EXAS5ZbMjZPsb_HNwlozTuMhK/exec"
            );
            if (response.data.data) {
                setResponseData(response.data.data);
                console.log("Dữ liệu trả về:", response.data.data);
                const data = response.data.data;
                const lastElement = data[data.length - 1];
                console.log("nguoi dung cuoi", lastElement)
                const last_Content = lastElement["Mô tả"]
                console.log("noi dung cuoi", last_Content)
                console.log("day la noi dung so sanh: ", generatedVariable)
                if (last_Content.includes(generatedVariable)) {
                    setIsSuccess(true); // Cập nhật isSuccess thành true
                    clearInterval(intervalId); // Dừng việc gọi API sau khi đạt yêu cầu
                    console.log("Đã tìm thấy dữ liệu khớp!");
                    // const balanceResponse = await axios.put(
                    //     `${config.API_BASE_URL}/api/v1/auth/balance`,
                    //     {
                    //         email: `${currentUser.user.email}`,
                    //         amount: selectedPackage.price
                    //     }
                    // );
                    // console.log("Kết quả gọi API thứ hai:", balanceResponse.data);
                    setIsVisible(false)
                    setDone(true)
                }
            } else {
                console.error("Dữ liệu trả về không hợp lệ!");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };
    const handlePayment = async () => {
        if (!selectedPackage) {
            alert("Vui lòng chọn gói thanh toán!");

            return;
        }
        console.log("Phương thức thanh toán:", paymentMethod);
        console.log("Thanh toán gói:", selectedPackage);

        setIsVisible(true);
        // Gọi API ngay khi bấm nút

        callApi();

        // Thiết lập lặp lại mỗi 15 giây
        intervalId = setInterval(callApi, 15000);
    };
    const closePaymentInfo = () => {
        setIsVisible(false);
        setDone(false)
    };
    const qrCodeUrl = `https://img.vietqr.io/image/${my_bank.BANK_ID}-${my_bank.ACCOUNT_NO}-compact2.png?amount=${money}&addInfo=${generatedVariable}&accountName=${my_bank.NAME}`
    return (
        <div className="payment-page">
            <div className="payment-page-container">

                <div className="payment-page__content">
                    <div className="payment-page__content__title">
                        Chọn phương thức thanh toán
                    </div>
                    <div className="payment-page__content__methods">
                        {paymentMethods.map(method => (
                            <div key={method.id} className={paymentMethod === method.id ? "payment-page__content__methods__item active" : "payment-page__content__methods__item"}
                                onClick={() => setPaymentMethod(method.id)}
                            >
                                <img src={method.img} alt={method.name} />
                            </div>
                        ))}
                    </div>

                    {/* Hiển thị bảng giá nếu đã chọn phương thức thanh toán */}
                    {paymentMethod && (
                        <div className="payment-page__pricing">
                            <h3>Chọn gói thanh toán</h3>
                            <div className="payment-packages">
                                {paymentPackages.map(pkg => (
                                    <div
                                        key={pkg.id}
                                        className={`payment-package ${selectedPackage?.id === pkg.id ? "selected" : ""}`}
                                        onClick={() => handleSelectPackage(pkg)}
                                    > <div style={{
                                        display:'flex',
                                        alignItems:'center'
                                    }}>
                                        <p>{pkg.coins.toLocaleString('vi-VN')}</p>  <img src={coinImage} alt="Product Image" class="product-image"></img></div>
                                        <p>{toVND(pkg.price)}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="payment-button" onClick={handlePayment}>
                                Nạp tiền
                            </button>
                            {isVisible && (
                                <div className="payment-info">
                                    <div className="payment-details">
                                        <button className="close-button" onClick={closePaymentInfo}>X</button>
                                        <h2>Thông tin thanh toán</h2>

                                        <div className="qr-code">
                                            {/* Chèn mã QR ngân hàng ở đây */}
                                            <img src={qrCodeUrl} alt="QR Code" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {done && (
                                <div className="payment-info">
                                    <div className="payment-details">
                                        <button className="close-button" onClick={closePaymentInfo}>X</button>
                                        <h2 style={{
                                            marginTop: '30px'
                                        }}>Bạn đã thanh toán thành công</h2>

                                        <div className="qr-code">
                                            {/* Chèn mã QR ngân hàng ở đây */}
                                            <img src="https://png.pngtree.com/element_our/20200610/ourlarge/pngtree-mobile-payment-successful-payment-image_2250250.jpg" alt="QR Code" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Recharge;