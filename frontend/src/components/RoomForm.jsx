import { useState } from "react";
import { ImagePlus } from "lucide-react";

export default function RoomForm({ onSubmit }) {
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    await onSubmit(new FormData(event.currentTarget));
    setBusy(false);
  }

  return (
    <div className="modal-body">
      <p className="eyebrow dark"><span /> For property owners</p>
      <h2>List your place</h2>
      <p className="modal-subtitle">Clear details help students decide with confidence.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field full">
            <span>Listing title</span>
            <input name="title" required placeholder="Bright room near metro" />
          </label>
          <label className="form-field">
            <span>City</span>
            <input name="city" required placeholder="Delhi" />
          </label>
          <label className="form-field">
            <span>Area</span>
            <input name="area" required placeholder="Saket" />
          </label>
          <label className="form-field">
            <span>Monthly rent</span>
            <input name="rent" type="number" min="1" required placeholder="12000" />
          </label>
          <label className="form-field">
            <span>Place type</span>
            <select name="type"><option value="Room">Private room</option><option value="PG">PG</option></select>
          </label>
          <label className="form-field full">
            <span>Facilities</span>
            <input name="facilities" placeholder="Wi-Fi, AC, Meals, Laundry" />
          </label>
          <label className="upload-field full">
            <ImagePlus />
            <span><strong>Add property photos</strong><small>Choose up to 5 clear images</small></span>
            <input name="images" type="file" accept="image/*" multiple />
          </label>
        </div>
        <button className="button button-dark form-submit" disabled={busy}>
          {busy ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
