<style>
    /* =====================================================================
       AskPias admin theme — modern, calm, aligned with the marketing site.
       ===================================================================== */

    :root {
        --ap-line: #ecedf2;
        --ap-ink: #191920;
        --ap-muted: #6f6f7c;
        --ap-soft: #f7f7fa;
        --ap-radius: 0.5rem;
    }

    .fi-body {
        background-color: var(--ap-soft);
        -webkit-font-smoothing: antialiased;
    }

    /* ---------------------------------------------------------------- Topbar */
    .fi-topbar {
        background-color: #ffffff;
        border-bottom: 1px solid var(--ap-line);
    }

    .fi-topbar nav {
        min-height: 3.9rem;
        padding-inline: 1.25rem;
    }

    .fi-topbar .fi-input-wrp {
        border-radius: 999px;
        background-color: var(--ap-soft);
        border-color: transparent;
        box-shadow: none;
    }

    .fi-topbar .fi-input {
        background-color: transparent;
    }

    /* --------------------------------------------------------------- Sidebar */
    .fi-main-sidebar,
    .fi-sidebar {
        background-color: #ffffff;
    }

    .fi-main-sidebar {
        border-right: 1px solid var(--ap-line);
    }

    .fi-sidebar-nav {
        padding: 0.55rem 0.5rem 0.9rem;
        gap: 0.25rem !important;
    }

    /* Filament insets group lists by -8px; reset so the active pill sits inside. */
    .fi-sidebar-nav-groups {
        margin-inline: 0 !important;
        gap: 0.15rem !important;
    }

    .fi-sidebar-item {
        margin-block: 1px;
    }

    .fi-sidebar-item-btn {
        min-height: 2.25rem;
        border-radius: var(--ap-radius);
        padding: 0.4rem 0.55rem;
        gap: 0.55rem;
        transition:
            background-color 0.16s ease,
            color 0.16s ease;
    }

    .fi-sidebar-item-btn:hover {
        background-color: #f4f5f8;
        box-shadow: none;
    }

    .fi-sidebar-item-btn svg {
        width: 1.15rem;
        height: 1.15rem;
        color: #8b8b97;
        transition: color 0.16s ease;
    }

    .fi-sidebar-item-btn:hover svg {
        color: var(--ap-ink);
    }

    .fi-sidebar-item-label {
        font-size: 0.86rem;
        font-weight: 500;
        letter-spacing: -0.005em;
        color: #40404b;
    }

    /* Active item — quiet filled state, like the reference sidebar */
    .fi-sidebar-item.fi-active > .fi-sidebar-item-btn {
        background-color: #eef1f6;
        box-shadow: none;
    }

    .fi-sidebar-item.fi-active > .fi-sidebar-item-btn .fi-sidebar-item-label {
        color: #0f1115 !important;
        font-weight: 600;
    }

    .fi-sidebar-item.fi-active > .fi-sidebar-item-btn svg {
        color: #0141c5 !important;
    }

    .fi-sidebar-item.fi-active > .fi-sidebar-item-btn .fi-badge {
        background-color: #dde6f7 !important;
        color: #1f3a7a !important;
        border-color: transparent !important;
    }

    .fi-sidebar-group-label {
        padding: 0.6rem 0.55rem 0.2rem;
        font-size: 0.72rem;
        font-weight: 500;
        letter-spacing: 0;
        text-transform: none;
        color: #9aa0a6;
    }

    /* ---------------------------------------------------------- Page header */
    .fi-page-header-main-ctn {
        padding-block: 0.4rem;
    }

    .fi-header-heading {
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: var(--ap-ink);
    }

    .fi-breadcrumbs-item-label {
        font-size: 0.78rem;
        color: #8b8b97;
    }

    /* -------------------------------------------------------------- Sections */
    .fi-section {
        border-radius: 0.6rem;
        border: 1px solid var(--ap-line);
        background-color: #ffffff;
        box-shadow: 0 1px 2px rgba(16, 16, 18, 0.035);
    }

    .fi-section-header {
        padding: 1rem 1.25rem 0.65rem;
    }

    .fi-section-header-heading {
        font-size: 0.95rem;
        font-weight: 650;
        letter-spacing: -0.01em;
    }

    .fi-section-header-description {
        font-size: 0.8rem;
        color: var(--ap-muted);
    }

    .fi-section-content {
        padding: 0.35rem 1.25rem 1.25rem;
    }

    /* ---------------------------------------------------------------- Inputs */
    .fi-input-wrp {
        border-radius: 0.45rem;
    }

    .fi-input {
        padding-block: 0.5rem;
        font-size: 0.875rem;
    }

    .fi-fo-field-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #3c3c46;
    }

    /* --------------------------------------------------------------- Buttons */
    .fi-btn {
        border-radius: 0.45rem;
        font-weight: 600;
        font-size: 0.83rem;
        padding-block: 0.5rem;
    }

    .fi-btn.fi-size-lg {
        padding-block: 0.65rem;
    }

    /* ---------------------------------------------------------------- Badges */
    .fi-badge {
        border-radius: 999px;
        font-size: 0.68rem;
        font-weight: 600;
        padding: 0.2rem 0.6rem;
        letter-spacing: 0;
    }

    /* ---------------------------------------------------------------- Tables */
    .fi-ta-ctn {
        border-radius: 0.6rem;
        border: 1px solid var(--ap-line);
        background-color: #ffffff;
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(16, 16, 18, 0.035);
    }

    .fi-ta-header-cell {
        padding-block: 0.8rem;
        background-color: #fbfbfd;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #8b8b97;
    }

    .fi-ta-cell {
        padding-block: 0.85rem;
    }

    .fi-ta-row:hover {
        background-color: #fbfbfd;
    }

    /* ------------------------------------------------------------ Stat cards */
    .fi-wi-stats-overview-stat {
        border-radius: 0.6rem;
        border: 1px solid var(--ap-line);
        background-color: #ffffff;
        padding: 1.15rem 1.25rem;
        box-shadow: 0 14px 32px -28px rgba(16, 16, 18, 0.8);
    }

    .fi-wi-stats-overview-stat-label {
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0;
        text-transform: none;
        color: var(--ap-muted);
    }

    .fi-wi-stats-overview-stat-value {
        font-size: 1.85rem;
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 1.1;
    }

    .fi-wi-stats-overview-stat-description {
        font-size: 0.72rem;
        color: var(--ap-muted);
    }

    /* Account widget + generic widgets */
    .fi-wi-account {
        border-radius: 0.6rem;
        border: 1px solid var(--ap-line);
        background-color: #ffffff;
        box-shadow: 0 1px 2px rgba(16, 16, 18, 0.035);
    }

    /* -------------------------------------------------------------- Dropdowns */
    .fi-dropdown-panel {
        border-radius: 0.6rem;
        border: 1px solid var(--ap-line);
        box-shadow: 0 20px 44px -30px rgba(16, 16, 18, 0.65);
    }

    /* ------------------------------------------------------------ Auth screen */
    .fi-simple-layout {
        background-color: var(--ap-soft);
    }

    .fi-simple-main-ctn .fi-section,
    .fi-simple-main {
        border-radius: 0.5rem;
    }

    /* ------------------------------------------------------------- Dashboard */
    .ap-dash { display: flex; flex-direction: column; gap: 1.15rem; }

    .ap-dash-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .ap-h1 { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; color: #14141a; }
    .ap-sub { margin-top: 0.25rem; font-size: 0.85rem; color: #74747f; }
    .ap-dash-actions { display: flex; align-items: center; gap: 0.6rem; }

    .ap-pill { display: inline-flex; align-items: center; height: 2.5rem; padding: 0 0.9rem; border-radius: 0.5rem; border: 1px solid #e6e7ee; background: #fff; font-size: 0.8rem; font-weight: 600; color: #40404b; white-space: nowrap; }

    .ap-primary { display: inline-flex; align-items: center; gap: 0.45rem; height: 2.5rem; padding: 0 1rem; border-radius: 0.5rem; background: #0141c5; color: #fff; font-size: 0.82rem; font-weight: 600; text-decoration: none; box-shadow: 0 10px 20px -14px rgba(1, 65, 197, 0.8); transition: background-color 0.15s ease; }
    .ap-primary:hover { background: #0137a6; }
    .ap-primary-ic { width: 1rem; height: 1rem; }

    .ap-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
    .ap-stat { display: flex; flex-direction: column; gap: 0.9rem; padding: 1rem 1.1rem 0.9rem; border: 1px solid #ecedf2; border-radius: 0.6rem; background: #fff; text-decoration: none; transition: box-shadow 0.18s ease, transform 0.18s ease; }
    .ap-stat:hover { box-shadow: 0 18px 36px -30px rgba(16, 16, 24, 0.55); transform: translateY(-1px); }
    .ap-stat-top { display: flex; align-items: center; gap: 0.7rem; }
    .ap-ic { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; flex-shrink: 0; }
    .ap-ic svg { width: 1.15rem; height: 1.15rem; }
    .ap-ic-blue { background: #e8eefb; color: #0141c5; }
    .ap-ic-green { background: #e4f6ef; color: #0e9f6e; }
    .ap-ic-orange { background: #fef1de; color: #d97706; }
    .ap-stat-value { font-size: 1.55rem; font-weight: 800; letter-spacing: -0.03em; color: #14141a; }
    .ap-stat-label { font-size: 0.8rem; font-weight: 600; color: #6f6f7c; }
    .ap-stat-foot { display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px dashed #edeef3; font-size: 0.72rem; color: #8b8b97; }
    .ap-link { color: #0141c5; font-weight: 600; text-decoration: none; }
    .ap-link:hover { text-decoration: underline; }

    .ap-grid { display: grid; grid-template-columns: minmax(0, 1.85fr) minmax(0, 1fr); gap: 1rem; align-items: start; }
    .ap-col { display: flex; flex-direction: column; gap: 1rem; }
    .ap-card { padding: 1.05rem 1.15rem; border: 1px solid #ecedf2; border-radius: 0.6rem; background: #fff; }
    .ap-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.9rem; }
    .ap-card-title { font-size: 0.92rem; font-weight: 700; color: #14141a; letter-spacing: -0.01em; }
    .ap-card-sub { margin-top: 0.15rem; font-size: 0.74rem; color: #8b8b97; }
    .ap-chip { display: inline-flex; align-items: center; height: 1.8rem; padding: 0 0.6rem; border-radius: 0.45rem; border: 1px solid #e9eaf0; background: #fafafc; font-size: 0.7rem; font-weight: 600; color: #5d5d69; white-space: nowrap; }

    .ap-chart { border-radius: 0.5rem; background: linear-gradient(180deg, #fafbff, #fff); border: 1px solid #f1f2f7; padding: 0.6rem 0.6rem 0.2rem; }
    .ap-chart-svg { width: 100%; height: 170px; display: block; }
    .ap-chart-x { display: flex; justify-content: space-between; padding: 0.35rem 0.2rem 0.2rem; font-size: 0.68rem; color: #9a9aa6; }

    .ap-people { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.25rem 0.9rem; }
    .ap-person { display: flex; align-items: center; gap: 0.65rem; padding: 0.55rem 0.4rem; border-radius: 0.6rem; text-decoration: none; }
    .ap-person:hover { background: #f8f9fc; }
    .ap-avatar { display: inline-flex; align-items: center; justify-content: center; width: 2.1rem; height: 2.1rem; border-radius: 999px; background: #eef1fa; color: #3b4a7a; font-size: 0.66rem; font-weight: 700; flex-shrink: 0; }
    .ap-person-main { min-width: 0; display: flex; flex-direction: column; }
    .ap-person-name { font-size: 0.8rem; font-weight: 600; color: #20202a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-person-mail { font-size: 0.7rem; color: #8b8b97; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-dots { margin-left: auto; color: #b3b3bf; font-size: 1rem; }

    .ap-today { display: flex; flex-direction: column; gap: 0.6rem; }
    .ap-event { display: flex; gap: 0.7rem; padding: 0.7rem 0.75rem; border-radius: 0.5rem; background: #fafafd; border: 1px solid #f0f1f6; text-decoration: none; transition: background-color 0.15s ease; }
    .ap-event:hover { background: #f5f6fb; }
    .ap-event-bar { width: 4px; border-radius: 999px; background: #0141c5; flex-shrink: 0; }
    .ap-event-1 { background: #0e9f6e; }
    .ap-event-2 { background: #f59e0b; }
    .ap-event-main { display: flex; flex-direction: column; min-width: 0; }
    .ap-event-title { font-size: 0.8rem; font-weight: 600; color: #20202a; }
    .ap-event-time { font-size: 0.7rem; color: #8b8b97; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-empty { font-size: 0.78rem; color: #8b8b97; }

    .ap-card-gradient { background: linear-gradient(135deg, #fff0ec, #ffe1d6); border-color: #fbd9cc; }
    .ap-grad-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9a4a2f; }
    .ap-grad-value { margin-top: 0.3rem; font-size: 2rem; font-weight: 800; color: #3d1b10; letter-spacing: -0.03em; }
    .ap-grad-sub { font-size: 0.74rem; color: #8a5a48; }

    .ap-links { display: flex; flex-direction: column; gap: 0.15rem; }
    .ap-links a { display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.5rem; border-radius: 0.45rem; font-size: 0.8rem; color: #3c3c46; text-decoration: none; }
    .ap-links a:hover { background: #f8f9fc; }
    .ap-count { font-size: 0.7rem; font-weight: 700; color: #0141c5; background: #e8eefb; border-radius: 999px; padding: 0.1rem 0.5rem; }

    /* Sidebar extras — quick actions + tip + site link */
    .ap-side-extra { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.5rem 0.55rem 0.75rem; }

    /* The drawer is tight on phones — show only the two most-used shortcuts. */
    @media (max-width: 1023px) {
        .ap-side-extra .ap-side-action:nth-of-type(n+3) { display: none; }
    }

    .ap-side-label {
        margin: 0.75rem 0.35rem 0.3rem;
        font-size: 0.7rem;
        font-weight: 500;
        color: #9aa0a6;
    }

    .ap-side-action {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.4rem 0.55rem;
        border-radius: var(--ap-radius);
        font-size: 0.8rem;
        font-weight: 500;
        color: #40404b;
        text-decoration: none;
        transition: background-color 0.15s ease, color 0.15s ease;
    }

    .ap-side-action:hover { background: #f4f5f8; color: #14141a; }
    .ap-side-ic { display: inline-flex; color: #8b8b97; }
    .ap-side-ic svg { width: 1rem; height: 1rem; }
    .ap-side-action:hover .ap-side-ic { color: #0141c5; }

    /* Sidebar footer — workspace card */
    .ap-ws { display: flex; align-items: center; gap: 0.6rem; margin: 0.5rem; padding: 0.55rem 0.6rem; border: 1px solid var(--ap-line); border-radius: var(--ap-radius); background: #fff; }
    .ap-ws-avatar { display: inline-flex; align-items: center; justify-content: center; width: 1.9rem; height: 1.9rem; border-radius: 999px; background: #0141c5; color: #fff; font-size: 0.66rem; font-weight: 700; flex-shrink: 0; }
    .ap-ws-main { display: flex; flex-direction: column; min-width: 0; line-height: 1.2; }
    .ap-ws-name { font-size: 0.8rem; font-weight: 600; color: #14141a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-ws-role { font-size: 0.68rem; color: #8b8b97; }
    .ap-ws-link { display: inline-flex; align-items: center; justify-content: center; width: 1.9rem; height: 1.9rem; margin-left: auto; border-radius: 0.4rem; color: #6f6f7c; flex-shrink: 0; }
    .ap-ws-link:hover { background: #f4f5f8; color: #0141c5; }
    .ap-ws-link svg { width: 0.95rem; height: 0.95rem; }

    @media (max-width: 1100px) {
        .ap-grid { grid-template-columns: minmax(0, 1fr); }
    }

    @media (max-width: 700px) {
        .ap-stats { grid-template-columns: minmax(0, 1fr); }
        .ap-people { grid-template-columns: minmax(0, 1fr); }
        .ap-h1 { font-size: 1.3rem; }
        .ap-dash-actions { width: 100%; }
        .ap-pill { flex: 1; justify-content: center; }
    }

    /* -------------------------------------------------------- Mobile touches */
    @media (max-width: 640px) {
        .fi-header-heading {
            font-size: 1.25rem;
        }

        .fi-toast {
            border-radius: 0.8rem;
        }
    }
</style>
