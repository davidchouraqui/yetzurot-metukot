import { useState, useRef, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ── Firebase config ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDyQPm5TzgAiyUZZ7gTiO0M_qa-YTR0NF8",
  authDomain: "sweet-creations-d1362.firebaseapp.com",
  projectId: "sweet-creations-d1362",
  storageBucket: "sweet-creations-d1362.firebasestorage.app",
  messagingSenderId: "81869622920",
  appId: "1:81869622920:web:d26b3a48b1fda4041b593d",
};
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

// ── Default data (used only on first run) ────────────────────
const DEFAULT_ADMINS = [
  { id: 1, username: "מנהל ראשי", password: "sweet2024", isSuperAdmin: true }
];

const DEFAULT_CATEGORIES = [
  { id: 1, name: "פרחים", emoji: "🌸", images: [
    { id: 101, name: "פרחי בר ורודים", url: "https://images.unsplash.com/photo-1490750967868-88df5691cc0e?w=800&q=90&fit=crop" },
    { id: 102, name: "ורד לבן", url: "https://images.unsplash.com/photo-1455582916367-25ba8de8afa0?w=800&q=90&fit=crop" },
    { id: 103, name: "כלנית סגולה", url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=90&fit=crop" },
    { id: 104, name: "שדה פרחים", url: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=800&q=90&fit=crop" },
    { id: 105, name: "פרח ורוד עדין", url: "https://images.unsplash.com/photo-1487530811015-780940f2ca3b?w=800&q=90&fit=crop" },
    { id: 106, name: "זר פרחי בר", url: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=90&fit=crop" },
  ]},
  { id: 2, name: "יום הולדת", emoji: "🎂", images: [
    { id: 201, name: "בלונים צבעוניים", url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=90&fit=crop" },
    { id: 202, name: "קישוטי יום הולדת", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90&fit=crop" },
    { id: 203, name: "נרות על עוגה", url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=90&fit=crop" },
    { id: 204, name: "קונפטי ורוד", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=90&fit=crop" },
    { id: 205, name: "כדורי זהב", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=90&fit=crop" },
    { id: 206, name: "מסיבה ססגונית", url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=90&fit=crop" },
  ]},
  { id: 3, name: "טבע ונוף", emoji: "🌿", images: [
    { id: 301, name: "שקיעה על הים", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=90&fit=crop" },
    { id: 302, name: "יער ירוק", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=90&fit=crop" },
    { id: 303, name: "הרים מושלגים", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=90&fit=crop" },
    { id: 304, name: "שדה חיטה זהוב", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=90&fit=crop" },
    { id: 305, name: "אגם רגוע", url: "https://images.unsplash.com/photo-1439853949212-36589f9f4e1f?w=800&q=90&fit=crop" },
    { id: 306, name: "ספארי אפריקאי", url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=90&fit=crop" },
  ]},
  { id: 4, name: "חתונה ואהבה", emoji: "💍", images: [
    { id: 401, name: "טבעות נישואין", url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=90&fit=crop" },
    { id: 402, name: "לבבות ורדים", url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=90&fit=crop" },
    { id: 403, name: "שמפניה חגיגית", url: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&q=90&fit=crop" },
    { id: 404, name: "נרות רומנטיים", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=90&fit=crop" },
    { id: 405, name: "זר כלה לבן", url: "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=90&fit=crop" },
    { id: 406, name: "עיצוב חתונה", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=90&fit=crop" },
  ]},
  { id: 5, name: "ילדים ותינוקות", emoji: "🧸", images: [
    { id: 501, name: "כוכבים פסטל", url: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=800&q=90&fit=crop" },
    { id: 502, name: "ענן ורוד חלומי", url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=90&fit=crop" },
    { id: 503, name: "קשת בענן", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=90&fit=crop" },
    { id: 504, name: "חיות חמודות", url: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=90&fit=crop" },
    { id: 505, name: "פרפרים צבעוניים", url: "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?w=800&q=90&fit=crop" },
    { id: 506, name: "כדורים וקשת", url: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800&q=90&fit=crop" },
  ]},
  { id: 6, name: "אוכל ומתוקים", emoji: "🍓", images: [
    { id: 601, name: "תותים טריים", url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=90&fit=crop" },
    { id: 602, name: "מקרונים צבעוניים", url: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&q=90&fit=crop" },
    { id: 603, name: "פירות יער", url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=90&fit=crop" },
    { id: 604, name: "שוקולד מפנק", url: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=90&fit=crop" },
    { id: 605, name: "גלידה פסטל", url: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=90&fit=crop" },
    { id: 606, name: "עוגיות צבעוניות", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=90&fit=crop" },
  ]},
];

// ── Menu data from PDF ───────────────────────────────────────
const MENU_SECTIONS = [
  { id: 1, title: "מאפים ולחמים", emoji: "🥐", items: [
    { name: "קיש בטעמים (ברוקולי/בטטה/פטריות/בצלים/תרד/בלקני)", price: "קוטר 26 — 150 ₪ | קוטר 8 — 20 ₪" },
    { name: "מיני קישים אפויים", price: "24יח׳ 170₪ | 30יח׳ 210₪ | 35יח׳ 240₪ | 40יח׳ 270₪" },
    { name: "פשטידות (פטריות/בטטה/כרובית/תירס/ברוקולי/בצל)", price: "מגש 35×25 — 140 ₪ | אישית — 20 ₪" },
    { name: "מאפינס בטעמים (פטריות/תירס/בצל/זיתים)", price: "12 ₪ ליחידה (מינ׳ 10 יח׳)" },
    { name: "בורקס פינוקים (גבינה/תפו״א)", price: "15יח׳ 180₪ | 20יח׳ 220₪" },
    { name: "בורקיטס סביח", price: "20יח׳ 180₪ | 30יח׳ 220₪" },
    { name: "פוקאצ׳ות (שמן זית/בצלים/אנטיפסטי/פלפלים)", price: "20 ₪ ליחידה" },
    { name: "לחמי מחמצת במגוון טעמים", price: "30 ₪" },
    { name: "מאפים (בורקסים/קרואסונים)", price: "15יח׳ — 90 ₪" },
    { name: "פריקסה", price: "15 ₪ ליחידה (מינ׳ 10 יח׳)" },
  ]},
  { id: 2, title: "כריכים וסנדוויצ׳ים", emoji: "🥪", items: [
    { name: "כריכים (חביתה/סביח/צפתית/בולגרית/טונה/סלט ביצים)", price: "לחמניה עגולה 12 ₪ | מאורכת 19 ₪" },
    { name: "כריך קרואסון (גבינת שמנת+סלמון/בולגרית/סביח)", price: "12יח׳ 170₪ | 18יח׳ 240₪" },
    { name: "כריך פחזניות (אבוקדו/טונה/סלט ביצים)", price: "20יח׳ 180₪ | 30יח׳ 240₪" },
    { name: "חצאי טורטיות (טונה/סלט ביצים/סביח/אבוקדו/גבינה)", price: "20חצאים 130₪ | 30חצאים 180₪ | 40חצאים 230₪" },
    { name: "פיתות ביס (חביתה/חביתת ירק/סביח)", price: "14 ₪ ליחידה (מינ׳ 10 יח׳)" },
    { name: "ברוסקטות חלבי/פרווה", price: "20יח׳ — 150 ₪" },
    { name: "פיצות אישיות (חלבי/פרווה)", price: "12יח׳ 90₪ | 24יח׳ 160₪" },
  ]},
  { id: 3, title: "סלטים ופלטות", emoji: "🥗", items: [
    { name: "סלטים חלביים (יווני, חלומי)", price: "קערה 5ל׳ 150₪ | קערה 3ל׳ 110₪" },
    { name: "סלטים (גזר פקאן/בורגול/עלים/קינואה/כרוב/עדשים ובטטה)", price: "קערה 5ל׳ 140₪ | קערה 3ל׳ 100₪" },
    { name: "אנטיפסטי", price: "קטן 35×25 — 100₪ | גדול 43×30 — 140₪" },
    { name: "פלטת גבינות", price: "קטן 180₪ | גדול 370₪" },
    { name: "פלטת ירקות", price: "קטן 130₪ | גדול 180₪" },
    { name: "פלטת פירות (אין בחורף)", price: "קטן 190₪ | גדול 300₪" },
  ]},
  { id: 4, title: "פסטות ומנות חמות", emoji: "🍝", items: [
    { name: "פסטות/ניוקי ברוטב שמנת/שמנת פטריות/שמנת פסטו/עגבנייה/רוזה", price: "מגש 35×25 (10 סועדים) — 140 ₪" },
    { name: "תפוח אדמה מוקרם בגבינות", price: "מגש 35×25 — 140 ₪" },
    { name: "שקשוקה פיקנטית", price: "10ביצים 140₪ | 15ביצים 170₪ | אישית 15₪ (+בגטים 20₪)" },
    { name: "לביבות (תפו״א/בטטה/ירקות)", price: "20יח׳ 130₪ | 30יח׳ 190₪" },
    { name: "בלינצס (תפו״א / תפו״א+בצל מטוגן)", price: "10יח׳ 90₪ | 20יח׳ 160₪" },
  ]},
  { id: 5, title: "קינוחים ועוגות", emoji: "🍰", items: [
    { name: "עוגת גבינה אפויה", price: "קוטר 20 — 150₪ | קוטר 22 — 200₪" },
    { name: "משולש גבינה קרה (לוטוס/אוראו/פירורים/אוכמניות)", price: "25 ₪ ליחידה" },
    { name: "8 משולשי גבינה קרה במגוון ציפויים", price: "190 ₪" },
    { name: "פס גבינה קרה/גבינה טבעונית", price: "100 ₪" },
    { name: "פס מוס (טריקולד/אוראו ועוד)", price: "130 ₪" },
    { name: "עוגות פס בחושות (אגוזים/מייפל/תפוזים/שוקולד/פרג/תפוחים ועוד)", price: "40 ₪" },
    { name: "עוגת שמרים פס (שוקולד/פרג/אוכמניות/חלבה)", price: "50 ₪" },
    { name: "בראוניז שוקולד (30יח׳)", price: "100 ₪" },
    { name: "פאי פירות (קוטר 24)", price: "150 ₪" },
    { name: "פאי שוקולד (קוטר 24)", price: "140 ₪" },
    { name: "פאי לימון (קוטר 24)", price: "160 ₪" },
    { name: "פאי פקאן (קוטר 24)", price: "160 ₪" },
    { name: "קינוחי כוסות", price: "12יח׳ 140₪ | 20יח׳ 220₪ | 30יח׳ 300₪" },
    { name: "קרם ברולה", price: "15 ₪ ליחידה" },
    { name: "סופלה", price: "18 ₪ ליחידה (מינ׳ 10 יח׳)" },
    { name: "קראמבל תפוחים", price: "15 ₪ ליחידה (מינ׳ 10 יח׳)" },
  ]},
  { id: 6, title: "מאפים מתוקים ועוגיות", emoji: "🍪", items: [
    { name: "מגש עוגיות מעורב", price: "30יח׳ 90₪ | 50יח׳ 130₪ | 80יח׳ 230₪" },
    { name: "קופסת עוגיות (כ-300 גרם)", price: "50 ₪" },
    { name: "קופסת עוגיות אלפחורס", price: "60 ₪" },
    { name: "מקרונים בטעמים", price: "6 ₪ ליחידה (מינ׳ 10 יח׳)" },
    { name: "טארט מתוק במארז", price: "24יח׳ 180₪ | 30יח׳ 210₪ | 35יח׳ 250₪ | 40יח׳ 270₪" },
    { name: "טראפלס", price: "30יח׳ — 90 ₪" },
    { name: "כדורי שוקולד", price: "3 ₪ ליחידה (מינ׳ 20יח׳)" },
    { name: "פחזניות", price: "7 ₪ ליחידה (מינ׳ 20יח׳)" },
    { name: "פחזניות בציפוי שוקולד", price: "8 ₪ ליחידה (מינ׳ 20יח׳)" },
    { name: "מיני דונאטס", price: "7 ₪ ליחידה (מינ׳ 15יח׳)" },
    { name: "ספינג׳", price: "15יח׳ 80₪ | 30יח׳ 140₪" },
    { name: "בלינצס מתוק (גבינה/גבינה+צימוקים)", price: "10יח׳ 90₪ | 20יח׳ 160₪" },
  ]},
];

const FONTS = [
  { name: "כתב יד", value: "'Dancing Script', cursive" },
  { name: "אלגנטי", value: "'Cormorant Garamond', serif" },
  { name: "מעוגל", value: "'Nunito', sans-serif" },
  { name: "בולד", value: "'Fredoka One', cursive" },
];
const TEXT_COLORS = ["#1a1a2e","#c0306a","#7c3aed","#0ea5e9","#059669","#d97706","#ffffff","#f9a8d4"];

// ── Save helpers ─────────────────────────────────────────────
async function saveToFirebase(key, data) {
  try { await setDoc(doc(db, "app_data", key), { value: JSON.stringify(data) }); } catch(e) { console.error("Firebase save error:", e); }
}
async function loadFromFirebase(key) {
  try {
    const snap = await getDoc(doc(db, "app_data", key));
    if (snap.exists()) return JSON.parse(snap.data().value);
  } catch(e) { console.error("Firebase load error:", e); }
  return null;
}

export default function App() {
  // ── State ────────────────────────────────────────────────
  const [admins, setAdmins] = useState(DEFAULT_ADMINS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [dbReady, setDbReady] = useState(false); // loading indicator

  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [mode, setMode] = useState("customer");
  const [showMenu, setShowMenu] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminTab, setAdminTab] = useState("gallery");

  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminMsg, setNewAdminMsg] = useState("");
  const [changePwTarget, setChangePwTarget] = useState(null);
  const [changePwOld, setChangePwOld] = useState("");
  const [changePwNew, setChangePwNew] = useState("");
  const [changePwConfirm, setChangePwConfirm] = useState("");
  const [changePwMsg, setChangePwMsg] = useState("");

  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("📁");
  const [newCatMsg, setNewCatMsg] = useState("");
  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatEmoji, setEditCatEmoji] = useState("");
  const [uploadCatId, setUploadCatId] = useState(null);
  const [adminUploadName, setAdminUploadName] = useState("");
  const adminFileRef = useRef(null);
  const nextImgId = useRef(700);
  const nextCatId = useRef(10);
  const nextAdminId = useRef(2);

  const [activeCatId, setActiveCatId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [captionColor, setCaptionColor] = useState("#c0306a");
  const [captionFont, setCaptionFont] = useState(FONTS[0]);
  const [captionSize, setCaptionSize] = useState(32);
  const [captionPos, setCaptionPos] = useState({ x: 50, y: 75 });
  const [step, setStep] = useState("gallery");
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const canvasRef = useRef(null);

  // ── Load from Firebase on mount ──────────────────────────
  useEffect(() => {
    (async () => {
      const [savedAdmins, savedCats] = await Promise.all([
        loadFromFirebase("admins"),
        loadFromFirebase("categories"),
      ]);
      if (savedAdmins) { setAdmins(savedAdmins); nextAdminId.current = Math.max(...savedAdmins.map(a => a.id)) + 1; }
      else await saveToFirebase("admins", DEFAULT_ADMINS);

      if (savedCats) {
        setCategories(savedCats);
        const maxCat = Math.max(...savedCats.map(c => c.id));
        nextCatId.current = maxCat + 1;
        const maxImg = Math.max(...savedCats.flatMap(c => c.images.map(i => i.id)), 700);
        nextImgId.current = maxImg + 1;
      } else await saveToFirebase("categories", DEFAULT_CATEGORIES);

      setDbReady(true);
    })();
  }, []);

  // ── Persist helpers ──────────────────────────────────────
  const updateAdmins = (newAdmins) => { setAdmins(newAdmins); saveToFirebase("admins", newAdmins); };
  const updateCategories = (newCats) => { setCategories(newCats); saveToFirebase("categories", newCats); };

  // ── Auth ─────────────────────────────────────────────────
  const handleLogin = () => {
    const found = admins.find(a => a.username === loginUsername.trim() && a.password === loginPassword);
    if (found) { setCurrentAdmin(found); setMode("admin"); setAdminTab("gallery"); setLoginError(""); setLoginUsername(""); setLoginPassword(""); }
    else setLoginError("שם משתמש או סיסמה שגויים");
  };
  const handleLogout = () => { setCurrentAdmin(null); setMode("customer"); setChangePwTarget(null); };

  // ── Admin management ─────────────────────────────────────
  const addAdmin = () => {
    const name = newAdminUsername.trim(), pass = newAdminPassword.trim();
    if (!name || !pass) { setNewAdminMsg("יש למלא שם וסיסמה"); return; }
    if (admins.find(a => a.username === name)) { setNewAdminMsg("שם משתמש כבר קיים"); return; }
    const updated = [...admins, { id: nextAdminId.current++, username: name, password: pass, isSuperAdmin: false }];
    updateAdmins(updated);
    setNewAdminUsername(""); setNewAdminPassword(""); setNewAdminMsg("✅ מנהל נוסף!"); setTimeout(() => setNewAdminMsg(""), 2500);
  };
  const openChangePw = (admin) => { setChangePwTarget(admin.id); setChangePwOld(""); setChangePwNew(""); setChangePwConfirm(""); setChangePwMsg(""); };
  const submitChangePw = () => {
    const admin = admins.find(a => a.id === changePwTarget);
    if (admin.id === currentAdmin.id && changePwOld !== admin.password) { setChangePwMsg("❌ הסיסמה הנוכחית שגויה"); return; }
    if (!changePwNew || changePwNew.length < 4) { setChangePwMsg("❌ מינימום 4 תווים"); return; }
    if (changePwNew !== changePwConfirm) { setChangePwMsg("❌ הסיסמות אינן תואמות"); return; }
    const updated = admins.map(a => a.id === changePwTarget ? { ...a, password: changePwNew } : a);
    updateAdmins(updated);
    if (changePwTarget === currentAdmin.id) setCurrentAdmin(prev => ({ ...prev, password: changePwNew }));
    setChangePwMsg("✅ הסיסמה שונתה!");
    setTimeout(() => { setChangePwTarget(null); setChangePwMsg(""); }, 2000);
  };

  // ── Category management ───────────────────────────────────
  const addCategory = () => {
    if (!newCatName.trim()) { setNewCatMsg("יש להזין שם ספרייה"); return; }
    const updated = [...categories, { id: nextCatId.current++, name: newCatName.trim(), emoji: newCatEmoji, images: [] }];
    updateCategories(updated);
    setNewCatName(""); setNewCatEmoji("📁"); setNewCatMsg("✅ ספרייה נוספה!"); setTimeout(() => setNewCatMsg(""), 2500);
  };
  const deleteCategory = (id) => { updateCategories(categories.filter(c => c.id !== id)); if (editCatId === id) setEditCatId(null); };
  const openEditCat = (cat) => { setEditCatId(cat.id); setEditCatName(cat.name); setEditCatEmoji(cat.emoji); };
  const saveEditCat = () => {
    if (!editCatName.trim()) return;
    updateCategories(categories.map(c => c.id === editCatId ? { ...c, name: editCatName.trim(), emoji: editCatEmoji } : c));
    setEditCatId(null);
  };

  // ── Image management ──────────────────────────────────────
  const handleAdminUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = categories.map(cat =>
        cat.id === uploadCatId
          ? { ...cat, images: [...cat.images, { id: nextImgId.current++, url: ev.target.result, name: adminUploadName || file.name.replace(/\.[^.]+$/, "") }] }
          : cat
      );
      updateCategories(updated);
      setAdminUploadName("");
    };
    reader.readAsDataURL(file);
  };
  const deleteImage = (catId, imgId) => {
    updateCategories(categories.map(cat => cat.id === catId ? { ...cat, images: cat.images.filter(i => i.id !== imgId) } : cat));
  };

  // ── Caption drag ──────────────────────────────────────────
  const startDrag = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setDragging(true); setDragStart({ mx: cx, my: cy, px: captionPos.x, py: captionPos.y });
  };
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const rect = canvasRef.current?.getBoundingClientRect(); if (!rect) return;
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      setCaptionPos({ x: Math.max(0,Math.min(100, dragStart.px+((cx-dragStart.mx)/rect.width)*100)), y: Math.max(0,Math.min(100, dragStart.py+((cy-dragStart.my)/rect.height)*100)) });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove",onMove); window.addEventListener("mouseup",onUp);
    window.addEventListener("touchmove",onMove,{passive:false}); window.addEventListener("touchend",onUp);
    return () => { window.removeEventListener("mousemove",onMove); window.removeEventListener("mouseup",onUp); window.removeEventListener("touchmove",onMove); window.removeEventListener("touchend",onUp); };
  }, [dragging, dragStart]);

  const totalImages = categories.reduce((s,c) => s+c.images.length, 0);

  // ── Loading screen ────────────────────────────────────────
  if (!dbReady) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#faf7f4", fontFamily:"'Nunito',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ fontSize:48, marginBottom:16, animation:"spin 1s linear infinite" }}>🍰</div>
      <div style={{ fontFamily:"'Dancing Script',cursive", fontSize:28, color:"#b5005b", fontWeight:800 }}>יצירות מתוקות</div>
      <div style={{ color:"#9c7ab5", fontSize:14, marginTop:8 }}>מתחבר למאגר הנתונים...</div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );

  // ── Main render ───────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#faf7f4", fontFamily:"'Nunito',sans-serif", direction:"rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Cormorant+Garamond:wght@600;700&family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{ background:"#fff", borderBottom:"1px solid #f0e8e0", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:28 }}>🍰</span>
          <div>
            <div style={{ fontWeight:800, fontSize:22, color:"#b5005b", fontFamily:"'Dancing Script',cursive" }}>יצירות מתוקות</div>
            <div style={{ fontSize:10, color:"#a78bba", fontWeight:700, letterSpacing:2 }}>SUGAR SHEET STUDIO</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => setShowMenu(true)} style={{ background:"linear-gradient(135deg,#b5005b,#7c3aed)", color:"#fff", border:"none", borderRadius:10, padding:"8px 16px", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            📋 תפריט
          </button>
          {mode === "admin" ? (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:"#7c3aed", fontWeight:700 }}>👤 {currentAdmin?.username}</span>
              <button onClick={handleLogout} style={outlineBtn("#9ca3af")}>יציאה</button>
            </div>
          ) : (
            <button onClick={() => setMode("login")} style={outlineBtn("#7c3aed")}>🔑 כניסת מנהל</button>
          )}
        </div>
      </header>

      {/* MENU MODAL */}
      {showMenu && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:300, overflowY:"auto", direction:"rtl" }} onClick={() => setShowMenu(false)}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth:700, margin:"20px auto", background:"#fff", borderRadius:24, overflow:"hidden", boxShadow:"0 30px 80px rgba(0,0,0,0.3)" }}>
            {/* Menu header */}
            <div style={{ background:"linear-gradient(135deg,#b5005b,#7c3aed)", padding:"28px 28px 20px", textAlign:"center", position:"relative" }}>
              <button onClick={() => setShowMenu(false)} style={{ position:"absolute", top:14, left:14, background:"rgba(255,255,255,0.2)", border:"none", borderRadius:"50%", width:32, height:32, color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
              <div style={{ fontSize:36, marginBottom:6 }}>🍰</div>
              <h2 style={{ margin:0, color:"#fff", fontFamily:"'Dancing Script',cursive", fontSize:30, fontWeight:800 }}>תפריט אירוח וקינוחים</h2>
              <p style={{ color:"rgba(255,255,255,0.8)", margin:"6px 0 0", fontSize:13, fontWeight:700 }}>פרווה / חלבי — 2025</p>
              <p style={{ color:"rgba(255,255,255,0.7)", margin:"4px 0 0", fontSize:12 }}>כשר חלבי/פרווה בהשגחת הרבנות חדרה</p>
            </div>
            {/* Menu sections */}
            <div style={{ padding:"20px 24px 28px" }}>
              {MENU_SECTIONS.map(section => (
                <div key={section.id} style={{ marginBottom:24 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, borderBottom:"2px solid #f0e8f8", paddingBottom:8 }}>
                    <span style={{ fontSize:22 }}>{section.emoji}</span>
                    <h3 style={{ margin:0, color:"#b5005b", fontWeight:800, fontSize:17, fontFamily:"'Dancing Script',cursive" }}>{section.title}</h3>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {section.items.map((item, i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, padding:"8px 12px", background: i%2===0 ? "#fdf8ff" : "#fff", borderRadius:10 }}>
                        <span style={{ fontSize:13, color:"#2d1b4e", fontWeight:600, flex:1 }}>{item.name}</span>
                        <span style={{ fontSize:12, color:"#b5005b", fontWeight:800, whiteSpace:"nowrap", textAlign:"left" }}>{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* Footer notes */}
              <div style={{ background:"#fdf8ff", border:"1px solid #e9d5ff", borderRadius:14, padding:"14px 16px", marginTop:8 }}>
                <p style={{ margin:"0 0 6px", fontWeight:800, color:"#7c3aed", fontSize:13 }}>📌 לתשומת לבך</p>
                <p style={{ margin:"0 0 4px", fontSize:12, color:"#4b2a7a" }}>• שריון תאריך ובצוע הזמנה מותנה בתשלום מקדמה בשווי 50% מסך ההזמנה</p>
                <p style={{ margin:"0 0 4px", fontSize:12, color:"#4b2a7a" }}>• ביטול הזמנה בתוך 24 שעות ממועד האירוע יחויב ב-80% משווי ההזמנה</p>
                <p style={{ margin:"0 0 8px", fontSize:12, color:"#4b2a7a" }}>• לא מצאתם משהו? שאלו אותי ואנסה לעזור!</p>
                <a href="tel:053-6200790" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"linear-gradient(135deg,#b5005b,#7c3aed)", color:"#fff", borderRadius:10, padding:"8px 16px", fontWeight:800, fontSize:14, textDecoration:"none" }}>
                  📞 מיכל שורקי — 053-6200790
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {mode === "login" && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={{ fontSize:36, marginBottom:8 }}>🔐</div>
            <h2 style={{ margin:"0 0 4px", color:"#2d1b4e", fontSize:20, fontWeight:800 }}>כניסת מנהל</h2>
            <p style={{ color:"#9c7ab5", fontSize:13, marginBottom:16 }}>יצירות מתוקות — אזור מנהלים</p>
            <input placeholder="שם משתמש" value={loginUsername} onChange={e=>{setLoginUsername(e.target.value);setLoginError("");}} style={{...tIn,marginBottom:8}} />
            <input type="password" placeholder="סיסמה" value={loginPassword} onChange={e=>{setLoginPassword(e.target.value);setLoginError("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...tIn,borderColor:loginError?"#ef4444":"#e5d8f0",marginBottom:6}} />
            {loginError && <p style={{ color:"#ef4444", fontSize:12, margin:"0 0 8px" }}>{loginError}</p>}
            <div style={{ display:"flex", gap:8, marginTop:4, justifyContent:"center" }}>
              <button onClick={handleLogin} style={solidBtn("#7c3aed")}>כניסה</button>
              <button onClick={()=>{setMode("customer");setLoginError("");}} style={outlineBtn("#9ca3af")}>ביטול</button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {changePwTarget !== null && (
        <div style={modalOverlay}>
          <div style={{...modalBox,width:340}}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔒</div>
            <h2 style={{ margin:"0 0 4px", color:"#2d1b4e", fontSize:18, fontWeight:800 }}>שינוי סיסמה</h2>
            <p style={{ color:"#9c7ab5", fontSize:12, marginBottom:14 }}>עבור: <strong>{admins.find(a=>a.id===changePwTarget)?.username}</strong></p>
            {changePwTarget===currentAdmin.id && <input type="password" placeholder="סיסמה נוכחית" value={changePwOld} onChange={e=>{setChangePwOld(e.target.value);setChangePwMsg("");}} style={{...tIn,marginBottom:8}} />}
            <input type="password" placeholder="סיסמה חדשה (4+ תווים)" value={changePwNew} onChange={e=>{setChangePwNew(e.target.value);setChangePwMsg("");}} style={{...tIn,marginBottom:8}} />
            <input type="password" placeholder="אישור סיסמה" value={changePwConfirm} onChange={e=>{setChangePwConfirm(e.target.value);setChangePwMsg("");}} onKeyDown={e=>e.key==="Enter"&&submitChangePw()} style={{...tIn,marginBottom:8}} />
            {changePwMsg && <p style={{ color:changePwMsg.startsWith("✅")?"#059669":"#ef4444", fontSize:13, margin:"0 0 8px", fontWeight:700 }}>{changePwMsg}</p>}
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              <button onClick={submitChangePw} style={solidBtn("#7c3aed")}>שמור</button>
              <button onClick={()=>setChangePwTarget(null)} style={outlineBtn("#9ca3af")}>ביטול</button>
            </div>
          </div>
        </div>
      )}

      <main style={{ maxWidth:960, margin:"0 auto", padding:"24px 16px" }}>

        {/* ── ADMIN ── */}
        {mode === "admin" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ background:"#7c3aed", color:"#fff", borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700 }}>מצב מנהל</span>
                <h2 style={{ margin:0, color:"#2d1b4e", fontSize:18, fontWeight:800 }}>לוח ניהול — יצירות מתוקות</h2>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>setAdminTab("gallery")} style={adminTab==="gallery"?solidBtn("#7c3aed"):outlineBtn("#7c3aed")}>🖼️ ספריות</button>
                <button onClick={()=>setAdminTab("admins")} style={adminTab==="admins"?solidBtn("#b5005b"):outlineBtn("#b5005b")}>👥 מנהלים</button>
              </div>
            </div>

            {adminTab === "gallery" && (
              <div>
                {/* Stats */}
                <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
                  {[["📁",categories.length,"ספריות"],["🖼️",totalImages,"תמונות"]].map(([e,n,l])=>(
                    <div key={l} style={{ background:"#fff", borderRadius:14, padding:"12px 20px", boxShadow:"0 2px 10px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:24 }}>{e}</span>
                      <div><div style={{ fontWeight:800, fontSize:22, color:"#7c3aed" }}>{n}</div><div style={{ fontSize:11, color:"#9c7ab5", fontWeight:700 }}>{l}</div></div>
                    </div>
                  ))}
                </div>

                {/* Add category */}
                <div style={{ background:"#fff", borderRadius:16, padding:20, marginBottom:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontWeight:800, color:"#2d1b4e", margin:"0 0 12px" }}>➕ יצירת ספרייה חדשה</p>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                    <input placeholder="😊" value={newCatEmoji} onChange={e=>setNewCatEmoji(e.target.value)} style={{...tIn,width:60,textAlign:"center",fontSize:20}} />
                    <input placeholder="שם הספרייה" value={newCatName} onChange={e=>setNewCatName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCategory()} style={{...tIn,flex:1,minWidth:160}} />
                    <button onClick={addCategory} style={solidBtn("#7c3aed")}>צור ספרייה</button>
                  </div>
                  {newCatMsg && <p style={{ color:"#059669", fontSize:13, margin:"8px 0 0", fontWeight:700 }}>{newCatMsg}</p>}
                </div>

                {/* Categories */}
                {categories.map(cat => (
                  <div key={cat.id} style={{ background:"#fff", borderRadius:16, padding:18, marginBottom:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:8 }}>
                      {editCatId === cat.id ? (
                        <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, flexWrap:"wrap" }}>
                          <input value={editCatEmoji} onChange={e=>setEditCatEmoji(e.target.value)} style={{...tIn,width:56,textAlign:"center",fontSize:20,padding:"6px 8px"}} />
                          <input value={editCatName} onChange={e=>setEditCatName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveEditCat()} style={{...tIn,flex:1,minWidth:130}} autoFocus />
                          <button onClick={saveEditCat} style={{...solidBtn("#059669"),padding:"8px 14px",fontSize:13}}>✓ שמור</button>
                          <button onClick={()=>setEditCatId(null)} style={{...outlineBtn("#9ca3af"),padding:"7px 12px",fontSize:13}}>ביטול</button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:22 }}>{cat.emoji}</span>
                            <span style={{ fontWeight:800, color:"#2d1b4e", fontSize:16 }}>{cat.name}</span>
                            <span style={{ background:"#f3f0ff", color:"#7c3aed", borderRadius:12, padding:"2px 10px", fontSize:12, fontWeight:700 }}>{cat.images.length} תמונות</span>
                          </div>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                            <button onClick={()=>openEditCat(cat)} style={{...outlineBtn("#7c3aed"),padding:"6px 11px",fontSize:12}}>✏️ עריכה</button>
                            <button onClick={()=>{setUploadCatId(cat.id);adminFileRef.current.click();}} style={{...solidBtn("#7c3aed"),padding:"7px 12px",fontSize:12}}>📤 הוסף תמונה</button>
                            <button onClick={()=>deleteCategory(cat.id)} style={{ background:"#fee2e2",border:"none",borderRadius:8,color:"#dc2626",cursor:"pointer",padding:"7px 12px",fontSize:12,fontWeight:700 }}>🗑️ מחק</button>
                          </div>
                        </>
                      )}
                    </div>
                    {uploadCatId===cat.id && (
                      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                        <input placeholder="שם לתמונה (אופציונלי)" value={adminUploadName} onChange={e=>setAdminUploadName(e.target.value)} style={{...tIn,flex:1}} />
                      </div>
                    )}
                    {cat.images.length===0 ? (
                      <div style={{ textAlign:"center",padding:"20px 0",color:"#c4a8de",fontSize:13 }}>אין תמונות בספרייה זו עדיין</div>
                    ) : (
                      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10 }}>
                        {cat.images.map(img=>(
                          <div key={img.id} style={{ borderRadius:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>
                            <img src={img.url} alt={img.name} style={{ width:"100%",height:100,objectFit:"cover",display:"block" }} />
                            <div style={{ padding:"6px 8px",background:"#faf7ff",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                              <span style={{ fontSize:11,fontWeight:700,color:"#4b2a7a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1 }}>{img.name}</span>
                              <button onClick={()=>deleteImage(cat.id,img.id)} style={{ background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:14,padding:"0 2px" }}>✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <input type="file" accept="image/*" ref={adminFileRef} onChange={handleAdminUpload} style={{ display:"none" }} />
              </div>
            )}

            {adminTab === "admins" && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ background:"#fff",borderRadius:16,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontWeight:800,color:"#2d1b4e",margin:"0 0 14px",fontSize:15 }}>➕ הוספת מנהל חדש</p>
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                    <input placeholder="שם משתמש" value={newAdminUsername} onChange={e=>setNewAdminUsername(e.target.value)} style={{...tIn,flex:1,minWidth:130}} />
                    <input type="password" placeholder="סיסמה" value={newAdminPassword} onChange={e=>setNewAdminPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAdmin()} style={{...tIn,flex:1,minWidth:130}} />
                    <button onClick={addAdmin} style={solidBtn("#b5005b")}>הוסף</button>
                  </div>
                  {newAdminMsg && <p style={{ color:newAdminMsg.startsWith("✅")?"#059669":"#ef4444",fontSize:13,margin:"8px 0 0",fontWeight:700 }}>{newAdminMsg}</p>}
                </div>
                <div style={{ background:"#fff",borderRadius:16,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontWeight:800,color:"#2d1b4e",margin:"0 0 14px",fontSize:15 }}>👥 רשימת מנהלים</p>
                  <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                    {admins.map(admin=>(
                      <div key={admin.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:admin.id===currentAdmin.id?"#f5f0ff":"#faf7ff",border:admin.id===currentAdmin.id?"2px solid #c4b5fd":"1px solid #ede9fe",borderRadius:12,padding:"10px 14px",flexWrap:"wrap",gap:8 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <span style={{ fontSize:18 }}>{admin.isSuperAdmin?"👑":"👤"}</span>
                          <span style={{ fontWeight:800,color:"#2d1b4e",fontSize:14 }}>{admin.username}</span>
                          {admin.isSuperAdmin && <span style={{ fontSize:11,background:"#fde68a",color:"#92400e",borderRadius:8,padding:"2px 8px",fontWeight:700 }}>מנהל ראשי</span>}
                          {admin.id===currentAdmin.id && <span style={{ fontSize:11,background:"#ddd6fe",color:"#5b21b6",borderRadius:8,padding:"2px 8px",fontWeight:700 }}>אתה</span>}
                        </div>
                        <div style={{ display:"flex",gap:6 }}>
                          <button onClick={()=>openChangePw(admin)} style={{...outlineBtn("#7c3aed"),fontSize:12,padding:"5px 10px"}}>🔒 שנה סיסמה</button>
                          {!admin.isSuperAdmin && <button onClick={()=>updateAdmins(admins.filter(a=>a.id!==admin.id))} style={{ background:"#fee2e2",border:"none",borderRadius:8,color:"#dc2626",cursor:"pointer",padding:"5px 10px",fontSize:12,fontWeight:700 }}>הסר</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CUSTOMER ── */}
        {mode === "customer" && (
          <>
            {/* Steps */}
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:28 }}>
              {[["gallery","1","בחרי תמונה"],["edit","2","הוסיפי כיתוב"],["preview","3","תצוגה מקדימה"]].map(([s,num,label],i)=>{
                const isActive=step===s, isDone=(s==="gallery"&&["edit","preview"].includes(step))||(s==="edit"&&step==="preview");
                return (
                  <div key={s} style={{ display:"flex",alignItems:"center" }}>
                    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                      <div style={{ width:36,height:36,borderRadius:"50%",background:isActive?"#b5005b":isDone?"#10b981":"#e5d8f0",color:isActive||isDone?"#fff":"#9c7ab5",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,transition:"all 0.3s" }}>{isDone?"✓":num}</div>
                      <span style={{ fontSize:11,fontWeight:700,color:isActive?"#b5005b":"#b8a0cc" }}>{label}</span>
                    </div>
                    {i<2 && <div style={{ width:40,height:2,background:isDone?"#10b981":"#e5d8f0",margin:"0 4px 18px" }} />}
                  </div>
                );
              })}
            </div>

            {/* STEP 1 */}
            {step==="gallery" && (
              <div>
                <h2 style={{ textAlign:"center",color:"#b5005b",fontWeight:800,margin:"0 0 4px",fontFamily:"'Dancing Script',cursive",fontSize:30 }}>יצירות מתוקות ✨</h2>
                <p style={{ textAlign:"center",color:"#9c7ab5",fontSize:13,marginBottom:24 }}>בחרי קטגוריה ואז תמונה לדף הסוכר שלך</p>
                {/* Horizontal scroll category bar */}
                <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch", marginBottom:24, marginLeft:-16, marginRight:-16, paddingLeft:16, paddingRight:16 }}>
                  <div style={{ display:"flex", gap:10, width:"max-content", paddingBottom:6 }}>
                    {/* "הכל" card */}
                    <div onClick={()=>setActiveCatId(null)} style={{
                      width:80, flexShrink:0, cursor:"pointer", borderRadius:16,
                      border: activeCatId===null ? "2.5px solid #b5005b" : "2.5px solid #f0e0f0",
                      background: activeCatId===null ? "linear-gradient(160deg,#b5005b,#7c3aed)" : "#fff",
                      boxShadow: activeCatId===null ? "0 4px 16px rgba(181,0,91,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                      transition:"all 0.2s", overflow:"hidden"
                    }}>
                      <div style={{ height:60, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🌟</div>
                      <div style={{ padding:"6px 4px 8px", textAlign:"center", fontSize:11, fontWeight:800, color: activeCatId===null ? "#fff" : "#4b2a7a" }}>הכל</div>
                    </div>
                    {/* Category cards */}
                    {categories.map(cat => {
                      const active = activeCatId === cat.id;
                      const firstImg = cat.images[0]?.url;
                      return (
                        <div key={cat.id} onClick={()=>setActiveCatId(cat.id)} style={{
                          width:80, flexShrink:0, cursor:"pointer", borderRadius:16,
                          border: active ? "2.5px solid #b5005b" : "2.5px solid transparent",
                          boxShadow: active ? "0 4px 16px rgba(181,0,91,0.28)" : "0 2px 8px rgba(0,0,0,0.08)",
                          background:"#fff", overflow:"hidden", transition:"all 0.2s",
                          transform: active ? "translateY(-3px)" : "translateY(0)"
                        }}>
                          {firstImg ? (
                            <div style={{ position:"relative" }}>
                              <img src={firstImg} alt={cat.name} style={{ width:"100%", height:60, objectFit:"cover", display:"block" }} />
                              {active && <div style={{ position:"absolute", inset:0, background:"rgba(181,0,91,0.18)" }} />}
                              <span style={{ position:"absolute", bottom:3, right:4, fontSize:16 }}>{cat.emoji}</span>
                            </div>
                          ) : (
                            <div style={{ height:60, background: active?"linear-gradient(160deg,#b5005b,#7c3aed)":"#f3f0ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{cat.emoji}</div>
                          )}
                          <div style={{ padding:"5px 4px 7px", textAlign:"center", fontSize:10, fontWeight:800, color: active?"#b5005b":"#4b2a7a", lineHeight:1.3 }}>{cat.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {(()=>{
                  const vis=activeCatId?categories.filter(c=>c.id===activeCatId):categories;
                  const all=vis.flatMap(cat=>cat.images.map(img=>({...img,catName:cat.name,catEmoji:cat.emoji})));
                  if(all.length===0) return <div style={{ textAlign:"center",color:"#c4a8de",padding:60,background:"#fff",borderRadius:16 }}><div style={{ fontSize:48,marginBottom:12 }}>🖼️</div><p style={{ fontWeight:700 }}>אין תמונות בספרייה זו עדיין</p></div>;
                  return (
                    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:16 }}>
                      {all.map(img=>(
                        <div key={img.id} onClick={()=>{setSelectedImage(img);setStep("edit");setCaptionPos({x:50,y:75});setCaption("");}}
                          style={{ background:"#fff",borderRadius:16,overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 16px rgba(0,0,0,0.07)",border:"2px solid transparent",transition:"all 0.2s" }}
                          onMouseEnter={e=>{e.currentTarget.style.border="2px solid #b5005b";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(181,0,91,0.18)";}}
                          onMouseLeave={e=>{e.currentTarget.style.border="2px solid transparent";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 16px rgba(0,0,0,0.07)";}}>
                          <div style={{ position:"relative" }}>
                            <img src={img.url} alt={img.name} style={{ width:"100%",height:160,objectFit:"cover",display:"block" }} />
                            <span style={{ position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.9)",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700,color:"#4b2a7a" }}>{img.catEmoji} {img.catName}</span>
                          </div>
                          <div style={{ padding:"10px 12px",fontWeight:700,fontSize:13,color:"#4b2a7a" }}>{img.name}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* STEP 2 */}
            {step==="edit" && selectedImage && (
              <div style={{ display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center" }}>
                <div>
                  <p style={{ color:"#9c7ab5",fontSize:12,textAlign:"center",margin:"0 0 8px" }}>גרור את הכיתוב לשינוי מיקום</p>
                  <div ref={canvasRef} style={{ width:320,height:320,borderRadius:16,overflow:"hidden",position:"relative",boxShadow:"0 8px 32px rgba(0,0,0,0.15)",userSelect:"none" }}>
                    <img src={selectedImage.url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",pointerEvents:"none" }} />
                    {caption && (
                      <div onMouseDown={startDrag} onTouchStart={startDrag}
                        style={{ position:"absolute",left:`${captionPos.x}%`,top:`${captionPos.y}%`,transform:"translate(-50%,-50%)",fontFamily:captionFont.value,fontSize:captionSize,color:captionColor,cursor:"grab",whiteSpace:"nowrap",textShadow:"0 1px 4px rgba(0,0,0,0.3),0 0 12px rgba(255,255,255,0.4)",touchAction:"none",zIndex:10 }}>
                        {caption}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ minWidth:260,display:"flex",flexDirection:"column",gap:14 }}>
                  <Card title="✍️ כיתוב"><input placeholder="כתבי את הטקסט שלך..." value={caption} onChange={e=>setCaption(e.target.value)} style={tIn} /></Card>
                  <Card title="🔤 גופן">
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                      {FONTS.map(f=><button key={f.name} onClick={()=>setCaptionFont(f)} style={{...chipBtn(captionFont.name===f.name),fontFamily:f.value}}>{f.name}</button>)}
                    </div>
                  </Card>
                  <Card title="🎨 צבע">
                    <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
                      {TEXT_COLORS.map(c=><button key={c} onClick={()=>setCaptionColor(c)} style={{ width:28,height:28,borderRadius:"50%",background:c,border:captionColor===c?"3px solid #b5005b":"2px solid #e5e7eb",cursor:"pointer",outline:"none",transform:captionColor===c?"scale(1.2)":"scale(1)",transition:"transform 0.15s" }} />)}
                      <input type="color" value={captionColor} onChange={e=>setCaptionColor(e.target.value)} style={{ width:28,height:28,border:"2px solid #e5d8f0",borderRadius:"50%",cursor:"pointer",padding:0 }} />
                    </div>
                  </Card>
                  <Card title="📏 גודל">
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <input type="range" min="14" max="72" value={captionSize} onChange={e=>setCaptionSize(+e.target.value)} style={{ flex:1 }} />
                      <span style={{ fontWeight:800,color:"#b5005b",minWidth:28 }}>{captionSize}</span>
                    </div>
                  </Card>
                  <div style={{ display:"flex",gap:8 }}>
                    <button onClick={()=>setStep("gallery")} style={outlineBtn("#9ca3af")}>← חזרה</button>
                    <button onClick={()=>setStep("preview")} style={solidBtn("#b5005b")}>תצוגה מקדימה →</button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step==="preview" && selectedImage && (
              <div style={{ textAlign:"center" }}>
                <h2 style={{ color:"#b5005b",fontWeight:800,marginBottom:4,fontFamily:"'Dancing Script',cursive",fontSize:30 }}>התצוגה המקדימה שלך 🎉</h2>
                <p style={{ color:"#9c7ab5",fontSize:13,marginBottom:24 }}>כך ייראה דף הסוכר על העוגה שלך</p>
                <div style={{ display:"inline-block" }}>
                  <div style={{ width:340,background:"linear-gradient(180deg,#fce7f3,#fbcfe8)",borderRadius:"160px 160px 0 0",height:44,border:"2px solid #f9a8d4",display:"flex",alignItems:"center",justifyContent:"center",gap:20 }}>
                    {["🕯️","🕯️","🕯️"].map((c,i)=><span key={i} style={{ fontSize:20 }}>{c}</span>)}
                  </div>
                  <div style={{ width:340,height:210,background:"#fff",border:"2px solid #e9d5ff",position:"relative",overflow:"hidden" }}>
                    <img src={selectedImage.url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                    {caption && <div style={{ position:"absolute",left:`${captionPos.x}%`,top:`${captionPos.y}%`,transform:"translate(-50%,-50%)",fontFamily:captionFont.value,fontSize:captionSize*0.75,color:captionColor,whiteSpace:"nowrap",textShadow:"0 1px 4px rgba(0,0,0,0.25)" }}>{caption}</div>}
                  </div>
                  <div style={{ width:360,height:90,background:"linear-gradient(180deg,#fef3c7,#fde68a)",borderRadius:"0 0 24px 24px",border:"2px solid #fbbf24",borderTop:"none",position:"relative",marginRight:-10 }}>
                    <div style={{ position:"absolute",top:0,left:0,right:0,height:16,background:"repeating-linear-gradient(90deg,#f9a8d4 0,#f9a8d4 20px,#c4b5fd 20px,#c4b5fd 40px)",opacity:0.7 }} />
                  </div>
                </div>
                <div style={{ marginTop:28,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
                  <button onClick={()=>setStep("edit")} style={outlineBtn("#7c3aed")}>✏️ עריכה</button>
                  <button onClick={()=>{setStep("gallery");setSelectedImage(null);setCaption("");}} style={outlineBtn("#9ca3af")}>בחרי תמונה אחרת</button>
                  <button onClick={()=>alert("ההזמנה נשלחה! 🎉 נצור איתך קשר בקרוב.")} style={solidBtn("#10b981")}>✅ שליחת הזמנה</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Card({title,children}) {
  return <div style={{ background:"#fff",borderRadius:14,padding:"12px 14px",boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}><p style={{ margin:"0 0 10px",fontSize:13,fontWeight:800,color:"#4b2a7a" }}>{title}</p>{children}</div>;
}
function catTabBtn(active) { return { background:active?"#b5005b":"#fff",color:active?"#fff":"#4b2a7a",border:active?"2px solid #b5005b":"2px solid #e5d8f0",borderRadius:24,padding:"7px 16px",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap" }; }
function chipBtn(active) { return { background:active?"#b5005b":"#f3f0ff",color:active?"#fff":"#b5005b",border:"none",borderRadius:20,padding:"5px 12px",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.15s" }; }
function solidBtn(color) { return { background:color,color:"#fff",border:"none",borderRadius:10,padding:"10px 18px",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"'Nunito',sans-serif" }; }
function outlineBtn(color) { return { background:"transparent",color:color,border:`2px solid ${color}`,borderRadius:10,padding:"8px 16px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif" }; }
const tIn = { width:"100%",background:"#faf7ff",border:"1.5px solid #e5d8f0",borderRadius:10,padding:"9px 12px",fontSize:14,outline:"none",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box",color:"#2d1b4e" };
const modalOverlay = { position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200 };
const modalBox = { background:"#fff",borderRadius:20,padding:"32px 28px",textAlign:"center",width:300,boxShadow:"0 20px 60px rgba(0,0,0,0.2)" };
