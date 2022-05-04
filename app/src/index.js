import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css';
import AuthorInfo from './components/AuthorInfo';

import Play from './pages/play';
import Guide from './pages/guide';
import Scoreboard from './pages/scoreboard';

import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <React.StrictMode>
      <WalletProvider {...chainOptions}>
        <div className="App-header">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/play" element={<Play />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
              </Routes>
            </BrowserRouter>
    
            <div className="footer-container">
              <AuthorInfo />
            </div>
          </div>
      </WalletProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
});
