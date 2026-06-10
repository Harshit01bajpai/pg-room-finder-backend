const jsonHeaders = { "Content-Type": "application/json" };

async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  rooms: () => request("/rooms?limit=30&sort=-createdAt"),
  login: (body) =>
    request("/auth/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(body),
    }),
  register: (body) =>
    request("/auth/register", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(body),
    }),
  addRoom: (formData, token) =>
    request("/rooms/add", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }),
  inquire: (roomId, token) =>
    request(`/booking/${roomId}`, {
      method: "POST",
      headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        message: "Hi, I am interested in this place. Please share visit details.",
      }),
    }),
};
