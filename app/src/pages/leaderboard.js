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
        if (!scores || scores.length < 1) {
            return <div>No scores available :( </div>;
        }

        return scores.map((score, index) => {
            return (

                <div className="score-container">
                    <div className="score" key={index}>
                        <h3>All time</h3>
                        <span>
                            {/* Format as address:score, with score truncated to first/last digits */}
                            {score[0].slice(0, 5) + '..' + score[0].slice(-6)}:{' '}
                            {score[1].toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="score" key={index}>
                        <h3>Your attempts</h3>

                        { score[0] === connectedWallet.walletAddress ? (
                            <span>
                                {score[0].slice(0, 5) + '..' + score[0].slice(-6)}:{' '}
                                {score[1].toString().padStart(2, '0')}
                            </span>                                
                            ) : (
                            <></>
                            )}
                            
                    </div>
                </div>


            );
        });
    };

    return (
        <main className="App">
            <Header />

            <div className="score-board-container">
                <h3>Top Scores</h3>
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