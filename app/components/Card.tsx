type CardProps = {
  title: string;
  lines: string[];
};

export default function Card({ title, lines }: CardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.07]">
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <div className="mt-3 space-y-1.5">
        {lines.map((line) => (
          <p key={line} className="text-sm leading-6 text-zinc-400">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}