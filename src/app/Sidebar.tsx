import clsx from "clsx";
import { NavLink } from "react-router-dom";

type NavItem = {
  label: string;
  to: string;
  icon: string;
  section: "practice" | "system";
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/", icon: "🏠", section: "practice" },
  { label: "VoiceLab", to: "/voicelab", icon: "🎙️", section: "practice" },
  { label: "Skills", to: "/skills", icon: "📚", section: "practice" },
  { label: "Settings", to: "/settings", icon: "⚙️", section: "system" },
];

const SECTION_LABELS: Record<NavItem["section"], string> = {
  practice: "Practice",
  system: "System",
};

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header__logo">KZ</div>
        <div className="sidebar-label">
          <div className="heading-sm">Kdenz</div>
          <p className="text-muted">Speech Intelligence</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {(["practice", "system"] as const).map((section) => {
          const items = NAV_ITEMS.filter((item) => item.section === section);
          if (!items.length) return null;
          return (
            <div key={section} className="sidebar-nav__section">
              <div className="sidebar-nav__label">{SECTION_LABELS[section]}</div>
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    clsx("sidebar-nav__item", { "is-active": isActive })
                  }
                >
                  <span className="sidebar-nav__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="sidebar-nav__text">{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
