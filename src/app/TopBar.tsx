type TopBarProps = {
  onSidebarToggle: () => void;
};

export default function TopBar({ onSidebarToggle }: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="top-bar__brand">
        <button
          type="button"
          className="top-bar__hamburger"
          aria-label="Toggle sidebar"
          onClick={onSidebarToggle}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="top-bar__title">
          <p className="top-bar__label">Now practicing</p>
          <h2 className="top-bar__heading">VoiceLab</h2>
        </div>
      </div>

      <div className="top-bar__actions">
        <button className="btn btn--secondary" type="button">
          Practice Again
        </button>
        <div className="top-bar__profile">
          <div className="top-bar__avatar">KT</div>
          <div className="top-bar__profile-meta">
            <span className="top-bar__name">Kdenz Team</span>
            <span className="top-bar__role">Practice Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
