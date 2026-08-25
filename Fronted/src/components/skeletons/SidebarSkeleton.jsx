function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-line" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 animate-pulse rounded bg-line" />
            <div className="h-2.5 w-1/3 animate-pulse rounded bg-line" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SidebarSkeleton;
