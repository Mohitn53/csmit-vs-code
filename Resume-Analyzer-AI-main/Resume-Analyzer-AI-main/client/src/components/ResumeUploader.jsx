import { useState, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ru-root {
    font-family: 'DM Mono', monospace;
    background: #0a0a0f;
    min-height: 100vh;
    color: #e8e6f0;
    padding: 40px 32px;
  }

  .ru-header {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 40px;
  }

  .ru-title {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
    line-height: 1;
  }
  .ru-title span { color: #7c6af7; }

  .ru-tag {
    font-size: 11px;
    font-weight: 500;
    color: #7c6af7;
    background: rgba(124, 106, 247, 0.12);
    border: 1px solid rgba(124, 106, 247, 0.3);
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* Drop Zone */
  .ru-dropzone {
    border: 1.5px dashed rgba(124, 106, 247, 0.35);
    border-radius: 16px;
    padding: 48px 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s ease;
    background: rgba(124, 106, 247, 0.03);
    position: relative;
    margin-bottom: 20px;
  }
  .ru-dropzone:hover, .ru-dropzone.drag-over {
    border-color: #7c6af7;
    background: rgba(124, 106, 247, 0.08);
    transform: translateY(-2px);
  }
  .ru-dropzone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .ru-drop-icon {
    width: 52px; height: 52px; margin: 0 auto 16px;
    background: rgba(124, 106, 247, 0.15); border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 22px;
  }
  .ru-drop-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .ru-drop-sub { font-size: 12px; color: #6b6880; letter-spacing: 0.03em; }
  .ru-file-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(124, 106, 247, 0.12); border: 1px solid rgba(124, 106, 247, 0.25);
    border-radius: 8px; padding: 8px 14px; font-size: 12px; color: #b3afd4; margin-top: 14px;
  }
  .ru-file-dot { width: 6px; height: 6px; border-radius: 50%; background: #7c6af7; flex-shrink: 0; }

  /* Buttons */
  .ru-btn {
    width: 100%; padding: 15px 24px; background: #7c6af7; color: #fff; border: none;
    border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 0.02em; cursor: pointer; transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 12px;
  }
  .ru-btn:hover:not(:disabled) { background: #9080ff; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,106,247,0.35); }
  .ru-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .ru-btn-analyze {
    width: 100%; padding: 15px 24px;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    border: 1px solid rgba(124,106,247,0.4);
    color: #a590ff; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 0.02em; cursor: pointer; transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 12px;
  }
  .ru-btn-analyze:hover:not(:disabled) {
    background: linear-gradient(135deg, #221e3a, #1c2748);
    border-color: #7c6af7; color: #fff;
    box-shadow: 0 8px 24px rgba(124,106,247,0.2);
    transform: translateY(-1px);
  }
  .ru-btn-analyze:disabled { opacity: 0.4; cursor: not-allowed; }

  /* AI Report Button */
  .ru-btn-ai {
    width: 100%; padding: 15px 24px;
    background: linear-gradient(135deg, #1a2e1a, #162116);
    border: 1px solid rgba(74, 222, 128, 0.35);
    color: #4ade80; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 0.02em; cursor: pointer; transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 28px;
  }
  .ru-btn-ai:hover:not(:disabled) {
    background: linear-gradient(135deg, #1e3a1e, #1c2e1c);
    border-color: #4ade80; color: #fff;
    box-shadow: 0 8px 24px rgba(74,222,128,0.18);
    transform: translateY(-1px);
  }
  .ru-btn-ai:disabled { opacity: 0.4; cursor: not-allowed; }

  .ru-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Error */
  .ru-error {
    background: rgba(255, 80, 80, 0.08); border: 1px solid rgba(255, 80, 80, 0.2);
    border-radius: 10px; padding: 12px 16px; font-size: 12.5px; color: #ff7070;
    margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
  }

  /* Grid */
  .ru-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
  @media (max-width: 768px) { .ru-grid { grid-template-columns: 1fr; } }

  /* Panel */
  .ru-panel { background: #111118; border: 1px solid #1e1e2e; border-radius: 16px; overflow: hidden; }
  .ru-panel-header {
    padding: 16px 20px; border-bottom: 1px solid #1e1e2e;
    display: flex; align-items: center; gap: 10px;
  }
  .ru-panel-dot { width: 8px; height: 8px; border-radius: 50%; background: #7c6af7; }
  .ru-panel-dot.green { background: #4ade80; }
  .ru-panel-dot.amber { background: #fbbf24; }
  .ru-panel-dot.red   { background: #f87171; }
  .ru-panel-title {
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    color: #fff; text-transform: uppercase; letter-spacing: 0.08em;
  }
  .ru-panel-body { padding: 20px; max-height: 520px; overflow-y: auto; }
  .ru-panel-body::-webkit-scrollbar { width: 4px; }
  .ru-panel-body::-webkit-scrollbar-track { background: transparent; }
  .ru-panel-body::-webkit-scrollbar-thumb { background: #2a2a40; border-radius: 4px; }

  /* Parsed text */
  .ru-pre { font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.8; color: #9d9ab8; white-space: pre-wrap; word-break: break-word; }

  /* Original skill item (resume parser) */
  .ru-skill { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #1a1a28; }
  .ru-skill:last-child { border-bottom: none; }
  .ru-skill-name { font-size: 12.5px; color: #c8c4e8; font-weight: 500; }
  .ru-skill-bar-wrap { display: flex; align-items: center; gap: 8px; }
  .ru-skill-bar { width: 70px; height: 3px; background: #1e1e30; border-radius: 4px; overflow: hidden; }
  .ru-skill-fill { height: 100%; background: linear-gradient(90deg, #7c6af7, #a590ff); border-radius: 4px; transition: width 0.6s ease; }
  .ru-skill-score { font-size: 11px; color: #7c6af7; font-weight: 500; min-width: 32px; text-align: right; }

  /* Section */
  .ru-section-block { margin-bottom: 16px; }
  .ru-section-label { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; color: #7c6af7; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .ru-section-item { font-size: 12px; color: #9d9ab8; line-height: 1.6; padding: 5px 0 5px 12px; border-left: 2px solid #2a2840; margin-bottom: 4px; }

  /* Empty state */
  .ru-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 20px; gap: 12px; color: #3a3850; font-size: 12px; text-align: center; }
  .ru-empty-icon { font-size: 32px; opacity: 0.4; }

  /* ══ Skill Analyzer Section ════════════════════════════════════ */

  .sa-section {
    margin-top: 36px;
    padding-top: 36px;
    border-top: 1px solid #1a1a28;
  }

  .sa-section-header { margin-bottom: 20px; }
  .sa-section-title {
    font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
    color: #fff; letter-spacing: -0.5px; margin-bottom: 4px;
  }
  .sa-section-title span { color: #7c6af7; }
  .sa-section-sub { font-size: 11.5px; color: #555370; }

  /* Score Banner */
  .sa-banner {
    background: linear-gradient(135deg, rgba(124,106,247,0.1), rgba(124,106,247,0.03));
    border: 1px solid rgba(124,106,247,0.18);
    border-radius: 16px; padding: 24px 28px;
    display: flex; align-items: center; gap: 28px;
    margin-bottom: 20px; flex-wrap: wrap;
  }
  .sa-score-ring { position: relative; width: 82px; height: 82px; flex-shrink: 0; }
  .sa-score-svg { transform: rotate(-90deg); }
  .sa-score-track { fill: none; stroke: #1e1e30; stroke-width: 8; }
  .sa-score-fill { fill: none; stroke: #7c6af7; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
  .sa-score-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .sa-score-num { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
  .sa-score-lbl { font-size: 9px; color: #7c6af7; letter-spacing: 0.05em; }
  .sa-banner-meta { flex: 1; }
  .sa-profile-type { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .sa-banner-stats { display: flex; gap: 18px; flex-wrap: wrap; }
  .sa-stat { font-size: 11.5px; color: #555370; }
  .sa-stat span { color: #b3afd4; font-weight: 500; }

  /* SA Grid */
  .sa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .sa-grid-full { grid-column: 1 / -1; }
  @media (max-width: 768px) { .sa-grid { grid-template-columns: 1fr; } }

  .sa-panel { background: #111118; border: 1px solid #1e1e2e; border-radius: 14px; overflow: hidden; }
  .sa-panel-head { padding: 13px 17px; border-bottom: 1px solid #1a1a28; display: flex; align-items: center; gap: 8px; }
  .sa-panel-title { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.08em; }
  .sa-panel-body { padding: 16px; max-height: 340px; overflow-y: auto; }
  .sa-panel-body::-webkit-scrollbar { width: 3px; }
  .sa-panel-body::-webkit-scrollbar-thumb { background: #2a2a40; border-radius: 3px; }

  /* Demand row */
  .sa-demand-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #16161f; }
  .sa-demand-row:last-child { border: none; }
  .sa-demand-left { display: flex; flex-direction: column; gap: 2px; }
  .sa-demand-skill { font-size: 12px; color: #c8c4e8; font-weight: 500; }
  .sa-demand-why { font-size: 10px; color: #484660; line-height: 1.4; max-width: 200px; }
  .sa-demand-right { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
  .sa-demand-bar-wrap { width: 64px; height: 3px; background: #1e1e30; border-radius: 4px; overflow: hidden; }
  .sa-demand-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #7c6af7, #a590ff); }
  .sa-demand-score { font-size: 10px; color: #7c6af7; min-width: 24px; text-align: right; }

  /* Chips */
  .sa-chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .sa-chip { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .sa-chip-moderate { background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.22); color: #fbbf24; }
  .sa-chip-weak     { background: rgba(148,163,184,0.06); border: 1px solid rgba(148,163,184,0.14); color: #64748b; }

  /* Category coverage */
  .sa-cat-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #16161f; }
  .sa-cat-row:last-child { border: none; }
  .sa-cat-label { font-size: 11px; color: #9d9ab8; min-width: 140px; }
  .sa-cat-bar-wrap { flex: 1; height: 4px; background: #1e1e30; border-radius: 4px; overflow: hidden; }
  .sa-cat-bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #7c6af7, #a590ff); transition: width 0.8s ease; }
  .sa-cat-pct { font-size: 10px; color: #7c6af7; min-width: 32px; text-align: right; }

  /* Gaps */
  .sa-gap-block { margin-bottom: 14px; }
  .sa-gap-block:last-child { margin-bottom: 0; }
  .sa-gap-cat-label { font-size: 10px; color: #7c6af7; text-transform: uppercase; letter-spacing: 0.09em; margin-bottom: 6px; }

  /* Recommendations */
  .sa-rec { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid #16161f; align-items: flex-start; }
  .sa-rec:last-child { border: none; }
  .sa-rec-num {
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(124,106,247,0.12); border: 1px solid rgba(124,106,247,0.28);
    color: #7c6af7; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
  }
  .sa-rec-content { flex: 1; }
  .sa-rec-skill { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 2px; }
  .sa-rec-cat { font-size: 10px; color: #7c6af7; margin-bottom: 3px; }
  .sa-rec-why { font-size: 11px; color: #555370; line-height: 1.5; }
  .sa-rec-badge {
    font-size: 10px; font-weight: 600; color: #fbbf24;
    background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.18);
    padding: 2px 7px; border-radius: 10px; flex-shrink: 0;
  }

  /* ══ AI Report Section ════════════════════════════════════════ */

  .ai-report-section {
    margin-top: 28px;
    padding-top: 28px;
    border-top: 1px solid #1a1a28;
  }

  .ai-report-header {
    display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;
  }
  .ai-report-title {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
    color: #fff; letter-spacing: -0.5px;
  }
  .ai-report-title span { color: #4ade80; }
  .ai-report-badge {
    font-size: 10px; font-weight: 600; color: #4ade80;
    background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.22);
    padding: 3px 9px; border-radius: 20px; letter-spacing: 0.07em; text-transform: uppercase;
  }

  .ai-report-panel {
    background: #0d1a0d;
    border: 1px solid rgba(74, 222, 128, 0.15);
    border-radius: 16px; overflow: hidden;
  }
  .ai-report-panel-head {
    padding: 14px 20px; border-bottom: 1px solid rgba(74,222,128,0.1);
    display: flex; align-items: center; gap: 10px;
    background: rgba(74,222,128,0.04);
  }
  .ai-report-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: pulse-green 2s infinite; }
  @keyframes pulse-green {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
    50% { opacity: 0.8; box-shadow: 0 0 0 5px rgba(74,222,128,0); }
  }
  .ai-report-panel-title {
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    color: #4ade80; text-transform: uppercase; letter-spacing: 0.09em;
  }
  .ai-report-panel-sub { font-size: 10.5px; color: #2a5c2a; margin-left: auto; }

  .ai-report-body {
    padding: 24px 28px;
    max-height: 600px;
    overflow-y: auto;
  }
  .ai-report-body::-webkit-scrollbar { width: 3px; }
  .ai-report-body::-webkit-scrollbar-thumb { background: #1a3a1a; border-radius: 3px; }

  /* Markdown-like rendering for AI report */
  .ai-report-text { font-family: 'DM Mono', monospace; font-size: 12.5px; line-height: 1.9; color: #9db89d; }
  .ai-report-text .ai-h1 {
    font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800;
    color: #fff; margin: 24px 0 10px; letter-spacing: -0.3px;
    padding-bottom: 8px; border-bottom: 1px solid #1a2e1a;
  }
  .ai-report-text .ai-h1:first-child { margin-top: 0; }
  .ai-report-text .ai-h2 {
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    color: #4ade80; margin: 18px 0 8px; text-transform: uppercase; letter-spacing: 0.06em;
  }
  .ai-report-text .ai-bold { color: #c8e8c8; font-weight: 500; }
  .ai-report-text .ai-p { margin-bottom: 10px; }
  .ai-report-text .ai-li {
    padding: 4px 0 4px 16px; border-left: 2px solid #1a4a1a;
    margin-bottom: 6px; color: #7da87d;
  }

  /* Loading skeleton for AI report */
  .ai-report-skeleton { display: flex; flex-direction: column; gap: 10px; padding: 24px 28px; }
  .ai-skel-line {
    height: 10px; border-radius: 4px;
    background: linear-gradient(90deg, #111a11, #162416, #111a11);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { to { background-position: -200% 0; } }

  /* Gemini model badge */
  .ai-model-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; color: #2a5c2a; margin-left: auto;
  }
  .ai-model-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; }
`;

const CIRCUMFERENCE = 2 * Math.PI * 32;

function EmptyState({ icon, text }) {
  return (
    <div className="ru-empty">
      <div className="ru-empty-icon">{icon}</div>
      <span>{text}</span>
    </div>
  );
}

// ── AI Report Renderer ────────────────────────────────────────────────────────

function renderAIReport(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold headers like **Section Name**
    if (/^\*\*\d+\./.test(line) || /^#+\s/.test(line)) {
      const cleaned = line.replace(/^#+\s/, '').replace(/\*\*/g, '');
      return <div key={i} className="ai-h1">{cleaned}</div>;
    }
    // Sub-headers
    if (/^###/.test(line)) {
      return <div key={i} className="ai-h2">{line.replace(/^###\s*/, '')}</div>;
    }
    // Bullet points
    if (/^[-•*]\s/.test(line)) {
      const content = line.replace(/^[-•*]\s/, '').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      return <div key={i} className="ai-li" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      return <div key={i} className="ai-li" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    // Empty line
    if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
    // Regular paragraph with inline bold
    const content = line.replace(/\*\*(.*?)\*\*/g, '<span class="ai-bold">$1</span>');
    return <div key={i} className="ai-p" dangerouslySetInnerHTML={{ __html: content }} />;
  });
}

function AIReportSkeleton() {
  const widths = ['80%', '95%', '70%', '88%', '60%', '92%', '75%', '85%', '65%', '90%'];
  return (
    <div className="ai-report-skeleton">
      {widths.map((w, i) => (
        <div key={i} className="ai-skel-line" style={{ width: w, animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

// ── Skill Analyzer (embedded) ─────────────────────────────────────────────────

function SkillAnalyzer({ skills }) {
  const [result, setResult] = useState(null);
  const [aiReport, setAiReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");

  const runAnalysis = async () => {
    if (!skills?.length) return;
    setLoading(true); setError(""); setResult(null); setAiReport("");
    try {
      const res = await fetch("http://localhost:5001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Analysis failed");
      setResult(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const runAIReport = async () => {
    if (!skills?.length) return;
    setAiLoading(true); setAiError(""); setAiReport("");
    try {
      const res = await fetch("http://localhost:5001/api/analyze/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "AI report failed");
      setAiReport(json.ai_report || "");
    } catch (e) {
      setAiError(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const score = result?.summary?.overall_score ?? 0;
  const strokeOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div className="sa-section">
      <div className="sa-section-header">
        <h2 className="sa-section-title">Skill<span>.</span>Analyzer</h2>
        <p className="sa-section-sub">
          Compare your resume skills against real market demand · {skills.length} skills detected
        </p>
      </div>

      <button
        className="ru-btn-analyze"
        onClick={runAnalysis}
        disabled={loading || !skills.length}
      >
        {loading
          ? <><div className="ru-spinner" />Analyzing Market Fit...</>
          : <>⚡ Analyze My Skills Against Market Demand</>
        }
      </button>

      {error && <div className="ru-error"><span>⚠</span> {error}</div>}

      {result && (() => {
        const { summary, strengths, category_breakdown, gaps, top_recommendations, unrecognized_skills } = result;
        const strongSkills = strengths.strong_skills;
        const modSkills = strengths.moderate_skills;

        return (
          <>
            {/* Score Banner */}
            <div className="sa-banner">
              <div className="sa-score-ring">
                <svg className="sa-score-svg" width="82" height="82" viewBox="0 0 82 82">
                  <circle className="sa-score-track" cx="41" cy="41" r="32" />
                  <circle
                    className="sa-score-fill"
                    cx="41" cy="41" r="32"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeOffset}
                  />
                </svg>
                <div className="sa-score-text">
                  <span className="sa-score-num">{score}</span>
                  <span className="sa-score-lbl">/100</span>
                </div>
              </div>
              <div className="sa-banner-meta">
                <div className="sa-profile-type">{summary.profile_type}</div>
                <div className="sa-banner-stats">
                  <div className="sa-stat">Recognized: <span>{summary.skills_recognized}/{summary.total_skills_provided}</span></div>
                  <div className="sa-stat">Strong: <span>{strongSkills.length}</span></div>
                  <div className="sa-stat">Categories: <span>{Object.keys(category_breakdown).length}</span></div>
                </div>
              </div>
            </div>

            <div className="sa-grid">

              {/* Strong Skills */}
              <div className="sa-panel">
                <div className="sa-panel-head">
                  <div className="ru-panel-dot green" />
                  <span className="sa-panel-title">Strong Skills</span>
                </div>
                <div className="sa-panel-body">
                  {strongSkills.length === 0
                    ? <EmptyState icon="💪" text="No high-demand skills detected" />
                    : strongSkills.map(s => (
                      <div className="sa-demand-row" key={s.skill}>
                        <div className="sa-demand-left">
                          <span className="sa-demand-skill">{s.skill}</span>
                          <span className="sa-demand-why">{s.why}</span>
                        </div>
                        <div className="sa-demand-right">
                          <div className="sa-demand-bar-wrap">
                            <div className="sa-demand-fill" style={{ width: `${(s.demand_score / 10) * 100}%` }} />
                          </div>
                          <span className="sa-demand-score">{s.demand_score}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Category Coverage */}
              <div className="sa-panel">
                <div className="sa-panel-head">
                  <div className="ru-panel-dot" />
                  <span className="sa-panel-title">Category Coverage</span>
                </div>
                <div className="sa-panel-body">
                  {Object.entries(category_breakdown).map(([cat, data]) => (
                    <div className="sa-cat-row" key={cat}>
                      <span className="sa-cat-label">{data.label}</span>
                      <div className="sa-cat-bar-wrap">
                        <div className="sa-cat-bar-fill" style={{ width: `${data.category_coverage_percent}%` }} />
                      </div>
                      <span className="sa-cat-pct">{data.category_coverage_percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moderate Skills */}
              {modSkills.length > 0 && (
                <div className="sa-panel">
                  <div className="sa-panel-head">
                    <div className="ru-panel-dot amber" />
                    <span className="sa-panel-title">Moderate Skills</span>
                  </div>
                  <div className="sa-panel-body">
                    <div className="sa-chips">
                      {modSkills.map(s => (
                        <span className="sa-chip sa-chip-moderate" key={s.skill}>
                          {s.skill} · {s.demand_score}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Skill Gaps */}
              <div className="sa-panel">
                <div className="sa-panel-head">
                  <div className="ru-panel-dot red" />
                  <span className="sa-panel-title">Skill Gaps</span>
                </div>
                <div className="sa-panel-body">
                  {Object.keys(gaps).length === 0
                    ? <EmptyState icon="✅" text="No major gaps detected!" />
                    : Object.entries(gaps).map(([cat, data]) => (
                      <div className="sa-gap-block" key={cat}>
                        <div className="sa-gap-cat-label">{data.label}</div>
                        <div className="sa-chips">
                          {data.top_missing_skills.map(s => (
                            <span className="sa-chip sa-chip-weak" key={s.skill} title={s.why}>
                              {s.skill} · {s.demand_score}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Top Recommendations */}
              <div className="sa-panel sa-grid-full">
                <div className="sa-panel-head">
                  <div className="ru-panel-dot" style={{ background: "#f59e0b" }} />
                  <span className="sa-panel-title">Top 5 Skills to Learn Next</span>
                </div>
                <div className="sa-panel-body">
                  {top_recommendations.map((rec, i) => (
                    <div className="sa-rec" key={rec.skill}>
                      <div className="sa-rec-num">{i + 1}</div>
                      <div className="sa-rec-content">
                        <div className="sa-rec-skill">{rec.skill}</div>
                        <div className="sa-rec-cat">{rec.category_label}</div>
                        <div className="sa-rec-why">{rec.why}</div>
                      </div>
                      <div className="sa-rec-badge">{rec.demand_score}/10</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unrecognized */}
              {unrecognized_skills?.length > 0 && (
                <div className="sa-panel sa-grid-full">
                  <div className="sa-panel-head">
                    <div className="ru-panel-dot" style={{ background: "#475569" }} />
                    <span className="sa-panel-title">Unrecognized / Niche Skills</span>
                  </div>
                  <div className="sa-panel-body">
                    <div className="sa-chips">
                      {unrecognized_skills.map(s => (
                        <span className="sa-chip sa-chip-weak" key={s}>{s}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: "#3a3850", marginTop: 10 }}>
                      Not found in our benchmark — may be niche, emerging, or misspelled.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* ── AI Career Report ─────────────────────────────── */}
            <div className="ai-report-section">
              <div className="ai-report-header">
                <h3 className="ai-report-title">AI Career<span>.</span>Report</h3>
                <span className="ai-report-badge">Gemini 3 Flash</span>
              </div>

              <button
                className="ru-btn-ai"
                onClick={runAIReport}
                disabled={aiLoading || !skills.length}
              >
                {aiLoading
                  ? <><div className="ru-spinner" style={{ borderTopColor: '#4ade80' }} />Generating Career Report...</>
                  : <>🤖 Generate AI Career Report with Gemini</>
                }
              </button>

              {aiError && <div className="ru-error"><span>⚠</span> {aiError}</div>}

              {/* Report Panel — shows skeleton while loading, report when done */}
              {(aiLoading || aiReport) && (
                <div className="ai-report-panel">
                  <div className="ai-report-panel-head">
                    <div className="ai-report-dot" />
                    <span className="ai-report-panel-title">
                      {aiLoading ? "Generating your personalized report..." : "Your Personalized Career Report"}
                    </span>
                    <div className="ai-model-badge">
                      <div className="ai-model-dot" />
                      gemini-3-flash-preview
                    </div>
                  </div>
                  {aiLoading
                    ? <AIReportSkeleton />
                    : (
                      <div className="ai-report-body">
                        <div className="ai-report-text">
                          {renderAIReport(aiReport)}
                        </div>
                      </div>
                    )
                  }
                </div>
              )}
            </div>
          </>
        );
      })()}
    </div>
  );
}

// ── Main ResumeUploader ───────────────────────────────────────────────────────

function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [parsedText, setParsedText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setParsedText(""); setAnalysis(null); setError(""); }
  };

  const handleUpload = async () => {
    if (!file) { setError("Please select a PDF file first."); return; }
    const formData = new FormData();
    formData.append("resume", file);
    try {
      setLoading(true); setError("");
      const response = await fetch("http://localhost:5000/api/resume/upload", { method: "POST", body: formData });
      if (!response.ok) { const text = await response.text().catch(() => null); throw new Error(text || "Failed to parse resume"); }
      const data = await response.json();
      console.log(data);
      setParsedText(data.data?.raw_text || "");
      setAnalysis(data.data?.aiAnalysis || null);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const extractedSkills = analysis?.skills ? Object.keys(analysis.skills) : [];

  const renderSkills = () => {
    if (!analysis?.skills) return <EmptyState icon="⚡" text="Skills will appear here" />;
    const entries = Object.entries(analysis.skills).sort((a, b) => b[1] - a[1]);
    if (!entries.length) return <EmptyState icon="⚡" text="No skills detected" />;
    const max = entries[0][1];
    return entries.map(([skill, score]) => (
      <div className="ru-skill" key={skill}>
        <span className="ru-skill-name">{skill}</span>
        <div className="ru-skill-bar-wrap">
          <div className="ru-skill-bar">
            <div className="ru-skill-fill" style={{ width: `${(score / max) * 100}%` }} />
          </div>
          <span className="ru-skill-score">{score.toFixed(2)}</span>
        </div>
      </div>
    ));
  };

  const renderSections = () => {
    if (!analysis?.sections) return <EmptyState icon="📄" text="Sections will appear here" />;
    const keys = Object.keys(analysis.sections);
    if (!keys.length) return <EmptyState icon="📄" text="No sections detected" />;
    return keys.map((k) => (
      <div className="ru-section-block" key={k}>
        <div className="ru-section-label">{k}</div>
        {analysis.sections[k].map((s, i) => (
          <div className="ru-section-item" key={i}>{s}</div>
        ))}
      </div>
    ));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ru-root">
        <div className="ru-header">
          <h1 className="ru-title">Resume<span>.</span>Parser</h1>
          <span className="ru-tag">AI Powered</span>
        </div>

        <div
          className={`ru-dropzone${dragOver ? " drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) { setFile(f); setParsedText(""); setAnalysis(null); setError(""); }
          }}
        >
          <input type="file" accept=".pdf" onChange={handleFileChange} ref={fileInputRef} />
          <div className="ru-drop-icon">📎</div>
          <div className="ru-drop-title">{file ? "File Selected" : "Drop your resume here"}</div>
          <div className="ru-drop-sub">{file ? "Click to change file" : "or click to browse · PDF only"}</div>
          {file && (
            <div className="ru-file-pill">
              <div className="ru-file-dot" />
              {file.name}
            </div>
          )}
        </div>

        <button className="ru-btn" onClick={handleUpload} disabled={loading}>
          {loading ? <><div className="ru-spinner" />Parsing Resume...</> : <>↑ Upload &amp; Parse</>}
        </button>

        {error && <div className="ru-error"><span>⚠</span> {error}</div>}

        <div className="ru-grid">
          <div className="ru-panel">
            <div className="ru-panel-header">
              <div className="ru-panel-dot" />
              <span className="ru-panel-title">Parsed Text</span>
            </div>
            <div className="ru-panel-body">
              {parsedText
                ? <pre className="ru-pre">{parsedText}</pre>
                : <EmptyState icon="🔍" text="Upload a resume to see extracted text" />
              }
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="ru-panel">
              <div className="ru-panel-header">
                <div className="ru-panel-dot" />
                <span className="ru-panel-title">Skills</span>
              </div>
              <div className="ru-panel-body">{renderSkills()}</div>
            </div>

            <div className="ru-panel">
              <div className="ru-panel-header">
                <div className="ru-panel-dot" />
                <span className="ru-panel-title">Sections</span>
              </div>
              <div className="ru-panel-body">{renderSections()}</div>
            </div>
          </div>
        </div>

        {analysis && <SkillAnalyzer skills={extractedSkills} />}
      </div>
    </>
  );
}

export default ResumeUploader;