import Header from '../components/Header';

const Guide = () => {
    return (
        <main className="App">
            <Header />

            <div className="score-board-container">
                <h3>Terra testnet</h3>

                <div>
                    <p className="help">
                        * Make sure you're connected to the Terra testnet, via your Terra Station Wallet &gt; Gear Icon &gt; Network
                    </p>
                    <p className="help">
                        * To get free testnet tokens, go to <a href="https://faucet.terra.money/" target="_blank" rel="noreferrer">Terra faucet</a>
                    </p>
                    <p className="help">
                        * Submit your score to the Terra blockchain to be immortalized on the scoreboard. Only your highest score will be recorded!
                    </p>

                </div>

                <h3>How to play</h3>
                <div>
                    <p className="help">
                        * Left mouse click  to start the game and make the frog jump
                    </p>
                    <p className="help">
                        * Don't let the frog touch the ground or collide with a pipe
                    </p>
                    <p className="help">
                        * Each pipe cleared earns you score while increasing the difficulty
                    </p>
                </div>  



            </div>

        </main>
    );
};

export default Guide;