export type SongSummary = {
  id: string;
  title: string;
  snippet: string;
  likes: number;
  genre: string;
  mood: string;
  author: string;
  createdAt?: string;
  cover?: string;
};

export type PromptHistoryItem = {
  id: string;
  title: string;
  createdAt: string;
  tags: string[];
  status: "draft" | "generated";
};

export type LyricDetail = {
  id: string;
  title: string;
  genre: string;
  mood: string;
  generatedBy: string;
  createdAt: string;
  sections: Array<{
    heading: string;
    lines: string[];
  }>;
  stats: {
    likes: number;
    shares: number;
    copies: number;
  };
  comments: Array<{
    id: string;
    author: string;
    avatar: string;
    timestamp: string;
    message: string;
  }>;
};

export const topSongs: SongSummary[] = [
  {
    id: "midnight-drive",
    title: "Midnight Drive",
    snippet:
      '"Streetlights paint the road in gold, a story in the night unfolds..."',
    likes: 1284,
    genre: "Synthwave",
    mood: "Nostalgic",
    author: "NovaMuse",
    createdAt: "3 days ago",
  },
  {
    id: "echoes-in-the-rain",
    title: "Echoes in the Rain",
    snippet:
      '"Every drop a memory\'s name, washing over joy and pain..."',
    likes: 1152,
    genre: "Ambient Pop",
    mood: "Reflective",
    author: "ChordCaster",
    createdAt: "5 days ago",
  },
  {
    id: "chrome-horizon",
    title: "Chrome Horizon",
    snippet:
      '"Circuits hum a silent tune, beneath the cybernetic moon..."',
    likes: 987,
    genre: "Electro Pop",
    mood: "Futuristic",
    author: "PixelPoet",
    createdAt: "1 week ago",
  },
  {
    id: "faded-polaroid",
    title: "Faded Polaroid",
    snippet:
      '"Colors bleed in sepia haze, lost inside these summer days..."',
    likes: 921,
    genre: "Indie",
    mood: "Bittersweet",
    author: "LyricLoom",
    createdAt: "1 week ago",
  },
  {
    id: "oceans-lullaby",
    title: "Ocean\'s Lullaby",
    snippet:
      '"Tide pulls out the setting sun, a day is over, race is run..."',
    likes: 855,
    genre: "Acoustic",
    mood: "Calming",
    author: "SeaGlass",
    createdAt: "10 days ago",
  },
  {
    id: "city-of-glass",
    title: "City of Glass",
    snippet:
      '"Towers piercing velvet skies, reflecting truths and telling lies..."',
    likes: 798,
    genre: "Alternative",
    mood: "Moody",
    author: "SkylineScribe",
    createdAt: "2 weeks ago",
  },
  {
    id: "velvet-chains",
    title: "Velvet Chains",
    snippet:
      '"Bound together, you and I, beneath a star-crossed, watching sky..."',
    likes: 743,
    genre: "Ballad",
    mood: "Romantic",
    author: "Heartline",
    createdAt: "2 weeks ago",
  },
  {
    id: "dusty-record",
    title: "Dusty Record",
    snippet:
      '"Needle drops, a crackle starts, playing symphonies of broken hearts..."',
    likes: 689,
    genre: "Lo-fi",
    mood: "Melancholic",
    author: "VinylVerse",
    createdAt: "3 weeks ago",
  },
  {
    id: "neon-bloom",
    title: "Neon Bloom",
    snippet:
      '"Concrete cracks and flowers grow, in the city\'s artificial glow..."',
    likes: 612,
    genre: "Synth Pop",
    mood: "Upbeat",
    author: "MetroMuse",
    createdAt: "3 weeks ago",
  },
  {
    id: "silent-stars",
    title: "Silent Stars",
    snippet:
      '"Watching from a million years, witnessing our hopes and fears..."',
    likes: 576,
    genre: "Ambient",
    mood: "Dreamy",
    author: "AstralLines",
    createdAt: "1 month ago",
  },
];

export const userSongs: SongSummary[] = [
  {
    id: "midnight-drive",
    title: "Midnight Drive",
    snippet:
      '"Streetlights paint the road in gold, a story in the night unfolds..."',
    likes: 1284,
    genre: "Synthwave",
    mood: "Nostalgic",
    author: "You",
    createdAt: "3 days ago",
  },
  {
    id: "neon-bloom",
    title: "Neon Bloom",
    snippet:
      '"Concrete cracks and flowers grow, in the city\'s artificial glow..."',
    likes: 612,
    genre: "Synth Pop",
    mood: "Upbeat",
    author: "You",
    createdAt: "1 week ago",
  },
  {
    id: "ghosts-of-lights",
    title: "Ghosts of Lights",
    snippet:
      '"Lanterns sway like restless souls, guiding me through city shoals..."',
    likes: 488,
    genre: "Indietronica",
    mood: "Mystic",
    author: "You",
    createdAt: "2 weeks ago",
  },
  {
    id: "lilac-hum",
    title: "Lilac Hum",
    snippet:
      '"Whispers bloom in evening air, purple dreams beyond compare..."',
    likes: 352,
    genre: "Dream Pop",
    mood: "Serene",
    author: "You",
    createdAt: "3 weeks ago",
  },
];

export const latestSongs: SongSummary[] = [
  {
    id: "midnight-reverie",
    title: "Midnight Reverie",
    snippet:
      '"Streetlights paint the pavement gold, a story in the rain, untold..."',
    likes: 245,
    genre: "Indie Pop",
    mood: "Melancholic",
    author: "UserX",
    createdAt: "12 minutes ago",
  },
  {
    id: "electric-heartline",
    title: "Electric Heartline",
    snippet:
      '"Neon veins and whispers, pulsing through the night, we won\'t fade away..."',
    likes: 188,
    genre: "Synth Pop",
    mood: "Energetic",
    author: "LunaCodes",
    createdAt: "27 minutes ago",
  },
  {
    id: "celestial-bloom",
    title: "Celestial Bloom",
    snippet:
      '"Petals drifting in zero gravity, finding love in cosmic clarity..."',
    likes: 156,
    genre: "Ambient",
    mood: "Dreamy",
    author: "OrbitMuse",
    createdAt: "45 minutes ago",
  },
  {
    id: "paper-lantern-sky",
    title: "Paper Lantern Sky",
    snippet:
      '"Lanterns carry our hopes tonight, folding wishes into candlelight..."',
    likes: 132,
    genre: "Acoustic",
    mood: "Hopeful",
    author: "VerseWeaver",
    createdAt: "1 hour ago",
  },
  {
    id: "neon-promise",
    title: "Neon Promise",
    snippet:
      '"All the city lights obey us, painting vows across the skyline..."',
    likes: 119,
    genre: "Electro Pop",
    mood: "Romantic",
    author: "GlitchHearts",
    createdAt: "2 hours ago",
  },
  {
    id: "embers-of-tomorrow",
    title: "Embers of Tomorrow",
    snippet:
      '"We gathered sparks from old guitars, and built a dawn from fading stars..."',
    likes: 104,
    genre: "Folk",
    mood: "Nostalgic",
    author: "CampfireSoul",
    createdAt: "2 hours ago",
  },
];

export const promptHistory: PromptHistoryItem[] = [
  {
    id: "prompt-1",
    title: "80s synthwave road trip anthem",
    createdAt: "2 hours ago",
    tags: ["synthwave", "nostalgic", "midnight"],
    status: "generated",
  },
  {
    id: "prompt-2",
    title: "Lo-fi rainy night reflection",
    createdAt: "Yesterday",
    tags: ["lo-fi", "rain", "melancholy"],
    status: "generated",
  },
  {
    id: "prompt-3",
    title: "Stadium pop empowerment chorus",
    createdAt: "3 days ago",
    tags: ["pop", "anthem", "upbeat"],
    status: "draft",
  },
  {
    id: "prompt-4",
    title: "Minimal piano ballad for duet",
    createdAt: "1 week ago",
    tags: ["ballad", "piano", "duet"],
    status: "generated",
  },
];

export const lyricsLibrary: Record<string, LyricDetail> = {
  "midnight-drive": {
    id: "midnight-drive",
    title: "Midnight Drive",
    genre: "Synthwave",
    mood: "Melancholic",
    generatedBy: "NovaMuse",
    createdAt: "Generated 3 days ago",
    sections: [
      {
        heading: "[Verse 1]",
        lines: [
          "Streetlights paint the pavement gold,",
          "A story in the night, untold.",
          "Empty café, steaming cup,",
          "Hoping that you might look up.",
        ],
      },
      {
        heading: "[Chorus]",
        lines: [
          "Oh, midnight reverie, a silent plea,",
          "Lost in the echoes of you and me.",
          "A faded photograph, a whispered name,",
          "Just trying to ignite a dying flame.",
        ],
      },
      {
        heading: "[Verse 2]",
        lines: [
          "A saxophone sighs down the lane,",
          "Playing a soft, melancholic refrain.",
          "I trace your shadow on the wall,",
          "Waiting for a call that will never fall.",
        ],
      },
      {
        heading: "[Bridge]",
        lines: [
          "Maybe tomorrow, the sun will break through,",
          "And I'll find my way back to you.",
          "But tonight, I'm just a ghost in this town,",
          "Watching my own world turn upside down.",
        ],
      },
    ],
    stats: {
      likes: 1245,
      shares: 320,
      copies: 210,
    },
    comments: [
      {
        id: "c1",
        author: "MelodyMaker",
        avatar: "https://i.pravatar.cc/40?img=24",
        timestamp: "2 hours ago",
        message:
          "This is beautiful! The imagery in the second verse is so vivid. Really captures that lonely city night feeling.",
      },
      {
        id: "c2",
        author: "LyricLover",
        avatar: "https://i.pravatar.cc/40?img=9",
        timestamp: "1 day ago",
        message:
          "Wow, the bridge gives me chills. I can already hear the music swelling up. Great generation!",
      },
      {
        id: "c3",
        author: "SynthWaveFan",
        avatar: "https://i.pravatar.cc/40?img=14",
        timestamp: "3 days ago",
        message:
          "This would be perfect for a slow, synth-heavy track. Love the mood.",
      },
    ],
  },
  "echoes-in-the-rain": {
    id: "echoes-in-the-rain",
    title: "Echoes in the Rain",
    genre: "Ambient Pop",
    mood: "Reflective",
    generatedBy: "ChordCaster",
    createdAt: "Generated 5 days ago",
    sections: [
      {
        heading: "[Verse 1]",
        lines: [
          "Raindrops sketch circles on the ground,",
          "Secrets whisper without a sound.",
          "Traffic lights in crimson glow,",
          "Painting hope on the streets below.",
        ],
      },
      {
        heading: "[Chorus]",
        lines: [
          "Echoes in the rain, calling out your name,",
          "Memories awake, burning like a flame.",
          "Footsteps fade away, but the feeling stays,",
          "Echoes in the rain, forever in the haze.",
        ],
      },
    ],
    stats: {
      likes: 1021,
      shares: 287,
      copies: 190,
    },
    comments: [
      {
        id: "c1",
        author: "RainChaser",
        avatar: "https://i.pravatar.cc/40?img=45",
        timestamp: "5 hours ago",
        message:
          "These visuals are everything. You can practically see the rain falling.",
      },
      {
        id: "c2",
        author: "VerseSmith",
        avatar: "https://i.pravatar.cc/40?img=21",
        timestamp: "1 day ago",
        message:
          "The chorus feels like a classic already. Fantastic work.",
      },
    ],
  },
};

