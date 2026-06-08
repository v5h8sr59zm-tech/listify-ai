"use client";

export function StarterButton() {
  const handleClick = async () => {
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "starter" }),
      });
      const data = await res.json();
      console.log("Stripe response:", data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="block w-full bg-white text-orange-500 py-3 rounded-xl font-bold hover:bg-orange-50 text-center cursor-pointer"
    >
      Passer Starter
    </button>
  );
}

export function ProButton() {
  const handleClick = async () => {
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const data = await res.json();
      console.log("Stripe response:", data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="block w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 text-center cursor-pointer"
    >
      Passer Pro
    </button>
  );
}