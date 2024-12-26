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

const PaymentPage = () => {
    const location = useLocation();
    const character_chat = location.state?.character;
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState({});
    const [showError, setShowError] = useState(false);
    const { currentUser } = useContext(AuthContext);
    // useEffect(() => {
    //     const fetchCharacter = async () => {
    //         try {
    //             const response = await fetch(`${serverUrl}/api/characters/${id}`, {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": "Bearer " + localStorage.getItem("token")
    //                 }
    //             });
    //             const data = await response.json();
    //             setCharacter(data);
    //         } catch (error) {
    //             console.log("error", error);
    //         }
    //     }

    //     fetchCharacter();
    // }, [id]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBuy = () => {
        setIsModalOpen(true);
    };

    const confirmBuy = () => {
        // Thực hiện hành động mua
        handleClick();
        console.log("Người dùng đã xác nhận mua!");
        setIsModalOpen(false);
    };

    const cancelBuy = () => {
        console.log("Người dùng đã hủy!");
        setIsModalOpen(false);
    };

    const [paymentMethod, setPaymentMethod] = useState(null);
    const handleClick = async () => {
        try {
            // Gọi API
            const response = await axios.post(
                `${config.API_BASE_URL}/api/v1/characters/buy-character/${character_chat.id}`,
                {},  // Nếu có body dữ liệu cần gửi, có thể truyền ở đây
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.access_token}`, // Thêm token vào header
                    },
                }
            );
            navigate('/');

        } catch (err) {

            console.error(err);
            setShowError(true);
        }
    };
    const handleRecharge=()=>{
        navigate('/recharge')
    }
    const handleClose = () => {
        setShowError(false);
    };
    return (
        <div className="payment-page">
            <div className="payment-page-container">
                {/* <Link to={`../../`} className="back-link">
                    <div className="payment-page__header">
                        <div className="payment-page__header__back">
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                        <span className="payment-page__header__title">Quay lại Trang chủ</span>
                    </div>
                </Link> */}
                <div className="payment-page__row">
                    <div className="payment-page-row__info-character">
                        <div className="payment-page__info-character__img">
                            <img src={character_chat.profile_image} alt="character" />
                        </div>
                        <div className="payment-page__info-character__name">
                            {character_chat.name}
                        </div>
                    </div>
                    <div className="payment-page-row__line-separate"></div>
                    <div className="payment-page-row__price">
                        Giá: {character_chat.new_price}

                        <img src={coinImage} alt="Product Image" class="product-image"></img>
                    </div>
                </div>
                <div className="payment-page__center-button">
                    <button className="payment-page__center-button__btn" onClick={handleBuy}>Mua</button>
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <p>Bạn có chắc chắn muốn mua nhân vật này không?</p>
                                <div className="modal-buttons">
                                    <button onClick={confirmBuy}>Xác nhận</button>
                                    <button className="cancel" onClick={cancelBuy}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showError && (
                        <div className="modal">
                            <div className="modal-content">
                                <p>Số tiền trong tài khoản của bạn không đủ</p>
                                <div className="modal-buttons-err">
                                    <button onClick={handleClose}>OK</button>
                                    {/* <button className="cancel" onClick={cancelBuy}>Hủy</button> */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="payment-page__content">
                    <div className="payment-page__content__title">
                        Nạp tiền vào ví
                    </div>
                    <div className="payment-page__content__methods">
                        {paymentMethods.map(method => (
                            <div key={method.id} className={paymentMethod === method.id ? "payment-page__content__methods__item active" : "payment-page__content__methods__item"}
                                onClick={handleRecharge}
                            >
                                <img src={method.img} alt={method.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;