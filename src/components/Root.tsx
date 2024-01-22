import { I18nextProvider } from 'react-i18next';

import {
  WithLocalContext,
  WithTokenContext,
  useObjectState,
} from '@graasp/apps-query-client';
import { Loader, theme } from '@graasp/ui';

import { CssBaseline, ThemeProvider, styled } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';

import i18nConfig from '../config/i18n';
import {
  CONTEXT_FETCHING_ERROR_MESSAGE,
  TOKEN_REQUEST_ERROR_MESSAGE,
} from '../config/messages';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  queryClient,
} from '../config/queryClient';
import { mockContext as defaultMockContext } from '../data/db';
import { showErrorToast } from '../utils/toasts';
import App from './App';

const RootDiv = styled('div')({
  flexGrow: 1,
  height: '100%',
});

const Root = (): JSX.Element => {
  const [mockContext] = useObjectState(defaultMockContext);

  return (
    <RootDiv>
      {/* Used to define the order of injected properties between JSS and emotion */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <I18nextProvider i18n={i18nConfig}>
            <QueryClientProvider client={queryClient}>
              <WithLocalContext
                LoadingComponent={<Loader />}
                useGetLocalContext={hooks.useGetLocalContext}
                useAutoResize={hooks.useAutoResize}
                onError={() => {
                  showErrorToast(CONTEXT_FETCHING_ERROR_MESSAGE);
                }}
                defaultValue={window.Cypress ? window.appContext : mockContext}
              >
                <WithTokenContext
                  LoadingComponent={<Loader />}
                  useAuthToken={hooks.useAuthToken}
                  onError={() => {
                    showErrorToast(TOKEN_REQUEST_ERROR_MESSAGE);
                  }}
                >
                  <App />
                </WithTokenContext>
              </WithLocalContext>
              {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
            </QueryClientProvider>
          </I18nextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </RootDiv>
  );
};

export default Root;
