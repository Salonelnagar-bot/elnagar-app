import { useState, useEffect, useMemo, useCallback } from "react";

const SB = "https://blqvqhqfsrafpmheuhcx.supabase.co/rest/v1";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscXZxaHFmc3JhZnBtaGV1aGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzM2NDMsImV4cCI6MjA5MzE0OTY0M30.jMeTPqvkyw8zXpiigQBndMVOBIuHtYQ5cqe_TJY7WRk";
const H = { "Content-Type":"application/json", apikey:KEY, Authorization:`Bearer ${KEY}`, Prefer:"return=representation" };
const db = {
  get:(t,q="")=>fetch(`${SB}/${t}?${q}`,{headers:H}).then(r=>r.json()),
  post:(t,b)=>fetch(`${SB}/${t}`,{method:"POST",headers:H,body:JSON.stringify(b)}).then(r=>r.json()),
  patch:(t,id,b)=>fetch(`${SB}/${t}?id=eq.${id}`,{method:"PATCH",headers:{...H,Prefer:"return=minimal"},body:JSON.stringify(b)}),
  del:(t,id)=>fetch(`${SB}/${t}?id=eq.${id}`,{method:"DELETE",headers:H}),
};

// ── THÈME ELNAGAR ── bleu marine + or
const T = {
  navy:"#0d1b2a", navy2:"#112236", navy3:"#162d44", navy4:"#1a3550",
  navyL:"#1e3d5c", navyBorder:"#1e3354",
  gold:"#c9a84c", goldL:"#e0c070", goldD:"#9a7a2a", goldBg:"#1a1508",
  white:"#f0ece4", whiteD:"#c8c0b0", whiteDim:"#8a8070",
  green:"#2ecc71", greenBg:"#0a2018", greenB:"#1a4030",
  amber:"#f0a030", amberBg:"#1a1000", amberB:"#3a2800",
  red:"#e05050", redBg:"#1a0808", redB:"#3a1010",
  blue:"#4090e0", blueBg:"#081020",
  border:"#1a2f48", border2:"#213a58",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;background:${T.navy};}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:${T.navy};}
::-webkit-scrollbar-thumb{background:${T.goldD};border-radius:2px;}
input,select,textarea{
  background:${T.navy3};border:1px solid ${T.border};color:${T.white};
  padding:8px 12px;border-radius:5px;font-family:'Inter',sans-serif;
  font-size:13px;width:100%;outline:none;transition:border-color 0.15s;
}
input:focus,select:focus,textarea:focus{border-color:${T.gold};}
input::placeholder{color:${T.whiteDim};}
select option{background:${T.navy3};}
.pf{font-family:'Cormorant Garamond',serif!important;}
.lbl{font-size:10px;letter-spacing:1.5px;color:${T.whiteDim};text-transform:uppercase;display:block;margin-bottom:5px;font-family:'Inter',sans-serif;}
.card{background:${T.navy2};border:1px solid ${T.navyBorder};border-radius:8px;}
.pill{font-size:10px;letter-spacing:.6px;padding:2px 8px;border-radius:20px;font-family:'Inter',sans-serif;font-weight:500;}
.pill-g{background:${T.greenBg};color:${T.green};border:1px solid ${T.greenB};}
.pill-a{background:${T.amberBg};color:${T.amber};border:1px solid ${T.amberB};}
.pill-r{background:${T.redBg};color:${T.red};border:1px solid ${T.redB};}
.pill-gold{background:${T.goldBg};color:${T.gold};border:1px solid ${T.goldD}44;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:none;border-radius:5px;cursor:pointer;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;letter-spacing:.5px;transition:all 0.15s;white-space:nowrap;}
.btn-p{background:linear-gradient(135deg,${T.goldD},${T.gold});color:${T.navy};padding:8px 18px;}
.btn-p:hover{opacity:.88;}
.btn-p:disabled{opacity:.3;cursor:not-allowed;}
.btn-s{background:${T.navy3};color:${T.white};border:1px solid ${T.border};padding:7px 14px;}
.btn-s:hover{border-color:${T.gold};color:${T.gold};}
.btn-g{background:transparent;color:${T.gold};border:1px solid ${T.border};padding:7px 14px;}
.btn-g:hover{border-color:${T.gold};}
.btn-d{background:transparent;color:${T.red};border:1px solid ${T.redB};padding:7px 14px;}
.btn-sm{padding:5px 11px!important;font-size:11px!important;}
.btn-xs{padding:3px 8px!important;font-size:10px!important;}
.hr{border:none;border-top:1px solid ${T.navyBorder};margin:12px 0;}
.row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid ${T.navyBorder};}
.hover-tr:hover{background:${T.navy3}!important;}
@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{width:14px;height:14px;border:2px solid ${T.border};border-top-color:${T.gold};border-radius:50%;animation:spin .65s linear infinite;flex-shrink:0;}
`;

// helpers
const todayStr = () => new Date().toISOString().split("T")[0];
const fmt2 = ds => { try{const[,m,d]=ds.split("-");return`${d}/${m}`;}catch{return ds;}};
const fmt3 = ds => { try{const[y,m,d]=ds.split("-");return`${d}/${m}/${y}`;}catch{return ds;}};
const eur = v => `${Number(v||0).toFixed(2).replace(".",",")} €`;
const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const DAYS7 = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const HOURS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"];
const CATS = ["Coupe","Barbe","Couleur","Soin","Autre"];
const PCATS = ["Shampoing","Soin","Finition","Coloration","Autre"];

const getDaysOfWeek = base => {
  const d=new Date(base), day=d.getDay(), mon=new Date(d);
  mon.setDate(d.getDate()-(day===0?6:day-1));
  return Array.from({length:6},(_,i)=>{const dd=new Date(mon);dd.setDate(mon.getDate()+i);return dd.toISOString().split("T")[0];});
};

// ── MINI GRAPHIQUE SVG ──
function LineChart({data, color="#c9a84c", height=80}) {
  if(!data||data.length<2) return null;
  const max=Math.max(...data.map(d=>d.v),1);
  const w=400, h=height;
  const pts=data.map((d,i)=>[(i/(data.length-1))*w, h-8-(d.v/max)*(h-16)]);
  const path=pts.map((p,i)=>`${i===0?"M":"L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const fill=pts.map((p,i)=>`${i===0?"M":"L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")+`L${w},${h} L0,${h} Z`;
  return(
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height}} preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#grad)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color}/>)}
    </svg>
  );
}

// ── HEATMAP TAUX D'OCCUPATION ──
function OccupancyHeatmap({appts}) {
  const days=["Lun","Mar","Mer","Jeu","Ven","Sam"];
  const slots=["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
  const data={};
  appts.forEach(a=>{
    const d=new Date(a.date), day=d.getDay();
    if(day===0||day===6) return;
    const h=parseInt(a.time);
    const key=`${day-1}-${h}`;
    data[key]=(data[key]||0)+1;
  });
  const max=Math.max(...Object.values(data),1);
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{borderCollapse:"collapse",width:"100%"}}>
        <thead>
          <tr>
            <th style={{padding:"4px 8px",fontSize:10,color:T.whiteDim,width:60}}></th>
            {days.map(d=><th key={d} style={{padding:"4px 8px",fontSize:10,color:T.whiteDim,textAlign:"center",letterSpacing:"1px"}}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot,si)=>(
            <tr key={slot}>
              <td style={{padding:"3px 8px",fontSize:10,color:T.whiteDim}}>{slot}</td>
              {days.map((_,di)=>{
                const v=data[`${di}-${parseInt(slot)}`]||0;
                const pct=Math.round((v/max)*100);
                const bg=pct>80?`#1a6640`:pct>50?`#1a5030`:pct>20?`#1a3820`:`${T.navy3}`;
                return(
                  <td key={di} style={{padding:"2px 4px",textAlign:"center"}}>
                    <div style={{background:bg,borderRadius:4,padding:"6px 4px",fontSize:11,color:pct>20?T.green:T.whiteDim,fontWeight:500,transition:"background 0.3s"}}>
                      {pct>0?`${pct}%`:"0%"}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("agenda");
  const [subPage, setSubPage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [appts, setAppts] = useState([]);
  const [txs, setTxs] = useState([]);

  // Agenda
  const [weekBase, setWeekBase] = useState(todayStr());
  const [agView, setAgView] = useState("week");

  // Caisse
  const [cTab, setCTab] = useState("ticket");
  const [cart, setCart] = useState([]);
  const [cCli, setCCli] = useState("");
  const [cDisc, setCDisc] = useState("");
  const [cTip, setCTip] = useState("");
  const [cPay, setCPay] = useState("card");
  const [cNote, setCNote] = useState("");
  const [cSearch, setCSearch] = useState("");
  const [hFilter, setHFilter] = useState("all");
  const [hDate, setHDate] = useState("");
  const [expTx, setExpTx] = useState(null);

  // Clients
  const [clSearch, setClSearch] = useState("");
  const [clSort, setClSort] = useState("name");
  const [expCl, setExpCl] = useState(null);

  // Stats
  const [statsTab, setStatsTab] = useState("indicateurs");
  const [statsPeriod, setStatsPeriod] = useState("month");

  // Forms
  const [rdvF, setRdvF] = useState({clientId:"",serviceId:"",date:todayStr(),time:"",status:"confirmed",notes:""});
  const [clF, setClF] = useState({name:"",phone:"",email:"",notes:""});
  const [svcF, setSvcF] = useState({name:"",duration:"45",price:"",category:"Coupe"});
  const [prdF, setPrdF] = useState({name:"",price:"",stock:"",category:"Finition"});

  const load = useCallback(async()=>{
    setLoading(true);
    try{
      const[c,s,p,a,t]=await Promise.all([
        db.get("clients","order=name"),
        db.get("services","active=eq.true&order=category,name"),
        db.get("products","active=eq.true&order=name"),
        db.get("appointments","order=date,time"),
        db.get("transactions","order=created_at.desc&limit=500"),
      ]);
      if(Array.isArray(c))setClients(c);
      if(Array.isArray(s))setServices(s);
      if(Array.isArray(p))setProducts(p);
      if(Array.isArray(a))setAppts(a);
      if(Array.isArray(t))setTxs(t);
    }catch(e){notify("Erreur de connexion","err");}
    setLoading(false);
  },[]);

  useEffect(()=>{load();},[load]);

  const notify=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const gC=id=>clients.find(c=>c.id===id);
  const gS=id=>services.find(s=>s.id===id);
  const gP=id=>products.find(p=>p.id===id);
  const gI=i=>i.type==="service"?gS(i.id):gP(i.id);
  const rdvAt=(date,time)=>appts.find(a=>a.date===date&&a.time===time);
  const pm=t=>t.payment_method||"card";

  // Caisse calculs
  const sub=useMemo(()=>cart.reduce((s,i)=>s+(Number(gI(i)?.price)||0)*i.qty,0),[cart,services,products]);
  const disc=Number(cDisc)||0, tip=Number(cTip)||0;
  const total=Math.max(0,sub-disc)+tip;

  const addCart=(type,id)=>setCart(p=>{
    const ex=p.find(i=>i.type===type&&i.id===id);
    return ex?p.map(i=>i.type===type&&i.id===id?{...i,qty:i.qty+1}:i):[...p,{type,id,qty:1}];
  });

  const saveRdv=async()=>{
    if(!rdvF.serviceId||!rdvF.date||!rdvF.time)return notify("Prestation, date et heure requis","err");
    setSaving(true);
    const r=await db.post("appointments",{client_id:rdvF.clientId||null,service_id:rdvF.serviceId,date:rdvF.date,time:rdvF.time,status:rdvF.status,notes:rdvF.notes||null});
    setSaving(false);
    if(r?.code)return notify(r.message||"Erreur","err");
    await load();setModal(null);
    setRdvF({clientId:"",serviceId:"",date:todayStr(),time:"",status:"confirmed",notes:""});
    notify("Rendez-vous ajouté ✓");
  };
  const updRdv=async(id,b)=>{await db.patch("appointments",id,b);await load();setModal(null);notify("Mis à jour ✓");};
  const delRdv=async id=>{await db.del("appointments",id);await load();setModal(null);notify("Supprimé","warn");};

  const saveCl=async()=>{
    if(!clF.name)return notify("Nom requis","err");
    setSaving(true);
    const r=await db.post("clients",{name:clF.name,phone:clF.phone||null,email:clF.email||null,notes:clF.notes||null,visits:0,loyalty:0});
    setSaving(false);
    if(r?.code)return notify(r.message||"Erreur","err");
    await load();setModal(null);setClF({name:"",phone:"",email:"",notes:""});notify("Client ajouté ✓");
  };

  const saveSvc=async()=>{
    if(!svcF.name||!svcF.price)return notify("Nom et prix requis","err");
    setSaving(true);
    const r=await db.post("services",{name:svcF.name,duration:Number(svcF.duration)||45,price:Number(svcF.price),category:svcF.category,active:true});
    setSaving(false);
    if(r?.code)return notify(r.message||"Erreur","err");
    await load();setModal(null);setSvcF({name:"",duration:"45",price:"",category:"Coupe"});notify("Prestation ajoutée ✓");
  };

  const savePrd=async()=>{
    if(!prdF.name||!prdF.price)return notify("Nom et prix requis","err");
    setSaving(true);
    const r=await db.post("products",{name:prdF.name,price:Number(prdF.price),stock:Number(prdF.stock)||0,category:prdF.category,active:true});
    setSaving(false);
    if(r?.code)return notify(r.message||"Erreur","err");
    await load();setModal(null);setPrdF({name:"",price:"",stock:"",category:"Finition"});notify("Produit ajouté ✓");
  };

  const encaisser=async()=>{
    if(!cart.length)return;setSaving(true);
    const r=await db.post("transactions",{client_id:cCli||null,date:todayStr(),items:cart,subtotal:sub,discount:disc,tip,total,payment_method:cPay,status:"paid",notes:cNote||null});
    if(r?.code){setSaving(false);return notify(r.message||"Erreur","err");}
    if(cCli){const cl=gC(cCli);if(cl)await db.patch("clients",cCli,{visits:(cl.visits||0)+1,loyalty:(cl.loyalty||0)+Math.floor(total),last_visit:todayStr()});}
    await load();setSaving(false);
    setCart([]);setCCli("");setCDisc("");setCTip("");setCPay("card");setCNote("");
    notify("Encaissé ✓");
  };

  // Stats
  const today=todayStr();
  const weekDays=getDaysOfWeek(weekBase);
  const todayTxs=txs.filter(t=>t.date===today);
  const todayRev=todayTxs.reduce((s,t)=>s+Number(t.total||0),0);
  const weekRev=txs.filter(t=>weekDays.includes(t.date)).reduce((s,t)=>s+Number(t.total||0),0);
  const todayAppts=appts.filter(a=>a.date===today);
  const cm=new Date().getMonth()+1,cy=new Date().getFullYear();
  const mTxs=txs.filter(t=>{const[y,m]=t.date.split("-");return+y===cy&&+m===cm;});
  const mRev=mTxs.reduce((s,t)=>s+Number(t.total||0),0);
  const mTips=mTxs.reduce((s,t)=>s+Number(t.tip||0),0);
  const mDisc=mTxs.reduce((s,t)=>s+Number(t.discount||0),0);
  const avgTicket=mTxs.length?mRev/mTxs.length:0;
  const cancelledAppts=appts.filter(a=>a.status==="cancelled");
  const pendingAppts=appts.filter(a=>a.status==="pending");
  const lowStock=products.filter(p=>p.stock<=5);

  // Graphique CA par jour du mois
  const caPerDay=useMemo(()=>{
    const days=new Date(cy,cm,0).getDate();
    return Array.from({length:days},(_,i)=>{
      const d=String(i+1).padStart(2,"0");
      const date=`${cy}-${String(cm).padStart(2,"0")}-${d}`;
      return{l:d,v:txs.filter(t=>t.date===date).reduce((s,t)=>s+Number(t.total||0),0)};
    });
  },[txs,cy,cm]);

  const filtTxs=useMemo(()=>{
    let r=[...txs];
    if(hFilter!=="all")r=r.filter(t=>pm(t)===hFilter);
    if(hDate)r=r.filter(t=>t.date===hDate);
    return r;
  },[txs,hFilter,hDate]);

  const svcTop=services.map(s=>{
    const items=txs.flatMap(t=>t.items||[]).filter(i=>i.type==="service"&&i.id===s.id);
    return{...s,count:items.reduce((sm,i)=>sm+i.qty,0),rev:items.reduce((sm,i)=>sm+(Number(s.price)||0)*i.qty,0)};
  }).sort((a,b)=>b.rev-a.rev);

  const filtCl=useMemo(()=>{
    let r=clients.filter(c=>c.name.toLowerCase().includes(clSearch.toLowerCase())||(c.phone||"").includes(clSearch));
    if(clSort==="visits")r=[...r].sort((a,b)=>(b.visits||0)-(a.visits||0));
    if(clSort==="loyalty")r=[...r].sort((a,b)=>(b.loyalty||0)-(a.loyalty||0));
    return r;
  },[clients,clSearch,clSort]);

  const NAV=[
    {id:"agenda",label:"Agenda",icon:"📅"},
    {id:"caisse",label:"Caisse",icon:"🧾"},
    {id:"clients",label:"Clients",icon:"👥"},
    {id:"admin",label:"Admin",icon:"⚙️"},
  ];

  const CAISSE_SUB=[
    {id:"ticket",label:"Encaissement"},
    {id:"transactions",label:"Transactions"},
    {id:"paiements",label:"Paiements en plusieurs fois"},
    {id:"comptable",label:"Données comptables"},
    {id:"stocks",label:"Gestion des stocks"},
    {id:"cadeaux",label:"Cartes cadeaux & cures"},
  ];

  const ADMIN_SUB=[
    {id:"prestations",label:"Gestion des prestations"},
    {id:"produits",label:"Gestion des produits"},
    {id:"statistiques",label:"Statistiques RDV"},
    {id:"taux",label:"Taux d'occupation"},
    {id:"corbeille",label:"Corbeille RDV"},
  ];

  const navTo=(p,sp="")=>{setPage(p);setSubPage(sp);};

  const pageName = page==="caisse" ? (CAISSE_SUB.find(s=>s.id===cTab)?.label||"Caisse") :
    page==="admin" ? (ADMIN_SUB.find(s=>s.id===subPage)?.label||"Admin") : NAV.find(n=>n.id===page)?.label;

  // ══════════════════════════════════════════════════════════
  return(
    <div style={{display:"flex",height:"100vh",background:T.navy,color:T.white,fontFamily:"'Inter',sans-serif",overflow:"hidden"}}>
      <style>{CSS}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{width:220,background:T.navy,borderRight:`1px solid ${T.navyBorder}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
        {/* Logo */}
        <div style={{padding:"18px 16px",borderBottom:`1px solid ${T.navyBorder}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:`linear-gradient(135deg,${T.goldD},${T.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,color:T.navy,flexShrink:0}}>E</div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,letterSpacing:"2px",color:T.white}}>ELNAGAR</div>
              <div style={{fontSize:8,letterSpacing:"2px",color:T.goldD,textTransform:"uppercase"}}>Coiffure · Tours</div>
            </div>
          </div>
        </div>

        {/* Nav principale */}
        <nav style={{overflowY:"auto",flex:1,padding:"8px 0"}}>
          {NAV.map(({id,label,icon})=>(
            <div key={id}>
              <button onClick={()=>{navTo(id,"");if(id==="caisse")setCTab("ticket");}} style={{
                display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 16px",
                background:page===id?`${T.gold}18`:"transparent",
                color:page===id?T.gold:T.whiteD,
                border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:page===id?500:400,
                borderLeft:`3px solid ${page===id?T.gold:"transparent"}`,transition:"all 0.15s",
              }}>
                <span style={{fontSize:14}}>{icon}</span>{label}
              </button>

              {/* Sous-nav Caisse */}
              {id==="caisse"&&page==="caisse"&&(
                <div style={{background:`${T.navy3}`,borderTop:`1px solid ${T.navyBorder}`,borderBottom:`1px solid ${T.navyBorder}`,marginBottom:4}}>
                  {CAISSE_SUB.map(s=>(
                    <button key={s.id} onClick={()=>setCTab(s.id)} style={{
                      display:"block",width:"100%",padding:"8px 16px 8px 32px",
                      background:cTab===s.id?`${T.gold}12`:"transparent",
                      color:cTab===s.id?T.gold:T.whiteDim,
                      border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:12,
                      textAlign:"left",transition:"all 0.1s",
                    }}>{s.label}</button>
                  ))}
                </div>
              )}

              {/* Sous-nav Admin */}
              {id==="admin"&&page==="admin"&&(
                <div style={{background:`${T.navy3}`,borderTop:`1px solid ${T.navyBorder}`,borderBottom:`1px solid ${T.navyBorder}`,marginBottom:4}}>
                  {ADMIN_SUB.map(s=>(
                    <button key={s.id} onClick={()=>setSubPage(s.id)} style={{
                      display:"block",width:"100%",padding:"8px 16px 8px 32px",
                      background:subPage===s.id?`${T.gold}12`:"transparent",
                      color:subPage===s.id?T.gold:T.whiteDim,
                      border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:12,
                      textAlign:"left",transition:"all 0.1s",
                    }}>{s.label}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Infos du jour */}
        <div style={{padding:"12px 16px",borderTop:`1px solid ${T.navyBorder}`,background:T.navy2}}>
          <div style={{fontSize:10,color:T.whiteDim,letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>Aujourd'hui · {fmt3(today)}</div>
          <div style={{fontSize:13,color:T.white,marginBottom:2}}>💈 {todayAppts.length} rendez-vous</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.gold}}>{eur(todayRev)}</div>
          {lowStock.length>0&&<div style={{marginTop:6,fontSize:10,color:T.amber,background:T.amberBg,border:`1px solid ${T.amberB}`,borderRadius:4,padding:"3px 7px"}}>⚠️ {lowStock.length} stock(s) faible(s)</div>}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.navy}}>

        {/* Topbar */}
        <header style={{background:T.navy2,borderBottom:`1px solid ${T.navyBorder}`,padding:"0 24px",height:50,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:15,fontWeight:600,color:T.white}}>{pageName}</span>
            {loading&&<div className="spin"/>}
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            {page==="agenda"&&(
              <>
                <button className="btn btn-s btn-sm" onClick={()=>{const d=new Date(weekBase);d.setDate(d.getDate()-7);setWeekBase(d.toISOString().split("T")[0]);}}>←</button>
                <button className="btn btn-s btn-sm" onClick={()=>setWeekBase(today)}>Aujourd'hui</button>
                <button className="btn btn-s btn-sm" onClick={()=>{const d=new Date(weekBase);d.setDate(d.getDate()+7);setWeekBase(d.toISOString().split("T")[0]);}}>→</button>
                <span style={{fontSize:12,color:T.whiteDim,margin:"0 4px"}}>Vue semaine {weekDays[0]&&fmt2(weekDays[0])} — {weekDays[5]&&fmt2(weekDays[5])}</span>
              </>
            )}
            <button className="btn btn-s btn-sm" onClick={load}>↻</button>
            <button className="btn btn-p btn-sm" onClick={()=>{setRdvF({clientId:"",serviceId:"",date:today,time:"",status:"confirmed",notes:""});setModal("rdv");}}>+ RDV</button>
            <button className="btn btn-s btn-sm" onClick={()=>{setClF({name:"",phone:"",email:"",notes:""});setModal("client");}}>+ Client</button>
          </div>
        </header>

        {/* Toast */}
        {toast&&<div style={{position:"fixed",top:58,right:18,zIndex:999,background:toast.type==="err"?T.redBg:T.greenBg,border:`1px solid ${toast.type==="err"?T.red:T.green}55`,color:toast.type==="err"?T.red:T.green,padding:"8px 16px",borderRadius:6,fontSize:13,animation:"fadeIn 0.2s"}}>{toast.msg}</div>}

        {/* KPI strip */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",background:T.navy2,borderBottom:`1px solid ${T.navyBorder}`,flexShrink:0}}>
          {[
            {l:"CA TTC aujourd'hui",v:eur(todayRev),s:`${todayTxs.length} encaissements`},
            {l:"CA TTC semaine",v:eur(weekRev),s:"lun → sam"},
            {l:"CA TTC ce mois",v:eur(mRev),s:`Panier moy. ${eur(avgTicket)}`},
            {l:"RDV aujourd'hui",v:todayAppts.length,s:`${pendingAppts.length} en attente`},
            {l:"Clients",v:clients.length,s:`${clients.reduce((s,c)=>s+(c.visits||0),0)} visites totales`},
          ].map((k,i)=>(
            <div key={i} style={{padding:"10px 16px",borderRight:i<4?`1px solid ${T.navyBorder}`:"none"}}>
              <div className="lbl" style={{marginBottom:2}}>{k.l}</div>
              <div className="pf" style={{fontSize:20,color:T.gold,margin:"2px 0"}}>{k.v}</div>
              <div style={{fontSize:10,color:T.whiteDim}}>{k.s}</div>
            </div>
          ))}
        </div>

        {/* CONTENU */}
        <main style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>

          {/* ════ AGENDA ════ */}
          {page==="agenda"&&(
            <div>
              {/* Mini calendrier mois en haut */}
              <div style={{display:"flex",gap:12,marginBottom:16}}>
                <div className="card" style={{padding:"12px 16px",minWidth:200}}>
                  <div style={{fontSize:12,color:T.gold,fontWeight:600,marginBottom:8}}>{MONTHS[cm-1]} {cy}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center"}}>
                    {DAYS7.map(d=><div key={d} style={{fontSize:9,color:T.whiteDim,padding:"2px 0"}}>{d[0]}</div>)}
                    {Array.from({length:42},(_,i)=>{
                      const first=new Date(cy,cm-1,1).getDay()||7;
                      const day=i-first+2;
                      const inMonth=day>=1&&day<=new Date(cy,cm,0).getDate();
                      const ds=`${cy}-${String(cm).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                      const hasAppt=inMonth&&appts.some(a=>a.date===ds);
                      return(
                        <div key={i} onClick={()=>inMonth&&setWeekBase(ds)} style={{
                          fontSize:10,padding:"3px 0",borderRadius:3,cursor:inMonth?"pointer":"default",
                          background:ds===today?T.gold:ds===weekBase?`${T.gold}22`:"transparent",
                          color:ds===today?T.navy:inMonth?T.white:T.whiteDim,fontWeight:ds===today?700:400,
                          position:"relative",
                        }}>
                          {inMonth?day:""}
                          {hasAppt&&ds!==today&&<div style={{width:3,height:3,background:T.gold,borderRadius:"50%",margin:"0 auto",marginTop:1}}/>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats rapides */}
                <div style={{flex:1,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                  {[
                    {l:"RDV confirmés",v:appts.filter(a=>a.status==="confirmed"&&a.date>=today).length,c:T.green},
                    {l:"En attente",v:pendingAppts.length,c:T.amber},
                    {l:"Annulés (30j)",v:cancelledAppts.length,c:T.red},
                    {l:"Taux remplissage",v:`${Math.round((todayAppts.length/HOURS.length)*100)}%`,c:T.gold},
                  ].map(({l,v,c})=>(
                    <div key={l} className="card" style={{padding:"12px 16px"}}>
                      <div className="lbl">{l}</div>
                      <div className="pf" style={{fontSize:24,color:c,marginTop:4}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grille semaine */}
              <div className="card" style={{overflow:"hidden"}}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                    <thead>
                      <tr style={{background:T.navy3}}>
                        <th style={{width:54,padding:"8px",textAlign:"left",borderBottom:`1px solid ${T.navyBorder}`,fontSize:10,color:T.whiteDim}}></th>
                        {weekDays.map((d,i)=>{
                          const isToday=d===today;
                          const cnt=appts.filter(a=>a.date===d).length;
                          return(
                            <th key={d} style={{padding:"8px 4px",textAlign:"center",borderBottom:`1px solid ${T.navyBorder}`,background:isToday?`${T.gold}15`:"transparent"}}>
                              <div style={{fontSize:9,color:isToday?T.gold:T.whiteDim,letterSpacing:"1px",textTransform:"uppercase"}}>{DAYS7[i]}</div>
                              <div className="pf" style={{fontSize:16,color:isToday?T.gold:T.white,margin:"2px 0"}}>{fmt2(d)}</div>
                              <div style={{fontSize:9,color:cnt>0?T.gold:T.whiteDim}}>{cnt} RDV</div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {HOURS.map(time=>(
                        <tr key={time}>
                          <td style={{padding:"3px 8px",fontSize:9,color:T.whiteDim,borderBottom:`1px solid ${T.navyBorder}11`,verticalAlign:"top"}}>{time}</td>
                          {weekDays.map(date=>{
                            const rdv=rdvAt(date,time);
                            const cl=rdv?gC(rdv.client_id):null;
                            const sv=rdv?gS(rdv.service_id):null;
                            const isToday=date===today;
                            return(
                              <td key={date} onClick={()=>rdv?setModal({type:"viewRdv",rdv}):setModal({type:"rdvSlot",date,time})}
                                style={{padding:"2px 3px",verticalAlign:"top",cursor:"pointer",borderBottom:`1px solid ${T.navyBorder}11`,background:isToday?`${T.gold}05`:"transparent",minWidth:110}}>
                                {rdv&&sv?(
                                  <div style={{
                                    background:rdv.status==="confirmed"?T.greenBg:rdv.status==="cancelled"?T.redBg:T.amberBg,
                                    border:`1px solid ${rdv.status==="confirmed"?T.greenB:rdv.status==="cancelled"?T.redB:T.amberB}`,
                                    borderLeft:`3px solid ${rdv.status==="confirmed"?T.green:rdv.status==="cancelled"?T.red:T.amber}`,
                                    borderRadius:4,padding:"4px 7px",transition:"opacity 0.15s",
                                  }}
                                    onMouseEnter={e=>e.currentTarget.style.opacity=".75"}
                                    onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                                    <div style={{fontSize:11,color:T.gold,fontWeight:600,marginBottom:1}}>{cl?cl.name.split(" ")[0]:"—"} {cl?cl.name.split(" ")[1]?.charAt(0)||"":""}</div>
                                    <div style={{fontSize:10,color:T.white}}>{sv.name}</div>
                                    <div style={{fontSize:9,color:T.whiteDim,display:"flex",justifyContent:"space-between"}}>
                                      <span>{sv.duration}min</span>
                                      <span>{eur(sv.price)}</span>
                                    </div>
                                  </div>
                                ):(
                                  <div style={{height:36,borderRadius:4,border:"1px dashed transparent",transition:"border-color 0.1s"}}
                                    onMouseEnter={e=>e.currentTarget.style.borderColor=T.border}
                                    onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}/>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ CAISSE — TICKET ════ */}
          {page==="caisse"&&cTab==="ticket"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:18}}>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {/* Sélection client */}
                <div className="card" style={{padding:"14px 16px",display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:18}}>👤</span>
                  <select value={cCli} onChange={e=>setCCli(e.target.value)} style={{flex:1,background:"transparent",border:"none",color:cCli?T.white:T.whiteDim,fontSize:14,outline:"none"}}>
                    <option value="">Choisir un client</option>
                    {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {cCli&&gC(cCli)&&<div style={{fontSize:11,color:T.whiteDim,flexShrink:0}}>🏆 {gC(cCli).loyalty||0} pts · 💈 {gC(cCli).visits||0} visites</div>}
                </div>

                {/* Boutons rapides */}
                <div style={{display:"flex",gap:8}}>
                  {[["prestation","Prestation"],["produit","Produit"],["remise","Remise"],["libre","Montant libre"]].map(([k,l])=>(
                    <button key={k} className="btn btn-p btn-sm" style={{flex:1}}>{l}</button>
                  ))}
                </div>

                {/* Catalogue */}
                <input placeholder="🔍 Rechercher prestation ou produit…" value={cSearch} onChange={e=>setCSearch(e.target.value)} style={{background:T.navy3}}/>
                <div className="card" style={{padding:16}}>
                  <div className="lbl" style={{marginBottom:12}}>Prestations</div>
                  {CATS.map(cat=>{
                    const svcs=services.filter(s=>s.category===cat&&(!cSearch||s.name.toLowerCase().includes(cSearch.toLowerCase())));
                    if(!svcs.length)return null;
                    return(
                      <div key={cat} style={{marginBottom:14}}>
                        <div style={{fontSize:9,color:T.whiteDim,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:7,paddingBottom:5,borderBottom:`1px solid ${T.navyBorder}`}}>{cat}</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:6}}>
                          {svcs.map(s=>(
                            <button key={s.id} onClick={()=>addCart("service",s.id)} style={{background:T.navy3,border:`1px solid ${T.border}`,borderRadius:6,padding:"9px 11px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}
                              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.background=T.navy4;}}
                              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.navy3;}}>
                              <div style={{fontSize:12,color:T.white,marginBottom:3,lineHeight:1.3}}>{s.name}</div>
                              <div style={{display:"flex",justifyContent:"space-between"}}>
                                <span style={{fontSize:11,color:T.gold}}>{Number(s.price)===0?"Offert":eur(s.price)}</span>
                                <span style={{fontSize:9,color:T.whiteDim}}>{s.duration}min</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {products.filter(p=>!cSearch||p.name.toLowerCase().includes(cSearch.toLowerCase())).length>0&&(
                    <>
                      <div className="lbl" style={{marginBottom:10,marginTop:4}}>Produits</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:6}}>
                        {products.filter(p=>!cSearch||p.name.toLowerCase().includes(cSearch.toLowerCase())).map(p=>(
                          <button key={p.id} onClick={()=>addCart("product",p.id)} style={{background:T.navy3,border:`1px solid ${T.border}`,borderRadius:6,padding:"9px 11px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.background=T.navy4;}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.navy3;}}>
                            <div style={{fontSize:12,color:T.white,marginBottom:3}}>{p.name}</div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                              <span style={{fontSize:11,color:T.gold}}>{eur(p.price)}</span>
                              <span style={{fontSize:9,color:p.stock<=5?T.amber:T.whiteDim}}>Stock:{p.stock}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── Ticket ── */}
              <div style={{position:"sticky",top:0,alignSelf:"start"}}>
                <div className="card" style={{padding:18}}>
                  <div style={{textAlign:"center",marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${T.navyBorder}`}}>
                    <div className="pf" style={{fontSize:15,letterSpacing:"3px",color:T.gold}}>ELNAGAR</div>
                    <div style={{fontSize:9,color:T.whiteDim,letterSpacing:"2px",textTransform:"uppercase"}}>{fmt3(today)}</div>
                  </div>
                  <div style={{minHeight:60,marginBottom:12}}>
                    {cart.length===0?(
                      <div style={{textAlign:"center",color:T.whiteDim,fontSize:12,padding:"14px 0"}}>← Sélectionner une prestation</div>
                    ):cart.map(item=>{
                      const f=gI(item);if(!f)return null;
                      return(
                        <div key={`${item.type}-${item.id}`} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 0",borderBottom:`1px solid ${T.navyBorder}`}}>
                          <div style={{flex:1,overflow:"hidden"}}>
                            <div style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
                            <div style={{fontSize:9,color:T.whiteDim,textTransform:"uppercase"}}>{item.type==="service"?"Prestation":"Produit"}</div>
                          </div>
                          <button onClick={()=>setCart(p=>p.map(i=>i.type===item.type&&i.id===item.id?{...i,qty:Math.max(1,i.qty-1)}:i))} style={{background:T.navy3,border:`1px solid ${T.border}`,color:T.white,width:20,height:20,borderRadius:3,cursor:"pointer",fontSize:12,flexShrink:0}}>−</button>
                          <span style={{fontSize:12,minWidth:12,textAlign:"center",flexShrink:0}}>{item.qty}</span>
                          <button onClick={()=>setCart(p=>p.map(i=>i.type===item.type&&i.id===item.id?{...i,qty:i.qty+1}:i))} style={{background:T.navy3,border:`1px solid ${T.border}`,color:T.white,width:20,height:20,borderRadius:3,cursor:"pointer",fontSize:12,flexShrink:0}}>+</button>
                          <span style={{fontSize:12,color:T.gold,minWidth:50,textAlign:"right",flexShrink:0}}>{eur(Number(f.price)*item.qty)}</span>
                          <button onClick={()=>setCart(p=>p.filter(i=>!(i.type===item.type&&i.id===item.id)))} style={{background:"none",border:"none",color:T.whiteDim,cursor:"pointer",fontSize:13,flexShrink:0}}>✕</button>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                    <div><label className="lbl">Remise (€)</label><input type="number" min="0" placeholder="0" value={cDisc} onChange={e=>setCDisc(e.target.value)} style={{background:T.navy3}}/></div>
                    <div><label className="lbl">Pourboire (€)</label><input type="number" min="0" placeholder="0" value={cTip} onChange={e=>setCTip(e.target.value)} style={{background:T.navy3}}/></div>
                  </div>
                  <div style={{marginBottom:10}}>
                    <label className="lbl">Note interne</label>
                    <input placeholder="Formule, produit utilisé…" value={cNote} onChange={e=>setCNote(e.target.value)} style={{background:T.navy3}}/>
                  </div>
                  <div style={{background:T.navy3,borderRadius:6,padding:"10px 13px",marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.whiteDim,marginBottom:3}}><span>Sous-total</span><span>{eur(sub)}</span></div>
                    {disc>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.amber,marginBottom:3}}><span>Remise</span><span>−{eur(disc)}</span></div>}
                    {tip>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.green,marginBottom:3}}><span>Pourboire</span><span>+{eur(tip)}</span></div>}
                    <hr className="hr" style={{margin:"7px 0"}}/>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span className="pf" style={{fontSize:16}}>Total TTC</span>
                      <span className="pf" style={{fontSize:20,color:T.gold}}>{eur(total)}</span>
                    </div>
                  </div>
                  <div style={{marginBottom:14}}>
                    <label className="lbl">Mode de paiement</label>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:5}}>
                      {[["card","💳","Carte"],["cash","💶","Espèces"],["transfer","📲","Virement"]].map(([k,ic,l])=>(
                        <button key={k} onClick={()=>setCPay(k)} style={{padding:"7px 4px",border:`1px solid ${cPay===k?T.gold:T.border}`,background:cPay===k?`${T.gold}20`:T.navy3,color:cPay===k?T.gold:T.whiteDim,borderRadius:5,cursor:"pointer",fontSize:11,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                          <span style={{fontSize:15}}>{ic}</span><span>{l}</span>
                        </button>
                      ))}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:5}}>
                      {[["check","🗒️","Chèque"],["mixed","⚡","Paiement mixte"]].map(([k,ic,l])=>(
                        <button key={k} onClick={()=>setCPay(k)} style={{padding:"7px 4px",border:`1px solid ${cPay===k?T.gold:T.border}`,background:cPay===k?`${T.gold}20`:T.navy3,color:cPay===k?T.gold:T.whiteDim,borderRadius:5,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:5,justifyContent:"center"}}>
                          <span>{ic}</span><span>{l}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="btn btn-p" onClick={encaisser} disabled={!cart.length||saving} style={{width:"100%",fontSize:13,padding:"12px 0",letterSpacing:"1px"}}>
                    {saving?<><div className="spin"/>Enregistrement…</>:`Paiement ${eur(total)}`}
                  </button>
                  {cart.length>0&&<button onClick={()=>{setCart([]);setCCli("");setCDisc("");setCTip("");}} style={{width:"100%",marginTop:6,background:"none",border:"none",color:T.whiteDim,cursor:"pointer",fontSize:11,padding:"4px"}}>Vider le ticket</button>}
                </div>
              </div>
            </div>
          )}

          {/* ════ TRANSACTIONS ════ */}
          {page==="caisse"&&cTab==="transactions"&&(
            <div>
              <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
                {[["all","Tous"],["card","💳"],["cash","💶"],["transfer","📲"],["check","🗒️"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setHFilter(k)} className="btn btn-s btn-xs" style={{borderColor:hFilter===k?T.gold:T.border,color:hFilter===k?T.gold:T.whiteDim}}>{l}</button>
                ))}
                <input type="date" value={hDate} onChange={e=>setHDate(e.target.value)} style={{width:"auto",padding:"4px 10px",fontSize:12,background:T.navy3,maxWidth:150}}/>
                {hDate&&<button onClick={()=>setHDate("")} style={{background:"none",border:"none",color:T.whiteDim,cursor:"pointer"}}>✕</button>}
                <span style={{marginLeft:"auto",fontSize:12,color:T.whiteDim}}>
                  {filtTxs.length} transact. · <strong style={{color:T.gold}}>{eur(filtTxs.reduce((s,t)=>s+Number(t.total||0),0))}</strong>
                </span>
              </div>
              <div className="card" style={{overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:T.navy3}}>
                      {["N°","Date","Client","Prestations","Mode","Remise","Pourboire","Total TTC"].map(h=>(
                        <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:T.whiteDim,letterSpacing:"1px",textTransform:"uppercase",borderBottom:`1px solid ${T.navyBorder}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtTxs.slice(0,50).map((tx,i)=>{
                      const cl=gC(tx.client_id);
                      return(
                        <tr key={tx.id} className="hover-tr" style={{borderBottom:`1px solid ${T.navyBorder}22`,cursor:"pointer"}} onClick={()=>setExpTx(expTx===tx.id?null:tx.id)}>
                          <td style={{padding:"8px 12px",fontSize:11,color:T.whiteDim}}>#{String(i+1).padStart(4,"0")}</td>
                          <td style={{padding:"8px 12px",fontSize:11,color:T.whiteDim,whiteSpace:"nowrap"}}>{fmt3(tx.date)}</td>
                          <td style={{padding:"8px 12px",fontSize:12}}>{cl?cl.name:"Anonyme"}</td>
                          <td style={{padding:"8px 12px",fontSize:11,color:T.whiteD,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(tx.items||[]).map(i=>gI(i)?.name).filter(Boolean).join(", ")}</td>
                          <td style={{padding:"8px 12px",fontSize:13}}>{pm(tx)==="card"?"💳":pm(tx)==="cash"?"💶":pm(tx)==="transfer"?"📲":"🗒️"}</td>
                          <td style={{padding:"8px 12px",fontSize:11,color:Number(tx.discount)>0?T.amber:T.whiteDim}}>{Number(tx.discount)>0?`−${eur(tx.discount)}`:"—"}</td>
                          <td style={{padding:"8px 12px",fontSize:11,color:Number(tx.tip)>0?T.green:T.whiteDim}}>{Number(tx.tip)>0?`+${eur(tx.tip)}`:"—"}</td>
                          <td style={{padding:"8px 12px"}}><span className="pf" style={{fontSize:15,color:T.gold}}>{eur(tx.total)}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════ DONNÉES COMPTABLES ════ */}
          {page==="caisse"&&cTab==="comptable"&&(
            <div>
              {/* Tabs */}
              <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`1px solid ${T.navyBorder}`}}>
                {["indicateurs","prestations","produits","reglements"].map(t=>(
                  <button key={t} onClick={()=>setStatsTab(t)} style={{padding:"8px 16px",background:"transparent",color:statsTab===t?T.gold:T.whiteDim,border:"none",cursor:"pointer",fontSize:12,borderBottom:`2px solid ${statsTab===t?T.gold:"transparent"}`,textTransform:"capitalize"}}>
                    {t==="indicateurs"?"Indicateurs clés":t==="prestations"?"Prestations":t==="produits"?"Produits":"Règlements"}
                  </button>
                ))}
              </div>

              {statsTab==="indicateurs"&&(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
                    {[
                      {l:"Chiffre d'affaires TTC",v:eur(mRev)},
                      {l:"TVA du chiffre d'affaires",v:eur(mRev*0.2)},
                      {l:"Chiffre d'affaires HT",v:eur(mRev/1.2)},
                      {l:"Panier moyen",v:eur(avgTicket)},
                    ].map(({l,v})=>(
                      <div key={l} className="card" style={{padding:"16px 20px"}}>
                        <div style={{fontSize:12,color:T.whiteDim,marginBottom:8}}>{l}</div>
                        <div className="pf" style={{fontSize:26,color:T.gold}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{padding:20,marginBottom:16}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Évolution du CA — {MONTHS[cm-1]} {cy}</div>
                    <LineChart data={caPerDay} color={T.gold} height={100}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                      {caPerDay.filter((_,i)=>i%5===0).map(d=><span key={d.l} style={{fontSize:9,color:T.whiteDim}}>{d.l}</span>)}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                    {[
                      {l:"Total pourboires",v:eur(mTips),c:T.green},
                      {l:"Total remises",v:eur(mDisc),c:T.amber},
                      {l:"Nb transactions",v:mTxs.length,c:T.gold},
                    ].map(({l,v,c})=>(
                      <div key={l} className="card" style={{padding:"14px 18px"}}>
                        <div className="lbl">{l}</div>
                        <div className="pf" style={{fontSize:22,color:c,marginTop:4}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {statsTab==="prestations"&&(
                <div className="card" style={{padding:20}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>CA par prestation — {MONTHS[cm-1]} {cy}</div>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr>{["#","Prestation","Nb","CA TTC"].map(h=><th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:10,color:T.whiteDim,letterSpacing:"1px",textTransform:"uppercase",borderBottom:`1px solid ${T.navyBorder}`}}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {svcTop.map((s,i)=>(
                        <tr key={s.id} className="hover-tr" style={{borderBottom:`1px solid ${T.navyBorder}22`}}>
                          <td style={{padding:"8px 12px",fontSize:11,color:T.whiteDim}}>#{i+1}</td>
                          <td style={{padding:"8px 12px",fontSize:13}}>{s.name}</td>
                          <td style={{padding:"8px 12px",fontSize:12,color:T.whiteD}}>{s.count}</td>
                          <td style={{padding:"8px 12px"}}><span className="pf" style={{fontSize:15,color:T.gold}}>{eur(s.rev)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {statsTab==="reglements"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div className="card" style={{padding:20}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Répartition des règlements</div>
                    {[["card","💳 Carte bancaire"],["cash","💶 Espèces"],["transfer","📲 Virement"],["check","🗒️ Chèque"]].map(([k,l])=>{
                      const kt=txs.filter(t=>pm(t)===k);
                      const kr=kt.reduce((s,t)=>s+Number(t.total||0),0);
                      const pct=txs.length?Math.round(kt.length/txs.length*100):0;
                      return(
                        <div key={k} style={{marginBottom:14}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontSize:13}}>{l}</span>
                            <span className="pf" style={{fontSize:15,color:T.gold}}>{eur(kr)}</span>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                            <span style={{fontSize:10,color:T.whiteDim}}>{kt.length} transactions</span>
                            <span style={{fontSize:10,color:T.whiteDim}}>{pct}%</span>
                          </div>
                          <div style={{height:4,background:T.navy3,borderRadius:2}}><div style={{height:"100%",width:`${pct}%`,background:T.gold,borderRadius:2,transition:"width 0.5s"}}/></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="card" style={{padding:20}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Synthèse globale</div>
                    {[
                      {l:"CA Total TTC",v:eur(txs.reduce((s,t)=>s+Number(t.total||0),0))},
                      {l:"CA Total HT",v:eur(txs.reduce((s,t)=>s+Number(t.total||0),0)/1.2)},
                      {l:"Total TVA",v:eur(txs.reduce((s,t)=>s+Number(t.total||0),0)*0.2/1.2)},
                      {l:"Total pourboires",v:eur(txs.reduce((s,t)=>s+Number(t.tip||0),0))},
                      {l:"Total remises",v:eur(txs.reduce((s,t)=>s+Number(t.discount||0),0))},
                      {l:"Ticket moyen",v:eur(txs.length?txs.reduce((s,t)=>s+Number(t.total||0),0)/txs.length:0)},
                    ].map(({l,v})=>(
                      <div key={l} className="row"><span style={{fontSize:11,color:T.whiteDim}}>{l}</span><span className="pf" style={{fontSize:15,color:T.gold}}>{v}</span></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ STOCKS ════ */}
          {page==="caisse"&&cTab==="stocks"&&(
            <div>
              {/* Valorisation */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
                {[
                  {l:"Valorisation totale",v:eur(products.reduce((s,p)=>s+Number(p.price||0)*Number(p.stock||0),0))},
                  {l:"Nb de références",v:products.length},
                  {l:"Stocks faibles",v:lowStock.length,c:T.amber},
                  {l:"Valeur vendue",v:eur(txs.flatMap(t=>t.items||[]).filter(i=>i.type==="product").reduce((s,i)=>s+(Number(gP(i.id)?.price)||0)*i.qty,0))},
                ].map(({l,v,c})=>(
                  <div key={l} className="card" style={{padding:"14px 18px"}}>
                    <div className="lbl">{l}</div>
                    <div className="pf" style={{fontSize:22,color:c||T.gold,marginTop:4}}>{v}</div>
                  </div>
                ))}
              </div>

              {lowStock.length>0&&(
                <div style={{background:T.amberBg,border:`1px solid ${T.amberB}`,borderRadius:8,padding:"10px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
                  <span>⚠️</span>
                  <div style={{fontSize:12,color:T.amber}}>Stock faible : {lowStock.map(p=>`${p.name} (${p.stock})`).join(", ")}</div>
                </div>
              )}

              <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,alignItems:"center"}}>
                <input placeholder="🔍 Rechercher un produit…" value={cSearch} onChange={e=>setCSearch(e.target.value)} style={{maxWidth:280,background:T.navy3}}/>
                <button className="btn btn-p btn-sm" onClick={()=>{setPrdF({name:"",price:"",stock:"",category:"Finition"});setModal("product");}}>+ Ajouter un produit</button>
              </div>

              <div className="card" style={{overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:T.navy3}}>
                      {["Produit","Catégorie","Prix","Stock","Valorisation","Vendu","Actions"].map(h=>(
                        <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:10,color:T.whiteDim,letterSpacing:"1px",textTransform:"uppercase",borderBottom:`1px solid ${T.navyBorder}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p=>!cSearch||p.name.toLowerCase().includes(cSearch.toLowerCase())).map(p=>{
                      const sold=txs.flatMap(t=>t.items||[]).filter(i=>i.type==="product"&&i.id===p.id).reduce((s,i)=>s+i.qty,0);
                      return(
                        <tr key={p.id} className="hover-tr" style={{borderBottom:`1px solid ${T.navyBorder}22`}}>
                          <td style={{padding:"9px 14px",fontSize:13}}>{p.name}</td>
                          <td style={{padding:"9px 14px",fontSize:11,color:T.whiteDim}}>{p.category}</td>
                          <td style={{padding:"9px 14px"}}><span className="pf" style={{fontSize:14,color:T.gold}}>{eur(p.price)}</span></td>
                          <td style={{padding:"9px 14px"}}>
                            <span style={{fontSize:13,color:p.stock<=2?T.red:p.stock<=5?T.amber:T.green,fontWeight:600}}>{p.stock}</span>
                            <span style={{fontSize:10,color:T.whiteDim}}> unités</span>
                          </td>
                          <td style={{padding:"9px 14px",fontSize:12,color:T.whiteD}}>{eur(Number(p.price)*Number(p.stock))}</td>
                          <td style={{padding:"9px 14px",fontSize:12,color:T.whiteD}}>{sold}</td>
                          <td style={{padding:"9px 14px"}}>
                            <div style={{display:"flex",gap:5}}>
                              <button className="btn btn-s btn-xs" onClick={()=>db.patch("products",p.id,{stock:(p.stock||0)+1}).then(load)}>+1</button>
                              <button className="btn btn-s btn-xs" onClick={()=>db.patch("products",p.id,{stock:Math.max(0,(p.stock||0)-1)}).then(load)}>−1</button>
                              <button className="btn btn-s btn-xs" onClick={()=>{const n=prompt(`Stock de ${p.name} (actuel: ${p.stock}):`);if(n!==null&&!isNaN(n))db.patch("products",p.id,{stock:Number(n)}).then(load);}}>Régler</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════ CLIENTS ════ */}
          {page==="clients"&&(
            <div>
              <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
                <input placeholder="Chercher un client par nom ou téléphone" value={clSearch} onChange={e=>setClSearch(e.target.value)} style={{maxWidth:360,background:T.navy3}}/>
                <button className="btn btn-p btn-sm" onClick={()=>{setClF({name:"",phone:"",email:"",notes:""});setModal("client");}}>Créer</button>
                <span style={{marginLeft:"auto",fontSize:12,color:T.whiteDim}}>Nbre de clients : {clients.length}</span>
                <select value={clSort} onChange={e=>setClSort(e.target.value)} style={{width:"auto",padding:"6px 10px",background:T.navy3,fontSize:12}}>
                  <option value="name">A → Z</option>
                  <option value="visits">Visites</option>
                  <option value="loyalty">Points</option>
                </select>
              </div>
              <div className="card" style={{overflow:"hidden"}}>
                {filtCl.map((client,i)=>{
                  const cTxs=txs.filter(t=>t.client_id===client.id);
                  const spent=cTxs.reduce((s,t)=>s+Number(t.total||0),0);
                  const exp=expCl===client.id;
                  return(
                    <div key={client.id} style={{borderBottom:`1px solid ${T.navyBorder}`,background:exp?`${T.gold}08`:"transparent",transition:"background 0.15s"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 18px",cursor:"pointer"}} onClick={()=>setExpCl(exp?null:client.id)}>
                        <div style={{display:"flex",gap:12,alignItems:"center",flex:1}}>
                          <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.navy3},${T.navy4})`,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:T.gold,fontFamily:"'Cormorant Garamond',serif",flexShrink:0}}>{client.name[0]}</div>
                          <div style={{flex:1}}>
                            <span style={{fontSize:14,fontWeight:500}}>{client.name}</span>
                            <span style={{fontSize:12,color:T.whiteDim,marginLeft:12}}>{client.phone||"—"}</span>
                            {client.email&&<span style={{fontSize:11,color:T.whiteDim}}> — {client.email}</span>}
                          </div>
                        </div>
                        <div style={{display:"flex",gap:20,alignItems:"center"}}>
                          <div style={{textAlign:"center",minWidth:50}}>
                            <div className="lbl">Visites</div>
                            <div className="pf" style={{fontSize:16,color:T.gold}}>{client.visits||0}</div>
                          </div>
                          <div style={{textAlign:"center",minWidth:70}}>
                            <div className="lbl">CA total</div>
                            <div className="pf" style={{fontSize:16,color:T.gold}}>{eur(spent)}</div>
                          </div>
                          <div style={{textAlign:"center",minWidth:50}}>
                            <div className="lbl">Points</div>
                            <div className="pf" style={{fontSize:16,color:T.green}}>{client.loyalty||0}</div>
                          </div>
                          <div style={{display:"flex",gap:6}}>
                            <button className="btn btn-s btn-xs" onClick={e=>{e.stopPropagation();setRdvF({clientId:client.id,serviceId:"",date:today,time:"",status:"confirmed",notes:""});setModal("rdv");}}>RDV</button>
                            <button className="btn btn-s btn-xs" onClick={e=>{e.stopPropagation();setPage("caisse");setCTab("ticket");setCCli(client.id);}}>Caisse</button>
                          </div>
                          <span style={{color:T.whiteDim,fontSize:14}}>{exp?"▲":"▼"}</span>
                        </div>
                      </div>
                      {exp&&(
                        <div style={{padding:"0 18px 14px",animation:"fadeIn 0.2s"}}>
                          {client.notes&&<div style={{marginBottom:10,padding:"7px 10px",background:T.amberBg,border:`1px solid ${T.amberB}`,borderRadius:5,fontSize:12,color:T.amber}}>📋 {client.notes}</div>}
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                            <div>
                              <div className="lbl" style={{marginBottom:7}}>Historique des visites</div>
                              {cTxs.length===0?<div style={{fontSize:12,color:T.whiteDim}}>Aucune transaction</div>:cTxs.slice(0,5).map(tx=>(
                                <div key={tx.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.whiteD,padding:"4px 0",borderBottom:`1px solid ${T.navyBorder}`}}>
                                  <span style={{flexShrink:0}}>{fmt3(tx.date)}</span>
                                  <span style={{flex:1,margin:"0 10px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(tx.items||[]).map(i=>gI(i)?.name).filter(Boolean).join(", ")}</span>
                                  <span style={{color:T.gold,flexShrink:0}}>{eur(tx.total)}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div className="lbl" style={{marginBottom:7}}>Prochains RDV</div>
                              {appts.filter(a=>a.client_id===client.id&&a.date>=today).slice(0,3).map(a=>{
                                const sv=gS(a.service_id);
                                return(<div key={a.id} style={{fontSize:12,color:T.whiteD,padding:"4px 0",borderBottom:`1px solid ${T.navyBorder}`}}>📅 {fmt3(a.date)} à {a.time} · {sv?.name||"—"}</div>);
                              })}
                              {!appts.find(a=>a.client_id===client.id&&a.date>=today)&&<div style={{fontSize:12,color:T.whiteDim}}>Aucun RDV à venir</div>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {filtCl.length===0&&<div style={{textAlign:"center",color:T.whiteDim,padding:50,fontSize:13}}>Aucun client trouvé</div>}
              </div>
            </div>
          )}

          {/* ════ ADMIN — PRESTATIONS ════ */}
          {page==="admin"&&subPage==="prestations"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-p btn-sm" onClick={()=>{setSvcF({name:"",duration:"45",price:"",category:"Coupe"});setModal("service");}}>+ Ajouter une prestation</button>
                </div>
              </div>
              {CATS.map(cat=>{
                const svcs=services.filter(s=>s.category===cat);
                if(!svcs.length)return null;
                return(
                  <div key={cat} className="card" style={{marginBottom:12,overflow:"hidden"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 18px",background:T.navy3,borderBottom:`1px solid ${T.navyBorder}`}}>
                      <span style={{fontWeight:600,fontSize:13}}>{cat}</span>
                      <button className="btn btn-s btn-xs" onClick={()=>{setSvcF({name:"",duration:"45",price:"",category:cat});setModal("service");}}>Ajouter</button>
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead>
                        <tr>{["Prestation","Durée","Prix","Actions"].map(h=><th key={h} style={{padding:"7px 18px",textAlign:"left",fontSize:10,color:T.whiteDim,letterSpacing:"1px",textTransform:"uppercase",borderBottom:`1px solid ${T.navyBorder}`}}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {svcs.map(s=>(
                          <tr key={s.id} className="hover-tr" style={{borderBottom:`1px solid ${T.navyBorder}22`}}>
                            <td style={{padding:"8px 18px",fontSize:13}}>{s.name}</td>
                            <td style={{padding:"8px 18px",fontSize:12,color:T.whiteDim}}>{s.duration} min</td>
                            <td style={{padding:"8px 18px"}}><span className="pf" style={{fontSize:14,color:T.gold}}>{eur(s.price)}</span></td>
                            <td style={{padding:"8px 18px"}}>
                              <div style={{display:"flex",gap:8}}>
                                <button className="btn btn-s btn-xs" style={{color:T.red}} onClick={()=>db.patch("services",s.id,{active:false}).then(load)}>Supprimer</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ ADMIN — STATISTIQUES RDV ════ */}
          {page==="admin"&&subPage==="statistiques"&&(
            <div>
              <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`1px solid ${T.navyBorder}`}}>
                {["indicateurs","rdv","noshow"].map(t=>(
                  <button key={t} onClick={()=>setStatsTab(t)} style={{padding:"8px 16px",background:"transparent",color:statsTab===t?T.gold:T.whiteDim,border:"none",cursor:"pointer",fontSize:12,borderBottom:`2px solid ${statsTab===t?T.gold:"transparent"}`}}>
                    {t==="indicateurs"?"Indicateurs clés":t==="rdv"?"RDV":"RDV pas venus"}
                  </button>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
                {[
                  {l:"RDV en ligne",v:appts.length},
                  {l:"RDV total",v:appts.length},
                  {l:"Taux en ligne",v:`${appts.length?Math.round(appts.length/appts.length*100):0}%`},
                  {l:"Nvx clients en ligne",v:clients.filter(c=>(c.visits||0)>0).length},
                  {l:"Nvx clients en salon",v:clients.filter(c=>(c.visits||0)===0).length},
                ].map(({l,v})=>(
                  <div key={l} className="card" style={{padding:"14px 16px"}}>
                    <div className="lbl">{l}</div>
                    <div className="pf" style={{fontSize:24,color:T.gold,marginTop:4}}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:20,marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Rendez-vous pris — {MONTHS[cm-1]} {cy}</div>
                <LineChart data={Array.from({length:30},(_,i)=>{
                  const d=`${cy}-${String(cm).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
                  return{l:String(i+1).padStart(2,"0"),v:appts.filter(a=>a.date===d).length};
                })} color={T.green} height={90}/>
              </div>
            </div>
          )}

          {/* ════ ADMIN — TAUX D'OCCUPATION ════ */}
          {page==="admin"&&subPage==="taux"&&(
            <div>
              <div className="card" style={{padding:20}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Taux d'occupation — {MONTHS[cm-1]} {cy}</div>
                <div style={{fontSize:11,color:T.whiteDim,marginBottom:16}}>Moyenne par jour de la semaine et tranche horaire</div>
                <OccupancyHeatmap appts={appts}/>
              </div>
            </div>
          )}

          {/* ════ ADMIN — CORBEILLE ════ */}
          {page==="admin"&&subPage==="corbeille"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:13,color:T.whiteDim}}>Rendez-vous annulés dans les 30 derniers jours</div>
                <span style={{fontSize:12,color:T.whiteDim}}>{cancelledAppts.length} RDV annulés</span>
              </div>
              <div className="card" style={{overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:T.navy3}}>
                      {["RDV avec","Date du RDV","Client","Prestation","Annulation","Actions"].map(h=>(
                        <th key={h} style={{padding:"8px 16px",textAlign:"left",fontSize:10,color:T.whiteDim,letterSpacing:"1px",textTransform:"uppercase",borderBottom:`1px solid ${T.navyBorder}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cancelledAppts.map(rdv=>{
                      const cl=gC(rdv.client_id), sv=gS(rdv.service_id);
                      return(
                        <tr key={rdv.id} className="hover-tr" style={{borderBottom:`1px solid ${T.navyBorder}22`}}>
                          <td style={{padding:"8px 16px",fontSize:12}}>Elnagar</td>
                          <td style={{padding:"8px 16px",fontSize:12,color:T.whiteD}}>{fmt3(rdv.date)} {rdv.time}</td>
                          <td style={{padding:"8px 16px",fontSize:12}}>{cl?cl.name:"—"}</td>
                          <td style={{padding:"8px 16px",fontSize:12,color:T.whiteDim}}>{sv?.name||"—"}</td>
                          <td style={{padding:"8px 16px"}}><span className="pill pill-r">Annulé</span></td>
                          <td style={{padding:"8px 16px"}}>
                            <button className="btn btn-s btn-xs" style={{color:T.green}} onClick={()=>updRdv(rdv.id,{status:"confirmed"})}>Restaurer</button>
                          </td>
                        </tr>
                      );
                    })}
                    {cancelledAppts.length===0&&<tr><td colSpan={6} style={{padding:40,textAlign:"center",color:T.whiteDim,fontSize:13}}>Aucun RDV annulé</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════ PAGE RÉSERVATION EN LIGNE ════ */}
          {page==="agenda"&&false&&null}

        </main>
      </div>

      {/* ════ MODALS ════ */}
      {modal&&(
        <div onClick={e=>e.target===e.currentTarget&&setModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}}>
          <div className="card" style={{padding:26,width:"92%",maxWidth:440,animation:"slideUp 0.2s",maxHeight:"90vh",overflowY:"auto",background:T.navy2}}>

            {modal?.type==="viewRdv"&&(()=>{
              const r=modal.rdv, cl=gC(r.client_id), sv=gS(r.service_id);
              return(
                <>
                  <div className="pf" style={{fontSize:19,marginBottom:18,color:T.gold}}>Rendez-vous</div>
                  {[["Client",cl?.name||"Sans client"],["Prestation",sv?.name||"—"],["Date & heure",`${fmt3(r.date)} à ${r.time}`],["Durée",`${sv?.duration||"—"} min`],["Tarif",eur(sv?.price)]].map(([l,v])=>(
                    <div key={l} className="row"><span style={{fontSize:10,color:T.whiteDim,letterSpacing:"1px",textTransform:"uppercase"}}>{l}</span><span style={{fontSize:13}}>{v}</span></div>
                  ))}
                  <div className="row" style={{marginBottom:18}}>
                    <span style={{fontSize:10,color:T.whiteDim,letterSpacing:"1px",textTransform:"uppercase"}}>Statut</span>
                    <span className={`pill ${r.status==="confirmed"?"pill-g":r.status==="cancelled"?"pill-r":"pill-a"}`}>{r.status==="confirmed"?"Confirmé":r.status==="cancelled"?"Annulé":"En attente"}</span>
                  </div>
                  {r.notes&&<div style={{marginBottom:14,padding:"7px 10px",background:T.amberBg,border:`1px solid ${T.amberB}`,borderRadius:5,fontSize:12,color:T.amber}}>📋 {r.notes}</div>}
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <button className="btn btn-p btn-sm" style={{flex:1}} onClick={()=>{setModal(null);setPage("caisse");setCTab("ticket");addCart("service",r.service_id);setCCli(r.client_id||"");}}>→ Encaisser</button>
                    {r.status!=="confirmed"&&<button className="btn btn-s btn-sm" style={{flex:1}} onClick={()=>updRdv(r.id,{status:"confirmed"})}>✓ Confirmer</button>}
                    {r.status==="confirmed"&&<button className="btn btn-s btn-sm" style={{flex:1}} onClick={()=>updRdv(r.id,{status:"cancelled"})}>Annuler</button>}
                    <button className="btn btn-d btn-sm" onClick={()=>delRdv(r.id)}>Supprimer</button>
                  </div>
                </>
              );
            })()}

            {(modal==="rdv"||modal?.type==="rdvSlot")&&(
              <>
                <div className="pf" style={{fontSize:19,marginBottom:18,color:T.gold}}>Nouveau rendez-vous</div>
                <div style={{display:"grid",gap:12,marginBottom:18}}>
                  <div><label className="lbl">Client</label>
                    <select value={rdvF.clientId} onChange={e=>setRdvF(p=>({...p,clientId:e.target.value}))} style={{background:T.navy3}}>
                      <option value="">Sans client</option>
                      {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div><label className="lbl">Prestation *</label>
                    <select value={rdvF.serviceId} onChange={e=>setRdvF(p=>({...p,serviceId:e.target.value}))} style={{background:T.navy3}}>
                      <option value="">Sélectionner</option>
                      {CATS.map(cat=>(
                        <optgroup key={cat} label={cat}>
                          {services.filter(s=>s.category===cat).map(s=><option key={s.id} value={s.id}>{s.name} — {s.duration}min — {eur(s.price)}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><label className="lbl">Date *</label><input type="date" value={rdvF.date||(modal?.date||today)} onChange={e=>setRdvF(p=>({...p,date:e.target.value}))} style={{background:T.navy3}}/></div>
                    <div><label className="lbl">Heure *</label>
                      <select value={rdvF.time||(modal?.time||"")} onChange={e=>setRdvF(p=>({...p,time:e.target.value}))} style={{background:T.navy3}}>
                        <option value="">—</option>
                        {HOURS.map(h=><option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label className="lbl">Statut</label>
                    <select value={rdvF.status} onChange={e=>setRdvF(p=>({...p,status:e.target.value}))} style={{background:T.navy3}}>
                      <option value="confirmed">Confirmé</option>
                      <option value="pending">En attente</option>
                    </select>
                  </div>
                  <div><label className="lbl">Notes</label><textarea rows={2} placeholder="Précisions…" value={rdvF.notes} onChange={e=>setRdvF(p=>({...p,notes:e.target.value}))} style={{background:T.navy3}}/></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-s" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                  <button className="btn btn-p" onClick={saveRdv} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>Enregistrement…</>:"Confirmer le RDV"}</button>
                </div>
              </>
            )}

            {modal==="client"&&(
              <>
                <div className="pf" style={{fontSize:19,marginBottom:18,color:T.gold}}>Nouveau client</div>
                <div style={{display:"grid",gap:11,marginBottom:18}}>
                  {[{l:"Nom complet *",k:"name",t:"text",p:"Prénom Nom"},{l:"Téléphone",k:"phone",t:"tel",p:"06 00 00 00 00"},{l:"Email",k:"email",t:"email",p:"email@exemple.com"}].map(f=>(
                    <div key={f.k}><label className="lbl">{f.l}</label><input type={f.t} placeholder={f.p} value={clF[f.k]} onChange={e=>setClF(p=>({...p,[f.k]:e.target.value}))} style={{background:T.navy3}}/></div>
                  ))}
                  <div><label className="lbl">Notes</label><textarea rows={3} placeholder="Allergies, préférences…" value={clF.notes} onChange={e=>setClF(p=>({...p,notes:e.target.value}))} style={{background:T.navy3}}/></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-s" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                  <button className="btn btn-p" onClick={saveCl} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>Enregistrement…</>:"Créer le client"}</button>
                </div>
              </>
            )}

            {modal==="service"&&(
              <>
                <div className="pf" style={{fontSize:19,marginBottom:18,color:T.gold}}>Nouvelle prestation</div>
                <div style={{display:"grid",gap:11,marginBottom:18}}>
                  <div><label className="lbl">Nom *</label><input placeholder="Ex: Coupe + Barbe" value={svcF.name} onChange={e=>setSvcF(p=>({...p,name:e.target.value}))} style={{background:T.navy3}}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><label className="lbl">Durée (min) *</label><input type="number" min="5" value={svcF.duration} onChange={e=>setSvcF(p=>({...p,duration:e.target.value}))} style={{background:T.navy3}}/></div>
                    <div><label className="lbl">Prix (€) *</label><input type="number" min="0" placeholder="0" value={svcF.price} onChange={e=>setSvcF(p=>({...p,price:e.target.value}))} style={{background:T.navy3}}/></div>
                  </div>
                  <div><label className="lbl">Catégorie</label>
                    <select value={svcF.category} onChange={e=>setSvcF(p=>({...p,category:e.target.value}))} style={{background:T.navy3}}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-s" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                  <button className="btn btn-p" onClick={saveSvc} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>Enregistrement…</>:"Ajouter"}</button>
                </div>
              </>
            )}

            {modal==="product"&&(
              <>
                <div className="pf" style={{fontSize:19,marginBottom:18,color:T.gold}}>Nouveau produit</div>
                <div style={{display:"grid",gap:11,marginBottom:18}}>
                  <div><label className="lbl">Nom *</label><input placeholder="Ex: Shampoing Kérastase" value={prdF.name} onChange={e=>setPrdF(p=>({...p,name:e.target.value}))} style={{background:T.navy3}}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><label className="lbl">Prix (€) *</label><input type="number" min="0" placeholder="0" value={prdF.price} onChange={e=>setPrdF(p=>({...p,price:e.target.value}))} style={{background:T.navy3}}/></div>
                    <div><label className="lbl">Stock initial</label><input type="number" min="0" placeholder="0" value={prdF.stock} onChange={e=>setPrdF(p=>({...p,stock:e.target.value}))} style={{background:T.navy3}}/></div>
                  </div>
                  <div><label className="lbl">Catégorie</label>
                    <select value={prdF.category} onChange={e=>setPrdF(p=>({...p,category:e.target.value}))} style={{background:T.navy3}}>
                      {PCATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-s" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                  <button className="btn btn-p" onClick={savePrd} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>Enregistrement…</>:"Ajouter"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
