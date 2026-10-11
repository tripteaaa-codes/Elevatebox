import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  RefreshCw
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000/api/leads";

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "—";

  const number = Number(String(value).replace(/[₹,\s]/g, "").replace(/rupees?/i, ""));

  if (Number.isNaN(number)) return String(value);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(number);
}

function getStatusClass(status) {
  return (status || "Cold").toLowerCase();
}

function App() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function fetchLeads() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.leads)) {
        throw new Error("Unexpected response from the Leads API.");
      }

      setLeads(data.leads);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        "Unable to connect to the backend. Make sure your Express server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const stats = useMemo(() => {
    const hot = leads.filter(
      lead => getStatusClass(lead.leadStatus) === "hot"
    ).length;

    const warm = leads.filter(
      lead => getStatusClass(lead.leadStatus) === "warm"
    ).length;

    const cold = leads.filter(
      lead => getStatusClass(lead.leadStatus) === "cold"
    ).length;

    const budgets = leads.reduce((total, lead) => {
      const amount = Number(
        String(lead.budget || "")
          .replace(/[₹,\s]/g, "")
          .replace(/rupees?/i, "")
      );

      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return {
      total: leads.length,
      hot,
      warm,
      cold,
      budgets
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter(lead => {
      const matchesStatus =
        statusFilter === "All" ||
        getStatusClass(lead.leadStatus) === statusFilter.toLowerCase();

      const searchableText = [
        lead.businessType,
        lead.phoneNumber,
        lead.budget,
        lead.timeline,
        lead.id,
        ...(lead.features || [])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [leads, search, statusFilter]);

  const statsCards = [
    {
      title: "Total leads",
      value: stats.total,
      icon: Users,
      className: "purple",
      note: "Saved business prospects"
    },
    {
      title: "Hot leads",
      value: stats.hot,
      icon: Target,
      className: "orange",
      note: "High-priority prospects"
    },
    {
      title: "Warm leads",
      value: stats.warm,
      icon: Activity,
      className: "blue",
      note: "Potential opportunities"
    },
    {
      title: "Cold leads",
      value: stats.cold,
      icon: Clock3,
      className: "green",
      note: "Need further nurturing"
    }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={23} />
          </div>
          <div>
            <h1>ElevateBox<span>.AI</span></h1>
            <p>SALES INTELLIGENCE</p>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          <button className="nav-item active">
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </button>

          <button
            className="nav-item"
            onClick={() => {
              document.getElementById("leads-section")?.scrollIntoView({
                behavior: "smooth"
              });
              setMobileMenu(false);
            }}
          >
            <Users size={19} />
            <span>Lead management</span>
            <span className="nav-count">{stats.total}</span>
          </button>

          <button
            className="nav-item"
            onClick={() => {
              setStatusFilter("Hot");
              document.getElementById("leads-section")?.scrollIntoView({
                behavior: "smooth"
              });
              setMobileMenu(false);
            }}
          >
            <Target size={19} />
            <span>Hot prospects</span>
          </button>

          <button
            className="nav-item"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              fetchLeads();
              setMobileMenu(false);
            }}
          >
            <RefreshCw size={19} />
            <span>Refresh data</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-card">
            <div className="ai-card-icon">
              <Sparkles size={17} />
            </div>
            <h3>Your AI sales engine</h3>
            <p>Organize prospects and discover your next opportunity.</p>
            <div className="ai-status">
              <span />
              Dashboard connected
            </div>
          </div>

          <button className="nav-item settings-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="profile-avatar">EB</div>
            <div className="profile-info">
              <strong>ElevateBox Admin</strong>
              <span>Workspace owner</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <button
          className="sidebar-overlay"
          onClick={() => setMobileMenu(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={15} />
            <strong>Overview</strong>
          </div>

          <div className="topbar-right">
            <div className="connection-indicator">
              <span />
              Local workspace
            </div>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="top-avatar">EB</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-section">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} />
                YOUR SALES COMMAND CENTER
              </div>
              <h2>Good to see you<span>.</span></h2>
              <p>
                Track your prospects, understand their needs, and find your
                next business opportunity.
              </p>
            </div>

            <button className="refresh-button" onClick={fetchLeads}>
              <RefreshCw size={16} className={loading ? "spinning" : ""} />
              Refresh data
            </button>
          </section>

          <section className="hero-card">
            <div className="hero-content">
              <div className="hero-tag">
                <Sparkles size={14} />
                SALES INTELLIGENCE
              </div>
              <h2>Every conversation.<br />A new opportunity.</h2>
              <p>
                Your business prospects, qualification scores, and requirements
                — organized in one place.
              </p>

              <button
                className="hero-button"
                onClick={() =>
                  document.getElementById("leads-section")?.scrollIntoView({
                    behavior: "smooth"
                  })
                }
              >
                Explore your leads
                <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />
              <div className="visual-orbit orbit-three" />
              <div className="visual-center">
                <Sparkles size={37} />
              </div>
              <div className="floating-icon floating-one">
                <Users size={21} />
              </div>
              <div className="floating-icon floating-two">
                <Target size={21} />
              </div>
              <div className="floating-icon floating-three">
                <MessageSquareText size={21} />
              </div>
            </div>

            <div className="hero-decoration decoration-one" />
            <div className="hero-decoration decoration-two" />
          </section>

          {error && (
            <div className="error-banner">
              <div>
                <strong>Backend connection issue</strong>
                <p>{error}</p>
              </div>
              <button onClick={fetchLeads}>Try again</button>
            </div>
          )}

          <section className="stats-grid">
            {statsCards.map(card => {
              const Icon = card.icon;

              return (
                <article className="stat-card" key={card.title}>
                  <div className="stat-top">
                    <div className={`stat-icon ${card.className}`}>
                      <Icon size={20} />
                    </div>
                    <span className="stat-period">ALL TIME</span>
                  </div>
                  <div className="stat-value">
                    {loading ? "—" : card.value}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.note}</p>
                </article>
              );
            })}
          </section>

          <section className="insight-grid">
            <article className="panel pipeline-panel">
              <div className="panel-heading">
                <div>
                  <h3>Lead pipeline</h3>
                  <p>Understand your current prospect mix</p>
                </div>
                <div className="heading-icon">
                  <Activity size={19} />
                </div>
              </div>

              <div className="pipeline-total">
                <div>
                  <span>Total prospects</span>
                  <strong>{loading ? "—" : stats.total}</strong>
                </div>
                <div className="pipeline-symbol">
                  <Users size={22} />
                </div>
              </div>

              <div className="pipeline-bar">
                <span
                  className="pipeline-hot"
                  style={{
                    width: stats.total ? `${(stats.hot / stats.total) * 100}%` : "0%"
                  }}
                />
                <span
                  className="pipeline-warm"
                  style={{
                    width: stats.total ? `${(stats.warm / stats.total) * 100}%` : "0%"
                  }}
                />
                <span
                  className="pipeline-cold"
                  style={{
                    width: stats.total ? `${(stats.cold / stats.total) * 100}%` : "0%"
                  }}
                />
              </div>

              <div className="pipeline-legend">
                <button onClick={() => setStatusFilter("Hot")}>
                  <span className="legend-dot hot-dot" />
                  <span>Hot</span>
                  <strong>{stats.hot}</strong>
                </button>
                <button onClick={() => setStatusFilter("Warm")}>
                  <span className="legend-dot warm-dot" />
                  <span>Warm</span>
                  <strong>{stats.warm}</strong>
                </button>
                <button onClick={() => setStatusFilter("Cold")}>
                  <span className="legend-dot cold-dot" />
                  <span>Cold</span>
                  <strong>{stats.cold}</strong>
                </button>
              </div>
            </article>

            <article className="panel budget-panel">
              <div className="panel-heading">
                <div>
                  <h3>Budget overview</h3>
                  <p>Combined stated lead budgets</p>
                </div>
                <div className="heading-icon green-heading">
                  <CircleDollarSign size={20} />
                </div>
              </div>

              <div className="budget-amount">
                {loading ? "—" : formatCurrency(stats.budgets)}
              </div>
              <div className="budget-subtitle">
                <ShieldCheck size={16} />
                Based on available lead data
              </div>

              <div className="budget-footer">
                <div>
                  <span>Qualified prospects</span>
                  <strong>{stats.hot + stats.warm}</strong>
                </div>
                <div className="budget-footer-icon">
                  <BriefcaseBusiness size={20} />
                </div>
              </div>
            </article>
          </section>

          <section className="panel leads-panel" id="leads-section">
            <div className="leads-heading">
              <div>
                <div className="section-title-row">
                  <h3>Business leads</h3>
                  <span className="table-count">{filteredLeads.length}</span>
                </div>
                <p>Review your prospects and their requirements.</p>
              </div>

              <button className="table-refresh" onClick={fetchLeads}>
                <RefreshCw size={15} />
                <span>Sync</span>
              </button>
            </div>

            <div className="table-controls">
              <div className="search-box">
                <Search size={17} />
                <input
                  type="text"
                  placeholder="Search businesses, budgets, features..."
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="filter-box">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={event => setStatusFilter(event.target.value)}
                >
                  <option value="All">All leads</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
                <ChevronDown size={15} />
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>BUSINESS</th>
                    <th>LEAD SCORE</th>
                    <th>BUDGET</th>
                    <th>TIMELINE</th>
                    <th>STATUS</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="state-cell">
                        <RefreshCw size={21} className="spinning" />
                        <span>Loading your leads...</span>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="state-cell">
                        <div className="empty-state">
                          <div className="empty-icon">
                            {search || statusFilter !== "All" ? (
                              <Search size={23} />
                            ) : (
                              <Users size={23} />
                            )}
                          </div>
                          <strong>
                            {search || statusFilter !== "All"
                              ? "No matching leads"
                              : "Your pipeline starts here"}
                          </strong>
                          <p>
                            {search || statusFilter !== "All"
                              ? "Try changing your search or status filter."
                              : "Saved business prospects will appear here when your calling workflow records them."}
                          </p>
                          {(search || statusFilter !== "All") && (
                            <button
                              onClick={() => {
                                setSearch("");
                                setStatusFilter("All");
                              }}
                            >
                              Clear filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead, index) => (
                      <tr key={lead.id || index}>
                        <td>
                          <div className="business-cell">
                            <div className={`business-avatar avatar-${index % 5}`}>
                              {(lead.businessType || "B")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div className="business-info">
                              <strong>{lead.businessType || "Unspecified business"}</strong>
                              <span>{lead.phoneNumber || "No phone number"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="score-cell">
                            <strong>{lead.leadScore ?? 0}</strong>
                            <div className="score-track">
                              <span
                                style={{
                                  width: `${Math.max(
                                    0,
                                    Math.min(100, Number(lead.leadScore) || 0)
                                  )}%`
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="budget-cell">
                          {formatCurrency(lead.budget)}
                        </td>
                        <td>
                          <div className="timeline-cell">
                            <CalendarClock size={15} />
                            <span>{lead.timeline || "Not specified"}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${getStatusClass(lead.leadStatus)}`}
                          >
                            <span />
                            {lead.leadStatus || "Cold"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="row-action"
                            onClick={() => setSelectedLead(lead)}
                            aria-label={`View ${lead.businessType || "lead"}`}
                          >
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>
                Showing <strong>{filteredLeads.length}</strong> of{" "}
                <strong>{leads.length}</strong> leads
              </span>
              <span className="sync-time">
                {lastUpdated
                  ? `Last synced ${lastUpdated.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}`
                  : "Waiting for first sync"}
              </span>
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 ElevateBox.AI</span>
            <span>
              <span className="footer-status" />
              Sales intelligence workspace
            </span>
          </footer>
        </div>
      </main>

      {selectedLead && (
        <div
          className="modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setSelectedLead(null);
          }}
        >
          <section
            className="lead-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">LEAD DETAILS</span>
                <h2 id="lead-modal-title">
                  {selectedLead.businessType || "Business prospect"}
                </h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelectedLead(null)}
                aria-label="Close lead details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="modal-score">
              <div>
                <span>Lead score</span>
                <strong>{selectedLead.leadScore ?? 0}/100</strong>
              </div>
              <span
                className={`status-badge ${getStatusClass(selectedLead.leadStatus)}`}
              >
                <span />
                {selectedLead.leadStatus || "Cold"}
              </span>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span>Contact number</span>
                <strong>{selectedLead.phoneNumber || "Not available"}</strong>
              </div>
              <div className="detail-item">
                <span>Product count</span>
                <strong>{selectedLead.productCount ?? "Not specified"}</strong>
              </div>
              <div className="detail-item">
                <span>Budget</span>
                <strong>{formatCurrency(selectedLead.budget)}</strong>
              </div>
              <div className="detail-item">
                <span>Timeline</span>
                <strong>{selectedLead.timeline || "Not specified"}</strong>
              </div>
              <div className="detail-item">
                <span>Language</span>
                <strong>
                  {{ en: "English", hi: "Hindi", te: "Telugu" }[
                    selectedLead.language
                  ] || selectedLead.language || "English"}
                </strong>
              </div>
              <div className="detail-item">
                <span>Callback requested</span>
                <strong>
                  {selectedLead.callbackRequested ? "Yes" : "No"}
                </strong>
              </div>
            </div>

            <div className="features-section">
              <h3>Requested features</h3>
              <div className="feature-list">
                {selectedLead.features?.length ? (
                  selectedLead.features.map(feature => (
                    <span className="feature-chip" key={feature}>
                      <ShieldCheck size={14} />
                      {feature}
                    </span>
                  ))
                ) : (
                  <span className="muted-text">No features recorded yet.</span>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <span className="lead-id">ID: {selectedLead.id}</span>
              <button
                className="modal-close-button"
                onClick={() => setSelectedLead(null)}
              >
                Close details
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;