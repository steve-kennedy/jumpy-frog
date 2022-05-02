import { Link } from 'react-router-dom';
import WalletAddress from './WalletAddress';

const Header = () => {

    const renderHeader = () => {
        return (
            <header>
                <Link className="home-link" to="/">
                
                <div className="header-titles">
                    <h1>🐸 Jumpy Frog</h1>
                    <p>Stay in the air as long as possible without hitting a pipe!</p>
                </div>
                
                </Link>
                <WalletAddress />
            </header>
            
        )
    };

    return renderHeader();

};

export default Header;


