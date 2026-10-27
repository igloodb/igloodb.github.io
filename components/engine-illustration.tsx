export function EngineIllustration() {
  return (
    <div
      className="engine-illustration"
      role="img"
      aria-label="Developers and AI agents use MCP or JSON to query Igloo. DataFusion joins native and compatible ADBC databases with Parquet snapshots. Agent results are read-only, bounded JSON."
    >
      <svg viewBox="0 0 560 455" fill="none" aria-hidden="true">
        <defs>
          <pattern
            id="grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path d="M24 0H0V24" stroke="#cedbd1" strokeWidth=".6" />
          </pattern>
          <linearGradient
            id="engine-fill"
            x1="180"
            y1="125"
            x2="380"
            y2="330"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e3f4cc" />
            <stop offset="1" stopColor="#c7e8a2" />
          </linearGradient>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="10"
              floodColor="#173d2c"
              floodOpacity=".07"
            />
          </filter>
        </defs>
        <rect x="1" y="1" width="558" height="453" rx="8" fill="url(#grid)" />
        <circle
          cx="280"
          cy="228"
          r="164"
          stroke="#c1d3c5"
          strokeDasharray="4 6"
        />
        <circle cx="280" cy="228" r="113" stroke="#d4e1d7" />
        <path
          d="M280 86V132M280 308V349M135 349V324Q135 300 160 300H192M425 349V324Q425 300 400 300H368"
          stroke="#6a9178"
          strokeWidth="1.5"
        />
        <path
          d="m275 119 5 5 5-5M187 295l5 5-5 5M373 295l-5 5 5 5"
          stroke="#527e60"
          strokeWidth="1.5"
        />
        <g filter="url(#shadow)">
          <rect
            x="176"
            y="37"
            width="208"
            height="49"
            rx="7"
            fill="white"
            stroke="#d4dfd6"
          />
          <path
            d="m197 55 6 6-6 6m13 0h10"
            stroke="#387452"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <text
            x="238"
            y="66"
            fill="#304d39"
            fontSize="13"
            fontFamily="monospace"
          >
            agents + developers
          </text>
        </g>
        <rect x="188" y="137" width="184" height="171" rx="12" fill="#d3decf" />
        <g filter="url(#shadow)">
          <rect
            x="188"
            y="130"
            width="184"
            height="171"
            rx="12"
            fill="url(#engine-fill)"
            stroke="#a9c593"
          />
          <path d="M237 222a43 43 0 0 1 86 0h-86Z" fill="#1f5136" />
          <path
            d="M240 204h80M249 186h62M267 173h26M259 186l-4 18M300 186l5 18M280 173v13M280 186v18M255 204v18M305 204v18"
            stroke="#d8edba"
            strokeWidth="2.5"
          />
          <path d="M269 224v-17a11 11 0 0 1 22 0v17" fill="#d8edba" />
          <text
            x="280"
            y="253"
            textAnchor="middle"
            fill="#1c452e"
            fontFamily="Space Grotesk Variable, sans-serif"
            fontSize="27"
            fontWeight="650"
          >
            igloo.
          </text>
          <rect x="208" y="271" width="144" height="17" rx="3" fill="#b6d99a" />
          <text
            x="280"
            y="283"
            textAnchor="middle"
            fill="#345738"
            fontSize="9"
            letterSpacing="1.1"
            fontFamily="monospace"
          >
            DATAFUSION + ARROW
          </text>
        </g>
        <g filter="url(#shadow)">
          <rect
            x="43"
            y="349"
            width="185"
            height="62"
            rx="7"
            fill="white"
            stroke="#d4dfd6"
          />
          <ellipse
            cx="73"
            cy="370"
            rx="11"
            ry="4"
            stroke="#648274"
            strokeWidth="1.5"
          />
          <path
            d="M62 370v17c0 5 22 5 22 0v-17m-22 8c0 5 22 5 22 0"
            stroke="#648274"
            strokeWidth="1.5"
          />
          <text x="98" y="375" fill="#284431" fontSize="13" fontWeight="600">
            Databases
          </text>
          <text x="98" y="392" fill="#64796c" fontSize="10.5">
            native + ADBC
          </text>
        </g>
        <g filter="url(#shadow)">
          <rect
            x="333"
            y="349"
            width="184"
            height="62"
            rx="7"
            fill="white"
            stroke="#d4dfd6"
          />
          <path
            d="M355 365h14l7 7v23h-21v-30Zm14 0v8h7m-16 6h10m-10 5h10m-10 5h6"
            stroke="#648274"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <text x="389" y="375" fill="#284431" fontSize="13" fontWeight="600">
            Parquet
          </text>
          <text x="389" y="392" fill="#64796c" fontSize="10.5">
            inferred snapshots
          </text>
        </g>
        <path
          d="M372 196h36"
          stroke="#6a9178"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <rect
          x="408"
          y="169"
          width="132"
          height="55"
          rx="6"
          fill="white"
          stroke="#d4dfd6"
        />
        <circle cx="424" cy="185" r="3" fill="#52864b" />
        <text x="435" y="189" fill="#32503c" fontSize="10" fontWeight="600">
          Agent results
        </text>
        <text
          x="422"
          y="209"
          fill="#6d7d6c"
          fontSize="9.5"
          fontFamily="monospace"
        >
          read-only JSON
        </text>
        <rect
          x="28"
          y="136"
          width="107"
          height="27"
          rx="4"
          fill="#f9fcf7"
          stroke="#d4dfd6"
        />
        <text
          x="40"
          y="153"
          fill="#5a7360"
          fontSize="9"
          letterSpacing=".5"
          fontFamily="monospace"
        >
          SINGLE NODE
        </text>
        <path d="M135 150h53" stroke="#a5beaa" strokeDasharray="3 4" />
        <rect
          x="275"
          y="102"
          width="10"
          height="10"
          rx="2"
          fill="#6d9851"
          className="flow-dot"
        />
        <circle cx="135" cy="333" r="3" fill="#6d9851" />
        <circle cx="425" cy="333" r="3" fill="#6d9851" />
        <text
          x="280"
          y="438"
          textAnchor="middle"
          fill="#637c6a"
          fontSize="9"
          letterSpacing="1.6"
          fontFamily="monospace"
        >
          DISCOVER. EXPLAIN. QUERY.
        </text>
      </svg>
    </div>
  );
}
