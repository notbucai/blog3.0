import React from 'react';

import { useTranslation } from 'react-i18next';

import './styles.scss';

import logoIcon from '@/assets/image/logo-icon.svg'

function Logo ({ collapsed }) {
  const { t } = useTranslation();
  return (
    <div className="logo-wrap">
      <img src={logoIcon} className="logo-icon" alt="logo icon" />
      {!collapsed ? <span>{t('APP_TITLE')}</span> : null}
    </div>
  );
}

export default Logo;
