import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "coe-mom-data-v2";

const DEFAULT_TEAM = [
  "Omkar Raut", "Paresh Chaudhari", "Tushar Murkar", "Ketan Thombare",
  "Saumya Vemula", "Nilesh Jadhav", "Urvesh Patel", "Vishal Mestri",
  "Shubham Khodpe", "Ishtiyaq Mahadiwala", "Rahul Vattaparambil",
  "Vijay Shrotriya", "Shweta Jadhav", "Rishabh Ramteke", "Adnan Shaikh", "Rehan Ansari"
];

const DEFAULT_PENDING = [
  { id: 1, desc: "Plan a DKAC to review their Kubernetes environment and suggest improvements.", owner: "Ketan Thombare", status: "WIP", startDate: "14-11-2025", remarks: "As discussed with Sandeep Pal, the client is not allowing us to show the K8s setup." },
  { id: 2, desc: "Apex Integration with AI", owner: "Urvesh Patel", status: "WIP", startDate: "31-10-2025", remarks: "Connect with" },
  { id: 3, desc: "Call Jyoti for Oracle fusion integration with AI", owner: "Tushar Murkar / Vishal Mestri", status: "WIP", startDate: "31-10-2025", remarks: "Connect with Harsh or Suresh once for this. On Monday, visit Andheri office. Vishal will talk to Kishor Bhupati" },
  { id: 4, desc: "Azure Certification - Microsoft Certified: Azure Developer Associate (AZ-204)", owner: "Ketan Thombare / Saumya", status: "Pending", startDate: "7th November", remarks: "Asked Sandeep Malunjakar regarding multiple certification. Will set up exam after current reimbursement. Saumya discussed with Sandeep and will start from 9th Feb." },
  { id: 5, desc: "New Learnings (React Native - Android)", owner: "Saumya Vemula", status: "WIP", startDate: "13-10-2025", remarks: "Learning in progress" },
  { id: 6, desc: "Innovation Area – Tool/platform finalization", owner: "Urvesh Patel", status: "WIP", startDate: "Before 1st July", remarks: "Looking to explore Mendix, but cost comparison is pending. Started work on Power Apps. Showcase Power Apps features and give demo also." },
  { id: 7, desc: "Use of AI Tools studied for ongoing project – Bruno's as of now", owner: "Tushar M and Saumya Vemula (Nilesh Jadhav)", status: "WIP", startDate: "15th Oct", remarks: "The development team started using Amazon Q and achieved a 40% improvement in UI development productivity. They plan to continue using it for future development." },
  { id: 8, desc: "New AI tool for documentation", owner: "Tushar Murkar", status: "WIP", startDate: "23rd Jan", remarks: "" },
];

const DEFAULT_HOLD = [
  { id: 101, desc: "Check if Play Framework can improve middleware performance. Review existing code and suggest required changes.", owner: "Omkar Raut", status: "Hold", startDate: "", remarks: "" },
  { id: 102, desc: "Prepare JMeter presentation for Jana Bank Core Banking. Explain benefits of Playwright over Java Selenium.", owner: "Paresh Chaudhari", status: "Done", startDate: "", remarks: "" },
  { id: 103, desc: "Azure Certification - Designing and Implementing Microsoft DevOps Solutions (AZ-400)", owner: "Ketan Thombare", status: "Completed", startDate: "9th July 2025", remarks: "Completed" },
  { id: 104, desc: "Innovation Area – Tool/platform (N8N workflow automation tool)", owner: "Tushar Murkar", status: "Hold", startDate: "03-10-2025", remarks: "A fully functional OpenAI-based model was developed and documented with an SOP and Quadrant Vector DB integration. After three successful testing cycles with the DBA team, the final output was validated and approved. Local Ollama-based setup and multiple alternative models explored but none matched OpenAI's accuracy. The final working setup—OpenAI latest model + Quadrant Vector DB—is stable, reliable, and ready for infrastructure testing. Two AI agent links shared for testing: one for Connect Infra, another with YesBank." },
  { id: 105, desc: "Innovation Area – Tool/platform – Plan for Java based API Listening tool for recording API Performance without making changes in code.", owner: "Omkar Raut", status: "Hold", startDate: "Pending from 11th July", remarks: "Finalized on 4th July 2025. Next action plan to be ready with dates by 11th July." },
  { id: 106, desc: "Accident Detection AI Usecase", owner: "Rishabh Ramteke", status: "Hold", startDate: "15th Oct", remarks: "Used a pre-trained YOLO model and created a custom dataset of 600-700 accident images, labeled using Roboflow. Currently able to detect accident/flipped vehicles and cattle/animals on road. Accuracy around 50-60%. Remaining requirements involve motion-based events. To achieve all requirements with higher accuracy, an AI/ML expert and high-configuration system will be needed." },
];

const DEFAULT_HIRING = [
  { id: 201, tech: "Apex", source: "", stage: "", date: "", interviewer: "", score: "", decision: "", notes: "" },
  { id: 202, tech: "AI Expert", source: "", stage: "", date: "", interviewer: "", score: "", decision: "", notes: "" },
  { id: 203, tech: "ELK Expert", source: "", stage: "", date: "", interviewer: "", score: "", decision: "", notes: "" },
];

function getNextFriday(fromDate) {
  const d = new Date(fromDate);
  const day = d.getDay();
  const diff = (5 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const day = d.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  return `${day}${suffix} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function uid() { return Date.now() + Math.random(); }

// localStorage helper
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveToStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

const TABS = ["Meeting Info", "Attendance", "Discussed", "Pending Items", "Hold / Completed", "Leaves", "Hiring", "Generate Email"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const saved = loadFromStorage();

  const [meetingDate, setMeetingDate] = useState(saved?.meetingDate || new Date().toISOString().split("T")[0]);
  const [nextMeetingDate, setNextMeetingDate] = useState(saved?.nextMeetingDate || getNextFriday(new Date()));
  const [preparedBy] = useState("Ketan Thombare");
  const [timeStarted, setTimeStarted] = useState(saved?.timeStarted || "4:30 PM");
  const [duration, setDuration] = useState(saved?.duration || "60 Mins");
  const [venue, setVenue] = useState(saved?.venue || "MS Teams");

  const [team, setTeam] = useState(saved?.team || DEFAULT_TEAM.map(n => ({ name: n, present: false })));
  const [discussed, setDiscussed] = useState(saved?.discussed || [{ id: uid(), desc: "", owner: "", status: "Done", remarks: "" }]);
  const [nextMeetingItems, setNextMeetingItems] = useState(saved?.nextMeetingItems || [{ id: uid(), desc: "Will be discussed in upcoming days", owner: "", status: "", targetDate: "", remarks: "-" }]);
  const [pending, setPending] = useState(saved?.pending || DEFAULT_PENDING);
  const [hold, setHold] = useState(saved?.hold || DEFAULT_HOLD);
  const [leaves, setLeaves] = useState(saved?.leaves || [{ id: uid(), name: "", period: "", responsible: "", remarks: "" }]);
  const [hiring, setHiring] = useState(saved?.hiring || DEFAULT_HIRING);

  // Auto-save on every change
  useEffect(() => {
    saveToStorage({ meetingDate, nextMeetingDate, timeStarted, duration, venue, team, discussed, nextMeetingItems, pending, hold, leaves, hiring });
  }, [meetingDate, nextMeetingDate, timeStarted, duration, venue, team, discussed, nextMeetingItems, pending, hold, leaves, hiring]);

  // Auto-calc next meeting date
  useEffect(() => {
    setNextMeetingDate(getNextFriday(meetingDate));
  }, [meetingDate]);

  const attendees = team.filter(t => t.present).map(t => t.name);
  const absentees = team.filter(t => !t.present).map(t => t.name);

  function movePendingToHold(idx) {
    const item = pending[idx];
    setHold(prev => [...prev, { ...item, status: "Hold" }]);
    setPending(prev => prev.filter((_, i) => i !== idx));
  }

  function movePendingToCompleted(idx) {
    const item = pending[idx];
    setHold(prev => [...prev, { ...item, status: "Completed" }]);
    setPending(prev => prev.filter((_, i) => i !== idx));
  }

  function generateEmail() {
    const md = formatDateDisplay(meetingDate);
    const nmd = formatDateDisplay(nextMeetingDate);
    let email = `Hi Team,\n\nPlease find below points & also check the attached ppt\n\n`;
    email += `Date of Meeting: ${md}\nPrepared by: ${preparedBy}\nTime Started: ${timeStarted}\nMeeting Duration: ${duration}\nVenue: ${venue}\nNext Meeting Date: ${nmd}\n\n`;
    email += `Participants:\nTeam: Clover\nAttendees: ${attendees.join(", ") || "—"}\nAbsentees: ${absentees.join(", ") || "—"}\n\n`;
    email += `Agendas of Meeting and its objectives:\n1. CoE Innovation Team's new Learning status and tracking\n\n`;
    email += `Points Discussed in Meeting:\n`;
    discussed.forEach((d, i) => { if (d.desc) email += `${i + 1}. ${d.desc} | Owner: ${d.owner || "—"} | Status: ${d.status || "—"} | Remarks: ${d.remarks || "—"}\n`; });
    email += `\nNext Meeting:\n`;
    nextMeetingItems.forEach((n, i) => { if (n.desc) email += `${i + 1}. ${n.desc} | Owner: ${n.owner || "—"} | Status: ${n.status || "—"} | Target Date: ${n.targetDate || nmd} | Remarks: ${n.remarks || "—"}\n`; });
    email += `\nPoints Pending:\n`;
    pending.forEach(p => { email += `• ${p.desc}\n  Owner: ${p.owner} | Status: ${p.status} | Start Date: ${p.startDate} | Remarks: ${p.remarks || "—"}\n\n`; });
    email += `Points Hold and Completed:\n`;
    hold.forEach(h => { email += `• ${h.desc}\n  Owner: ${h.owner} | Status: ${h.status} | Start Date: ${h.startDate || "—"} | Remarks: ${h.remarks || "—"}\n\n`; });
    email += `Leave Registration:\n`;
    leaves.forEach((l, i) => { if (l.name) email += `${i + 1}. ${l.name} | Period: ${l.period} | Responsible: ${l.responsible || "—"} | Remarks: ${l.remarks || "—"}\n`; });
    email += `\nHiring Table:\n`;
    hiring.forEach(h => { email += `• Technology: ${h.tech} | Source: ${h.source || "—"} | Stage: ${h.stage || "—"} | Date: ${h.date || "—"} | Interviewer: ${h.interviewer || "—"} | Score: ${h.score || "—"} | Decision: ${h.decision || "—"} | Notes: ${h.notes || "—"}\n`; });
    email += `\nBest Regards,\nKetan Thombare\nDevOps Engineer\nM: +91 9222922251 | T: +91 22 2926 1650 | https://www.cloverinfotech.com`;
    return email;
  }

  function generateHTML() {
    const md = formatDateDisplay(meetingDate);
    const nmd = formatDateDisplay(nextMeetingDate);
    const tStyle = `border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Calibri,sans-serif;font-size:11pt;"`;
    const hdr = `style="background:#4472C4;color:white;"`;

    let h = `<p>Hi Team,</p><p>Please find below points &amp; also check the attached ppt</p>`;
    h += `<table ${tStyle}><tr><td><b>Date of Meeting:</b></td><td>${md}</td></tr><tr><td><b>Prepared by:</b></td><td>${preparedBy}</td></tr><tr><td><b>Time Started:</b></td><td>${timeStarted}</td></tr><tr><td><b>Meeting Duration:</b></td><td>${duration}</td></tr><tr><td><b>Venue:</b></td><td>${venue}</td></tr><tr><td><b>Next Meeting Date:</b></td><td>${nmd}</td></tr></table><br/>`;
    h += `<p><b>Participants:</b></p><table ${tStyle}><tr ${hdr}><th>Team</th><th>Attendees</th><th>Absentees</th></tr><tr><td>Clover</td><td>${attendees.join(",<br/>") || "—"}</td><td>${absentees.join(",<br/>") || "—"}</td></tr></table><br/>`;
    h += `<p><b>Agendas of Meeting and its objectives:</b></p><table ${tStyle}><tr ${hdr}><th>No.</th><th>Agenda</th></tr><tr><td>1</td><td>CoE Innovation Team's new Learning status and tracking</td></tr></table><br/>`;
    h += `<p><b>Points Discussed in Meeting:</b></p><table ${tStyle}><tr ${hdr}><th>No</th><th>Description</th><th>Owner</th><th>Status</th><th>Remarks</th></tr>`;
    discussed.forEach((d, i) => { if (d.desc) h += `<tr><td>${i + 1}</td><td>${d.desc}</td><td>${d.owner || ""}</td><td>${d.status || ""}</td><td>${d.remarks || ""}</td></tr>`; });
    h += `</table><br/>`;
    h += `<p><b>Next Meeting:</b></p><table ${tStyle}><tr ${hdr}><th>No</th><th>Description</th><th>Owner</th><th>Status</th><th>Target Date</th><th>Remarks</th></tr>`;
    nextMeetingItems.forEach((n, i) => { if (n.desc) h += `<tr><td>${i + 1}</td><td>${n.desc}</td><td>${n.owner || ""}</td><td>${n.status || ""}</td><td>${n.targetDate || nmd}</td><td>${n.remarks || ""}</td></tr>`; });
    h += `</table><br/>`;
    h += `<p><b>Points Pending:</b></p><table ${tStyle}><tr ${hdr}><th>Description</th><th>Owner</th><th>Status</th><th>Start Date</th><th>Remarks</th></tr>`;
    pending.forEach(p => { h += `<tr><td>${p.desc}</td><td>${p.owner}</td><td>${p.status}</td><td>${p.startDate}</td><td>${p.remarks || ""}</td></tr>`; });
    h += `</table><br/>`;
    h += `<p><b>Points Hold and Completed:</b></p><table ${tStyle}><tr ${hdr}><th>Description</th><th>Owner</th><th>Status</th><th>Start Date</th><th>Remarks</th></tr>`;
    hold.forEach(hh => { h += `<tr><td>${hh.desc}</td><td>${hh.owner}</td><td>${hh.status}</td><td>${hh.startDate || ""}</td><td>${hh.remarks || ""}</td></tr>`; });
    h += `</table><br/>`;
    h += `<p><b>Leave Registration:</b></p><table ${tStyle}><tr ${hdr}><th>SR No</th><th>Consultant Name</th><th>Leave Period</th><th>Team Member(s) Responsible</th><th>Remarks</th></tr>`;
    leaves.forEach((l, i) => { if (l.name) h += `<tr><td>${i + 1}</td><td>${l.name}</td><td>${l.period}</td><td>${l.responsible || ""}</td><td>${l.remarks || ""}</td></tr>`; });
    h += `</table><br/>`;
    h += `<p><b>Hiring Table:</b></p><table ${tStyle}><tr ${hdr}><th>Technology</th><th>Source</th><th>Stage</th><th>Interview Date</th><th>Interviewer</th><th>Score (1-5)</th><th>Decision</th><th>Notes</th></tr>`;
    hiring.forEach(hh => { h += `<tr><td>${hh.tech}</td><td>${hh.source || ""}</td><td>${hh.stage || ""}</td><td>${hh.date || ""}</td><td>${hh.interviewer || ""}</td><td>${hh.score || ""}</td><td>${hh.decision || ""}</td><td>${hh.notes || ""}</td></tr>`; });
    h += `</table><br/>`;
    h += `<p>Best Regards,<br/><b>Ketan Thombare</b><br/>DevOps Engineer<br/>M: +91 9222922251 | T: +91 22 2926 1650 | <a href="https://www.cloverinfotech.com">https://www.cloverinfotech.com</a></p>`;
    return h;
  }

  async function handleCopyHTML() {
    const htmlContent = generateHTML();
    const plainText = generateEmail();
    try {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const textBlob = new Blob([plainText], { type: "text/plain" });
      await navigator.clipboard.write([new ClipboardItem({ "text/html": blob, "text/plain": textBlob })]);
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    } catch {
      try { await navigator.clipboard.writeText(plainText); setCopied(true); setTimeout(() => setCopied(false), 2500); }
      catch { alert("Copy failed. Please select and copy manually."); }
    }
  }

  function handleReset() {
    if (!confirm("Reset all data to defaults? This cannot be undone.")) return;
    setMeetingDate(new Date().toISOString().split("T")[0]);
    setNextMeetingDate(getNextFriday(new Date()));
    setTimeStarted("4:30 PM"); setDuration("60 Mins"); setVenue("MS Teams");
    setTeam(DEFAULT_TEAM.map(n => ({ name: n, present: false })));
    setDiscussed([{ id: uid(), desc: "", owner: "", status: "Done", remarks: "" }]);
    setNextMeetingItems([{ id: uid(), desc: "Will be discussed in upcoming days", owner: "", status: "", targetDate: "", remarks: "-" }]);
    setPending(DEFAULT_PENDING); setHold(DEFAULT_HOLD);
    setLeaves([{ id: uid(), name: "", period: "", responsible: "", remarks: "" }]);
    setHiring(DEFAULT_HIRING);
    localStorage.removeItem(STORAGE_KEY);
  }

  const inputCls = "w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition";
  const btnPrimary = "px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 active:bg-sky-800 transition shadow-sm";
  const btnDanger = "px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition";
  const btnSecondary = "px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-medium hover:bg-zinc-200 transition";
  const sectionTitle = "text-base font-bold text-zinc-800 mb-3 tracking-tight";

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-sky-50" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-base">M</div>
            <div>
              <h1 className="text-lg font-bold text-zinc-900 leading-tight">CoE MoM Generator</h1>
              <p className="text-xs text-zinc-500">Auto-saved to browser</p>
            </div>
          </div>
          <button onClick={handleReset} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition">Reset All</button>
        </div>
        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-1">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${tab === i ? "border-sky-600 text-sky-700 bg-sky-50" : "border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5">
        {/* TAB 0: Meeting Info */}
        {tab === 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 space-y-4">
            <h2 className={sectionTitle}>Meeting Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold text-zinc-600 mb-1">Date of Meeting</label><input type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-xs font-semibold text-zinc-600 mb-1">Next Meeting Date <span className="text-zinc-400">(auto: next Friday)</span></label><input type="date" value={nextMeetingDate} onChange={e => setNextMeetingDate(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-xs font-semibold text-zinc-600 mb-1">Time Started</label><input value={timeStarted} onChange={e => setTimeStarted(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-xs font-semibold text-zinc-600 mb-1">Duration</label><input value={duration} onChange={e => setDuration(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-xs font-semibold text-zinc-600 mb-1">Venue</label><input value={venue} onChange={e => setVenue(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-xs font-semibold text-zinc-600 mb-1">Prepared By</label><input value={preparedBy} readOnly className={inputCls + " bg-zinc-50 text-zinc-500"} /></div>
            </div>
          </div>
        )}

        {/* TAB 1: Attendance */}
        {tab === 1 && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={sectionTitle}>Attendance</h2>
              <div className="flex gap-2">
                <button onClick={() => setTeam(team.map(t => ({ ...t, present: true })))} className={btnSecondary}>All Present</button>
                <button onClick={() => setTeam(team.map(t => ({ ...t, present: false })))} className={btnSecondary}>Clear All</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {team.map((m, i) => (
                <label key={m.name} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border ${m.present ? "bg-emerald-50 border-emerald-200" : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"}`}>
                  <input type="checkbox" checked={m.present} onChange={() => { const next = [...team]; next[i] = { ...next[i], present: !next[i].present }; setTeam(next); }} className="w-4 h-4 rounded accent-emerald-600" />
                  <span className={`text-sm font-medium ${m.present ? "text-emerald-800" : "text-zinc-600"}`}>{m.name}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <input placeholder="Add new team member..." id="newMember" className={inputCls + " flex-1"} onKeyDown={e => {
                if (e.key === "Enter" && e.target.value.trim()) { setTeam([...team, { name: e.target.value.trim(), present: false }]); e.target.value = ""; }
              }} />
              <button onClick={() => { const el = document.getElementById("newMember"); if (el.value.trim()) { setTeam([...team, { name: el.value.trim(), present: false }]); el.value = ""; } }} className={btnPrimary}>Add</button>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-zinc-500">
              <span className="text-emerald-600 font-semibold">Present: {attendees.length}</span>
              <span className="text-red-500 font-semibold">Absent: {absentees.length}</span>
            </div>
          </div>
        )}

        {/* TAB 2: Points Discussed */}
        {tab === 2 && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 space-y-4">
            <h2 className={sectionTitle}>Points Discussed in Meeting</h2>
            {discussed.map((d, i) => (
              <div key={d.id} className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">#{i + 1}</span>
                  {discussed.length > 1 && <button onClick={() => setDiscussed(discussed.filter((_, j) => j !== i))} className={btnDanger}>Remove</button>}
                </div>
                <input placeholder="Description..." value={d.desc} onChange={e => { const n = [...discussed]; n[i] = { ...n[i], desc: e.target.value }; setDiscussed(n); }} className={inputCls} />
                <div className="grid grid-cols-3 gap-2">
                  <input placeholder="Owner" value={d.owner} onChange={e => { const n = [...discussed]; n[i] = { ...n[i], owner: e.target.value }; setDiscussed(n); }} className={inputCls} />
                  <select value={d.status} onChange={e => { const n = [...discussed]; n[i] = { ...n[i], status: e.target.value }; setDiscussed(n); }} className={inputCls}>
                    <option>Done</option><option>WIP</option><option>Cancelled</option><option>Pending</option>
                  </select>
                  <input placeholder="Remarks" value={d.remarks} onChange={e => { const n = [...discussed]; n[i] = { ...n[i], remarks: e.target.value }; setDiscussed(n); }} className={inputCls} />
                </div>
              </div>
            ))}
            <button onClick={() => setDiscussed([...discussed, { id: uid(), desc: "", owner: "", status: "Done", remarks: "" }])} className={btnPrimary}>+ Add Item</button>
          </div>
        )}

        {/* TAB 3: Pending Items */}
        {tab === 3 && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 space-y-4">
            <h2 className={sectionTitle}>Points Pending</h2>
            <p className="text-xs text-zinc-500 -mt-2">Update statuses, remarks, or move items to Hold/Completed.</p>
            {pending.map((p, i) => (
              <div key={p.id} className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 space-y-2">
                <textarea rows={2} value={p.desc} onChange={e => { const n = [...pending]; n[i] = { ...n[i], desc: e.target.value }; setPending(n); }} className={inputCls} />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Owner" value={p.owner} onChange={e => { const n = [...pending]; n[i] = { ...n[i], owner: e.target.value }; setPending(n); }} className={inputCls} />
                  <select value={p.status} onChange={e => { const n = [...pending]; n[i] = { ...n[i], status: e.target.value }; setPending(n); }} className={inputCls}>
                    <option>WIP</option><option>Pending</option><option>Done</option>
                  </select>
                  <input placeholder="Start Date" value={p.startDate} onChange={e => { const n = [...pending]; n[i] = { ...n[i], startDate: e.target.value }; setPending(n); }} className={inputCls} />
                </div>
                <textarea rows={2} placeholder="Remarks..." value={p.remarks} onChange={e => { const n = [...pending]; n[i] = { ...n[i], remarks: e.target.value }; setPending(n); }} className={inputCls} />
                <div className="flex gap-2 mt-1">
                  <button onClick={() => movePendingToHold(i)} className={btnSecondary}>Move to Hold</button>
                  <button onClick={() => movePendingToCompleted(i)} className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium hover:bg-emerald-200 transition">Mark Completed</button>
                  <button onClick={() => setPending(pending.filter((_, j) => j !== i))} className={btnDanger}>Delete</button>
                </div>
              </div>
            ))}
            <button onClick={() => setPending([...pending, { id: uid(), desc: "", owner: "", status: "WIP", startDate: "", remarks: "" }])} className={btnPrimary}>+ Add Pending Item</button>
          </div>
        )}

        {/* TAB 4: Hold / Completed */}
        {tab === 4 && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 space-y-4">
            <h2 className={sectionTitle}>Points Hold and Completed</h2>
            {hold.map((h, i) => (
              <div key={h.id} className={`p-4 rounded-lg border space-y-2 ${h.status === "Completed" || h.status === "Done" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${h.status === "Completed" || h.status === "Done" ? "bg-emerald-200 text-emerald-800" : "bg-amber-200 text-amber-800"}`}>{h.status}</span>
                  <button onClick={() => setHold(hold.filter((_, j) => j !== i))} className={btnDanger}>Delete</button>
                </div>
                <textarea rows={2} value={h.desc} onChange={e => { const n = [...hold]; n[i] = { ...n[i], desc: e.target.value }; setHold(n); }} className={inputCls} />
                <div className="grid grid-cols-3 gap-2">
                  <input placeholder="Owner" value={h.owner} onChange={e => { const n = [...hold]; n[i] = { ...n[i], owner: e.target.value }; setHold(n); }} className={inputCls} />
                  <select value={h.status} onChange={e => { const n = [...hold]; n[i] = { ...n[i], status: e.target.value }; setHold(n); }} className={inputCls}>
                    <option>Hold</option><option>Completed</option><option>Done</option>
                  </select>
                  <input placeholder="Start Date" value={h.startDate} onChange={e => { const n = [...hold]; n[i] = { ...n[i], startDate: e.target.value }; setHold(n); }} className={inputCls} />
                </div>
                <textarea rows={2} placeholder="Remarks..." value={h.remarks} onChange={e => { const n = [...hold]; n[i] = { ...n[i], remarks: e.target.value }; setHold(n); }} className={inputCls} />
              </div>
            ))}
            <button onClick={() => setHold([...hold, { id: uid(), desc: "", owner: "", status: "Hold", startDate: "", remarks: "" }])} className={btnPrimary}>+ Add Item</button>
          </div>
        )}

        {/* TAB 5: Leaves */}
        {tab === 5 && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 space-y-4">
            <h2 className={sectionTitle}>Leave Registration</h2>
            {leaves.map((l, i) => (
              <div key={l.id} className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">#{i + 1}</span>
                  {leaves.length > 1 && <button onClick={() => setLeaves(leaves.filter((_, j) => j !== i))} className={btnDanger}>Remove</button>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={l.name} onChange={e => { const n = [...leaves]; n[i] = { ...n[i], name: e.target.value }; setLeaves(n); }} className={inputCls}>
                    <option value="">Select Name</option>
                    {team.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                  <input placeholder="Leave Period" value={l.period} onChange={e => { const n = [...leaves]; n[i] = { ...n[i], period: e.target.value }; setLeaves(n); }} className={inputCls} />
                  <input placeholder="Team Member(s) Responsible" value={l.responsible} onChange={e => { const n = [...leaves]; n[i] = { ...n[i], responsible: e.target.value }; setLeaves(n); }} className={inputCls} />
                  <input placeholder="Remarks" value={l.remarks} onChange={e => { const n = [...leaves]; n[i] = { ...n[i], remarks: e.target.value }; setLeaves(n); }} className={inputCls} />
                </div>
              </div>
            ))}
            <button onClick={() => setLeaves([...leaves, { id: uid(), name: "", period: "", responsible: "", remarks: "" }])} className={btnPrimary}>+ Add Leave</button>
          </div>
        )}

        {/* TAB 6: Hiring */}
        {tab === 6 && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 space-y-4">
            <h2 className={sectionTitle}>Hiring Table</h2>
            {hiring.map((h, i) => (
              <div key={h.id} className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">{h.tech || `#${i + 1}`}</span>
                  <button onClick={() => setHiring(hiring.filter((_, j) => j !== i))} className={btnDanger}>Remove</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input placeholder="Technology" value={h.tech} onChange={e => { const n = [...hiring]; n[i] = { ...n[i], tech: e.target.value }; setHiring(n); }} className={inputCls} />
                  <input placeholder="Source" value={h.source} onChange={e => { const n = [...hiring]; n[i] = { ...n[i], source: e.target.value }; setHiring(n); }} className={inputCls} />
                  <input placeholder="Stage" value={h.stage} onChange={e => { const n = [...hiring]; n[i] = { ...n[i], stage: e.target.value }; setHiring(n); }} className={inputCls} />
                  <input placeholder="Interview Date" value={h.date} onChange={e => { const n = [...hiring]; n[i] = { ...n[i], date: e.target.value }; setHiring(n); }} className={inputCls} />
                  <input placeholder="Interviewer" value={h.interviewer} onChange={e => { const n = [...hiring]; n[i] = { ...n[i], interviewer: e.target.value }; setHiring(n); }} className={inputCls} />
                  <input placeholder="Score (1-5)" value={h.score} onChange={e => { const n = [...hiring]; n[i] = { ...n[i], score: e.target.value }; setHiring(n); }} className={inputCls} />
                  <input placeholder="Decision" value={h.decision} onChange={e => { const n = [...hiring]; n[i] = { ...n[i], decision: e.target.value }; setHiring(n); }} className={inputCls} />
                  <input placeholder="Notes" value={h.notes} onChange={e => { const n = [...hiring]; n[i] = { ...n[i], notes: e.target.value }; setHiring(n); }} className={inputCls} />
                </div>
              </div>
            ))}
            <button onClick={() => setHiring([...hiring, { id: uid(), tech: "", source: "", stage: "", date: "", interviewer: "", score: "", decision: "", notes: "" }])} className={btnPrimary}>+ Add Row</button>
          </div>
        )}

        {/* TAB 7: Generate */}
        {tab === 7 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className={sectionTitle}>Generated Email</h2>
                <button onClick={handleCopyHTML} className={`${btnPrimary} ${copied ? "bg-emerald-600 hover:bg-emerald-600" : ""}`}>
                  {copied ? "Copied! Paste in Outlook" : "Copy as Rich Text (for Outlook)"}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mb-4">Click the button above to copy formatted email with tables. Then paste directly into Outlook.</p>
              <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50 overflow-auto max-h-[600px]">
                <div dangerouslySetInnerHTML={{ __html: generateHTML() }} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-zinc-700 mb-2">Plain Text Version</h3>
              <pre className="text-xs text-zinc-700 whitespace-pre-wrap bg-zinc-50 p-4 rounded-lg border border-zinc-200 max-h-96 overflow-auto">{generateEmail()}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
