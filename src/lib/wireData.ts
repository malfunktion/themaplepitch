// src/lib/wireData.ts
//
// Everything that used to live here (WIRE_STORIES mock data, the
// WireStoryItem shape, the old wire-vocabulary CATEGORIES list) is gone —
// /the-wire and the homepage both read live data from Sanity now via
// lib/data/newsWire.ts's getWireFeed(). This file is down to the one
// export that's still real content, not mock data: the provincial
// sub-league codes used by the Wire's Provincial filter sub-tabs.
export const PROVINCIAL_SUBS = ['L1O', 'L1BC', 'L1QC', 'L1A'];
