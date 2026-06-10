import { ArrowDown, BadgeCheck, IndianRupee, MapPin, MessageCircle, Search, ShieldCheck } from "lucide-react";

export default function Hero({ filters, onFilterChange, onSearch }) {
  return (
    <section className="hero">
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow"><span /> Rooms that match your life</p>
        <h1>Find your next<br /><em>happy place.</em></h1>
        <p className="hero-copy">
          Verified PGs and rooms near your college or workplace. No endless calls,
          no surprise charges.
        </p>

        <form className="search-bar" onSubmit={onSearch}>
          <label className="search-field">
            <MapPin />
            <span>
              <small>Where</small>
              <input
                value={filters.city}
                onChange={(event) => onFilterChange("city", event.target.value)}
                placeholder="City or area"
              />
            </span>
          </label>
          <span className="search-divider" />
          <label className="search-field">
            <IndianRupee />
            <span>
              <small>Monthly budget</small>
              <select
                value={filters.budget}
                onChange={(event) => onFilterChange("budget", event.target.value)}
              >
                <option value="">Any budget</option>
                <option value="8000">Up to ₹8,000</option>
                <option value="12000">Up to ₹12,000</option>
                <option value="18000">Up to ₹18,000</option>
                <option value="25000">Up to ₹25,000</option>
              </select>
            </span>
          </label>
          <button className="search-button" type="submit"><Search /><span>Search</span></button>
        </form>

        <div className="hero-trust">
          <span><BadgeCheck /> Verified listings</span>
          <span><ShieldCheck /> Safe visits</span>
          <span><MessageCircle /> Direct contact</span>
        </div>
      </div>
      <a className="scroll-cue" href="#homes" aria-label="See available homes"><ArrowDown /></a>
    </section>
  );
}
