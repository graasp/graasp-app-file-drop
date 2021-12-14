import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useMutation } from 'react-query';
import { withTranslation, useTranslation } from 'react-i18next';
import { DragDrop } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import configureUppy from '../../utils/uppy';
import { AppDataContext } from '../context/AppDataContext';
import {
  APP_DATA_ENDPOINT,
  APP_ITEMS_ENDPOINT,
  DEFAULT_POST_REQUEST,
} from '../../config/api';
import { APP_INSTANCE_RESOURCE_FORMAT } from '../../config/formats';
import { DEFAULT_VISIBILITY } from '../../config/settings';

const Uploader = () => {
  const { t } = useTranslation();
  const [uppy, setUppy] = useState(null);
  const {
    apiHost,
    itemId,
    offline,
    standalone,
    spaceId,
    appInstanceId,
    userId,
    token,
    reFetch,
    setReFetch,
  } = useContext(AppDataContext);
  const visibility = DEFAULT_VISIBILITY;
  console.log('token');
  console.log(token);
  console.log('itemId');
  console.log(itemId);
  const { mutateAsync, isloading } = useMutation((id, data, type) => {
    console.log('inside');
    console.log(id);
    console.log(isloading);
    // const url = `${apiHost}/${APP_ITEMS_ENDPOINT}/upload?id=${itemId}`;
    const url = `${apiHost}/${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}`;
    const body = {
      data,
      type,
      format: APP_INSTANCE_RESOURCE_FORMAT,
      appInstance: appInstanceId,
      // here you can specify who the resource will belong to
      // but applies if the user making the request is an admin
      user: userId,
      visibility,
    };
    const response = fetch(url, {
      body: JSON.stringify({
        data: body,
        type: 'file',
      }),
      ...DEFAULT_POST_REQUEST,
      headers: {
        ...DEFAULT_POST_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  });

  const onComplete = result => {
    console.log('oncomplete');
    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (!result?.failed.length) {
      // eslint-disable-next-line no-unused-vars
      mutateAsync(itemId).then(async response => {
        setReFetch(!reFetch);
        console.log(reFetch);
      });
    }

    return false;
  };

  const applyUppy = () =>
    setUppy(
      configureUppy({
        t,
        offline,
        standalone,
        spaceId,
        appInstanceId,
        visibility,
        onComplete,
        userId,
      }),
    );

  useEffect(() => {
    applyUppy();

    return () => {
      uppy?.close();
    };
  }, []);

  useEffect(() => {
    applyUppy();
    // update uppy configuration each time itemId changes
  }, [itemId]);

  if (!uppy) {
    return null;
  }
  return (
    <>
      <DragDrop
        uppy={uppy}
        locale={{
          strings: {
            dropHereOr: t('Drop Here or Click to Browseeee'),
          },
        }}
      />
      {console.log(uppy)}
    </>
  );
};

const TranslatedComponent = withTranslation()(Uploader);

export default connect()(TranslatedComponent);
