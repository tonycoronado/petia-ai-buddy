const ListSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="glass rounded-3xl p-4 flex items-center gap-4 shadow-soft animate-pulse"
      >
        <div className="w-12 h-12 rounded-2xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded-full bg-muted" />
          <div className="h-2.5 w-1/3 rounded-full bg-muted" />
        </div>
      </div>
    ))}
  </div>
);

export default ListSkeleton;
