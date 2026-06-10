import { Heart, MapPin, MessageCircle } from "lucide-react";

const formatMoney = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));
const fallbackImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=86";

export default function RoomDetails({ room, saved, onSave, onInquire }) {
  return (
    <div className="detail-layout">
      <div className="detail-image" style={{ backgroundImage: `url("${room.images?.[0]?.url || fallbackImage}")` }} />
      <div className="detail-panel">
        <p className="eyebrow dark"><span /> {room.type?.[0] || "Room"}</p>
        <h2>{room.title}</h2>
        <p className="detail-location"><MapPin /> {room.area}, {room.city}</p>
        <p className="detail-price">₹{formatMoney(room.rent)} <small>/ month</small></p>
        <p className="detail-copy">
          A comfortable, verified space with clear pricing. Visit the property and connect directly with the owner.
        </p>
        <div className="detail-facilities">
          {(room.facilities?.length ? room.facilities : ["Verified listing", "Direct owner"]).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="host-line"><small>Hosted by</small><strong>{room.owner?.name || "Verified owner"}</strong></div>
        <div className="detail-actions">
          <button className="button button-dark" onClick={() => onInquire(room._id)}>
            <MessageCircle size={18} /> Send inquiry
          </button>
          <button className={`button button-outline save-detail ${saved ? "saved" : ""}`} onClick={() => onSave(room._id)}>
            <Heart size={18} /> {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
