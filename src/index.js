import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'normalize.css';
import './fontello/css/fontello.css';
import 'toastr/build/toastr.css';
import toastr from 'toastr';
import * as serviceWorker from './serviceWorker';

toastr.options.timeOut = 3000;
toastr.options.hideDuration = 300;

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
