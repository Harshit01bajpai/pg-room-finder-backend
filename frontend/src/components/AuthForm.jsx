import { useState } from "react";

export default function AuthForm({ initialMode, onSubmit, onSwitch }) {
  const [busy, setBusy] = useState(false);
  const register = initialMode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    await onSubmit(initialMode, Object.fromEntries(new FormData(event.currentTarget)));
    setBusy(false);
  }

  return (
    <div className="modal-body">
      <p className="eyebrow dark"><span /> Welcome to NestUp</p>
      <h2>{register ? "Create your account" : "Good to see you again"}</h2>
      <p className="modal-subtitle">
        {register ? "Start finding a place that feels right." : "Log in to save rooms and contact owners."}
      </p>
      <form onSubmit={handleSubmit}>
        {register && (
          <label className="form-field">
            <span>Full name</span>
            <input name="name" required placeholder="Your name" />
          </label>
        )}
        <label className="form-field">
          <span>Email</span>
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>
        <label className="form-field">
          <span>Password</span>
          <input name="password" type="password" minLength="6" required placeholder="Minimum 6 characters" />
        </label>
        {register && (
          <label className="form-field">
            <span>I am looking to</span>
            <select name="role">
              <option value="student">Find a room</option>
              <option value="owner">List my property</option>
            </select>
          </label>
        )}
        <button className="button button-dark form-submit" disabled={busy}>
          {busy ? "Please wait..." : register ? "Create account" : "Log in"}
        </button>
      </form>
      <p className="auth-switch">
        {register ? "Already have an account?" : "New to NestUp?"}
        <button onClick={() => onSwitch(register ? "login" : "register")}>
          {register ? "Log in" : "Create account"}
        </button>
      </p>
    </div>
  );
}
