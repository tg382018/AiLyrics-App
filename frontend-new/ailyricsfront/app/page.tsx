import Image from "next/image";
import Link from "next/link";

import { AuroraBackground } from "@/components/ui/aurora-background";

const features = [
  {
    title: "Intelligent Lyric Drafts",
    description:
      "Define the mood, genre and story. The AI delivers tailored verses, hooks and bridges in seconds.",
    pill: "AI-powered",
  },
  {
    title: "Multilingual Creativity",
    description:
      "Write for global audiences. Craft meaningful lyrics in English, Turkish and dozens of other languages.",
    pill: "Global reach",
  },
  {
    title: "Team Collaboration",
    description:
      "Share drafts with producers and co-writers, collect feedback and iterate together in real time.",
    pill: "Real-time",
  },
];

const testimonials = [
  {
    quote:
      "Writer's block is a thing of the past. AI Lyrics App keeps ideas flowing and verses fresh every single session.",
    name: "Maya Collins",
    role: "Songwriter & Producer",
  },
  {
    quote:
      "Being able to collaborate on the exact same draft cut our production time from weeks to just a few days.",
    name: "Ethan Ramirez",
    role: "Creative Director, Nova Records",
  },
];

const stats = [
  { label: "Lyrics generated", value: "54K+", note: "Past 30 days" },
  { label: "Happy creators", value: "8.4K", note: "Active teams" },
  { label: "Shared collaborations", value: "120K", note: "Drafts exchanged" },
];

const howToSteps = [
  {
    title: "Tell Us the Mood",
    description:
      "Share the vibe, genre and story you want to capture. Drop lyric snippets or reference tracks to set the tone.",
  },
  {
    title: "Watch AI Draft in Real Time",
    description:
      "Our lyric engine spins out verses, hooks and bridges that match your intent. Tweak suggestions instantly.",
  },
  {
    title: "Polish & Share the Final Cut",
    description:
      "Lock the winning lines, export lyric sheets or send the draft to collaborators without leaving the flow.",
  },
];

const heroTitleWords = [
  "The",
  "AI",
  "lyricist",
  "that",
  "brings",
  "your",
  "music",
  "into",
  "the",
  "future.",
];

export default function Home() {
  return (
    <AuroraBackground
      className="font-sans flex-col items-center justify-start overflow-visible px-0 text-white"
      containerClassName="relative z-10 flex w-full max-w-6xl flex-col items-center gap-24"
    >
      <section className="w-full px-6 pt-12 text-center text-white sm:text-left lg:pt-20">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full max-w-3xl flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/80 backdrop-blur">
              AiLyrics App
            </span>
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl sm:leading-[1.05]">
                {heroTitleWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="inline-block opacity-0 [animation:fade-in-up_0.08s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    {word}
                    {index !== heroTitleWords.length - 1 ? "\u00A0" : ""}
                  </span>
                ))}
              </h1>
              <p className="text-base text-white/75 sm:text-lg">
                AI Lyrics App captures emotion in seconds, generates complete lyric
                ideas and helps your team ship songs faster. Pick the mood, style and
                story arc – we’ll turn your spark into a full song narrative.
              </p>
            </div>
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
              >
                Launch the App
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white/85 transition hover:border-white/60 hover:text-white"
              >
                Explore Features
              </Link>
            </div>
            <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-6 text-left text-sm text-white/80 shadow-2xl backdrop-blur">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
                Sample Lyric Draft
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/85">
                “Writer&apos;s block is out. I whisper one idea and{" "}
                <span className="text-white">
                  the chorus erupts like the skyline at midnight
                </span>
                , every verse syncing with the beat in my head.”
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[15rem] sm:max-w-xs lg:max-w-sm xl:max-w-md">
            <Image
              src="/ailyricslogo.png"
              alt="AiLyrics App logo"
              width={420}
              height={420}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <main className="flex w-full flex-col gap-24 px-6 pb-24 text-white">
        <section className="flex flex-col items-center gap-6 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-white/80 shadow-[0_0_30px_rgba(59,130,246,0.35)]">
            <span className="h-2 w-2 rounded-full bg-sky-300" /> Write lyrics with AI
          </span>
          <div className="max-w-3xl space-y-6">
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Create complete lyrics in minutes
            </h2>
            <p className="text-lg text-white/75 md:text-xl">
              Pick the desired mood, tempo, style and story arc. AI Lyrics App
              suggests unique verses, hooks and bridges so you can keep the
              creative flow alive.
            </p>
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/10 p-10 text-white shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4 text-left">
            <h3 className="text-2xl font-semibold text-white">
              Everything you need for a radio-ready lyric sheet
            </h3>
            <p className="text-white/75">
              Iterate as fast as inspiration hits. Save every draft, compare
              versions, collect comments and deliver polished lyrics your team can
              produce instantly.
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li>- Mood and genre aligned suggestions</li>
              <li>- Version history and comparison</li>
              <li>- Shareable drafts and feedback loops</li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-sky-500/10 backdrop-blur">
            <div className="absolute right-4 top-4 h-3 w-3 animate-pulse rounded-full bg-emerald-300" />
            <pre className="overflow-x-auto text-sm text-white/75">
{`TOPIC: Midnight Skyline
MOOD: Melancholic
LANGUAGE: English

[Verse 1]
The skyline flickers, memories in neon light,
Your shadow whispers, drifting with the night.
[Chorus]
If the stars fall down, I will catch them in my hands,
Every word runs back to you, across these quiet lands.`}
            </pre>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_12px_40px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="space-y-2 rounded-2xl bg-white/10 p-6 shadow-lg shadow-sky-500/10 backdrop-blur"
            >
              <p className="text-sm uppercase tracking-wide text-white/60">
                {stat.label}
              </p>
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs text-white/60">{stat.note}</p>
            </div>
          ))}
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-fuchsia-500/10 p-12 text-center text-white shadow-[0_20px_60px_rgba(15,23,42,0.55)]">
          <div className="absolute -left-24 top-6 h-40 w-40 animate-pulse rounded-full bg-sky-400/30 blur-3xl" />
          <div className="absolute -right-16 bottom-10 h-44 w-44 animate-[spin_18s_linear_infinite] rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
          <div className="relative space-y-5">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Need a hand with your next lyric?
            </h2>
            <p className="mx-auto max-w-2xl text-white/80">
              Whether you’re planning a release, setting up a writers camp or curious about the roadmap, drop us a line.
              We usually reply within a day.
            </p>
            <a
              href="mailto:tgulck@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-8 py-3 text-base font-semibold text-neutral-900 shadow-[0_18px_40px_rgba(59,130,246,0.35)] transition hover:bg-white"
            >
              <span className="text-lg">✉️</span>
              Contact us
            </a>
          </div>
        </section>

        <section id="features" className="space-y-12 text-white">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Designed for every step of your writing journey
            </h2>
            <p className="mx-auto max-w-3xl text-white/70">
              AI Lyrics App brings ideation, lyric writing, editing and sharing
              together in one workspace. Each feature is crafted alongside
              professional songwriters.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-sky-500/10 transition hover:border-white/30 hover:shadow-sky-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="relative space-y-4">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sky-200">
                    {feature.pill}
                  </span>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/75">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-to" className="space-y-12 text-white">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              How to use AiLyrics
            </h2>
            <p className="mx-auto max-w-2xl text-white/70">
              Three simple steps from the first spark to a stage-ready lyric sheet.
              Each phase unlocks timed highlights to keep you in the zone.
            </p>
          </div>

          <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 sm:flex-row sm:items-stretch sm:justify-between">
            <div className="pointer-events-none absolute left-1/2 top-9 hidden h-0.5 w-[94%] -translate-x-1/2 sm:block">
              <div className="h-full w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-full origin-left bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-500 [animation:step-line_2.6s_ease-out_forwards]" />
              </div>
            </div>

            <div className="pointer-events-none absolute left-16 top-0 h-full w-0.5 overflow-hidden rounded-full bg-white/15 sm:hidden">
              <div className="h-full w-full origin-top bg-gradient-to-b from-sky-400 via-indigo-400 to-violet-500 [animation:step-line-vertical_2.6s_ease-out_forwards]" />
            </div>

            {howToSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-1 flex-col items-start gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 opacity-0 shadow-[0_16px_50px_rgba(15,23,42,0.5)] backdrop-blur-lg transition hover:border-white/25 hover:shadow-sky-500/20 sm:items-center sm:text-center [animation:fade-in-up_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.32}s` }}
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl font-semibold text-white opacity-0 shadow-lg shadow-sky-500/20 [animation:step-pop_0.72s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.32}s` }}
                >
                  {index + 1}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">{step.title}</h3>
                  <p className="text-sm text-white/75">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 text-white shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Accelerate your production workflow
            </h2>
            <p className="text-white/75">
              Build mood boards, refine AI suggestions and work live with your
              team. Every version is safely stored so you never lose a brilliant
              line.
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li>- AI-assisted variations and rewrites</li>
              <li>- Sharing, comments and revision history</li>
              <li>- Metadata tips for streaming platforms</li>
            </ul>
          </div>
          <div className="space-y-6 rounded-2xl border border-white/10 bg-white/10 p-6 shadow-lg shadow-sky-500/10 backdrop-blur">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              How it works
            </h3>
            <ol className="space-y-4 text-left text-sm text-white/70">
              <li>
                <span className="font-medium text-white">1. Capture the spark:</span>{" "}
                Choose a mood and jot a brief prompt.
              </li>
              <li>
                <span className="font-medium text-white">2. Let AI riff:</span> Receive
                lyric suggestions for verse, pre-chorus and chorus.
              </li>
              <li>
                <span className="font-medium text-white">3. Refine together:</span> Adjust
                tone, length or language with smart editing tools.
              </li>
              <li>
                <span className="font-medium text-white">4. Share instantly:</span> Send drafts
                to your team or export as a lyrics sheet.
              </li>
            </ol>
          </div>
        </section>

        <section className="space-y-10 text-white">
          <h2 className="text-center text-3xl font-semibold md:text-4xl">
            Notes from artists
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-sky-500/10 backdrop-blur"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/15 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="relative space-y-4">
                  <p className="text-lg font-medium leading-relaxed text-white/85">
                    “{item.quote}”
                  </p>
                  <div className="text-sm text-white/65">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p>{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 text-white shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
          <div className="absolute -top-20 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/10 to-purple-500/20 blur-3xl" />
          <div className="relative space-y-6">
            <h2 className="text-center text-3xl font-semibold md:text-4xl">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Can I import my existing lyrics?",
                  a: "Yes. Paste any draft directly into the generator to ask for rewrites, alternate choruses or translations in seconds.",
                },
                {
                  q: "Does AiLyrics support multiple languages?",
                  a: "Absolutely. Pick from a growing catalog of languages and eras; the generator respects rhyme and syllable patterns in each.",
                },
                {
                  q: "How do collaborators leave feedback?",
                  a: "Invite teammates to the app—every lyric has built-in commenting, liking and version history so decisions stay organized.",
                },
              ].map((item, index) => (
                <details
                  key={item.q}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white/85 transition group-open:bg-white/10">
                    <span>{item.q}</span>
                    <span className="text-white/50 transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-white/70 [animation:fade-in-up_0.4s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.05}s` }}>
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AuroraBackground>
  );
}
