import React from 'react';
import './Hader.css';
import HeaderLogo from '../../../Assets/Images/HeaderLogo.svg';

const Hader = () => {
  return (
    <div className="Hader">
      <div>
        <img src={HeaderLogo} alt="haderlogo" />
      </div>
    </div>
  );
};

export default Hader;
