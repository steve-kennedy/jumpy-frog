import { useWallet, useConnectedWallet } from "@terra-money/wallet-provider";

const WalletAddress = () => {
    const connectedWallet = useConnectedWallet();
    const { terraAddress } = { ...connectedWallet };
    const { connect, disconnect } = useWallet();

    return (
        <div className="wallet-info-container">
            {terraAddress? (
                <button className="wallet-info wallet-address">
                    {terraAddress.slice(0,5) + '..' + terraAddress.slice(-6)}
                </button>
            ) : (
                <button className="wallet-info wallet-address">
                    Not Connected
                </button>
            )}

            {terraAddress? (
                <button 
                    className="wallet-info wallet-disconnect"
                    type="button"
                    onClick={() => disconnect()}
                >
                    Disconnect
                </button>
            ) : (
                <button 
                    className="wallet-info wallet-disconnect"
                    type="button"
                    key={`connect-EXTENSION`}
                    onClick={() => connect("EXTENSION")}
                >
                    Connect
                </button>

            )}
        </div>
    );
};

export default WalletAddress;