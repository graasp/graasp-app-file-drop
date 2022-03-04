import React, { createContext } from 'react';
import { useTranslation } from 'react-i18next';
import qs from 'qs';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Loader from '../common/Loader';
import { hooks } from '../../config/queryClient';

const TokenContext = createContext();

const TokenProvider = ({ children }) => {
  const { itemId } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  const { t } = useTranslation();
  const { data, isLoading, isError } = hooks.useAuthToken(itemId);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    toast.error(t('An error occured while requesting the token.'));
  }

  const value = data;
  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};

TokenProvider.propTypes = {
  children: PropTypes.node,
};

TokenProvider.defaultProps = {
  children: null,
};

export { TokenContext, TokenProvider };
