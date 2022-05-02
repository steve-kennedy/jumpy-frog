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
            return ( <></>




                



            );
        });
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