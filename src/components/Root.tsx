import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import i18nConfig from '../config/i18n';
import App from './App';
import {
  QueryClientProvider,
  queryClient,
  ReactQueryDevtools,
  hooks,
} from '../config/queryClient';
import { NODE_ENV, ENV } from '../config/constants';
import { withContext, withToken } from '@graasp/apps-query-client';
import { Loader, theme } from '@graasp/ui';

const Root = () => {
  const AppWithContext = withToken(App, {
    LoadingComponent: <Loader />,
    useAuthToken: hooks.useAuthToken,
    onError: () => {
      console.error('error while getting the token');
    },
  });
  const AppWithContextAndToken = withContext(AppWithContext, {
    LoadingComponent: <Loader />,
    useGetLocalContext: hooks.useGetLocalContext,
    onError: () => {
      console.error('error while getting the context');
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18nConfig}>
        <QueryClientProvider client={queryClient}>
          <AppWithContextAndToken />
          {NODE_ENV === ENV.DEVELOPMENT && <ReactQueryDevtools />}
        </QueryClientProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
};

export default Root;
