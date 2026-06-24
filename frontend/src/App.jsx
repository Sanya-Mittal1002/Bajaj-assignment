import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      const response = await fetch(
        "http://localhost:3000/bfhl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: input
              .split("\n")
              .filter(line => line.trim() !== "")
          })
        }
      );

      const data = await response.json();
      setResult(data);

    } catch (err) {
      setError("API Call Failed");
    }
  };

  return (
   <div
  style={{
    padding: "30px",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white"
  }}
>
      <h1
  style={{
    color: "#60a5fa",
    textAlign: "center",
    marginBottom: "20px"
  }}
>
  Hierarchy Analyzer
</h1>

      <textarea
  rows="10"
  cols="50"
  value={input}
  placeholder={`A->B
A->C
B->D`}
  onChange={(e) => setInput(e.target.value)}
  style={{
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #3b82f6",
    background: "#1e293b",
    color: "white",
    width: "100%",
    maxWidth: "600px"
  }}
/>
      <br /><br />

      <button
  onClick={handleSubmit}
  style={{
    padding: "12px 24px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(37,99,235,0.4)"
  }}
>
  Analyze
</button>

      <br /><br />

      {error && <h3>{error}</h3>}

      {result && (
  <div>

    <h2 style={{ color: "#60a5fa" }}>Summary</h2>

    <p>Total Trees: {result.summary.total_trees}</p>

    <p>Total Cycles: {result.summary.total_cycles}</p>

    <p>
      Largest Tree Root:
      {result.summary.largest_tree_root}
    </p>

    <h2 style={{ color: "#60a5fa" }}>Invalid Entries</h2>


    <ul>
      {result.invalid_entries.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

    <h2 style={{ color: "#60a5fa" }}>Duplicate Edges</h2>

    <ul>
      {result.duplicate_edges.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
<h2 style={{ color: "#60a5fa" }}>Hierarchies</h2>

{result.hierarchies.map((tree, index) => (
  <div
    key={index}
   style={{
  background: "#1e293b",
  border: "1px solid #334155",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
}}
  >
    <h3>Root: {tree.root}</h3>

    {tree.has_cycle ? (
      <p>Cycle Detected</p>
    ) : (
      <p>Depth: {tree.depth}</p>
    )}

<pre
  style={{
    background: "#0f172a",
    padding: "10px",
    borderRadius: "8px",
    overflowX: "auto",
    color: "#93c5fd"
  }}
>
  {JSON.stringify(tree.tree, null, 2)}
</pre>
  </div>
))}
  </div>
)}
    </div>
  );
}

export default App;