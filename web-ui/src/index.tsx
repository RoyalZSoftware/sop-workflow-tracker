import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PluginManager } from '@sop-workflow-tracker/react-plugin-engine';
import { CommentsPlugin } from '@sop-workflow-tracker/comments-plugin';
import { ImagesPlugin } from '@sop-workflow-tracker/images-plugin';
import { HashnodePlugin } from './pages/hashnode-plugin';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const pluginManager = new PluginManager();

pluginManager.registerPlugin(new CommentsPlugin());
pluginManager.registerPlugin(new HashnodePlugin());
pluginManager.registerPlugin(new ImagesPlugin());

root.render(
  <React.StrictMode>
    <App pluginManager={pluginManager}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
