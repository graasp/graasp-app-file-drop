import React from 'react';
// import TeacherView from './TeacherView';
// import { DEFAULT_VIEW, DASHBOARD_VIEW } from '../../../config/views';
// import { getAppInstanceResources } from '../../../actions';
// import Loader from '../../common/Loader';

import Header from './Header';
import AppResources from './AppResources';

const TeacherMode = () => {
  return (
    <>
      <Header />
      <div>
        <AppResources />
      </div>
    </>
  );
};

export default TeacherMode;
