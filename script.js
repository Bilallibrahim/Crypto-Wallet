const RATE=2500;
let state=JSON.parse(localStorage.getItem("bankState")||"null")||{exists:false,id:"",pin:"",balanceEGP:0,balanceBitcoin:0,history:[],loggedIn:false};
function save(){localStorage.setItem("bankState",JSON.stringify(state))}
function money(v){return Number(v).toFixed(2)}
function btc(v){return Number(v).toFixed(8)}
function now(){return new Date().toLocaleString()}
function addHistory(t){state.history.push(`${t} | Date: ${now()}`);save()}
function toast(m,type="success"){let c=document.getElementById("toast-container");if(!c)return;let x=document.createElement("div");x.className=`toast ${type}`;x.textContent=m;c.appendChild(x);setTimeout(()=>x.remove(),3200)}
function requireLogin(){if(!state.loggedIn){toast("Please login first.","warning");setTimeout(()=>location.href="login.html",500);return false}return true}
function createAccount(){let id=document.getElementById("create-id").value.trim(),pin=document.getElementById("create-pin").value.trim();if(!id||!pin){toast("Please enter both ID and PIN.","warning");return}state={exists:true,id,pin,balanceEGP:0,balanceBitcoin:0,history:[`Account created | Date: ${now()}`],loggedIn:false};save();toast("Account successfully created.");setTimeout(()=>location.href="login.html",700)}
function login(){if(!state.exists){toast("Please Create Account First","warning");return}let id=document.getElementById("login-id").value.trim(),pin=document.getElementById("login-pin").value.trim();if(id!==state.id||pin!==state.pin){toast("Invalid ID or PIN.","error");return}state.loggedIn=true;save();toast("Login successful.");setTimeout(()=>location.href="bank-menu.html",700)}
function logout(){state.loggedIn=false;save();toast("Logged out.");setTimeout(()=>location.href="index.html",500)}
function exitApp(){toast("You can close this browser tab.","warning")}
function validCardNumber(v){let d=String(v).replace(/\s+/g,"");if(!/^\d+$/.test(d)||d.length<12||d.length>19)return false;let sum=0,doubleDigit=false;for(let i=d.length-1;i>=0;i--){let n=+d[i];if(doubleDigit){n*=2;if(n>9)n-=9}sum+=n;doubleDigit=!doubleDigit}return sum%10===0}
function deposit() {
    if (!requireLogin()) return;
    const depAmt = document.getElementById("deposit-amount");
    const depCard = document.getElementById("deposit-card");
    const depExp = document.getElementById("deadline");
    const depCvv = document.getElementById("cvv");

    let amount = Number(depAmt ? depAmt.value : 0);
    let card = depCard ? depCard.value.trim() : "";

    if (!validCardNumber(card)) {
        addHistory(`Failed card entered attempt: ${card}`);
        toast("Invalid credit card number.", "error");
        return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
        toast("Please enter a positive amount.", "warning");
        return;
    }

    state.balanceEGP += amount;
    addHistory(`Credit card entered successfully: ${card}`);
    addHistory(`Deposited: ${money(amount)} EGP`);
    save();
    toast("Deposit successful!");

    // Clear all deposit form inputs upon successful deposit
    if (depAmt) depAmt.value = "";
    if (depCard) depCard.value = "";
    if (depExp) depExp.value = "";
    if (depCvv) depCvv.value = "";
    const badge = document.getElementById("card-brand-badge");
    if (badge) badge.classList.add("hidden");
}

// Card Brand Detection
function detectCardBrand(digits) {
    if (!digits || digits.length < 1) return null;
    if (digits.startsWith("4")) {
        return { name: "Visa", className: "visa", icon: "💳" };
    }
    if (digits.startsWith("5078") || digits.startsWith("5079") || digits.startsWith("6088")) {
        return { name: "Meeza ميزة", className: "meeza", icon: "🇪🇬" };
    }
    if (/^(5[1-5]|2[2-7])/.test(digits)) {
        return { name: "Mastercard", className: "mastercard", icon: "🔴🟡" };
    }
    if (/^3[47]/.test(digits)) {
        return { name: "Amex", className: "amex", icon: "💎" };
    }
    if (/^(6011|65|64[4-9])/.test(digits)) {
        return { name: "Discover", className: "discover", icon: "🌐" };
    }
    if (digits.length >= 4) {
        return { name: "Card", className: "generic", icon: "💳" };
    }
    return null;
}

function updateCardBrandIndicator(digits) {
    const badge = document.getElementById("card-brand-badge");
    const icon = document.getElementById("card-brand-icon");
    const text = document.getElementById("card-brand-text");
    if (!badge) return;

    const brand = detectCardBrand(digits);
    if (brand && digits.length >= 1) {
        badge.className = `card-brand-badge ${brand.className}`;
        if (icon) icon.textContent = brand.icon;
        if (text) text.textContent = brand.name;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
}

// 10 Luxury Virtual Card Themes
const CARD_THEMES = [
    {
        name: "Obsidian Gold",
        background: "linear-gradient(135deg, #181920 0%, #2f2715 45%, #d4af37 100%)",
        shadow: "rgba(212, 175, 55, 0.4)",
        border: "rgba(212, 175, 55, 0.55)"
    },
    {
        name: "Royal Sapphire",
        background: "linear-gradient(135deg, #091226 0%, #0c2856 45%, #185a9d 100%)",
        shadow: "rgba(24, 90, 157, 0.45)",
        border: "rgba(67, 142, 230, 0.5)"
    },
    {
        name: "Imperial Emerald",
        background: "linear-gradient(135deg, #051a14 0%, #0d4032 45%, #11998e 100%)",
        shadow: "rgba(17, 153, 142, 0.45)",
        border: "rgba(56, 239, 125, 0.5)"
    },
    {
        name: "Cyberpunk Amethyst",
        background: "linear-gradient(135deg, #1b0a2a 0%, #4a154b 45%, #8a2be2 100%)",
        shadow: "rgba(138, 43, 226, 0.45)",
        border: "rgba(186, 104, 255, 0.5)"
    },
    {
        name: "Crimson Ruby",
        background: "linear-gradient(135deg, #24090c 0%, #54121b 45%, #c0392b 100%)",
        shadow: "rgba(192, 57, 43, 0.45)",
        border: "rgba(231, 76, 60, 0.5)"
    },
    {
        name: "Titanium Platinum",
        background: "linear-gradient(135deg, #1e2024 0%, #3a3d46 50%, #7f8c8d 100%)",
        shadow: "rgba(127, 140, 141, 0.4)",
        border: "rgba(189, 195, 199, 0.5)"
    },
    {
        name: "24K Liquid Gold",
        background: "linear-gradient(135deg, #3d2f0a 0%, #7b5912 40%, #e6ca65 75%, #ffd700 100%)",
        shadow: "rgba(255, 215, 0, 0.45)",
        border: "rgba(255, 230, 120, 0.6)"
    },
    {
        name: "Midnight Sunset",
        background: "linear-gradient(135deg, #16152b 0%, #431c39 45%, #b83b5e 100%)",
        shadow: "rgba(184, 59, 94, 0.45)",
        border: "rgba(240, 138, 93, 0.5)"
    },
    {
        name: "Deep Ocean Cyan",
        background: "linear-gradient(135deg, #061a24 0%, #0f4c5c 45%, #2a9d8f 100%)",
        shadow: "rgba(42, 157, 143, 0.45)",
        border: "rgba(72, 202, 228, 0.5)"
    },
    {
        name: "Carbon Matrix",
        background: "linear-gradient(135deg, #0e1014 0%, #1e2430 50%, #43506c 100%)",
        shadow: "rgba(67, 80, 108, 0.45)",
        border: "rgba(142, 158, 255, 0.5)"
    }
];

let lastThemeIndex = -1;
let currentVirtualCard = null;
let virtualCardCountdownTimer = null;

function startVirtualCardCountdown(targetTime) {
    if (virtualCardCountdownTimer) clearInterval(virtualCardCountdownTimer);

    function tick() {
        const remaining = targetTime - Date.now();
        const countdownBadge = document.getElementById("v-card-countdown");
        const infoCountdown = document.getElementById("v-info-countdown");

        if (remaining <= 0) {
            if (countdownBadge) countdownBadge.textContent = "Expired";
            if (infoCountdown) infoCountdown.textContent = "Expired";
            clearInterval(virtualCardCountdownTimer);
            return;
        }

        const hrs = Math.floor(remaining / (1000 * 60 * 60));
        const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remaining % (1000 * 60)) / 1000);

        const timeStr = `${hrs}h ${mins}m ${secs}s`;
        if (countdownBadge) countdownBadge.textContent = `⏳ ${timeStr} left`;
        if (infoCountdown) infoCountdown.textContent = `${timeStr} remaining`;
    }

    tick();
    virtualCardCountdownTimer = setInterval(tick, 1000);
}

function renderVirtualCard(theme) {
    if (!currentVirtualCard) return;
    const currentTheme = theme || currentVirtualCard.theme;
    const front = document.getElementById("v-card-front");
    const back = document.getElementById("v-card-back");
    const numDisp = document.getElementById("v-card-number-display");
    const cvvDisp = document.getElementById("v-card-cvv-display");
    const nameDisp = document.getElementById("v-card-holder-display");
    const expDisp = document.getElementById("v-card-expiry-display");
    const brandDisp = document.getElementById("v-card-brand-display");
    const typeTag = document.getElementById("v-card-type-tag");
    const infoBrand = document.getElementById("v-info-brand");
    const expTimeBack = document.getElementById("v-card-expire-time");
    const visIcon = document.getElementById("visibility-icon");
    const visText = document.getElementById("visibility-text");

    if (front && back && currentTheme) {
        front.style.background = currentTheme.background;
        front.style.boxShadow = `0 20px 50px rgba(0,0,0,0.7), 0 0 25px ${currentTheme.shadow}`;
        front.style.borderColor = currentTheme.border;

        back.style.background = currentTheme.background;
        back.style.boxShadow = `0 20px 50px rgba(0,0,0,0.7), 0 0 25px ${currentTheme.shadow}`;
        back.style.borderColor = currentTheme.border;
    }

    if (numDisp) {
        numDisp.textContent = currentVirtualCard.revealed ? currentVirtualCard.formatted : currentVirtualCard.masked;
    }
    if (cvvDisp) {
        cvvDisp.textContent = currentVirtualCard.revealed ? currentVirtualCard.cvv : currentVirtualCard.maskedCvv;
    }
    if (nameDisp) nameDisp.textContent = currentVirtualCard.holder;
    if (expDisp) expDisp.textContent = currentVirtualCard.expiry;
    if (brandDisp) brandDisp.innerHTML = currentVirtualCard.brandLogoHtml;
    if (typeTag) typeTag.textContent = `${currentVirtualCard.brandName.toUpperCase()} VIRTUAL`;
    if (infoBrand) infoBrand.textContent = `${currentVirtualCard.brandName} Virtual`;
    if (expTimeBack) expTimeBack.textContent = `EXPIRES: ${currentVirtualCard.expiryDateTimeStr.toUpperCase()}`;

    if (visIcon && visText) {
        visIcon.textContent = currentVirtualCard.revealed ? "🙈" : "👁️";
        visText.textContent = currentVirtualCard.revealed ? "Hide Data" : "Show Data";
    }
}

function flipVirtualCard() {
    const wrapper = document.getElementById("virtual-card-wrapper");
    if (wrapper) {
        wrapper.classList.toggle("flipped");
    }
}

function toggleCardSensitiveData() {
    if (!currentVirtualCard) return;
    currentVirtualCard.revealed = !currentVirtualCard.revealed;
    renderVirtualCard();
    toast(currentVirtualCard.revealed ? "Card details revealed 👁️" : "Card details hidden 🙈");
}

function copyCardNumber() {
    if (!currentVirtualCard) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentVirtualCard.number).then(() => {
            toast("Card number copied to clipboard! 📋");
        }).catch(() => fallbackCopy());
    } else {
        fallbackCopy();
    }
    function fallbackCopy() {
        const temp = document.createElement("input");
        temp.value = currentVirtualCard.number;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
        toast("Card number copied to clipboard! 📋");
    }
}

function withdraw() {
    if (!requireLogin()) return;
    let amount = Number(document.getElementById("withdraw-amount").value);
    if (!Number.isFinite(amount) || amount <= 0) {
        toast("Enter a valid amount.", "error");
        return;
    }
    if (state.balanceEGP < amount) {
        toast("Insufficient balance.", "error");
        return;
    }

    // Determine Brand: Visa (prefix 4) or Mastercard (prefix 51-55)
    const isMastercard = Math.random() > 0.5;
    let cardPrefix = isMastercard ? String(51 + Math.floor(Math.random() * 5)) : "4";
    let card = cardPrefix;
    for (let i = 0; i < (16 - cardPrefix.length); i++) {
        card += Math.floor(Math.random() * 10);
    }
    const brandName = isMastercard ? "Mastercard" : "Visa";
    const brandLogoHtml = isMastercard 
        ? '<span style="color:#eb001b">●</span><span style="color:#f79e1b;margin-left:-8px">●</span> <span style="font-size:14px;letter-spacing:1px;margin-left:4px;font-style:normal;font-weight:800">Mastercard</span>'
        : '<span style="color:#ffffff;letter-spacing:2px;font-style:italic;font-weight:900">VISA</span>';

    // Generate 3 digit CVV
    let cvv = Math.floor(100 + Math.random() * 900);

    // Generate Expiry (5 years in future)
    let d = new Date();
    let expMonth = String(d.getMonth() + 1).padStart(2, "0");
    let expYear = String((d.getFullYear() + 5) % 100).padStart(2, "0");
    let expiry = `${expMonth}/${expYear}`;

    // Temporary Validity: 24 Hours from now
    const validityMs = 24 * 60 * 60 * 1000;
    const expiresAt = Date.now() + validityMs;
    const expDateObj = new Date(expiresAt);
    const expHours = String(expDateObj.getHours()).padStart(2, "0");
    const expMins = String(expDateObj.getMinutes()).padStart(2, "0");
    const expDay = String(expDateObj.getDate()).padStart(2, "0");
    const expMonthStr = expDateObj.toLocaleString('en-US', { month: 'short' });
    const expiryDateTimeStr = `${expDay} ${expMonthStr}, ${expHours}:${expMins}`;

    // Pick a new random theme different from last time
    let themeIndex;
    do {
        themeIndex = Math.floor(Math.random() * CARD_THEMES.length);
    } while (themeIndex === lastThemeIndex && CARD_THEMES.length > 1);
    lastThemeIndex = themeIndex;
    let pickedTheme = CARD_THEMES[themeIndex];

    state.balanceEGP -= amount;
    addHistory(`Generated ${brandName} Virtual Credit Card`);
    addHistory(`Withdrawn: ${money(amount)} EGP`);
    save();

    currentVirtualCard = {
        number: card,
        formatted: card.replace(/(.{4})/g, "$1 ").trim(),
        masked: `•••• •••• •••• ${card.slice(-4)}`,
        cvv: String(cvv),
        maskedCvv: "•••",
        expiry: expiry,
        expiresAt: expiresAt,
        expiryDateTimeStr: expiryDateTimeStr,
        holder: (state.id || "VIP CLIENT").toUpperCase(),
        brandName: brandName,
        brandLogoHtml: brandLogoHtml,
        theme: pickedTheme,
        revealed: false
    };

    // Show virtual card section
    const section = document.getElementById("virtual-card-section");
    if (section) section.classList.remove("hidden");

    let out = document.getElementById("generated-card");
    if (out) out.value = card;

    renderVirtualCard(pickedTheme);
    startVirtualCardCountdown(expiresAt);
    toast(`${brandName} Virtual Card created (${pickedTheme.name})! Valid for 24 hours. 💳⏳`);
}

function buyBitcoin(){if(!requireLogin())return;let amount=Number(document.getElementById("btc-buy-amount").value);if(!Number.isInteger(amount)||amount<=0){toast("Enter a positive whole Bitcoin amount.","error");return}let cost=amount*RATE;if(cost>state.balanceEGP){toast("Insufficient EGP balance.","error");return}state.balanceEGP-=cost;state.balanceBitcoin+=amount;addHistory(`Converted: ${amount} BTC (${money(cost)} EGP)`);save();toast("Conversion successful!")}
function sellBitcoin(){if(!requireLogin())return;let amount=Number(document.getElementById("btc-sell-amount").value);if(!Number.isInteger(amount)||amount<=0){toast("Enter a positive whole Bitcoin amount.","error");return}if(amount>state.balanceBitcoin){toast("Insufficient Bitcoin balance.","error");return}let cash=amount*RATE;state.balanceBitcoin-=amount;state.balanceEGP+=cash;addHistory(`Converted: ${amount} BTC → ${money(cash)} EGP`);save();toast("Bitcoin successfully converted!")}
function refreshBalance(){if(!requireLogin())return;document.getElementById("balance-egp").textContent=`${money(state.balanceEGP)} EGP`;document.getElementById("balance-btc").textContent=btc(state.balanceBitcoin)}
function changePin(){if(!requireLogin())return;let a=document.getElementById("new-pin").value,b=document.getElementById("new-pin-confirm").value;if(!a){toast("Enter a new PIN.","error");return}if(a!==b){toast("PIN confirmation does not match.","error");return}state.pin=a;addHistory("PIN changed");save();toast("PIN successfully changed.");setTimeout(()=>location.href="bank-menu.html",700)}
function openHistory(){if(!requireLogin())return;let o=document.getElementById("history-output");o.textContent=state.history.length?state.history.join("\n"):"No transaction history available."}
document.addEventListener("DOMContentLoaded",()=>{
    let e=document.getElementById("menu-egp"),b=document.getElementById("menu-btc");
    if(e)e.textContent=money(state.balanceEGP);
    if(b)b.textContent=btc(state.balanceBitcoin);
    if(document.getElementById("history-output"))openHistory();
    if(document.getElementById("balance-egp"))refreshBalance();

    // Check for deposit card input
    const depositInput = document.getElementById("deposit-card");
    if (depositInput) {
        depositInput.addEventListener("input", function() {
            let digits = this.value.replace(/\D/g, "");
            digits = digits.substring(0, 16);
            this.value = digits.replace(/(.{4})/g, "$1 ").trim();
            updateCardBrandIndicator(digits);
        });
    }

    // Check for expiration input
    const expInput = document.getElementById("deadline");
    if (expInput) {
        expInput.addEventListener("input", function() {
            let val = this.value.replace(/\D/g, "").substring(0, 4);
            if (val.length > 2) {
                val = val.substring(0, 2) + "/" + val.substring(2);
            }
            this.value = val;
        });
    }
});

// =========================
// 3D Bitcoin Universe (Full-Screen Background & Floating Interactive Coins)
// =========================
(function() {
    function init3DUniverse() {
        if (document.getElementById('bitcoin-3d-bg-canvas')) return;

        // Container setup
        const container = document.createElement('div');
        container.id = 'bitcoin-3d-bg-container';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none;overflow:hidden;';
        document.body.prepend(container);

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 13;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        if ('outputColorSpace' in renderer) {
            renderer.outputColorSpace = THREE.SRGBColorSpace;
        } else if ('outputEncoding' in renderer) {
            renderer.outputEncoding = 3001; // sRGBEncoding
        }
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.domElement.id = 'bitcoin-3d-bg-canvas';
        container.appendChild(renderer.domElement);

        // Realistic Studio Environment Map
        const envCanvas = document.createElement('canvas');
        envCanvas.width = 512;
        envCanvas.height = 512;
        const eCtx = envCanvas.getContext('2d');
        const grd = eCtx.createLinearGradient(0, 0, 0, 512);
        grd.addColorStop(0, '#ffffff');
        grd.addColorStop(0.2, '#bbbbbb');
        grd.addColorStop(0.5, '#222222');
        grd.addColorStop(0.65, '#666666');
        grd.addColorStop(1, '#0c0d12');
        eCtx.fillStyle = grd;
        eCtx.fillRect(0, 0, 512, 512);
        const envTexture = new THREE.CanvasTexture(envCanvas);
        envTexture.mapping = THREE.EquirectangularReflectionMapping;

        // High-Resolution Bump Map for Coin Face
        const bumpCanvas = document.createElement('canvas');
        bumpCanvas.width = 1024;
        bumpCanvas.height = 1024;
        const bCtx = bumpCanvas.getContext('2d');
        
        bCtx.fillStyle = '#444444';
        bCtx.fillRect(0, 0, 1024, 1024);
        
        bCtx.strokeStyle = '#ffffff';
        bCtx.lineWidth = 42;
        bCtx.beginPath();
        bCtx.arc(512, 512, 485, 0, Math.PI * 2);
        bCtx.stroke();
        
        bCtx.lineWidth = 16;
        bCtx.beginPath();
        bCtx.arc(512, 512, 435, 0, Math.PI * 2);
        bCtx.stroke();

        bCtx.fillStyle = '#ffffff';
        bCtx.font = 'bold 560px Arial, sans-serif';
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'middle';
        bCtx.fillText('\u20BF', 512, 545);

        const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

        // Bump Map for Coin Rim / Reeding (Ridges)
        const sideCanvas = document.createElement('canvas');
        sideCanvas.width = 1024;
        sideCanvas.height = 64;
        const sCtx = sideCanvas.getContext('2d');
        sCtx.fillStyle = '#444444';
        sCtx.fillRect(0, 0, 1024, 64);
        sCtx.fillStyle = '#ffffff';
        for (let i = 0; i < 1024; i += 8) {
            sCtx.fillRect(i, 0, 4, 64);
        }
        const sideBumpTexture = new THREE.CanvasTexture(sideCanvas);
        sideBumpTexture.wrapS = THREE.RepeatWrapping;
        sideBumpTexture.repeat.set(4, 1);

        const maxAniso = renderer.capabilities ? renderer.capabilities.getMaxAnisotropy() : 4;
        bumpTexture.anisotropy = maxAniso;
        sideBumpTexture.anisotropy = maxAniso;

        // Shared Materials for Ultimate Performance & Visual Quality
        const coinMatOptions = {
            color: 0xffd700,
            metalness: 1.0,
            roughness: 0.24,
            envMap: envTexture,
            envMapIntensity: 1.6,
        };

        const faceMat = new THREE.MeshStandardMaterial({
            ...coinMatOptions,
            bumpMap: bumpTexture,
            bumpScale: 0.045
        });

        const sideMat = new THREE.MeshStandardMaterial({
            ...coinMatOptions,
            bumpMap: sideBumpTexture,
            bumpScale: 0.035
        });

        // =========================================================
        // High-Density Physical Interactive Coin Swarm (Like Oryzo.ai)
        // =========================================================
        const coins = [];
        const baseGeom = new THREE.CylinderGeometry(1, 1, 0.18, 36);
        const isMobile = window.innerWidth < 768;
        const totalCoins = isMobile ? 50 : 110;

        // Spread dimensions
        const vFOVRad = (camera.fov * Math.PI) / 180;
        const screenDist = camera.position.z;
        const fullH = 2 * Math.tan(vFOVRad / 2) * screenDist;
        const fullW = fullH * camera.aspect;

        for (let i = 0; i < totalCoins; i++) {
            const mesh = new THREE.Mesh(baseGeom, [sideMat, faceMat, faceMat]);
            
            let scale, origX, origY, origZ;

            // Give variety: 2 prominent side hero coins, some large, mostly medium & small
            if (i === 0) {
                // Left Hero Coin
                scale = isMobile ? 0.9 : 1.45;
                origX = -fullW * 0.42;
                origY = 0;
                origZ = 0.5;
            } else if (i === 1) {
                // Right Hero Coin
                scale = isMobile ? 0.9 : 1.45;
                origX = fullW * 0.42;
                origY = 0;
                origZ = 0.5;
            } else if (i < 8) {
                // Large Accent Coins
                scale = 0.85 + Math.random() * 0.35;
                origX = (Math.random() - 0.5) * fullW * 1.1;
                origY = (Math.random() - 0.5) * fullH * 1.1;
                origZ = -3 + Math.random() * 4;
            } else if (i < 40) {
                // Medium Coins
                scale = 0.5 + Math.random() * 0.3;
                origX = (Math.random() - 0.5) * fullW * 1.25;
                origY = (Math.random() - 0.5) * fullH * 1.25;
                origZ = -8 + Math.random() * 7;
            } else {
                // Small Background Coins
                scale = 0.25 + Math.random() * 0.25;
                origX = (Math.random() - 0.5) * fullW * 1.4;
                origY = (Math.random() - 0.5) * fullH * 1.4;
                origZ = -14 + Math.random() * 8;
            }

            mesh.scale.set(scale, scale, scale);
            mesh.position.set(origX, origY, origZ);

            // Initial rotation
            const initRotX = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
            const initRotY = (Math.random() - 0.5) * 0.4;
            const initRotZ = Math.random() * Math.PI * 2;
            mesh.rotation.set(initRotX, initRotY, initRotZ);

            mesh.userData = {
                originX: origX,
                originY: origY,
                originZ: origZ,
                vx: 0,
                vy: 0,
                vz: 0,
                vrx: 0,
                vry: 0,
                vrz: (Math.random() > 0.5 ? 1 : -1) * (0.008 + Math.random() * 0.012),
                baseSpin: (Math.random() > 0.5 ? 1 : -1) * (0.008 + Math.random() * 0.012),
                mass: Math.max(0.6, scale * scale * 1.2),
                floatSpeedX: 0.6 + Math.random() * 1.2,
                floatSpeedY: 0.8 + Math.random() * 1.4,
                floatAmpX: 0.005 + Math.random() * 0.008,
                floatAmpY: 0.008 + Math.random() * 0.012,
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
            };

            scene.add(mesh);
            coins.push(mesh);
        }

        // Three-Point Studio Lighting
        const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.4);
        keyLight.position.set(6, 7, 8);
        scene.add(keyLight);

        const fillLight = new THREE.PointLight(0xffeedd, 1.8, 80);
        fillLight.position.set(-8, 3, 6);
        scene.add(fillLight);

        const rimLight = new THREE.PointLight(0x7090ff, 1.3, 60);
        rimLight.position.set(0, -7, 6);
        scene.add(rimLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // =========================================================
        // Physics & Mouse Interaction System (Displacement & Flick)
        // =========================================================
        let ndcMouseX = 9999, ndcMouseY = 9999;
        let lastWorldMouseX = 0, lastWorldMouseY = 0;
        let mouseVelX = 0, mouseVelY = 0;
        let isMouseActive = false;

        const tanFOV = Math.tan(vFOVRad / 2);

        function updateMousePos(clientX, clientY) {
            ndcMouseX = (clientX / window.innerWidth) * 2 - 1;
            ndcMouseY = -(clientY / window.innerHeight) * 2 + 1;

            const planeH = 2 * tanFOV * camera.position.z;
            const planeW = planeH * camera.aspect;
            const curWorldX = (ndcMouseX * planeW) / 2;
            const curWorldY = (ndcMouseY * planeH) / 2;

            if (isMouseActive) {
                mouseVelX = (curWorldX - lastWorldMouseX) * 0.75;
                mouseVelY = (curWorldY - lastWorldMouseY) * 0.75;
            } else {
                isMouseActive = true;
            }

            lastWorldMouseX = curWorldX;
            lastWorldMouseY = curWorldY;
        }

        window.addEventListener('mousemove', (e) => updateMousePos(e.clientX, e.clientY), { passive: true });
        
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            ndcMouseX = 9999;
            ndcMouseY = 9999;
            isMouseActive = false;
            mouseVelX = 0;
            mouseVelY = 0;
        });

        // Click Shockwave Burst (Scatter effect on click)
        window.addEventListener('pointerdown', (e) => {
            updateMousePos(e.clientX, e.clientY);
            for (let i = 0; i < coins.length; i++) {
                const c = coins[i];
                const distFromCam = camera.position.z - c.position.z;
                const cPlaneH = 2 * tanFOV * distFromCam;
                const cPlaneW = cPlaneH * camera.aspect;
                const mx = (ndcMouseX * cPlaneW) / 2;
                const my = (ndcMouseY * cPlaneH) / 2;

                const dx = c.position.x - mx;
                const dy = c.position.y - my;
                const d2 = dx * dx + dy * dy;
                const blastRadius = 5.5;

                if (d2 < blastRadius * blastRadius && d2 > 0.001) {
                    const d = Math.sqrt(d2);
                    const force = (1 - d / blastRadius) * 0.65 / c.userData.mass;
                    c.userData.vx += (dx / d) * force * 1.5;
                    c.userData.vy += (dy / d) * force * 1.5;
                    c.userData.vz += (Math.random() - 0.5) * force * 0.8;
                    c.userData.vrx += (Math.random() - 0.5) * 0.5;
                    c.userData.vry += (Math.random() - 0.5) * 0.5;
                    c.userData.vrz += (Math.random() - 0.5) * 0.8;
                }
            }
        });

        // Responsive Sizing & Layout
        function updateLayout() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);

            const updatedH = 2 * Math.tan(vFOVRad / 2) * camera.position.z;
            const updatedW = updatedH * camera.aspect;

            // Re-anchor left and right hero coins if window resizes
            if (coins.length >= 2) {
                coins[0].userData.originX = -updatedW * 0.42;
                coins[1].userData.originX = updatedW * 0.42;
            }
        }

        window.addEventListener('resize', updateLayout);

        // 3D Card Tilt Interaction
        let cardElem = document.querySelector('.card');

        // Animation Loop (60-120 FPS Physics)
        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Decay mouse velocity gradually
            mouseVelX *= 0.88;
            mouseVelY *= 0.88;

            // Keep camera steady (the COINS move, not the background!)
            camera.position.set(0, 0, 13);
            camera.lookAt(0, 0, 0);

            // Physics step for all coins
            for (let i = 0; i < coins.length; i++) {
                const c = coins[i];
                const u = c.userData;

                // Mouse interaction at coin's depth
                if (ndcMouseX < 9000) {
                    const distFromCam = camera.position.z - c.position.z;
                    const cPlaneH = 2 * tanFOV * distFromCam;
                    const cPlaneW = cPlaneH * camera.aspect;
                    const mx = (ndcMouseX * cPlaneW) / 2;
                    const my = (ndcMouseY * cPlaneH) / 2;

                    const dx = c.position.x - mx;
                    const dy = c.position.y - my;
                    const distSq = dx * dx + dy * dy;
                    const influenceRadius = 3.6 + c.scale.x * 0.6;

                    if (distSq < influenceRadius * influenceRadius && distSq > 0.0001) {
                        const dist = Math.sqrt(distSq);
                        const normX = dx / dist;
                        const normY = dy / dist;
                        const pushPower = (1 - dist / influenceRadius);

                        // Direct physical repulsion away from cursor
                        const force = pushPower * 0.28 / u.mass;
                        u.vx += normX * force;
                        u.vy += normY * force;
                        u.vz += (Math.random() - 0.5) * force * 0.4;

                        // Momentum flick from cursor speed
                        const flick = pushPower * 0.35 / u.mass;
                        u.vx += mouseVelX * flick;
                        u.vy += mouseVelY * flick;

                        // Spin turbulence when disturbed
                        u.vrx += (Math.random() - 0.5) * pushPower * 0.12;
                        u.vry += (Math.random() - 0.5) * pushPower * 0.12;
                        u.vrz += (Math.random() - 0.5) * pushPower * 0.2;
                    }
                }

                // Spring force returning to anchor position
                const springK = 0.016;
                u.vx += (u.originX - c.position.x) * springK;
                u.vy += (u.originY - c.position.y) * springK;
                u.vz += (u.originZ - c.position.z) * springK;

                // Air resistance / friction
                u.vx *= 0.915;
                u.vy *= 0.915;
                u.vz *= 0.915;

                // Natural floating drift
                const idleX = Math.cos(elapsedTime * u.floatSpeedX + u.phaseX) * u.floatAmpX;
                const idleY = Math.sin(elapsedTime * u.floatSpeedY + u.phaseY) * u.floatAmpY;

                // Apply velocity & drift to position
                c.position.x += u.vx + idleX;
                c.position.y += u.vy + idleY;
                c.position.z += u.vz;

                // Rotational physics
                u.vrx *= 0.94;
                u.vry *= 0.94;
                u.vrz = u.vrz * 0.95 + u.baseSpin * 0.05; // gracefully return to steady coin spin

                c.rotation.x += u.vrx;
                c.rotation.y += u.vry;
                c.rotation.z += u.vrz;
            }

            // Subtle 3D Card Tilt based on mouse
            if (!cardElem) cardElem = document.querySelector('.card');
            if (cardElem && ndcMouseX < 9000) {
                const tiltX = ndcMouseY * 3.5;
                const tiltY = -ndcMouseX * 3.5;
                cardElem.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
            }

            renderer.render(scene, camera);
        }

        animate();
    }

    if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = init3DUniverse;
        document.head.appendChild(script);
    } else {
        init3DUniverse();
    }
})();
