import React, { useEffect } from "react";
import axios from 'axios';
import { useState } from "react";
import { useNavigate  } from "react-router-dom"
import './CharacterSelection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
 import character from "../../services/database"
import { faComment } from '@fortawesome/free-solid-svg-icons';
import config from "../../config"; 
const serverUrl = "http://localhost:3005";


const CharacterSelection = () => {
    const user = JSON.parse(localStorage.getItem("user"));
     const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState({ id: 1 });
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        if (currentUser) {
            //console.log("Current user hehe:", currentUser);
           //console.log("day la token"+ currentUser.access_token)
        } else {
            console.log("No user is logged in.");
        }
    }, [currentUser]); // Sử dụng useEffect để log thông tin khi người dùng thay đổi

    useEffect(() => {
        const fetchCharacters = async () => {
            console.log("kiem tra token "+ currentUser.access_token)
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/v1/characters/users`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentUser.access_token}`
                    },
                
                });
               
                const data = await response.json();
                if (data.length > 0) {
                    setSelectedCharacter(data[0]);
                }
                setCharacters(data);
                console.log("kiểm tra gia trị"+ characters["characters"])
            } catch (error) {
                console.log("error", error);
            }
        }

        fetchCharacters();
    }, []);
    useEffect(() => {
        console.log("Kiểu dữ liệu của characters:", typeof characters);
        console.log("Nội dung của characters:", characters);
    }, [characters]);
    
    
    const handleSelectCharater = (character) => {
       // console.log("Kiem tra gia trị truyèn vao  " + character);
        navigate(`/chat/${character.id}`, { state: { character } });
    };

    const handleShoppingCharacter = (character) => {
        navigate(`/payment/${character.id}`, { state: { character } });
    };

    return (
        <div className="characterSelection">
            {
                 characters["characters"] && characters["characters"].map((character, index) => (
                    <img key={index} src={character.profile_image}
                   
                        className={
                            selectedCharacter.id === character.id ? "characterSelection-background characterSelection-background__selected" : "characterSelection-background"
                        }
                        alt="background"
                    />
                ))
            }
            {
                 characters["characters"] && characters["characters"].map((character, index) => (
                
                    <div key={index}>
                        <div key={index}
                            className={"characterSelection-description " + (selectedCharacter.id === character.id ? "characterSelection-description__selected" : "")}
                        >
                            <p className="characterSelection-description-text">{character.description}</p>
                        </div>
                        {
                            (character.own) ? (
                                <div className={"characterSelection-action " + (selectedCharacter.id === character.id? "characterSelection-action--active" : "")}>
                                    <button className="characterSelection-action-button" onClick={() => {
                                    
                                        handleSelectCharater(character)}}>
                                        <FontAwesomeIcon icon={faComment} />
                                    </button>
                                </div>
                            ): (
                                <div className={"characterSelection-action " + (selectedCharacter.id === character.id? "characterSelection-action--active" : "")}>
                                    <button className="characterSelection-action-button" onClick={() => handleShoppingCharacter(character)}
                              
                                >
                                        <FontAwesomeIcon icon={faCartShopping} />
                                    </button>
                                </div>
                            )
                        }
                    </div>
                ))
            }
            {/* <FontAwesomeIcon icon={faCartShopping} /> */}
            <div className="characterSelection-sidebar">
                <h1 className="characterSelection-title">Chọn nhân vật</h1>
                <ul className="characterSelection-list">
                    {
                      characters["characters"] && characters["characters"].map((character, index) => (
                            <li key={index} className={
                                selectedCharacter.id === character.id ? "characterSelection-item characterSelection-item__selected" : "characterSelection-item"
                            } onClick={() =>{ 
                                 setSelectedCharacter(character);
             
                            }
                            }>
                                <img className="characterSelection-item-img" src={character.profile_image} alt={character.name} />
                                <span className="characterSelection-item-name">{character.name}</span>
                                {
                                    (!character.own) ? <span className="characterSelection-item-locked">
                                        <FontAwesomeIcon icon={faLock} className="characterSelection-item-locked-icon" />
                                    </span> : null
                                }
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default CharacterSelection;