import { MessageSquareText } from "lucide-react";

function NoChatSelected() {
  return (
    <div className="animate-fade-in-up flex h-full flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="animate-ring-pulse brand-gradient grid h-16 w-16 place-items-center rounded-2xl text-white">
        <MessageSquareText size={30} />
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">
        Pick a conversation
      </h3>
      <p className="max-w-xs text-sm text-ink-faint">
        Select someone from your contacts on the left to see the conversation
        and start chatting.
      </p>
    </div>
  );
}

export default NoChatSelected;
