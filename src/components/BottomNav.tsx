import { Home, Timer, MessageSquare, Gamepad2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useTimer } from '../contexts/TimerContext';

export default function BottomNav() {
  const { timerState } = useTimer();
  const isTimerActive = timerState.isActive && !timerState.isPaused;

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Timer, label: 'Timer', path: '/timer', showIndicator: isTimerActive },
    { icon: MessageSquare, label: 'Chatbot', path: '/chatbot' },
    { icon: Gamepad2, label: 'Giochi', path: '/games' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
                isActive ? "text-primary-blue" : "text-gray-400"
              )
            }
          >
            <div className="relative">
              <item.icon size={24} strokeWidth={2} />
              {item.showIndicator && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}