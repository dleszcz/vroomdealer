export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      <svg
        viewBox="0 0 100 100"
        className={`h-9 w-9 ${inverted ? "fill-white" : "fill-brand"}`}
        aria-hidden="true"
      >
        <path
          transform="translate(3.0 -3.6) scale(0.94)"
          fillRule="evenodd"
          d="M30 20H70L78.4 34H91L92 40L85 43L95 47L97 62L96 79L93 94H73L71 84H29L27 94H7L4 79L3 62L5 47L15 43L8 40L9 34H21.6Z M34 26H66L75 40H25Z M10 52L17 47L33 54L17 58Z M90 52L83 47L67 54L83 58Z M36 52H47L50 66L53 52H64L56 78H44Z M12 67H29L26 73H14Z M88 67H71L74 73H86Z"
        />
      </svg>
      <span className="font-logo text-[22px] font-bold tracking-tight">
        <span className={inverted ? "text-zinc-50" : "text-[#0a0a0a]"}>Vroom</span>
        <span className="text-brand">Dealer</span>
      </span>
    </span>
  );
}
