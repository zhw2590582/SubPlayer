import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'normalize.css';
import './fontello/css/fontello.css';
import 'toastr/build/toastr.css';
import toastr from 'toastr';
import 'nprogress/nprogress.css';
import 'react-virtualized/styles.css';
import NProgress from 'nprogress';
import * as serviceWorker from './serviceWorker';

toastr.options.timeOut = 3000;
toastr.options.hideDuration = 300;

NProgress.configure({ minimum: 0, showSpinner: false });

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
