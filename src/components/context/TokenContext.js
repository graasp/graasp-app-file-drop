import React, { createContext } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Loader from '../common/Loader';
import { hooks } from '../../config/queryClient';

const TokenContext = createContext();

const TokenProvider = ({ children }) => {
  const { data, isLoading, isError } = hooks.useAuthToken({
    origin: window.location.origin,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    toast.error('An error occured while requesting the token.');
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
