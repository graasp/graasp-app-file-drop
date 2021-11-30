import React from 'react';
import PropTypes from 'prop-types';
import { SettingsModalProvider } from './SettingsModalContext';

const ModalProviders = ({ children }) => (
  <SettingsModalProvider>{children}</SettingsModalProvider>
);

ModalProviders.propTypes = {
  children: PropTypes.node,
};

ModalProviders.defaultProps = {
  children: null,
};

export default ModalProviders;
