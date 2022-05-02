import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css';

import Play from './pages/play';
import Guide from './pages/guide';
import Leaderboard from './pages/leaderboard';
import Game from './pages/play';

import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';

const TWITTER_HANDLE = 'struikeny';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

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
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </BrowserRouter>
    
            <div className="footer-container">
              <img
                alt="Twitter Logo"
                className="twitter-logo"
                src="/twitter-logo.svg"
              />
              <a
                className="footer-text"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
              >{`Made by Steve Kennedy`}</a>
            </div>
          </div>
      </WalletProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
});
