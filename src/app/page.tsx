import { homeLayout } from '@/lib/homeLayout.config';
// ...your existing imports stay the same

export default function Home() {
  // ...your existing mock data (featured, rest, standings, fixture) stays exactly as is

  const sections: Record<string, React.ReactNode> = {
    hero: featured ? <HeroDossier story={featured} /> : null,
    wire: <WireFeedList stories={rest} />,
    scout: <ScoutDash standings={standings} fixture={fixture} />,
  };

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeLayout.map(({ id, span }) => (
          <div key={id} className={span}>{sections[id]}</div>
        ))}
      </div>
    </main>
  );
}
