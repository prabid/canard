import React from 'react';
import "./Header.css";

const Header = (props) => (
  <div className="header">
    <span className="headerText">{props.title}</span>
  </div>
);

export default Header;