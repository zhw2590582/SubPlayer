import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import NProgress from 'nprogress';
import * as serviceWorker from './serviceWorker';
import { isMobile } from './utils';
import { setTranslations, t } from 'react-i18nify';
import i18n from './i18n';
import 'normalize.css';
import './fontello/css/fontello.css';
import 'nprogress/nprogress.css';
import 'react-virtualized/styles.css';

setTranslations(i18n);
NProgress.configure({ minimum: 0, showSpinner: false });
ReactDOM.render(isMobile() ? t('access') : <App />, document.getElementById('root'));
serviceWorker.unregister();
