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
        img: 'https://cdn.garenanow.com/webmain/static/payment_center/vn/menu/vnshopeepay_pc.png'
    },
    {
        id: 2,
        name: 'MasterCard',
        img: 'https://www.mastercard.com.vn/content/dam/mccom/global/logos/logo-mastercard-mobile.svg'
    },
    {
        id: 3,
        name: 'Viettel',
        img: 'https://cdn-gop-garenanow-com.obs.myhuaweicloud.com/cdn.garenanow.com/webmain/static/payment_center/vn/menu/VT-SMS.png'
    },
    {
        id: 4,
        name: 'Mobifone',
        img: 'https://cdn-gop-garenanow-com.obs.myhuaweicloud.com/cdn.garenanow.com/webmain/static/payment_center/vn/menu/Mobifone-SMS.png'
    },
    {
        id: 5,
        name: 'ZaloPay',
        img: 'data:image/png;base64,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'
    },
    {
        id: 6,
        name: 'ATM',
        img: 'https://cdn-gop.garenanow.com/webmain/static/payment_center/vn/menu/vn_new_atm_140x87.png'
    }
]

const PaymentPage = () => {
    const location = useLocation();
    const character_chat = location.state?.character;
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState({});
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
        }
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
                </div>
                <div className="payment-page__content">
                    <div className="payment-page__content__title">
                        Nạp tiền vào ví
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
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;