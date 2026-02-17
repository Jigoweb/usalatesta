import { Gamepad2 } from 'lucide-react';
import ComingSoonOverlay from '../components/ComingSoonOverlay';

const GAMES_COMING_SOON = import.meta.env.VITE_GAMES_COMING_SOON === 'true';

export default function Games() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <ComingSoonOverlay enabled={GAMES_COMING_SOON} icon={Gamepad2} title="Giochi" />
      <div className="p-4">Games Page</div>
    </div>
  );
}