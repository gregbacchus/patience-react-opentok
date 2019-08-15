import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { Credentials } from './App';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

function renderApp(credentials: Credentials) {
  ReactDOM.render(
    <App credentials={credentials} />,
    document.getElementById('root')
  );
}

fetch('./session')
  .then(data => data.json())
  .then(renderApp)
  .catch((err) => {
    console.error('Failed to get session credentials', err);
    alert('Failed to get opentok sessionId and token.');
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
