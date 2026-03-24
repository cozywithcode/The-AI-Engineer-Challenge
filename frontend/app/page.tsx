import { ChatPanel } from "@/components/ChatPanel";
import { SignInGate } from "@/components/SignInGate";

export default function Home() {
  return (
    <SignInGate>
      <ChatPanel />
    </SignInGate>
  );
}
