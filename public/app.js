const API = "/api";

const demoRooms = [
  {
    _id: "demo-1", title: "Sunlit studio near North Campus", city: "Delhi", area: "Kamla Nagar",
    rent: 12500, type: ["Room"], facilities: ["Wi-Fi", "AC", "Power backup"],
    images: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=84" }],
    owner: { name: "Aarav Mehta" }, rating: 4.8
  },
  {
    _id: "demo-2", title: "Cozy girls PG with meals", city: "Gurugram", area: "Sector 43",
    rent: 9800, type: ["PG"], facilities: ["Meals", "Wi-Fi", "Laundry"],
    images: [{ url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=84" }],
    owner: { name: "Nisha Homes" }, rating: 4.6
  },
  {
    _id: "demo-3", title: "Modern room close to metro", city: "Noida", area: "Sector 62",
    rent: 14500, type: ["Room"], facilities: ["Attached bath", "AC", "Parking"],
    images: [{ url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=84" }],
    owner: { name: "Rohit Singh" }, rating: 4.9
  },
  {
    _id: "demo-4", title: "Greenview coliving for students", city: "Bengaluru", area: "Koramangala",
    rent: 16000, type: ["PG"], facilities: ["Gym", "Meals", "Housekeeping"],
    images: [{ url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=84" }],
    owner: { name: "Greenview Living" }, rating: 4.7
  },
  {
    _id: "demo-5", title: "Quiet furnished room", city: "Pune", area: "Viman Nagar",
    rent: 11000, type: ["Room"], facilities: ["Furnished", "Wi-Fi", "Kitchen"],
    images: [{ url: "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1000&q=84" }],
    owner: { name: "Neha Kulkarni" }, rating: 4.5
  },
  {
    _id: "demo-6", title: "Premium boys PG near Cyber Hub", city: "Gurugram", area: "DLF Phase 3",
    rent: 13500, type: ["PG"], facilities: ["Meals", "AC", "Security"],
    images: [{ url: "https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=1000&q=84" }],
    owner: { name: "Urban Stay" }, rating: 4.8
  }
];

const state = {
  rooms: [], filtered: [], type: "all",
  saved: new Set(JSON.parse(localStorage.getItem("nestup-saved") || "[]")),
  token: localStorage.getItem("nestup-token") || ""
};

const $ = (selector) => document.querySelector(selector);
const roomGrid = $("#roomGrid");

function icons() {
  if (window.lucide) window.lucide.createIcons();
}

function money(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function safeText(value = "") {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}

function imageFor(room, index = 0) {
  return room.images?.[0]?.url || demoRooms[index % demoRooms.length].images[0].url;
}

async function getRooms() {
  try {
    const response = await fetch(`${API}/rooms?limit=30&sort=-createdAt`);
    if (!response.ok) throw new Error("API unavailable");
    const data = await response.json();
    state.rooms = data.rooms?.length ? data.rooms : demoRooms;
  } catch {
    state.rooms = demoRooms;
  }
  applyFilters();
}

function applyFilters() {
  const city = $("#cityInput").value.trim().toLowerCase();
  const budget = Number($("#budgetInput").value || Infinity);
  const sort = $("#sortSelect").value;
  state.filtered = state.rooms.filter(room => {
    const location = `${room.city} ${room.area}`.toLowerCase();
    const matchesType = state.type === "all" || room.type?.includes(state.type);
    return (!city || location.includes(city)) && Number(room.rent) <= budget && matchesType;
  });
  state.filtered.sort((a, b) => {
    if (sort === "rent") return a.rent - b.rent;
    if (sort === "-rent") return b.rent - a.rent;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
  renderRooms();
}

function renderRooms() {
  roomGrid.innerHTML = state.filtered.map((room, index) => `
    <article class="room-card" data-room="${safeText(room._id)}" tabindex="0">
      <div class="room-photo">
        <img src="${imageFor(room, index)}" alt="${safeText(room.title)}" loading="lazy">
        <span class="room-badge">${safeText(room.type?.[0] || "Room")}</span>
        <button class="save-button ${state.saved.has(room._id) ? "saved" : ""}" data-save="${safeText(room._id)}" aria-label="Save ${safeText(room.title)}">
          <i data-lucide="heart"></i>
        </button>
      </div>
      <div class="room-info">
        <div class="room-topline">
          <h3 class="room-title">${safeText(room.title)}</h3>
          <span class="room-rating"><i data-lucide="star"></i>${room.rating || "New"}</span>
        </div>
        <p class="room-location">${safeText(room.area)}, ${safeText(room.city)}</p>
        <div class="room-amenities">${(room.facilities || []).slice(0, 3).map(item => `<span>${safeText(item)}</span>`).join("")}</div>
        <p class="room-price"><strong>₹${money(room.rent)}</strong> / month</p>
      </div>
    </article>
  `).join("");
  $("#resultsText").textContent = `${state.filtered.length} ${state.filtered.length === 1 ? "place" : "places"} available`;
  $("#emptyState").classList.toggle("hidden", state.filtered.length > 0);
  roomGrid.classList.toggle("hidden", state.filtered.length === 0);
  $("#savedCount").textContent = state.saved.size;
  icons();
}

function showModal(content, wide = false) {
  $("#modalContent").innerHTML = content;
  $(".modal").classList.toggle("wide", wide);
  $("#modalBackdrop").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  icons();
}

function closeModal() {
  $("#modalBackdrop").classList.add("hidden");
  document.body.style.overflow = "";
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2500);
}

function roomDetails(room) {
  showModal(`
    <div class="detail-layout">
      <div class="detail-image" style="background-image:url('${imageFor(room)}')"></div>
      <div class="detail-panel">
        <p class="eyebrow dark"><span></span>${safeText(room.type?.[0] || "Room")}</p>
        <h2 id="modalTitle">${safeText(room.title)}</h2>
        <p class="room-location"><i data-lucide="map-pin"></i> ${safeText(room.area)}, ${safeText(room.city)}</p>
        <p class="detail-price">₹${money(room.rent)} <small>/ month</small></p>
        <p>A comfortable, verified space with clear pricing. Visit the property and connect directly with the owner.</p>
        <div class="detail-facilities">${(room.facilities?.length ? room.facilities : ["Verified listing", "Direct owner"]).map(item => `<span>${safeText(item)}</span>`).join("")}</div>
        <p><strong>Hosted by</strong><br>${safeText(room.owner?.name || "Verified owner")}</p>
        <div class="detail-actions">
          <button class="button button-dark" data-inquire="${safeText(room._id)}">Send inquiry</button>
          <button class="button button-outline" data-save="${safeText(room._id)}" aria-label="Save room"><i data-lucide="heart"></i></button>
        </div>
      </div>
    </div>
  `, true);
}

function authModal(mode = "login") {
  const register = mode === "register";
  showModal(`
    <div class="modal-body">
      <p class="eyebrow dark"><span></span>Welcome to NestUp</p>
      <h2 id="modalTitle">${register ? "Create your account" : "Good to see you again"}</h2>
      <p class="modal-subtitle">${register ? "Start finding a place that feels right." : "Log in to save rooms and contact owners."}</p>
      <form id="authForm" data-mode="${mode}">
        ${register ? `<label class="form-field"><span>Full name</span><input name="name" required placeholder="Your name"></label>` : ""}
        <label class="form-field"><span>Email</span><input name="email" type="email" required placeholder="you@example.com"></label>
        <label class="form-field"><span>Password</span><input name="password" type="password" minlength="6" required placeholder="Minimum 6 characters"></label>
        ${register ? `<label class="form-field"><span>I am looking to</span><select name="role"><option value="student">Find a room</option><option value="owner">List my property</option></select></label>` : ""}
        <button class="button button-dark form-submit" type="submit">${register ? "Create account" : "Log in"}</button>
      </form>
      <p class="auth-switch">${register ? "Already have an account?" : "New to NestUp?"} <button data-auth="${register ? "login" : "register"}">${register ? "Log in" : "Create account"}</button></p>
    </div>
  `);
}

function listRoomModal() {
  if (!state.token) {
    authModal("login");
    toast("Log in as an owner to list your place");
    return;
  }
  showModal(`
    <div class="modal-body">
      <p class="eyebrow dark"><span></span>For property owners</p>
      <h2 id="modalTitle">List your place</h2>
      <p class="modal-subtitle">Add clear details and up to five genuine photos.</p>
      <form id="roomForm" enctype="multipart/form-data">
        <div class="form-grid">
          <label class="form-field full"><span>Listing title</span><input name="title" required placeholder="Bright room near metro"></label>
          <label class="form-field"><span>City</span><input name="city" required placeholder="Delhi"></label>
          <label class="form-field"><span>Area</span><input name="area" required placeholder="Saket"></label>
          <label class="form-field"><span>Monthly rent</span><input name="rent" type="number" min="1" required placeholder="12000"></label>
          <label class="form-field"><span>Photos</span><input name="images" type="file" accept="image/*" multiple></label>
        </div>
        <button class="button button-dark form-submit" type="submit">Publish listing</button>
      </form>
    </div>
  `);
}

async function submitAuth(form) {
  const mode = form.dataset.mode;
  const body = Object.fromEntries(new FormData(form));
  try {
    const response = await fetch(`${API}/auth/${mode}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    if (mode === "register") {
      toast("Account created. You can log in now.");
      authModal("login");
    } else {
      state.token = data.token;
      localStorage.setItem("nestup-token", data.token);
      closeModal();
      toast("Logged in successfully");
      $("#loginBtn").textContent = "Account";
    }
  } catch (error) {
    toast(error.message || "Something went wrong");
  }
}

async function submitRoom(form) {
  try {
    const response = await fetch(`${API}/rooms/add`, {
      method: "POST", headers: { Authorization: `Bearer ${state.token}` }, body: new FormData(form)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    closeModal();
    toast("Your place is now listed");
    getRooms();
  } catch (error) {
    toast(error.message || "Could not publish listing");
  }
}

async function sendInquiry(roomId) {
  if (!state.token) {
    authModal("login");
    toast("Log in to contact the owner");
    return;
  }
  try {
    const response = await fetch(`${API}/booking/${roomId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${state.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hi, I am interested in this place. Please share visit details." })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    closeModal();
    toast("Inquiry sent to the owner");
  } catch (error) {
    toast(error.message || "Could not send inquiry");
  }
}

function toggleSave(roomId) {
  state.saved.has(roomId) ? state.saved.delete(roomId) : state.saved.add(roomId);
  localStorage.setItem("nestup-saved", JSON.stringify([...state.saved]));
  renderRooms();
  toast(state.saved.has(roomId) ? "Saved to your list" : "Removed from saved");
}

document.addEventListener("click", (event) => {
  const save = event.target.closest("[data-save]");
  const card = event.target.closest("[data-room]");
  const auth = event.target.closest("[data-auth]");
  const inquire = event.target.closest("[data-inquire]");
  if (save) {
    event.stopPropagation();
    toggleSave(save.dataset.save);
  } else if (auth) {
    authModal(auth.dataset.auth);
  } else if (inquire) {
    sendInquiry(inquire.dataset.inquire);
  } else if (card) {
    roomDetails(state.rooms.find(room => room._id === card.dataset.room));
  }
});

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
  $("#homes").scrollIntoView();
});
$("#typeFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-type]");
  if (!button) return;
  state.type = button.dataset.type;
  document.querySelectorAll("[data-type]").forEach(item => item.classList.toggle("active", item === button));
  applyFilters();
});
$("#sortSelect").addEventListener("change", applyFilters);
$("#clearFilters").addEventListener("click", () => {
  $("#cityInput").value = "";
  $("#budgetInput").value = "";
  state.type = "all";
  document.querySelectorAll("[data-type]").forEach(item => item.classList.toggle("active", item.dataset.type === "all"));
  applyFilters();
});
$("#loginBtn").addEventListener("click", () => state.token ? toast("You are logged in") : authModal("login"));
$("#signupBtn").addEventListener("click", () => authModal("register"));
$("#listRoomBtn").addEventListener("click", listRoomModal);
$("#favoritesBtn").addEventListener("click", () => {
  state.filtered = state.rooms.filter(room => state.saved.has(room._id));
  renderRooms();
  $("#homes").scrollIntoView();
});
$("#filterBtn").addEventListener("click", () => {
  $("#cityInput").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("#menuBtn").addEventListener("click", () => toast("Use search to explore available places"));
$("#modalClose").addEventListener("click", closeModal);
$("#modalBackdrop").addEventListener("click", (event) => {
  if (event.target === $("#modalBackdrop")) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});
document.addEventListener("submit", (event) => {
  if (event.target.id === "authForm") {
    event.preventDefault();
    submitAuth(event.target);
  }
  if (event.target.id === "roomForm") {
    event.preventDefault();
    submitRoom(event.target);
  }
});

if (state.token) $("#loginBtn").textContent = "Account";
window.addEventListener("DOMContentLoaded", () => {
  icons();
  getRooms();
});
