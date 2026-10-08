export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className={`grid h-7 w-7 place-items-center rounded-[6px] text-[13px] font-semibold ${
          inverted ? "bg-white text-zinc-950" : "bg-brand text-zinc-50"
        }`}
      >
        V
      </span>
      <span className={`font-heading text-[17px] font-semibold tracking-tight ${inverted ? "text-zinc-50" : "text-zinc-950"}`}>
        VroomDealer
      </span>
    </span>
  );
}
