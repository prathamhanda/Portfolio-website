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
  reputation: number;
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
    reputation: 0,
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
          reputation: data.reputation || 0,
        });

        // Mock rating data - replace with actual API data if available
        const mockRatingData = [
          { date: 'Jan', rating: 1400 },
          { date: 'Feb', rating: 1450 },
          { date: 'Mar', rating: 1520 },
          { date: 'Apr', rating: 1580 },
          { date: 'May', rating: 1650 },
          { date: 'Jun', rating: 1700 },
        ];
        setRatingData(mockRatingData);
      } catch (error) {
        console.error('Error fetching LeetCode stats:', error);
      }
    };

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
      const adjust = () => {
        if (!tooltipRef.current || !container) return;
        const tt = tooltipRef.current;
        const bounds = container.getBoundingClientRect();
        const ttW = tt.offsetWidth;
        const ttH = tt.offsetHeight;
        if (debug) console.debug('[heatmap-debug] adjust - ttW,ttH,bounds', ttW, ttH, bounds.width, bounds.height);
        setTooltip((prev) => {
          if (!prev.visible) return prev;
          let left = prev.x + 12;
          let top = prev.y + 12;
          if (left + ttW > bounds.width) {
            left = Math.max(prev.x - ttW - 12, 8);
            if (debug) console.debug('[heatmap-debug] flipped left to', left);
          }
          if (top + ttH > bounds.height) {
            top = Math.max(bounds.height - ttH - 8, 8);
            if (debug) console.debug('[heatmap-debug] flipped top to', top);
          }
          return { ...prev, left, top };
        });
      };

      const onPointerMove = (e: PointerEvent) => {
        const target = e.target as HTMLElement | null;
        const rectEl = target?.closest ? (target.closest('rect') as SVGRectElement | null) : null;
        if (rectEl && rectEl.hasAttribute('data-date')) {
          const date = rectEl.getAttribute('data-date') || '';
          const count = rectEl.getAttribute('data-count') || '0';
          const title = rectEl.getAttribute('data-title') || `${count} contributions on ${date}`;
          const bounds = container!.getBoundingClientRect();
          const anchorX = (e as PointerEvent).clientX - bounds.left;
          const anchorY = (e as PointerEvent).clientY - bounds.top;
          if (debug) console.debug('[heatmap-debug] pointermove rect', { date, count, title, anchorX, anchorY });
          // initial guess for left/top; will be adjusted to avoid overflow
          setTooltip({ visible: true, x: anchorX, y: anchorY, left: anchorX + 12, top: anchorY + 12, text: title });
          // Ensure measurement runs after tooltip has been painted: double RAF
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (debug) {
              const tt = tooltipRef.current;
              console.debug('[heatmap-debug] after RAF tooltip exists?', !!tt, 'offsets', tt?.offsetWidth, tt?.offsetHeight);
            }
            adjust();
          }));
        } else {
          if (debug) console.debug('[heatmap-debug] pointermove - no rect found, hiding');
          setTooltip((t) => t.visible ? { ...t, visible: false } : t);
        }
      };

  const onPointerOver = (e: PointerEvent) => { if (debug) console.debug('[heatmap-debug] pointerover'); onPointerMove(e); };
  const onPointerOut = () => { if (debug) console.debug('[heatmap-debug] pointerout'); setTooltip((t) => t.visible ? { ...t, visible: false } : t); };

      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerover', onPointerOver);
      container.addEventListener('pointerout', onPointerOut);
      window.addEventListener('resize', adjust);

      // clean up on unmount
      return () => {
        try { container?.removeEventListener('pointermove', onPointerMove); } catch (e) {}
        try { container?.removeEventListener('pointerover', onPointerOver); } catch (e) {}
        try { container?.removeEventListener('pointerout', onPointerOut); } catch (e) {}
        try { window.removeEventListener('resize', adjust); } catch (e) {}
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

  const problemData = [
    { name: 'Easy', value: leetcodeStats.easySolved, color: 'hsl(var(--chart-1))' },
    { name: 'Medium', value: leetcodeStats.mediumSolved, color: 'hsl(var(--chart-2))' },
    { name: 'Hard', value: leetcodeStats.hardSolved, color: 'hsl(var(--chart-3))' },
  ];

  // Preferred slice colors (LeetCode-like) used as fallbacks if entry.color isn't set
  const sliceColors = ['#28a745', '#f59e0b', '#ef4444'];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  const totalSolvedDisplayed = leetcodeStats.totalSolved + gfgCount;

  const statCards = [
    {
      title: "Total Solved",
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
      title: "Streak Days",
      value: leetcodeStats.contributionPoints,
      icon: Flame,
      color: "text-orange-500 dark:text-orange-400",
    },
    {
      title: "Reputation",
      value: leetcodeStats.reputation,
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
                  <stat.icon className={`w-8 h-8 ${stat.color} transition-transform duration-300 group-hover:scale-110`} />
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
                <LineChart data={ratingData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
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
