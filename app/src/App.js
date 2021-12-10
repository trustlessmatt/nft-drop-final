import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';

// Constants
const TWITTER_HANDLE = '_buildspace';
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
          <p className="header">🍟  Mickey DeGods - Dessert 🍦</p>
          <p className="sub-text">Fair mint test site with Metaplex and Candy Machine</p>
          { !walletAddress && renderNotConnectedContainer() }
        </div>
        {/* Check for wallet address and then pass it to CandyMachine */}
        { walletAddress && <CandyMachine walletAddress={window.solana} /> }
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
