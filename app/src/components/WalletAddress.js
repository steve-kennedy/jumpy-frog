import { useWallet, useConnectedWallet, WalletStatus } from "@terra-money/wallet-provider";

const WalletAddress = () => {
    const connectedWallet = useConnectedWallet();
    const { terraAddress } = { ...connectedWallet };
    const { status, connect, disconnect } = useWallet();

    const renderConnectedInfo = () => {
        return (
            <button className="wallet-info wallet-address">
                {terraAddress.slice(0,5) + '...' + terraAddress.slice(-5)}
            </button>
        )
    };

    const renderNotConnectedInfo = () => {
        return (
            <button className="wallet-info wallet-address">
                Not Connected
            </button>
        )
    };

    const renderWrongNetworkInfo = () => {
        return (
            <button className="wallet-info wallet-address">
                Wrong Network!
                Choose testnet and reconnect
            </button>
        )
    }

    const renderConnectButton = () => {
        return (
            <button 
                className="wallet-info wallet-disconnect"
                type="button"
                key={`connect-EXTENSION`}
                onClick={() => connect("EXTENSION")}
            >
                Connect
            </button>
        )
    }

    const renderDisonnectButton = () => {
        return (
            <button 
                className="wallet-info wallet-disconnect"
                type="button"
                onClick={() => disconnect()}
            >
                Disconnect
            </button>
        )
    } 

    const renderReconnectButton = () => {

    }

    return (
        <div className="wallet-info-container">
            {/* Wallet connected to testnet, display wallet address and disconnect button */}
            { (terraAddress && (connectedWallet.network.name === 'testnet') 
                && renderConnectedInfo()) }
            { (terraAddress && (connectedWallet.network.name === 'testnet') 
                && renderDisonnectButton()) }

            {/* Wallet not connected, display not connected and connect button */}
            { (!terraAddress)
                && renderNotConnectedInfo() }
            { (!terraAddress)
                && renderConnectButton() }

            {/* Wallet connected to wrong network, display wrong network info and refresh button */}
            { (terraAddress && (connectedWallet.network.name !== 'testnet')
                && renderWrongNetworkInfo() )}
            { (terraAddress && (connectedWallet.network.name !== 'testnet')
                && renderConnectButton() )}
        </div>
    );

};

export default WalletAddress;