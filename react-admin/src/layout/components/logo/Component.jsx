import React from 'react';

import './styles.scss';

import logoIcon from '@/assets/image/logo-icon.svg'

function Logo ({ collapsed }) {
  return (
    <div className="logo-wrap">
      <img src={logoIcon} className="logo-icon" alt="logo icon" />
      {!collapsed ? <span>不才的博客</span> : null}
    </div>
  );
}

export default Logo;
