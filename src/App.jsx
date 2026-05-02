import { useState, useEffect, useRef } from "react";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const PALETTE = [
  ["#6cb8f5","#5cb85c","#f0a050","#f07090","#b085f5","#f08070","#40c0b0","#f5c842"],
  ["#4a9eff","#3d9e3d","#e8882a","#e8507a","#9060e8","#e86050","#20a090","#e8b020"],
  ["#2878e0","#267826","#d06010","#d02860","#7040d0","#d04030","#007878","#c08000"],
  ["#1050b8","#185018","#a83800","#a80040","#5020a8","#a82010","#005050","#906000"],
  ["#0a2878","#0a2808","#781800","#780020","#300878","#780000","#002828","#604000"],
];

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PRESTATIONS_CAISSE = {
  "Prestations": [
    {id:1,nom:"Offre de bienvenue",duree:15,prix:0,couleur:"#f5c842"},
    {id:2,nom:"Coupe homme",duree:45,prix:30,couleur:"#4a9eff"},
    {id:3,nom:"Coupe + Barbe",duree:60,prix:55,couleur:"#5cb85c"},
    {id:4,nom:"Coupe +barbe +soin visage",duree:90,prix:85,couleur:"#e8507a"},
    {id:5,nom:"barbe",duree:30,prix:25,couleur:"#f0a050"},
    {id:6,nom:"Coupe transformation",duree:45,prix:38,couleur:"#d02860"},
    {id:7,nom:"Coupe étudiant",duree:30,prix:25,couleur:"#9060e8"},
    {id:8,nom:"Moustache / bouc",duree:10,prix:10,couleur:"#f0a050"},
    {id:9,nom:"Coupe (-17)",duree:30,prix:25,couleur:"#20a090"},
    {id:10,nom:"Coupe (-10 ans)",duree:30,prix:20,couleur:"#5cb85c"},
  ],
  "Soins & entretien": [
    {id:11,nom:"Soin Visage",duree:30,prix:25,couleur:"#4a9eff"},
    {id:12,nom:"Soin Kératine",duree:90,prix:95,couleur:"#5cb85c"},
    {id:13,nom:"Traitement cuir chevelu",duree:45,prix:55,couleur:"#e8507a"},
  ],
  "Couleur & techniques": [
    {id:14,nom:"Balayage",duree:150,prix:180,couleur:"#f5c842"},
    {id:15,nom:"Coloration",duree:120,prix:120,couleur:"#f0a050"},
    {id:16,nom:"Mèches",duree:120,prix:150,couleur:"#9060e8"},
    {id:17,nom:"Ombre",duree:120,prix:140,couleur:"#d02860"},
  ],
  "Bons cadeaux": [
    {id:18,nom:"Bon cadeau 50€",duree:0,prix:50,couleur:"#c9a84c"},
    {id:19,nom:"Bon cadeau 100€",duree:0,prix:100,couleur:"#c9a84c"},
  ],
};

const PRODUITS_CAISSE = {
  "kydra cuir chevelu": [
    {id:1,nom:"exfoliant delicatesse",prix:39,stock:6},
    {id:2,nom:"Shampooing délicatesse",prix:32,stock:8},
    {id:3,nom:"huile délicatesse",prix:33,stock:6},
    {id:4,nom:"Shampooing solide délicatesse",prix:17,stock:1},
    {id:5,nom:"Shampooing calme",prix:32,stock:5},
    {id:6,nom:"shampooing pureté",prix:32,stock:6},
    {id:7,nom:"Shampooing équilibre",prix:32,stock:4},
    {id:8,nom:"Shampooing anti chute",prix:32,stock:4},
    {id:9,nom:"Anti chute progressif prev",prix:77,stock:2},
    {id:10,nom:"Anti chute, avancée",prix:88,stock:3},
  ],
  "kydra cheveux": [
    {id:11,nom:"Masque nutrition intense",prix:28,stock:5},
    {id:12,nom:"Sérum éclat",prix:35,stock:3},
    {id:13,nom:"Shampooing richesse",prix:32,stock:3},
  ],
  "L'atelier Shelter": [
    {id:14,nom:"Pomade mate",prix:24,stock:7},
    {id:15,nom:"Gel fixant",prix:18,stock:9},
  ],
  "men stories": [
    {id:16,nom:"Crème coiffante",prix:22,stock:4},
    {id:17,nom:"Huile barbe",prix:29,stock:6},
  ],
  "depot": [
    {id:18,nom:"Shampoing homme",prix:19,stock:8},
    {id:19,nom:"Conditionneur",prix:21,stock:5},
  ],
  "naturnua": [{id:20,nom:"Masque capillaire bio",prix:26,stock:3}],
  "kydra corps": [{id:21,nom:"Gel douche relaxant",prix:15,stock:10}],
};

const REMISES_DATA = [
  {id:1,nom:"FCSA",type:"fixe",valeur:5},
  {id:2,nom:"commerçant",type:"pourcentage",valeur:10},
  {id:3,nom:"amis",type:"fixe",valeur:5},
];

const CLIENTS_DATA = [
  {id:1,nom:"abdelrahman elnagar",tel:"0769909271",email:"abdelelnagar37@gmail.com",visites:0,ca:0},
  {id:2,nom:"Aaron PATE HODIN",tel:"07 49 49 79 58",email:"patehodin.aaron@gmail.com",visites:12,ca:540},
  {id:3,nom:"aatti keiys",tel:"07 81 21 95 37",email:"",visites:3,ca:135},
  {id:4,nom:"Abdelkader Mostefa",tel:"06 99 37 76 25",email:"kaderm37@hotmail.fr",visites:8,ca:360},
  {id:5,nom:"Alain MICHEL",tel:"06 09 75 39 69",email:"alain.michel37@gmail.com",visites:15,ca:675},
  {id:6,nom:"alain prin",tel:"07 60 20 45 80",email:"archambault.morgane7@gmail.com",visites:5,ca:225},
  {id:7,nom:"Alan Lorion",tel:"06 49 01 45 21",email:"lorionalan@gmail.com",visites:7,ca:315},
  {id:8,nom:"Alane Bonvalet",tel:"06 45 21 70 65",email:"alanebvlt@gmail.com",visites:2,ca:90},
  {id:9,nom:"Albane Benjamin",tel:"06 51 64 79 11",email:"albanebjm@gmail.com",visites:6,ca:270},
  {id:10,nom:"Alex Vaglio",tel:"06 28 67 81 59",email:"alex.vaglio1@gmail.com",visites:4,ca:180},
  {id:11,nom:"Alexandre Barbosa fernandes",tel:"06 35 38 16 98",email:"alexfrds06@gmail.com",visites:9,ca:405},
  {id:12,nom:"Alexandre Blin",tel:"06 48 03 52 01",email:"alexandre.blin@yahoo.fr",visites:11,ca:495},
  {id:13,nom:"Alexandre Casara",tel:"06 37 44 17 43",email:"alexinjie@hotmail.fr",visites:3,ca:135},
  {id:14,nom:"Alexandre Da Silva",tel:"07 70 42 01 15",email:"alexandred610@gmail.com",visites:6,ca:270},
  {id:15,nom:"Alexandre Gougeard",tel:"06 89 96 50 69",email:"gougeard21@gmail.com",visites:4,ca:180},
];

const PRESTATIONS_ADMIN = {
  "Coupe": [
    {id:1,nom:"Coupe + Barbe",duree:60,prix:65,couleur:"#5cb85c"},
    {id:2,nom:"Coupe Enfant",duree:30,prix:28,couleur:"#4a9eff"},
    {id:3,nom:"Coupe Homme",duree:45,prix:45,couleur:"#4a9eff"},
  ],
  "Barbe": [
    {id:4,nom:"Rasage traditionnel",duree:45,prix:35,couleur:"#f0a050"},
    {id:5,nom:"Taille de barbe",duree:30,prix:25,couleur:"#f0a050"},
  ],
  "Couleur": [
    {id:6,nom:"Balayage",duree:150,prix:180,couleur:"#f5c842"},
    {id:7,nom:"Mèches",duree:120,prix:150,couleur:"#9060e8"},
  ],
  "Soin": [{id:8,nom:"Soin Kératine",duree:90,prix:95,couleur:"#5cb85c"}],
  "Autre": [{id:9,nom:"Offre de bienvenue",duree:15,prix:0,couleur:"#f5c842"}],
};

const PRODUITS_ADMIN = {
  "kydra cuir chevelu": [
    {id:1,nom:"exfoliant delicatesse",prix:39,stock:6,couleur:"#20a090"},
    {id:2,nom:"Shampooing délicatesse",prix:32,stock:8,couleur:"#4a9eff"},
    {id:3,nom:"huile délicatesse",prix:33,stock:6,couleur:"#4a9eff"},
    {id:4,nom:"Shampooing solide délicatesse",prix:17,stock:1,couleur:"#4a9eff"},
    {id:5,nom:"Shampooing calme",prix:32,stock:5,couleur:"#5cb85c"},
    {id:6,nom:"shampooing pureté",prix:32,stock:6,couleur:"#4a9eff"},
    {id:7,nom:"Shampooing équilibre",prix:32,stock:4,couleur:"#f5c842"},
    {id:8,nom:"Shampooing anti chute",prix:32,stock:4,couleur:"#5cb85c"},
    {id:9,nom:"Anti chute progressif prev",prix:77,stock:2,couleur:"#5cb85c"},
    {id:10,nom:"Anti chute, avancée",prix:88,stock:3,couleur:"#5cb85c"},
  ],
  "kydra cheveux": [
    {id:11,nom:"Shampooing richesse",prix:32,stock:3,couleur:"#d02860"},
    {id:12,nom:"Masque nutrition intense",prix:28,stock:5,couleur:"#4a9eff"},
  ],
  "L'atelier Shelter": [{id:13,nom:"Pomade mate",prix:24,stock:7,couleur:"#9060e8"}],
  "men stories": [{id:14,nom:"Crème coiffante",prix:22,stock:4,couleur:"#f0a050"}],
  "depot": [{id:15,nom:"Shampoing homme",prix:19,stock:8,couleur:"#4a9eff"}],
  "naturnua": [{id:16,nom:"Masque capillaire bio",prix:26,stock:3,couleur:"#5cb85c"}],
  "kydra corps": [{id:17,nom:"Gel douche relaxant",prix:15,stock:10,couleur:"#20a090"}],
};

const HORAIRES_DATA = {
  Lundi:    [{debut:"10:00",fin:"19:00"}],
  Mardi:    [{debut:"10:00",fin:"19:00"}],
  Mercredi: [{debut:"10:00",fin:"19:00"}],
  Jeudi:    [{debut:"10:00",fin:"19:00"}],
  Vendredi: [{debut:"10:00",fin:"13:30"},{debut:"15:00",fin:"19:00"}],
  Samedi:   [{debut:"10:00",fin:"19:00"}],
  Dimanche: [],
};

const TAUX_OCCUPATION = {
  "10:00-11:00": {Lu:69,Ma:19,Me:19,Je:6,Ve:20,Sa:40,Di:0},
  "11:00-12:00": {Lu:69,Ma:25,Me:0,Je:50,Ve:5,Sa:60,Di:0},
  "12:00-13:00": {Lu:69,Ma:31,Me:0,Je:6,Ve:20,Sa:35,Di:0},
  "13:00-14:00": {Lu:56,Ma:31,Me:0,Je:25,Ve:20,Sa:40,Di:0},
  "14:00-15:00": {Lu:69,Ma:0,Me:19,Je:0,Ve:0,Sa:40,Di:0},
  "15:00-16:00": {Lu:50,Ma:0,Me:13,Je:0,Ve:30,Sa:50,Di:0},
  "16:00-17:00": {Lu:56,Ma:6,Me:0,Je:0,Ve:20,Sa:40,Di:0},
  "17:00-18:00": {Lu:69,Ma:25,Me:0,Je:0,Ve:20,Sa:40,Di:0},
  "18:00-19:00": {Lu:63,Ma:25,Me:0,Je:0,Ve:30,Sa:40,Di:0},
};

const STATS_PRESTATIONS = [
  {cat:"Prestations",total:45,salon:12,ligne:33,taux:"73.3%",ca:"1 505,00 €"},
  {nom:"Coupe homme",total:21,salon:6,ligne:15,taux:"71.4%",ca:"630,00 €"},
  {nom:"Coupe + Barbe",total:9,salon:1,ligne:8,taux:"88.9%",ca:"495,00 €"},
  {nom:"Coupe étudiant",total:7,salon:3,ligne:4,taux:"57.1%",ca:"175,00 €"},
  {nom:"barbe",total:2,salon:1,ligne:1,taux:"50%",ca:"50,00 €"},
  {nom:"Coupe (-17)",total:2,salon:1,ligne:1,taux:"50%",ca:"50,00 €"},
  {nom:"Offre de bienvenue",total:2,salon:0,ligne:2,taux:"100%",ca:"0,00 €"},
  {nom:"Coupe (-10 ans)",total:1,salon:0,ligne:1,taux:"100%",ca:"20,00 €"},
  {nom:"Coupe +barbe +soin visage",total:1,salon:0,ligne:1,taux:"100%",ca:"85,00 €"},
  {cat:"Soins & entretien",total:2,salon:0,ligne:2,taux:"100.0%",ca:"33,00 €"},
  {nom:"Soin cuir chevelu",total:1,salon:0,ligne:1,taux:"100%",ca:"23,00 €"},
  {nom:"Épilation sourcils",total:1,salon:0,ligne:1,taux:"100%",ca:"10,00 €"},
];

const CORBEILLE_RDV = [
  {id:1,agenda:"Elnagar",date:"20/04/2026 12:15",client:"Jacques VAUTIER",internet:true,creation:"17/04/2026 18:39",annulation:"20/04/2026 13:27"},
  {id:2,agenda:"Elnagar",date:"20/04/2026 13:15",client:"",internet:false,creation:"18/04/2026 09:24",annulation:"20/04/2026 19:15"},
  {id:3,agenda:"Elnagar",date:"20/04/2026 18:45",client:"",internet:false,creation:"20/04/2026 12:58",annulation:"20/04/2026 19:15"},
  {id:4,agenda:"Elnagar",date:"21/04/2026 12:15",client:"Marley Girard",internet:true,creation:"17/04/2026 18:15",annulation:"21/04/2026 12:37"},
  {id:5,agenda:"Elnagar",date:"21/04/2026 15:45",client:"Paul Pasquereau",internet:true,creation:"17/04/2026 18:37",annulation:"21/04/2026 15:38"},
  {id:6,agenda:"Elnagar",date:"22/04/2026 12:30",client:"Hubert Blanchard",internet:true,creation:"20/04/2026 17:29",annulation:"21/04/2026 12:41"},
  {id:7,agenda:"Elnagar",date:"22/04/2026 14:00",client:"",internet:false,creation:"20/04/2026 10:45",annulation:"22/04/2026 12:10"},
  {id:8,agenda:"Elnagar",date:"22/04/2026 15:00",client:"Joachim Rouleau",internet:true,creation:"20/04/2026 23:23",annulation:"22/04/2026 11:06"},
];

const FACTURES_DATA = [
  {id:"F2424082",date:"24 avril 2026",montant:"110,40 €",statut:"Payée",conditions:"Prélèvement automatique"},
  {id:"F2355311",date:"24 mars 2026",montant:"110,40 €",statut:"Payée",conditions:"Prélèvement automatique"},
  {id:"F2289972",date:"24 février 2026",montant:"110,40 €",statut:"Payée",conditions:"Prélèvement automatique"},
  {id:"F2225610",date:"24 janvier 2026",montant:"110,40 €",statut:"Payée",conditions:"Prélèvement automatique"},
  {id:"CN-38509",date:"12 janvier 2026",montant:"110,40 €",statut:"Avoir non appliqué",conditions:"-"},
  {id:"F2157650",date:"24 décembre 2025",montant:"110,40 €",statut:"Payée",conditions:"Prélèvement automatique"},
  {id:"F2093332",date:"24 novembre 2025",montant:"110,40 €",statut:"Payée",conditions:"Prélèvement automatique"},
];

const MOIS_NOMS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const JOURS_LONG = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const JOURS_COURT = ["Lu","Ma","Me","Je","Ve","Sa","Di"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("fr-FR", {minimumFractionDigits:2}) + " €";
const now = () => { const d=new Date(); return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; };

// ─── COMPOSANTS COMMUNS ───────────────────────────────────────────────────────
function Modal({title, onClose, children, width="600px"}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:8,width,maxWidth:"95vw",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontWeight:600,fontSize:16}}>{title}</span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{background:"none",border:"1px solid #d1d5db",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:18}}>←</button>
            <button style={{background:"#4caf50",border:"none",borderRadius:6,padding:"4px 12px",cursor:"pointer",color:"#fff",fontSize:18}}>✓</button>
          </div>
        </div>
        <div style={{padding:20}}>{children}</div>
      </div>
    </div>
  );
}

function SidebarItem({label, active, onClick, indent=false}) {
  return (
    <div onClick={onClick} style={{padding:`8px ${indent?32:16}px`,cursor:"pointer",color:active?"#c9a84c":"#374151",background:active?"rgba(201,168,76,0.08)":"transparent",fontWeight:active?600:400,fontSize:14,borderLeft:active?"3px solid #c9a84c":"3px solid transparent"}}>
      {label}
    </div>
  );
}

function SidebarSection({label, open, onToggle, children}) {
  return (
    <div>
      <div onClick={onToggle} style={{padding:"8px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",color:"#111827",fontWeight:600,fontSize:14}}>
        <span>{label}</span>
        <span style={{fontSize:10,transform:open?"rotate(180deg)":"none",transition:"0.2s"}}>{open?"▼":"▶"}</span>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}

function Btn({children,onClick,variant="primary",small=false,style={}}) {
  const base = {border:"none",borderRadius:6,cursor:"pointer",fontWeight:500,padding:small?"4px 12px":"8px 16px",fontSize:small?13:14,...style};
  const variants = {
    primary:{background:"#c9a84c",color:"#fff"},
    secondary:{background:"#f3f4f6",color:"#374151",border:"1px solid #d1d5db"},
    danger:{background:"none",color:"#ef4444",padding:0,fontWeight:400},
    link:{background:"none",color:"#c9a84c",padding:0,fontWeight:400,textDecoration:"underline"},
  };
  return <button onClick={onClick} style={{...base,...variants[variant]}}>{children}</button>;
}

function RadioGroup({options, value, onChange}) {
  return (
    <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
      {options.map(o=>(
        <label key={o} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:14}}>
          <input type="radio" checked={value===o} onChange={()=>onChange(o)} />
          {o}
        </label>
      ))}
    </div>
  );
}

// ─── AGENDA ──────────────────────────────────────────────────────────────────
const RDV_DATA_SEMAINE = {
  // col index 0=Lun, 1=Mar, 2=Mer, 3=Jeu, 4=Ven, 5=Sam, 6=Dim
  0: [
    {id:1,h:"10:00",fin:"10:30",nom:"clim",prestation:"",c:"#9ca3af",icons:""},
    {id:2,h:"10:30",fin:"11:30",nom:"Franck Gagnaire",prestation:"Coupe + Barbe Elnagar choisi(e)",c:"#4a9eff",icons:"@🔒👤"},
    {id:3,h:"12:15",fin:"13:15",nom:"valentin boisgard",prestation:"Coupe + Barbe Elnagar choisi(e)",c:"#4a9eff",icons:"@🔒👤"},
    {id:4,h:"14:00",fin:"14:45",nom:"Hugo Gabillet",prestation:"Coupe homme...",c:"#4a9eff",icons:"@🔒"},
    {id:5,h:"14:45",fin:"15:30",nom:"Alexy Denis",prestation:"Coupe homme Elnagar...",c:"#4a9eff",icons:"@🔒"},
    {id:6,h:"15:30",fin:"15:45",nom:"",prestation:"",c:"#f5c842",icons:""},
    {id:7,h:"16:45",fin:"17:45",nom:"Brahim Maghza",prestation:"Coupe + Barbe Elnagar choisi(e)",c:"#4a9eff",icons:"@🔒👤"},
    {id:8,h:"18:00",fin:"18:30",nom:"Mehdi...",prestation:"",c:"#4a9eff",icons:"@🔒👤"},
    {id:9,h:"18:30",fin:"19:00",nom:"Nel...",prestation:"",c:"#4a9eff",icons:"@🔒👤"},
  ],
  1: [
    {id:10,h:"10:00",fin:"10:45",nom:"Loic Baugé",prestation:"Coupe homme Elnaga...",c:"#4a9eff",icons:"@🔒👤"},
    {id:11,h:"11:00",fin:"11:45",nom:"rocku philpe",prestation:"Coupe homme",c:"#20a090",icons:""},
    {id:12,h:"11:45",fin:"12:30",nom:"Jerome Thisse",prestation:"Coupe homme Elnaga...",c:"#4a9eff",icons:"@🔒👤"},
    {id:13,h:"13:00",fin:"14:00",nom:"Romain Poirrotte",prestation:"Coupe + Barbe Elnagar choisi(e)",c:"#4a9eff",icons:"@🔒👤"},
    {id:14,h:"16:45",fin:"17:15",nom:"tidjane faresne...",prestation:"",c:"#20a090",icons:""},
    {id:15,h:"17:15",fin:"18:00",nom:"Valentin Gabillet",prestation:"Coupe homme...",c:"#4a9eff",icons:"@🔒"},
    {id:16,h:"18:00",fin:"19:00",nom:"Sebastien Pacheco",prestation:"Coupe + Barbe Elnagar choisi(e)",c:"#4a9eff",icons:"@🔒👤"},
  ],
  2: [
    {id:17,h:"10:00",fin:"10:45",nom:"Romain Dugast",prestation:"Coupe homme Elnag...",c:"#4a9eff",icons:"@🔒"},
    {id:18,h:"13:00",fin:"13:45",nom:"Kylian Bessonnier",prestation:"Coupe homme...",c:"#5cb85c",icons:"@🔒"},
    {id:19,h:"14:30",fin:"15:00",nom:"",prestation:"",c:"#9ca3af",icons:""},
    {id:20,h:"13:00",fin:"14:00",nom:"Dylan Charloix",prestation:"Coupe + Barbe Elnagar choisi(e)",c:"#4a9eff",icons:"@🔒"},
  ],
  3: [
    {id:21,h:"10:45",fin:"11:30",nom:"saliba richard",prestation:"Coupe homme",c:"#5cb85c",icons:""},
    {id:22,h:"11:30",fin:"12:15",nom:"Alain MICHEL",prestation:"Coupe homme...",c:"#4a9eff",icons:"@🔒"},
    {id:23,h:"13:00",fin:"14:00",nom:"Dylan Charloix",prestation:"Coupe + Barbe Elnagar choisi(e)",c:"#4a9eff",icons:"@🔒"},
    {id:24,h:"15:30",fin:"16:15",nom:"Colomban Goudesenne",prestation:"Coupe homme...",c:"#4a9eff",icons:"@🔒"},
  ],
  4: [
    {id:25,h:"10:00",fin:"10:30",nom:"marcourt...",prestation:"",c:"#e8507a",icons:""},
    {id:26,h:"10:30",fin:"10:50",nom:"marcourt...",prestation:"",c:"#9060e8",icons:""},
    {id:27,h:"10:50",fin:"11:05",nom:"",prestation:"",c:"#9060e8",icons:""},
    {id:28,h:"11:05",fin:"11:35",nom:"marcourt...",prestation:"",c:"#f0a050",icons:""},
  ],
  5: [
    {id:29,h:"11:00",fin:"12:00",nom:"Vincent de CORBIER",prestation:"Coupe + Barbe Elnagar choisi(e)",c:"#4a9eff",icons:"@🔒"},
    {id:30,h:"13:45",fin:"14:30",nom:"simon pradel",prestation:"Coupe homme Elnaga...",c:"#4a9eff",icons:"@🔒"},
    {id:31,h:"14:30",fin:"15:30",nom:"Vincent Boutigny",prestation:"Coupe + Barbe",c:"#5cb85c",icons:""},
    {id:32,h:"15:45",fin:"16:30",nom:"timothée Auber Laou-Hap",prestation:"Coupe...",c:"#4a9eff",icons:"@🔒"},
  ],
  6: [],
};

function AgendaView({showNotifsProp=false, onToggleNotifs}) {
  const [vue, setVue] = useState("semaine"); // "semaine" | "jour"
  const [currentTime, setCurrentTime] = useState(now());
  const [showNotifs, setShowNotifs] = useState(showNotifsProp);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null); // index 0-6 for jour view
  const [rdvList, setRdvList] = useState(RDV_DATA_SEMAINE);
  const [showRdvModal, setShowRdvModal] = useState(false);
  const [newRdvSlot, setNewRdvSlot] = useState(null); // {col, startMin, endMin}
  const [tooltip, setTooltip] = useState(null); // {rdv, x, y}
  const [dragState, setDragState] = useState(null); // {col, startMin, endMin, dragging}

  const CELL_H = 60; // px per hour
  const START_H = 8;
  const HOURS = Array.from({length:14}, (_,i)=>i+START_H); // 8h-21h

  useEffect(()=>{const t=setInterval(()=>setCurrentTime(now()),60000);return()=>clearInterval(t);},[]);
  useEffect(()=>setShowNotifs(showNotifsProp),[showNotifsProp]);

  // Week days labels
  const getWeekDays = () => {
    const base = new Date(2026, 4, 4); // Mon 4 May 2026
    base.setDate(base.getDate() + weekOffset * 7);
    const days = [];
    const jours = ["Lun.","Mar.","Mer.","Jeu.","Ven.","Sam.","Dim."];
    const moisCourt = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
    for (let i=0; i<7; i++) {
      const d = new Date(base); d.setDate(base.getDate()+i);
      days.push({label:`${jours[i]} ${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`, date:d, dayIdx:i});
    }
    return days;
  };

  const weekRange = () => {
    const days = getWeekDays();
    const f = days[0].date, l = days[6].date;
    const m = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
    return `${String(f.getDate()).padStart(2,"0")}/${String(f.getMonth()+1).padStart(2,"0")} au ${String(l.getDate()).padStart(2,"0")}.${String(l.getMonth()+1).padStart(2,"0")}`;
  };

  const minToTop = (m) => (m - START_H*60) / 60 * CELL_H;
  const yToMin = (y) => {
    const raw = Math.floor(y / CELL_H * 60) + START_H*60;
    return Math.round((raw - START_H*60) / 15) * 15 + START_H*60;
  };
  const minToHHMM = (m) => `${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;
  const hmToMin = (hm) => { const [h,m]=hm.split(":"); return parseInt(h)*60+parseInt(m); };

  // Drag handlers
  const onMouseDown = (e, col) => {
    if (e.target.closest("[data-rdv]")) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const startMin = yToMin(y);
    setDragState({col, startMin, endMin:startMin+30, dragging:true});
  };

  const onMouseMove = (e, col) => {
    if (!dragState?.dragging || dragState.col!==col) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const endMin = yToMin(y);
    if (endMin > dragState.startMin) setDragState(s=>({...s, endMin}));
  };

  const onMouseUp = (col) => {
    if (dragState?.dragging && dragState.col===col && dragState.endMin - dragState.startMin >= 15) {
      setNewRdvSlot({col, startMin:dragState.startMin, endMin:dragState.endMin, day:getWeekDays()[col]?.label||""});
      setShowRdvModal(true);
    }
    setDragState(null);
  };

  const onAddRdv = (rdv) => {
    setRdvList(prev => ({
      ...prev,
      [rdv.col]: [...(prev[rdv.col]||[]), {
        id: Date.now(),
        h: minToHHMM(rdv.startMin),
        fin: minToHHMM(rdv.endMin),
        nom: rdv.nom||"",
        prestation: rdv.prestation||"",
        c: rdv.couleur||"#c9a84c",
        icons:"",
      }]
    }));
    setShowRdvModal(false);
  };

  const weekDays = getWeekDays();
  const colsToShow = vue==="semaine" ? weekDays : (selectedDay!==null ? [weekDays[selectedDay]] : [weekDays[0]]);
  const colData = vue==="semaine" ? rdvList : {0: rdvList[selectedDay!==null?selectedDay:0]||[]};

  return (
    <div style={{display:"flex",flex:1,overflow:"hidden",background:"#fff"}}>
      {/* Sidebar gauche */}
      <div style={{width:240,background:"#0d1b2a",borderRight:"1px solid #1e3a5f",padding:"16px 12px",overflowY:"auto",flexShrink:0,display:"flex",flexDirection:"column",gap:0}}>
        <MiniCalendrier
          vue={vue}
          weekOffset={weekOffset}
          selectedDayDate={vue==="jour"&&selectedDay!==null ? weekDays[selectedDay]?.date : null}
          activeWeekDates={weekDays.map(d=>d.date)}
          onSelectDay={(date,dayIdx)=>{
            // Calculate week offset from clicked date relative to base week (Mon 4 May 2026)
            const base = new Date(2026, 4, 4);
            const diffMs = date - base;
            const diffDays = Math.floor(diffMs / (1000*60*60*24));
            const newOffset = Math.floor(diffDays / 7);
            setWeekOffset(newOffset);
            setVue("semaine"); // always stay in semaine view
          }}
          onSelectWeek={()=>setVue("semaine")}
          onPrevWeek={()=>setWeekOffset(w=>w-1)}
          onNextWeek={()=>setWeekOffset(w=>w+1)}
        />
        <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid #e5e7eb"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>MODE PLUSIEURS AGENDAS</div>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer",marginBottom:4,color:"#94a3b8"}}>
            <input type="radio" name="mode_agenda" defaultChecked style={{accentColor:"#c9a84c"}} /> Non
          </label>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer",color:"#94a3b8"}}>
            <input type="radio" name="mode_agenda" style={{accentColor:"#c9a84c"}} /> Oui
          </label>
          <div style={{marginTop:16,fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>ÉQUIPE</div>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer",color:"#c9a84c"}}>
            <input type="radio" defaultChecked style={{accentColor:"#c9a84c"}} /> Elnagar
          </label>
        </div>
        <div style={{marginTop:"auto",paddingTop:8,borderTop:"1px solid #1e3a5f",fontSize:12,color:"#94a3b8"}}>
          <div>02/05/2026</div>
          <div>0 RDV · <span style={{color:"#c9a84c",fontWeight:600}}>0,00 €</span></div>
        </div>
      </div>

      {/* Zone principale */}
      <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column"}}>
        {/* Toolbar */}
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderBottom:"1px solid #e5e7eb",background:"#fff",position:"sticky",top:0,zIndex:10,flexShrink:0}}>
          <button style={{background:"#f3f4f6",color:"#374151",border:"1px solid #e5e7eb",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:13,fontWeight:500}}>Aujourd'hui</button>
          <button onClick={()=>setWeekOffset(w=>w-1)} style={{background:"none",border:"none",color:"#374151",cursor:"pointer",fontSize:18,padding:"0 4px"}}>‹</button>
          <button onClick={()=>setWeekOffset(w=>w+1)} style={{background:"none",border:"none",color:"#374151",cursor:"pointer",fontSize:18,padding:"0 4px"}}>›</button>
          {vue==="semaine" && <span style={{fontSize:13,color:"#374151",fontWeight:500}}>{weekRange()}</span>}
          {vue==="jour" && selectedDay!==null && <span style={{fontSize:13,color:"#374151",fontWeight:500}}>{weekDays[selectedDay]?.label}</span>}
          <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
            <div style={{display:"flex",border:"1px solid #e5e7eb",borderRadius:6,overflow:"hidden"}}>
              <button onClick={()=>setVue("jour")} style={{padding:"5px 14px",background:vue==="jour"?"#fff":"#f9fafb",color:vue==="jour"?"#374151":"#6b7280",border:"none",cursor:"pointer",fontSize:13,fontWeight:vue==="jour"?600:400,borderRight:"1px solid #e5e7eb"}}>
                Vue jour{vue==="jour"&&selectedDay!==null?` ${weekDays[selectedDay]?.date.getDate()} mai`:""}
              </button>
              <button onClick={()=>{setVue("semaine");}} style={{padding:"5px 14px",background:vue==="semaine"?"#c9a84c":"#f9fafb",color:vue==="semaine"?"#fff":"#6b7280",border:"none",cursor:"pointer",fontSize:13,fontWeight:vue==="semaine"?600:400}}>
                Vue semaine
              </button>
            </div>
            <span style={{color:"#6b7280",fontSize:13}}>⏱ 15 min</span>
            <span style={{color:"#374151",fontWeight:600,fontSize:14}}>{currentTime}</span>
          </div>
        </div>

        {/* Grille */}
        <div style={{display:"flex",flex:1,overflowX:"auto"}}>
          {/* Colonne heures */}
          <div style={{width:52,flexShrink:0,paddingTop:36}}>
            {HOURS.map(h=>(
              <div key={h} style={{height:CELL_H,borderTop:"1px solid #e5e7eb",color:"#9ca3af",fontSize:11,paddingTop:3,paddingLeft:6,textAlign:"right",paddingRight:8}}>{h}:00</div>
            ))}
          </div>

          {/* Colonnes jours */}
          <div style={{display:"flex",flex:1,minWidth:colsToShow.length===1?300:700}}>
            {colsToShow.map((day,ci)=>{
              const colIdx = vue==="jour" ? (selectedDay!==null?selectedDay:0) : ci;
              const rdvs = colData[ci] || [];
              const isToday = day.date.getDate()===2 && day.date.getMonth()===4; // 2 mai
              return (
                <div key={ci} style={{flex:1,borderLeft:"1px solid #e5e7eb",display:"flex",flexDirection:"column",minWidth:vue==="jour"?0:120}}>
                  {/* Header jour */}
                  <div onClick={()=>{ if(vue==="semaine"){setSelectedDay(colIdx);setVue("jour");}}} style={{height:36,borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:isToday?700:500,color:isToday?"#c9a84c":"#374151",background:isToday?"#fffbeb":"#fff",cursor:vue==="semaine"?"pointer":"default",position:"sticky",top:0,zIndex:8}}>
                    {isToday && <span style={{background:"#c9a84c",color:"#fff",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,marginRight:4}}>{day.date.getDate()}</span>}
                    {day.label}
                  </div>
                  {/* Cellules */}
                  <div
                    style={{position:"relative",flex:1,cursor:"crosshair",userSelect:"none"}}
                    onMouseDown={e=>onMouseDown(e,colIdx)}
                    onMouseMove={e=>onMouseMove(e,colIdx)}
                    onMouseUp={()=>onMouseUp(colIdx)}
                    onMouseLeave={()=>{ if(dragState?.col===colIdx) setDragState(null); }}
                  >
                    {HOURS.map(h=>(
                      <div key={h} style={{height:CELL_H,borderTop:"1px solid #e5e7eb",position:"relative"}}>
                        <div style={{position:"absolute",top:"50%",left:0,right:0,borderTop:"1px dashed #f3f4f6"}} />
                      </div>
                    ))}

                    {/* Ligne heure actuelle */}
                    {isToday && (() => {
                      const [hh,mm] = currentTime.split(":");
                      const top = minToTop(parseInt(hh)*60+parseInt(mm));
                      return top>=0 && top<HOURS.length*CELL_H ? (
                        <div style={{position:"absolute",top,left:0,right:0,height:2,background:"#ef4444",zIndex:6,pointerEvents:"none"}}>
                          <div style={{position:"absolute",left:-4,top:-4,width:10,height:10,borderRadius:"50%",background:"#ef4444"}} />
                        </div>
                      ):null;
                    })()}

                    {/* Drag preview */}
                    {dragState?.dragging && dragState.col===colIdx && dragState.endMin>dragState.startMin && (
                      <div style={{position:"absolute",top:minToTop(dragState.startMin),left:2,right:2,height:(dragState.endMin-dragState.startMin)/60*CELL_H-2,background:"rgba(201,168,76,0.25)",borderRadius:4,border:"2px dashed #c9a84c",pointerEvents:"none",zIndex:7,display:"flex",alignItems:"center",justifyContent:"center",color:"#c9a84c",fontSize:11,fontWeight:600}}>
                        {minToHHMM(dragState.startMin)} → {minToHHMM(dragState.endMin)}
                      </div>
                    )}

                    {/* RDV */}
                    {rdvs.map((rdv)=>{
                      const top = minToTop(hmToMin(rdv.h));
                      const h = hmToMin(rdv.fin) - hmToMin(rdv.h);
                      const height = h/60*CELL_H - 2;
                      if (height < 4) return null;
                      return (
                        <div
                          data-rdv="1"
                          key={rdv.id}
                          onClick={e=>{e.stopPropagation(); setShowRdvModal(true); setNewRdvSlot({...rdv, col:colIdx, edit:true});}}
                          onMouseEnter={e=>setTooltip({rdv, x:e.clientX, y:e.clientY})}
                          onMouseLeave={()=>setTooltip(null)}
                          style={{position:"absolute",top,left:2,right:2,height,background:rdv.c+"e6",borderRadius:4,padding:"2px 5px",overflow:"hidden",cursor:"pointer",fontSize:11,color:"#fff",borderLeft:`3px solid ${rdv.c}`,zIndex:4,boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}
                        >
                          <div style={{fontWeight:600,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{rdv.h} - {rdv.fin} {rdv.nom}</div>
                          {height>28 && rdv.prestation && <div style={{opacity:0.9,fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{rdv.prestation}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip survol RDV */}
      {tooltip && (
        <div style={{position:"fixed",left:tooltip.x+12,top:tooltip.y-10,background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px",boxShadow:"0 4px 16px rgba(0,0,0,0.15)",zIndex:1000,pointerEvents:"none",minWidth:160,maxWidth:260}}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{tooltip.rdv.h} - {tooltip.rdv.fin}</div>
          {tooltip.rdv.nom && <div style={{fontSize:13,color:"#374151"}}>{tooltip.rdv.nom}</div>}
          {tooltip.rdv.prestation && <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{tooltip.rdv.prestation}</div>}
        </div>
      )}

      {/* Panel notifications */}
      {showNotifs && (
        <div style={{width:340,background:"#fff",borderLeft:"1px solid #e5e7eb",overflowY:"auto",flexShrink:0}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:700,fontSize:16}}>Notifications</span>
            <button onClick={()=>setShowNotifs(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#9ca3af"}}>×</button>
          </div>
          <div style={{padding:16}}>
            <div style={{fontWeight:600,fontSize:12,color:"#374151",marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>À LA UNE</div>
            <div style={{background:"#f9fafb",borderRadius:6,padding:"8px 12px",marginBottom:12,fontSize:13,color:"#374151",fontWeight:500}}>En avril</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {[{n:"76",l:"Nouveaux clients",s:"dont 69 en ligne (91 %)",c:"#c9a84c"},{n:"204",l:"RDV pris",s:"dont 179 en ligne (88 %)",c:"#4a9eff"}].map(k=>(
                <div key={k.l} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:12}}>
                  <div style={{fontSize:26,fontWeight:700,color:k.c}}>{k.n}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{k.l}</div>
                  <div style={{fontSize:11,color:"#6b7280"}}>{k.s}</div>
                </div>
              ))}
            </div>
            <div style={{color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline",marginBottom:16}}>📊 Voir le rapport complet</div>
            {[{t:"Vous avez 1 avis à modérer",d:"Il y a 4 jours"},{t:"Vous avez 1 avis à modérer",d:"Il y a 7 jours"},{t:"Vous avez 1 avis à modérer",d:"Il y a 8 jours"}].map((n,i)=>(
              <div key={i} style={{padding:"11px 0",borderBottom:"1px solid #f3f4f6",fontSize:13}}>
                <div style={{color:"#374151"}}>{n.t}</div>
                <div style={{color:"#9ca3af",fontSize:12,marginTop:2}}>{n.d}</div>
              </div>
            ))}
            <div style={{marginTop:16,display:"flex",gap:16}}>
              <span style={{color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>↩ Gérer mes avis</span>
              <span style={{color:"#6b7280",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>❓ Consultez notre centre d'aide</span>
            </div>
          </div>
        </div>
      )}

      {showRdvModal && <ModalRDV onClose={()=>{setShowRdvModal(false);setNewRdvSlot(null);}} slot={newRdvSlot} onAdd={onAddRdv} />}
    </div>
  );
}

function MiniCalendrier({vue, weekOffset=0, selectedDayDate, activeWeekDates=[], onSelectDay, onSelectWeek, onPrevWeek, onNextWeek}) {
  const [mois, setMois] = useState(4); // Mai = 4
  const [annee] = useState(2026);

  // Sync month when week changes — follow the first day of active week
  useEffect(()=>{
    if(activeWeekDates.length>0){
      const d = activeWeekDates[0];
      setMois(d.getMonth());
    }
  },[weekOffset]);

  const premier = new Date(annee,mois,1).getDay();
  const decalage = premier===0?6:premier-1;
  const nbJours = new Date(annee,mois+1,0).getDate();
  const cases = Array(decalage).fill(null).concat(Array.from({length:nbJours},(_,i)=>i+1));
  while(cases.length%7!==0) cases.push(null);

  const rows = [];
  for(let i=0;i<cases.length;i+=7) rows.push(cases.slice(i,i+7));

  const todayD = 2, todayM = 4, todayY = 2026;

  const activeWeekSet = new Set(activeWeekDates.map(d=>`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`));
  const selectedKey = selectedDayDate ? `${selectedDayDate.getFullYear()}-${selectedDayDate.getMonth()}-${selectedDayDate.getDate()}` : null;

  const isToday = (d) => d===todayD && mois===todayM && annee===todayY;
  const isSelected = (d) => selectedKey === `${annee}-${mois}-${d}`;
  const isActiveWeek = (d) => activeWeekSet.has(`${annee}-${mois}-${d}`);

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontWeight:600,fontSize:14,color:"#e2e8f0"}}>{MOIS_NOMS[mois]} {annee}</span>
        <div style={{display:"flex",gap:2}}>
          <button onClick={onPrevWeek} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:16,padding:"0 4px"}}>‹</button>
          <button onClick={onNextWeek} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:16,padding:"0 4px"}}>›</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1}}>
        {["L","M","M","J","V","S","D"].map((d,i)=>(
          <div key={i} style={{textAlign:"center",color:"#4a6a8a",fontSize:11,padding:"3px 0",fontWeight:500}}>{d}</div>
        ))}
        {rows.map((row,ri)=>(
          row.map((d,ci)=>{
            const today = isToday(d);
            const selected = d && isSelected(d);
            const inWeek = d && isActiveWeek(d);
            const isFirst = inWeek && (!row[ci-1] || !isActiveWeek(row[ci-1]));
            const isLast = inWeek && (!row[ci+1] || !isActiveWeek(row[ci+1]));

            let bg = "transparent";
            let color = d ? "#94a3b8" : "transparent"; // light text on dark bg
            let borderRadius = "4px";
            let fontWeight = 400;

            if (inWeek && vue==="semaine") {
              bg = today ? "#c9a84c" : "#fef9e7";
              color = today ? "#fff" : "#374151"; // dark text on light yellow band
              fontWeight = today ? 700 : 400;
              borderRadius = isFirst && isLast ? "4px" : isFirst ? "4px 0 0 4px" : isLast ? "0 4px 4px 0" : "0";
            } else if (selected && vue==="jour") {
              bg = "#c9a84c";
              color = "#fff";
              fontWeight = 700;
              borderRadius = "4px";
            } else if (today) {
              bg = "#c9a84c";
              color = "#fff";
              fontWeight = 700;
              borderRadius = "50%";
            }

            return (
              <div
                key={`${ri}-${ci}`}
                onClick={()=>{
                  if(d){
                    // Always stay in semaine mode, just navigate to the week containing this day
                    onSelectDay && onSelectDay(new Date(annee,mois,d), ci);
                  }
                }}
                style={{textAlign:"center",fontSize:12,padding:"4px 2px",borderRadius,cursor:d?"pointer":"default",color,background:bg,fontWeight,transition:"background 0.15s"}}
              >
                {d||""}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}

function ModalRDV({onClose, slot, onAdd}) {
  const [nom, setNom] = useState("");
  const [prestation, setPrestation] = useState(null);
  const [couleur, setCouleur] = useState("#4a9eff");
  const [note, setNote] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [tab, setTab] = useState("prestation"); // prestation | client
  const filtered = CLIENTS_DATA.filter(c=>c.nom.toLowerCase().includes(clientSearch.toLowerCase())||c.tel.includes(clientSearch));

  const allPrestations = Object.values(PRESTATIONS_CAISSE).flat();

  const minToHHMM = (m) => `${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;

  const defaultH = slot?.h || (slot?.startMin ? minToHHMM(slot.startMin) : "10:00");
  const defaultFin = slot?.fin || (slot?.endMin ? minToHHMM(slot.endMin) : "10:30");
  const [heure, setHeure] = useState(defaultH);
  const [heureFin, setHeureFin] = useState(defaultFin);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:10,width:560,maxWidth:"95vw",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:600,fontSize:16}}>{slot?.edit?"Modifier le rendez-vous":"Nouveau rendez-vous"}</span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{background:"#f3f4f6",border:"none",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:13}}>Annuler</button>
            <button onClick={()=>onAdd({...slot, nom, prestation:prestation?.nom||"", couleur, note, client:selectedClient})} style={{background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,padding:"5px 16px",cursor:"pointer",fontSize:13,fontWeight:600}}>Enregistrer</button>
          </div>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
          {/* Date & heure */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>Début</div>
              <input type="time" value={heure} onChange={e=>setHeure(e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,boxSizing:"border-box"}} />
            </div>
            <div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>Fin</div>
              <input type="time" value={heureFin} onChange={e=>setHeureFin(e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,boxSizing:"border-box"}} />
            </div>
          </div>
          {/* Onglets client / prestation */}
          <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",gap:0}}>
            {["client","prestation"].map(t=>(
              <div key={t} onClick={()=>setTab(t)} style={{padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:tab===t?600:400,color:tab===t?"#c9a84c":"#6b7280",borderBottom:tab===t?"2px solid #c9a84c":"2px solid transparent"}}>
                {t==="client"?"Client":"Prestation"}
              </div>
            ))}
          </div>
          {tab==="client" && (
            <div>
              <div style={{position:"relative"}}>
                <input value={clientSearch} onChange={e=>{setClientSearch(e.target.value);setSelectedClient(null);}} placeholder="Rechercher un client..." style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,boxSizing:"border-box"}} />
                {clientSearch && !selectedClient && (
                  <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #e5e7eb",borderRadius:6,zIndex:10,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:180,overflowY:"auto"}}>
                    {filtered.slice(0,6).map(c=>(
                      <div key={c.id} onClick={()=>{setSelectedClient(c);setClientSearch(c.nom);setNom(c.nom);}} style={{padding:"8px 12px",cursor:"pointer",fontSize:13,borderBottom:"1px solid #f3f4f6"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <strong>{c.nom}</strong> <span style={{color:"#9ca3af"}}>{c.tel}</span>
                      </div>
                    ))}
                    <div style={{padding:"8px 12px",color:"#c9a84c",cursor:"pointer",fontSize:13}}>+ Créer un nouveau client</div>
                  </div>
                )}
              </div>
              {selectedClient && (
                <div style={{marginTop:8,padding:"8px 12px",background:"#f9fafb",borderRadius:6,fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:600}}>{selectedClient.nom}</div>
                    <div style={{color:"#6b7280"}}>{selectedClient.tel} · {selectedClient.email}</div>
                  </div>
                  <button onClick={()=>{setSelectedClient(null);setClientSearch("");}} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:16}}>×</button>
                </div>
              )}
            </div>
          )}
          {tab==="prestation" && (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,maxHeight:220,overflowY:"auto"}}>
                {allPrestations.map(p=>(
                  <div key={p.id} onClick={()=>{setPrestation(p);setCouleur(p.couleur);}} style={{padding:"8px 12px",border:`2px solid ${prestation?.id===p.id?p.couleur:"#e5e7eb"}`,borderRadius:6,cursor:"pointer",background:prestation?.id===p.id?"#fffbeb":"#fff",fontSize:13}} onMouseEnter={e=>e.currentTarget.style.borderColor=p.couleur} onMouseLeave={e=>{if(prestation?.id!==p.id)e.currentTarget.style.borderColor="#e5e7eb";}}>
                    <div style={{fontWeight:500,borderLeft:`3px solid ${p.couleur}`,paddingLeft:6}}>{p.nom}</div>
                    <div style={{color:"#9ca3af",fontSize:11,paddingLeft:9}}>{p.duree>0?`${p.duree} min · `:""}{p.prix===0?"Gratuit":`${p.prix} €`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Note */}
          <div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>Note</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Titre ou note..." style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,minHeight:50,resize:"vertical",boxSizing:"border-box"}} />
          </div>
          {/* Couleur RDV */}
          <div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:6,fontWeight:600,textTransform:"uppercase"}}>Couleur du RDV</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["#4a9eff","#5cb85c","#20a090","#f0a050","#e8507a","#9060e8","#ef4444","#f5c842","#9ca3af","#c9a84c"].map(c=>(
                <div key={c} onClick={()=>setCouleur(c)} style={{width:24,height:24,background:c,borderRadius:4,cursor:"pointer",border:couleur===c?"3px solid #374151":"2px solid transparent"}} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CAISSE ───────────────────────────────────────────────────────────────────
function CaisseView() {
  const [sideSection, setSideSection] = useState("Encaissement");
  const [activeSide, setActiveSide] = useState("Nouveau ticket");
  const [ticket, setTicket] = useState([]); // [{type,nom,vendeur,qte,prix,couleur,id}]
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [paiement, setPaiement] = useState("Carte");
  const [paiementDone, setPaiementDone] = useState(false);
  const [ticketsEnAttente, setTicketsEnAttente] = useState([]);

  const total = ticket.reduce((s,i)=>s + i.prix * i.qte, 0);
  const filteredClients = CLIENTS_DATA.filter(c=>c.nom.toLowerCase().includes(clientSearch.toLowerCase()));

  const sidebarSections = {
    "Encaissement": ["Nouveau ticket","Tickets en attente"],
    "Transactions": [],
    "Paiements en plusieurs fois": [],
    "Données comptables": [],
    "Cartes cadeaux & cures": [],
    "Gestion des stocks": [],
    "Paiement en ligne": [],
    "Terminal de paiement": [],
    "Tap to Pay": [],
    "Boutique en ligne": [],
  };

  const handleSideClick = (section, items) => {
    if (items.length > 0) {
      setSideSection(sideSection === section ? null : section);
    } else {
      setSideSection(section);
      setActiveSide(section);
    }
  };

  const updateItem = (idx, field, val) => {
    setTicket(t => t.map((item,i) => i===idx ? {...item, [field]: field==="qte"?Math.max(1,Number(val)):Number(val)||item[field]} : item));
  };

  const removeItem = (idx) => setTicket(t => t.filter((_,i) => i!==idx));

  const handlePaiement = () => {
    if (total === 0) return;
    setPaiementDone(true);
    setTimeout(() => {
      setPaiementDone(false);
      setTicket([]);
      setSelectedClient(null);
      setClientSearch("");
    }, 2500);
  };

  const mettreEnAttente = () => {
    if (ticket.length === 0) return;
    setTicketsEnAttente(ta => [...ta, {id: Date.now(), client: selectedClient?.nom || "Sans nom", items: [...ticket]}]);
    setTicket([]);
    setSelectedClient(null);
    setClientSearch("");
  };

  const isNewTicket = activeSide === "Nouveau ticket" || activeSide === "Encaissement";

  return (
    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      {/* Sidebar */}
      <div style={{width:220,background:"#0d1b2a",borderRight:"1px solid #1e3a5f",overflowY:"auto",flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div style={{flex:1}}>
          {Object.entries(sidebarSections).map(([section,items])=>(
            <div key={section}>
              <div onClick={()=>handleSideClick(section,items)} style={{padding:"10px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",color:(sideSection===section&&items.length>0)||activeSide===section?"#c9a84c":"#e2e8f0",fontWeight:activeSide===section||sideSection===section?600:400,fontSize:14,borderLeft:activeSide===section&&items.length===0?"3px solid #c9a84c":"3px solid transparent"}}>
                <span>{section}</span>
                {items.length>0 && <span style={{fontSize:10,color:"#94a3b8"}}>{sideSection===section?"▼":"▶"}</span>}
              </div>
              {sideSection===section && items.map(item=>(
                <div key={item} onClick={()=>setActiveSide(item)} style={{padding:"8px 16px 8px 28px",cursor:"pointer",color:activeSide===item?"#c9a84c":"#94a3b8",background:activeSide===item?"rgba(201,168,76,0.08)":"transparent",fontSize:13,borderLeft:activeSide===item?"3px solid #c9a84c":"3px solid transparent"}}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:"8px 16px",borderTop:"1px solid #1e3a5f",color:"#94a3b8",fontSize:12}}>
          <div>02/05/2026</div>
          <div>0 RDV · <span style={{color:"#c9a84c"}}>0,00 €</span></div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* Page Tickets en attente */}
        {activeSide === "Tickets en attente" && (
          <div style={{flex:1,padding:24,overflowY:"auto"}}>
            <h2 style={{fontSize:18,fontWeight:600,marginBottom:16}}>Tickets en attente</h2>
            {ticketsEnAttente.length === 0 ? (
              <div style={{textAlign:"center",color:"#9ca3af",padding:40,fontSize:14}}>Aucun ticket en attente</div>
            ) : (
              ticketsEnAttente.map(t=>(
                <div key={t.id} style={{border:"1px solid #e5e7eb",borderRadius:8,padding:16,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:600}}>{t.client}</div>
                    <div style={{fontSize:13,color:"#6b7280"}}>{t.items.length} article(s) · {fmt(t.items.reduce((s,i)=>s+i.prix*i.qte,0))}</div>
                  </div>
                  <button onClick={()=>{setTicket(t.items);setTicketsEnAttente(ta=>ta.filter(x=>x.id!==t.id));setActiveSide("Nouveau ticket");}} style={{background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13}}>Reprendre</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pages sections sans ticket */}
        {!isNewTicket && activeSide !== "Tickets en attente" && (
          <div style={{flex:1,padding:32,overflowY:"auto",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:"#6b7280"}}>
            <div style={{fontSize:48,marginBottom:16}}>{activeSide==="Transactions"?"📋":activeSide==="Paiements en plusieurs fois"?"💳":activeSide==="Données comptables"?"📊":activeSide==="Cartes cadeaux & cures"?"🎁":activeSide==="Gestion des stocks"?"📦":activeSide==="Paiement en ligne"?"🌐":activeSide==="Terminal de paiement"?"💻":activeSide==="Tap to Pay"?"📱":"🛍️"}</div>
            <div style={{fontSize:18,fontWeight:600,color:"#374151",marginBottom:8}}>{activeSide}</div>
            <div style={{fontSize:14,textAlign:"center",maxWidth:320,color:"#6b7280"}}>Section disponible via Planity Pro.</div>
          </div>
        )}

        {/* Nouveau ticket */}
        {isNewTicket && (
          <>
          <div style={{flex:1,overflowY:"auto"}}>
            {/* Client bar */}
            <div style={{padding:"12px 20px",borderBottom:"1px solid #e5e7eb",display:"flex",gap:12}}>
              <div style={{position:"relative",flex:2}}>
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9ca3af",fontSize:16}}>👤</span>
                <input value={clientSearch} onChange={e=>{setClientSearch(e.target.value);setSelectedClient(null);}} placeholder="Choisir un client" style={{width:"100%",padding:"9px 12px 9px 34px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,boxSizing:"border-box"}} />
                {clientSearch && !selectedClient && (
                  <div style={{position:"absolute",top:"100%",left:0,right:0,border:"1px solid #e5e7eb",borderRadius:6,background:"#fff",zIndex:100,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:200,overflowY:"auto"}}>
                    {filteredClients.slice(0,6).map(c=>(
                      <div key={c.id} onClick={()=>{setSelectedClient(c);setClientSearch(c.nom);}} style={{padding:"8px 12px",cursor:"pointer",fontSize:14,borderBottom:"1px solid #f3f4f6"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <strong>{c.nom}</strong> <span style={{color:"#9ca3af"}}>{c.tel}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input placeholder="🇫🇷 Téléphone" style={{flex:1,padding:"9px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} />
              <input placeholder="Email" style={{flex:1,padding:"9px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} />
            </div>

            {/* Ticket lines - style Planity */}
            <div style={{padding:"8px 0"}}>
              {ticket.map((item,idx)=>(
                <div key={idx} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderBottom:"1px solid #f3f4f6",background:"#fff"}}>
                  {/* Icône type */}
                  <div style={{width:32,height:32,borderRadius:6,background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                    {item.type==="prestation"?"📋":"📦"}
                  </div>
                  {/* Nom dropdown */}
                  <div style={{flex:2,minWidth:0}}>
                    <div style={{fontSize:10,color:"#9ca3af",marginBottom:1}}>{item.type==="prestation"?"Prestation":"Produit"}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontWeight:600,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",borderLeft:`3px solid ${item.couleur||"#c9a84c"}`,paddingLeft:6}}>{item.nom}</span>
                      <span style={{color:"#9ca3af",fontSize:12}}>▼</span>
                    </div>
                  </div>
                  {/* Vendeur */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,color:"#9ca3af",marginBottom:1}}>par</div>
                    <div style={{display:"flex",alignItems:"center",gap:2,fontSize:13,color:"#6b7280",cursor:"pointer"}}>
                      Choisir un vendeur <span style={{fontSize:11}}>▼</span>
                    </div>
                  </div>
                  {/* Quantité */}
                  <div style={{display:"flex",alignItems:"center",gap:0,border:"1px solid #d1d5db",borderRadius:6,overflow:"hidden",flexShrink:0}}>
                    <button onClick={()=>updateItem(idx,"qte",item.qte-1)} style={{width:28,height:32,background:"#f9fafb",border:"none",cursor:"pointer",fontSize:16,color:"#374151"}}>−</button>
                    <input type="number" value={item.qte} onChange={e=>updateItem(idx,"qte",e.target.value)} style={{width:32,height:32,border:"none",textAlign:"center",fontSize:14,fontWeight:600}} />
                    <button onClick={()=>updateItem(idx,"qte",item.qte+1)} style={{width:28,height:32,background:"#f9fafb",border:"none",cursor:"pointer",fontSize:16,color:"#374151"}}>+</button>
                  </div>
                  {/* Prix */}
                  <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                    <input type="number" value={item.prix} onChange={e=>updateItem(idx,"prix",e.target.value)} style={{width:72,padding:"4px 6px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,textAlign:"right",fontWeight:600,color:"#c9a84c"}} />
                    <span style={{fontSize:13,color:"#6b7280"}}>€</span>
                  </div>
                  {/* Supprimer */}
                  <button onClick={()=>removeItem(idx)} style={{background:"none",border:"1px solid #e5e7eb",borderRadius:6,width:28,height:28,cursor:"pointer",color:"#9ca3af",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
                </div>
              ))}
            </div>

            {/* Boutons ajout */}
            <div style={{padding:"12px 16px",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{color:"#9ca3af",fontSize:18,marginRight:4}}>+</span>
              {["Prestation","Produit","Montant libre","Remise"].map(b=>(
                <button key={b} onClick={()=>setModalType(b)} style={{background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontWeight:500,fontSize:13}}>
                  {b}
                </button>
              ))}
            </div>

            {ticket.length === 0 && (
              <div style={{textAlign:"center",color:"#9ca3af",padding:40,fontSize:14}}>Ajouter une prestation ou un produit</div>
            )}
          </div>

          {/* Barre paiement en bas à droite - style Planity */}
          <div style={{width:300,borderLeft:"1px solid #e5e7eb",display:"flex",flexDirection:"column",background:"#fff"}}>
            <div style={{flex:1,padding:16,overflowY:"auto"}}>
              <div style={{fontWeight:600,fontSize:16,marginBottom:12}}>Ticket</div>
              {ticket.length===0 ? (
                <div style={{color:"#9ca3af",fontSize:13,textAlign:"center",paddingTop:20}}>Ajouter une prestation</div>
              ) : (
                ticket.map((item,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6,gap:8}}>
                    <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.nom} {item.qte>1?`×${item.qte}`:""}</span>
                    <span style={{color:"#c9a84c",fontWeight:600,flexShrink:0}}>{fmt(item.prix*item.qte)}</span>
                  </div>
                ))
              )}
            </div>
            <div style={{padding:"12px 16px",borderTop:"1px solid #e5e7eb"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:15,marginBottom:12}}>
                <span>Total</span>
                <span style={{color:"#c9a84c"}}>{fmt(total)}</span>
              </div>
              <div style={{display:"flex",gap:4,marginBottom:10}}>
                {["Carte","Espèces","Virement"].map(m=>(
                  <button key={m} onClick={()=>setPaiement(m)} style={{flex:1,padding:"6px 4px",border:"1px solid #d1d5db",borderRadius:6,cursor:"pointer",background:paiement===m?"#c9a84c":"#fff",color:paiement===m?"#fff":"#374151",fontSize:12,fontWeight:paiement===m?600:400}}>
                    {m==="Carte"?"💳":m==="Espèces"?"💵":"🏦"} {m}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={mettreEnAttente} style={{flex:1,background:"none",border:"1px solid #d1d5db",borderRadius:6,padding:"10px",fontSize:13,cursor:"pointer",color:"#374151",fontWeight:500}}>
                  Mettre en attente
                </button>
                <button onClick={handlePaiement} style={{flex:2,background:total>0?"#c9a84c":"#e5e7eb",color:total>0?"#fff":"#9ca3af",border:"none",borderRadius:6,padding:"10px",fontSize:14,fontWeight:700,cursor:total>0?"pointer":"default"}}>
                  {paiementDone?"✓ Encaissé !":total>0?`Paiement ${fmt(total)}`:"Paiement 0,00 €"}
                </button>
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Modals */}
      {modalType==="Prestation" && (
        <Modal title="Choisir une prestation" onClose={()=>setModalType(null)} width="700px">
          <div style={{display:"flex",gap:0}}>
            <div style={{width:180,borderRight:"1px solid #e5e7eb",paddingRight:0}}>
              <input placeholder="🔍 Choisir une prestation" style={{width:"100%",padding:"8px 12px",border:"none",borderBottom:"1px solid #e5e7eb",fontSize:13,boxSizing:"border-box"}} />
              {Object.keys(PRESTATIONS_CAISSE).map(cat=>(
                <div key={cat} style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"#374151",borderBottom:"1px solid #f3f4f6"}}>{cat}</div>
              ))}
              <div style={{padding:"10px 14px",cursor:"pointer",color:"#c9a84c",fontSize:13,display:"flex",alignItems:"center",gap:4}}>⊕ Créer une prestation</div>
            </div>
            <div style={{flex:1,paddingLeft:0,maxHeight:420,overflowY:"auto"}}>
              {Object.values(PRESTATIONS_CAISSE).flat().map(p=>(
                <div key={p.id} onClick={()=>{setTicket(t=>[...t,{...p,type:"prestation",qte:1}]);setModalType(null);}} style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",borderBottom:"1px solid #f3f4f6",cursor:"pointer",fontSize:14,alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <div style={{borderLeft:`3px solid ${p.couleur}`,paddingLeft:10}}>
                    <div style={{fontWeight:500}}>{p.nom}</div>
                    <div style={{color:"#9ca3af",fontSize:12}}>{p.duree>0?`${p.duree} min · `:""}{p.prix===0?"Gratuit":`${p.prix},00 €`}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {modalType==="Produit" && (
        <Modal title="Choisir un produit" onClose={()=>setModalType(null)} width="700px">
          <div style={{display:"flex",gap:0}}>
            <div style={{width:180,borderRight:"1px solid #e5e7eb"}}>
              <input placeholder="🔍 Choisir un produit" style={{width:"100%",padding:"8px 12px",border:"none",borderBottom:"1px solid #e5e7eb",fontSize:13,boxSizing:"border-box"}} />
              {Object.keys(PRODUITS_CAISSE).map(cat=>(
                <div key={cat} style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"#374151",borderBottom:"1px solid #f3f4f6"}}>{cat}</div>
              ))}
            </div>
            <div style={{flex:1,maxHeight:420,overflowY:"auto"}}>
              {Object.values(PRODUITS_CAISSE).flat().map(p=>(
                <div key={p.id} onClick={()=>{setTicket(t=>[...t,{...p,type:"produit",qte:1}]);setModalType(null);}} style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",borderBottom:"1px solid #f3f4f6",cursor:"pointer",fontSize:14,alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <div style={{fontWeight:500}}>{p.nom}</div>
                  <span style={{color:"#c9a84c",fontSize:13}}>{p.prix},00 € · <span style={{color:"#9ca3af"}}>{p.stock} en stock</span></span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {modalType==="Montant libre" && (
        <Modal title="Montant libre" onClose={()=>setModalType(null)} width="400px">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={{display:"block",fontSize:12,color:"#6b7280",marginBottom:4}}>Libellé</label>
              <input id="ml-nom" placeholder="Description" style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,boxSizing:"border-box"}} />
            </div>
            <div>
              <label style={{display:"block",fontSize:12,color:"#6b7280",marginBottom:4}}>Montant (€)</label>
              <input id="ml-prix" type="number" placeholder="0" style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,boxSizing:"border-box"}} />
            </div>
            <button onClick={()=>{
              const nom=document.getElementById("ml-nom").value||"Montant libre";
              const prix=parseFloat(document.getElementById("ml-prix").value)||0;
              setTicket(t=>[...t,{type:"montant",nom,prix,qte:1,couleur:"#c9a84c"}]);
              setModalType(null);
            }} style={{background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,padding:"10px",cursor:"pointer",fontSize:14,fontWeight:600}}>Ajouter</button>
          </div>
        </Modal>
      )}

      {modalType==="Remise" && (
        <Modal title="Appliquer une remise" onClose={()=>setModalType(null)} width="480px">
          <div>
            {REMISES_DATA.map(r=>(
              <div key={r.id} onClick={()=>{
                const montantRemise = r.type==="fixe" ? -r.valeur : -(total*r.valeur/100);
                setTicket(t=>[...t,{type:"remise",nom:`Remise ${r.nom}`,prix:montantRemise,qte:1,couleur:"#ef4444"}]);
                setModalType(null);
              }} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f3f4f6",cursor:"pointer",fontSize:14}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <span style={{fontWeight:500}}>{r.nom}</span>
                <span style={{color:"#c9a84c"}}>{r.type==="fixe"?`-${r.valeur} €`:`-${r.valeur} %`}</span>
              </div>
            ))}
            <div style={{marginTop:16}}>
              <label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:4}}>Remise manuelle (€)</label>
              <div style={{display:"flex",gap:8}}>
                <input id="remise-libre" type="number" placeholder="0" style={{flex:1,padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} />
                <button onClick={()=>{
                  const v=parseFloat(document.getElementById("remise-libre").value)||0;
                  if(v>0){setTicket(t=>[...t,{type:"remise",nom:`Remise -${v}€`,prix:-v,qte:1,couleur:"#ef4444"}]);}
                  setModalType(null);
                }} style={{background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13}}>Appliquer</button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
function ClientsView() {
  const [activeSection, setActiveSection] = useState("Gestion");
  const [openSections, setOpenSections] = useState({fichier:true});
  const [search, setSearch] = useState("");

  const toggle = (k) => setOpenSections(s=>({...s,[k]:!s[k]}));
  const filtered = CLIENTS_DATA.filter(c=>c.nom.toLowerCase().includes(search.toLowerCase())||c.tel.includes(search));

  return (
    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      {/* Sidebar */}
      <div style={{width:220,background:"#0d1b2a",borderRight:"1px solid #1e3a5f",overflowY:"auto",flexShrink:0}}>
        <SidebarSection label="Fichier client" open={openSections.fichier} onToggle={()=>toggle("fichier")}>
          <div onClick={()=>setActiveSection("Gestion")} style={{padding:"8px 16px 8px 28px",cursor:"pointer",color:activeSection==="Gestion"?"#c9a84c":"#94a3b8",fontSize:14,borderLeft:activeSection==="Gestion"?"3px solid #c9a84c":"3px solid transparent"}}>Gestion</div>
          <div onClick={()=>setActiveSection("Doublons")} style={{padding:"8px 16px 8px 28px",cursor:"pointer",color:activeSection==="Doublons"?"#c9a84c":"#94a3b8",fontSize:14,borderLeft:activeSection==="Doublons"?"3px solid #c9a84c":"3px solid transparent"}}>Doublons</div>
        </SidebarSection>
        <SidebarSection label="Mes avis" open={openSections.avis} onToggle={()=>toggle("avis")}>
          {["Avis à modérer","Avis modérés","Avis refusés","Règles de modération","Statistiques avis"].map(i=>(
            <div key={i} onClick={()=>setActiveSection(i)} style={{padding:"8px 16px 8px 28px",cursor:"pointer",color:activeSection===i?"#c9a84c":"#94a3b8",fontSize:13,borderLeft:activeSection===i?"3px solid #c9a84c":"3px solid transparent"}}>{i}</div>
          ))}
        </SidebarSection>
        <SidebarSection label="Statistiques clients" open={openSections.stats} onToggle={()=>toggle("stats")}>
          {["100 meilleurs clients","Nouveaux clients","Fréquences globales"].map(i=>(
            <div key={i} onClick={()=>setActiveSection(i)} style={{padding:"8px 16px 8px 28px",cursor:"pointer",color:activeSection===i?"#c9a84c":"#94a3b8",fontSize:13,borderLeft:activeSection===i?"3px solid #c9a84c":"3px solid transparent"}}>{i}</div>
          ))}
        </SidebarSection>
      </div>

      {/* Main */}
      <div style={{flex:1,padding:24,overflowY:"auto",background:"#fff"}}>
        {(activeSection==="Gestion"||activeSection==="Doublons") && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div style={{display:"flex",gap:12,flex:1}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Chercher un client par nom ou téléphone" style={{flex:1,maxWidth:400,padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} />
                <Btn>Créer</Btn>
              </div>
              <div style={{display:"flex",gap:12,color:"#6b7280",fontSize:13,alignItems:"center"}}>
                <span style={{cursor:"pointer",textDecoration:"underline"}}>Afficher les clients supprimés</span>
                <span>Nbre de clients: {CLIENTS_DATA.length}</span>
              </div>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <tbody>
                {filtered.map(c=>(
                  <tr key={c.id} style={{borderBottom:"1px solid #f3f4f6"}}>
                    <td style={{padding:"12px 8px",fontSize:14}}>
                      <strong>{c.nom}</strong>{" "}
                      <span style={{color:"#6b7280"}}>{c.tel}{c.email?` - ${c.email}`:""}</span>
                    </td>
                    {c.visites>0 && <>
                      <td style={{padding:"12px 8px",color:"#c9a84c",fontSize:12,textAlign:"right",width:80}}>{c.visites} visites</td>
                      <td style={{padding:"12px 8px",color:"#c9a84c",fontSize:12,textAlign:"right",width:80}}>{fmt(c.ca)}</td>
                    </>}
                    <td style={{padding:"12px 8px",textAlign:"right",width:160}}>
                      <span style={{color:"#6b7280",cursor:"pointer",fontSize:13,marginRight:8}}>Modifier</span>
                      <span style={{color:"#ef4444",cursor:"pointer",fontSize:13}}>Supprimer</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeSection==="100 meilleurs clients" && (
          <div>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:16}}>100 meilleurs clients</h3>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
                <th style={{padding:"10px 8px",textAlign:"left",fontSize:13,fontWeight:600}}>Client</th>
                <th style={{padding:"10px 8px",textAlign:"right",fontSize:13,fontWeight:600}}>Visites</th>
                <th style={{padding:"10px 8px",textAlign:"right",fontSize:13,fontWeight:600}}>CA</th>
              </tr></thead>
              <tbody>
                {[...CLIENTS_DATA].sort((a,b)=>b.ca-a.ca).map(c=>(
                  <tr key={c.id} style={{borderBottom:"1px solid #f3f4f6"}}>
                    <td style={{padding:"10px 8px",fontSize:14}}><strong>{c.nom}</strong> <span style={{color:"#9ca3af",fontSize:12}}>{c.tel}</span></td>
                    <td style={{padding:"10px 8px",textAlign:"right",color:"#c9a84c",fontSize:13}}>{c.visites}</td>
                    <td style={{padding:"10px 8px",textAlign:"right",color:"#c9a84c",fontSize:13}}>{fmt(c.ca)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {(activeSection==="Avis à modérer"||activeSection==="Avis modérés"||activeSection==="Avis refusés") && (
          <div style={{textAlign:"center",color:"#9ca3af",marginTop:60,fontSize:14}}>Aucun avis à afficher pour le moment.</div>
        )}
        {activeSection==="Statistiques avis" && (
          <div>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:16}}>Statistiques avis</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {[{l:"Note moyenne",v:"4.8/5"},{l:"Total avis",v:"47"},{l:"Taux de réponse",v:"92%"}].map(s=>(
                <div key={s.l} style={{background:"#f9fafb",borderRadius:8,padding:20,textAlign:"center"}}>
                  <div style={{fontSize:28,fontWeight:700,color:"#c9a84c"}}>{s.v}</div>
                  <div style={{color:"#6b7280",fontSize:13,marginTop:4}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeSection==="Fréquences globales" && (
          <div>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:16}}>Fréquences globales</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[{l:"Hebdomadaire",v:"12%"},{l:"Bi-mensuel",v:"28%"},{l:"Mensuel",v:"35%"},{l:"Trimestriel",v:"25%"}].map(f=>(
                <div key={f.l} style={{background:"#f9fafb",borderRadius:8,padding:16,textAlign:"center"}}>
                  <div style={{fontSize:24,fontWeight:700,color:"#c9a84c"}}>{f.v}</div>
                  <div style={{color:"#6b7280",fontSize:12,marginTop:4}}>{f.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeSection==="Nouveaux clients" && (
          <div>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:16}}>Nouveaux clients — Mai 2026</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              <div style={{background:"#f9fafb",borderRadius:8,padding:20}}>
                <div style={{fontSize:28,fontWeight:700,color:"#c9a84c"}}>76</div>
                <div style={{color:"#6b7280",fontSize:13,marginTop:4}}>Nouveaux clients dont 69 en ligne (91%)</div>
              </div>
              <div style={{background:"#f9fafb",borderRadius:8,padding:20}}>
                <div style={{fontSize:28,fontWeight:700,color:"#4a9eff"}}>204</div>
                <div style={{color:"#6b7280",fontSize:13,marginTop:4}}>RDV pris dont 179 en ligne (88%)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminView() {
  const [openSections, setOpenSections] = useState({agenda:true});
  const [activePage, setActivePage] = useState("Gestion des prestations");
  const toggle = (k) => setOpenSections(s=>({...s,[k]:!s[k]}));

  const menuConfig = {
    "Paramètres Agenda": ["Gestion des prestations","Gestion des agendas","Gestion de l'affichage des RDV","Contenu de marque"],
    "Paramètres Caisse": ["Gestion des produits","Gestion des remises","Gestion de la fidélité","Gestion des cartes cadeaux","Gestion des cures","Gestion des moyens de paiement"],
    "Paramètres Établissement": ["Coordonnées et message","Gestion des photos","Descriptif établissement","Notifications","Gestion horaires et délais","Gestion liste d'attente","Bouton Google","Bouton Facebook et Instagram"],
    "Rendez-vous visio": ["Configuration"],
    "Gestion Temps de Travail": [],
    "Accès": ["Gestion des utilisateurs","Gestion des codes d'accès"],
    "SMS & Emails": ["Consommation","Campagnes SMS","Notifications par mail"],
    "Fiche clients": ["Gestion fiche clients"],
    "Statistiques RDV": ["Indicateurs clés","Autres indicateurs","Prestations","Collaborateurs","RDV","RDV pas venus"],
    "Taux d'occupation": ["Vue d'ensemble","Prestations","Collaborateurs"],
    "Corbeille RDV": ["RDV annulés"],
    "Mon site internet": [],
    "Intégration": ["Intégration Chift"],
    "Mes paiements & factures": ["Moyen de paiement","Liste des factures"],
  };

  return (
    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      {/* Sidebar */}
      <div style={{width:230,background:"#0d1b2a",borderRight:"1px solid #1e3a5f",overflowY:"auto",flexShrink:0,fontSize:14}}>
        {Object.entries(menuConfig).map(([section,items])=>(
          <div key={section}>
            <div onClick={()=>{ toggle(section); if(items.length===0) setActivePage(section); }} style={{padding:"10px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",color:activePage===section?"#c9a84c":"#e2e8f0",fontWeight:activePage===section?600:400}}>
              <span>{section}</span>
              {items.length>0 && <span style={{fontSize:9,color:"#94a3b8"}}>{openSections[section]?"▼":"▶"}</span>}
            </div>
            {openSections[section] && items.map(item=>(
              <div key={item} onClick={()=>setActivePage(item)} style={{padding:"7px 16px 7px 28px",cursor:"pointer",color:activePage===item?"#c9a84c":"#94a3b8",fontSize:13,borderLeft:activePage===item?"3px solid #c9a84c":"3px solid transparent",background:activePage===item?"rgba(201,168,76,0.08)":"transparent"}}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{flex:1,overflowY:"auto",background:"#fff"}}>
        <AdminContent page={activePage} onNavigate={setActivePage} />
      </div>
    </div>
  );
}

function AdminContent({page, onNavigate}) {
  switch(page) {
    case "Gestion des prestations": return <AdminPrestations />;
    case "Gestion des agendas": return <AdminAgendas />;
    case "Gestion de l'affichage des RDV": return <AdminAffichageRDV />;
    case "Gestion des produits": return <AdminProduits />;
    case "Gestion des remises": return <AdminRemises />;
    case "Gestion des cartes cadeaux": return <AdminCartesCadeaux />;
    case "Coordonnées et message": return <AdminCoordonnees />;
    case "Gestion des photos": return <AdminPhotos />;
    case "Descriptif établissement": return <AdminDescriptif />;
    case "Notifications": return <AdminNotifications />;
    case "Gestion horaires et délais": return <AdminHoraires />;
    case "Gestion liste d'attente": return <AdminListeAttente />;
    case "Bouton Google": return <AdminBoutonGoogle />;
    case "Bouton Facebook et Instagram": return <AdminBoutonFacebook />;
    case "Configuration": return <AdminVisio />;
    case "Gestion des utilisateurs": return <AdminUtilisateurs />;
    case "Consommation": return <AdminConsommation />;
    case "Campagnes SMS": return <AdminCampagnesSMS />;
    case "Notifications par mail": return <AdminNotifMail />;
    case "Gestion fiche clients": return <AdminFicheClients />;
    case "Indicateurs clés": return <AdminStatsCles />;
    case "Autres indicateurs": return <AdminStatsAutres />;
    case "Prestations": return <AdminStatsPrestations />;
    case "Collaborateurs": return <AdminStatsCollaborateurs />;
    case "RDV": return <AdminStatsRDV />;
    case "RDV pas venus": return <AdminStatsRDVPasVenus />;
    case "Vue d'ensemble": return <AdminTauxOccupation />;
    case "RDV annulés": return <AdminCorbeille />;
    case "Intégration Chift": return <AdminIntegration />;
    case "Moyen de paiement": return <AdminMoyenPaiement />;
    case "Liste des factures": return <AdminFactures />;
    default: return <div style={{padding:24,color:"#6b7280"}}>Fonctionnalité à venir.</div>;
  }
}

// ── Admin : Gestion des prestations
function AdminPrestations() {
  const [prestations, setPrestations] = useState(
    Object.fromEntries(Object.entries(PRESTATIONS_ADMIN).map(([k,v])=>[k,v.map(p=>({...p,deleted:false}))]))
  );
  const [catOrder, setCatOrder] = useState(Object.keys(PRESTATIONS_ADMIN));
  const [editModal, setEditModal] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [editData, setEditData] = useState({});
  const [addCatModal, setAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [reorderMode, setReorderMode] = useState(false);
  const [dragCat, setDragCat] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2500); };

  const openEdit = (p, cat) => {
    setEditData({...p, cat, abrev:p.abrev||"", description:p.description||"", couleur:p.couleur||"#c9a84c", visibilite:p.visibilite||"Prestation réservable", rdvDelai:1, annulDelai:6, frequence:15});
    setEditModal({p, cat});
    setShowPalette(false);
  };

  const saveEdit = () => {
    setPrestations(prev => ({
      ...prev,
      [editData.cat]: prev[editData.cat].map(p => p.id===editData.id ? {...editData} : p)
    }));
    setEditModal(null);
    showToast("Prestation modifiée");
  };

  const deletePrestation = (cat, id) => {
    setPrestations(prev => ({
      ...prev,
      [cat]: prev[cat].map(p => p.id===id ? {...p, deleted:true} : p)
    }));
    showToast("Prestation supprimée");
  };

  const restorePrestation = (cat, id) => {
    setPrestations(prev => ({
      ...prev,
      [cat]: prev[cat].map(p => p.id===id ? {...p, deleted:false} : p)
    }));
    showToast("Prestation restaurée");
  };

  const deleteCategory = (cat) => {
    setCatOrder(o => o.filter(c=>c!==cat));
    setPrestations(prev => {const n={...prev}; delete n[cat]; return n;});
    showToast("Catégorie supprimée");
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    setCatOrder(o=>[...o, newCatName]);
    setPrestations(prev=>({...prev, [newCatName]:[]}));
    setNewCatName("");
    setAddCatModal(false);
    showToast("Catégorie ajoutée");
  };

  const moveCatUp = (cat) => {
    const idx = catOrder.indexOf(cat);
    if (idx === 0) return;
    const newOrder = [...catOrder];
    [newOrder[idx-1], newOrder[idx]] = [newOrder[idx], newOrder[idx-1]];
    setCatOrder(newOrder);
  };

  const moveCatDown = (cat) => {
    const idx = catOrder.indexOf(cat);
    if (idx === catOrder.length-1) return;
    const newOrder = [...catOrder];
    [newOrder[idx], newOrder[idx+1]] = [newOrder[idx+1], newOrder[idx]];
    setCatOrder(newOrder);
  };

  const addPrestation = (cat) => {
    const newId = Date.now();
    const newP = {id:newId, nom:"Nouvelle prestation", duree:30, prix:0, couleur:"#c9a84c", deleted:false};
    setPrestations(prev=>({...prev,[cat]:[...prev[cat],newP]}));
    openEdit(newP, cat);
  };

  return (
    <div style={{padding:24}}>
      {toast && <div style={{position:"fixed",top:20,right:20,background:"#374151",color:"#fff",padding:"10px 20px",borderRadius:8,zIndex:2000,fontSize:14}}>{toast}</div>}

      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <button onClick={()=>setAddCatModal(true)} style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>⊕ Ajouter une catégorie de prestations</button>
        <button onClick={()=>setReorderMode(r=>!r)} style={{background:"none",border:"none",color:reorderMode?"#4a9eff":"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>≡ {reorderMode?"Terminer l'ordre":"Ordonner les catégories"}</button>
        <button onClick={()=>setShowDeleted(s=>!s)} style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline",marginLeft:"auto"}}>👁 {showDeleted?"Masquer les supprimées":"Afficher les prestations supprimées"}</button>
        <button style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>€ Éditer les prix en masse</button>
      </div>

      {catOrder.filter(cat=>prestations[cat]).map((cat)=>{
        const items = prestations[cat] || [];
        const visible = showDeleted ? items : items.filter(p=>!p.deleted);
        return (
          <div key={cat} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#f9fafb",padding:"10px 16px",borderRadius:6,marginBottom:2}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {reorderMode && (
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    <button onClick={()=>moveCatUp(cat)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#6b7280",lineHeight:1}}>▲</button>
                    <button onClick={()=>moveCatDown(cat)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#6b7280",lineHeight:1}}>▼</button>
                  </div>
                )}
                <span style={{fontWeight:600,fontSize:15}}>{cat}</span>
              </div>
              <div style={{display:"flex",gap:12}}>
                <button onClick={()=>addPrestation(cat)} style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>Ajouter une prestation</button>
                <button onClick={()=>deleteCategory(cat)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:13}}>Supprimer la catégorie</button>
              </div>
            </div>
            {visible.length === 0 && <div style={{padding:"12px 16px",color:"#9ca3af",fontSize:13}}>Aucune prestation{showDeleted?"":" active"}.</div>}
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                {visible.length>0 && <tr style={{borderBottom:"1px solid #e5e7eb"}}>
                  <th style={{padding:"6px 12px",textAlign:"left",fontSize:11,color:"#9ca3af",fontWeight:500}}>Prestation</th>
                  <th style={{padding:"6px 12px",textAlign:"left",fontSize:11,color:"#9ca3af",fontWeight:500}}>Durée</th>
                  <th style={{padding:"6px 12px",textAlign:"left",fontSize:11,color:"#9ca3af",fontWeight:500}}>Prix</th>
                  <th style={{padding:"6px 12px",textAlign:"left",fontSize:11,color:"#9ca3af",fontWeight:500}}>Actions</th>
                </tr>}
              </thead>
              <tbody>
                {visible.map(p=>(
                  <tr key={p.id} style={{borderBottom:"1px solid #f3f4f6",opacity:p.deleted?0.5:1}}>
                    <td style={{padding:"12px 12px",fontSize:14,display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:4,height:20,background:p.couleur||"#c9a84c",borderRadius:2,flexShrink:0}} />
                      <span style={{textDecoration:p.deleted?"line-through":"none"}}>{p.nom}</span>
                      {p.deleted && <span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"1px 6px",borderRadius:4}}>Supprimée</span>}
                    </td>
                    <td style={{padding:"12px",fontSize:14,color:"#6b7280"}}>{p.duree} min</td>
                    <td style={{padding:"12px",fontSize:14,color:"#c9a84c",fontWeight:500}}>{p.prix===0?"Gratuit":`${p.prix},00 €`}</td>
                    <td style={{padding:"12px"}}>
                      {p.deleted ? (
                        <button onClick={()=>restorePrestation(cat,p.id)} style={{background:"none",border:"none",color:"#4a9eff",cursor:"pointer",fontSize:13}}>Restaurer</button>
                      ) : (
                        <>
                          <button onClick={()=>openEdit({...p},cat)} style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,marginRight:12}}>Modifier</button>
                          <button onClick={()=>deletePrestation(cat,p.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:13}}>Supprimer</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Modal ajouter catégorie */}
      {addCatModal && (
        <Modal title="Nouvelle catégorie" onClose={()=>setAddCatModal(false)} width="400px">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Nom de la catégorie" style={{padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} onKeyDown={e=>e.key==="Enter"&&addCategory()} />
            <button onClick={addCategory} style={{background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,padding:"10px",cursor:"pointer",fontSize:14,fontWeight:600}}>Créer</button>
          </div>
        </Modal>
      )}

      {/* Modal modifier prestation */}
      {editModal && (
        <Modal title={editData.id===editModal.p.id&&editModal.p.nom==="Nouvelle prestation"?"Nouvelle prestation":"Modifier une prestation"} onClose={()=>setEditModal(null)} width="700px">
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[["NOM","nom","text"],["ABRÉVIATION","abrev","text"]].map(([label,field,type])=>(
              <div key={field} style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:12,alignItems:"center"}}>
                <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase"}}>{label}</label>
                <input type={type} value={editData[field]||""} onChange={e=>setEditData(d=>({...d,[field]:e.target.value}))} style={{padding:"8px 12px",border:field==="nom"?"2px solid #4a9eff":"1px solid #d1d5db",borderRadius:6,fontSize:14}} />
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:12,alignItems:"start"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",marginTop:8}}>DESCRIPTION</label>
              <textarea value={editData.description||""} onChange={e=>setEditData(d=>({...d,description:e.target.value}))} style={{padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,minHeight:70,resize:"vertical"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:12,alignItems:"start"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",marginTop:4}}>COULEUR</label>
              <div>
                <div onClick={()=>setShowPalette(p=>!p)} style={{width:36,height:36,background:editData.couleur,borderRadius:6,cursor:"pointer",border:"2px solid #e5e7eb"}} />
                {showPalette && (
                  <div style={{marginTop:8,padding:8,border:"1px solid #e5e7eb",borderRadius:8,display:"inline-block",background:"#fff",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>
                    {PALETTE.map((row,ri)=>(
                      <div key={ri} style={{display:"flex",gap:3,marginBottom:3}}>
                        {row.map((c,ci)=>(
                          <div key={ci} onClick={()=>{setEditData(d=>({...d,couleur:c}));setShowPalette(false);}} style={{width:28,height:28,background:c,borderRadius:4,cursor:"pointer",border:editData.couleur===c?"3px solid #111":"2px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11}}>
                            {editData.couleur===c?"✓":""}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:12,alignItems:"center"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase"}}>PRIX TTC</label>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" value={editData.prix} onChange={e=>setEditData(d=>({...d,prix:Number(e.target.value)}))} style={{width:80,padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} /> <span>€</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:12,alignItems:"center"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase"}}>DURÉE</label>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" value={editData.duree} onChange={e=>setEditData(d=>({...d,duree:Number(e.target.value)}))} style={{width:80,padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} /> <span style={{color:"#6b7280"}}>min.</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:12,alignItems:"center"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase"}}>VISIBILITÉ</label>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {["Prestation réservable","Affichée mais non réservable","Masquée sur le portail"].map(v=>(
                  <label key={v} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer"}}>
                    <input type="radio" checked={editData.visibilite===v} onChange={()=>setEditData(d=>({...d,visibilite:v}))} /> {v}
                  </label>
                ))}
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}>
              <button onClick={()=>setEditModal(null)} style={{padding:"8px 20px",border:"1px solid #d1d5db",borderRadius:6,cursor:"pointer",background:"#fff",fontSize:14}}>Annuler</button>
              <button onClick={saveEdit} style={{padding:"8px 20px",background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:14,fontWeight:600}}>Enregistrer</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Admin : Gestion agendas
function AdminAgendas() {
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",gap:16,marginBottom:20}}>
        <Btn variant="link">≡ Ordonner les catégories</Btn>
        <Btn variant="link">⇄ Synchroniser avec partenaires</Btn>
        <label style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#6b7280"}}>
          <input type="checkbox" defaultChecked /> Sans préférence : attribuer aléatoirement
        </label>
      </div>
      <div style={{border:"1px solid #e5e7eb",borderRadius:8}}>
        <div style={{padding:"12px 16px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:600}}>Équipe</span>
          <div style={{display:"flex",gap:16}}>
            <Btn variant="link" small>Ajouter un agenda</Btn>
            <Btn variant="link" small>Modifier</Btn>
          </div>
        </div>
        <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderLeft:"3px solid #4a9eff"}}>
          <span style={{fontSize:14}}>Elnagar</span>
          <div style={{display:"flex",gap:16}}>
            <span style={{color:"#6b7280",cursor:"pointer",fontSize:13}}>Dupliquer</span>
            <span style={{color:"#c9a84c",cursor:"pointer",fontSize:13}}>Modifier</span>
            <span style={{color:"#ef4444",cursor:"pointer",fontSize:13}}>Supprimer</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin : Affichage RDV
function AdminAffichageRDV() {
  const [fields, setFields] = useState([
    {nom:"Couleur dans le RDV",afficher:true,movable:false},
    {nom:"Horaires",afficher:true,movable:true},
    {nom:"Nom du client",afficher:true,movable:true},
    {nom:"Prestation(s)",afficher:true,movable:true},
    {nom:"Titre ou note",afficher:true,movable:true},
  ]);
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:18,fontWeight:600}}>Gestion de l'affichage des RDV</h2>
        <Btn>Enregistrer</Btn>
      </div>
      <div style={{display:"flex",gap:24}}>
        <div style={{flex:1}}>
          <div style={{background:"#f9fafb",borderRadius:8,padding:20,marginBottom:16,fontSize:14,color:"#374151"}}>
            <p style={{margin:"0 0 8px",fontWeight:600}}>Changer l'ordre et la visibilité des informations des rendez-vous</p>
            <p style={{margin:0,color:"#6b7280",fontSize:13}}>Vous pouvez modifier la couleur au niveau du RDV, l'ordre des informations dans l'affichage des rendez-vous sur l'agenda et masquer certaines informations si besoin.</p>
          </div>
          {fields.map((f,i)=>(
            <div key={f.nom} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",border:"1px solid #e5e7eb",borderRadius:6,marginBottom:8,background:"#fff"}}>
              <span style={{fontSize:14,fontWeight:500}}>{f.nom}</span>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <span style={{fontSize:13,color:"#6b7280"}}>Afficher :</span>
                <label style={{display:"flex",alignItems:"center",gap:4,fontSize:13,cursor:"pointer"}}>
                  <input type="radio" checked={f.afficher} onChange={()=>setFields(fs=>fs.map((x,j)=>j===i?{...x,afficher:true}:x))} /> Oui
                </label>
                <label style={{display:"flex",alignItems:"center",gap:4,fontSize:13,cursor:"pointer"}}>
                  <input type="radio" checked={!f.afficher} onChange={()=>setFields(fs=>fs.map((x,j)=>j===i?{...x,afficher:false}:x))} /> Non
                </label>
                {f.movable && <span style={{color:"#9ca3af",cursor:"grab",fontSize:18}}>≡</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{width:200,flexShrink:0}}>
          <div style={{fontSize:12,color:"#9ca3af",marginBottom:8}}>Aperçu</div>
          <div style={{background:"#4a9eff",borderRadius:6,padding:"8px 10px",color:"#fff",fontSize:12}}>
            <div style={{fontWeight:600}}>🔒 10:00 - 10:30 Nom client Prestation</div>
            <div style={{opacity:0.8}}>Titre ou note</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin : Produits
function AdminProduits() {
  const [produits, setProduits] = useState(
    Object.fromEntries(Object.entries(PRODUITS_ADMIN).map(([k,v])=>[k,v.map(p=>({...p,deleted:false,stockMin:"",stockMax:""}))]))
  );
  const [catOrder, setCatOrder] = useState(Object.keys(PRODUITS_ADMIN));
  const [editModal, setEditModal] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [toast, setToast] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2000); };

  const updateStock = (cat, id, delta) => {
    setProduits(prev=>({
      ...prev,
      [cat]: prev[cat].map(p => p.id===id ? {...p, stock: Math.max(0, p.stock+delta)} : p)
    }));
  };

  const deleteProduct = (cat, id) => {
    setProduits(prev=>({...prev,[cat]:prev[cat].map(p=>p.id===id?{...p,deleted:true}:p)}));
    showToast("Produit supprimé");
  };

  const restoreProduct = (cat, id) => {
    setProduits(prev=>({...prev,[cat]:prev[cat].map(p=>p.id===id?{...p,deleted:false}:p)}));
    showToast("Produit restauré");
  };

  const saveProduct = () => {
    const {cat, ...data} = editModal;
    setProduits(prev=>({...prev,[cat]:prev[cat].map(p=>p.id===data.id?data:p)}));
    setEditModal(null);
    showToast("Produit modifié");
  };

  const moveCatUp = (cat) => {
    const idx=catOrder.indexOf(cat); if(idx===0)return;
    const o=[...catOrder]; [o[idx-1],o[idx]]=[o[idx],o[idx-1]]; setCatOrder(o);
  };
  const moveCatDown = (cat) => {
    const idx=catOrder.indexOf(cat); if(idx===catOrder.length-1)return;
    const o=[...catOrder]; [o[idx],o[idx+1]]=[o[idx+1],o[idx]]; setCatOrder(o);
  };

  return (
    <div style={{padding:24}}>
      {toast && <div style={{position:"fixed",top:20,right:20,background:"#374151",color:"#fff",padding:"10px 20px",borderRadius:8,zIndex:2000,fontSize:14}}>{toast}</div>}
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <button style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>📄 Exporter</button>
        <button style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>⊕ Ajouter une catégorie</button>
        <button onClick={()=>setReorderMode(r=>!r)} style={{background:"none",border:"none",color:reorderMode?"#4a9eff":"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>≡ {reorderMode?"Terminer":"Ordonner les catégories"}</button>
        <button onClick={()=>setShowDeleted(s=>!s)} style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline",marginLeft:"auto"}}>👁 {showDeleted?"Masquer":"Afficher les produits supprimés"}</button>
      </div>

      {catOrder.filter(cat=>produits[cat]).map(cat=>{
        const items = produits[cat]||[];
        const visible = showDeleted ? items : items.filter(p=>!p.deleted);
        return (
          <div key={cat} style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#f9fafb",padding:"10px 16px",borderRadius:6,marginBottom:2}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {reorderMode && (
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    <button onClick={()=>moveCatUp(cat)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#6b7280",lineHeight:1}}>▲</button>
                    <button onClick={()=>moveCatDown(cat)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#6b7280",lineHeight:1}}>▼</button>
                  </div>
                )}
                <span style={{color:"#9ca3af",fontSize:14}}>▼</span>
                <span style={{fontWeight:600,fontSize:15}}>{cat}</span>
              </div>
              <div style={{display:"flex",gap:12}}>
                <button style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>Ajouter</button>
                <button style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>Ordonner les produits</button>
                <button style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>Modifier</button>
                <button style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:13}}>Supprimer</button>
              </div>
            </div>
            {visible.map(p=>(
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:"1px solid #f3f4f6",borderLeft:`3px solid ${p.couleur||"#c9a84c"}`,opacity:p.deleted?0.5:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div>
                    <span style={{fontSize:14,fontWeight:500,textDecoration:p.deleted?"line-through":"none"}}>{p.nom}</span>
                    <span style={{color:"#6b7280",fontSize:13,marginLeft:8}}>{p.prix},00 € - <span style={{color:p.stock===0?"#ef4444":p.stock<=2?"#f59e0b":"#374151",fontWeight:p.stock<=2?600:400}}>{p.stock} en stock</span></span>
                    {p.stock===0 && <span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"1px 6px",borderRadius:4,marginLeft:6}}>Rupture</span>}
                    {p.deleted && <span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"1px 6px",borderRadius:4,marginLeft:6}}>Supprimé</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {!p.deleted && (
                    <>
                      {/* Stock +/- inline */}
                      <div style={{display:"flex",alignItems:"center",border:"1px solid #d1d5db",borderRadius:6,overflow:"hidden"}}>
                        <button onClick={()=>updateStock(cat,p.id,-1)} style={{width:26,height:26,background:"#f9fafb",border:"none",cursor:"pointer",fontSize:14,color:"#374151"}}>−</button>
                        <span style={{width:28,textAlign:"center",fontSize:13,fontWeight:600}}>{p.stock}</span>
                        <button onClick={()=>updateStock(cat,p.id,+1)} style={{width:26,height:26,background:"#f9fafb",border:"none",cursor:"pointer",fontSize:14,color:"#374151"}}>+</button>
                      </div>
                      <button onClick={()=>setEditModal({...p,cat})} style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13}}>Modifier</button>
                      <button onClick={()=>deleteProduct(cat,p.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:13}}>Supprimer</button>
                    </>
                  )}
                  {p.deleted && (
                    <button onClick={()=>restoreProduct(cat,p.id)} style={{background:"none",border:"none",color:"#4a9eff",cursor:"pointer",fontSize:13}}>Restaurer</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {editModal && (
        <Modal title="Modifier un produit" onClose={()=>setEditModal(null)} width="600px">
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[["LIBELLÉ","nom","text"],["PRIX DE VENTE TTC","prix","number"]].map(([l,f,t])=>(
              <div key={f} style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:12,alignItems:"center"}}>
                <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase"}}>{l}</label>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <input type={t} value={editModal[f]} onChange={e=>setEditModal(m=>({...m,[f]:t==="number"?Number(e.target.value):e.target.value}))} style={{flex:1,padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} />
                  {f==="prix" && <span>€</span>}
                </div>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:12,alignItems:"center"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase"}}>STOCK</label>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <button onClick={()=>setEditModal(m=>({...m,stock:Math.max(0,m.stock-1)}))} style={{width:32,height:32,border:"1px solid #d1d5db",borderRadius:4,cursor:"pointer",background:"#fff",fontSize:16}}>−</button>
                <span style={{fontWeight:600,fontSize:16,width:40,textAlign:"center"}}>{editModal.stock}</span>
                <button onClick={()=>setEditModal(m=>({...m,stock:m.stock+1}))} style={{width:32,height:32,border:"1px solid #d1d5db",borderRadius:4,cursor:"pointer",background:"#fff",fontSize:16}}>+</button>
                <span style={{color:"#6b7280",fontSize:12,marginLeft:8}}>Stock actuel</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:12,alignItems:"center"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase"}}>STOCK MIN / MAX</label>
              <div style={{display:"flex",gap:12}}>
                <div>
                  <div style={{fontSize:11,color:"#9ca3af",marginBottom:4}}>Minimum</div>
                  <input type="number" value={editModal.stockMin} onChange={e=>setEditModal(m=>({...m,stockMin:e.target.value}))} style={{width:80,padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} />
                </div>
                <div>
                  <div style={{fontSize:11,color:"#9ca3af",marginBottom:4}}>Maximum</div>
                  <input type="number" value={editModal.stockMax} onChange={e=>setEditModal(m=>({...m,stockMax:e.target.value}))} style={{width:80,padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} />
                </div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:12,alignItems:"center"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase"}}>TAUX DE TVA</label>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" defaultValue={20} style={{width:70,padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}} /> <span>%</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:12,alignItems:"center"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase"}}>TYPE</label>
              <div style={{display:"flex",gap:16}}>
                {["Technique","Revente","Mixte"].map(t=>(
                  <label key={t} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer"}}>
                    <input type="radio" checked={editModal.type_produit===t} onChange={()=>setEditModal(m=>({...m,type_produit:t}))} /> {t}
                  </label>
                ))}
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}>
              <button onClick={()=>setEditModal(null)} style={{padding:"8px 20px",border:"1px solid #d1d5db",borderRadius:6,cursor:"pointer",background:"#fff",fontSize:14}}>Annuler</button>
              <button onClick={saveProduct} style={{padding:"8px 20px",background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:14,fontWeight:600}}>Enregistrer</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Admin : Remises
function AdminRemises() {
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",gap:12,marginBottom:20}}>
        <Btn variant="link">⊕ Ajouter une remise</Btn>
        <Btn variant="link">≡ Ordonner les remises</Btn>
      </div>
      {REMISES_DATA.map(r=>(
        <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid #f3f4f6",borderLeft:"3px solid #4a9eff"}}>
          <span style={{fontSize:14,fontWeight:500}}>{r.nom} <span style={{color:"#6b7280",fontWeight:400}}>{r.type==="fixe"?`-${r.valeur} €`:`-${r.valeur} %`}</span></span>
          <div style={{display:"flex",gap:16}}>
            <span style={{color:"#6b7280",cursor:"pointer",fontSize:13}}>Dupliquer</span>
            <span style={{color:"#c9a84c",cursor:"pointer",fontSize:13}}>Modifier</span>
            <span style={{color:"#ef4444",cursor:"pointer",fontSize:13}}>Supprimer</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Admin : Cartes cadeaux
function AdminCartesCadeaux() {
  const [type, setType] = useState("usage");
  return (
    <div style={{padding:24}}>
      <div style={{background:"#f9fafb",borderRadius:8,padding:20,marginBottom:20}}>
        <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>Cartes cadeaux</h3>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:16}}>Afin d'activer la possibilité pour vos client d'offrir des cartes cadeaux ou des prestations en ligne, vous devez configurer votre compte Stripe vous permettant d'accepter des paiements en ligne.</p>
        <Btn>Créer mon compte Planity Stripe Connect</Btn>
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:20,marginBottom:20}}>
        <h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>Cartes cadeaux</h3>
        <p style={{fontSize:13,fontWeight:500,marginBottom:8}}>Choisissez le type de vos cartes cadeaux :</p>
        <label style={{display:"flex",alignItems:"start",gap:8,fontSize:13,marginBottom:8,cursor:"pointer"}}>
          <input type="radio" checked={type==="usage"} onChange={()=>setType("usage")} style={{marginTop:2}} />
          Carte cadeau comptabilisée à l'usage (la TVA et le CA sont comptabilisés le ou les jours de l'utilisation de la carte cadeau)
        </label>
        <label style={{display:"flex",alignItems:"start",gap:8,fontSize:13,marginBottom:16,cursor:"pointer"}}>
          <input type="radio" checked={type==="vente"} onChange={()=>setType("vente")} style={{marginTop:2}} />
          Carte cadeau comptabilisée à la vente (la TVA et le CA sont comptabilisés le jour de la vente de la carte cadeau)
        </label>
        <Btn>Enregistrer</Btn>
      </div>
      <Btn variant="link">⊕ Ajouter une carte cadeau</Btn>
      <div style={{marginTop:16,color:"#9ca3af",fontSize:13}}>Vous n'avez aucune carte cadeau. Pour commencer, veuillez en ajouter une.</div>
    </div>
  );
}

// ── Admin : Coordonnées
function AdminCoordonnees() {
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:18,fontWeight:600}}>Coordonnées et message</h2>
        <Btn>Sauvegarder les modifications</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>Coordonnées</h3>
          {[["Adresse","41, Rue Néricault Destouches"],["Code postal","37000"],["Ville","Tours"],["Numéro de téléphone","06 72 42 95 11"],["Numéro de Siret","99399517400014"]].map(([l,v])=>(
            <div key={l} style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:13,color:"#6b7280",marginBottom:4}}>{l}</label>
              <input defaultValue={v} style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,boxSizing:"border-box"}} />
            </div>
          ))}
        </div>
        <div style={{background:"#e5e7eb",borderRadius:8,overflow:"hidden",minHeight:260,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{textAlign:"center",color:"#9ca3af",padding:20}}>
            <div style={{fontSize:24,marginBottom:8}}>📍</div>
            <div style={{fontSize:13}}>41, Rue Néricault Destouches<br />37000 Tours</div>
          </div>
        </div>
      </div>
      <div style={{marginTop:20}}>
        <h3 style={{fontSize:16,fontWeight:600,marginBottom:12}}>Visibilité et message</h3>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:12}}>Vous pouvez afficher un message personnalisé à vos clients qui prennent rendez-vous en ligne.</p>
        <label style={{fontSize:13,color:"#374151"}}>Message sur ma page Planity (désactivé)</label>
        <div style={{marginTop:8}}><RadioGroup options={["Oui","Non"]} value="Non" onChange={()=>{}} /></div>
      </div>
    </div>
  );
}

// ── Admin : Photos
function AdminPhotos() {
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:18,fontWeight:600}}>Gestion des photos</h2>
        <Btn>Importer des photos</Btn>
      </div>
      <div style={{borderBottom:"2px solid #c9a84c",paddingBottom:8,marginBottom:16,display:"flex",gap:16}}>
        <span style={{color:"#c9a84c",fontWeight:600,fontSize:14}}>Photos validées et en validation</span>
      </div>
      <div style={{background:"#f9fafb",borderRadius:6,padding:12,marginBottom:16,fontSize:13,color:"#6b7280"}}>
        Vous pouvez ordonner, recadrer ou supprimer les photos de votre page Planity. <span style={{cursor:"pointer",textDecoration:"underline"}}>Télécharger mes photos</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {[{n:1,label:"Salon bleu marine 1"},{n:2,label:"Salon bleu marine 2"},{n:3,label:"Logo ELNAGAR"}].map(p=>(
          <div key={p.n} style={{border:"1px solid #e5e7eb",borderRadius:8,overflow:"hidden"}}>
            <div style={{height:160,background:"linear-gradient(135deg,#0d1b2a,#1e3a5f)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(201,168,76,0.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"#c9a84c",fontWeight:700,fontSize:18}}>{p.n}</div>
            </div>
            <div style={{padding:"8px 12px",display:"flex",gap:16}}>
              <Btn variant="link" small>✂ Recadrer</Btn>
              <Btn variant="link" small style={{color:"#ef4444"}}>🗑 Supprimer</Btn>
              <span style={{marginLeft:"auto",color:"#9ca3af",cursor:"grab",fontSize:18}}>≡</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Admin : Descriptif
function AdminDescriptif() {
  const [desc, setDesc] = useState("Un espace dédié aux hommes, pensé pour prendre soin de vous et révéler le meilleur de vous-même.\nMeilleur Apprenti de France, je vous propose une expérience unique, basée sur la qualité du service, l'écoute et la personnalisation.\nChaque coupe et chaque taille de barbe est réalisée sur-mesure, en tenant compte de votre morphologie, de votre style et de la nature de vos cheveux, pour un résultat naturel, équilibré et valorisant.\nJe propose des prestations complètes : coupes hommes, dégradés, taille de barbe, soins, coloration, mèches, patine, lissage, défrisage, permanente, épilation à la cire, coupes enfants et coiffures pour événements.");
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:18,fontWeight:600}}>Descriptif établissement</h2>
        <Btn>Sauvegarder</Btn>
      </div>
      <div style={{background:"#f9fafb",borderRadius:8,padding:16,marginBottom:16,fontSize:13,color:"#6b7280"}}>
        <strong>Modifier la section à-propos de ma page Planity</strong><br />
        Vous pouvez modifier ci-dessous la section à-propos de votre page Planity. Ce texte sera soumis à validation.{" "}
        <span style={{color:"#c9a84c",cursor:"pointer",textDecoration:"underline"}}>🏠 Voir ma page Planity</span>
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:20,marginBottom:16}}>
        <h3 style={{fontSize:16,fontWeight:600,marginBottom:12}}>À-propos</h3>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14,minHeight:140,resize:"vertical",boxSizing:"border-box"}} />
        <div style={{textAlign:"right",fontSize:12,color:"#9ca3af",marginTop:4}}>{2500-desc.length} caractères restants</div>
      </div>
      {[{label:"Accès",add:"Ajouter vos accès",btn:"Ajouter un nouvel accès"},{label:"Formations",add:"Ajouter vos formations",btn:"Ajouter une nouvelle formation"},{label:"Expériences",add:"Ajouter vos expériences",btn:"Ajouter une nouvelle expérience"}].map(s=>(
        <div key={s.label} style={{background:"#f9fafb",borderRadius:8,padding:"12px 16px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:600}}>{s.label} <span style={{color:"#9ca3af",fontWeight:400,fontSize:13}}>{s.add}</span></span>
            <Btn variant="link" small>{s.btn}</Btn>
          </div>
          <div style={{color:"#9ca3af",fontSize:13,marginTop:8}}>Cette catégorie est vide</div>
        </div>
      ))}
    </div>
  );
}

// ── Admin : Notifications
function AdminNotifications() {
  const [notifs, setNotifs] = useState({rdvNotif:false,rdvEmail:false,annulNotif:false,annulEmail:false,carteNotif:false,carteEmail:false});
  return (
    <div style={{padding:24}}>
      <h2 style={{fontSize:18,fontWeight:600,marginBottom:8}}>Notifications</h2>
      <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}>Pour être informé lorsqu'un rendez-vous est pris ou annulé en ligne par un client, ou qu'une carte cadeau est achetée : merci de préciser si vous souhaitez recevoir une notification, un email, ou les deux, et d'indiquer les adresses email concernées.</p>
      {[{k:"rdv",label:"Nouveau RDV pris en ligne :"},{k:"annul",label:"RDV annulé en ligne :"},{k:"carte",label:"Achat de carte cadeau en ligne :"}].map(s=>(
        <div key={s.k} style={{marginBottom:16}}>
          <div style={{fontWeight:500,fontSize:14,marginBottom:6}}>{s.label}</div>
          <div style={{display:"flex",gap:16}}>
            <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}>
              <input type="checkbox" checked={notifs[s.k+"Notif"]} onChange={e=>setNotifs(n=>({...n,[s.k+"Notif"]:e.target.checked}))} />
              Être informé par notification
            </label>
            <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}>
              <input type="checkbox" checked={notifs[s.k+"Email"]} onChange={e=>setNotifs(n=>({...n,[s.k+"Email"]:e.target.checked}))} />
              Être informé par email
            </label>
          </div>
        </div>
      ))}
      <Btn style={{marginTop:8}}>Sauvegarder les réglages</Btn>
      <div style={{marginTop:20,background:"#f9fafb",borderRadius:8,padding:16,fontSize:13,color:"#6b7280"}}>
        Pour recevoir un email dès qu'un rendez-vous est pris en ligne, annulé ou qu'une carte cadeau est acheté par un utilisateur : merci d'indiquer la ou les adresses emails qui les recevront.
        <div style={{marginTop:12}}><Btn variant="link">⊕ Ajouter une adresse email</Btn></div>
        <div style={{marginTop:8,color:"#9ca3af"}}>Vous n'avez aucune adresse email.</div>
      </div>
    </div>
  );
}

// ── Admin : Horaires
function AdminHoraires() {
  const [onglet, setOnglet] = useState("Horaires de l'établissement");
  const onglets = ["Horaires de l'établissement","Horaires exceptionnels de l'établissement","Horaires affichés dans l'agenda","Délais RDV en ligne","Jours fériés"];
  const joursOuverts = {Lu:true,Ma:true,Me:true,Je:true,Ve:true,Sa:true,Di:false};
  return (
    <div style={{padding:0}}>
      <div style={{borderBottom:"1px solid #e5e7eb",padding:"0 24px",display:"flex",gap:0,overflowX:"auto"}}>
        {onglets.map(o=>(
          <div key={o} onClick={()=>setOnglet(o)} style={{padding:"12px 16px",cursor:"pointer",borderBottom:onglet===o?"2px solid #c9a84c":"2px solid transparent",color:onglet===o?"#c9a84c":"#6b7280",fontSize:13,whiteSpace:"nowrap",fontWeight:onglet===o?600:400}}>{o}</div>
        ))}
      </div>
      <div style={{padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{fontSize:16,fontWeight:600}}>Gestion des horaires et de la prise de RDV en ligne</h2>
          <Btn>Sauvegarder les modifications</Btn>
        </div>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:20,marginBottom:20}}>
          <h3 style={{fontSize:15,fontWeight:600,marginBottom:12}}>Activation</h3>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{fontSize:14,width:160}}>Prise de RDV en ligne</span>
            <RadioGroup options={["Ouverte","Fermée"]} value="Ouverte" onChange={()=>{}} />
          </div>
          <p style={{fontSize:13,color:"#6b7280",margin:0}}>Les clients peuvent prendre leur RDV en ligne.</p>
        </div>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:20}}>
          <h3 style={{fontSize:15,fontWeight:600,marginBottom:12}}>Jours d'ouverture</h3>
          <div style={{display:"flex",gap:6,marginBottom:20}}>
            {Object.entries(joursOuverts).map(([j,open])=>(
              <button key={j} style={{width:36,height:36,borderRadius:6,border:"none",cursor:"pointer",background:open?"#c9a84c":"#e5e7eb",color:open?"#fff":"#6b7280",fontWeight:600,fontSize:12}}>
                {j}
              </button>
            ))}
          </div>
          {Object.entries(HORAIRES_DATA).map(([jour,plages])=>(
            plages.length>0 && (
              <div key={jour} style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                <span style={{width:90,fontSize:14,fontWeight:500}}>{jour}</span>
                <div style={{display:"flex",flex:1,gap:8,flexWrap:"wrap"}}>
                  {plages.map((p,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                      <input defaultValue={p.debut} style={{width:70,padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:13}} />
                      <span>-</span>
                      <input defaultValue={p.fin} style={{width:70,padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:13}} />
                      {plages.length>1 && <button style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:16}}>⊗</button>}
                    </div>
                  ))}
                  <Btn variant="link" small>Ajouter une plage d'ouverture</Btn>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Admin : Liste d'attente
function AdminListeAttente() {
  const [actif, setActif] = useState(true);
  return (
    <div style={{padding:24}}>
      <h2 style={{fontSize:18,fontWeight:600,marginBottom:20}}>Gestion liste d'attente</h2>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:24,maxWidth:500}}>
        <h3 style={{fontSize:15,fontWeight:600,marginBottom:16}}>Activation de la liste d'attente</h3>
        <p style={{fontSize:14,color:"#374151",marginBottom:12}}>Souhaitez-vous activer la liste d'attente ?</p>
        <RadioGroup options={["Oui","Non"]} value={actif?"Oui":"Non"} onChange={v=>setActif(v==="Oui")} />
        <button style={{marginTop:20,width:"100%",background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,padding:"12px",fontSize:14,cursor:"pointer"}}>Enregistrer</button>
      </div>
    </div>
  );
}

// ── Admin : Bouton Google
function AdminBoutonGoogle() {
  const [afficher, setAfficher] = useState(true);
  return (
    <div style={{padding:24}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:24,maxWidth:700}}>
        <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>Bouton "Réserver en ligne" sur Google My Business et Google Maps</h3>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:16}}>Planity est partenaire de Google et vous permet d'ajouter un bouton "Réserver en ligne" sur votre page Google My Business et sur Google Maps. <span style={{color:"#c9a84c",cursor:"pointer",textDecoration:"underline"}}>ℹ Voir plus d'informations</span></p>
        <RadioGroup options={["Afficher le bouton","Masquer le bouton"]} value={afficher?"Afficher le bouton":"Masquer le bouton"} onChange={v=>setAfficher(v==="Afficher le bouton")} />
        <button style={{marginTop:20,width:"100%",background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,padding:"12px",fontSize:14,cursor:"pointer"}}>Sauvegarder</button>
      </div>
    </div>
  );
}

// ── Admin : Bouton Facebook/Instagram
function AdminBoutonFacebook() {
  return (
    <div style={{padding:24}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:24,maxWidth:600}}>
        <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>Ajouter un bouton "Réserver" à ma page Facebook et Instagram</h3>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:4}}>Cela vous permettra de créer un bouton "Réserver" sur Facebook et Instagram qui redirige vers votre page Planity.</p>
        <span style={{color:"#c9a84c",cursor:"pointer",textDecoration:"underline",fontSize:13}}>ℹ Voir le centre d'aide</span>
        <button style={{marginTop:20,display:"block",background:"#4a9eff",color:"#fff",border:"none",borderRadius:6,padding:"10px 24px",fontSize:14,cursor:"pointer"}}>Lier à Facebook et Instagram</button>
      </div>
    </div>
  );
}

// ── Admin : Visio
function AdminVisio() {
  return (
    <div style={{padding:24}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:24,maxWidth:600}}>
        <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>Configurer votre service de Rendez-vous visio</h3>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}>Vous pouvez proposer des rendez-vous visio à vos clients, en utilisant un outil externe comme Google Meet, Zoom ou Microsoft Teams.</p>
        <h4 style={{fontSize:14,fontWeight:600,marginBottom:12}}>Activation du rendez-vous visio</h4>
        <RadioGroup options={["Oui","Non"]} value="Non" onChange={()=>{}} />
        <div style={{marginTop:12,fontSize:13,color:"#6b7280"}}>Pour activer les rdv visio vous devez au préalable activer le paiement en ligne. <span style={{color:"#c9a84c",cursor:"pointer",textDecoration:"underline"}}>Activer le paiement en ligne</span></div>
      </div>
    </div>
  );
}

// ── Admin : Utilisateurs
function AdminUtilisateurs() {
  return (
    <div style={{padding:24}}>
      <div style={{background:"#f9fafb",borderRadius:8,padding:20,marginBottom:16}}>
        <h3 style={{fontSize:15,fontWeight:600,marginBottom:8}}>Nouvelle fonctionnalité à venir</h3>
        <p style={{fontSize:13,color:"#6b7280"}}>Vous pourrez bientôt gérer vos utilisateurs directement depuis cet écran : vous aurez la possibilité de créer, modifier, supprimer ou déconnecter vos collaborateurs en toute autonomie.</p>
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:20,marginBottom:16}}>
        <h3 style={{fontSize:15,fontWeight:600,marginBottom:8}}>Protégez l'accès à cette page dès maintenant</h3>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:12}}>Nous vous recommandons de mettre en place un code d'accès avant le 01/05/2026 afin de garder le contrôle sur les accès à votre établissement.</p>
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:20}}>
        <h3 style={{fontSize:15,fontWeight:600,marginBottom:8}}>Comment créer un code d'accès ?</h3>
        <ul style={{fontSize:13,color:"#6b7280",marginBottom:16,paddingLeft:20}}>
          <li>Rendez-vous dans Admin &gt; Accès &gt; Gestion des codes d'accès</li>
          <li>Cliquez sur le bouton Créer un code d'accès</li>
          <li>Choisissez un code et sélectionnez les écrans que vous souhaitez protéger</li>
        </ul>
        <button style={{width:"100%",background:"#4a9eff",color:"#fff",border:"none",borderRadius:6,padding:"12px",fontSize:14,cursor:"pointer"}}>Accéder à la gestion des codes d'accès</button>
      </div>
    </div>
  );
}

// ── Admin : Consommation SMS
function AdminConsommation() {
  const jours = Array.from({length:31},(_,i)=>({j:`${String(i+1).padStart(2,"0")}/05`,rappels:i===0?10:0,tickets:0,campagnes:0,auto:0}));
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#6b7280"}}>‹</button>
          <span style={{fontWeight:600,fontSize:15}}>Mai 2026</span>
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#6b7280"}}>›</button>
        </div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
          {["Jour","Rappels SMS","Tickets SMS","Campagnes SMS","Campagnes SMS automatisées","Total"].map(h=>(
            <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:12,fontWeight:600,color:"#374151"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {jours.map(j=>(
            <tr key={j.j} style={{borderBottom:"1px solid #f3f4f6"}}>
              <td style={{padding:"10px 12px",fontSize:13}}>{j.j.replace("/05",j.j.startsWith("01")||j.j.startsWith("02")||j.j.startsWith("03")?" mai":"")}</td>
              <td style={{padding:"10px 12px",fontSize:13,color:j.rappels>0?"#374151":"#9ca3af"}}>{j.rappels}</td>
              <td style={{padding:"10px 12px",fontSize:13,color:"#9ca3af"}}>0</td>
              <td style={{padding:"10px 12px",fontSize:13,color:"#9ca3af"}}>0</td>
              <td style={{padding:"10px 12px",fontSize:13,color:"#9ca3af"}}>0</td>
              <td style={{padding:"10px 12px",fontSize:13,color:j.rappels>0?"#374151":"#9ca3af"}}>{j.rappels}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Admin : Campagnes SMS
function AdminCampagnesSMS() {
  const [onglet, setOnglet] = useState("ponctuelles");
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:18,fontWeight:600}}>Campagnes SMS</h2>
        <Btn>Créer une campagne</Btn>
      </div>
      <div style={{borderBottom:"2px solid #e5e7eb",marginBottom:20,display:"flex",gap:0}}>
        {[{k:"ponctuelles",l:"Campagnes ponctuelles"},{k:"auto",l:"Campagnes automatisées"}].map(o=>(
          <div key={o.k} onClick={()=>setOnglet(o.k)} style={{padding:"10px 16px",cursor:"pointer",borderBottom:onglet===o.k?"2px solid #c9a84c":"2px solid transparent",color:onglet===o.k?"#c9a84c":"#6b7280",fontSize:14,fontWeight:onglet===o.k?600:400}}>
            {o.l}
          </div>
        ))}
      </div>
      <div style={{background:"#f9fafb",borderRadius:8,padding:16,marginBottom:16,fontSize:13,color:"#6b7280"}}>
        Avec Planity, vous pouvez créer des campagnes de SMS auprès de vos clients, pour leur faire part de votre activité, de vos nouvelles offres ou encore de vos promotions.
      </div>
      <div style={{textAlign:"center",color:"#9ca3af",fontSize:14,padding:32}}>Vous n'avez pas encore fait de campagne SMS</div>
    </div>
  );
}

// ── Admin : Notifications par mail
function AdminNotifMail() {
  const [actif, setActif] = useState(true);
  return (
    <div style={{padding:24}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:24,maxWidth:700}}>
        <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>Notifications par mail</h3>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:16}}>Pour envoyer un email de confirmation à votre client lors de l'ajout ou de la suppression manuel(le) d'un rendez-vous à votre agenda, activez les notifications par email :</p>
        <div style={{fontWeight:500,fontSize:13,marginBottom:8}}>ACTIVATION</div>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:14,cursor:"pointer"}}>
          <input type="checkbox" checked={actif} onChange={e=>setActif(e.target.checked)} style={{accentColor:"#4a9eff"}} />
          Activer la confirmation par email des rdv ajoutés ou supprimés manuellement dans l'agenda Planity Pro
        </label>
      </div>
    </div>
  );
}

// ── Admin : Gestion fiche clients
function AdminFicheClients() {
  return (
    <div style={{padding:24}}>
      <h2 style={{fontSize:18,fontWeight:600,marginBottom:8}}>Gestion fiche clients</h2>
      <p style={{fontSize:13,color:"#6b7280",marginBottom:4}}>Vous pouvez afficher des champs supplémentaires comme le genre, la date de naissance et le code postal, et déterminer si le champ est obligatoire ou non.</p>
      <p style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:20}}>Note : Si les champs ont été rendus obligatoires par l'administrateur, vous ne pourrez pas modifier cette option.</p>
      {[
        {label:"Genre",options:["Afficher","Saisie obligatoire"]},
        {label:"Date de naissance",options:["Afficher","Ne pas demander l'année","Saisie obligatoire"]},
        {label:"Adresse postale",options:["Afficher","Demander le code postal uniquement","Saisie obligatoire"]},
      ].map(field=>(
        <div key={field.label} style={{borderBottom:"1px solid #e5e7eb",padding:"20px 0"}}>
          <h3 style={{fontSize:15,fontWeight:600,marginBottom:12}}>{field.label}</h3>
          <div style={{display:"flex",gap:32,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:13,color:"#6b7280",width:60}}>Afficher :</span>
              <RadioGroup options={["Oui","Non"]} value="Oui" onChange={()=>{}} />
            </div>
            {field.options.includes("Ne pas demander l'année") && (
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}>
                <input type="checkbox" /> Ne pas demander l'année
              </label>
            )}
            {field.options.includes("Demander le code postal uniquement") && (
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}>
                <input type="checkbox" /> Demander le code postal uniquement
              </label>
            )}
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:13,color:"#6b7280",width:120}}>Saisie obligatoire :</span>
              <RadioGroup options={["Oui","Non"]} value="Non" onChange={()=>{}} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Admin : Stats clés
function AdminStatsCles() {
  const [periode, setPeriode] = useState("Mai 2026");
  const kpis = [{label:"Nombre de RDV en ligne",val:"31"},{label:"Nombre de RDV",val:"42"},{label:"Taux en ligne",val:"73.8 %"},{label:"Nouveaux clients en ligne",val:"0"},{label:"Nouveaux clients en salon",val:"2"}];
  const rdvData = [4,8,2,0,5,5,2,1,1,2,0,1,0,5,5,0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0];
  const ligneData = [5,8,2,0,5,5,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const maxVal = 8;
  return (
    <div style={{padding:24}}>
      <StatsTabs active="Indicateurs clés" />
      <div style={{display:"flex",gap:12,marginBottom:20,alignItems:"center"}}>
        <Btn variant="link">📄 Exporter</Btn>
        <Btn variant="link">🖨 Imprimer</Btn>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13}}>
            <input type="checkbox" /> Comparer à
          </label>
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#6b7280"}}>‹</button>
          <span style={{fontWeight:600,fontSize:14,padding:"4px 12px",border:"1px solid #d1d5db",borderRadius:6}}>{periode}</span>
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#6b7280"}}>›</button>
          <select style={{padding:"6px 10px",border:"1px solid #d1d5db",borderRadius:6,fontSize:13}}><option>Mois</option></select>
          <Btn variant="secondary" small>Aujourd'hui</Btn>
        </div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}}>
        {kpis.map(k=>(
          <div key={k.label} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"16px 20px",flex:1,minWidth:140}}>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>{k.label}</div>
            <div style={{fontSize:24,fontWeight:700,color:"#c9a84c"}}>{k.val}</div>
            {(k.label.includes("clients")) && <div style={{fontSize:12,color:"#c9a84c",cursor:"pointer",textDecoration:"underline",marginTop:4}}>Voir la liste</div>}
          </div>
        ))}
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:20}}>
        <h3 style={{fontSize:15,fontWeight:600,marginBottom:16}}>Rendez-vous pris</h3>
        <div style={{position:"relative",height:160}}>
          <svg width="100%" height="160" viewBox={`0 0 ${rdvData.length*40} 160`} preserveAspectRatio="none">
            {[0,2,4,6,8].map(v=>(
              <line key={v} x1={0} y1={160-v/maxVal*140} x2={rdvData.length*40} y2={160-v/maxVal*140} stroke="#e5e7eb" strokeWidth={1} />
            ))}
            <polyline points={rdvData.map((v,i)=>`${i*40+20},${160-v/maxVal*140}`).join(" ")} fill="none" stroke="#0d4a2a" strokeWidth={2} />
            <polyline points={ligneData.map((v,i)=>`${i*40+20},${160-v/maxVal*140}`).join(" ")} fill="none" stroke="#5cb85c" strokeWidth={2} />
            {rdvData.map((v,i)=><circle key={i} cx={i*40+20} cy={160-v/maxVal*140} r={4} fill="#0d4a2a" />)}
            {ligneData.map((v,i)=><circle key={i} cx={i*40+20} cy={160-v/maxVal*140} r={4} fill="#5cb85c" />)}
          </svg>
        </div>
        <div style={{display:"flex",gap:16,marginTop:8}}>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}><div style={{width:20,height:3,background:"#0d4a2a"}} />Pris en salon</div>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}><div style={{width:20,height:3,background:"#5cb85c"}} />Pris en ligne</div>
        </div>
      </div>
    </div>
  );
}

// ── Admin : Stats autres
function AdminStatsAutres() {
  return (
    <div style={{padding:24}}>
      <StatsTabs active="Autres indicateurs" />
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:20}}>
        {[
          {title:"RDV pris",data:[{label:"Pris en salon",pct:26.2,color:"#267826"},{label:"Pris en ligne",pct:73.8,color:"#5cb85c"}]},
          {title:"Nombre de prestations en salon par collaborateur",data:[{label:"Elnagar",pct:100,color:"#4a9eff"}]},
          {title:"Nombre de prestations en ligne par collaborateur",data:[{label:"Elnagar",pct:100,color:"#4a9eff"}]},
        ].map(card=>(
          <div key={card.title} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:20}}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:16,color:"#374151"}}>{card.title}</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
              <svg width={120} height={120} viewBox="0 0 120 120">
                <circle cx={60} cy={60} r={48} fill="none" stroke="#e5e7eb" strokeWidth={16} />
                {card.data.map((d,i)=>{
                  const offset = card.data.slice(0,i).reduce((s,x)=>s+x.pct,0)/100*2*Math.PI*48;
                  const len = d.pct/100*2*Math.PI*48;
                  return <circle key={i} cx={60} cy={60} r={48} fill="none" stroke={d.color} strokeWidth={16} strokeDasharray={`${len} 999`} strokeDashoffset={-offset} style={{transform:"rotate(-90deg)",transformOrigin:"60px 60px"}} />;
                })}
              </svg>
            </div>
            {card.data.map(d=>(
              <div key={d.label} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <div style={{width:16,height:3,background:d.color}} />
                <span style={{fontSize:12,color:"#374151"}}>{d.label}</span>
                <strong style={{marginLeft:"auto",fontSize:12}}>{d.pct}%</strong>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button style={{flex:1,padding:"4px 8px",border:"1px solid #e5e7eb",borderRadius:4,cursor:"pointer",background:"#f9fafb",fontSize:12}}>Graphe</button>
              <button style={{flex:1,padding:"4px 8px",border:"1px solid #e5e7eb",borderRadius:4,cursor:"pointer",background:"#fff",fontSize:12}}>Tableau</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Admin : Stats prestations
function AdminStatsPrestations() {
  return (
    <div style={{padding:24}}>
      <StatsTabs active="Prestations" />
      <StatsToolbar />
      <table style={{width:"100%",borderCollapse:"collapse",marginTop:16}}>
        <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
          {["PRESTATION","TOTAL PRESTATIONS","PRIS EN SALON","PRIS EN LIGNE","TAUX EN LIGNE","TOTAL DES RDV*"].map(h=>(
            <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"#6b7280"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {STATS_PRESTATIONS.map((r,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #f3f4f6",background:r.cat?"#f9fafb":"#fff",fontWeight:r.cat?600:400}}>
              <td style={{padding:"10px 12px",fontSize:14,paddingLeft:r.cat?12:24}}>{r.cat||r.nom}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.total}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.salon}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.ligne}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.taux}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.ca}</td>
            </tr>
          ))}
          <tr style={{borderTop:"2px solid #374151",fontWeight:700}}>
            <td style={{padding:"10px 12px",fontSize:14}}>TOTAL</td>
            <td style={{padding:"10px 12px",fontSize:14}}>47</td>
            <td style={{padding:"10px 12px",fontSize:14}}>12</td>
            <td style={{padding:"10px 12px",fontSize:14}}>35</td>
            <td style={{padding:"10px 12px",fontSize:14}}>74.5 %</td>
            <td style={{padding:"10px 12px",fontSize:14}}>1 538,00 €</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Admin : Stats collaborateurs
function AdminStatsCollaborateurs() {
  return (
    <div style={{padding:24}}>
      <StatsTabs active="Collaborateurs" />
      <StatsToolbar />
      <table style={{width:"100%",borderCollapse:"collapse",marginTop:16}}>
        <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
          {["COLLABORATEUR","TOTAL PRESTATIONS","PRIS EN SALON","PRIS EN LIGNE","TAUX EN LIGNE","CHOISI EN SALON","CHOISI EN LIGNE","TOTAL DES RDV*"].map(h=>(
            <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"#6b7280"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {[{c:"Collaborateurs",bold:true},{c:"Elnagar",bold:false}].map((r,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #f3f4f6",fontWeight:r.bold?700:400}}>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.c}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>47</td>
              <td style={{padding:"10px 12px",fontSize:14}}>12</td>
              <td style={{padding:"10px 12px",fontSize:14}}>35</td>
              <td style={{padding:"10px 12px",fontSize:14}}>74.5 %</td>
              <td style={{padding:"10px 12px",fontSize:14}}>1</td>
              <td style={{padding:"10px 12px",fontSize:14}}>35</td>
              <td style={{padding:"10px 12px",fontSize:14}}>1 538,00 €</td>
            </tr>
          ))}
          <tr style={{borderTop:"2px solid #374151",fontWeight:700}}>
            <td style={{padding:"10px 12px",fontSize:14}} colSpan={1}>TOTAL</td>
            <td style={{padding:"10px 12px",fontSize:14}}>47</td>
            <td style={{padding:"10px 12px",fontSize:14}}>12</td>
            <td style={{padding:"10px 12px",fontSize:14}}>35</td>
            <td style={{padding:"10px 12px",fontSize:14}}>74.5 %</td>
            <td style={{padding:"10px 12px",fontSize:14}}>1</td>
            <td style={{padding:"10px 12px",fontSize:14}}>35</td>
            <td style={{padding:"10px 12px",fontSize:14}}>1 538,00 €</td>
          </tr>
        </tbody>
      </table>
      <p style={{fontSize:12,color:"#9ca3af",marginTop:12}}>Attention ceci n'est pas le chiffre d'affaire comptable, il s'agit de la somme des prix indiqués dans l'agenda. A noter: les statistiques sont calculées toutes les nuits.</p>
    </div>
  );
}

// ── Admin : Stats RDV
function AdminStatsRDV() {
  const data = [{d:"01/05",t:9,s:4,l:5,tx:"55.56%"},{d:"02/05",t:10,s:2,l:8,tx:"80%"},{d:"03/05",t:0,s:0,l:0,tx:"0%"},{d:"04/05",t:5,s:0,l:5,tx:"100%"},{d:"05/05",t:7,s:2,l:5,tx:"71.43%"},{d:"06/05",t:1,s:0,l:1,tx:"100%"},{d:"07/05",t:3,s:1,l:2,tx:"66.67%"},{d:"08/05",t:1,s:0,l:1,tx:"100%"},{d:"09/05",t:2,s:1,l:1,tx:"50%"},{d:"10/05",t:0,s:0,l:0,tx:"0%"},{d:"11/05",t:0,s:0,l:0,tx:"0%"},{d:"12/05",t:1,s:0,l:1,tx:"100%"},{d:"13/05",t:0,s:0,l:0,tx:"0%"}];
  return (
    <div style={{padding:24}}>
      <StatsTabs active="RDV" />
      <StatsToolbar />
      <table style={{width:"100%",borderCollapse:"collapse",marginTop:16}}>
        <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
          {["DATE","TOTAL PRESTATIONS","PRIS EN SALON","PRIS EN LIGNE","TAUX EN LIGNE"].map(h=>(
            <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"#6b7280"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {data.map(r=>(
            <tr key={r.d} style={{borderBottom:"1px solid #f3f4f6"}}>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.d}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.t}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.s}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.l}</td>
              <td style={{padding:"10px 12px",fontSize:14}}>{r.tx}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Admin : Stats RDV pas venus
function AdminStatsRDVPasVenus() {
  return (
    <div style={{padding:24}}>
      <StatsTabs active="RDV pas venus" />
      <StatsToolbar />
      <table style={{width:"100%",borderCollapse:"collapse",marginTop:16}}>
        <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
          {["DATE","TOTAL PRESTATIONS","PRIS EN SALON","PRIS EN LIGNE","TAUX EN LIGNE"].map(h=>(
            <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"#6b7280"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          <tr style={{borderBottom:"1px solid #f3f4f6",fontWeight:700}}>
            <td style={{padding:"10px 12px",fontSize:14}}>TOTAL</td>
            <td style={{padding:"10px 12px",fontSize:14}}>0</td>
            <td style={{padding:"10px 12px",fontSize:14}}>0</td>
            <td style={{padding:"10px 12px",fontSize:14}}>0</td>
            <td style={{padding:"10px 12px",fontSize:14}}>0%</td>
          </tr>
        </tbody>
      </table>
      <p style={{fontSize:12,color:"#9ca3af",marginTop:12}}>A noter: les statistiques sont calculées toutes les nuits. Par conséquent, les actions effectuées aujourd'hui seront prises en compte le lendemain.</p>
    </div>
  );
}

// ── Admin : Taux d'occupation
function AdminTauxOccupation() {
  const onglets = ["Vue d'ensemble","Prestations","Collaborateurs"];
  const [onglet, setOnglet] = useState("Vue d'ensemble");
  const cols = ["LUN","MAR","MER","JEU","VEN","SAM","DIM"];
  const colsKeys = ["Lu","Ma","Me","Je","Ve","Sa","Di"];
  const getColor = (v) => {
    if(v===0) return "#f3f4f6";
    if(v<20) return "#d1fae5";
    if(v<40) return "#a7f3d0";
    if(v<60) return "#6ee7b7";
    return "#4caf50";
  };
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:"1px solid #e5e7eb"}}>
        {onglets.map(o=>(
          <div key={o} onClick={()=>setOnglet(o)} style={{padding:"10px 16px",cursor:"pointer",borderBottom:onglet===o?"2px solid #c9a84c":"2px solid transparent",color:onglet===o?"#c9a84c":"#6b7280",fontSize:13,fontWeight:onglet===o?600:400}}>{o}</div>
        ))}
      </div>
      <StatsToolbar />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <p style={{fontSize:13,fontWeight:500,color:"#374151"}}>Moyenne des taux d'occupation* par jour de la semaine et par tranche horaire.</p>
        <div style={{display:"flex",gap:8}}>
          <select style={{padding:"6px 10px",border:"1px solid #d1d5db",borderRadius:6,fontSize:13}}><option>Voir le détail par collaborateur</option></select>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" />Toutes les 1h</label>
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",minWidth:600}}>
          <thead><tr>
            <th style={{width:120,padding:"8px 12px",fontSize:12,color:"#6b7280",fontWeight:500,textAlign:"left"}}></th>
            {cols.map(c=><th key={c} style={{padding:"8px 12px",fontSize:12,fontWeight:600,color:"#374151",minWidth:80}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {Object.entries(TAUX_OCCUPATION).map(([tranche,vals])=>(
              <tr key={tranche}>
                <td style={{padding:"6px 12px",fontSize:12,color:"#6b7280",whiteSpace:"nowrap"}}>{tranche}</td>
                {colsKeys.map(c=>(
                  <td key={c} style={{padding:4}}>
                    <div style={{background:getColor(vals[c]),borderRadius:4,padding:"6px 8px",textAlign:"center",fontSize:12,fontWeight:vals[c]>0?600:400,color:vals[c]>50?"#fff":"#374151",minWidth:64}}>
                      {vals[c]}%
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Admin : Corbeille RDV
function AdminCorbeille() {
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:18,fontWeight:600}}>Rendez-vous annulés dans les 30 derniers jours</h2>
        <button style={{background:"none",border:"1px solid #d1d5db",borderRadius:6,padding:"6px 16px",cursor:"pointer",fontSize:13,color:"#374151"}}>Vider la corbeille</button>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
          {["RDV avec","Date du RDV","Client(e)","Pris par Internet","Création","Annulation","Annulé par le client","Actions"].map(h=>(
            <th key={h} style={{padding:"10px 8px",textAlign:"left",fontSize:11,fontWeight:600,color:"#6b7280"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {CORBEILLE_RDV.map(r=>(
            <tr key={r.id} style={{borderBottom:"1px solid #f3f4f6"}}>
              <td style={{padding:"10px 8px",fontSize:13}}>{r.agenda}</td>
              <td style={{padding:"10px 8px",fontSize:13}}>{r.date}</td>
              <td style={{padding:"10px 8px",fontSize:13,fontWeight:r.client?500:400,color:r.client?"#374151":"#9ca3af"}}>{r.client||"-"}</td>
              <td style={{padding:"10px 8px",fontSize:13,textAlign:"center"}}>{r.internet?"✓":""}</td>
              <td style={{padding:"10px 8px",fontSize:13}}>{r.creation}</td>
              <td style={{padding:"10px 8px",fontSize:13}}>{r.annulation}</td>
              <td style={{padding:"10px 8px",fontSize:13,textAlign:"center"}}>{r.internet?"✓":""}</td>
              <td style={{padding:"10px 8px"}}><span style={{color:"#c9a84c",cursor:"pointer",fontSize:13}}>Restaurer</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Admin : Intégration Chift
function AdminIntegration() {
  const [actif, setActif] = useState(true);
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:18,fontWeight:600}}>Intégration</h2>
        <Btn>Sauvegarder</Btn>
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:24,maxWidth:700}}>
        <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>Intégration Chift</h3>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:4}}>L'intégration via Chift vous permet de connecter votre compte Planity à votre logiciel de comptabilité.</p>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:16}}>Vous devez activer l'intégration, récupérer la clé fournie par Planity puis la saisir dans votre logiciel.</p>
        <h4 style={{fontSize:14,fontWeight:600,marginBottom:8}}>Activer l'intégration</h4>
        <RadioGroup options={["Oui","Non"]} value={actif?"Oui":"Non"} onChange={v=>setActif(v==="Oui")} />
        {actif && (
          <div style={{marginTop:16,display:"flex",gap:8,alignItems:"center"}}>
            <input readOnly value="716b1520-fbbf-406b-8992-ed068612c2ac" style={{flex:1,padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:13,background:"#f9fafb",color:"#6b7280"}} />
            <button onClick={()=>navigator.clipboard?.writeText("716b1520-fbbf-406b-8992-ed068612c2ac")} style={{background:"#4a9eff",color:"#fff",border:"none",borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13}}>Copier</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Admin : Moyen de paiement
function AdminMoyenPaiement() {
  return (
    <div style={{padding:24}}>
      <h2 style={{fontSize:18,fontWeight:600,marginBottom:16}}>Moyen de paiement</h2>
      <p style={{fontSize:13,color:"#6b7280",marginBottom:16}}>Vous pouvez gérer vos informations bancaires utilisées par Planity pour votre abonnement et vos options.</p>
      <div style={{background:"#fffbeb",border:"1px solid #f5c842",borderRadius:8,padding:12,marginBottom:16,display:"flex",gap:8,fontSize:13,color:"#92400e"}}>
        <span>⚠</span>
        <span>Si vous renseignez un nouveau moyen de paiement, il sera utilisé pour les prochaines factures.</span>
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:20,maxWidth:500}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{background:"#f0f9ff",borderRadius:6,padding:"8px 12px",fontWeight:700,color:"#1e40af",fontSize:14}}>S€PA</div>
          <div>
            <div style={{fontWeight:600,fontSize:14}}>FR••••16</div>
            <div style={{fontSize:12,color:"#6b7280"}}>OLINDA - Créé(e) le : 08/12/2025</div>
          </div>
        </div>
        <button style={{marginTop:16,padding:"8px 20px",border:"1px solid #d1d5db",borderRadius:6,cursor:"pointer",background:"#fff",fontSize:13,color:"#374151"}}>Modifier mon moyen de paiement</button>
      </div>
    </div>
  );
}

// ── Admin : Liste des factures
function AdminFactures() {
  return (
    <div style={{padding:24}}>
      <h2 style={{fontSize:18,fontWeight:600,marginBottom:20}}>Liste des factures</h2>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
          {["Numéro","Date","Montant TTC","Statut","Conditions de paiement","Actions"].map(h=>(
            <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:12,fontWeight:600,color:"#6b7280"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {FACTURES_DATA.map(f=>(
            <tr key={f.id} style={{borderBottom:"1px solid #f3f4f6"}}>
              <td style={{padding:"12px",fontSize:13}}>{f.id}</td>
              <td style={{padding:"12px",fontSize:13}}>{f.date}</td>
              <td style={{padding:"12px",fontSize:13}}>{f.montant}</td>
              <td style={{padding:"12px",fontSize:13}}>
                <span style={{background:f.statut==="Payée"?"#d1fae5":f.statut==="Avoir non appliqué"?"#fef3c7":"#fee2e2",color:f.statut==="Payée"?"#065f46":f.statut==="Avoir non appliqué"?"#92400e":"#991b1b",padding:"2px 10px",borderRadius:12,fontSize:12,fontWeight:500}}>
                  {f.statut}
                </span>
              </td>
              <td style={{padding:"12px",fontSize:13,color:"#6b7280"}}>{f.conditions}</td>
              <td style={{padding:"12px",fontSize:13}}><span style={{color:"#c9a84c",cursor:"pointer",textDecoration:"underline"}}>Télécharger</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Helpers Stats
function StatsTabs({active}) {
  const tabs = ["Indicateurs clés","Autres indicateurs","Prestations","Collaborateurs","RDV","RDV pas venus"];
  return (
    <div style={{display:"flex",gap:0,borderBottom:"1px solid #e5e7eb",marginBottom:20,overflowX:"auto"}}>
      {tabs.map(t=>(
        <div key={t} style={{padding:"10px 14px",cursor:"pointer",borderBottom:t===active?"2px solid #c9a84c":"2px solid transparent",color:t===active?"#c9a84c":"#6b7280",fontSize:13,fontWeight:t===active?600:400,whiteSpace:"nowrap"}}>{t}</div>
      ))}
    </div>
  );
}

function StatsToolbar() {
  return (
    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
      <Btn variant="link">📄 Exporter</Btn>
      <Btn variant="link">🖨 Imprimer</Btn>
      <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13}}><input type="checkbox" />Comparer à</label>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#6b7280"}}>‹</button>
        <span style={{fontWeight:600,fontSize:14,padding:"4px 12px",border:"1px solid #d1d5db",borderRadius:6}}>Mai 2026</span>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#6b7280"}}>›</button>
        <select style={{padding:"6px 10px",border:"1px solid #d1d5db",borderRadius:6,fontSize:13}}><option>Mois</option></select>
        <Btn variant="secondary" small>Aujourd'hui</Btn>
      </div>
    </div>
  );
}

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("Agenda");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(now());
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(()=>{const t=setInterval(()=>setCurrentTime(now()),60000);return()=>clearInterval(t);},[]);

  const tabs = ["Agenda","Caisse","Clients","Admin"];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",fontFamily:"'Helvetica Neue',Arial,sans-serif",background:"#0d1b2a"}}>
      {/* Topbar */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px",height:52,background:"#0d1b2a",borderBottom:"1px solid #1e3a5f",flexShrink:0,zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,background:"#c9a84c",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:"#0d1b2a",fontWeight:900,fontSize:16}}>E</div>
          <span style={{color:"#e2e8f0",fontWeight:700,fontSize:15,letterSpacing:2}}>ELNAGAR</span>
        </div>
        <button onClick={()=>setSidebarOpen(s=>!s)} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:18,padding:"4px 8px"}}>☰</button>
        <div style={{display:"flex",gap:0,marginLeft:8}}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",borderBottom:tab===t?"2px solid #c9a84c":"2px solid transparent",color:tab===t?"#c9a84c":"#94a3b8",cursor:"pointer",padding:"14px 16px",fontSize:14,fontWeight:tab===t?600:400}}>
              {t}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
          <span style={{color:"#374151",fontWeight:600,fontSize:15}}>{currentTime}</span>
          <button style={{background:"#c9a84c",color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600}}>+ Nouveau RDV</button>
          <button onClick={()=>setShowNotifs(s=>!s)} style={{background:"none",border:"none",color:showNotifs?"#c9a84c":"#94a3b8",cursor:"pointer",fontSize:20,position:"relative"}}>🔔</button>
        </div>
      </div>

      {/* Content */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {tab==="Agenda" && <AgendaView showNotifsProp={showNotifs} onToggleNotifs={()=>setShowNotifs(s=>!s)} />}
        {tab==="Caisse" && <CaisseView />}
        {tab==="Clients" && <ClientsView />}
        {tab==="Admin" && <AdminView />}
      </div>
    </div>
  );
}
