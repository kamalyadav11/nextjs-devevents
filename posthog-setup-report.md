<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 16 App Router project (DevEvent). PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.mjs` to route ingestion through `/ingest`. Two client-side event tracking points were instrumented, covering the top of the user engagement funnel: the homepage CTA and event card clicks.

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" CTA button on the homepage | `src/components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details (includes title, slug, location, date as properties) | `src/components/EventCard.tsx` |

## Files created / modified

- **`instrumentation-client.ts`** _(new)_ — Client-side PostHog initialization with error tracking and debug mode
- **`next.config.mjs`** _(modified)_ — Added PostHog reverse proxy rewrites and `skipTrailingSlashRedirect`
- **`src/components/ExploreBtn.tsx`** _(modified)_ — Added `posthog.capture('explore_events_clicked')`
- **`src/components/EventCard.tsx`** _(modified)_ — Converted to client component, added `posthog.capture('event_card_clicked')` with event properties
- **`.env.local`** _(new)_ — PostHog public token and host environment variables

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/366497/dashboard/1423830
- **Insight — Explore Events CTA Clicks**: https://us.posthog.com/project/366497/insights/98M6ZDjt
- **Insight — Event Card Clicks**: https://us.posthog.com/project/366497/insights/poI3I044
- **Insight — Homepage to Event Detail Funnel**: https://us.posthog.com/project/366497/insights/WfG3no41

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
