function MessageSkeleton() {
  const bubbles = [
    { mine: false, w: "w-40" },
    { mine: true, w: "w-52" },
    { mine: false, w: "w-32" },
    { mine: true, w: "w-28" },
  ];

  return (
    <div className="flex flex-1 flex-col justify-end gap-3 px-4 py-4 sm:px-6">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className={`flex ${b.mine ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`h-9 ${b.w} animate-pulse rounded-2xl bg-line`}
          />
        </div>
      ))}
    </div>
  );
}

export default MessageSkeleton;
