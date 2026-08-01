export type UpcomingFixture = {
  homeTeam: string;
  homeCity: string;
  awayTeam: string;
  awayCity: string;
  ticketUrl: string | null;
};

export async function getNextFixture(): Promise<UpcomingFixture> {
  return {
    homeTeam: "Forge FC",
    homeCity: "Hamilton, ON",
    awayTeam: "York Utd",
    awayCity: "Toronto, ON",
    ticketUrl: null, // becomes real once affiliate_ticket_link is wired from `matches`
  };
}
