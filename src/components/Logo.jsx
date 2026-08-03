export default function Logo({ size = 56 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Emblema Painel do Toninho"
    >
      <circle cx="60" cy="60" r="57" fill="#2B1B12" />
      <circle
        cx="60"
        cy="60"
        r="49"
        fill="none"
        stroke="#C68A3D"
        strokeWidth="1.5"
        strokeDasharray="2.5 4"
      />
      <defs>
        <path id="arcoTop" d="M 16,64 A 44,44 0 0 1 104,64" />
      </defs>
      <text fill="#F7EFE1" fontSize="10.5" fontFamily="Fraunces, serif" letterSpacing="2" fontWeight="600">
        <textPath href="#arcoTop" startOffset="50%" textAnchor="middle">
          PAINEL DO TONINHO
        </textPath>
      </text>
      <g transform="translate(60,66)">
        <path
          d="M -20,-6 C -20,-14 -12,-20 0,-20 C 12,-20 20,-14 20,-6 L 18,10 C 17,17 10,22 0,22 C -10,22 -17,17 -18,10 Z"
          fill="#C68A3D"
        />
        <path
          d="M 20,-8 C 28,-10 34,-4 32,4 C 30,11 22,12 19,10"
          fill="none"
          stroke="#C68A3D"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path d="M -14,-10 C -8,-4 8,-4 14,-10" fill="none" stroke="#2B1B12" strokeWidth="2" strokeLinecap="round" />
        <path d="M -6,-27 C -9,-24 -6,-21 -8,-18" fill="none" stroke="#DCA75C" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 4,-28 C 1,-25 4,-22 2,-19" fill="none" stroke="#DCA75C" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <text
        x="60"
        y="98"
        fill="#DCA75C"
        fontSize="8.5"
        fontFamily="IBM Plex Mono, monospace"
        letterSpacing="3"
        textAnchor="middle"
      >
        GRÃOS &amp; FEIJÕES
      </text>
    </svg>
  )
}
