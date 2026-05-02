import { useState, useEffect, useMemo, useCallback } from "react";

const SB="https://blqvqhqfsrafpmheuhcx.supabase.co/rest/v1";
const KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscXZxaHFmc3JhZnBtaGV1aGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzM2NDMsImV4cCI6MjA5MzE0OTY0M30.jMeTPqvkyw8zXpiigQBndMVOBIuHtYQ5cqe_TJY7WRk";
const H={"Content-Type":"application/json",apikey:KEY,Authorization:`Bearer ${KEY}`,Prefer:"return=representation"};
const db={
  get:(t,q="")=>fetch(`${SB}/${t}?${q}`,{headers:H}).then(r=>r.json()),
  post:(t,b)=>fetch(`${SB}/${t}`,{method:"POST",headers:H,body:JSON.stringify(b)}).then(r=>r.json()),
  patch:(t,id,b)=>fetch(`${SB}/${t}?id=eq.${id}`,{method:"PATCH",headers:{...H,Prefer:"return=minimal"},body:JSON.stringify(b)}),
  del:(t,id)=>fetch(`${SB}/${t}?id=eq.${id}`,{method:"DELETE",headers:H}),
};

const gold="#c9a84c",navy="#0d1b2a",navyL="#112236",navyLL="#162d44",bord="#1e3354";
const white="#f0ece4",muted="#8a8070",green="#2ecc71",red="#e05050",amber="#f0a030";
// Couleurs agenda bleu marine
const agBg="#0f2035",agBgAlt="#0d1b2a",agLine="#1a3050",agLineAlt="#152840";
const agText="#c8d8e8",agTextMuted="#5a7a9a";

const HOURS=[];
for(let h=8;h<=20;h++){HOURS.push(`${String(h).padStart(2,"0")}:00`);HOURS.push(`${String(h).padStart(2,"0")}:30`);}
const JOURS=["Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const CATS=["Coupe","Barbe","Couleur","Soin","Autre"];

const todayStr=()=>new Date().toISOString().split("T")[0];
const fmt3=ds=>{try{const[y,m,d]=ds.split("-");return`${d}/${m}/${y}`;}catch{return ds;}};
const fmt2=ds=>{try{const[,m,d]=ds.split("-");return`${d}/${m}`;}catch{return ds;}};
const eur=v=>`${Number(v||0).toFixed(2).replace(".",",")} €`;
const getDOW=base=>{
  const d=new Date(base),day=d.getDay(),mon=new Date(d);
  mon.setDate(d.getDate()-(day===0?6:day-1));
  return Array.from({length:6},(_,i)=>{const dd=new Date(mon);dd.setDate(mon.getDate()+i);return dd.toISOString().split("T")[0];});
};
const nowTime=()=>{const n=new Date();return`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;};
const t2m=t=>{const[h,m]=t.split(":");return+h*60+ +m;};
const m2t=m=>`${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;background:${navy};}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:${navyLL};}
::-webkit-scrollbar-thumb{background:${gold}55;border-radius:2px;}
::-webkit-scrollbar-thumb:hover{background:${gold};}
input,select,textarea{background:#fff;border:1px solid #ddd;color:#333;padding:7px 10px;border-radius:4px;font-family:'Inter',sans-serif;font-size:13px;width:100%;outline:none;transition:border-color 0.15s;}
input:focus,select:focus,textarea:focus{border-color:${gold};}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:none;border-radius:4px;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;transition:all 0.15s;white-space:nowrap;}
.bg{background:${gold};color:${navy};padding:8px 18px;}
.bg:hover{opacity:.88;}
.bg:disabled{opacity:.4;cursor:not-allowed;}
.bw{background:#fff;color:#333;border:1px solid #ddd;padding:7px 14px;}
.bw:hover{border-color:#999;}
.bl{background:none;border:none;color:${gold};padding:4px 8px;font-size:13px;cursor:pointer;}
.bd{background:none;border:none;color:${red};padding:4px 8px;font-size:13px;cursor:pointer;}
.bsm{padding:5px 12px!important;font-size:12px!important;}
.bxs{padding:3px 8px!important;font-size:11px!important;}
.t-ok{background:#d4edda;color:#155724;border:1px solid #c3e6cb;border-radius:12px;font-size:11px;padding:2px 8px;}
.t-wait{background:#fff3cd;color:#856404;border:1px solid #ffeaa7;border-radius:12px;font-size:11px;padding:2px 8px;}
.t-no{background:#f8d7da;color:#721c24;border:1px solid #f5c6cb;border-radius:12px;font-size:11px;padding:2px 8px;}
.tr:hover{background:#f8f8f8!important;}
.atr:hover{background:${navyLL}!important;}
.sb{padding:8px 16px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:space-between;transition:background 0.1s;}
.sb:hover{background:rgba(201,168,76,.1);}
.ss{padding:7px 16px 7px 28px;cursor:pointer;font-size:12px;transition:background 0.1s;}
.ss:hover{background:rgba(201,168,76,.08);}
@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{width:14px;height:14px;border:2px solid #ddd;border-top-color:${gold};border-radius:50%;animation:spin .6s linear infinite;flex-shrink:0;}
`;

const rdvCol=(rdv,svcs)=>{
  if(rdv.status==="cancelled")return{bg:"rgba(220,53,69,.25)",br:"#dc3545",tx:"#ff8a95"};
  if(rdv.status==="pending")return{bg:"rgba(240,160,48,.2)",br:"#f0a030",tx:"#ffc87a"};
  const cat=svcs.find(s=>s.id===rdv.service_id)?.category||"Autre";
  const m={
    "Coupe":{bg:"rgba(33,150,243,.25)",br:"#2196F3",tx:"#7ec8fb"},
    "Barbe":{bg:"rgba(40,167,69,.25)",br:"#28a745",tx:"#6fdc8c"},
    "Couleur":{bg:"rgba(233,30,99,.25)",br:"#e91e63",tx:"#ff6ea8"},
    "Soin":{bg:"rgba(156,39,176,.25)",br:"#9c27b0",tx:"#ce7fe0"},
    "Autre":{bg:"rgba(255,152,0,.25)",br:"#ff9800",tx:"#ffbb55"},
  };
  return m[cat]||m["Autre"];
};

export default function App(){
  const [page,setPage]=useState("agenda");
  const [calOpen,setCalOpen]=useState(true); // sidebar calendrier
  const [caisseSection,setCaisseSection]=useState("nouveau-ticket");
  const [adminSub,setAdminSub]=useState("prestations");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [modal,setModal]=useState(null);
  const [toast,setToast]=useState(null);

  const [exp,setExp]=useState({enc:true,trans:false,paie:false,compta:false,cad:false,stocks:false});
  const tog=k=>setExp(p=>({...p,[k]:!p[k]}));

  const [clients,setClients]=useState([]);
  const [services,setServices]=useState([]);
  const [products,setProducts]=useState([]);
  const [appts,setAppts]=useState([]);
  const [txs,setTxs]=useState([]);

  const [weekBase,setWeekBase]=useState(todayStr());
  const [agView,setAgView]=useState("week");
  const [dayView,setDayView]=useState(todayStr());
  const [curTime,setCurTime]=useState(nowTime());
  const [calMonth,setCalMonth]=useState(new Date());
  const [dragS,setDragS]=useState(null);
  const [dragE,setDragE]=useState(null);
  const [dragging,setDragging]=useState(false);

  const [cartItems,setCartItems]=useState([]);
  const [cartCl,setCartCl]=useState(null);
  const [cartClSearch,setCartClSearch]=useState("");
  const [showClDrop,setShowClDrop]=useState(false);
  const [cDisc,setCDisc]=useState("");
  const [cTip,setCTip]=useState("");
  const [cPay,setCPay]=useState("card");
  const [hFilter,setHFilter]=useState("all");
  const [hDate,setHDate]=useState("");
  const [clSearch,setClSearch]=useState("");
  const [expCl,setExpCl]=useState(null);

  const emptyRdv={cid:"",cs:"",showList:false,sid:"",date:todayStr(),st:"",et:"",status:"confirmed",notes:"",newCl:false,ncd:{name:"",phone:"",email:"",birthday:"",address:""}};
  const [rdvF,setRdvF]=useState(emptyRdv);
  const [svcF,setSvcF]=useState({name:"",dur:"45",price:"",cat:"Coupe"});

  const load=useCallback(async()=>{
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
    }catch{notify("Erreur connexion","err");}
    setLoading(false);
  },[]);

  useEffect(()=>{load();},[load]);
  useEffect(()=>{const i=setInterval(()=>setCurTime(nowTime()),30000);return()=>clearInterval(i);},[]);

  const notify=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  const gC=id=>clients.find(c=>c.id===id);
  const gS=id=>services.find(s=>s.id===id);
  const gP=id=>products.find(p=>p.id===id);
  const gI=i=>i.type==="service"?gS(i.id):gP(i.id);
  const pm=t=>t.payment_method||"card";

  const cartSub=useMemo(()=>cartItems.reduce((s,i)=>s+(Number(gI(i)?.price)||0)*i.qty,0),[cartItems,services,products]);
  const disc=Number(cDisc)||0,tip=Number(cTip)||0;
  const cartTotal=Math.max(0,cartSub-disc)+tip;

  const addCart=(type,id)=>setCartItems(p=>{
    const ex=p.find(i=>i.type===type&&i.id===id);
    return ex?p.map(i=>i.type===type&&i.id===id?{...i,qty:i.qty+1}:i):[...p,{type,id,qty:1}];
  });

  const encaisser=async()=>{
    if(!cartItems.length)return;setSaving(true);
    const cid=cartCl?.id||null;
    const r=await db.post("transactions",{client_id:cid,date:todayStr(),items:cartItems,subtotal:cartSub,discount:disc,tip,total:cartTotal,payment_method:cPay,status:"paid"});
    if(r?.code){setSaving(false);return notify(r.message||"Erreur","err");}
    if(cid){const cl=gC(cid);if(cl)await db.patch("clients",cid,{visits:(cl.visits||0)+1,loyalty:(cl.loyalty||0)+Math.floor(cartTotal),last_visit:todayStr()});}
    await load();setSaving(false);
    setCartItems([]);setCartCl(null);setCartClSearch("");setCDisc("");setCTip("");setCPay("card");
    notify("Encaissé ✓");
  };

  const saveRdv=async()=>{
    if(!rdvF.sid||!rdvF.date||!rdvF.st)return notify("Prestation, date et heure requis","err");
    let cid=rdvF.cid;
    if(rdvF.newCl&&rdvF.ncd.name){
      setSaving(true);
      const nc=await db.post("clients",{name:rdvF.ncd.name,phone:rdvF.ncd.phone||null,email:rdvF.ncd.email||null,notes:null,visits:0,loyalty:0});
      if(nc?.id)cid=nc.id;
    }
    setSaving(true);
    const r=await db.post("appointments",{client_id:cid||null,service_id:rdvF.sid,date:rdvF.date,time:rdvF.st,status:rdvF.status,notes:rdvF.notes||null});
    setSaving(false);
    if(r?.code)return notify(r.message||"Erreur","err");
    await load();setModal(null);setRdvF(emptyRdv);notify("RDV ajouté ✓");
  };

  const updRdv=async(id,b)=>{await db.patch("appointments",id,b);await load();setModal(null);notify("Mis à jour ✓");};
  const delRdv=async id=>{await db.del("appointments",id);await load();setModal(null);notify("Supprimé");};

  const today=todayStr();
  const weekDays=getDOW(weekBase);
  const todayRdv=appts.filter(a=>a.date===today);
  const todayRev=txs.filter(t=>t.date===today).reduce((s,t)=>s+Number(t.total||0),0);
  const cm=new Date().getMonth()+1,cy=new Date().getFullYear();
  const mTxs=txs.filter(t=>{const[y,m]=t.date.split("-");return+y===cy&&+m===cm;});
  const mRev=mTxs.reduce((s,t)=>s+Number(t.total||0),0);
  const lowStock=products.filter(p=>p.stock<=5);
  const cancelledAppts=appts.filter(a=>a.status==="cancelled");

  const filtTxs=useMemo(()=>{
    let r=[...txs];
    if(hFilter!=="all")r=r.filter(t=>pm(t)===hFilter);
    if(hDate)r=r.filter(t=>t.date===hDate);
    return r;
  },[txs,hFilter,hDate]);

  const svcTop=services.map(s=>{
    const it=txs.flatMap(t=>t.items||[]).filter(i=>i.type==="service"&&i.id===s.id);
    return{...s,count:it.reduce((sm,i)=>sm+i.qty,0),rev:it.reduce((sm,i)=>sm+(Number(s.price)||0)*i.qty,0)};
  }).sort((a,b)=>b.rev-a.rev);

  const filtCl=useMemo(()=>clients.filter(c=>c.name.toLowerCase().includes(clSearch.toLowerCase())||(c.phone||"").includes(clSearch)),[clients,clSearch]);

  // Mini calendar
  const cy2=calMonth.getFullYear(),cm2=calMonth.getMonth();
  const fd=(new Date(cy2,cm2,1).getDay()||7)-1;
  const dim=new Date(cy2,cm2+1,0).getDate();

  // Drag
  const isSel=(date,time)=>{
    if(!dragging||!dragS||!dragE||date!==dragS.date)return false;
    const t=t2m(time),s=t2m(dragS.time),e=t2m(dragE.time);
    return t>=Math.min(s,e)&&t<=Math.max(s,e);
  };
  const onMD=(date,time,e)=>{if(e.button!==0)return;setDragS({date,time});setDragE({date,time});setDragging(true);};
  const onME=(date,time)=>{if(dragging&&dragS)setDragE({date,time});};
  const onMU=(date,time)=>{
    if(dragging&&dragS){
      setRdvF({...emptyRdv,date:dragS.date,st:dragS.time,et:m2t(t2m(time)+30)});
      setModal("rdv");
    }
    setDragging(false);setDragS(null);setDragE(null);
  };

  const caisseClients=cartClSearch?clients.filter(c=>c.name.toLowerCase().includes(cartClSearch.toLowerCase())||(c.phone||"").includes(cartClSearch)):clients.slice(0,10);
  const rdvClients=rdvF.cs?clients.filter(c=>c.name.toLowerCase().includes(rdvF.cs.toLowerCase())||(c.phone||"").includes(rdvF.cs)):clients.slice(0,8);

  // ════════════════════════════════════════════════════════
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"'Inter',sans-serif",overflow:"hidden"}} onMouseUp={()=>{if(dragging){setDragging(false);setDragS(null);setDragE(null);}}}>
      <style>{CSS}</style>

      {/* ── SIDEBAR CALENDRIER BLEUE ── */}
      {(calOpen&&page==="agenda")&&(
        <div style={{width:200,background:navyL,borderRight:`1px solid ${bord}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>

          {/* Mini calendrier */}
          <div style={{padding:"14px 12px 10px",borderBottom:`1px solid ${bord}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <button onClick={()=>setCalMonth(new Date(cy2,cm2-1,1))} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:muted}}>‹</button>
              <span style={{fontSize:11,fontWeight:600,color:white}}>{MOIS[cm2].slice(0,4)}. {cy2}</span>
              <button onClick={()=>setCalMonth(new Date(cy2,cm2+1,1))} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:muted}}>›</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",textAlign:"center",marginBottom:4}}>
              {["L","M","M","J","V","S","D"].map((d,i)=><div key={i} style={{fontSize:9,color:muted}}>{d}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"1px",textAlign:"center"}}>
              {Array.from({length:42},(_,i)=>{
                const day=i-fd+1,inM=day>=1&&day<=dim;
                const ds=`${cy2}-${String(cm2+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const isT=ds===today,inW=weekDays.includes(ds),isD=ds===dayView;
                const hasR=inM&&appts.some(a=>a.date===ds);
                return(
                  <div key={i} onClick={()=>{if(inM){setWeekBase(ds);setDayView(ds);}}} style={{
                    fontSize:10,padding:"3px 1px",borderRadius:3,cursor:inM?"pointer":"default",
                    background:isT?gold:agView==="week"&&inW&&inM?`${gold}22`:agView==="day"&&isD&&inM?"#1a3a2a":"transparent",
                    color:isT?navy:inM?white:"#2a4a6a",fontWeight:isT?700:400,
                    border:agView==="week"&&inW&&inM&&!isT?`1px solid ${gold}44`:"1px solid transparent",
                  }}>
                    {inM?day:""}
                    {hasR&&!isT&&<div style={{width:3,height:3,background:gold,borderRadius:"50%",margin:"0 auto"}}/>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mode agenda */}
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${bord}`}}>
            <div style={{fontSize:10,color:muted,marginBottom:6}}>Mode Plusieurs agendas</div>
            <div style={{fontSize:11,color:white}}>● Non &nbsp; ○ Oui</div>
            <div style={{fontSize:10,color:muted,marginTop:8,marginBottom:4}}>Équipe</div>
            <div style={{fontSize:11,color:gold,fontWeight:600}}>● Elnagar</div>
          </div>

          {/* Flex espace */}
          <div style={{flex:1}}/>

          {/* Résumé jour EN BAS de la sidebar */}
          <div style={{padding:"12px 14px",borderTop:`1px solid ${bord}`,background:navy}}>
            <div style={{fontSize:10,color:muted,marginBottom:4}}>{fmt3(today)}</div>
            <div style={{color:gold,fontSize:13,fontWeight:600,marginBottom:2}}>{todayRdv.length} RDV aujourd'hui</div>
            <div style={{color:white,fontSize:12}}>{eur(todayRev)}</div>
            {lowStock.length>0&&<div style={{color:amber,fontSize:10,marginTop:4}}>⚠ {lowStock.length} stock(s) faible(s)</div>}
          </div>
        </div>
      )}

      {/* Sidebar caisse/clients/admin */}
      {(calOpen&&page!=="agenda")&&(
        <div style={{width:220,background:navyL,borderRight:`1px solid ${bord}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
          <nav style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
            {page==="caisse"&&(
              <>
                <div className="sb" onClick={()=>tog("enc")} style={{padding:"8px 16px",fontSize:13,color:exp.enc?gold:muted}}>
                  <span>{exp.enc?"▼":"▶"} Encaissement</span>
                </div>
                {exp.enc&&(
                  <>
                    <div className="ss" onClick={()=>setCaisseSection("nouveau-ticket")} style={{color:caisseSection==="nouveau-ticket"?gold:muted,background:caisseSection==="nouveau-ticket"?`${gold}15`:"transparent"}}>Nouveau ticket</div>
                    <div className="ss" onClick={()=>setCaisseSection("tickets-attente")} style={{color:caisseSection==="tickets-attente"?gold:muted,background:caisseSection==="tickets-attente"?`${gold}15`:"transparent"}}>Tickets en attente</div>
                  </>
                )}
                <div className="sb" onClick={()=>tog("trans")} style={{padding:"8px 16px",fontSize:13,color:exp.trans?gold:muted}}>
                  <span>{exp.trans?"▼":"▶"} Transactions</span>
                </div>
                {exp.trans&&(
                  <>
                    <div className="ss" onClick={()=>setCaisseSection("tickets")} style={{color:caisseSection==="tickets"?gold:muted,background:caisseSection==="tickets"?`${gold}15`:"transparent"}}>Tickets</div>
                    <div className="ss" onClick={()=>setCaisseSection("reglements")} style={{color:caisseSection==="reglements"?gold:muted,background:caisseSection==="reglements"?`${gold}15`:"transparent"}}>Règlements</div>
                    <div className="ss" onClick={()=>setCaisseSection("suivi-especes")} style={{color:caisseSection==="suivi-especes"?gold:muted,background:caisseSection==="suivi-especes"?`${gold}15`:"transparent"}}>Suivi d'espèces</div>
                  </>
                )}
                <div className="sb" onClick={()=>tog("paie")} style={{padding:"8px 16px",fontSize:13,color:exp.paie?gold:muted}}>
                  <span>{exp.paie?"▼":"▶"} Paiements en plusieurs fois</span>
                </div>
                {exp.paie&&<div className="ss" onClick={()=>setCaisseSection("echeances")} style={{color:caisseSection==="echeances"?gold:muted,background:caisseSection==="echeances"?`${gold}15`:"transparent"}}>Gestion des échéances</div>}
                <div className="sb" onClick={()=>tog("compta")} style={{padding:"8px 16px",fontSize:13,color:exp.compta?gold:muted}}>
                  <span>{exp.compta?"▼":"▶"} Données comptables</span>
                </div>
                {exp.compta&&[["indicateurs","Indicateurs clés"],["ca","Chiffre d'affaires"],["collab","Collaborateurs"],["presta","Prestations"],["tva","TVA"],["regl","Règlements"]].map(([k,l])=>(
                  <div key={k} className="ss" onClick={()=>setCaisseSection(k)} style={{color:caisseSection===k?gold:muted,background:caisseSection===k?`${gold}15`:"transparent"}}>{l}</div>
                ))}
                <div className="sb" onClick={()=>tog("cad")} style={{padding:"8px 16px",fontSize:13,color:muted}}><span>▶ Cartes cadeaux &amp; cures</span></div>
                <div className="sb" onClick={()=>tog("stocks")} style={{padding:"8px 16px",fontSize:13,color:exp.stocks?gold:muted}}>
                  <span>{exp.stocks?"▼":"▶"} Gestion des stocks</span>
                </div>
                {exp.stocks&&(
                  <>
                    <div className="ss" onClick={()=>setCaisseSection("etat-stocks")} style={{color:caisseSection==="etat-stocks"?gold:muted,background:caisseSection==="etat-stocks"?`${gold}15`:"transparent"}}>État des stocks</div>
                    <div className="ss" onClick={()=>setCaisseSection("entrees-sorties")} style={{color:caisseSection==="entrees-sorties"?gold:muted,background:caisseSection==="entrees-sorties"?`${gold}15`:"transparent"}}>Entrées &amp; Sorties</div>
                  </>
                )}
                {["Paiement en ligne","Terminal de paiement","Tap to Pay","Boutique en ligne"].map(l=>(
                  <div key={l} className="sb" style={{padding:"8px 16px",fontSize:13,color:muted}}>▶ {l}</div>
                ))}
              </>
            )}
            {page==="admin"&&(
              [["prestations","Gestion des prestations"],["produits","Gestion des produits"],["stats-rdv","Statistiques RDV"],["taux","Taux d'occupation"],["corbeille","Corbeille RDV"]].map(([k,l])=>(
                <div key={k} className="sb" onClick={()=>setAdminSub(k)} style={{color:adminSub===k?gold:muted,background:adminSub===k?`${gold}18`:"transparent",borderLeft:adminSub===k?`3px solid ${gold}`:"3px solid transparent"}}>{l}</div>
              ))
            )}
          </nav>
          {/* Infos bas sidebar caisse/admin */}
          <div style={{padding:"10px 14px",borderTop:`1px solid ${bord}`,background:navy}}>
            <div style={{fontSize:10,color:muted}}>{fmt3(today)}</div>
            <div style={{color:white,fontSize:12,marginTop:2}}>{todayRdv.length} RDV · <span style={{color:gold}}>{eur(todayRev)}</span></div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:page==="agenda"?agBg:"#f5f5f5"}}>

        {/* TOPBAR */}
        <div style={{background:page==="agenda"?navy:"#fff",borderBottom:`1px solid ${page==="agenda"?bord:"#e0e0e0"}`,padding:"0 18px",height:52,display:"flex",alignItems:"center",gap:14,flexShrink:0,boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}>

          {/* Logo + Hamburger */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:5,background:gold,display:"flex",alignItems:"center",justifyContent:"center",color:navy,fontWeight:700,fontSize:14,flexShrink:0}}>E</div>
            <div>
              <div style={{color:page==="agenda"?white:"#333",fontWeight:700,fontSize:13,letterSpacing:"1px",lineHeight:1}}>ELNAGAR</div>
            </div>
            <button onClick={()=>setCalOpen(p=>!p)} style={{background:"none",border:"none",cursor:"pointer",fontSize:17,color:page==="agenda"?muted:"#666",padding:"4px",lineHeight:1,marginLeft:4}}>☰</button>
          </div>

          {/* Onglets navigation */}
          <div style={{display:"flex",alignItems:"center"}}>
            {[["agenda","Agenda"],["caisse","Caisse"],["clients","Clients"],["admin","Admin"]].map(([k,l])=>(
              <button key={k} onClick={()=>setPage(k)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:500,color:page===k?(k==="agenda"?gold:"#333"):"#888",borderBottom:page===k?`2px solid ${gold}`:"2px solid transparent",padding:"0 12px",height:52,transition:"all 0.15s"}}>{l}</button>
            ))}
          </div>

          {/* Heure au centre */}
          <div style={{flex:1,textAlign:"center",fontSize:17,fontWeight:700,color:page==="agenda"?white:"#333",letterSpacing:"1px",pointerEvents:"none"}}>{curTime}</div>

          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            {page==="agenda"&&(
              <>
                <div style={{display:"flex",border:`1px solid ${bord}`,borderRadius:4,overflow:"hidden"}}>
                  <button onClick={()=>setAgView("day")} style={{background:agView==="day"?`${gold}22`:"transparent",border:"none",padding:"5px 11px",fontSize:12,cursor:"pointer",color:agView==="day"?gold:muted}}>Vue jour</button>
                  <button onClick={()=>setAgView("week")} style={{background:agView==="week"?`${gold}22`:"transparent",border:"none",borderLeft:`1px solid ${bord}`,padding:"5px 11px",fontSize:12,cursor:"pointer",color:agView==="week"?gold:muted}}>Vue semaine</button>
                </div>
                <button className="btn bsm" onClick={()=>{setWeekBase(today);setDayView(today);}} style={{background:`${gold}22`,border:`1px solid ${gold}44`,color:gold}}>Aujourd'hui</button>
                <button className="btn bsm" onClick={()=>{if(agView==="week"){const d=new Date(weekBase);d.setDate(d.getDate()-7);setWeekBase(d.toISOString().split("T")[0]);}else{const d=new Date(dayView);d.setDate(d.getDate()-1);setDayView(d.toISOString().split("T")[0]);}}} style={{background:`${gold}15`,border:`1px solid ${bord}`,color:muted}}>←</button>
                <button className="btn bsm" onClick={()=>{if(agView==="week"){const d=new Date(weekBase);d.setDate(d.getDate()+7);setWeekBase(d.toISOString().split("T")[0]);}else{const d=new Date(dayView);d.setDate(d.getDate()+1);setDayView(d.toISOString().split("T")[0]);}}} style={{background:`${gold}15`,border:`1px solid ${bord}`,color:muted}}>→</button>
              </>
            )}
            {loading&&<div className="spin"/>}
            <button className="btn bsm" onClick={load} style={{background:`${gold}15`,border:`1px solid ${bord}`,color:muted}}>↻</button>
            <button className="btn bg" onClick={()=>{setRdvF({...emptyRdv,date:today,st:"10:00",et:"10:45"});setModal("rdv");}}>+ Nouveau RDV</button>
          </div>
        </div>

        {toast&&<div style={{position:"fixed",top:60,right:18,zIndex:9999,background:toast.type==="err"?"#f8d7da":"#d4edda",border:`1px solid ${toast.type==="err"?"#f5c6cb":"#c3e6cb"}`,color:toast.type==="err"?"#721c24":"#155724",padding:"9px 16px",borderRadius:6,fontSize:13,animation:"fadeIn 0.2s",boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>{toast.msg}</div>}

        <main style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>

          {/* ════ AGENDA (fond bleu) ════ */}
          {page==="agenda"&&(
            <div style={{height:"100%",overflowY:"auto",overflowX:"auto"}} onMouseLeave={()=>{if(dragging){setDragging(false);setDragS(null);setDragE(null);}}}>

              {agView==="week"&&(
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:650}} onMouseUp={()=>{if(dragging&&dragS&&dragE)onMU(dragE.date,dragE.time);}}>
                  <thead style={{position:"sticky",top:0,zIndex:10,background:navy}}>
                    <tr style={{borderBottom:`2px solid ${bord}`}}>
                      <th style={{width:52,padding:"8px",borderRight:`1px solid ${bord}`,color:agTextMuted,fontSize:10}}></th>
                      {weekDays.map((d,i)=>{
                        const isT=d===today,cnt=appts.filter(a=>a.date===d).length;
                        return(
                          <th key={d} onClick={()=>{setAgView("day");setDayView(d);}} style={{
                            padding:"8px 4px",textAlign:"center",cursor:"pointer",
                            background:isT?"#0d2d1a":"#0f2240",
                            borderRight:`1px solid ${bord}`,minWidth:120,
                            borderBottom:isT?`3px solid ${green}`:`3px solid ${gold}55`,
                          }}>
                            <div style={{fontSize:10,color:isT?green:gold,fontWeight:600,textTransform:"uppercase"}}>{JOURS[i]}</div>
                            <div style={{fontSize:15,fontWeight:700,color:isT?"#fff":agText}}>{fmt2(d)}</div>
                            {cnt>0&&<div style={{fontSize:9,color:agTextMuted}}>{cnt} RDV</div>}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {HOURS.map(time=>(
                      <tr key={time} style={{borderBottom:`1px solid ${time.endsWith(":00")?agLine:agLineAlt}`}}>
                        <td style={{padding:"2px 8px",fontSize:10,color:agTextMuted,borderRight:`1px solid ${agLine}`,verticalAlign:"top",height:26,whiteSpace:"nowrap"}}>{time.endsWith(":00")?time:""}</td>
                        {weekDays.map(date=>{
                          const rdv=appts.find(a=>a.date===date&&a.time===time);
                          const cl=rdv?gC(rdv.client_id):null,sv=rdv?gS(rdv.service_id):null;
                          const isT=date===today,col=rdv?rdvCol(rdv,services):{},sel=isSel(date,time);
                          return(
                            <td key={date}
                              onMouseDown={e=>!rdv&&onMD(date,time,e)}
                              onMouseEnter={()=>!rdv&&onME(date,time)}
                              onMouseUp={()=>!rdv&&onMU(date,time)}
                              onClick={()=>!rdv&&!dragging&&(setRdvF({...emptyRdv,date,st:time,et:m2t(t2m(time)+30)}),setModal("rdv"))}
                              style={{
                                padding:"1px 3px",verticalAlign:"top",
                                borderRight:`1px solid ${agLine}`,
                                background:sel?"rgba(201,168,76,.2)":isT?"rgba(40,167,69,.06)":agBg,
                                cursor:rdv?"default":"crosshair",userSelect:"none",height:26,
                                transition:"background 0.1s",
                              }}>
                              {rdv&&sv&&(
                                <div onClick={e=>{e.stopPropagation();setModal({type:"viewRdv",rdv});}} style={{background:col.bg,border:`1px solid ${col.br}55`,borderLeft:`3px solid ${col.br}`,borderRadius:3,padding:"2px 5px",cursor:"pointer"}}>
                                  <div style={{fontSize:11,fontWeight:600,color:col.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cl?cl.name:"Sans client"}</div>
                                  <div style={{fontSize:10,color:col.tx,opacity:.8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sv.name}</div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {agView==="day"&&(
                <div style={{minWidth:400}}>
                  <div style={{background:navy,borderBottom:`2px solid ${bord}`,padding:"10px 18px",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:10}}>
                    <div>
                      <div style={{fontSize:10,color:gold,fontWeight:600,textTransform:"uppercase"}}>{["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"][(new Date(dayView).getDay()||7)-1]}</div>
                      <div style={{fontSize:24,fontWeight:700,color:dayView===today?"#6fff6f":agText}}>{dayView.split("-")[2]} {MOIS[parseInt(dayView.split("-")[1])-1]}</div>
                    </div>
                    <div style={{fontSize:12,color:agTextMuted}}>{appts.filter(a=>a.date===dayView).length} RDV · {eur(txs.filter(t=>t.date===dayView).reduce((s,t)=>s+Number(t.total||0),0))}</div>
                  </div>
                  <div style={{position:"relative"}}>
                    {dayView===today&&(()=>{
                      const[h,m]=curTime.split(":").map(Number);
                      const pct=((h*60+m-8*60)/(12*60))*100;
                      return pct>0&&pct<100?<div style={{position:"absolute",left:52,right:0,top:`${pct}%`,zIndex:5,pointerEvents:"none"}}><div style={{height:2,background:red,position:"relative"}}><div style={{width:8,height:8,background:red,borderRadius:"50%",position:"absolute",left:-4,top:-3}}/></div></div>:null;
                    })()}
                    {HOURS.map(time=>{
                      const rdvs=appts.filter(a=>a.date===dayView&&a.time===time);
                      return(
                        <div key={time} style={{display:"flex",borderBottom:`1px solid ${time.endsWith(":00")?agLine:agLineAlt}`,minHeight:36}}
                          onMouseDown={e=>onMD(dayView,time,e)}
                          onMouseEnter={()=>onME(dayView,time)}
                          onMouseUp={()=>onMU(dayView,time)}>
                          <div style={{width:52,padding:"3px 8px 3px 0",fontSize:10,color:agTextMuted,textAlign:"right",flexShrink:0}}>{time.endsWith(":00")?time:""}</div>
                          <div style={{flex:1,padding:"2px 8px",background:isSel(dayView,time)?"rgba(201,168,76,.2)":dayView===today?"rgba(40,167,69,.04)":agBg,cursor:"crosshair",minHeight:36}}>
                            {rdvs.map(rdv=>{
                              const cl=gC(rdv.client_id),sv=gS(rdv.service_id),col=rdvCol(rdv,services);
                              return(
                                <div key={rdv.id} onClick={e=>{e.stopPropagation();setModal({type:"viewRdv",rdv});}} style={{background:col.bg,border:`1px solid ${col.br}55`,borderLeft:`4px solid ${col.br}`,borderRadius:4,padding:"5px 10px",marginBottom:3,cursor:"pointer"}}>
                                  <div style={{fontSize:12,fontWeight:600,color:col.tx}}>{rdv.time} — {cl?cl.name:"Sans client"}</div>
                                  <div style={{fontSize:11,color:col.tx,opacity:.8}}>{sv?.name}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ CAISSE ════ */}
          {page==="caisse"&&(
            <div style={{padding:20}}>
              {/* Barre client */}
              <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:"10px 14px",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:18,color:"#bbb",flexShrink:0}}>👤</span>
                  <div style={{flex:2,position:"relative"}}>
                    <input
                      placeholder="Choisir un client"
                      value={cartCl?cartCl.name:cartClSearch}
                      onChange={e=>{if(cartCl)setCartCl(null);setCartClSearch(e.target.value);setShowClDrop(true);}}
                      onFocus={()=>setShowClDrop(true)}
                      style={{border:"none",outline:"none",fontSize:14,color:cartCl?"#333":"#bbb",background:"transparent",width:"100%"}}
                    />
                    {cartCl&&<button onClick={()=>{setCartCl(null);setCartClSearch("");}} style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:16}}>✕</button>}
                    {showClDrop&&!cartCl&&(
                      <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,boxShadow:"0 4px 12px rgba(0,0,0,.15)",zIndex:100,maxHeight:200,overflowY:"auto",marginTop:2}}>
                        <div onClick={()=>{setShowClDrop(false);setModal("newClient");}} style={{padding:"9px 13px",cursor:"pointer",fontSize:13,color:gold,fontWeight:600,borderBottom:"1px solid #f0f0f0"}} onMouseEnter={e=>e.currentTarget.style.background="#f8f8f8"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>+ Créer un nouveau client</div>
                        {caisseClients.map(c=>(
                          <div key={c.id} onClick={()=>{setCartCl(c);setCartClSearch("");setShowClDrop(false);}} style={{padding:"8px 13px",cursor:"pointer",borderBottom:"1px solid #f0f0f0"}} onMouseEnter={e=>e.currentTarget.style.background="#f8f8f8"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                            <div style={{fontSize:13,fontWeight:500}}>{c.name}</div>
                            {c.phone&&<div style={{fontSize:11,color:"#999"}}>{c.phone}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input placeholder="🇫🇷 Téléphone" defaultValue={cartCl?.phone||""} style={{flex:1,border:"1px solid #e0e0e0"}}/>
                  <input placeholder="Email" defaultValue={cartCl?.email||""} style={{flex:1.5,border:"1px solid #e0e0e0"}}/>
                </div>
                {cartCl&&(
                  <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #e0e0e0",animation:"fadeIn 0.2s"}}>
                    <div style={{display:"flex",gap:6,marginBottom:10}}>
                      {["Femme","Homme","Enfant","Autre"].map(g=>(
                        <button key={g} style={{padding:"5px 12px",border:"1px solid #ddd",borderRadius:4,background:"#fff",cursor:"pointer",fontSize:12,color:"#666"}}>{g}</button>
                      ))}
                      <div style={{display:"flex",gap:4,marginLeft:"auto"}}>
                        <input placeholder="jour" style={{width:46,textAlign:"center",fontSize:12}}/>
                        <input placeholder="mois" style={{width:50,textAlign:"center",fontSize:12}}/>
                        <input placeholder="année" style={{width:60,textAlign:"center",fontSize:12}}/>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,marginBottom:10}}>
                      <input placeholder="Numéro et nom de rue" style={{flex:2}}/>
                      <input placeholder="Code postal" style={{flex:1}}/>
                      <input placeholder="Ville" style={{flex:1}}/>
                    </div>
                    <input placeholder="Info client" defaultValue={cartCl.notes||""} style={{marginBottom:8}}/>
                    <div style={{display:"flex",gap:16,fontSize:12,color:"#666"}}>
                      <span>📎 Pièces jointes (0)</span>
                      <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}><input type="checkbox" defaultChecked style={{width:"auto"}}/> SMS de rappel</label>
                    </div>
                  </div>
                )}
              </div>

              <div style={{display:"flex",gap:8,marginBottom:16}}>
                <span style={{fontSize:18,color:"#bbb"}}>+</span>
                <button className="btn bg bsm">Prestation</button>
                <button className="btn bg bsm">Produit</button>
                <button className="btn bg bsm">Montant libre</button>
                <button className="btn bg bsm">Remise</button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 350px",gap:18}} onClick={()=>setShowClDrop(false)}>
                <div>
                  {CATS.map(cat=>{
                    const svcs=services.filter(s=>s.category===cat);
                    if(!svcs.length)return null;
                    return(
                      <div key={cat} style={{marginBottom:14}}>
                        <div style={{fontSize:10,color:"#999",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:7,paddingBottom:5,borderBottom:"1px solid #e0e0e0",fontWeight:600}}>{cat}</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:7}}>
                          {svcs.map(s=>(
                            <button key={s.id} onClick={()=>addCart("service",s.id)} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:"9px 11px",cursor:"pointer",textAlign:"left",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=gold} onMouseLeave={e=>e.currentTarget.style.borderColor="#e0e0e0"}>
                              <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>{s.name}</div>
                              <div style={{display:"flex",justifyContent:"space-between"}}>
                                <span style={{fontSize:12,color:gold,fontWeight:600}}>{Number(s.price)===0?"Offert":eur(s.price)}</span>
                                <span style={{fontSize:10,color:"#bbb"}}>{s.duration}min</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Ticket */}
                <div style={{position:"sticky",top:0,alignSelf:"start"}}>
                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,boxShadow:"0 2px 8px rgba(0,0,0,.07)"}}>
                    <div style={{padding:"10px 14px",borderBottom:"1px solid #e0e0e0",background:"#f8f8f8",borderRadius:"6px 6px 0 0"}}><div style={{fontSize:14,fontWeight:600}}>Ticket</div></div>
                    <div style={{padding:14}}>
                      <div style={{minHeight:50,marginBottom:10}}>
                        {cartItems.length===0?<div style={{textAlign:"center",color:"#bbb",fontSize:12,padding:"14px 0"}}>Ajouter une prestation</div>:cartItems.map(item=>{
                          const f=gI(item);if(!f)return null;
                          return(
                            <div key={`${item.type}-${item.id}`} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 0",borderBottom:"1px solid #f0f0f0"}}>
                              <div style={{flex:1,overflow:"hidden"}}>
                                <div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
                                <div style={{fontSize:10,color:"#bbb"}}>{item.type==="service"?"Prestation":"Produit"}</div>
                              </div>
                              <button onClick={()=>setCartItems(p=>p.map(i=>i.type===item.type&&i.id===item.id?{...i,qty:Math.max(1,i.qty-1)}:i))} style={{border:"1px solid #e0e0e0",background:"#fff",width:20,height:20,borderRadius:3,cursor:"pointer",fontSize:12}}>−</button>
                              <span style={{fontSize:12,minWidth:14,textAlign:"center"}}>{item.qty}</span>
                              <button onClick={()=>setCartItems(p=>p.map(i=>i.type===item.type&&i.id===item.id?{...i,qty:i.qty+1}:i))} style={{border:"1px solid #e0e0e0",background:"#fff",width:20,height:20,borderRadius:3,cursor:"pointer",fontSize:12}}>+</button>
                              <span style={{fontSize:12,fontWeight:500,minWidth:50,textAlign:"right"}}>{eur(Number(f.price)*item.qty)}</span>
                              <button onClick={()=>setCartItems(p=>p.filter(i=>!(i.type===item.type&&i.id===item.id)))} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:13}}>✕</button>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
                        <div><label style={{fontSize:10,color:"#999",display:"block",marginBottom:3}}>Remise (€)</label><input type="number" min="0" placeholder="0" value={cDisc} onChange={e=>setCDisc(e.target.value)}/></div>
                        <div><label style={{fontSize:10,color:"#999",display:"block",marginBottom:3}}>Pourboire (€)</label><input type="number" min="0" placeholder="0" value={cTip} onChange={e=>setCTip(e.target.value)}/></div>
                      </div>
                      <div style={{marginBottom:10}}>
                        <label style={{fontSize:10,color:"#999",display:"block",marginBottom:5}}>Mode de paiement</label>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
                          {[["card","💳 Carte"],["cash","💶 Espèces"],["transfer","📲 Virement"]].map(([k,l])=>(
                            <button key={k} onClick={()=>setCPay(k)} style={{padding:"6px 3px",border:`2px solid ${cPay===k?gold:"#e0e0e0"}`,background:cPay===k?`${gold}15`:"#fff",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:cPay===k?600:400,color:cPay===k?gold:"#666"}}>{l}</button>
                          ))}
                        </div>
                      </div>
                      {cartItems.length>0&&<button onClick={()=>{setCartItems([]);setCDisc("");setCTip("");}} style={{width:"100%",marginBottom:6,background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:11,textDecoration:"underline"}}>Vider le ticket</button>}
                    </div>
                    <div style={{padding:"10px 14px",borderTop:"1px solid #e0e0e0"}}>
                      <button className="btn bg" onClick={encaisser} disabled={!cartItems.length||saving} style={{width:"100%",padding:"12px",fontSize:14,fontWeight:600,borderRadius:5}}>
                        {saving?<><div className="spin"/>Enregistrement…</>:`Paiement ${eur(cartTotal)}`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions */}
              {(caisseSection==="tickets"||caisseSection==="reglements")&&(
                <div style={{marginTop:20}}>
                  <div style={{display:"flex",gap:7,marginBottom:12,alignItems:"center"}}>
                    {[["all","Tous"],["card","💳"],["cash","💶"],["transfer","📲"]].map(([k,l])=>(
                      <button key={k} onClick={()=>setHFilter(k)} className="btn bw bxs" style={{borderColor:hFilter===k?gold:"#ddd",color:hFilter===k?gold:"#666"}}>{l}</button>
                    ))}
                    <input type="date" value={hDate} onChange={e=>setHDate(e.target.value)} style={{width:"auto",padding:"4px 10px",fontSize:12}}/>
                    {hDate&&<button onClick={()=>setHDate("")} className="btn bw bxs">✕</button>}
                    <span style={{marginLeft:"auto",fontSize:13,color:"#666"}}>Total : <strong style={{color:gold}}>{eur(filtTxs.reduce((s,t)=>s+Number(t.total||0),0))}</strong></span>
                  </div>
                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e0e0e0"}}>{["Date","Client","Prestations","Mode","Remise","Pourboire","Total"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11,color:"#666",fontWeight:600}}>{h}</th>)}</tr></thead>
                      <tbody>
                        {filtTxs.slice(0,50).map(tx=>{
                          const cl=gC(tx.client_id);
                          return(
                            <tr key={tx.id} className="tr" style={{borderBottom:"1px solid #f0f0f0"}}>
                              <td style={{padding:"8px 12px",fontSize:12,color:"#666"}}>{fmt3(tx.date)}</td>
                              <td style={{padding:"8px 12px",fontSize:13,fontWeight:500}}>{cl?cl.name:"Anonyme"}</td>
                              <td style={{padding:"8px 12px",fontSize:11,color:"#666",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(tx.items||[]).map(i=>gI(i)?.name).filter(Boolean).join(", ")}</td>
                              <td style={{padding:"8px 12px"}}>{pm(tx)==="card"?"💳":pm(tx)==="cash"?"💶":"📲"}</td>
                              <td style={{padding:"8px 12px",fontSize:12,color:Number(tx.discount)>0?amber:"#ccc"}}>{Number(tx.discount)>0?`−${eur(tx.discount)}`:"—"}</td>
                              <td style={{padding:"8px 12px",fontSize:12,color:Number(tx.tip)>0?green:"#ccc"}}>{Number(tx.tip)>0?`+${eur(tx.tip)}`:"—"}</td>
                              <td style={{padding:"8px 12px",fontSize:14,fontWeight:600,color:gold}}>{eur(tx.total)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {caisseSection==="indicateurs"&&(
                <div style={{marginTop:20}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
                    {[{l:"CA TTC",v:eur(mRev)},{l:"TVA",v:eur(mRev*0.2/1.2)},{l:"CA HT",v:eur(mRev/1.2)},{l:"Panier moyen",v:eur(mTxs.length?mRev/mTxs.length:0)}].map(({l,v})=>(
                      <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:"14px 18px"}}>
                        <div style={{fontSize:11,color:"#666",marginBottom:5}}>{l}</div>
                        <div style={{fontSize:22,fontWeight:600,color:gold}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {caisseSection==="etat-stocks"&&(
                <div style={{marginTop:20}}>
                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e0e0e0"}}>{["Produit","Prix","Stock","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11,color:"#666",fontWeight:600}}>{h}</th>)}</tr></thead>
                      <tbody>
                        {products.map(p=>(
                          <tr key={p.id} className="tr" style={{borderBottom:"1px solid #f0f0f0"}}>
                            <td style={{padding:"8px 12px",fontSize:13,fontWeight:500}}>{p.name}</td>
                            <td style={{padding:"8px 12px",fontSize:13,fontWeight:600,color:gold}}>{eur(p.price)}</td>
                            <td style={{padding:"8px 12px"}}><span style={{fontSize:13,fontWeight:600,color:p.stock<=2?red:p.stock<=5?amber:green}}>{p.stock}</span></td>
                            <td style={{padding:"8px 12px"}}>
                              <div style={{display:"flex",gap:4}}>
                                <button className="btn bw bxs" onClick={()=>db.patch("products",p.id,{stock:(p.stock||0)+1}).then(load)}>+</button>
                                <button className="btn bw bxs" onClick={()=>db.patch("products",p.id,{stock:Math.max(0,(p.stock||0)-1)}).then(load)}>-</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CLIENTS */}
          {page==="clients"&&(
            <div style={{padding:20}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <input placeholder="Chercher un client par nom ou téléphone" value={clSearch} onChange={e=>setClSearch(e.target.value)} style={{maxWidth:380}}/>
                <button className="btn bg" onClick={()=>setModal("newClient")}>Créer</button>
                <span style={{marginLeft:"auto",fontSize:13,color:"#666"}}>Nbre de clients : {clients.length}</span>
              </div>
              <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                {filtCl.map(cl=>{
                  const cTxs=txs.filter(t=>t.client_id===cl.id);
                  const spent=cTxs.reduce((s,t)=>s+Number(t.total||0),0);
                  const ex=expCl===cl.id;
                  return(
                    <div key={cl.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                      <div style={{display:"flex",alignItems:"center",padding:"10px 16px",cursor:"pointer"}} onClick={()=>setExpCl(ex?null:cl.id)}>
                        <div style={{flex:1}}>
                          <span style={{fontSize:14,fontWeight:600,marginRight:10}}>{cl.name}</span>
                          {cl.phone&&<span style={{fontSize:12,color:"#666",marginRight:6}}>{cl.phone}</span>}
                          {cl.email&&<span style={{fontSize:12,color:"#999"}}>- {cl.email}</span>}
                        </div>
                        <div style={{display:"flex",gap:16,alignItems:"center",marginRight:12}}>
                          <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#bbb",textTransform:"uppercase"}}>Visites</div><div style={{fontSize:14,fontWeight:600,color:gold}}>{cl.visits||0}</div></div>
                          <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#bbb",textTransform:"uppercase"}}>CA</div><div style={{fontSize:14,fontWeight:600,color:gold}}>{eur(spent)}</div></div>
                        </div>
                        <button className="btn bl bsm" onClick={e=>e.stopPropagation()}>Modifier</button>
                        <button className="btn bd bsm" onClick={e=>e.stopPropagation()}>Supprimer</button>
                      </div>
                      {ex&&(
                        <div style={{padding:"0 16px 12px",borderTop:"1px solid #f0f0f0",animation:"fadeIn 0.2s"}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                            <div>
                              <div style={{fontSize:10,color:"#bbb",fontWeight:600,textTransform:"uppercase",marginBottom:5}}>Dernières transactions</div>
                              {cTxs.slice(0,4).map(tx=>(
                                <div key={tx.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#666",padding:"4px 0",borderBottom:"1px solid #f0f0f0"}}>
                                  <span>{fmt3(tx.date)}</span>
                                  <span style={{flex:1,margin:"0 8px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(tx.items||[]).map(i=>gI(i)?.name).filter(Boolean).join(", ")}</span>
                                  <span style={{color:gold,fontWeight:600}}>{eur(tx.total)}</span>
                                </div>
                              ))}
                              {cTxs.length===0&&<div style={{fontSize:11,color:"#bbb"}}>Aucune transaction</div>}
                            </div>
                            <div>
                              <div style={{fontSize:10,color:"#bbb",fontWeight:600,textTransform:"uppercase",marginBottom:5}}>Prochain RDV</div>
                              {appts.filter(a=>a.client_id===cl.id&&a.date>=today).slice(0,2).map(a=>{const sv=gS(a.service_id);return(<div key={a.id} style={{fontSize:11,color:"#666",padding:"4px 0",borderBottom:"1px solid #f0f0f0"}}>📅 {fmt3(a.date)} à {a.time} · {sv?.name||"—"}</div>);})}
                              {!appts.find(a=>a.client_id===cl.id&&a.date>=today)&&<div style={{fontSize:11,color:"#bbb"}}>Aucun RDV</div>}
                              <button className="btn bg bsm" style={{marginTop:8}} onClick={()=>{setRdvF({...emptyRdv,cid:cl.id,cs:cl.name,date:today,st:"10:00",et:"10:45"});setModal("rdv");}}>+ Prendre RDV</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {filtCl.length===0&&<div style={{padding:40,textAlign:"center",color:"#bbb"}}>Aucun client</div>}
              </div>
            </div>
          )}

          {/* ADMIN */}
          {page==="admin"&&(
            <div style={{padding:20}}>
              {adminSub==="prestations"&&(
                <div>
                  <div style={{marginBottom:16}}><button className="btn bl" onClick={()=>setModal("service")}>⊕ Ajouter une prestation</button></div>
                  {CATS.map(cat=>{
                    const svcs=services.filter(s=>s.category===cat);
                    if(!svcs.length)return null;
                    return(
                      <div key={cat} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,marginBottom:12,overflow:"hidden"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 14px",background:"#f8f8f8",borderBottom:"1px solid #e0e0e0"}}>
                          <span style={{fontSize:13,fontWeight:600}}>{cat}</span>
                          <div style={{display:"flex",gap:10}}>
                            <button className="btn bl bxs" onClick={()=>{setSvcF({name:"",dur:"45",price:"",cat});setModal("service");}}>Ajouter</button>
                            <button className="btn bd bxs">Supprimer</button>
                          </div>
                        </div>
                        <table style={{width:"100%",borderCollapse:"collapse"}}>
                          <thead><tr style={{borderBottom:"1px solid #e0e0e0"}}>{["Prestation","Durée","Prix","Actions"].map(h=><th key={h} style={{padding:"7px 14px",textAlign:"left",fontSize:10,color:"#999",fontWeight:500}}>{h}</th>)}</tr></thead>
                          <tbody>
                            {svcs.map(s=>(
                              <tr key={s.id} className="tr" style={{borderBottom:"1px solid #f0f0f0"}}>
                                <td style={{padding:"8px 14px",fontSize:13}}>{s.name}</td>
                                <td style={{padding:"8px 14px",fontSize:12,color:"#666"}}>{s.duration} min</td>
                                <td style={{padding:"8px 14px",fontSize:13,fontWeight:600,color:gold}}>{eur(s.price)}</td>
                                <td style={{padding:"8px 14px"}}>
                                  <button className="btn bl bxs">Modifier</button>
                                  <button className="btn bd bxs" onClick={()=>db.patch("services",s.id,{active:false}).then(load)}>Supprimer</button>
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
              {adminSub==="corbeille"&&(
                <div>
                  <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>RDV annulés dans les 30 derniers jours</h3>
                  <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e0e0e0"}}>{["RDV avec","Date","Client","Prestation","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11,color:"#666",fontWeight:600}}>{h}</th>)}</tr></thead>
                      <tbody>
                        {cancelledAppts.map(rdv=>{const cl=gC(rdv.client_id),sv=gS(rdv.service_id);return(<tr key={rdv.id} className="tr" style={{borderBottom:"1px solid #f0f0f0"}}><td style={{padding:"8px 12px",fontSize:13}}>Elnagar</td><td style={{padding:"8px 12px",fontSize:12,color:"#666"}}>{fmt3(rdv.date)} {rdv.time}</td><td style={{padding:"8px 12px",fontSize:13,fontWeight:500}}>{cl?cl.name:"—"}</td><td style={{padding:"8px 12px",fontSize:12,color:"#666"}}>{sv?.name||"—"}</td><td style={{padding:"8px 12px"}}><button className="btn bl bxs" onClick={()=>updRdv(rdv.id,{status:"confirmed"})}>Restaurer</button></td></tr>);})}
                        {cancelledAppts.length===0&&<tr><td colSpan={5} style={{padding:40,textAlign:"center",color:"#bbb"}}>Aucun RDV annulé</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {adminSub==="stats-rdv"&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
                  {[{l:"Total RDV",v:appts.length},{l:"Confirmés",v:appts.filter(a=>a.status==="confirmed").length},{l:"En attente",v:appts.filter(a=>a.status==="pending").length},{l:"Annulés",v:cancelledAppts.length}].map(({l,v})=>(
                    <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:6,padding:"14px 18px"}}>
                      <div style={{fontSize:11,color:"#666",marginBottom:5}}>{l}</div>
                      <div style={{fontSize:24,fontWeight:600,color:gold}}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      {modal&&(
        <div onClick={e=>e.target===e.currentTarget&&setModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}}>

          {modal==="rdv"&&(
            <div style={{background:"#fff",borderRadius:8,width:"92%",maxWidth:540,animation:"slideUp 0.2s",boxShadow:"0 8px 32px rgba(0,0,0,.3)",maxHeight:"90vh",overflowY:"auto"}}>
              <div style={{background:"#f8f8f8",borderBottom:"1px solid #e0e0e0",padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"8px 8px 0 0"}}>
                <div style={{fontSize:15,fontWeight:700}}>Rendez-vous</div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn bw bsm" onClick={()=>setModal(null)}>←</button>
                  <button className="btn bg bsm" onClick={saveRdv} disabled={saving}>{saving?<><div className="spin"/>…</>:"✓"}</button>
                </div>
              </div>
              <div style={{padding:18}}>
                {/* Client */}
                <div style={{background:"#f8f8f8",border:"1px solid #e0e0e0",borderRadius:6,padding:"9px 13px",marginBottom:12}}>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:16,color:"#bbb",flexShrink:0}}>👤</span>
                    <div style={{flex:1}}>
                      {!rdvF.newCl?(
                        <div style={{position:"relative"}}>
                          <input placeholder="Choisir un client" value={rdvF.cs} onChange={e=>setRdvF(p=>({...p,cs:e.target.value,showList:true,cid:""}))} onFocus={()=>setRdvF(p=>({...p,showList:true}))} style={{border:"none",background:"transparent",fontSize:13,outline:"none",width:"100%"}}/>
                          {rdvF.showList&&(
                            <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,boxShadow:"0 4px 12px rgba(0,0,0,.15)",zIndex:100,maxHeight:200,overflowY:"auto",marginTop:2}}>
                              <div onClick={()=>setRdvF(p=>({...p,newCl:true,showList:false,cs:""}))} style={{padding:"9px 13px",cursor:"pointer",fontSize:13,color:gold,fontWeight:600,borderBottom:"1px solid #f0f0f0"}} onMouseEnter={e=>e.currentTarget.style.background="#f8f8f8"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>+ Créer un nouveau client</div>
                              {rdvClients.map(c=>(
                                <div key={c.id} onClick={()=>setRdvF(p=>({...p,cid:c.id,cs:c.name,showList:false}))} style={{padding:"8px 13px",cursor:"pointer",borderBottom:"1px solid #f0f0f0"}} onMouseEnter={e=>e.currentTarget.style.background="#f8f8f8"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                                  <div style={{fontSize:13,fontWeight:500}}>{c.name}</div>
                                  {c.phone&&<div style={{fontSize:11,color:"#999"}}>{c.phone}</div>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ):(
                        <div>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                            <span style={{fontSize:12,fontWeight:600,color:gold}}>Nouveau client</span>
                            <button onClick={()=>setRdvF(p=>({...p,newCl:false}))} style={{background:"none",border:"none",fontSize:11,color:"#999",cursor:"pointer"}}>← Choisir existant</button>
                          </div>
                          {[{l:"Nom *",k:"name",t:"text",p:"Prénom Nom"},{l:"Téléphone",k:"phone",t:"tel",p:"06 00 00 00 00"},{l:"Email",k:"email",t:"email",p:"email@exemple.com"},{l:"Date de naissance",k:"birthday",t:"date"},{l:"Adresse",k:"address",t:"text",p:"Adresse postale"}].map(f=>(
                            <div key={f.k} style={{marginBottom:7}}><label style={{fontSize:10,color:"#999",display:"block",marginBottom:3}}>{f.l}</label><input type={f.t} placeholder={f.p||""} value={rdvF.ncd[f.k]} onChange={e=>setRdvF(p=>({...p,ncd:{...p.ncd,[f.k]:e.target.value}}))} style={{fontSize:12}}/></div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date heure */}
                <div style={{background:"#f8f8f8",border:"1px solid #e0e0e0",borderRadius:6,padding:"9px 13px",marginBottom:12,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:16,color:"#bbb"}}>📅</span>
                  <input type="date" value={rdvF.date} onChange={e=>setRdvF(p=>({...p,date:e.target.value}))} style={{flex:1,border:"none",background:"transparent",fontSize:13,outline:"none"}}/>
                  <span style={{color:"#bbb",fontSize:12}}>de</span>
                  <select value={rdvF.st} onChange={e=>setRdvF(p=>({...p,st:e.target.value}))} style={{flex:1,border:"none",background:"transparent",fontSize:13,outline:"none"}}>
                    <option value="">Heure</option>{HOURS.map(h=><option key={h} value={h}>{h}</option>)}
                  </select>
                  <span style={{color:"#bbb",fontSize:12}}>à</span>
                  <select value={rdvF.et} onChange={e=>setRdvF(p=>({...p,et:e.target.value}))} style={{flex:1,border:"none",background:"transparent",fontSize:13,outline:"none"}}>
                    <option value="">Fin</option>{HOURS.map(h=><option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                {/* Prestation */}
                <div style={{background:"#f8f8f8",border:"1px solid #e0e0e0",borderRadius:6,padding:"9px 13px",marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:16,color:"#bbb"}}>✂️</span>
                  <select value={rdvF.sid} onChange={e=>setRdvF(p=>({...p,sid:e.target.value}))} style={{flex:1,border:"none",background:"transparent",fontSize:13,outline:"none",color:rdvF.sid?"#333":"#bbb"}}>
                    <option value="">Choisir une prestation</option>
                    {CATS.map(cat=>(<optgroup key={cat} label={cat}>{services.filter(s=>s.category===cat).map(s=><option key={s.id} value={s.id}>{s.name} — {s.duration}min — {eur(s.price)}</option>)}</optgroup>))}
                  </select>
                  <span style={{fontSize:12,color:"#bbb"}}>Avec</span>
                  <span style={{fontSize:13,fontWeight:600,color:gold}}>Elnagar</span>
                </div>

                <select value={rdvF.status} onChange={e=>setRdvF(p=>({...p,status:e.target.value}))} style={{marginBottom:12,fontSize:13}}>
                  <option value="confirmed">Confirmé</option>
                  <option value="pending">En attente</option>
                </select>
                <textarea rows={2} placeholder="Ajouter une note…" value={rdvF.notes} onChange={e=>setRdvF(p=>({...p,notes:e.target.value}))} style={{marginBottom:12,fontSize:13}}/>

                <div style={{display:"flex",gap:12,paddingTop:12,borderTop:"1px solid #e0e0e0",flexWrap:"wrap",alignItems:"center"}}>
                  <button className="btn bl bsm" style={{color:"#666"}}>🔒 Choisi(e)</button>
                  <button className="btn bl bsm" style={{color:green}}>✓ Venu</button>
                  <button className="btn bd bsm">✗ Pas venu</button>
                  <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                    <button className="btn bl bsm">Copier</button>
                    <button className="btn bl bsm">Couper</button>
                    <button className="btn bd bsm">Supprimer</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {modal?.type==="viewRdv"&&(()=>{
            const r=modal.rdv,cl=gC(r.client_id),sv=gS(r.service_id),col=rdvCol(r,services);
            return(
              <div style={{background:"#fff",borderRadius:8,width:"92%",maxWidth:480,animation:"slideUp 0.2s",boxShadow:"0 8px 32px rgba(0,0,0,.3)"}}>
                <div style={{background:"#f8f8f8",borderBottom:"1px solid #e0e0e0",padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"8px 8px 0 0"}}>
                  <div style={{fontSize:15,fontWeight:700}}>Rendez-vous</div>
                  <button onClick={()=>setModal(null)} style={{background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#999"}}>✕</button>
                </div>
                <div style={{padding:18}}>
                  <div style={{background:"#f8f8f8",border:"1px solid #e0e0e0",borderRadius:6,padding:"9px 13px",marginBottom:10,display:"flex",gap:10}}>
                    <span>👤</span><div><div style={{fontSize:14,fontWeight:600}}>{cl?cl.name:"Sans client"}</div>{cl?.phone&&<div style={{fontSize:12,color:"#666"}}>{cl.phone}</div>}</div>
                  </div>
                  <div style={{background:"#f8f8f8",border:"1px solid #e0e0e0",borderRadius:6,padding:"9px 13px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
                    <span>📅</span><div style={{fontSize:13}}>{fmt3(r.date)} · {r.time}<span style={{color:"#bbb",marginLeft:8}}>({sv?.duration||"—"} min)</span></div>
                  </div>
                  <div style={{background:col.bg,border:`1px solid ${col.br}55`,borderRadius:6,padding:"9px 13px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
                    <span>✂️</span>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:col.tx}}>{sv?.name||"—"}</div><div style={{fontSize:12,color:col.tx,opacity:.8}}>{sv?eur(sv.price):"—"}</div></div>
                  </div>
                  {r.notes&&<div style={{marginBottom:10,padding:"7px 10px",background:"#fff3cd",borderRadius:4,fontSize:12,color:"#856404"}}>📋 {r.notes}</div>}
                  <div style={{display:"flex",gap:10,paddingTop:12,borderTop:"1px solid #e0e0e0",flexWrap:"wrap"}}>
                    <span className={r.status==="confirmed"?"t-ok":r.status==="cancelled"?"t-no":"t-wait"}>{r.status==="confirmed"?"Confirmé":r.status==="cancelled"?"Annulé":"En attente"}</span>
                    <button className="btn bg bsm" onClick={()=>{setModal(null);setPage("caisse");addCart("service",r.service_id);setCartCl(gC(r.client_id)||null);}}>→ Encaisser</button>
                    {r.status!=="confirmed"&&<button className="btn bw bsm" onClick={()=>updRdv(r.id,{status:"confirmed"})}>✓ Confirmer</button>}
                    {r.status==="confirmed"&&<button className="btn bw bsm" onClick={()=>updRdv(r.id,{status:"cancelled"})}>Annuler</button>}
                    <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                      <button className="btn bd bsm" onClick={()=>delRdv(r.id)}>Supprimer</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {modal==="newClient"&&(()=>{
            const [nd,setNd]=useState({name:"",phone:"",email:"",birthday:"",address:"",notes:""});
            return(
              <div style={{background:"#fff",borderRadius:8,width:"92%",maxWidth:420,animation:"slideUp 0.2s",boxShadow:"0 8px 32px rgba(0,0,0,.3)"}}>
                <div style={{background:"#f8f8f8",borderBottom:"1px solid #e0e0e0",padding:"12px 18px",borderRadius:"8px 8px 0 0"}}><div style={{fontSize:15,fontWeight:700}}>Nouveau client</div></div>
                <div style={{padding:18}}>
                  <div style={{display:"grid",gap:10,marginBottom:16}}>
                    {[{l:"Nom complet *",k:"name",t:"text",p:"Prénom Nom"},{l:"Téléphone",k:"phone",t:"tel",p:"06 00 00 00 00"},{l:"Email",k:"email",t:"email",p:"email@exemple.com"},{l:"Date de naissance",k:"birthday",t:"date"},{l:"Adresse",k:"address",t:"text",p:"Adresse postale"},{l:"Notes",k:"notes",t:"text",p:"Allergies, préférences…"}].map(f=>(
                      <div key={f.k}><label style={{fontSize:11,color:"#666",display:"block",marginBottom:3}}>{f.l}</label><input type={f.t} placeholder={f.p||""} value={nd[f.k]} onChange={e=>setNd(p=>({...p,[f.k]:e.target.value}))}/></div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn bw" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                    <button className="btn bg" onClick={async()=>{if(!nd.name)return notify("Nom requis","err");setSaving(true);await db.post("clients",{name:nd.name,phone:nd.phone||null,email:nd.email||null,notes:nd.notes||null,visits:0,loyalty:0});setSaving(false);await load();setModal(null);notify("Client créé ✓");}} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>…</>:"Créer le client"}</button>
                  </div>
                </div>
              </div>
            );
          })()}

          {modal==="service"&&(
            <div style={{background:"#fff",borderRadius:8,padding:22,width:"92%",maxWidth:360,animation:"slideUp 0.2s",boxShadow:"0 8px 32px rgba(0,0,0,.3)"}}>
              <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>Nouvelle prestation</div>
              <div style={{display:"grid",gap:10,marginBottom:16}}>
                <div><label style={{fontSize:11,color:"#666",display:"block",marginBottom:3}}>Nom *</label><input placeholder="Coupe Homme" value={svcF.name} onChange={e=>setSvcF(p=>({...p,name:e.target.value}))}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><label style={{fontSize:11,color:"#666",display:"block",marginBottom:3}}>Durée (min)</label><input type="number" value={svcF.dur} onChange={e=>setSvcF(p=>({...p,dur:e.target.value}))}/></div>
                  <div><label style={{fontSize:11,color:"#666",display:"block",marginBottom:3}}>Prix (€) *</label><input type="number" value={svcF.price} onChange={e=>setSvcF(p=>({...p,price:e.target.value}))}/></div>
                </div>
                <div><label style={{fontSize:11,color:"#666",display:"block",marginBottom:3}}>Catégorie</label><select value={svcF.cat} onChange={e=>setSvcF(p=>({...p,cat:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn bw" onClick={()=>setModal(null)} style={{flex:1}}>Annuler</button>
                <button className="btn bg" onClick={async()=>{if(!svcF.name||!svcF.price)return notify("Requis","err");setSaving(true);await db.post("services",{name:svcF.name,duration:Number(svcF.dur)||45,price:Number(svcF.price),category:svcF.cat,active:true});setSaving(false);await load();setModal(null);notify("Ajouté ✓");}} disabled={saving} style={{flex:2}}>{saving?<><div className="spin"/>…</>:"Ajouter"}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
