import { useState, useEffect, useMemo, useCallback } from "react";

const SB = "https://blqvqhqfsrafpmheuhcx.supabase.co/rest/v1";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscXZxaHFmc3JhZnBtaGV1aGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzM2NDMsImV4cCI6MjA5MzE0OTY0M30.jMeTPqvkyw8zXpiigQBndMVOBIuHtYQ5cqe_TJY7WRk";
const H = {"Content-Type":"application/json",apikey:KEY,Authorization:`Bearer ${KEY}`,Prefer:"return=representation"};
const db = {
  get:(t,q="")=>fetch(`${SB}/${t}?${q}`,{headers:H}).then(r=>r.json()),
  post:(t,b)=>fetch(`${SB}/${t}`,{method:"POST",headers:H,body:JSON.stringify(b)}).then(r=>r.json()),
  patch:(t,id,b)=>fetch(`${SB}/${t}?id=eq.${id}`,{method:"PATCH",headers:{...H,Prefer:"return=minimal"},body:JSON.stringify(b)}),
  del:(t,id)=>fetch(`${SB}/${t}?id=eq.${id}`,{method:"DELETE",headers:H}),
};

// ── COULEURS ELNAGAR ──
const gold = "#c9a84c";
const navy = "#0d1b2a";
const navyL = "#112236";
const navyLL = "#162d44";
const border = "#1e3354";
const white = "#f0ece4";
const muted = "#8a8070";
const dim = "#3a3a3a";
const green = "#2ecc71";
const red = "#e05050";
const amber = "#f0a030";

const HOURS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"];
const JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const CATS = ["Coupe","Barbe","Couleur","Soin","Autre"];

const todayStr = ()=>new Date().toISOString().split("T")[0];
const fmt2 = ds=>{try{const[,m,d]=ds.split("-");return`${d}/${m}`;}catch{return ds;}};
const fmt3 = ds=>{try{const[y,m,d]=ds.split("-");return`${d}/${m}/${y}`;}catch{return ds;}};
const eur = v=>`${Number(v||0).toFixed(2).replace(".",",")} €`;
const getDaysOfWeek = base=>{
  const d=new Date(base),day=d.getDay(),mon=new Date(d);
  mon.setDate(d.getDate()-(day===0?6:day-1));
  return Array.from({length:6},(_,i)=>{const dd=new Date(mon);dd.setDate(mon.getDate()+i);return dd.toISOString().split("T")[0];});
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;background:${navy};}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:${navy};}
::-webkit-scrollbar-thumb{background:${gold};border-radius:2px;}
input,select,textarea{
  background:#fff;border:1px solid #ddd;color:#333;
  padding:7px 10px;border-radius:4px;font-family:'Inter',sans-serif;
  font-size:13px;width:100%;outline:none;transition:border-color 0.15s;
}
input:focus,select:focus,textarea:focus{border-color:${gold};}
select option{background:#fff;color:#333;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:none;border-radius:4px;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;transition:all 0.15s;white-space:nowrap;}
.btn-gold{background:${gold};color:${navy};padding:8px 18px;}
.btn-gold:hover{opacity:.88;}
.btn-gold:disabled{opacity:.4;cursor:not-allowed;}
.btn-outline{background:transparent;color:${gold};border:1px solid ${gold};padding:7px 16px;}
.btn-outline:hover{background:${gold}22;}
.btn-white{background:#fff;color:#333;border:1px solid #ddd;padding:7px 14px;}
.btn-white:hover{border-color:#999;}
.btn-link{background:none;border:none;color:${gold};padding:4px 8px;font-size:13px;text-decoration:underline;cursor:pointer;}
.btn-danger{background:none;border:none;color:${red};padding:4px 8px;font-size:13px;cursor:pointer;}
.btn-sm{padding:5px 12px!important;font-size:12px!important;}
.btn-xs{padding:3px 8px!important;font-size:11px!important;}
.tag-confirmed{background:#d4edda;color:#155724;border:1px solid #c3e6cb;border-radius:12px;font-size:11px;padding:2px 8px;}
.tag-pending{background:#fff3cd;color:#856404;border:1px solid #ffeaa7;border-radius:12px;font-size:11px;padding:2px 8px;}
.tag-cancelled{background:#f8d7da;color:#721c24;border:1px solid #f5c6cb;border-radius:12px;font-size:11px;padding:2px 8px;}
.tag-paid{background:#d4edda;color:#155724;border:1px solid #c3e6cb;border-radius:12px;font-size:11px;padding:2px 8px;}
@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{width:14px;height:14px;border:2px solid #ddd;border-top-color:${gold};border-radius:50%;animation:spin .6s linear infinite;flex-shrink:0;}
.tr-hover:hover{background:#f8f8f8!important;}
`;

export default function App() {
  const [page, setPage] = useState("agenda");
  const [caisseSection, setCaisseSection] = useState("encaissement");
  const [clientsSection, setClientsSection] = useState("gestion");
  const [adminSection, setAdminSection] = useState("prestations");
  const [comptaTab, setComptaTab] = useState("indicateurs");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [appts, setAppts] = useState([]);
  const [txs, setTxs] = useState([]);

  // Agenda state
  const [weekBase, setWeekBase] = useState(todayStr());
  const [agendaView, setAgendaView] = useState("week");
  const [calMonth, setCalMonth] = useState(new Date());

  // Caisse state
  const [cart, setCart] = useState([]);
  const [cartClient, setCartClient] = useState("");
  const [cartDisc, setCartDisc] = useState("");
  const [cartTip, setCartTip] = useState("");
  const [cartPay, setCartPay] = useState("card");
  const [cartNote, setCartNote] = useState("");
  const [histFilter, setHistFilter] = useState("all");
  const [histDate, setHistDate] = useState("");
  const [expTx, setExpTx] = useState(null);

  // Clients state
  const [clSearch, setClSearch] = useState("");
  const [expCl, setExpCl] = useState(null);

  // Forms
  const emptyRdv = {clientId:"",serviceId:"",date:todayStr(),time:"",status:"confirmed",notes:""};
  const [rdvF, setRdvF] = useState(emptyRdv);
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

  const notify=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  const gC=id=>clients.find(c=>c.id===id);
  const gS=id=>services.find(s=>s.id===id);
  const gP=id=>products.find(p=>p.id===id);
  const gI=i=>i.type==="service"?gS(i.id):gP(i.id);
  const rdvAt=(date,time)=>appts.find(a=>a.date===date&&a.time===time);
  const pm=t=>t.payment_method||"card";

  const sub=useMemo(()=>cart.reduce((s,i)=>s+(Number(gI(i)?.price)||0)*i.qty,0),[cart,services,products]);
  const disc=Number(cartDisc)||0,tip=Number(cartTip)||0;
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
    await load();setModal(null);setRdvF(emptyRdv);notify("Rendez-vous ajouté ✓");
  };

  const updRdv=async(id,b)=>{await db.patch("appointments",id,b);await load();setModal(null);notify("Mis à jour ✓");};
  const delRdv=async id=>{await db.del("appointments",id);await load();setModal(null);notify("Supprimé");};

  const saveCl=async()=>{
    if(!clF.name)return notify("Nom requis","err");
    setSaving(true);
    const r=await db.post("clients",{name:clF.name,phone:clF.phone||null,email:clF.email||null,notes:clF.notes||null,visits:0,loyalty:0});
    setSaving(false);
    if(r?.code)return notify(r.message||"Erreur","err");
    await load();setModal(null);setClF({name:"",phone:"",email:"",notes:""});notify("Client créé ✓");
  };

  const saveSvc=async()=>{
    if(!svcF.name||!svcF.price)return notify("Nom et prix requis","err");
    setSaving(true);
    await db.post("services",{name:svcF.name,duration:Number(svcF.duration)||45,price:Number(svcF.price),category:svcF.category,active:true});
    setSaving(false);await load();setModal(null);setSvcF({name:"",duration:"45",price:"",category:"Coupe"});notify("Prestation ajoutée ✓");
  };

  const savePrd=async()=>{
    if(!prdF.name||!prdF.price)return notify("Nom et prix requis","err");
    setSaving(true);
    await db.post("products",{name:prdF.name,price:Number(prdF.price),stock:Number(prdF.stock)||0,category:prdF.category,active:true});
    setSaving(false);await load();setModal(null);setPrdF({name:"",price:"",stock:"",category:"Finition"});notify("Produit ajouté ✓");
  };

  const encaisser=async()=>{
    if(!cart.length)return;setSaving(true);
    const r=await db.post("transactions",{client_id:cartClient||null,date:todayStr(),items:cart,subtotal:sub,discount:disc,tip,total,payment_method:cartPay,status:"paid",notes:cartNote||null});
    if(r?.code){setSaving(false);return notify(r.message||"Erreur","err");}
    if(cartClient){const cl=gC(cartClient);if(cl)await db.patch("clients",cartClient,{visits:(cl.visits||0)+1,loyalty:(cl.loyalty||0)+Math.floor(total),last_visit:todayStr()});}
    await load();setSaving(false);
    setCart([]);setCartClient("");setCartDisc("");setCartTip("");setCartPay("card");setCartNote("");
    notify("Paiement encaissé ✓");
  };

  const today=todayStr();
  const weekDays=getDaysOfWeek(weekBase);
  const todayTxs=txs.filter(t=>t.date===today);
  const todayRev=todayTxs.reduce((s,t)=>s+Number(t.total||0),0);
  const cm=new Date().getMonth()+1,cy=new Date().getFullYear();
  const mTxs=txs.filter(t=>{const[y,m]=t.date.split("-");return+y===cy&&+m===cm;});
  const mRev=mTxs.reduce((s,t)=>s+Number(t.total||0),0);
  const cancelledAppts=appts.filter(a=>a.status==="cancelled");
  const pendingAppts=appts.filter(a=>a.status==="pending");
  const lowStock=products.filter(p=>p.stock<=5);

  const filtTxs=useMemo(()=>{
    let r=[...txs];
    if(histFilter!=="all")r=r.filter(t=>pm(t)===histFilter);
    if(histDate)r=r.filter(t=>t.date===histDate);
    return r;
  },[txs,histFilter,histDate]);

  const svcTop=services.map(s=>{
    const items=txs.flatMap(t=>t.items||[]).filter(i=>i.type==="service"&&i.id===s.id);
    return{...s,count:items.reduce((sm,i)=>sm+i.qty,0),rev:items.reduce((sm,i)=>sm+(Number(s.price)||0)*i.qty,0)};
  }).sort((a,b)=>b.rev-a.rev);

  const filtCl=useMemo(()=>clients.filter(c=>
    c.name.toLowerCase().includes(clSearch.toLowerCase())||(c.phone||"").includes(clSearch)
  ),[clients,clSearch]);

  // ── Mini calendar helpers ──
  const calYear=calMonth.getFullYear(),calMon=calMonth.getMonth();
  const firstDay=(new Date(calYear,calMon,1).getDay()||7)-1;
  const daysInMonth=new Date(calYear,calMon+1,0).getDate();

  const rdvColor=(rdv)=>{
    if(rdv.status==="cancelled") return {bg:"#f8d7da",border:"#f5c6cb",text:"#721c24"};
    if(rdv.status==="pending") return {bg:"#fff3cd",border:"#ffeaa7",text:"#856404"};
    const svcs={"Coupe":"#4CAF50","Barbe":"#2196F3","Couleur":"#E91E63","Soin":"#9C27B0","Autre":"#FF9800"};
    const cat=gS(rdv.service_id)?.category||"Autre";
    const colors={
      "Coupe":{bg:"#d4edda",border:"#4CAF50",text:"#155724"},
      "Barbe":{bg:"#cce5ff",border:"#2196F3",text:"#004085"},
      "Couleur":{bg:"#f8d7da",border:"#E91E63",text:"#721c24"},
      "Soin":{bg:"#e8d5f5",border:"#9C27B0",text:"#4a0e6e"},
      "Autre":{bg:"#fff3cd",border:"#FF9800",text:"#856404"},
    };
    return colors[cat]||colors["Autre"];
  };

  // ════════════════════════════════════════════════════════
  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'Inter',sans-serif",overflow:"hidden"}}>
      <style>{CSS}</style>

      {/* ── SIDEBAR GAUCHE ── style Planity */}
      <div style={{width:240,background:navyL,borderRight:`1px solid ${border}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
        {/* Logo */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:6,background:gold,display:"flex",alignItems:"center",justifyContent:"center",color:navy,fontWeight:700,fontSize:16}}>E</div>
          <div>
            <div style={{color:white,fontWeight:700,fontSize:15,letterSpacing:"1px"}}>ELNAGAR</div>
            <div style={{color:muted,fontSize:10,letterSpacing:"2px"}}>COIFFURE · TOURS</div>
          </div>
        </div>

        {/* Nav principale - exactement comme Planity */}
        <nav style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {/* AGENDA */}
          <div onClick={()=>{setPage("agenda");}} style={{
            padding:"10px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,
            background:page==="agenda"?`${gold}22`:"transparent",
            borderLeft:page==="agenda"?`3px solid ${gold}`:"3px solid transparent",
            color:page==="agenda"?gold:muted,fontWeight:page==="agenda"?600:400,fontSize:14,
          }}>
            Agenda
          </div>

          {/* CAISSE */}
          <div onClick={()=>setPage("caisse")} style={{
            padding:"10px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,
            background:page==="caisse"?`${gold}22`:"transparent",
            borderLeft:page==="caisse"?`3px solid ${gold}`:"3px solid transparent",
            color:page==="caisse"?gold:muted,fontWeight:page==="caisse"?600:400,fontSize:14,
          }}>
            Caisse
          </div>

          {page==="caisse"&&(
            <div style={{background:navyLL}}>
              {[
                ["encaissement","Encaissement"],
                ["nouveau-ticket","  Nouveau ticket"],
                ["tickets-attente","  Tickets en attente"],
                ["transactions","Transactions"],
                ["paiements-fois","Paiements en plusieurs fois"],
                ["comptable","Données comptables"],
                ["cadeaux","Cartes cadeaux & cures"],
                ["stocks","Gestion des stocks"],
              ].map(([k,l])=>(
                <div key={k} onClick={()=>setCaisseSection(k)} style={{
                  padding:`7px 20px 7px ${l.startsWith(" ")?"32px":"20px"}`,cursor:"pointer",fontSize:13,
                  color:caisseSection===k?gold:muted,
                  background:caisseSection===k?`${gold}15`:"transparent",
                  fontWeight:caisseSection===k?600:400,
                }}>{l.trim()}</div>
              ))}
            </div>
          )}

          {/* CLIENTS */}
          <div onClick={()=>setPage("clients")} style={{
            padding:"10px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,
            background:page==="clients"?`${gold}22`:"transparent",
            borderLeft:page==="clients"?`3px solid ${gold}`:"3px solid transparent",
            color:page==="clients"?gold:muted,fontWeight:page==="clients"?600:400,fontSize:14,
          }}>
            Clients
          </div>

          {page==="clients"&&(
            <div style={{background:navyLL}}>
              {[
                ["gestion","Fichier client"],
                ["stats","Statistiques clients"],
              ].map(([k,l])=>(
                <div key={k} onClick={()=>setClientsSection(k)} style={{
                  padding:"7px 20px 7px 32px",cursor:"pointer",fontSize:13,
                  color:clientsSection===k?gold:muted,
                  background:clientsSection===k?`${gold}15`:"transparent",
                  fontWeight:clientsSection===k?600:400,
                }}>{l}</div>
              ))}
            </div>
          )}

          {/* ADMIN */}
          <div onClick={()=>setPage("admin")} style={{
            padding:"10px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,
            background:page==="admin"?`${gold}22`:"transparent",
            borderLeft:page==="admin"?`3px solid ${gold}`:"3px solid transparent",
            color:page==="admin"?gold:muted,fontWeight:page==="admin"?600:400,fontSize:14,
          }}>
            Admin
          </div>

          {page==="admin"&&(
            <div style={{background:navyLL}}>
              {[
                ["prestations","Gestion des prestations"],
                ["produits","Gestion des produits"],
                ["remises","Gestion des remises"],
                ["fidelite","Gestion de la fidélité"],
                ["stats-rdv","Statistiques RDV"],
                ["taux","Taux d'occupation"],
                ["corbeille","Corbeille RDV"],
              ].map(([k,l])=>(
                <div key={k} onClick={()=>setAdminSection(k)} style={{
                  padding:"7px 20px 7px 28px",cursor:"pointer",fontSize:13,
                  color:adminSection===k?gold:muted,
                  background:adminSection===k?`${gold}15`:"transparent",
                  fontWeight:adminSection===k?600:400,
                }}>{l}</div>
              ))}
            </div>
          )}
        </nav>

        {/* Résumé jour */}
        <div style={{padding:"12px 20px",borderTop:`1px solid ${border}`,background:navy}}>
          <div style={{fontSize:11,color:muted,marginBottom:3}}>{fmt3(today)}</div>
          <div style={{color:white,fontSize:13}}>{appts.filter(a=>a.date===today).length} RDV · <span style={{color:gold}}>{eur(todayRev)}</span></div>
          {lowStock.length>0&&<div style={{color:amber,fontSize:11,marginTop:3}}>⚠ {lowStock.length} stock(s) faible(s)</div>}
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#f5f5f5"}}>

        {/* TOPBAR - style Planity */}
        <div style={{background:"#fff",borderBottom:"1px solid #e0e0e0",padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:24}}>
            {/* Tabs principales - exactement comme Planity */}
            {[["agenda","Agenda"],["caisse","Caisse"],["clients","Clients"],["admin","Admin"]].map(([k,l])=>(
              <button key={k} onClick={()=>setPage(k)} style={{
                background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:500,
                color:page===k?"#333":"#888",
                borderBottom:page===k?`2px solid ${gold}`:"2px solid transparent",
                padding:"0 4px",height:56,transition:"all 0.15s",
              }}>{l}</button>
            ))}
          </div>

          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {page==="agenda"&&(
              <>
                <button className="btn btn-white btn-sm" onClick={()=>setWeekBase(today)}>Aujourd'hui</button>
                <button className="btn btn-white btn-sm" onClick={()=>{const d=new Date(weekBase);d.setDate(d.getDate()-7);setWeekBase(d.toISOString().split("T")[0]);}}>←</button>
                <button className="btn btn-white btn-sm" onClick={()=>{const d=new Date(weekBase);d.setDate(d.getDate()+7);setWeekBase(d.toISOString().split("T")[0]);}}>→</button>
                <span style={{fontSize:13,color:"#666",margin:"0 8px"}}>Vue semaine · Semaine {weekBase}</span>
              </>
            )}
            {loading&&<div className="spin"/>}
            <button className="btn btn-white btn-sm" onClick={load}>↻</button>
            <button className="btn btn-gold" onClick={()=>{setRdvF(emptyRdv);setModal("rdv");}}>+ Nouveau RDV</button>
          </div>
        </div>

        {/* TOAST */}
        {toast&&<div style={{position:"fixed",top:64,right:20,zIndex:9999,background:toast.type==="err"?"#f8d7da":"#d4edda",border:`1px solid ${toast.type==="err"?"#f5c6cb":"#c3e6cb"}`,color:toast.type==="err"?"#721c24":"#155724",padding:"10px 16px",borderRadius:6,fontSize:13,animation:"fadeIn 0.2s",boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>{toast.msg}</div>}

        {/* MAIN SCROLL */}
        <main style={{flex:1,overflowY:"auto"}}>

          {/* ════ AGENDA ════ */}
          {page==="agenda"&&(
            <div style={{display:"flex",height:"100%"}}>

              {/* Mini calendrier gauche - exactement comme Planity */}
              <div style={{width:220,background:"#fff",borderRight:"1px solid #e0e0e0",padding:16,flexShrink:0,overflowY:"auto"}}>
                {/* Navigation mois */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <button onClick={()=>setCalMonth(new Date(calYear,calMon-1,1))} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#666"}}>‹</button>
                  <span style={{fontSize:13,fontWeight:600,color:"#333"}}>{MOIS[calMon]} {calYear}</span>
                  <button onClick={()=>setCalMonth(new Date(calYear,calMon+1,1))} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#666"}}>›</button>
                </div>

                {/* Jours semaine */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",textAlign:"center",marginBottom:4}}>
                  {["L","M","M","J","V","S","D"].map((d,i)=><div key={i} style={{fontSize:10,color:"#999",padding:"2px 0"}}>{d}</div>)}
                </div>

                {/* Jours du mois */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",textAlign:"center",gap:"1px"}}>
                  {Array.from({length:42},(_,i)=>{
                    const day=i-firstDay+1;
                    const inMonth=day>=1&&day<=daysInMonth;
                    const ds=`${calYear}-${String(calMon+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                    const isToday=ds===today;
                    const inWeek=weekDays.includes(ds);
                    const hasRdv=inMonth&&appts.some(a=>a.date===ds);
                    return(
                      <div key={i} onClick={()=>inMonth&&setWeekBase(ds)} style={{
                        fontSize:11,padding:"4px 2px",borderRadius:3,cursor:inMonth?"pointer":"default",
                        background:isToday?gold:inWeek&&inMonth?"#f0f8f0":"transparent",
                        color:isToday?navy:inMonth?"#333":"#ccc",
                        fontWeight:isToday?700:400,position:"relative",
                      }}>
                        {inMonth?day:""}
                        {hasRdv&&!isToday&&<div style={{width:4,height:4,background:gold,borderRadius:"50%",margin:"1px auto 0"}}/>}
                      </div>
                    );
                  })}
                </div>

                <div style={{marginTop:20,fontSize:12,color:"#666",fontWeight:600}}>Mode Plusieurs agendas</div>
                <div style={{marginTop:8,fontSize:12,color:"#666"}}>● Non &nbsp; ○ Oui</div>
                <div style={{marginTop:16,fontSize:12,color:"#666",fontWeight:600}}>Équipe</div>
                <div style={{marginTop:4,fontSize:12,color:gold}}>● Elnagar</div>
              </div>

              {/* Grille agenda - exactement comme Planity */}
              <div style={{flex:1,overflowX:"auto",overflowY:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                  <thead style={{position:"sticky",top:0,zIndex:10,background:"#fff"}}>
                    <tr style={{borderBottom:"2px solid #e0e0e0"}}>
                      <th style={{width:60,padding:"8px 12px",textAlign:"left",fontSize:11,color:"#999",fontWeight:500,borderRight:"1px solid #e0e0e0"}}></th>
                      {weekDays.map((d,i)=>{
                        const isToday=d===today;
                        const cnt=appts.filter(a=>a.date===d).length;
                        return(
                          <th key={d} style={{padding:"8px 6px",textAlign:"center",background:isToday?"#f0f8f0":"#fff",borderRight:"1px solid #e0e0e0",minWidth:140}}>
                            <div style={{fontSize:12,color:isToday?green:"#999",fontWeight:500,textTransform:"uppercase"}}>{JOURS[i]} {fmt2(d)}</div>
                            {cnt>0&&<div style={{fontSize:10,color:"#999"}}>{cnt} RDV</div>}
                            {isToday&&<div style={{width:6,height:6,background:green,borderRadius:"50%",margin:"2px auto 0"}}/>}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {HOURS.map(time=>(
                      <tr key={time} style={{borderBottom:"1px solid #f0f0f0"}}>
                        <td style={{padding:"4px 12px",fontSize:11,color:"#bbb",borderRight:"1px solid #e0e0e0",verticalAlign:"top",whiteSpace:"nowrap"}}>{time}</td>
                        {weekDays.map(date=>{
                          const rdv=rdvAt(date,time);
                          const cl=rdv?gC(rdv.client_id):null;
                          const sv=rdv?gS(rdv.service_id):null;
                          const isToday=date===today;
                          const col=rdv?rdvColor(rdv):{};
                          return(
                            <td key={date} onClick={()=>rdv?setModal({type:"viewRdv",rdv}):setModal({type:"rdvSlot",date,time})}
                              style={{padding:"2px 4px",verticalAlign:"top",cursor:"pointer",borderRight:"1px solid #e0e0e0",background:isToday?"#fafff8":"#fff",minHeight:40}}>
                              {rdv&&sv?(
                                <div style={{background:col.bg,border:`1px solid ${col.border}`,borderLeft:`3px solid ${col.border}`,borderRadius:3,padding:"3px 6px",margin:"1px 0",transition:"opacity 0.1s"}}
                                  onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
                                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                                  <div style={{fontSize:11,fontWeight:600,color:col.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                    {time} - {rdv.time} {cl?cl.name:"Sans client"}
                                  </div>
                                  <div style={{fontSize:10,color:col.text,opacity:.8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sv.name}</div>
                                </div>
                              ):(
                                <div style={{height:36,borderRadius:2,transition:"background 0.1s"}}
                                  onMouseEnter={e=>e.currentTarget.style.background="#f5f5f5"}
                                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}/>
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
          )}

          {/* ════ CAISSE ════ */}
          {page==="caisse"&&(
            <div style={{padding:0}}>
              {/* Nouveau ticket - exactement comme Planity */}
              {(caisseSection==="encaissement"||caisseSection==="nouveau-ticket")&&(
                <div style={{padding:24}}>
                  {/* Barre client en haut */}
                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:"12px 16px",display:"flex",gap:12,alignItems:"center",marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
                    <span style={{fontSize:18,color:"#bbb"}}>👤</span>
                    <select value={cartClient} onChange={e=>setCartClient(e.target.value)} style={{flex:1,border:"none",outline:"none",fontSize:14,color:cartClient?"#333":"#bbb",background:"transparent"}}>
                      <option value="">Choisir un client</option>
                      {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input placeholder="Téléphone" style={{flex:1,border:"1px solid #e0e0e0",borderRadius:4}} readOnly/>
                    <input placeholder="Email" style={{flex:1,border:"1px solid #e0e0e0",borderRadius:4}} readOnly/>
                  </div>

                  {/* Boutons Prestation / Produit / Remise */}
                  <div style={{display:"flex",gap:10,marginBottom:20}}>
                    <span style={{fontSize:20,color:"#bbb",marginRight:4}}>+</span>
                    {CATS.slice(0,1).map(c=>(
                      <button key="p" className="btn btn-gold" onClick={()=>{}}>Prestation</button>
                    ))}
                    <button className="btn btn-gold">Produit</button>
                    <button className="btn btn-gold">Montant libre</button>
                    <button className="btn btn-gold">Remise</button>
                  </div>

                  {/* Layout 2 colonnes : catalogue + ticket */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:20}}>

                    {/* Catalogue */}
                    <div>
                      {CATS.map(cat=>{
                        const svcs=services.filter(s=>s.category===cat);
                        if(!svcs.length)return null;
                        return(
                          <div key={cat} style={{marginBottom:16}}>
                            <div style={{fontSize:11,color:"#999",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8,paddingBottom:6,borderBottom:"1px solid #e0e0e0",fontWeight:600}}>{cat}</div>
                            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                              {svcs.map(s=>(
                                <button key={s.id} onClick={()=>addCart("service",s.id)} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:"10px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.15s",boxShadow:"0 1px 2px rgba(0,0,0,.05)"}}
                                  onMouseEnter={e=>{e.currentTarget.style.borderColor=gold;e.currentTarget.style.boxShadow=`0 2px 6px ${gold}33`;}}
                                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#e0e0e0";e.currentTarget.style.boxShadow="0 1px 2px rgba(0,0,0,.05)";}}>
                                  <div style={{fontSize:13,color:"#333",marginBottom:4,fontWeight:500}}>{s.name}</div>
                                  <div style={{display:"flex",justifyContent:"space-between"}}>
                                    <span style={{fontSize:12,color:gold,fontWeight:600}}>{Number(s.price)===0?"Offert":eur(s.price)}</span>
                                    <span style={{fontSize:11,color:"#bbb"}}>{s.duration}min</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {products.length>0&&(
                        <div style={{marginBottom:16}}>
                          <div style={{fontSize:11,color:"#999",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8,paddingBottom:6,borderBottom:"1px solid #e0e0e0",fontWeight:600}}>Produits</div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                            {products.map(p=>(
                              <button key={p.id} onClick={()=>addCart("product",p.id)} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:"10px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.15s",boxShadow:"0 1px 2px rgba(0,0,0,.05)"}}
                                onMouseEnter={e=>{e.currentTarget.style.borderColor=gold;}}
                                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e0e0e0";}}>
                                <div style={{fontSize:13,color:"#333",marginBottom:4,fontWeight:500}}>{p.name}</div>
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                  <span style={{fontSize:12,color:gold,fontWeight:600}}>{eur(p.price)}</span>
                                  <span style={{fontSize:11,color:p.stock<=5?amber:"#bbb"}}>Stock:{p.stock}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ticket */}
                    <div style={{position:"sticky",top:20,alignSelf:"start"}}>
                      <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,boxShadow:"0 2px 8px rgba(0,0,0,.08)"}}>
                        <div style={{padding:"12px 16px",borderBottom:"1px solid #e0e0e0",background:"#f8f8f8",borderRadius:"6px 6px 0 0"}}>
                          <div style={{fontSize:14,fontWeight:600,color:"#333"}}>Ticket</div>
                        </div>
                        <div style={{padding:16}}>
                          <div style={{minHeight:60,marginBottom:12}}>
                            {cart.length===0?(
                              <div style={{textAlign:"center",color:"#bbb",fontSize:13,padding:"20px 0"}}>Ajouter une prestation ou un produit</div>
                            ):cart.map(item=>{
                              const f=gI(item);if(!f)return null;
                              return(
                                <div key={`${item.type}-${item.id}`} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}>
                                  <div style={{flex:1}}>
                                    <div style={{fontSize:13,color:"#333",fontWeight:500}}>{f.name}</div>
                                    <div style={{fontSize:11,color:"#bbb"}}>{item.type==="service"?"Prestation":"Produit"}</div>
                                  </div>
                                  <button onClick={()=>setCart(p=>p.map(i=>i.type===item.type&&i.id===item.id?{...i,qty:Math.max(1,i.qty-1)}:i))} style={{border:"1px solid #e0e0e0",background:"#fff",width:22,height:22,borderRadius:3,cursor:"pointer",fontSize:13}}>−</button>
                                  <span style={{fontSize:13,minWidth:16,textAlign:"center"}}>{item.qty}</span>
                                  <button onClick={()=>setCart(p=>p.map(i=>i.type===item.type&&i.id===item.id?{...i,qty:i.qty+1}:i))} style={{border:"1px solid #e0e0e0",background:"#fff",width:22,height:22,borderRadius:3,cursor:"pointer",fontSize:13}}>+</button>
                                  <span style={{fontSize:13,color:"#333",minWidth:55,textAlign:"right",fontWeight:500}}>{eur(Number(f.price)*item.qty)}</span>
                                  <button onClick={()=>setCart(p=>p.filter(i=>!(i.type===item.type&&i.id===item.id)))} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:14}}>✕</button>
                                </div>
                              );
                            })}
                          </div>

                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                            <div><label style={{fontSize:11,color:"#999",display:"block",marginBottom:4}}>Remise (€)</label><input type="number" min="0" placeholder="0" value={cartDisc} onChange={e=>setCartDisc(e.target.value)}/></div>
                            <div><label style={{fontSize:11,color:"#999",display:"block",marginBottom:4}}>Pourboire (€)</label><input type="number" min="0" placeholder="0" value={cartTip} onChange={e=>setCartTip(e.target.value)}/></div>
                          </div>

                          <div style={{borderTop:"1px solid #e0e0e0",paddingTop:12,marginBottom:14}}>
                            {disc>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#666",marginBottom:4}}><span>Remise</span><span>−{eur(disc)}</span></div>}
                            {tip>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#666",marginBottom:4}}><span>Pourboire</span><span>+{eur(tip)}</span></div>}
                          </div>

                          <div style={{marginBottom:14}}>
                            <label style={{fontSize:11,color:"#999",display:"block",marginBottom:6}}>Mode de paiement</label>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                              {[["card","💳 Carte"],["cash","💶 Espèces"],["transfer","📲 Virement"]].map(([k,l])=>(
                                <button key={k} onClick={()=>setCartPay(k)} style={{padding:"8px 4px",border:`2px solid ${cartPay===k?gold:"#e0e0e0"}`,background:cartPay===k?`${gold}15`:"#fff",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:cartPay===k?600:400,color:cartPay===k?gold:"#666"}}>
                                  {l}
                                </button>
                              ))}
                            </div>
                          </div>

                          {cart.length>0&&<button onClick={()=>{setCart([]);setCartClient("");setCartDisc("");setCartTip("");}} style={{width:"100%",marginBottom:8,background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:12,textDecoration:"underline"}}>Vider le ticket</button>}
                        </div>

                        {/* Bouton Paiement - exactement comme Planity */}
                        <div style={{padding:"12px 16px",borderTop:"1px solid #e0e0e0"}}>
                          <button className="btn btn-gold" onClick={encaisser} disabled={!cart.length||saving} style={{width:"100%",padding:"14px",fontSize:14,fontWeight:600,borderRadius:6}}>
                            {saving?<><div className="spin"/>Enregistrement…</>:`Paiement ${eur(total)}`}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TRANSACTIONS */}
              {caisseSection==="transactions"&&(
                <div style={{padding:24}}>
                  <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
                    <h2 style={{fontSize:18,fontWeight:600,color:"#333",flex:1}}>Transactions</h2>
                    <div style={{display:"flex",gap:6}}>
                      {[["all","Tous"],["card","Carte"],["cash","Espèces"],["transfer","Virement"]].map(([k,l])=>(
                        <button key={k} onClick={()=>setHistFilter(k)} className="btn btn-white btn-sm" style={{borderColor:histFilter===k?gold:"#ddd",color:histFilter===k?gold:"#666",fontWeight:histFilter===k?600:400}}>{l}</button>
                      ))}
                      <input type="date" value={histDate} onChange={e=>setHistDate(e.target.value)} style={{width:"auto",padding:"5px 10px",fontSize:12}}/>
                      {histDate&&<button onClick={()=>setHistDate("")} className="btn btn-white btn-sm">✕</button>}
                    </div>
                  </div>
                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead>
                        <tr style={{background:"#f8f8f8",borderBottom:"2px solid #e0e0e0"}}>
                          {["Date","Client","Prestations","Mode","Remise","Pourboire","Total"].map(h=>(
                            <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:12,color:"#666",fontWeight:600,letterSpacing:".5px"}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtTxs.slice(0,50).map(tx=>{
                          const cl=gC(tx.client_id);
                          return(
                            <tr key={tx.id} className="tr-hover" style={{borderBottom:"1px solid #f0f0f0",cursor:"pointer"}} onClick={()=>setExpTx(expTx===tx.id?null:tx.id)}>
                              <td style={{padding:"9px 14px",fontSize:13,color:"#666"}}>{fmt3(tx.date)}</td>
                              <td style={{padding:"9px 14px",fontSize:13,fontWeight:500}}>{cl?cl.name:"Anonyme"}</td>
                              <td style={{padding:"9px 14px",fontSize:12,color:"#666",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(tx.items||[]).map(i=>gI(i)?.name).filter(Boolean).join(", ")}</td>
                              <td style={{padding:"9px 14px",fontSize:13}}>{pm(tx)==="card"?"💳":pm(tx)==="cash"?"💶":"📲"}</td>
                              <td style={{padding:"9px 14px",fontSize:13,color:Number(tx.discount)>0?amber:"#ccc"}}>{Number(tx.discount)>0?`−${eur(tx.discount)}`:"—"}</td>
                              <td style={{padding:"9px 14px",fontSize:13,color:Number(tx.tip)>0?green:"#ccc"}}>{Number(tx.tip)>0?`+${eur(tx.tip)}`:"—"}</td>
                              <td style={{padding:"9px 14px",fontSize:14,fontWeight:600,color:gold}}>{eur(tx.total)}</td>
                            </tr>
                          );
                        })}
                        {filtTxs.length===0&&<tr><td colSpan={7} style={{padding:40,textAlign:"center",color:"#bbb"}}>Aucune transaction</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DONNÉES COMPTABLES */}
              {caisseSection==="comptable"&&(
                <div style={{padding:24}}>
                  {/* Onglets comme Planity */}
                  <div style={{display:"flex",gap:0,borderBottom:"2px solid #e0e0e0",marginBottom:24}}>
                    {[["indicateurs","Indicateurs clés"],["chiffre","Chiffre d'affaires"],["prestations","Prestations"],["reglements","Règlements"]].map(([k,l])=>(
                      <button key={k} onClick={()=>setComptaTab(k)} style={{padding:"10px 18px",background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:500,color:comptaTab===k?gold:"#666",borderBottom:comptaTab===k?`2px solid ${gold}`:"2px solid transparent",marginBottom:-2}}>{l}</button>
                    ))}
                  </div>

                  {comptaTab==="indicateurs"&&(
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
                        {[
                          {l:"Chiffre d'affaires TTC",v:eur(mRev)},
                          {l:"TVA du chiffre d'affaires",v:eur(mRev*0.2/1.2)},
                          {l:"Chiffre d'affaires HT",v:eur(mRev/1.2)},
                          {l:"Panier moyen",v:eur(mTxs.length?mRev/mTxs.length:0)},
                        ].map(({l,v})=>(
                          <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:"16px 20px",boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
                            <div style={{fontSize:12,color:"#666",marginBottom:8}}>{l}</div>
                            <div style={{fontSize:26,fontWeight:600,color:gold}}>{v}</div>
                          </div>
                        ))}
                      </div>
                      {/* Graphique simple */}
                      <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
                        <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:16}}>Évolution du CA — {MOIS[cm-1]} {cy}</div>
                        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:120}}>
                          {Array.from({length:new Date(cy,cm,0).getDate()},(_,i)=>{
                            const d=`${cy}-${String(cm).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
                            const v=txs.filter(t=>t.date===d).reduce((s,t)=>s+Number(t.total||0),0);
                            const maxV=Math.max(...Array.from({length:new Date(cy,cm,0).getDate()},(_,j)=>{
                              const dd=`${cy}-${String(cm).padStart(2,"0")}-${String(j+1).padStart(2,"0")}`;
                              return txs.filter(t=>t.date===dd).reduce((s,t)=>s+Number(t.total||0),0);
                            }),1);
                            return(
                              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                                <div style={{width:"100%",background:gold,height:`${Math.max((v/maxV)*100,2)}%`,borderRadius:"2px 2px 0 0",opacity:.8}}/>
                                {(i+1)%5===0&&<div style={{fontSize:9,color:"#bbb",marginTop:3}}>{String(i+1).padStart(2,"0")}</div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {comptaTab==="prestations"&&(
                    <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                      <table style={{width:"100%",borderCollapse:"collapse"}}>
                        <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e0e0e0"}}>
                          {["#","Prestation","Nb de fois","CA TTC"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:12,color:"#666",fontWeight:600}}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {svcTop.map((s,i)=>(
                            <tr key={s.id} className="tr-hover" style={{borderBottom:"1px solid #f0f0f0"}}>
                              <td style={{padding:"9px 14px",fontSize:12,color:"#bbb"}}>#{i+1}</td>
                              <td style={{padding:"9px 14px",fontSize:13}}>{s.name}</td>
                              <td style={{padding:"9px 14px",fontSize:13,color:"#666"}}>{s.count}</td>
                              <td style={{padding:"9px 14px",fontSize:14,fontWeight:600,color:gold}}>{eur(s.rev)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {comptaTab==="reglements"&&(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                      <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:20}}>
                        <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Modes de règlement</div>
                        {[["card","💳 Carte bancaire"],["cash","💶 Espèces"],["transfer","📲 Virement"]].map(([k,l])=>{
                          const kt=txs.filter(t=>pm(t)===k);
                          const kr=kt.reduce((s,t)=>s+Number(t.total||0),0);
                          const pct=txs.length?Math.round(kt.length/txs.length*100):0;
                          return(
                            <div key={k} style={{marginBottom:16}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13}}>{l}</span><span style={{fontSize:13,color:gold,fontWeight:600}}>{eur(kr)}</span></div>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#bbb"}}>{kt.length} transactions</span><span style={{fontSize:11,color:"#bbb"}}>{pct}%</span></div>
                              <div style={{height:6,background:"#f0f0f0",borderRadius:3}}><div style={{height:"100%",width:`${pct}%`,background:gold,borderRadius:3}}/></div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:20}}>
                        <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Synthèse</div>
                        {[
                          {l:"Total TTC",v:eur(txs.reduce((s,t)=>s+Number(t.total||0),0))},
                          {l:"Total HT",v:eur(txs.reduce((s,t)=>s+Number(t.total||0),0)/1.2)},
                          {l:"Total TVA",v:eur(txs.reduce((s,t)=>s+Number(t.total||0),0)*0.2/1.2)},
                          {l:"Pourboires",v:eur(txs.reduce((s,t)=>s+Number(t.tip||0),0))},
                          {l:"Remises",v:eur(txs.reduce((s,t)=>s+Number(t.discount||0),0))},
                          {l:"Ticket moyen",v:eur(txs.length?txs.reduce((s,t)=>s+Number(t.total||0),0)/txs.length:0)},
                        ].map(({l,v})=>(
                          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f0f0f0"}}>
                            <span style={{fontSize:13,color:"#666"}}>{l}</span>
                            <span style={{fontSize:14,fontWeight:600,color:gold}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STOCKS */}
              {caisseSection==="stocks"&&(
                <div style={{padding:24}}>
                  {/* Valorisation comme Planity */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,borderBottom:"2px solid #e0e0e0",marginBottom:24,background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                    {[
                      {l:"VALORISATION TOTALE",v:eur(products.reduce((s,p)=>s+Number(p.price||0)*Number(p.stock||0),0))},
                      {l:"STOCK FAIBLE",v:lowStock.length+" produits",c:amber},
                      {l:"NB RÉFÉRENCES",v:products.length},
                      {l:"CA PRODUITS",v:eur(txs.flatMap(t=>t.items||[]).filter(i=>i.type==="product").reduce((s,i)=>s+(Number(gP(i.id)?.price)||0)*i.qty,0))},
                    ].map(({l,v,c},i)=>(
                      <div key={l} style={{padding:"16px 20px",borderRight:i<3?"1px solid #e0e0e0":"none"}}>
                        <div style={{fontSize:10,color:"#999",letterSpacing:"1px",fontWeight:600,marginBottom:6}}>{l}</div>
                        <div style={{fontSize:20,fontWeight:600,color:c||gold}}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div/>
                    <button className="btn btn-gold btn-sm" onClick={()=>{setPrdF({name:"",price:"",stock:"",category:"Finition"});setModal("product");}}>+ Ajouter un produit</button>
                  </div>

                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e0e0e0"}}>
                        {["Produit","Catégorie","Prix unitaire","Stock","Valorisation","Vendu","Actions"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:12,color:"#666",fontWeight:600}}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {products.map(p=>{
                          const sold=txs.flatMap(t=>t.items||[]).filter(i=>i.type==="product"&&i.id===p.id).reduce((s,i)=>s+i.qty,0);
                          return(
                            <tr key={p.id} className="tr-hover" style={{borderBottom:"1px solid #f0f0f0"}}>
                              <td style={{padding:"9px 14px",fontSize:13,fontWeight:500}}>{p.name}</td>
                              <td style={{padding:"9px 14px",fontSize:12,color:"#666"}}>{p.category}</td>
                              <td style={{padding:"9px 14px",fontSize:13,fontWeight:600,color:gold}}>{eur(p.price)}</td>
                              <td style={{padding:"9px 14px"}}>
                                <span style={{fontSize:13,fontWeight:600,color:p.stock<=2?red:p.stock<=5?amber:green}}>{p.stock}</span>
                                <span style={{fontSize:11,color:"#bbb"}}> unités</span>
                              </td>
                              <td style={{padding:"9px 14px",fontSize:13,color:"#666"}}>{eur(Number(p.price)*Number(p.stock))}</td>
                              <td style={{padding:"9px 14px",fontSize:13,color:"#666"}}>{sold}</td>
                              <td style={{padding:"9px 14px"}}>
                                <div style={{display:"flex",gap:4}}>
                                  <button className="btn btn-white btn-xs" onClick={()=>db.patch("products",p.id,{stock:(p.stock||0)+1}).then(load)}>+</button>
                                  <span style={{padding:"0 4px",fontSize:12,alignSelf:"center",fontWeight:600}}>{p.stock}</span>
                                  <button className="btn btn-white btn-xs" onClick={()=>db.patch("products",p.id,{stock:Math.max(0,(p.stock||0)-1)}).then(load)}>-</button>
                                  <button className="btn btn-link btn-xs" onClick={()=>{const n=prompt(`Stock (actuel: ${p.stock}):`);if(n!==null&&!isNaN(n))db.patch("products",p.id,{stock:Number(n)}).then(load);}}>Historique</button>
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
            </div>
          )}

          {/* ════ CLIENTS ════ */}
          {page==="clients"&&(
            <div style={{padding:24}}>
              {clientsSection==="gestion"&&(
                <>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                    <input placeholder="Chercher un client par nom ou téléphone" value={clSearch} onChange={e=>setClSearch(e.target.value)} style={{maxWidth:400}}/>
                    <button className="btn btn-gold" onClick={()=>{setClF({name:"",phone:"",email:"",notes:""});setModal("client");}}>Créer</button>
                    <span style={{marginLeft:"auto",fontSize:13,color:"#666"}}>Nbre de clients : {clients.length}</span>
                  </div>

                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                    {filtCl.map((cl,i)=>{
                      const cTxs=txs.filter(t=>t.client_id===cl.id);
                      const spent=cTxs.reduce((s,t)=>s+Number(t.total||0),0);
                      const exp=expCl===cl.id;
                      return(
                        <div key={cl.id} style={{borderBottom:"1px solid #f0f0f0",background:exp?"#fafaf8":"#fff"}}>
                          <div style={{display:"flex",alignItems:"center",padding:"11px 16px",cursor:"pointer"}} onClick={()=>setExpCl(exp?null:cl.id)}>
                            <div style={{flex:1}}>
                              <span style={{fontSize:14,fontWeight:600,color:"#333",marginRight:12}}>{cl.name}</span>
                              {cl.phone&&<span style={{fontSize:12,color:"#666",marginRight:8}}>{cl.phone}</span>}
                              {cl.email&&<span style={{fontSize:12,color:"#999"}}>- {cl.email}</span>}
                            </div>
                            <div style={{display:"flex",gap:20,alignItems:"center",marginRight:16}}>
                              <div style={{textAlign:"center"}}>
                                <div style={{fontSize:10,color:"#bbb",textTransform:"uppercase",letterSpacing:"1px"}}>Visites</div>
                                <div style={{fontSize:16,fontWeight:600,color:gold}}>{cl.visits||0}</div>
                              </div>
                              <div style={{textAlign:"center"}}>
                                <div style={{fontSize:10,color:"#bbb",textTransform:"uppercase",letterSpacing:"1px"}}>CA</div>
                                <div style={{fontSize:16,fontWeight:600,color:gold}}>{eur(spent)}</div>
                              </div>
                            </div>
                            <button className="btn btn-link btn-sm" onClick={e=>{e.stopPropagation();}}>Modifier</button>
                            <button className="btn btn-danger btn-sm" onClick={e=>{e.stopPropagation();}}>Supprimer</button>
                          </div>
                          {exp&&(
                            <div style={{padding:"0 16px 14px",background:"#fafaf8",borderTop:"1px solid #f0f0f0",animation:"fadeIn 0.2s"}}>
                              {cl.notes&&<div style={{marginBottom:10,padding:"6px 10px",background:"#fff3cd",border:"1px solid #ffeaa7",borderRadius:4,fontSize:12,color:"#856404"}}>📋 {cl.notes}</div>}
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                                <div>
                                  <div style={{fontSize:11,color:"#bbb",fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Dernières transactions</div>
                                  {cTxs.slice(0,4).map(tx=>(
                                    <div key={tx.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#666",padding:"4px 0",borderBottom:"1px solid #f0f0f0"}}>
                                      <span>{fmt3(tx.date)}</span>
                                      <span style={{flex:1,margin:"0 10px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(tx.items||[]).map(i=>gI(i)?.name).filter(Boolean).join(", ")}</span>
                                      <span style={{color:gold,fontWeight:600}}>{eur(tx.total)}</span>
                                    </div>
                                  ))}
                                  {cTxs.length===0&&<div style={{fontSize:12,color:"#bbb"}}>Aucune transaction</div>}
                                </div>
                                <div>
                                  <div style={{fontSize:11,color:"#bbb",fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Prochain RDV</div>
                                  {appts.filter(a=>a.client_id===cl.id&&a.date>=today).slice(0,2).map(a=>{
                                    const sv=gS(a.service_id);
                                    return(<div key={a.id} style={{fontSize:12,color:"#666",padding:"4px 0",borderBottom:"1px solid #f0f0f0"}}>📅 {fmt3(a.date)} à {a.time} · {sv?.name||"—"}</div>);
                                  })}
                                  {!appts.find(a=>a.client_id===cl.id&&a.date>=today)&&<div style={{fontSize:12,color:"#bbb"}}>Aucun RDV</div>}
                                  <button className="btn btn-gold btn-sm" style={{marginTop:8}} onClick={e=>{e.stopPropagation();setRdvF({...emptyRdv,clientId:cl.id});setModal("rdv");}}>+ Prendre RDV</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {filtCl.length===0&&<div style={{padding:40,textAlign:"center",color:"#bbb"}}>Aucun client</div>}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ════ ADMIN ════ */}
          {page==="admin"&&(
            <div style={{padding:24}}>

              {/* PRESTATIONS */}
              {adminSection==="prestations"&&(
                <div>
                  <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
                    <button className="btn btn-link" onClick={()=>{setSvcF({name:"",duration:"45",price:"",category:"Coupe"});setModal("service");}}>⊕ Ajouter une catégorie de prestations</button>
                    <button className="btn btn-link">☰ Ordonner les catégories</button>
                    <button className="btn btn-link">€ Éditer les prix en masse</button>
                  </div>
                  {CATS.map(cat=>{
                    const svcs=services.filter(s=>s.category===cat);
                    if(!svcs.length)return null;
                    return(
                      <div key={cat} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,marginBottom:16,overflow:"hidden"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",background:"#f8f8f8",borderBottom:"1px solid #e0e0e0"}}>
                          <span style={{fontSize:14,fontWeight:600,color:"#333"}}>{cat}</span>
                          <div style={{display:"flex",gap:12}}>
                            <button className="btn btn-link btn-sm" onClick={()=>{setSvcF({name:"",duration:"45",price:"",category:cat});setModal("service");}}>Ajouter une prestation</button>
                            <button className="btn btn-link btn-sm">Ordonner les prestations</button>
                            <button className="btn btn-link btn-sm">Dupliquer</button>
                            <button className="btn btn-link btn-sm">Modifier</button>
                            <button className="btn btn-danger btn-sm">Supprimer</button>
                          </div>
                        </div>
                        <table style={{width:"100%",borderCollapse:"collapse"}}>
                          <thead><tr style={{borderBottom:"1px solid #f0f0f0"}}>
                            {["Prestation","Durée","Prix","Actions"].map(h=><th key={h} style={{padding:"8px 16px",textAlign:"left",fontSize:12,color:"#999",fontWeight:500}}>{h}</th>)}
                          </tr></thead>
                          <tbody>
                            {svcs.map(s=>(
                              <tr key={s.id} className="tr-hover" style={{borderBottom:"1px solid #f0f0f0"}}>
                                <td style={{padding:"9px 16px",fontSize:13}}>{s.name} <span style={{fontSize:12,color:"#bbb"}}>{s.duration}min - {eur(s.price)}</span></td>
                                <td style={{padding:"9px 16px",fontSize:12,color:"#666"}}>{s.duration} min</td>
                                <td style={{padding:"9px 16px",fontSize:13,fontWeight:600,color:gold}}>{eur(s.price)}</td>
                                <td style={{padding:"9px 16px"}}>
                                  <div style={{display:"flex",gap:12}}>
                                    <button className="btn btn-link btn-sm">Dupliquer</button>
                                    <button className="btn btn-link btn-sm">Modifier</button>
                                    <button className="btn btn-danger btn-sm" onClick={()=>db.patch("services",s.id,{active:false}).then(load)}>Supprimer</button>
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

              {/* TAUX D'OCCUPATION */}
              {adminSection==="taux"&&(
                <div>
                  <div style={{fontSize:13,color:"#666",marginBottom:20}}>Moyenne des taux d'occupation par jour de la semaine et par tranche horaire.</div>
                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e0e0e0"}}>
                        <th style={{padding:"10px 14px",fontSize:12,color:"#666",fontWeight:600,textAlign:"left"}}>Horaire</th>
                        {JOURS.map(j=><th key={j} style={{padding:"10px 14px",fontSize:12,color:"#666",fontWeight:600,textAlign:"center"}}>{j.toUpperCase()}</th>)}
                      </tr></thead>
                      <tbody>
                        {["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map(slot=>(
                          <tr key={slot} style={{borderBottom:"1px solid #f0f0f0"}}>
                            <td style={{padding:"8px 14px",fontSize:12,color:"#666"}}>{slot} - {String(parseInt(slot)+1).padStart(2,"0")}:00</td>
                            {[1,2,3,4,5,6].map(dayIdx=>{
                              const cnt=appts.filter(a=>{const d=new Date(a.date);return d.getDay()===dayIdx&&a.time.startsWith(slot.split(":")[0]);}).length;
                              const total=appts.filter(a=>{const d=new Date(a.date);return d.getDay()===dayIdx;}).length||1;
                              const pct=Math.min(Math.round((cnt/total)*100*8),100);
                              const bg=pct>80?"#1e7e34":pct>50?"#28a745":pct>20?"#5cb85c":"#f8f8f8";
                              const color=pct>20?"#fff":"#bbb";
                              return(
                                <td key={dayIdx} style={{padding:"4px 6px",textAlign:"center"}}>
                                  <div style={{background:bg,color,borderRadius:4,padding:"6px 4px",fontSize:12,fontWeight:pct>20?600:400}}>{pct}%</div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CORBEILLE RDV */}
              {adminSection==="corbeille"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <h3 style={{fontSize:16,fontWeight:600,color:"#333"}}>Rendez-vous annulés dans les 30 derniers jours</h3>
                    <button className="btn btn-white btn-sm">Vider la corbeille</button>
                  </div>
                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e0e0e0"}}>
                        {["RDV avec","Date du RDV","Client(e)","Prestation","Annulation","Actions"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:12,color:"#666",fontWeight:600}}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {cancelledAppts.map(rdv=>{
                          const cl=gC(rdv.client_id),sv=gS(rdv.service_id);
                          return(
                            <tr key={rdv.id} className="tr-hover" style={{borderBottom:"1px solid #f0f0f0"}}>
                              <td style={{padding:"9px 14px",fontSize:13}}>Elnagar</td>
                              <td style={{padding:"9px 14px",fontSize:13,color:"#666"}}>{fmt3(rdv.date)} {rdv.time}</td>
                              <td style={{padding:"9px 14px",fontSize:13,fontWeight:500}}>{cl?cl.name:"—"}</td>
                              <td style={{padding:"9px 14px",fontSize:12,color:"#666"}}>{sv?.name||"—"}</td>
                              <td style={{padding:"9px 14px"}}><span className="tag-cancelled">Annulé</span></td>
                              <td style={{padding:"9px 14px"}}><button className="btn btn-link btn-sm" onClick={()=>updRdv(rdv.id,{status:"confirmed"})}>Restaurer</button></td>
                            </tr>
                          );
                        })}
                        {cancelledAppts.length===0&&<tr><td colSpan={6} style={{padding:40,textAlign:"center",color:"#bbb"}}>Aucun RDV annulé</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* STATS RDV */}
              {adminSection==="stats-rdv"&&(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16,marginBottom:24}}>
                    {[
                      {l:"Nombre de RDV",v:appts.length},
                      {l:"RDV confirmés",v:appts.filter(a=>a.status==="confirmed").length},
                      {l:"En attente",v:pendingAppts.length},
                      {l:"Annulés",v:cancelledAppts.length},
                      {l:"Nouveaux clients",v:clients.filter(c=>(c.visits||0)===1).length},
                    ].map(({l,v})=>(
                      <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:"16px 20px"}}>
                        <div style={{fontSize:12,color:"#666",marginBottom:6}}>{l}</div>
                        <div style={{fontSize:26,fontWeight:600,color:gold}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ════ MODALS ════ */}
      {modal&&(
        <div onClick={e=>e.target===e.currentTarget&&setModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}}>
          <div style={{background:"#fff",borderRadius:8,padding:28,width:"92%",maxWidth:440,animation:"slideUp 0.2s",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>

            {modal?.type==="viewRdv"&&(()=>{
              const r=modal.rdv,cl=gC(r.client_id),sv=gS(r.service_id);
              return(
                <>
                  <div style={{fontSize:18,fontWeight:700,color:"#333",marginBottom:20}}>Rendez-vous</div>
                  {[["Client",cl?.name||"Sans client"],["Prestation",sv?.name||"—"],["Date & heure",`${fmt3(r.date)} à ${r.time}`],["Durée",`${sv?.duration||"—"} min`],["Tarif",eur(sv?.price)]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #f0f0f0"}}>
                      <span style={{fontSize:12,color:"#999",fontWeight:500}}>{l}</span>
                      <span style={{fontSize:13,color:"#333"}}>{v}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #f0f0f0",marginBottom:20}}>
                    <span style={{fontSize:12,color:"#999",fontWeight:500}}>Statut</span>
                    <span className={`tag-${r.status}`}>{r.status==="confirmed"?"Confirmé":r.status==="cancelled"?"Annulé":"En attente"}</span>
                  </div>
                  {r.notes&&<div style={{marginBottom:14,padding:"8px 10px",background:"#fff3cd",border:"1px solid #ffeaa7",borderRadius:4,fontSize:12,color:"#856404"}}>📋 {r.notes}</div>}
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <button className="btn btn-gold btn-sm" onClick={()=>{setModal(null);setPage("caisse");setCaisseSection("encaissement");addCart("service",r.service_id);setCartClient(r.client_id||"");}}>→ Encaisser</button>
                    {r.status!=="confirmed"&&<button className="btn btn-white btn-sm" onClick={()=>updRdv(r.id,{status:"confirmed"})}>✓ Confirmer</button>}
                    {r.status==="confirmed"&&<button className="btn btn-white btn-sm" onClick={()=>updRdv(r.id,{status:"cancelled"})}>Annuler</button>}
                    <button className="btn btn-white btn-sm" onClick={()=>setModal(null)}>Fermer</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>delRdv(r.id)}>Supprimer</button>
                  </div>
                </>
              );
            })()}

            {(modal==="rdv"||modal?.type==="rdvSlot")&&(
              <>
                <div style={{fontSize:18,fontWeight:700,color:"#333",marginBottom:20}}>Nouveau rendez-vous</div>
                <div style={{display:"grid",gap:12,marginBottom:20}}>
                  <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Client</label>
                    <select value={rdvF.clientId} onChange={e=>setRdvF(p=>({...p,clientId:e.target.value}))}>
                      <option value="">Sans client</option>
                      {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Prestation *</label>
                    <select value={rdvF.serviceId} onChange={e=>setRdvF(p=>({...p,serviceId:e.target.value}))}>
                      <option value="">Sélectionner</option>
                      {CATS.map(cat=>(
                        <optgroup key={cat} label={cat}>
                          {services.filter(s=>s.category===cat).map(s=><option key={s.id} value={s.id}>{s.name} — {s.duration}min — {eur(s.price)}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Date *</label>
                      <input type="date" value={rdvF.date||(modal?.date||today)} onChange={e=>setRdvF(p=>({...p,date:e.target.value}))}/>
                    </div>
                    <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Heure *</label>
                      <select value={rdvF.time||(modal?.time||"")} onChange={e=>setRdvF(p=>({...p,time:e.target.value}))}>
                        <option value="">—</option>
                        {HOURS.map(h=><option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Statut</label>
                    <select value={rdvF.status} onChange={e=>setRdvF(p=>({...p,status:e.target.value}))}>
                      <option value="confirmed">Confirmé</option>
                      <option value="pending">En attente</option>
                    </select>
                  </div>
                  <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Notes</label>
                    <textarea rows={2} placeholder="Précisions…" value={rdvF.notes} onChange={e=>setRdvF(p=>({...p,notes:e.target.value}))}/>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-white" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                  <button className="btn btn-gold" onClick={saveRdv} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>Enregistrement…</>:"Confirmer le RDV"}</button>
                </div>
              </>
            )}

            {modal==="client"&&(
              <>
                <div style={{fontSize:18,fontWeight:700,color:"#333",marginBottom:20}}>Nouveau client</div>
                <div style={{display:"grid",gap:12,marginBottom:20}}>
                  {[{l:"Nom complet *",k:"name",t:"text",p:"Prénom Nom"},{l:"Téléphone",k:"phone",t:"tel",p:"06 00 00 00 00"},{l:"Email",k:"email",t:"email",p:"email@exemple.com"}].map(f=>(
                    <div key={f.k}><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>{f.l}</label>
                      <input type={f.t} placeholder={f.p} value={clF[f.k]} onChange={e=>setClF(p=>({...p,[f.k]:e.target.value}))}/>
                    </div>
                  ))}
                  <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Notes</label>
                    <textarea rows={3} placeholder="Allergies, préférences…" value={clF.notes} onChange={e=>setClF(p=>({...p,notes:e.target.value}))}/>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-white" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                  <button className="btn btn-gold" onClick={saveCl} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>Enregistrement…</>:"Créer"}</button>
                </div>
              </>
            )}

            {modal==="service"&&(
              <>
                <div style={{fontSize:18,fontWeight:700,color:"#333",marginBottom:20}}>Nouvelle prestation</div>
                <div style={{display:"grid",gap:12,marginBottom:20}}>
                  <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Nom *</label><input placeholder="Ex: Coupe Homme" value={svcF.name} onChange={e=>setSvcF(p=>({...p,name:e.target.value}))}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Durée (min)</label><input type="number" value={svcF.duration} onChange={e=>setSvcF(p=>({...p,duration:e.target.value}))}/></div>
                    <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Prix (€) *</label><input type="number" value={svcF.price} onChange={e=>setSvcF(p=>({...p,price:e.target.value}))}/></div>
                  </div>
                  <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Catégorie</label>
                    <select value={svcF.category} onChange={e=>setSvcF(p=>({...p,category:e.target.value}))}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-white" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                  <button className="btn btn-gold" onClick={saveSvc} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>…</>:"Ajouter"}</button>
                </div>
              </>
            )}

            {modal==="product"&&(
              <>
                <div style={{fontSize:18,fontWeight:700,color:"#333",marginBottom:20}}>Nouveau produit</div>
                <div style={{display:"grid",gap:12,marginBottom:20}}>
                  <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Nom *</label><input placeholder="Ex: Shampoing Kérastase" value={prdF.name} onChange={e=>setPrdF(p=>({...p,name:e.target.value}))}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Prix (€) *</label><input type="number" value={prdF.price} onChange={e=>setPrdF(p=>({...p,price:e.target.value}))}/></div>
                    <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Stock initial</label><input type="number" value={prdF.stock} onChange={e=>setPrdF(p=>({...p,stock:e.target.value}))}/></div>
                  </div>
                  <div><label style={{fontSize:12,color:"#666",display:"block",marginBottom:4}}>Catégorie</label>
                    <select value={prdF.category} onChange={e=>setPrdF(p=>({...p,category:e.target.value}))}>
                      {["Shampoing","Soin","Finition","Coloration","Autre"].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-white" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                  <button className="btn btn-gold" onClick={savePrd} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>…</>:"Ajouter"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
