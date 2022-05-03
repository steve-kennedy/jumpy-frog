import './App.css';
import Menu from './components/Menu';
import Header from './components/Header';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import jumpyFrogImg from './images/jumpy-frog.png';

function App() {
  const { status, connect, availableConnectTypes } = useWallet();

  console.log("Wallet status is: ", status);
  console.log("Available connection types are: ", availableConnectTypes);

  const renderConnectButton = () => {
    if (status === WalletStatus.WALLET_NOT_CONNECTED) {

      return (
        <div className="connect-wallet-div">
          <button
            className="cta-button connect-wallet-button"
            type="button"
            key={`connect-EXTENSION`}
            onClick={() => connect("EXTENSION")}
          >
          Connect Terra Station Wallet
          </button>
        </div>
      );
    }
  };

  return (
    <main className="App">
      <Header />

      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <div>
        <img
          src={jumpyFrogImg} alt="Jumpy Frog game" width="240"
        />
        <p></p>
      </div>
      )}

      {status === WalletStatus.WALLET_CONNECTED && (
        <div className="game-menu-container">
          <Menu />
        </div>
      )}

      {renderConnectButton()}

    </main>
  );
};

export default App;
