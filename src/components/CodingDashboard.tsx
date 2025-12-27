import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Trophy, Flame, Target, TrendingUp, Calendar, GithubIcon } from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from "recharts";

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  contributionPoints: number;
  ContestRating: number;
}

interface ContributionDay {
  date: string;
  count: number;
}

const CodingDashboard = () => {
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats>({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: 0,
    contributionPoints: 0,
    ContestRating: 1871,
  });
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [gfgCount, setGfgCount] = useState<number>(0);
  const [gfgError, setGfgError] = useState<string | null>(null);
  const heatmapRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; left: number; top: number; text: string }>({ visible: false, x: 0, y: 0, left: 0, top: 0, text: '' });
  const [loading, setLoading] = useState(true);
  const [ratingData, setRatingData] = useState<any[]>([]);
  const [ghError, setGhError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  // Platform usernames (allow overriding via Vite env variables)
  const LEETCODE_USER = (import.meta as any).env?.VITE_LEETCODE_USERNAME || 'prathamhanda';
  const GITHUB_USER = (import.meta as any).env?.VITE_GITHUB_USERNAME || 'prathamhanda';
  const GFG_USER = (import.meta as any).env?.VITE_GFG_USERNAME || 'prathamh';
  const CODECHEF_USER = (import.meta as any).env?.VITE_CODECHEF_USERNAME || 'prathamhanda';
  const CODEFORCES_USER = (import.meta as any).env?.VITE_CODEFORCES_USERNAME || 'prathamhanda10';

  useEffect(() => { 
    // Allow configuring usernames through Vite env variables:
    // VITE_LEETCODE_USERNAME and VITE_GITHUB_USERNAME
  const LEETCODE_USER = (import.meta as any).env?.VITE_LEETCODE_USERNAME || 'prathamhanda';
  const GITHUB_USER = (import.meta as any).env?.VITE_GITHUB_USERNAME || 'prathamhanda';
  const GFG_USER = (import.meta as any).env?.VITE_GFG_USERNAME || 'prathamh';

    // Fetch LeetCode stats
    const fetchLeetCodeStats = async () => {
      try {
        // Public LeetCode stats API (fallback) - keep as-is but use env username if provided
        const leetcodeUrl = `https://leetcode-stats-api.herokuapp.com/${LEETCODE_USER}`;
        const response = await fetch(leetcodeUrl);
        const data = await response.json();

        setLeetcodeStats({
          totalSolved: data.totalSolved || 0,
          easySolved: data.easySolved || 0,
          mediumSolved: data.mediumSolved || 0,
          hardSolved: data.hardSolved || 0,
          ranking: data.ranking || 0,
          contributionPoints: data.contributionPoints || 0,
          ContestRating: 1871 ,
        });

        // Try to fetch contest rating history from LeetCode GraphQL (best-effort).
        // If that fails, fall back to a small mock dataset.
        try {
          const gqlUrl = 'https://leetcode.com/graphql';
          const query = `query getUserContestHistory($username: String!) {\n  userContestRankingHistory(username: $username) {\n    contest {\n      title\n      start_time\n      startTime\n    }\n    rating\n    ranking\n    attended\n  }\n}`;
          const resp = await fetch(gqlUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { username: LEETCODE_USER } }),
          });
          if (resp.ok) {
            const jr = await resp.json();
            const hist = jr?.data?.userContestRankingHistory;
            if (Array.isArray(hist) && hist.length > 0) {
              // Map to monthly points for chart: use contest title or index as x and rating as y
              const mapped = hist.map((h: any, i: number) => {
                const ts = h?.contest?.start_time || h?.contest?.startTime || null;
                const dateLabel = ts ? new Date(ts * 1000).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : `C${i + 1}`;
                return { date: dateLabel, rating: Number(h?.rating || 0) };
              });
              // keep last 12 entries
              setRatingData(mapped.slice(-12));
            } else {
              throw new Error('no contest history');
            }
          } else {
            throw new Error(`LeetCode GraphQL returned ${resp.status}`);
          }
        } catch (err) {
          console.debug('LeetCode contest history fetch failed, using mock rating data', err);
          const mockRatingData = [
            { date: 'Jan', rating: 1400 },
            { date: 'Feb', rating: 1450 },
            { date: 'Mar', rating: 1350 },
            { date: 'Apr', rating: 1580 },
            { date: 'May', rating: 1650 },
            { date: 'Jun', rating: 1575 },
            { date: 'Jul', rating: 1694 },
            { date: 'Aug', rating: 1871 },
            { date: 'Sep', rating: 1939 },
            { date: 'Oct', rating: 1931 },
          ];
          setRatingData(mockRatingData);
        }
      } catch (error: any) {
        console.error('Error fetching LeetCode stats:', error);
      }
    };

    // Fetch GitHub contributions
    // Fetch GitHub contributions
    const fetchGitHubContributions = async () => {
      try {
        setGhError(null);
        const githubUrl = `https://github-contributions-api.deno.dev/${GITHUB_USER}.json`;
        const response = await fetch(githubUrl);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();

        // normalize shapes - the deno API sometimes returns weeks (array of arrays)
        let rawContribs: any[] = [];
        if (Array.isArray(data.contributions)) {
          // contributions may be nested by week -> flatten if needed
          rawContribs = data.contributions.some(Array.isArray) ? (data.contributions as any[]).flat() : data.contributions;
        } else if (Array.isArray(data.data)) {
          rawContribs = data.data;
        } else if (Array.isArray((data || {}).years)) {
          // some APIs wrap contributions by year
          rawContribs = (data.years || []).flatMap((y: any) => y.contributions || []);
        }

        const formattedContributions = (rawContribs || []).map((contrib: any) => ({
          date: contrib.date,
          count: contrib.count ?? contrib.contributionCount ?? 0,
          // preserve optional fields for richer hovers without extra API calls
          color: contrib.color,
          contributionLevel: contrib.contributionLevel,
        }));

        // caching: store normalized result in localStorage for 1 hour to reduce repeat requests
        try {
          const cacheKey = `ghContribs:${GITHUB_USER}`;
          if (formattedContributions.length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: formattedContributions }));
            setContributions(formattedContributions);
            setGhError(null);
          } else {
            // no data - try a public events fallback next
            setGhError('No direct contributions data available from the 3rd-party API; attempting GitHub events fallback.');
            try {
              const fallback = await fetchGitHubEventsFallback(GITHUB_USER);
              if (fallback && fallback.length > 0) {
                localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: fallback }));
                setContributions(fallback);
                setGhError(null);
              }
            } catch (err) {
              console.error('fallback error', err);
            }
          }
        } catch (err) {
          console.warn('localStorage unavailable', err);
        }
      } catch (error: any) {
        console.error('Error fetching GitHub contributions:', error);
        setGhError(String(error?.message || error));
      } finally {
        setLoading(false);
        setRetrying(false);
      }
    };

    // check cache first
    try {
      const cacheKey = `ghContribs:${GITHUB_USER}`;
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        const age = Date.now() - (parsed.ts || 0);
        const ttl = 1000 * 60 * 60; // 1 hour
        if (age < ttl && Array.isArray(parsed.data)) {
          setContributions(parsed.data);
          setLoading(false);
        } else {
          // stale - fetch fresh
          fetchGitHubContributions();
        }
      } else {
        fetchGitHubContributions();
      }
    } catch (err) {
      // localStorage not available or parse failed - just fetch
      fetchGitHubContributions();
    }

    // Fetch GeeksforGeeks profile page and extract total_problems_solved from the __NEXT_DATA__ JSON
    const fetchGFGCount = async () => {
      try {
        setGfgError(null);
        const cacheKey = `gfgCount:${GFG_USER}`;
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            const age = Date.now() - (parsed.ts || 0);
            const ttl = 1000 * 60 * 60; // 1 hour
            if (age < ttl && typeof parsed.count === 'number') {
              setGfgCount(parsed.count);
              return;
            }
          }
        } catch (e) {
          // ignore cache errors
        }

        // First try a local serverless endpoint (avoids CORS). If not available, fall back to direct client fetch.
        try {
          const apiUrl = `/api/gfg-count?user=${encodeURIComponent(GFG_USER)}`;
          const r = await fetch(apiUrl, { method: 'GET' });
          if (r.ok) {
            const j = await r.json();
            if (typeof j?.count === 'number') {
              setGfgCount(Number(j.count || 0));
              try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), count: Number(j.count || 0) })); } catch (e) {}
              return;
            }
          }
        } catch (e) {
          // endpoint not available or returned CORS/network error - fall back to client fetch
          try { if ((window as any)?.console && (window as any).__toggleHeatmapTooltipDebug) (window as any).__toggleHeatmapTooltipDebug; } catch (er) {}
          // debug logged elsewhere if enabled
        }

        // Fallback: attempt client-side fetch (may be blocked by CORS)
        const url = `https://www.geeksforgeeks.org/user/${GFG_USER}/`;
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error(`GfG status ${res.status}`);
        const text = await res.text();

        // Extract __NEXT_DATA__ JSON from the page
        const m = text.match(/<script\s+id=\"__NEXT_DATA__\"[^>]*>([\s\S]*?)<\/script>/i);
        if (!m) throw new Error('Could not find __NEXT_DATA__ on GfG page');
        let json: any;
        try {
          json = JSON.parse(m[1]);
        } catch (err) {
          throw new Error('Failed to parse GfG JSON');
        }

        const possible = json?.props?.pageProps || json?.props || json;
        const count = possible?.userInfo?.total_problems_solved
          || possible?.initialState?.userProfileApi?.getUserInfo?.data?.total_problems_solved
          || possible?.initialState?.userProfileApi?.getUserInfo?.data?.data?.total_problems_solved
          || 0;

        setGfgCount(Number(count || 0));
        try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), count: Number(count || 0) })); } catch (e) {}
      } catch (err: any) {
        console.warn('GfG fetch failed', err);
        setGfgError(String(err?.message || err));
      }
    };

    // try GFG fetch but don't block main loads
    fetchGFGCount();

    // Attach mouse handlers for custom tooltip (reads data- attributes set on rects)
    let container = heatmapRef.current;
    // debug toggle: set VITE_HEATMAP_TOOLTIP_DEBUG=true or set localStorage 'heatmapTooltipDebug' = '1'
    const envDebug = (import.meta as any).env?.VITE_HEATMAP_TOOLTIP_DEBUG === 'true';
    let runtimeDebug = false;
    try { runtimeDebug = typeof window !== 'undefined' && localStorage.getItem('heatmapTooltipDebug') === '1'; } catch (e) {}
    const debug = envDebug || runtimeDebug;
    // expose a quick toggle helper for local debugging
    try {
      if (typeof window !== 'undefined') {
        (window as any).__toggleHeatmapTooltipDebug = (v?: boolean) => {
          const val = v === undefined ? !(localStorage.getItem('heatmapTooltipDebug') === '1') : !!v;
          localStorage.setItem('heatmapTooltipDebug', val ? '1' : '0');
          // eslint-disable-next-line no-console
          console.log('[heatmap-debug] set heatmapTooltipDebug =', val ? '1' : '0');
        };
      }
    } catch (e) {}
    if (container) {
      // Use pointer events for wider device support and more reliable targeting.
      // Structured in-memory log for debugging interactions
      try {
        if (typeof window !== 'undefined') {
          (window as any).__heatmapTooltipLog = (window as any).__heatmapTooltipLog || [];
          (window as any).__dumpHeatmapTooltipLog = () => JSON.parse(JSON.stringify((window as any).__heatmapTooltipLog || []));
        }
      } catch (e) {}

      const pushLog = (entry: any) => {
        if (!debug) return;
        try {
          const rec = { ts: Date.now(), ...entry };
          (window as any).__heatmapTooltipLog.push(rec);
          console.debug('[heatmap-debug]', rec);
        } catch (e) {
          // ignore logging errors
        }
      };

      const adjust = (opts?: { retries?: number, anchorX?: number, anchorY?: number }) => {
        if (!tooltipRef.current || !container) return;
        const tt = tooltipRef.current;
        const bounds = container.getBoundingClientRect();
        const ttW = tt.offsetWidth;
        const ttH = tt.offsetHeight;
        pushLog({ event: 'adjust', ttW, ttH, bounds: { w: bounds.width, h: bounds.height }, opts });

        // If tooltip hasn't been painted yet, retry a few times (double RAF + setTimeout fallback)
        const retries = opts?.retries ?? 0;
        if ((ttW === 0 || ttH === 0) && retries < 3) {
          pushLog({ event: 'adjust-retry', retries });
          requestAnimationFrame(() => requestAnimationFrame(() => adjust({ retries: retries + 1, anchorX: opts?.anchorX, anchorY: opts?.anchorY })));
          // also schedule a timed fallback in case RAFs don't help
          setTimeout(() => adjust({ retries: retries + 1, anchorX: opts?.anchorX, anchorY: opts?.anchorY }), 16 + retries * 10);
          return;
        }

        setTooltip((prev) => {
          if (!prev.visible) return prev;
          let left = (opts?.anchorX ?? prev.x) + 12;
          let top = (opts?.anchorY ?? prev.y) + 12;
          // flip horizontally if overflowing container width
          if (left + ttW > bounds.width) {
            left = Math.max((opts?.anchorX ?? prev.x) - ttW - 12, 8);
            pushLog({ event: 'flip-left', left });
          }
          // flip vertically if overflowing container height
          if (top + ttH > bounds.height) {
            top = Math.max(bounds.height - ttH - 8, 8);
            pushLog({ event: 'flip-top', top });
          }
          return { ...prev, left, top };
        });
      };

      const resolveCellFromEvent = (e: PointerEvent) => {
        // Try several ways to resolve the SVG cell element that holds data attributes
        try {
          // 1) composedPath (best for shadow DOM / SVG nesting)
          const cp: any[] = typeof (e as any).composedPath === 'function' ? (e as any).composedPath() : [];
          for (const el of cp || []) {
            if (!el || !(el as Element).getAttribute) continue;
            if ((el as Element).hasAttribute && (el as Element).hasAttribute('data-date')) return { el: el as Element, method: 'composedPath' };
          }

          // 2) closest on target
          const target = e.target as Element | null;
          if (target) {
            const closestRect = target.closest ? target.closest('[data-date]') : null;
            if (closestRect) return { el: closestRect as Element, method: 'closest' };
          }

          // 3) elementFromPoint fallback
          const fromPoint = document.elementFromPoint(e.clientX, e.clientY) as Element | null;
          if (fromPoint) {
            const cp2 = (fromPoint as Element).closest ? (fromPoint as Element).closest('[data-date]') : null;
            if (cp2) return { el: cp2 as Element, method: 'elementFromPoint' };
          }
        } catch (err) {
          pushLog({ event: 'resolve-error', error: String(err) });
        }
        return null;
      };

      const onPointerMove = (e: PointerEvent) => {
        const resolved = resolveCellFromEvent(e);
        if (resolved && resolved.el) {
          const rectEl = resolved.el as HTMLElement;
          const date = rectEl.getAttribute('data-date') || '';
          const count = rectEl.getAttribute('data-count') || '0';
          const title = rectEl.getAttribute('data-title') || `${count} contributions on ${date}`;
          const bounds = container!.getBoundingClientRect();
          const anchorX = e.clientX - bounds.left;
          const anchorY = e.clientY - bounds.top;
          pushLog({ event: 'pointermove', method: resolved.method, date, count, anchorX, anchorY });

          // initial guess for left/top; will be adjusted to avoid overflow
          setTooltip({ visible: true, x: anchorX, y: anchorY, left: anchorX + 12, top: anchorY + 12, text: title });

          // Measurement + adjust with robust retries; pass anchor to adjust so it can retry using it
          requestAnimationFrame(() => requestAnimationFrame(() => adjust({ retries: 0, anchorX, anchorY })));
        } else {
          pushLog({ event: 'pointermove-miss', clientX: e.clientX, clientY: e.clientY });
          setTooltip((t) => t.visible ? { ...t, visible: false } : t);
        }
      };

      const onPointerOver = (e: PointerEvent) => { pushLog({ event: 'pointerover' }); onPointerMove(e); };
      const onPointerOut = () => { pushLog({ event: 'pointerout' }); setTooltip((t) => t.visible ? { ...t, visible: false } : t); };

      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerover', onPointerOver);
      container.addEventListener('pointerout', onPointerOut);
      const onResize = () => adjust();
      window.addEventListener('resize', onResize);

  // As a robust fallback: attach per-rect listeners directly to each [data-date] element
      // This avoids delegation misses caused by SVG nesting or pointer event differences.
      const attachedRects: Array<{ el: Element; handlers: { move: (e: PointerEvent) => void; enter: (e: PointerEvent) => void; leave: (e: PointerEvent) => void } }> = [];

      const attachPerRectListeners = (attempt = 0) => {
        try {
          const nodes = container!.querySelectorAll('[data-date]');
          if (!nodes || nodes.length === 0) {
            pushLog({ event: 'attach-rects-miss', attempt });
            if (attempt < 5) setTimeout(() => attachPerRectListeners(attempt + 1), 100 + attempt * 50);
            return;
          }
          pushLog({ event: 'attach-rects', count: nodes.length });
          try { (window as any).__heatmapInitInfo = (window as any).__heatmapInitInfo || {}; (window as any).__heatmapInitInfo.lastAttach = Date.now(); (window as any).__heatmapInitInfo.lastCount = nodes.length; } catch (e) {}
          nodes.forEach((n) => {
            const move = (ev: Event) => onPointerMove(ev as unknown as PointerEvent);
            const enter = (ev: Event) => onPointerOver(ev as unknown as PointerEvent);
            const leave = () => onPointerOut();
            n.addEventListener('pointermove', move as EventListener);
            n.addEventListener('pointerenter', enter as EventListener);
            n.addEventListener('pointerleave', leave as EventListener);
            attachedRects.push({ el: n, handlers: { move: move as any, enter: enter as any, leave: leave as any } });
          });
        } catch (err) {
          pushLog({ event: 'attach-rects-error', error: String(err) });
        }
      };

      // Initial attempt to attach per-rect listeners
      attachPerRectListeners();

      // Observe mutations within the heatmap container; the SVG may be re-rendered after initial mount.
      let mo: MutationObserver | null = null;
      try {
        if (container && typeof MutationObserver !== 'undefined') {
          mo = new MutationObserver((mutations) => {
            pushLog({ event: 'mutation-observed', count: mutations.length });
            // re-attach in case nodes were replaced
            attachPerRectListeners();
          });
          mo.observe(container, { childList: true, subtree: true });
        }
      } catch (err) {
        pushLog({ event: 'mutation-observer-error', error: String(err) });
      }

      // clean up on unmount
      return () => {
        try { container?.removeEventListener('pointermove', onPointerMove); } catch (e) {}
        try { container?.removeEventListener('pointerover', onPointerOver); } catch (e) {}
        try { container?.removeEventListener('pointerout', onPointerOut); } catch (e) {}
        try { window.removeEventListener('resize', onResize); } catch (e) {}
        try {
          // remove per-rect listeners if attached
          // attachedRects is closed-over; safe to iterate
          attachedRects.forEach(({ el, handlers }) => {
            try { el.removeEventListener('pointermove', handlers.move as EventListener); } catch (e) {}
            try { el.removeEventListener('pointerenter', handlers.enter as EventListener); } catch (e) {}
            try { el.removeEventListener('pointerleave', handlers.leave as EventListener); } catch (e) {}
          });
        } catch (e) {}
        try { if (mo) mo.disconnect(); } catch (e) {}
      };
    }

    fetchLeetCodeStats();
    fetchGitHubContributions();
    // helper: fallback that aggregates public events into date counts
    async function fetchGitHubEventsFallback(user: string) {
      try {
        const perPage = 100;
        let page = 1;
        const maxPages = 3; // up to 300 events
        const allEvents: any[] = [];
        while (page <= maxPages) {
          const url = `https://api.github.com/users/${user}/events/public?per_page=${perPage}&page=${page}`;
          const r = await fetch(url);
          if (!r.ok) break;
          const ev = await r.json();
          if (!Array.isArray(ev) || ev.length === 0) break;
          allEvents.push(...ev);
          if (ev.length < perPage) break;
          page += 1;
        }

        // Aggregate by date (YYYY-MM-DD). Count most event types as a contribution.
        const dateCounts: Record<string, number> = {};
        allEvents.forEach((e: any) => {
          const dt = e.created_at?.slice(0, 10);
          if (!dt) return;
          // Optionally filter event types to more contribution-like events
          const contribTypes = ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'PullRequestReviewEvent', 'IssueCommentEvent', 'CreateEvent'];
          if (!contribTypes.includes(e.type)) return;
          dateCounts[dt] = (dateCounts[dt] || 0) + 1;
        });

  const formatted = Object.keys(dateCounts).map((k) => ({ date: k, count: dateCounts[k] }));
        return formatted;
      } catch (err) {
        console.error('GitHub events fallback failed', err);
        return [];
      }
    }
  }, []);

  // Include GeeksforGeeks total into the LeetCode difficulty breakdown.
  // NOTE: GfG only provides a total problem count, not difficulty breakdown. We distribute
  // the GfG count proportionally across Easy/Medium/Hard according to the current
  // LeetCode breakdown. If the LeetCode breakdown is all zeros, distribute evenly.
  // This is an approximation; if you'd prefer a different rule (all to Easy, or a
  // separate "Other" bucket), tell me and I can change it.
  const _leetEasy = leetcodeStats.easySolved || 0;
  const _leetMed = leetcodeStats.mediumSolved || 0;
  const _leetHard = leetcodeStats.hardSolved || 0;
  let addEasy = 0;
  let addMed = 0;
  let addHard = 0;
  const totalLeetBreakdown = _leetEasy + _leetMed + _leetHard;
  if (gfgCount > 0) {
    if (totalLeetBreakdown > 0) {
      const pEasy = _leetEasy / totalLeetBreakdown;
      const pMed = _leetMed / totalLeetBreakdown;
      const pHard = _leetHard / totalLeetBreakdown;
      addEasy = Math.floor(pEasy * gfgCount);
      addMed = Math.floor(pMed * gfgCount);
      addHard = Math.floor(pHard * gfgCount);
      // distribute any rounding remainder to the largest proportions
      let rem = gfgCount - (addEasy + addMed + addHard);
      const order = [
        { key: 'easy', prop: pEasy },
        { key: 'med', prop: pMed },
        { key: 'hard', prop: pHard },
      ].sort((a, b) => b.prop - a.prop);
      let idx = 0;
      while (rem > 0) {
        const k = order[idx % 3].key;
        if (k === 'easy') addEasy++;
        else if (k === 'med') addMed++;
        else addHard++;
        rem--;
        idx++;
      }
    } else {
      // No LeetCode breakdown available; distribute evenly
      addEasy = Math.floor(gfgCount / 3);
      addMed = Math.floor(gfgCount / 3);
      addHard = Math.floor(gfgCount / 3);
      let rem = gfgCount - (addEasy + addMed + addHard);
      let ii = 0;
      while (rem > 0) {
        if (ii % 3 === 0) addEasy++;
        else if (ii % 3 === 1) addMed++;
        else addHard++;
        rem--; ii++;
      }
    }
  }

  const problemData = [
    { name: 'Easy', value: _leetEasy + addEasy, color: 'hsl(var(--chart-1))' },
    { name: 'Medium', value: _leetMed + addMed, color: 'hsl(var(--chart-2))' },
    { name: 'Hard', value: _leetHard + addHard, color: 'hsl(var(--chart-3))' },
  ];

  // Preferred slice colors (LeetCode-like) used as fallbacks if entry.color isn't set
  const sliceColors = ['#28a745', '#f59e0b', '#ef4444'];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Responsive chart ticks: reduce number of X axis ticks and rotate labels on small screens
  const [chartMaxTicks, setChartMaxTicks] = useState<number>(8);
  useEffect(() => {
    const update = () => {
      try {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
        if (w < 640) setChartMaxTicks(4); // small screens
        else if (w < 1024) setChartMaxTicks(6); // tablet
        else setChartMaxTicks(8); // desktop
      } catch (e) {
        setChartMaxTicks(8);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Custom X axis tick renderer so we can rotate labels on small screens
  const renderXAxisTick = (props: any) => {
    const { x, y, payload } = props || {};
    const isSmall = chartMaxTicks <= 4;
    const label = payload?.value || '';
    const dy = 16; // nudge label down
    if (isSmall) {
      // rotate around the label position so it doesn't overlap
      return (
        <text x={x} y={y + dy} transform={`rotate(-30 ${x} ${y + dy})`} textAnchor="end" fontSize={10} fill="hsl(var(--muted-foreground))">
          {label}
        </text>
      );
    }
    return (
      <text x={x} y={y + dy} textAnchor="middle" fontSize={12} fill="hsl(var(--muted-foreground))">
        {label}
      </text>
    );
  };

  // Platform icon renderer: prefer PNGs placed in /public/icons/<slug>.png.
  // Use a safe image onError handler and a tiny SVG data-URL fallback so we don't rely on component state here.
  const PlatformIcon = ({ name, className, logo }: { name: string; className?: string; logo?: string }) => {
    // If a logo filename or path is provided, prefer it. Otherwise derive a slug-based png path.
    const slug = (name || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    const src = logo ? (logo.startsWith('/') ? logo : `/icons/${logo}`) : `/icons/${slug}.png`;
    const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" rx="4" fill="%23e5e7eb"/></svg>';
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img
        src={src}
        onError={(e) => {
          try {
            const img = e.currentTarget as HTMLImageElement;
            img.onerror = null;
            img.src = placeholder;
          } catch (_) {
            // ignore
          }
        }}
        className={className}
        style={{ width: 20, height: 20, objectFit: 'contain' }}
      />
    );
  };

  const PlatformLink = ({ name, url, user, logo }: { name: string; url: string; user?: string; logo?: string }) => {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${name}${user ? ` — ${user}` : ''}`}
        className="group inline-flex items-center gap-3 bg-card border border-border/60 hover:border-primary/60 hover:shadow-xl transition transform hover:-translate-y-1 px-3 py-2 rounded-lg"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-gradient-to-br from-muted/40 to-muted/10 ring-1 ring-transparent group-hover:ring-primary/30">
          {name.toLowerCase() === 'github' ? (
            <GithubIcon className="w-5 h-5" />
          ) : (
            <PlatformIcon name={name} logo={logo} className="w-5 h-5" />
          )}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium">{name}</span>
          {user && <span className="text-xs text-muted-foreground">{user}</span>}
        </div>
      </a>
    );
  };

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={Math.max(8, innerRadius - 4)}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="rgba(0,0,0,0.08)"
        />
      </g>
    );
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0];
      return (
        <div className="bg-card border border-border text-sm rounded px-3 py-2 shadow-lg">
          <div className="font-medium">{p.name}</div>
          <div className="text-muted-foreground">{p.value} questions</div>
        </div>
      );
    }
    return null;
  };

  const totalSolvedDisplayed = leetcodeStats.totalSolved + gfgCount + 550;

  const statCards = [
    {
      title: "Total Questions Solved",
      value: totalSolvedDisplayed,
      icon: Code2,
      color: "text-blue-500 dark:text-blue-400",
    },
    {
      title: "LeetCode Rank",
      value: leetcodeStats.ranking.toLocaleString(),
      icon: Trophy,
      color: "text-yellow-500 dark:text-yellow-400",
    },
    {
      title: "Contest Badge",
      // image path served from /public (place your badge at public/badge-knight.png)
      value: 'Knight',
      img: '/badge-knight.png',
      color: "text-orange-500 dark:text-orange-400",
    },
    {
      title: "Contest Rating",
      value: leetcodeStats.ContestRating,
      icon: TrendingUp,
      color: "text-green-500 dark:text-green-400",
    },
  ];

  if (loading) {
    return (
      <section className="py-20 px-6" id="coding-dashboard">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">Loading coding stats...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20" id="coding-dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Coding Journey
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Daily consistency and continuous learning
          </p>
          {/* Platform badges (stylish links) */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
          <PlatformLink name="LeetCode" url={`https://leetcode.com/${LEETCODE_USER}`} user={LEETCODE_USER} logo={"LeetCode_logo_black.png"} />
          <PlatformLink name="GeeksforGeeks" url={`https://www.geeksforgeeks.org/user/${GFG_USER}`} user={GFG_USER} logo={"GeeksForGeeks_logo.png"} />
          <PlatformLink name="CodeChef" url={`https://www.codechef.com/users/${CODECHEF_USER}`} user={CODECHEF_USER} logo={"codechef.png"} />
          <PlatformLink name="CodeForces" url={`https://codeforces.com/profile/${CODEFORCES_USER}`} user={CODEFORCES_USER} logo={"codeforces.webp"} />
          <PlatformLink name="GitHub" url={`https://github.com/${GITHUB_USER}`} user={GITHUB_USER} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-muted/40 hover:border-primary/50 transition-transform duration-300 hover:shadow-2xl transform hover:-translate-y-2 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                          </div>
                          {/* show image if provided, otherwise render icon component */}
                          {stat.img ? (
                            <img src={stat.img} alt={stat.title} className="w-13 h-12 rounded-md object-contain shadow-sm" />
                          ) : (
                            <stat.icon className={`w-8 h-8 ${stat.color} transition-transform duration-300 group-hover:scale-110`} />
                          )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Problem Breakdown */}
          <Card className="border-muted/40 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Problem Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="w-full md:w-2/3">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={problemData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={90}
                        paddingAngle={6}
                        cornerRadius={6}
                        startAngle={-45}
                        endAngle={225}
                        activeIndex={activeIndex ?? undefined}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                      >
                        {problemData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color && typeof entry.color === 'string' ? (entry.color.startsWith('hsl') ? sliceColors[index] : entry.color) : sliceColors[index]}
                            stroke="rgba(0,0,0,0.08)"
                            strokeWidth={activeIndex === index ? 6 : 2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/3 flex flex-col items-start md:items-end gap-2">
                  {problemData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: (item.color && typeof item.color === 'string' && !item.color.startsWith('hsl')) ? item.color : sliceColors[index] }}
                      />
                      <span className="text-sm">
                        {item.name}: <strong>{item.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Progress */}
          <Card className="border-muted/40 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Rating Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={ratingData} margin={{ left: 8, right: 32, top: 8, bottom: 24 }}>
                  {/* compute an interval to avoid overcrowding on small screens */}
                  {
                    (() => {
                      const len = (ratingData || []).length;
                      const maxTicks = chartMaxTicks || 6;
                      const interval = len > 0 ? Math.max(0, Math.floor((len - 1) / maxTicks)) : 0;
                      const isSmall = chartMaxTicks <= 4;
                      return (
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                          interval={interval}
                          padding={{ right: 20 }}
                          tick={renderXAxisTick}
                        />
                      );
                    })()
                  }
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Contribution Heatmap */}
          <Card className="border-muted/40 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GithubIcon className="w-5 h-5 text-primary" />
              GitHub Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-4">
                <div className="min-w-[700px]" ref={heatmapRef} style={{ position: 'relative' }}>
                <CalendarHeatmap
                  startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                  endDate={new Date()}
                  values={contributions}
                  classForValue={(value) => {
                    if (!value || value.count === 0) {
                      return 'color-empty';
                    }
                    return `color-scale-${Math.min(Math.ceil(value.count / 2), 4)}`;
                  }}
                  // Native tooltip via title attribute (no extra API). Example: "9 contributions on July 23rd"
                  // Instead of relying on native title (SVG title isn't consistently shown), add data attributes
                  // and use a small custom tooltip that follows the mouse.
                  tooltipDataAttrs={(value) => {
                    if (!value || !value.date) return {};
                    const d = new Date(value.date);
                    const formatted = d.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    const c = value.count ?? 0;
                    const plural = c === 1 ? 'contribution' : 'contributions';
                    return { ['data-date']: value.date, ['data-count']: String(c), ['data-title']: `${c} ${plural} on ${formatted}` } as any;
                  }}
                  showWeekdayLabels
                />
                {/* Tooltip element positioned absolute within heatmap container */}
                {tooltip.visible && (
                  <div
                    ref={tooltipRef}
                    className="pointer-events-none z-50 rounded px-3 py-1 text-sm bg-card border border-border shadow-lg max-w-xs break-words"
                    style={{ position: 'absolute', left: tooltip.left, top: tooltip.top }}
                  >
                    {tooltip.text}
                  </div>
                )}
              </div>
            </div>
            {ghError && (
              <div className="mt-4 text-sm text-warning">
                <p>GitHub contributions could not be loaded: {ghError}</p>
                <div className="mt-2">
                  <button
                    className="px-3 py-1 rounded-md bg-primary/10 border border-border/50 text-sm"
                    onClick={() => {
                      setRetrying(true);
                      setLoading(true);
                      // trigger fetch by calling useEffect indirectly: naive approach - reload page data
                      // simpler: call the fetch directly here via a small helper
                      (async () => {
                        try {
                          setGhError(null);
                          const GITHUB_USER = (import.meta as any).env?.VITE_GITHUB_USERNAME || 'prathamhanda';
                          const githubUrl = `https://github-contributions-api.deno.dev/${GITHUB_USER}.json`;
                          const response = await fetch(githubUrl);
                          if (!response.ok) throw new Error(`Status ${response.status}`);
                          const data = await response.json();
                          // normalize like main fetch
                          let rawContribs: any[] = [];
                          if (Array.isArray(data.contributions)) rawContribs = data.contributions.some(Array.isArray) ? (data.contributions as any[]).flat() : data.contributions;
                          else if (Array.isArray(data.data)) rawContribs = data.data;
                          else if (Array.isArray((data || {}).years)) rawContribs = (data.years || []).flatMap((y: any) => y.contributions || []);
                          const formattedContributions = (rawContribs || []).map((contrib: any) => ({ date: contrib.date, count: contrib.count ?? contrib.contributionCount ?? 0 }));
                          try { localStorage.setItem(`ghContribs:${GITHUB_USER}`, JSON.stringify({ ts: Date.now(), data: formattedContributions })); } catch (e) {}
                          setContributions(formattedContributions);
                        } catch (err: any) {
                          setGhError(String(err?.message || err));
                        } finally {
                          setLoading(false);
                          setRetrying(false);
                        }
                      })();
                    }}
                  >
                    {retrying ? 'Retrying...' : 'Retry'}
                  </button>
                </div>
              </div>
            )}
            <style>{`
              .react-calendar-heatmap .color-empty {
                fill: hsl(var(--muted) / 0.3);
              }
              .react-calendar-heatmap .color-scale-1 {
                fill: hsl(var(--primary) / 0.3);
              }
              .react-calendar-heatmap .color-scale-2 {
                fill: hsl(var(--primary) / 0.5);
              }
              .react-calendar-heatmap .color-scale-3 {
                fill: hsl(var(--primary) / 0.7);
              }
              .react-calendar-heatmap .color-scale-4 {
                fill: hsl(var(--primary));
              }
              .react-calendar-heatmap text {
                fill: hsl(var(--muted-foreground));
                font-size: 10px;
              }
              .react-calendar-heatmap rect:hover {
                stroke: hsl(var(--primary));
                stroke-width: 2px;
              }
            `}</style>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CodingDashboard;
