import * as query from '../contract/query';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { connected } from 'process';
import { useEffect, useState } from 'react';
import Header from '../components/Header';

const Leaderboard = () => {
    const [scores, setScores] = useState();
    const [loading, setLoading] = useState(true);
    const connectedWallet = useConnectedWallet();

    // fetch scores when wallet connected
    useEffect(() => {
        setLoading(true);
        const fetchScores = async() => {
            if (connectedWallet && connectedWallet.network.name === 'testnet') {
                return (await query.getScores(connectedWallet)).scores;
            }
        };

        fetchScores().then(scores => {
            setScores(scores);
            setLoading(false);
        });
    }, [connectedWallet]);

    const renderScores = (scores) => {

        if (!connectedWallet) {
            return <div>Connect wallet to view scores</div>
        } else if (connectedWallet && (!scores || scores.length < 1)) {
            return <div>No scores available :( </div>;
        } else if (connectedWallet && scores) {
            return scores.map((score, index) => {
                return ( 
                    <div className="score" key={index}>
                        <span style={{ color: score[0] === connectedWallet.walletAddress? "red" : ""  }}>
                            {/* Format as address:score, with score truncated to first/last digits */}
                            {index + 1 + '.  '}
                            {score[0].slice(0, 5) + '..' + score[0].slice(-6)}:{' '}
                            {score[1].toString().padStart(2, '0')}
                        </span>
                    </div>
                );
            });
        }
    };

    return (
        <main className="App">
            <Header />

            <div className="score-board-container">
                <h3>Scoreboard</h3>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    renderScores(scores)
                )}
            </div>
        </main>
    )


};

export default Leaderboard;