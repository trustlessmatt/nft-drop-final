import React, { useEffect, useState } from 'react';
import './App.css';
import CandyMachine from './CandyMachine';
import MickeyLogo from './mickey_logo.PNG';

// Constants
const TWITTER_HANDLE = 'MickeyDegods';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // state variables
  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found");
          const response = solana.connect({ onlyIfTrusted: true });
          console.log('Connected with public key: ', response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
        } else {
          alert("No Phantom Wallet detected. Please download Phantom.");
        }
      }

    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  // when our component first mounts, check to see if we have a phantom wallet connected
  useEffect(() => {
    // Phantom team recommends to wait until page fully loads
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    // never seen this before:
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <div>
            <img src={MickeyLogo} />
          </div>
          <p className="header">🍦  Mickey DeGods - The Freezer 🍦</p>
          <p className="sub-text">From deep within the walk-in freezer, <br></br>
          long forgotten in dark, icy corners,<br></br>
          lies a secret menu item waiting to be rediscovered.<br></br></p>
          { !walletAddress && renderNotConnectedContainer() }
        </div>
        {/* Check for wallet address and then pass it to CandyMachine */}
        { walletAddress && <CandyMachine walletAddress={window.solana} /> }
        <div className="footer-container">
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >🍟 &nbsp;{`Built by the @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
