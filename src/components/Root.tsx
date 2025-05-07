import { I18nextProvider } from 'react-i18next';

import {
  CircularProgress,
  CssBaseline,
  ThemeProvider,
  styled,
} from '@mui/material';
import { StyledEngineProvider, createTheme } from '@mui/material/styles';

import {
  WithLocalContext,
  WithTokenContext,
  useObjectState,
} from '@graasp/apps-query-client';

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

const theme = createTheme({
  palette: {
    primary: {
      light: '#5050d2',
      main: '#5050d2',
      dark: '#5050d2',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fff',
      main: '#fff',
      dark: '#fff',
      contrastText: '#fff',
    },
  },
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
                LoadingComponent={<CircularProgress />}
                useGetLocalContext={hooks.useGetLocalContext}
                useAutoResize={hooks.useAutoResize}
                onError={() => {
                  showErrorToast(CONTEXT_FETCHING_ERROR_MESSAGE);
                }}
                defaultValue={window.Cypress ? window.appContext : mockContext}
              >
                <WithTokenContext
                  LoadingComponent={<CircularProgress />}
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
