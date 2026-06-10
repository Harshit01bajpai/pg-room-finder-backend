import { Heart, House, Menu, Plus } from "lucide-react";

export default function Header({
  savedCount,
  isLoggedIn,
  onLogin,
  onRegister,
  onSaved,
  onListRoom,
  onMenu,
}) {
  return (
    <header className="site-header">
      <a className="brand" href="#" aria-label="NestUp home">
        <span className="brand-mark"><House size={18} /></span>
        <span>NestUp</span>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        <a className="active" href="#homes">Explore</a>
        <button className="nav-link" onClick={onSaved}>
          Saved <span className="saved-count">{savedCount}</span>
        </button>
        <button className="nav-link" onClick={onListRoom}>List your place</button>
      </nav>

      <div className="header-actions">
        <button className="icon-button mobile-only" onClick={onMenu} aria-label="Open menu">
          <Menu />
        </button>
        <button className="button button-ghost desktop-login" onClick={onLogin}>
          {isLoggedIn ? "Account" : "Log in"}
        </button>
        <button className="button button-dark header-cta" onClick={isLoggedIn ? onListRoom : onRegister}>
          {isLoggedIn ? <><Plus size={17} /> Add room</> : "Create account"}
        </button>
      </div>
    </header>
  );
}
