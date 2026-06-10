import { useEffect, useMemo, useState } from "react";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { api } from "./api";
import { demoRooms } from "./data";
import Header from "./components/Header";
import Hero from "./components/Hero";
import RoomCard from "./components/RoomCard";
import Modal from "./components/Modal";
import AuthForm from "./components/AuthForm";
import RoomForm from "./components/RoomForm";
import RoomDetails from "./components/RoomDetails";

const savedFromStorage = () => new Set(JSON.parse(localStorage.getItem("nestup-saved") || "[]"));

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: "", budget: "", type: "all", sort: "-createdAt" });
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(savedFromStorage);
  const [token, setToken] = useState(localStorage.getItem("nestup-token") || "");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (!modal) return undefined;
    const close = (event) => event.key === "Escape" && setModal(null);
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [modal]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  async function loadRooms() {
    try {
      const data = await api.rooms();
      setRooms(data.rooms?.length ? data.rooms : demoRooms);
    } catch {
      setRooms(demoRooms);
    } finally {
      setLoading(false);
    }
  }

  const filteredRooms = useMemo(() => {
    const city = filters.city.trim().toLowerCase();
    const budget = Number(filters.budget || Infinity);
    return [...rooms]
      .filter((room) => {
        const location = `${room.city} ${room.area}`.toLowerCase();
        const typeMatches = filters.type === "all" || room.type?.includes(filters.type);
        const savedMatches = !savedOnly || saved.has(room._id);
        return (!city || location.includes(city)) && Number(room.rent) <= budget && typeMatches && savedMatches;
      })
      .sort((a, b) => {
        if (filters.sort === "rent") return a.rent - b.rent;
        if (filters.sort === "-rent") return b.rent - a.rent;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [rooms, filters, saved, savedOnly]);

  function updateFilter(key, value) {
    setSavedOnly(false);
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleSearch(event) {
    event.preventDefault();
    document.querySelector("#homes")?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleSaved(roomId) {
    setSaved((current) => {
      const next = new Set(current);
      next.has(roomId) ? next.delete(roomId) : next.add(roomId);
      localStorage.setItem("nestup-saved", JSON.stringify([...next]));
      setToast(next.has(roomId) ? "Saved to your list" : "Removed from saved");
      return next;
    });
  }

  async function submitAuth(mode, values) {
    try {
      if (mode === "register") {
        await api.register(values);
        setToast("Account created. Log in to continue.");
        setModal({ type: "auth", mode: "login" });
      } else {
        const data = await api.login(values);
        localStorage.setItem("nestup-token", data.token);
        setToken(data.token);
        setModal(null);
        setToast("Logged in successfully");
      }
    } catch (error) {
      setToast(error.message);
    }
  }

  async function submitRoom(formData) {
    try {
      await api.addRoom(formData, token);
      setModal(null);
      setToast("Your place is now listed");
      loadRooms();
    } catch (error) {
      setToast(error.message);
    }
  }

  async function sendInquiry(roomId) {
    if (!token) {
      setModal({ type: "auth", mode: "login" });
      setToast("Log in to contact the owner");
      return;
    }
    try {
      await api.inquire(roomId, token);
      setModal(null);
      setToast("Inquiry sent to the owner");
    } catch (error) {
      setToast(error.message);
    }
  }

  function openRoomForm() {
    if (!token) {
      setModal({ type: "auth", mode: "login" });
      setToast("Log in as an owner to list a place");
      return;
    }
    setModal({ type: "room-form" });
  }

  function showSaved() {
    if (!saved.size) {
      setToast("You have not saved any rooms yet");
      return;
    }
    setSavedOnly(true);
    setFilters({ city: "", budget: "", type: "all", sort: "-createdAt" });
    document.querySelector("#homes")?.scrollIntoView({ behavior: "smooth" });
  }

  function logout() {
    localStorage.removeItem("nestup-token");
    setToken("");
    setModal(null);
    setToast("Logged out successfully");
  }

  return (
    <>
      <Header
        savedCount={saved.size}
        isLoggedIn={Boolean(token)}
        onLogin={() => token ? setModal({ type: "account" }) : setModal({ type: "auth", mode: "login" })}
        onRegister={() => setModal({ type: "auth", mode: "register" })}
        onSaved={showSaved}
        onListRoom={openRoomForm}
        onMenu={() => setToast("Search, save or list a place")}
      />

      <main>
        <Hero filters={filters} onFilterChange={updateFilter} onSearch={handleSearch} />

        <section className="homes-section" id="homes">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark"><span /> Freshly added</p>
              <h2>Places worth<br />coming home to</h2>
            </div>
            <p>Handpicked spaces with the details that actually matter, from rent to everyday comforts.</p>
          </div>

          <div className="filter-row">
            <div className="filter-pills">
              {[["all", "All stays"], ["PG", "PG"], ["Room", "Private room"]].map(([value, label]) => (
                <button
                  key={value}
                  className={`filter-pill ${filters.type === value ? "active" : ""}`}
                  onClick={() => updateFilter("type", value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button className="filter-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <SlidersHorizontal /> Filters
            </button>
          </div>

          <div className="results-meta">
            <p>{loading ? "Finding great places..." : `${filteredRooms.length} ${savedOnly ? "saved" : ""} places available`}</p>
            <label>
              Sort by
              <select value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
                <option value="-createdAt">Newest</option>
                <option value="rent">Price: low to high</option>
                <option value="-rent">Price: high to low</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div className="room-grid"><div className="skeleton" /><div className="skeleton" /><div className="skeleton" /></div>
          ) : filteredRooms.length ? (
            <div className="room-grid">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  saved={saved.has(room._id)}
                  onSave={toggleSaved}
                  onOpen={(selected) => setModal({ type: "details", room: selected })}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <SearchX />
              <h3>No places found</h3>
              <p>Try another city or increase your budget.</p>
              <button className="button button-dark" onClick={() => {
                setSavedOnly(false);
                setFilters({ city: "", budget: "", type: "all", sort: "-createdAt" });
              }}>
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="promise-band">
          <div>
            <p className="eyebrow light"><span /> The NestUp promise</p>
            <h2>Search less.<br />Live better.</h2>
          </div>
          <div className="promise-list">
            <article><strong>01</strong><div><h3>Real photos, real places</h3><p>Every listing is reviewed before it reaches you.</p></div></article>
            <article><strong>02</strong><div><h3>Talk directly</h3><p>Connect with owners without unnecessary middlemen.</p></div></article>
            <article><strong>03</strong><div><h3>Know before you go</h3><p>Clear rent, amenities and house details upfront.</p></div></article>
          </div>
        </section>
      </main>

      <footer>
        <span className="brand footer-brand">NestUp</span>
        <p>Good rooms. Honest details. Happier moves.</p>
        <span>© 2026 NestUp</span>
      </footer>

      {modal && (
        <Modal wide={modal.type === "details"} onClose={() => setModal(null)}>
          {modal.type === "auth" && (
            <AuthForm
              key={modal.mode}
              initialMode={modal.mode}
              onSubmit={submitAuth}
              onSwitch={(mode) => setModal({ type: "auth", mode })}
            />
          )}
          {modal.type === "room-form" && <RoomForm onSubmit={submitRoom} />}
          {modal.type === "account" && (
            <div className="modal-body account-panel">
              <p className="eyebrow dark"><span /> Your account</p>
              <h2>You are logged in</h2>
              <p className="modal-subtitle">You can save places, send inquiries and manage owner listings.</p>
              <button className="button button-outline form-submit" onClick={logout}>Log out</button>
            </div>
          )}
          {modal.type === "details" && (
            <RoomDetails
              room={modal.room}
              saved={saved.has(modal.room._id)}
              onSave={toggleSaved}
              onInquire={sendInquiry}
            />
          )}
        </Modal>
      )}

      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </>
  );
}
