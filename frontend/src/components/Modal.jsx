import { X } from "lucide-react";

export default function Modal({ children, wide = false, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true">
        <button className="modal-close icon-button" onClick={onClose} aria-label="Close"><X /></button>
        {children}
      </section>
    </div>
  );
}
