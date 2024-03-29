import { Link } from 'react-router-dom';

const menu_options = [
    { name: 'Play', link: '/play' },
    { name: 'Scoreboard', link: '/scoreboard' },
    { name: 'How to play', link: '/guide'},
];

const Menu = () => {
    const renderMenu = () => {
        return menu_options.map((mb, index) => {
            const { name, link } = mb;

            return (
                <Link className="menu-item" to={link} key={index}>
                    <span className="item-text">{name}</span>
                </Link>
            );
        });
    };
    return <div className="game-menu">{renderMenu()}</div>;
};

export default Menu;