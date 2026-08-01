import React from 'react';
import UpcomingFixtureWidget, { UpcomingFixture } from './UpcomingFixtureWidget';
import StandingsWidget from './StandingsWidget';
import SupporterCTA from './SupporterCTA';

export default function ScoutDash() {
  const fixture: UpcomingFixture = {
    homeTeam: 'Forge FC',
    awayTeam: 'Pacific FC',
    league: 'CPL',
    date: 'AUG 03',
    time: '4:00 PM EDT',
    venue: 'Tim Hortons Field',
    ticketUrl: '#'
  };

  const standings = [
    { position: 1, team: 'Forge FC', played: 16, points: 32 },
    { position: 2, team: 'Pacific FC', played: 16, points: 29 },
    { position: 3, team: 'Cavalry FC', played: 16, points: 27 },
  ];

  return (
    <section className="flex flex-col gap-6 lg:col-span-4">
      <UpcomingFixtureWidget fixture={fixture} />
      <StandingsWidget rows={standings} />
      <SupporterCTA />
    </section>
 
