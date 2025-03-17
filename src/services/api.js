const API_BASE_URL = "https://onboardingbackend.onrender.com"; // Change to localhost when testing locally

export async function getData() {
  const response = await fetch(`${API_BASE_URL}/check-db`);
  return response.json();
}

export async function addData(id, name) {
  const response = await fetch(`${API_BASE_URL}/add-sample-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name }), // ✅ Send ID and Name
  });
  return response.json();
}
