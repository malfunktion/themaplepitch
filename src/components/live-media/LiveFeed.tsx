export default function LiveFeed() {
  const e = [
    "66' ⚽ Goal",
    "59' 🟨 Yellow card",
    "53' 🔄 Substitution"
  ];
  
  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 font-bold">MATCH FEED</h2>
      {e.map(x => (
        <div key={x} className="border-b py-3">
          {x}
        </div>
      ))}
    </div>
  );
}
