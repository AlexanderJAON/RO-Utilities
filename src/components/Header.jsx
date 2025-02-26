import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const goToAcidification = () => navigate("/acidification");
  const goToShortage = () => navigate("/shortage");
  const goToPollution = () => navigate("/pollution");
  const goToHome = () => navigate("/");
  const goToQuiz = () => navigate("/quiz");

  return (
    <header className="header">
      <div className="logo" onClick={goToHome}><img src="/images/ingredion.png" alt="" /></div>
      <div className="htittle">Utilities</div>
      <nav className="menu">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <ul className="menu-dropdown">
            <li><button onClick={goToHome}>COGEN</button></li>
            <li><button onClick={goToShortage}>HIDROGENO</button></li>
            <li><button onClick={goToAcidification}>PTAI</button></li>
            <li><button onClick={goToPollution}>PTAR</button></li>
            <li><button onClick={goToQuiz}>NIQUEL</button></li>
          </ul>
        )}
      </nav>
    </header>
  );
}

export default Header;
