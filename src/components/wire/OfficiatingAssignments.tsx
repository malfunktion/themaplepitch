import React from 'react';

const assignments = [
  { fixture: 'Forge FC vs. Pacific FC', referee: 'M. Kavanagh', vars: 'D. Barron', date: 'AUG 12' },
  { fixture: 'Cavalry FC vs. Atlético Ottawa', referee: 'T. Nazarko', vars: 'J. Reid', date: 'AUG 13' },
  { fixture: 'Vancouver Rise vs. Calgary Wild', referee: 'S. Deschamps', vars: 'L. Fournier', date: 'AUG 14' },
];

export default function OfficiatingAssignments() {
  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
        <span>OFFICIATING ASSIGNMENTS</span>
        <span className="text-red-600 font-bold">MATCHDAY</span>
      </div>
      <p className="text-xs text-neutral-300">
        Referee appointments and officiating crew logs for upcoming professional fixtures.
      </p>
      <table className="w-full text-left font-mono text-[11px]">
        <thead>
          <tr className="text-charcoal-soft dark:text-neutral-500 border-b border-border dark:border-neutral-800 uppercase text-[9px]">
            <th className="py-1.5 font-normal">Fixture</th>
            <th className="py-1.5 font-normal">Referee</th>
            <th className="py-1.5 font-normal text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 dark:divide-neutral-800/60">
          {assignments.map((a, i) => (
            <tr key={i}>
              <td className="py-1.5 text-charcoal dark:text-neutral-200">{a.fixture}</td>
              <td className="py-1.5 text-charcoal-soft dark:text-neutral-400">{a.referee}</td>
              <td className="py-1.5 text-right text-charcoal-soft dark:text-neutral-400">{a.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
