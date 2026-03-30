import { useState, useEffect, useRef } from "react";
const STORAGE_KEY = "coe-mom-data-v2";
const DEFAULT_TEAM = ["Omkar Raut","Paresh Chaudhari","Tushar Murkar","Ketan Thombare","Saumya Vemula","Nilesh Jadhav","Urvesh Patel","Vishal Mestri","Shubham Khodpe","Ishtiyaq Mahadiwala","Rahul Vattaparambil","Vijay Shrotriya","Shweta Jadhav","Rishabh Ramteke","Adnan Shaikh","Rehan Ansari"];
const DEFAULT_PENDING = [
  {id:1,desc:"Plan a DKAC to review their Kubernetes environment and suggest improvements.",owner:"Ketan Thombare",status:"WIP",startDate:"14-11-2025",remarks:"As discussed with Sandeep Pal, the client is not allowing us to show the K8s setup."},
  {id:2,desc:"Apex Integration with AI",owner:"Urvesh Patel",status:"WIP",startDate:"31-10-2025",remarks:"Connect with"},
  {id:3,desc:"Call Jyoti for Oracle fusion integration with AI",owner:"Tushar Murkar / Vishal Mestri",status:"WIP",startDate:"31-10-2025",remarks:"Connect with Harsh or Suresh once for this. On Monday, visit Andheri office. Vishal will talk to Kishor Bhupati"},
  {id:4,desc:"Azure Certification - Microsoft Certified: Azure Developer Associate (AZ-204)",owner:"Ketan Thombare / Saumya",status:"Pending",startDate:"7th November",remarks:"Asked Sandeep Malunjakar regarding multiple certification. Will set up exam after current reimbursement. Saumya discussed with Sandeep and will start from 9th Feb."},
  {id:5,desc:"New Learnings (React Native - Android)",owner:"Saumya Vemula",status:"WIP",startDate:"13-10-2025",remarks:"Learning in progress"},
  {id:6,desc:"Innovation Area - Tool/platform finalization",owner:"Urvesh Patel",status:"WIP",startDate:"Before 1st July",remarks:"Looking to explore Mendix, but cost comparison is pending. Started work on Power Apps."},
  {id:7,desc:"Use of AI Tools studied for ongoing project",owner:"Tushar M and Saumya Vemula (Nilesh Jadhav)",status:"WIP",startDate:"15th Oct",remarks:"The development team started using Amazon Q and achieved a 40% improvement in UI development productivity."},
  {id:8,desc:"New AI tool for documentation",owner:"Tushar Murkar",status:"WIP",startDate:"23rd Jan",remarks:""},
];
const DEFAULT_HOLD = [
  {id:101,desc:"Check if Play Framework can improve middleware performance.",owner:"Omkar Raut",status:"Hold",startDate:"",remarks:""},
  {id:102,desc:"Prepare JMeter presentation for Jana Bank Core Banking.",owner:"Paresh Chaudhari",status:"Done",startDate:"",remarks:""},
  {id:103,desc:"Azure Certification - AZ-400",owner:"Ketan Thombare",status:"Completed",startDate:"9th July 2025",remarks:"Completed"},
  {id:104,desc:"Innovation Area - N8N workflow automation tool",owner:"Tushar Murkar",status:"Hold",startDate:"03-10-2025",remarks:"OpenAI + Quadrant Vector DB setup stable and ready. Two AI agent links shared for testing."},
  {id:105,desc:"Java based API Listening tool for recording API Performance",owner:"Omkar Raut",status:"Hold",startDate:"Pending from 11th July",remarks:"Finalized on 4th July 2025."},
  {id:106,desc:"Accident Detection AI Usecase",owner:"Rishabh Ramteke",status:"Hold",startDate:"15th Oct",remarks:"YOLO model with 600-700 images. Accuracy 50-60%. Need AI/ML expert for motion-based detection."},
];
const DEFAULT_HIRING = [
  {id:201,tech:"Apex",source:"",stage:"",date:"",interviewer:"",score:"",decision:"",notes:""},
  {id:202,tech:"AI Expert",source:"",stage:"",date:"",interviewer:"",score:"",decision:"",notes:""},
  {id:203,tech:"ELK Expert",source:"",stage:"",date:"",interviewer:"",score:"",decision:"",notes:""},
];
function getNextFriday(f){const d=new Date(f);const day=d.getDay();const diff=(5-day+7)%7||7;d.setDate(d.getDate()+diff);return d.toISOString().split("T")[0];}
function fmtDate(s){if(!s)return"";const d=new Date(s);if(isNaN(d))return s;const M=["January","February","March","April","May","June","July","August","September","October","November","December"];const day=d.getDate();const sx=day===1||day===21||day===31?"st":day===2||day===22?"nd":day===3||day===23?"rd":"th";return day+sx+" "+M[d.getMonth()]+" "+d.getFullYear();}
function uid(){return Date.now()+Math.random();}
function load(){try{const r=localStorage.getItem(STORAGE_KEY);return r?JSON.parse(r):null;}catch{return null;}}
function save(d){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}catch{}}
const TABS=[{l:"Meeting Info",i:"\u{1F4CB}"},{l:"Attendance",i:"\u{1F465}"},{l:"Discussed",i:"\u{1F4AC}"},{l:"Pending",i:"\u23F3"},{l:"Hold / Done",i:"\u{1F4CC}"},{l:"Leaves",i:"\u{1F3D6}"},{l:"Hiring",i:"\u{1F3AF}"},{l:"Generate",i:"\u2709\uFE0F"}];

export default function App(){
  const[tab,setTab]=useState(0);
  const[copied,setCopied]=useState(false);
  const[msg,setMsg]=useState("");
  const fRef=useRef(null);
  const sv=load();
  const[mDate,setMDate]=useState(sv?.meetingDate||new Date().toISOString().split("T")[0]);
  const[nDate,setNDate]=useState(sv?.nextMeetingDate||getNextFriday(new Date()));
  const[prep]=useState("Ketan Thombare");
  const[time,setTime]=useState(sv?.timeStarted||"4:30 PM");
  const[dur,setDur]=useState(sv?.duration||"60 Mins");
  const[ven,setVen]=useState(sv?.venue||"MS Teams");
  const[team,setTeam]=useState(sv?.team||DEFAULT_TEAM.map(n=>({name:n,present:false})));
  const[disc,setDisc]=useState(sv?.discussed||[{id:uid(),desc:"",owner:"",status:"Done",remarks:""}]);
  const[nmi,setNmi]=useState(sv?.nextMeetingItems||[{id:uid(),desc:"Will be discussed in upcoming days",owner:"",status:"",targetDate:"",remarks:"-"}]);
  const[pend,setPend]=useState(sv?.pending||DEFAULT_PENDING);
  const[hold,setHold]=useState(sv?.hold||DEFAULT_HOLD);
  const[lvs,setLvs]=useState(sv?.leaves||[{id:uid(),name:"",period:"",responsible:"",remarks:""}]);
  const[hire,setHire]=useState(sv?.hiring||DEFAULT_HIRING);

  useEffect(()=>{save({meetingDate:mDate,nextMeetingDate:nDate,timeStarted:time,duration:dur,venue:ven,team,discussed:disc,nextMeetingItems:nmi,pending:pend,hold,leaves:lvs,hiring:hire});},[mDate,nDate,time,dur,ven,team,disc,nmi,pend,hold,lvs,hire]);
  useEffect(()=>{setNDate(getNextFriday(mDate));},[mDate]);

  const att=team.filter(t=>t.present).map(t=>t.name);
  const abs=team.filter(t=>!t.present).map(t=>t.name);

  function doExport(){
    const data={meetingDate:mDate,nextMeetingDate:nDate,timeStarted:time,duration:dur,venue:ven,team,discussed:disc,nextMeetingItems:nmi,pending:pend,hold,leaves:lvs,hiring:hire,exportedAt:new Date().toISOString()};
    const b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="MoM-"+(mDate||"data")+".json";a.click();URL.revokeObjectURL(u);
  }
  function doImport(e){
    const f=e.target.files?.[0];if(!f)return;
    const r=new FileReader();
    r.onload=(ev)=>{
      try{
        const d=JSON.parse(ev.target.result);
        if(d.team)setTeam(d.team.map(t=>({...t,present:false})));
        if(d.pending)setPend(d.pending);
        if(d.hold)setHold(d.hold);
        if(d.hiring)setHire(d.hiring);
        if(d.timeStarted)setTime(d.timeStarted);
        if(d.duration)setDur(d.duration);
        if(d.venue)setVen(d.venue);
        if(d.nextMeetingItems)setNmi(d.nextMeetingItems);
        setMDate(new Date().toISOString().split("T")[0]);
        setNDate(getNextFriday(new Date()));
        setDisc([{id:uid(),desc:"",owner:"",status:"Done",remarks:""}]);
        setLvs([{id:uid(),name:"",period:"",responsible:"",remarks:""}]);
        setMsg("Imported from "+(d.meetingDate?fmtDate(d.meetingDate):"file")+". Pending, Hold, Hiring & Team carried forward. Attendance, Discussed & Leaves reset.");
        setTimeout(()=>setMsg(""),8000);
      }catch{setMsg("Error: Invalid JSON file.");setTimeout(()=>setMsg(""),5000);}
    };r.readAsText(f);e.target.value="";
  }
  function toHold(i){const it=pend[i];setHold(p=>[...p,{...it,status:"Hold"}]);setPend(p=>p.filter((_,j)=>j!==i));}
  function toDone(i){const it=pend[i];setHold(p=>[...p,{...it,status:"Completed"}]);setPend(p=>p.filter((_,j)=>j!==i));}

  function genHTML(){
    const md=fmtDate(mDate),nmd=fmtDate(nDate);
    const bc="#1B4F72",ac="#2E86C1",lb="#F8F9FA",bd="#DEE2E6",td="#212529",tm="#6C757D";
    const bg=(s)=>{const m={"Done":["#D4EDDA","#155724","#C3E6CB"],"Completed":["#D4EDDA","#155724","#C3E6CB"],"WIP":["#FFF3CD","#856404","#FFEAA7"],"Pending":["#CCE5FF","#004085","#B8DAFF"],"Hold":["#F8D7DA","#721C24","#F5C6CB"],"Cancelled":["#E2E3E5","#383D41","#D6D8DB"]};const st=m[s]||m["Pending"];return'<span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;background:'+st[0]+';color:'+st[1]+';border:1px solid '+st[2]+';">'+s+'</span>';};
    const F="font-family:'Segoe UI',Calibri,Arial,sans-serif;";
    const sec=(t,e)=>'<tr><td style="padding:28px 0 12px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="'+F+'font-size:15px;font-weight:700;color:'+bc+';padding-bottom:8px;border-bottom:2px solid '+ac+';">'+e+'&nbsp;&nbsp;'+t+'</td></tr></table></td></tr>';
    const ths=(c)=>'<tr><td style="padding:8px 0 0 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid '+bd+';border-radius:6px;overflow:hidden;"><tr>'+c.map(x=>'<th style="background:'+bc+';color:#fff;'+F+'font-size:12px;font-weight:600;padding:10px 12px;text-align:left;letter-spacing:0.3px;text-transform:uppercase;">'+x+'</th>').join("")+'</tr>';
    const tE='</table></td></tr>';
    const rw=(cells,idx)=>{const b2=idx%2===0?"#FFFFFF":lb;return'<tr>'+cells.map(c=>'<td style="background:'+b2+';'+F+'font-size:13px;color:'+td+';padding:10px 12px;border-bottom:1px solid '+bd+';vertical-align:top;line-height:1.5;">'+c+'</td>').join("")+'</tr>';};

    let h='<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:900px;margin:0 auto;">';
    h+='<tr><td style="padding:0;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,'+bc+','+ac+');border-radius:8px 8px 0 0;"><tr><td style="padding:24px 28px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td><p style="margin:0;'+F+'font-size:22px;font-weight:700;color:#FFF;letter-spacing:-0.3px;">CoE Innovation Team</p><p style="margin:4px 0 0 0;'+F+'font-size:13px;color:rgba(255,255,255,0.85);">Weekly Status Meeting \u2014 Minutes of Meeting</p></td><td style="text-align:right;"><p style="margin:0;'+F+'font-size:13px;color:rgba(255,255,255,0.85);">'+md+'</p></td></tr></table></td></tr></table></td></tr>';
    h+='<tr><td style="padding:20px 0 0 0;"><p style="margin:0;'+F+'font-size:14px;color:'+td+';">Hi Team,</p><p style="margin:6px 0 0 0;'+F+'font-size:14px;color:'+tm+';">Please find below the minutes of our meeting. Also check the attached PPT.</p></td></tr>';

    h+=sec("Meeting Details","\u{1F4CB}");
    h+='<tr><td style="padding:8px 0 0 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid '+bd+';border-radius:6px;overflow:hidden;">';
    [["Date of Meeting",md],["Prepared by",prep],["Time Started",time],["Duration",dur],["Venue",ven],["Next Meeting",nmd]].forEach((r,i)=>{const b2=i%2===0?"#FFF":lb;h+='<tr><td style="background:'+b2+';'+F+'font-size:13px;font-weight:600;color:'+tm+';padding:9px 14px;width:160px;border-bottom:1px solid '+bd+';">'+r[0]+'</td><td style="background:'+b2+';'+F+'font-size:13px;color:'+td+';padding:9px 14px;border-bottom:1px solid '+bd+';">'+r[1]+'</td></tr>';});
    h+='</table></td></tr>';

    h+=sec("Participants","\u{1F465}");
    h+='<tr><td style="padding:8px 0 0 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid '+bd+';border-radius:6px;overflow:hidden;"><tr><th style="background:'+bc+';color:#fff;'+F+'font-size:12px;font-weight:600;padding:10px 14px;text-align:left;width:50%;text-transform:uppercase;">\u2705 Attendees ('+att.length+')</th><th style="background:'+bc+';color:#fff;'+F+'font-size:12px;font-weight:600;padding:10px 14px;text-align:left;width:50%;text-transform:uppercase;">\u274C Absentees ('+abs.length+')</th></tr><tr><td style="padding:12px 14px;'+F+'font-size:13px;vertical-align:top;line-height:1.8;">'+(att.map(a=>'<span style="display:inline-block;background:#D4EDDA;color:#155724;padding:2px 10px;border-radius:12px;margin:2px 4px 2px 0;font-size:12px;">'+a+'</span>').join(" ")||"\u2014")+'</td><td style="padding:12px 14px;'+F+'font-size:13px;vertical-align:top;line-height:1.8;">'+(abs.map(a=>'<span style="display:inline-block;background:#F8D7DA;color:#721C24;padding:2px 10px;border-radius:12px;margin:2px 4px 2px 0;font-size:12px;">'+a+'</span>').join(" ")||"\u2014")+'</td></tr></table></td></tr>';

    h+=sec("Agenda","\u{1F3AF}")+ths(["No.","Agenda"])+rw(["1","CoE Innovation Team's new Learning status and tracking"],0)+tE;
    h+=sec("Points Discussed","\u{1F4AC}")+ths(["#","Description","Owner","Status","Remarks"]);
    disc.filter(d=>d.desc).forEach((d,i)=>{h+=rw([""+(i+1),d.desc,d.owner||"\u2014",bg(d.status),d.remarks||"\u2014"],i);});h+=tE;
    h+=sec("Next Meeting","\u{1F4C5}")+ths(["#","Description","Owner","Status","Target Date","Remarks"]);
    nmi.filter(n=>n.desc).forEach((n,i)=>{h+=rw([""+(i+1),n.desc,n.owner||"\u2014",n.status?bg(n.status):"\u2014",n.targetDate||nmd,n.remarks||"\u2014"],i);});h+=tE;
    h+=sec("Points Pending","\u23F3")+ths(["Description","Owner","Status","Start Date","Remarks"]);
    pend.forEach((p,i)=>{h+=rw([p.desc,p.owner,bg(p.status),p.startDate,p.remarks||"\u2014"],i);});h+=tE;
    h+=sec("Points Hold & Completed","\u{1F4CC}")+ths(["Description","Owner","Status","Start Date","Remarks"]);
    hold.forEach((hh,i)=>{h+=rw([hh.desc,hh.owner,bg(hh.status),hh.startDate||"\u2014",hh.remarks||"\u2014"],i);});h+=tE;
    h+=sec("Leave Registration","\u{1F3D6}\uFE0F")+ths(["SR No","Consultant Name","Leave Period","Responsible","Remarks"]);
    lvs.filter(l=>l.name).forEach((l,i)=>{h+=rw([""+(i+1),l.name,l.period,l.responsible||"\u2014",l.remarks||"\u2014"],i);});h+=tE;
    h+=sec("Hiring Pipeline","\u{1F3AF}")+ths(["Technology","Source","Stage","Interview Date","Interviewer","Score","Decision","Notes"]);
    hire.forEach((hh,i)=>{h+=rw([hh.tech,hh.source||"\u2014",hh.stage||"\u2014",hh.date||"\u2014",hh.interviewer||"\u2014",hh.score||"\u2014",hh.decision||"\u2014",hh.notes||"\u2014"],i);});h+=tE;

    h+='<tr><td style="padding:30px 0 10px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid '+bd+';"><tr><td style="padding:18px 0 0 0;"><p style="margin:0;'+F+'font-size:13px;color:'+td+';">Best Regards,</p><p style="margin:4px 0 0 0;'+F+'font-size:15px;font-weight:700;color:'+bc+';">Ketan Thombare</p><p style="margin:2px 0 0 0;'+F+'font-size:12px;color:'+tm+';">DevOps Engineer</p><p style="margin:6px 0 0 0;'+F+'font-size:12px;color:'+tm+';">\u{1F4F1} +91 9222922251 &nbsp;|&nbsp; \u260E +91 22 2926 1650 &nbsp;|&nbsp; \u{1F310} <a href="https://www.cloverinfotech.com" style="color:'+ac+';text-decoration:none;">cloverinfotech.com</a></p></td></tr></table></td></tr></table>';
    return h;
  }

  function genText(){
    const md=fmtDate(mDate),nmd=fmtDate(nDate);
    let e="Hi Team,\n\nPlease find below the minutes of our meeting.\n\nDate: "+md+"\nPrepared by: "+prep+"\nTime: "+time+"\nDuration: "+dur+"\nVenue: "+ven+"\nNext Meeting: "+nmd+"\n\nAttendees: "+(att.join(", ")||"\u2014")+"\nAbsentees: "+(abs.join(", ")||"\u2014")+"\n\nPoints Discussed:\n";
    disc.forEach((d,i)=>{if(d.desc)e+=(i+1)+". "+d.desc+" ["+d.status+"]\n";});
    e+="\nPending:\n";pend.forEach(p=>{e+="\u2022 "+p.desc+" | "+p.owner+" | "+p.status+"\n";});
    e+="\nHold & Completed:\n";hold.forEach(h=>{e+="\u2022 "+h.desc+" | "+h.owner+" | "+h.status+"\n";});
    e+="\nLeaves:\n";lvs.forEach((l,i)=>{if(l.name)e+=(i+1)+". "+l.name+" - "+l.period+"\n";});
    e+="\nBest Regards,\nKetan Thombare\nDevOps Engineer\nM: +91 9222922251 | T: +91 22 2926 1650";
    return e;
  }

  async function doCopy(){
    try{await navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([genHTML()],{type:"text/html"}),"text/plain":new Blob([genText()],{type:"text/plain"})})]);setCopied(true);setTimeout(()=>setCopied(false),3000);}
    catch{try{await navigator.clipboard.writeText(genText());setCopied(true);setTimeout(()=>setCopied(false),3000);}catch{alert("Copy failed.");}}
  }

  function doReset(){
    if(!confirm("Reset all data?"))return;
    setMDate(new Date().toISOString().split("T")[0]);setNDate(getNextFriday(new Date()));setTime("4:30 PM");setDur("60 Mins");setVen("MS Teams");
    setTeam(DEFAULT_TEAM.map(n=>({name:n,present:false})));setDisc([{id:uid(),desc:"",owner:"",status:"Done",remarks:""}]);
    setNmi([{id:uid(),desc:"Will be discussed in upcoming days",owner:"",status:"",targetDate:"",remarks:"-"}]);
    setPend(DEFAULT_PENDING);setHold(DEFAULT_HOLD);setLvs([{id:uid(),name:"",period:"",responsible:"",remarks:""}]);setHire(DEFAULT_HIRING);
    localStorage.removeItem(STORAGE_KEY);
  }

  const C="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6";
  const I="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition placeholder:text-slate-400";
  const S=I+" appearance-none";
  const BP="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-200";
  const BD="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition";
  const BG="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition";
  const T="text-lg font-bold text-slate-800 tracking-tight";
  const L="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase";
  const IC="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-slate-300 transition";

  return(
    <div className="min-h-screen bg-slate-50" style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <input type="file" ref={fRef} accept=".json" onChange={doImport} className="hidden"/>

      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-200/50"><span className="text-white font-bold text-lg">M</span></div>
            <div><h1 className="text-base font-bold text-slate-900 leading-tight tracking-tight">CoE MoM Generator</h1><p className="text-[11px] text-slate-400 font-medium">Auto-saved to browser</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>fRef.current?.click()} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition">{"\u{1F4E5}"} Import JSON</button>
            <button onClick={doExport} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition">{"\u{1F4E4}"} Export JSON</button>
            <button onClick={doReset} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition">Reset</button>
          </div>
        </div>
        {msg&&<div className="max-w-6xl mx-auto px-5 pb-2"><div className={`px-4 py-2.5 rounded-xl text-xs font-medium ${msg.startsWith("Error")?"bg-red-50 text-red-700 border border-red-200":"bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>{msg}</div></div>}
        <div className="max-w-6xl mx-auto px-5 flex gap-0.5 overflow-x-auto pb-0">
          {TABS.map((t,i)=>(<button key={t.l} onClick={()=>setTab(i)} className={`whitespace-nowrap px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${tab===i?"border-blue-600 text-blue-700 bg-blue-50/50":"border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}><span className="mr-1.5">{t.i}</span>{t.l}</button>))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        {tab===0&&(<div className="space-y-5"><div className={C}><h2 className={T}>Meeting Details</h2><p className="text-sm text-slate-500 mt-1 mb-5">Next meeting date auto-calculates to next Friday.</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><div><label className={L}>Date of Meeting</label><input type="date" value={mDate} onChange={e=>setMDate(e.target.value)} className={I}/></div><div><label className={L}>Next Meeting Date</label><input type="date" value={nDate} onChange={e=>setNDate(e.target.value)} className={I}/></div><div><label className={L}>Time Started</label><input value={time} onChange={e=>setTime(e.target.value)} className={I}/></div><div><label className={L}>Duration</label><input value={dur} onChange={e=>setDur(e.target.value)} className={I}/></div><div><label className={L}>Venue</label><input value={ven} onChange={e=>setVen(e.target.value)} className={I}/></div><div><label className={L}>Prepared By</label><input value={prep} readOnly className={I+" bg-slate-50 text-slate-400"}/></div></div></div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5"><h3 className="text-sm font-bold text-blue-800 mb-2">{"\u{1F4D6}"} Weekly Workflow</h3><div className="text-xs text-blue-700 space-y-1.5 leading-relaxed"><p><strong>First time?</strong> Click <strong>{"\u{1F4E5}"} Import JSON</strong> to load previous week's data. Pending, Hold, Hiring & Team carry forward. Attendance, Discussed & Leaves reset.</p><p><strong>Every week:</strong> {"\u2460"} Set date {"\u2192"} {"\u2461"} Mark attendance {"\u2192"} {"\u2462"} Add discussed points {"\u2192"} {"\u2463"} Update pending {"\u2192"} {"\u2464"} Leaves {"\u2192"} {"\u2465"} Generate {"\u2192"} {"\u2466"} Copy to Outlook</p><p><strong>After sending:</strong> Click <strong>{"\u{1F4E4}"} Export JSON</strong> to save. Import it next week.</p></div></div></div>)}

        {tab===1&&(<div className={C}><div className="flex items-center justify-between mb-5"><div><h2 className={T}>Attendance</h2><div className="flex gap-3 mt-2"><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">{"\u2705"} Present: {att.length}</span><span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">{"\u274C"} Absent: {abs.length}</span></div></div><div className="flex gap-2"><button onClick={()=>setTeam(team.map(t=>({...t,present:true})))} className={BG}>All Present</button><button onClick={()=>setTeam(team.map(t=>({...t,present:false})))} className={BG}>Clear</button></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">{team.map((m,i)=>(<label key={m.name+i} className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border-2 ${m.present?"bg-emerald-50 border-emerald-300 shadow-sm shadow-emerald-100":"bg-white border-slate-200 hover:border-slate-300"}`}><input type="checkbox" checked={m.present} onChange={()=>{const n=[...team];n[i]={...n[i],present:!n[i].present};setTeam(n);}} className="w-4 h-4 rounded accent-emerald-600"/><span className={`text-sm font-medium ${m.present?"text-emerald-800":"text-slate-600"}`}>{m.name}</span></label>))}</div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200"><input placeholder="Add new team member..." id="nm" className={I+" flex-1"} onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){setTeam([...team,{name:e.target.value.trim(),present:false}]);e.target.value="";}}}/><button onClick={()=>{const el=document.getElementById("nm");if(el.value.trim()){setTeam([...team,{name:el.value.trim(),present:false}]);el.value="";}}} className={BP}>Add</button></div></div>)}

        {tab===2&&(<div className={C}><h2 className={T}>Points Discussed</h2><p className="text-sm text-slate-500 mt-1 mb-5">Add what was discussed this week.</p><div className="space-y-3">{disc.map((d,i)=>(<div key={d.id} className={IC}><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">#{i+1}</span>{disc.length>1&&<button onClick={()=>setDisc(disc.filter((_,j)=>j!==i))} className={BD}>Remove</button>}</div><input placeholder="What was discussed..." value={d.desc} onChange={e=>{const n=[...disc];n[i]={...n[i],desc:e.target.value};setDisc(n);}} className={I}/><div className="grid grid-cols-3 gap-2"><input placeholder="Owner" value={d.owner} onChange={e=>{const n=[...disc];n[i]={...n[i],owner:e.target.value};setDisc(n);}} className={I}/><select value={d.status} onChange={e=>{const n=[...disc];n[i]={...n[i],status:e.target.value};setDisc(n);}} className={S}><option>Done</option><option>WIP</option><option>Cancelled</option><option>Pending</option></select><input placeholder="Remarks" value={d.remarks} onChange={e=>{const n=[...disc];n[i]={...n[i],remarks:e.target.value};setDisc(n);}} className={I}/></div></div>))}</div><button onClick={()=>setDisc([...disc,{id:uid(),desc:"",owner:"",status:"Done",remarks:""}])} className={BP+" mt-4"}>+ Add Point</button></div>)}

        {tab===3&&(<div className={C}><h2 className={T}>Points Pending</h2><p className="text-sm text-slate-500 mt-1 mb-5">Update statuses. Move items to Hold or Completed.</p><div className="space-y-3">{pend.map((p,i)=>(<div key={p.id} className={IC}><textarea rows={2} value={p.desc} onChange={e=>{const n=[...pend];n[i]={...n[i],desc:e.target.value};setPend(n);}} className={I}/><div className="grid grid-cols-3 gap-2"><input placeholder="Owner" value={p.owner} onChange={e=>{const n=[...pend];n[i]={...n[i],owner:e.target.value};setPend(n);}} className={I}/><select value={p.status} onChange={e=>{const n=[...pend];n[i]={...n[i],status:e.target.value};setPend(n);}} className={S}><option>WIP</option><option>Pending</option><option>Done</option></select><input placeholder="Start Date" value={p.startDate} onChange={e=>{const n=[...pend];n[i]={...n[i],startDate:e.target.value};setPend(n);}} className={I}/></div><textarea rows={2} placeholder="Remarks..." value={p.remarks} onChange={e=>{const n=[...pend];n[i]={...n[i],remarks:e.target.value};setPend(n);}} className={I}/><div className="flex gap-2"><button onClick={()=>toHold(i)} className={BG}>{"\u{1F4CC}"} Hold</button><button onClick={()=>toDone(i)} className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition">{"\u2705"} Completed</button><button onClick={()=>setPend(pend.filter((_,j)=>j!==i))} className={BD}>Delete</button></div></div>))}</div><button onClick={()=>setPend([...pend,{id:uid(),desc:"",owner:"",status:"WIP",startDate:"",remarks:""}])} className={BP+" mt-4"}>+ Add Item</button></div>)}

        {tab===4&&(<div className={C}><h2 className={T}>Hold & Completed</h2><p className="text-sm text-slate-500 mt-1 mb-5">Archived items.</p><div className="space-y-3">{hold.map((h,i)=>(<div key={h.id} className={`p-5 rounded-xl border-2 space-y-3 ${h.status==="Completed"||h.status==="Done"?"border-emerald-200 bg-emerald-50/30":"border-amber-200 bg-amber-50/30"}`}><div className="flex items-center justify-between"><span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${h.status==="Completed"||h.status==="Done"?"bg-emerald-200 text-emerald-800":"bg-amber-200 text-amber-800"}`}>{h.status}</span><button onClick={()=>setHold(hold.filter((_,j)=>j!==i))} className={BD}>Delete</button></div><textarea rows={2} value={h.desc} onChange={e=>{const n=[...hold];n[i]={...n[i],desc:e.target.value};setHold(n);}} className={I}/><div className="grid grid-cols-3 gap-2"><input placeholder="Owner" value={h.owner} onChange={e=>{const n=[...hold];n[i]={...n[i],owner:e.target.value};setHold(n);}} className={I}/><select value={h.status} onChange={e=>{const n=[...hold];n[i]={...n[i],status:e.target.value};setHold(n);}} className={S}><option>Hold</option><option>Completed</option><option>Done</option></select><input placeholder="Start Date" value={h.startDate} onChange={e=>{const n=[...hold];n[i]={...n[i],startDate:e.target.value};setHold(n);}} className={I}/></div><textarea rows={2} placeholder="Remarks..." value={h.remarks} onChange={e=>{const n=[...hold];n[i]={...n[i],remarks:e.target.value};setHold(n);}} className={I}/></div>))}</div><button onClick={()=>setHold([...hold,{id:uid(),desc:"",owner:"",status:"Hold",startDate:"",remarks:""}])} className={BP+" mt-4"}>+ Add</button></div>)}

        {tab===5&&(<div className={C}><h2 className={T}>Leave Registration</h2><p className="text-sm text-slate-500 mt-1 mb-5">Track leaves this week.</p><div className="space-y-3">{lvs.map((l,i)=>(<div key={l.id} className={IC}><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">#{i+1}</span>{lvs.length>1&&<button onClick={()=>setLvs(lvs.filter((_,j)=>j!==i))} className={BD}>Remove</button>}</div><div className="grid grid-cols-2 gap-2"><select value={l.name} onChange={e=>{const n=[...lvs];n[i]={...n[i],name:e.target.value};setLvs(n);}} className={S}><option value="">Select Name</option>{team.map(t=><option key={t.name} value={t.name}>{t.name}</option>)}</select><input placeholder="Leave Period" value={l.period} onChange={e=>{const n=[...lvs];n[i]={...n[i],period:e.target.value};setLvs(n);}} className={I}/><input placeholder="Responsible" value={l.responsible} onChange={e=>{const n=[...lvs];n[i]={...n[i],responsible:e.target.value};setLvs(n);}} className={I}/><input placeholder="Remarks" value={l.remarks} onChange={e=>{const n=[...lvs];n[i]={...n[i],remarks:e.target.value};setLvs(n);}} className={I}/></div></div>))}</div><button onClick={()=>setLvs([...lvs,{id:uid(),name:"",period:"",responsible:"",remarks:""}])} className={BP+" mt-4"}>+ Add Leave</button></div>)}

        {tab===6&&(<div className={C}><h2 className={T}>Hiring Pipeline</h2><div className="space-y-3 mt-4">{hire.map((h,i)=>(<div key={h.id} className={IC}><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{h.tech||"#"+(i+1)}</span><button onClick={()=>setHire(hire.filter((_,j)=>j!==i))} className={BD}>Remove</button></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-2"><input placeholder="Technology" value={h.tech} onChange={e=>{const n=[...hire];n[i]={...n[i],tech:e.target.value};setHire(n);}} className={I}/><input placeholder="Source" value={h.source} onChange={e=>{const n=[...hire];n[i]={...n[i],source:e.target.value};setHire(n);}} className={I}/><input placeholder="Stage" value={h.stage} onChange={e=>{const n=[...hire];n[i]={...n[i],stage:e.target.value};setHire(n);}} className={I}/><input placeholder="Interview Date" value={h.date} onChange={e=>{const n=[...hire];n[i]={...n[i],date:e.target.value};setHire(n);}} className={I}/><input placeholder="Interviewer" value={h.interviewer} onChange={e=>{const n=[...hire];n[i]={...n[i],interviewer:e.target.value};setHire(n);}} className={I}/><input placeholder="Score" value={h.score} onChange={e=>{const n=[...hire];n[i]={...n[i],score:e.target.value};setHire(n);}} className={I}/><input placeholder="Decision" value={h.decision} onChange={e=>{const n=[...hire];n[i]={...n[i],decision:e.target.value};setHire(n);}} className={I}/><input placeholder="Notes" value={h.notes} onChange={e=>{const n=[...hire];n[i]={...n[i],notes:e.target.value};setHire(n);}} className={I}/></div></div>))}</div><button onClick={()=>setHire([...hire,{id:uid(),tech:"",source:"",stage:"",date:"",interviewer:"",score:"",decision:"",notes:""}])} className={BP+" mt-4"}>+ Add Row</button></div>)}

        {tab===7&&(<div className="space-y-5"><div className={C}><div className="flex items-center justify-between mb-5"><div><h2 className={T}>Email Preview</h2><p className="text-sm text-slate-500 mt-1">Copy and paste directly into Outlook.</p></div><div className="flex gap-3"><button onClick={doExport} className="px-5 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">{"\u{1F4E4}"} Export for Next Week</button><button onClick={doCopy} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.97] ${copied?"bg-emerald-500 text-white shadow-emerald-200":"bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200 hover:shadow-lg"}`}>{copied?"\u2705 Copied! Paste in Outlook \u2192":"\u{1F4CB} Copy Rich Text for Outlook"}</button></div></div><div className="border border-slate-200 rounded-xl bg-white overflow-auto max-h-[700px] shadow-inner"><div className="p-6" dangerouslySetInnerHTML={{__html:genHTML()}}/></div></div></div>)}
      </main>
    </div>
  );
}
