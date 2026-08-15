'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <div className="max-w-xl text-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-crimson">
          500 // System exception
        </div>
        <h1 className="mt-3 text-4xl font-black">THE SIGNAL BROKE.</h1>
        <p className="mt-4 text-sm text-charcoal-soft">
          Something failed while loading this section. Try again before reporting an issue.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 bg-crimson px-5 py-3 text-xs font-black uppercase text-white"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
