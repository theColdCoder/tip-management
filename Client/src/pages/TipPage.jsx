import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function TipPage() {
  const { slug } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");

  // Fetch worker data from the backend
  const fetchWorker = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workers/${slug}`);
      const data = await response.json();
      setWorker(data);
    } catch (error) {
      console.error("Error fetching worker:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch worker data when the component mounts or when the slug changes
  useEffect(() => {
    fetchWorker();
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!worker) {
    return <p>Worker not found</p>;
  }
  // Function to handle tip amount input
  const tipAmount = (e) => {
    setAmount(e.target.value);
  };

  // Function to create a tip
  const createTip = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid tip amount");
      return;
    }
    try {
      // Send a POST request to the backend to create a tip
      const response = await fetch("http://localhost:3000/api/tips", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          workerId: worker.id,
          amount: Number(amount),
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend error:", errorData);
        throw new Error("Failed to create tip");
      }

      console.log("Tip created successfully:", data);
    } catch (error) {
      console.error("Error creating tip:", error);
    }
  };

  // Function to create a checkout session
  const createCheckout = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid tip amount");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/payments/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workerId: worker.id,
            amount: Number(amount),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <main>
      <h1>Tip Page</h1>

      <h2>{worker.name}</h2>
      <p>{worker.bio}</p>
      <h2>How much would you like to tip?</h2>

      <div>
        <button onClick={() => setAmount(5)}>$5</button>
        <button onClick={() => setAmount(10)}>$10</button>
        <button onClick={() => setAmount(20)}>$20</button>
      </div>

      <input
        type="number"
        placeholder="Enter amount"
        onChange={tipAmount}
        value={amount}
      />

      <button onClick={createCheckout}>
        Checkout {worker.name} {amount && `$${amount}`}
      </button>
    </main>
  );
}

export default TipPage;
