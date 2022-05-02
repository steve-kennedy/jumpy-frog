import Header from '../components/Header';

const Guide = () => {
    return (
        <main className="App">
            <Header />

            <div className="score-board-container">
                <h3>How to play</h3>

                <div>
                    <p className="help">
                        * Left mouse click  to start the game and make the frog jump
                    </p>
                    <p className="help">
                        * Don't let the frog touch the ground or collide with a pipe
                    </p>
                    <p className="help">
                        * Each pipe cleared earns you points while increasing the difficulty
                    </p>
                    <p className="help">
                        * Submit your score to the Terra blockchain to be immortalized on the scoreboard
                    </p>

                </div>

            </div>

        </main>
    );
};

export default Guide;