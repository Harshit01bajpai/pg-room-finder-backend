import { Heart, Star } from "lucide-react";

const formatMoney = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));
const fallbackImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=86";

export default function RoomCard({ room, saved, onSave, onOpen }) {
  return (
    <article className="room-card" onClick={() => onOpen(room)}>
      <div className="room-photo">
        <img src={room.images?.[0]?.url || fallbackImage} alt={room.title} loading="lazy" />
        <span className="room-badge">{room.type?.[0] || "Room"}</span>
        <button
          className={`save-button ${saved ? "saved" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onSave(room._id);
          }}
          aria-label={saved ? "Remove from saved" : "Save room"}
        >
          <Heart />
        </button>
      </div>
      <div className="room-info">
        <div className="room-topline">
          <h3>{room.title}</h3>
          <span className="room-rating"><Star /> {room.rating || "New"}</span>
        </div>
        <p className="room-location">{room.area}, {room.city}</p>
        <div className="room-amenities">
          {(room.facilities || []).slice(0, 3).map((item) => <span key={item}>{item}</span>)}
        </div>
        <p className="room-price"><strong>₹{formatMoney(room.rent)}</strong> / month</p>
      </div>
    </article>
  );
}
