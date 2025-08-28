import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardHeader.css';

const DashboardHeader = ({ title }) => {
  return (
    <div className="breadcrumb-area">
      <h4 className="title">{title}</h4>
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/"><i className="fa-light fa-house"></i> Home</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">{title}</li>
      </ul>
    </div>
  );
};

export default DashboardHeader;
