export type ChannelCategory = 'sports' | 'faith' | 'all';

export interface Program {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  category: ChannelCategory;
  rating?: string;
  directorOrSpeaker?: string;
  genre?: string;
  year?: number;
  isLive?: boolean;
  matchInfo?: {
    competition: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    minute: string;
    status: 'LIVE' | 'HALFTIME' | 'UPCOMING' | 'FULLTIME';
    stadium: string;
  };
}

export interface Channel {
  id: string;
  number: number;
  name: string;
  network: 'Sky Sports' | 'TNT Sports' | 'DAZN' | 'beIN Sports' | 'SuperSport' | 'Faith TV' | 'Custom';
  category: 'sports' | 'faith';
  tagline: string;
  streamUrl: string;
  fallbackStreamUrl?: string;
  logo: string;
  badgeColor: string;
  resolution: string;
  viewers: number;
  featured?: boolean;
  programs: Program[];
  currentProgram: Program;
  nextProgram: Program;
}

export interface FootballMatch {
  id: string;
  competition: string;
  competitionBadge: string;
  channelId: string;
  channelName: string;
  channelLogo: string;
  homeTeam: string;
  homeLogo: string;
  homeScore: number;
  awayTeam: string;
  awayLogo: string;
  awayScore: number;
  minute: string;
  status: 'LIVE' | 'HT' | 'UPCOMING' | 'FT';
  kickoffTime: string;
  venue: string;
  referee: string;
  stats: {
    possessionHome: number;
    possessionAway: number;
    shotsHome: number;
    shotsAway: number;
    shotsOnTargetHome: number;
    shotsOnTargetAway: number;
    cornersHome: number;
    cornersAway: number;
    foulsHome: number;
    foulsAway: number;
  };
  events: {
    minute: string;
    type: 'goal' | 'card' | 'sub' | 'var';
    team: 'home' | 'away';
    player: string;
    detail?: string;
  }[];
}

export interface PrayerRequest {
  id: string;
  author: string;
  location?: string;
  text: string;
  timestamp: string;
  prayingCount: number;
  category: 'Healing' | 'Deliverance' | 'Family' | 'Guidance' | 'Thanksgiving' | 'General';
}

export interface WatchlistReminder {
  programId: string;
  channelId: string;
  channelName: string;
  programTitle: string;
  startTime: string;
  savedAt: string;
}
