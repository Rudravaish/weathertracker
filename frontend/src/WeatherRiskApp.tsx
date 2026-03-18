import { useState, useRef } from 'react'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8001'

const CONDITIONS_CONFIG = {
  thunderstorm: {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
        <polyline points="13 11 9 17 15 17 11 23" />
      </svg>
    ),
    label: 'Thunderstorm',
    gradient: 'from-slate-900 via-indigo-950 to-slate-900',
    accent: '#818cf8',
    cardBg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.3)',
  },
  extreme_heat: {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    label: 'Extreme Heat',
    gradient: 'from-orange-950 via-red-900 to-amber-950',
    accent: '#fb923c',
    cardBg: 'rgba(251,146,60,0.12)',
    border: 'rgba(251,146,60,0.3)',
  },
  high_wind: {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    ),
    label: 'High Wind',
    gradient: 'from-cyan-950 via-slate-900 to-cyan-950',
    accent: '#22d3ee',
    cardBg: 'rgba(34,211,238,0.1)',
    border: 'rgba(34,211,238,0.3)',
  },
  heavy_precipitation: {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="16" y1="13" x2="16" y2="21" />
        <line x1="8" y1="13" x2="8" y2="21" />
        <line x1="12" y1="15" x2="12" y2="23" />
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
      </svg>
    ),
    label: 'Heavy Rain',
    gradient: 'from-blue-950 via-slate-900 to-blue-950',
    accent: '#60a5fa',
    cardBg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.3)',
  },
  clear: {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    label: 'Clear',
    gradient: 'from-sky-950 via-slate-900 to-sky-950',
    accent: '#7dd3fc',
    cardBg: 'rgba(125,211,252,0.08)',
    border: 'rgba(125,211,252,0.2)',
  },
} as const

const RISK_CONFIG = {
  Low: {
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.12)',
    border: 'rgba(74,222,128,0.35)',
    label: 'Low Risk',
    emoji: '✓',
  },
  Moderate: {
    color: '#facc15',
    bg: 'rgba(250,204,21,0.12)',
    border: 'rgba(250,204,21,0.35)',
    label: 'Moderate Risk',
    emoji: '!',
  },
  High: {
    color: '#fb923c',
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.35)',
    label: 'High Risk',
    emoji: '!!',
  },
  Extreme: {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.12)',
    border: 'rgba(248,113,113,0.35)',
    label: 'Extreme Risk',
    emoji: '!!!',
  },
} as const

const SEVERITY_CONFIG = {
  Minor: { color: '#a3e635', bg: 'rgba(163,230,53,0.12)', border: 'rgba(163,230,53,0.3)' },
  Moderate: { color: '#facc15', bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.3)' },
  Severe: { color: '#fb923c', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  Extreme: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
} as const

type RiskLevelKey = keyof typeof RISK_CONFIG

type CurrentConditions = {
  is_thunderstorm?: boolean
  is_extreme_heat?: boolean
  is_high_wind?: boolean
  is_heavy_precipitation?: boolean
  temperature_c?: number
  wind_speed_kph?: number
  wind_direction?: string
  short_description?: string
}

type ForecastPeriod = CurrentConditions & {
  name?: string
}

type Alert = {
  id: string
  event: string
  severity: keyof typeof SEVERITY_CONFIG
  headline?: string
  description?: string
  instruction?: string
}

type ApiResponse = {
  location: string
  coordinates: { latitude: number; longitude: number }
  current_conditions: CurrentConditions
  short_term_forecast: { periods: ForecastPeriod[] }
  alerts: Alert[]
  risk_score: number
  risk_level: RiskLevelKey
  ai: { explanation: string; recommendations: string[] }
}

function getConditionType(cc: CurrentConditions): keyof typeof CONDITIONS_CONFIG {
  if (cc.is_thunderstorm) return 'thunderstorm'
  if (cc.is_extreme_heat) return 'extreme_heat'
  if (cc.is_high_wind) return 'high_wind'
  if (cc.is_heavy_precipitation) return 'heavy_precipitation'
  return 'clear'
}

function formatTemp(c: number | undefined) {
  if (c == null) return '—'
  return `${Math.round(c)}°C / ${Math.round((c * 9) / 5 + 32)}°F`
}

function formatWind(kph: number | undefined) {
  if (kph == null) return '—'
  return `${Math.round(kph)} kph`
}

function ScoreRing({
  score,
  level,
  size = 120,
}: {
  score: number
  level: RiskLevelKey
  size?: number
}) {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG.Low
  const r = 44
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: 'rotate(-90deg)' }}
    >
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={cfg.color}
        strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: '50px 50px',
          fontSize: '22px',
          fontWeight: 700,
          fill: cfg.color,
          fontFamily: 'system-ui',
        }}
      >
        {score}
      </text>
    </svg>
  )
}

function ForecastPill({ period }: { period: ForecastPeriod }) {
  const type = getConditionType(period)
  const cfg = CONDITIONS_CONFIG[type]
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: 12,
        background: cfg.cardBg,
        border: `1px solid ${cfg.border}`,
        minWidth: 110,
        flexShrink: 0,
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
          margin: '0 0 4px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {period.name || '—'}
      </p>
      <div
        style={{
          width: 18,
          height: 18,
          color: cfg.accent,
          marginBottom: 6,
        }}
      >
        {cfg.icon}
      </div>
      <p
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.85)',
          margin: '0 0 2px',
          fontWeight: 500,
        }}
      >
        {period.temperature_c != null ? `${Math.round(period.temperature_c)}°C` : '—'}
      </p>
      <p
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.45)',
          margin: 0,
        }}
      >
        {period.short_description?.slice(0, 18) || cfg.label}
      </p>
    </div>
  )
}

export default function WeatherRiskApp() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const condType = data ? getConditionType(data.current_conditions) : 'clear'
  const condCfg = CONDITIONS_CONFIG[condType]
  const riskCfg = data ? RISK_CONFIG[data.risk_level] || RISK_CONFIG.Low : null

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setData(null)
    setRevealed(false)
    try {
      const res = await fetch(`${API_BASE}/api/assess-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: query.trim() }),
      })
      if (!res.ok) {
        const err: any = await res.json().catch(() => ({}))
        throw new Error(err.detail || `HTTP ${res.status}`)
      }
      const json: ApiResponse = await res.json()
      setData(json)
      setTimeout(() => setRevealed(true), 80)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data.')
    } finally {
      setLoading(false)
    }
  }

  const suggestions = ['New York, NY', 'Miami, FL', 'Oklahoma City, OK', 'Seattle, WA', 'Phoenix, AZ']

  return (
    <div
      style={{
        minHeight: '100vh',
        background: data
          ? `linear-gradient(135deg, ${condCfg.gradient
              .replace('from-', '')
              .replace(' via-', ', ')
              .replace(' to-', ', ')})`
          : 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)',
        transition: 'background 1.2s ease',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: '#f1f5f9',
        padding: '0 0 60px',
      }}
    >
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.3); }
        .fade-up {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          backdrop-filter: blur(8px);
        }
        .pill-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .pill-row::-webkit-scrollbar { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); }
          70% { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      `}
      </style>

      <div style={{ textAlign: 'center', padding: '56px 24px 32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100,
            padding: '6px 16px',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#4ade80',
              animation: 'pulse-ring 2s infinite',
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Live NWS Data
          </span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(28px,5vw,48px)',
            fontWeight: 300,
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          Weather Risk
          <span style={{ fontWeight: 600, display: 'block' }}>Assessment</span>
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 15,
            margin: 0,
            fontWeight: 300,
          }}
        >
          Real-time hazard scoring powered by National Weather Service
        </p>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 20px 28px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 18,
                height: 18,
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City name or ZIP code..."
              style={{
                width: '100%',
                padding: '14px 14px 14px 42px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 14,
                color: '#f1f5f9',
                fontSize: 15,
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.4)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.15)'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 22px',
              borderRadius: 14,
              border: 'none',
              background: loading ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.92)',
              color: loading ? 'rgba(255,255,255,0.4)' : '#0f172a',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
          >
            {loading ? (
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderTopColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
            ) : (
              'Assess Risk'
            )}
          </button>
        </form>

        {!data && !loading && (
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s)
                  setTimeout(() => handleSearch(), 10)
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: 100,
                  fontSize: 12,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.55)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.background = 'rgba(255,255,255,0.1)'
                  target.style.color = 'rgba(255,255,255,0.85)'
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.background = 'rgba(255,255,255,0.06)'
                  target.style.color = 'rgba(255,255,255,0.55)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div style={{ maxWidth: 560, margin: '0 auto 24px', padding: '0 20px' }}>
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 14,
              background: 'rgba(248,113,113,0.12)',
              border: '1px solid rgba(248,113,113,0.3)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: '#fca5a5',
              }}
            >
              ⚠ {error}
            </p>
          </div>
        </div>
      )}

      {data && (
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            className={`card fade-up ${revealed ? 'visible' : ''}`}
            style={{
              padding: '28px',
              transition: 'opacity 0.55s ease, transform 0.55s ease',
              borderColor: riskCfg?.border,
              background: riskCfg?.bg,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      color: condCfg.accent,
                    }}
                  >
                    {condCfg.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {condCfg.label}
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(22px,4vw,32px)',
                    fontWeight: 600,
                    margin: '0 0 6px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {data.location}
                </h2>
                {riskCfg && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 12px',
                      borderRadius: 100,
                      background: riskCfg.bg,
                      border: `1px solid ${riskCfg.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: riskCfg.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: riskCfg.color,
                      }}
                    >
                      {riskCfg.label}
                    </span>
                  </div>
                )}
                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.35)',
                    margin: '8px 0 0',
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {data.coordinates.latitude.toFixed(4)}°N{' '}
                  {data.coordinates.longitude.toFixed(4)}°W
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ScoreRing score={data.risk_score} level={data.risk_level} size={110} />
                <p
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)',
                    margin: '4px 0 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Risk Score
                </p>
              </div>
            </div>
          </div>

          <div
            className={`card fade-up ${revealed ? 'visible' : ''}`}
            style={{ padding: '22px 24px', transitionDelay: '0.1s' }}
          >
            <p
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.4)',
                margin: '0 0 16px',
                fontWeight: 500,
              }}
            >
              Current Conditions
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 12,
              }}
            >
              {[
                {
                  label: 'Temperature',
                  value: formatTemp(data.current_conditions.temperature_c),
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                    </svg>
                  ),
                },
                {
                  label: 'Wind Speed',
                  value: formatWind(data.current_conditions.wind_speed_kph),
                  icon: CONDITIONS_CONFIG.high_wind.icon,
                },
                {
                  label: 'Wind Direction',
                  value: data.current_conditions.wind_direction || '—',
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                  ),
                },
                {
                  label: 'Description',
                  value: data.current_conditions.short_description || '—',
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
                    </svg>
                  ),
                },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      color: condCfg.accent,
                      marginBottom: 8,
                    }}
                  >
                    {icon}
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                      margin: '0 0 3px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      margin: 0,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`card fade-up ${revealed ? 'visible' : ''}`}
            style={{ padding: '22px 24px', transitionDelay: '0.15s' }}
          >
            <p
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.4)',
                margin: '0 0 14px',
                fontWeight: 500,
              }}
            >
              Next 12–24 Hours
            </p>
            <div className="pill-row">
              {data.short_term_forecast.periods.slice(0, 6).map((p, idx) => (
                <ForecastPill key={`${p.name ?? 'period'}-${idx}`} period={p} />
              ))}
            </div>
          </div>

          {data.alerts.length > 0 && (
            <div
              className={`card fade-up ${revealed ? 'visible' : ''}`}
              style={{ padding: '22px 24px', transitionDelay: '0.2s' }}
            >
              <p
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(248,250,252,0.6)',
                  margin: '0 0 10px',
                  fontWeight: 500,
                }}
              >
                Active Alerts
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {data.alerts.map((a) => {
                  const cfg = SEVERITY_CONFIG[a.severity]
                  return (
                    <div
                      key={a.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 14,
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 600,
                            color: cfg.color,
                          }}
                        >
                          {a.event}
                        </p>
                        <span
                          style={{
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'rgba(15,23,42,0.8)',
                            background: 'rgba(255,255,255,0.96)',
                            padding: '3px 8px',
                            borderRadius: 999,
                          }}
                        >
                          {a.severity}
                        </span>
                      </div>
                      {a.headline && (
                        <p
                          style={{
                            margin: '0 0 4px',
                            fontSize: 12,
                            color: 'rgba(15,23,42,0.96)',
                          }}
                        >
                          {a.headline}
                        </p>
                      )}
                      {a.description && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            color: 'rgba(15,23,42,0.8)',
                          }}
                        >
                          {a.description}
                        </p>
                      )}
                      {a.instruction && (
                        <p
                          style={{
                            margin: '6px 0 0',
                            fontSize: 12,
                            color: 'rgba(15,23,42,0.9)',
                            fontWeight: 500,
                          }}
                        >
                          {a.instruction}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {data.ai && (
            <div
              className={`card fade-up ${revealed ? 'visible' : ''}`}
              style={{ padding: '22px 24px', transitionDelay: '0.25s' }}
            >
              <p
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.4)',
                  margin: '0 0 10px',
                  fontWeight: 500,
                }}
              >
                AI Explanation
              </p>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 14,
                  color: 'rgba(226,232,240,0.95)',
                  lineHeight: 1.5,
                }}
              >
                {data.ai.explanation}
              </p>
              {data.ai.recommendations?.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    fontSize: 13,
                    color: 'rgba(226,232,240,0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  {data.ai.recommendations.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

