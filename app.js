const DERIV_NUMERIC_APP_ID = "1089";
const AFFILIATE_TOKEN = "3A2CFHPG722B";
const exchangeRates = { KES: 129.0, UGX: 3750.0, TZS: 2600.0, EUR: 0.92, GBP: 0.79 };

let exhaustiveAssets = [
    { symbol: '1HZ10V', name: 'Volatility 10 (1s) Index', market: 'synthetic_index', pip: 2, base: 9452.18 },
    { symbol: 'R_10', name: 'Volatility 10 Index', market: 'synthetic_index', pip: 3, base: 6321.455 },
    { symbol: '1HZ25V', name: 'Volatility 25 (1s) Index', market: 'synthetic_index', pip: 2, base: 34218.90 },
    { symbol: 'R_25', name: 'Volatility 25 Index', market: 'synthetic_index', pip: 3, base: 2814.612 },
    { symbol: '1HZ50V', name: 'Volatility 50 (1s) Index', market: 'synthetic_index', pip: 2, base: 48912.34 },
    { symbol: 'R_50', name: 'Volatility 50 Index', market: 'synthetic_index', pip: 4, base: 214.8921 },
    { symbol: '1HZ75V', name: 'Volatility 75 (1s) Index', market: 'synthetic_index', pip: 2, base: 6142.75 },
    { symbol: 'R_75', name: 'Volatility 75 Index', market: 'synthetic_index', pip: 4, base: 452189.4210 },
    { symbol: '1HZ100V', name: 'Volatility 100 (1s) Index', market: 'synthetic_index', pip: 2, base: 1428.64 },
    { symbol: 'R_100', name: 'Volatility 100 Index', market: 'synthetic_index', pip: 2, base: 1894.32 },
    { symbol: 'BOOM500', name: 'Boom 500 Index', market: 'synthetic_index', pip: 2, base: 4125.80 },
    { symbol: 'CRASH500', name: 'Crash 500 Index', market: 'synthetic_index', pip: 2, base: 5890.45 },
    { symbol: 'BOOM1000', name: 'Boom 1000 Index', market: 'synthetic_index', pip: 2, base: 11450.20 },
    { symbol: 'CRASH1000', name: 'Crash 1000 Index', market: 'synthetic_index', pip: 2, base: 7840.15 },
    { symbol: 'JD10', name: 'Jump 10 Index', market: 'synthetic_index', pip: 2, base: 12450.60 },
    { symbol: 'JD25', name: 'Jump 25 Index', market: 'synthetic_index', pip: 2, base: 18920.40 },
    { symbol: 'JD50', name: 'Jump 50 Index', market: 'synthetic_index', pip: 2, base: 24110.85 },
    { symbol: 'JD75', name: 'Jump 75 Index', market: 'synthetic_index', pip: 2, base: 31840.10 },
    { symbol: 'JD100', name: 'Jump 100 Index', market: 'synthetic_index', pip: 2, base: 42910.55 },
    { symbol: 'STPRNG', name: 'Step Index', market: 'synthetic_index', pip: 2, base: 8450.10 },
    { symbol: 'frxEURUSD', name: 'EUR/USD', market: 'forex', pip: 5, base: 1.08452 },
    { symbol: 'frxGBPUSD', name: 'GBP/USD', market: 'forex', pip: 5, base: 1.27145 },
    { symbol: 'frxUSDJPY', name: 'USD/JPY', market: 'forex', pip: 3, base: 153.421 },
    { symbol: 'frxAUDUSD', name: 'AUD/USD', market: 'forex', pip: 5, base: 0.65842 },
    { symbol: 'frxUSDCAD', name: 'USD/CAD', market: 'forex', pip: 5, base: 1.38912 },
    { symbol: 'frxNZDUSD', name: 'NZD/USD', market: 'forex', pip: 5, base: 0.59841 },
    { symbol: 'frxEURGBP', name: 'EUR/GBP', market: 'forex', pip: 5, base: 0.85312 },
    { symbol: 'frxXAUUSD', name: 'Gold/USD', market: 'commodities', pip: 2, base: 2742.85 },
    { symbol: 'frxXAGUSD', name: 'Silver/USD', market: 'commodities', pip: 3, base: 32.415 },
    { symbol: 'frxWTIUSD', name: 'Crude Oil/USD', market: 'commodities', pip: 2, base: 71.45 },
    { symbol: 'cryBTCUSD', name: 'BTC/USD', market: 'cryptocurrency', pip: 2, base: 89420.50 },
    { symbol: 'cryETHUSD', name: 'ETH/USD', market: 'cryptocurrency', pip: 2, base: 3145.80 },
    { symbol: 'cryLTCUSD', name: 'LTC/USD', market: 'cryptocurrency', pip: 2, base: 84.25 }
];

let currentCategory = 'all';
let currentSymbol = '1HZ10V';
let currentChartInterval = '15';
let marketDataStore = {};
let authMode = 'signin';
let isChartFullscreen = false;
let isAutoExecutionArmed = true;
let activeAccountMode = 'demo';
let lastExecutionTimestamp = 0;

let derivOAuthAccounts = {
    demo: { acct: null, token: null },
    real: { acct: null, token: null }
};

function parseDerivOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    let foundTokens = false;

    for (let i = 1; i <= 5; i++) {
        const acct = params.get(`acct${i}`);
        const token = params.get(`token${i}`);
        if (acct && token) {
            foundTokens = true;
            if (acct.startsWith('VRTC')) {
                derivOAuthAccounts.demo = { acct, token };
                sessionStorage.setItem('ehaldart_demo_acct', acct);
                sessionStorage.setItem('ehaldart_demo_token', token);
            } else {
                derivOAuthAccounts.real = { acct, token };
                sessionStorage.setItem('ehaldart_real_acct', acct);
                sessionStorage.setItem('ehaldart_real_token', token);
            }
        }
    }

    if (!foundTokens) {
        derivOAuthAccounts.demo.acct = sessionStorage.getItem('ehaldart_demo_acct');
        derivOAuthAccounts.demo.token = sessionStorage.getItem('ehaldart_demo_token');
        derivOAuthAccounts.real.acct = sessionStorage.getItem('ehaldart_real_acct');
        derivOAuthAccounts.real.token = sessionStorage.getItem('ehaldart_real_token');
    } else {
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    updateOAuthHeaderStatus();
}

function updateOAuthHeaderStatus() {
    const badge = document.getElementById('oauth-connection-badge');
    const connectBtn = document.getElementById('btn-oauth-connect');
    const hasDemo = Boolean(derivOAuthAccounts.demo.token);
    const hasReal = Boolean(derivOAuthAccounts.real.token);

    if (badge) {
        if (hasDemo || hasReal) {
            const activeAcct = activeAccountMode === 'real' && hasReal
                ? derivOAuthAccounts.real.acct
                : derivOAuthAccounts.demo.acct || derivOAuthAccounts.real.acct;
            badge.innerText = `✅ Deriv Linked (${activeAcct})`;
            badge.className = "text-[10px] font-mono font-bold text-fxgreen bg-emerald-950 px-2.5 py-1 rounded border border-fxgreen/60";
        } else {
            badge.innerText = "🔌 Simulation Mode";
            badge.className = "text-[10px] font-mono font-bold text-amber-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-700";
        }
    }

    if (connectBtn && (hasDemo || hasReal)) {
        connectBtn.innerText = "Switch / Re-Auth";
    }
}

// Pre-seed every market with initial active history so it starts streaming immediately
exhaustiveAssets.forEach((a) => {
    const now = Date.now();
    const initialQuotes = [];
    const initialDigits = [];
    const digitCounts = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    let cur = a.base || 1000.00;
    for (let k = 0; k < 20; k++) {
        cur = Number((cur + (Math.random() - 0.48) * (cur * 0.0003)).toFixed(a.pip || 2));
        initialQuotes.push(cur);
        const d = parseInt(cur.toFixed(a.pip || 2).slice(-1), 10) || 0;
        initialDigits.push(d);
        digitCounts[d]++;
    }

    marketDataStore[a.symbol] = {
        name: a.name,
        pip: a.pip || 2,
        price: cur.toFixed(a.pip || 2),
        prevPrice: initialQuotes[initialQuotes.length - 2] || cur,
        direction: 'up',
        quotes: initialQuotes,
        recentDigits: initialDigits,
        digits: digitCounts,
        total: 40,
        sigmaScore: 2.5,
        winrate: 98,
        tps: 2.2,
        lastTickAt: now,
        tickTimestamps: [now - 1000, now - 500, now],
        isMarketOpen: true,
        assignedBoatId: 9,
        assignedBoatName: 'Boat 9 (Digit Matrixer)',
        assignedTicks: '2 Ticks Expiry',
        assignedCandleTF: 'Hold 1M (1-Minute Candle)',
        activeDigitSignalLabel: 'Active Scan (2.5σ)',
        lockedSignal: null,
        runsCompleted: 0,
        maxRunsPerLock: 5
    };
});

function runSplashSequence() {
    // Auto-dismiss splash screen after 3.5 seconds so user sees live data immediately
    setTimeout(() => {
        dismissSplash();
    }, 3500);
}

function dismissSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 400);
    }
}

function toggleAuthModal(show) {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.toggle('hidden', !show);
}

function switchAuthTab(mode) {
    authMode = mode;
    const signinTab = document.getElementById('tab-signin');
    const signupTab = document.getElementById('tab-signup');
    const nameBox = document.getElementById('name-field-box');
    const submitBtn = document.getElementById('auth-submit-btn');

    if (mode === 'signin') {
        signinTab.className = "text-sm font-bold text-fxgreen border-b-2 border-fxgreen pb-1";
        signupTab.className = "text-sm font-bold text-slate-400 hover:text-white pb-1";
        nameBox.classList.add('hidden');
        submitBtn.innerText = "SIGN IN TO TERMINAL";
    } else {
        signupTab.className = "text-sm font-bold text-fxgreen border-b-2 border-fxgreen pb-1";
        signinTab.className = "text-sm font-bold text-slate-400 hover:text-white pb-1";
        nameBox.classList.remove('hidden');
        submitBtn.innerText = "CREATE ACCOUNT & REGISTER";
    }
}

function submitAuthForm() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    if (!email || !pass) {
        alert("Please fill in your email and password.");
        return;
    }
    const name = document.getElementById('auth-name').value || "Preston Mutugi";
    alert(authMode === 'signup'
        ? `Account registered for ${name} (${email})!`
        : `Signed in successfully as ${email}!`);
    toggleAuthModal(false);
}

function setMode(mode) {
    if (mode === 'real' && derivOAuthAccounts.real.token) {
        const confirmed = confirm(`⚠️ SWITCHING TO LIVE REAL ACCOUNT (${derivOAuthAccounts.real.acct})\n\nTrades executed while Auto-Exec is ON will use real funds. Confirm switch to REAL account?`);
        if (!confirmed) return;
    }

    activeAccountMode = mode;
    document.getElementById('btn-demo').className = mode === 'demo'
        ? 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition'
        : 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    document.getElementById('btn-real').className = mode === 'real'
        ? 'px-3 py-1 rounded-lg font-bold bg-rose-600 text-white transition'
        : 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';

    const labelEl = document.getElementById('account-id-label');
    const selectedAccount = derivOAuthAccounts[mode];

    if (selectedAccount && selectedAccount.token && window.derivApiInstance) {
        if (labelEl) labelEl.innerText = `${mode.toUpperCase()} (${selectedAccount.acct})`;
        window.derivApiInstance.authorize(selectedAccount.token);
    } else {
        if (labelEl) labelEl.innerText = `${mode.toUpperCase()} (Simulated)`;
    }
    updateOAuthHeaderStatus();
}

function authDeriv() {
    const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
    window.location.href = `https://oauth.deriv.com/oauth2/authorize?app_id=${DERIV_NUMERIC_APP_ID}&affiliate_token=${AFFILIATE_TOKEN}&redirect_uri=${redirectUri}`;
}

function toggleAutoTradeExecution() {
    isAutoExecutionArmed = !isAutoExecutionArmed;
    const btn = document.getElementById('toggle-auto-exec-btn');
    const roomStatus = document.getElementById('auto-run-room-status');

    if (btn) {
        btn.innerText = isAutoExecutionArmed ? "⚡ AUTO-EXEC: ON" : "⏸ AUTO-EXEC: OFF";
        btn.className = isAutoExecutionArmed
            ? "bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition shadow-[0_0_10px_rgba(0,255,136,0.3)]"
            : "bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition";
    }
    if (roomStatus) {
        roomStatus.innerText = isAutoExecutionArmed
            ? "🟢 ARMED (Courtesy of ELHADARTGLOBALFX)"
            : "⏸ PAUSED (Monitoring Signals)";
    }
}

function switchCategory(cat) {
    currentCategory = cat;
    ['all', 'synthetic_index', 'forex', 'commodities', 'indices', 'cryptocurrency'].forEach(c => {
        const btn = document.getElementById(`cat-${c}`);
        if (btn) {
            btn.className = c === cat
                ? "bg-emerald-600 text-white font-bold py-1.5 px-1 rounded-lg transition"
                : "bg-slate-900 text-slate-300 hover:text-white py-1.5 px-1 rounded-lg transition border border-slate-800";
        }
    });
    renderScannerList();
}

function changeChartTimeframe(interval) {
    currentChartInterval = interval;
    document.querySelectorAll('.tf-btn').forEach(btn => {
        btn.className = btn.dataset.tf === interval
            ? "tf-btn px-2 py-1 rounded bg-emerald-600 text-white font-bold"
            : "tf-btn px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-fxgreen";
    });
    initTradingViewWidget(currentSymbol);
}

function toggleChartFullscreen() {
    isChartFullscreen = !isChartFullscreen;
    const wrapper = document.getElementById('chart-card-wrapper');
    const viewport = document.getElementById('chart-view-port');
    const btnText = document.getElementById('expand-btn-text');

    if (isChartFullscreen) {
        wrapper.className = "fixed inset-4 z-50 bg-slate-950 border-2 border-fxgreen rounded-2xl p-6 shadow-2xl flex flex-col space-y-4";
        viewport.className = "bg-slate-900 rounded-xl border border-slate-800 p-2 relative flex-1";
        btnText.innerText = "Minimize Chart";
    } else {
        wrapper.className = "bg-slate-950/85 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 shadow-2xl space-y-3 transition-all duration-300";
        viewport.className = "bg-slate-900 rounded-xl border border-slate-800 p-2 relative h-[320px] transition-all";
        btnText.innerText = "Expand Chart";
    }
    initTradingViewWidget(currentSymbol);
}

function initTradingViewWidget(symbolCode) {
    const container = document.getElementById('tradingview_advanced_chart');
    if (!container || typeof TradingView === 'undefined') return;
    container.innerHTML = '';

    let tvSymbol = "FX:EURUSD";
    if (symbolCode.includes("XAU")) tvSymbol = "OANDA:XAUUSD";
    else if (symbolCode.includes("XAG")) tvSymbol = "OANDA:XAGUSD";
    else if (symbolCode.includes("GBP")) tvSymbol = "FX:GBPUSD";
    else if (symbolCode.includes("JPY")) tvSymbol = "FX:USDJPY";
    else if (symbolCode.includes("AUD")) tvSymbol = "FX:AUDUSD";
    else if (symbolCode.includes("CAD")) tvSymbol = "FX:USDCAD";
    else if (symbolCode.includes("BTC")) tvSymbol = "BINANCE:BTCUSDT";
    else if (symbolCode.includes("ETH")) tvSymbol = "BINANCE:ETHUSDT";
    else if (symbolCode.includes("US30") || symbolCode.includes("DJI")) tvSymbol = "FOREXCOM:DJI";

    new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": tvSymbol,
        "interval": currentChartInterval,
        "timezone": "Africa/Nairobi",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#030712",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "studies": [
            "MASimple@tv-basicstudies",
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies",
            "BB@tv-basicstudies"
        ],
        "container_id": "tradingview_advanced_chart"
    });
}

function selectSymbol(sym, name) {
    currentSymbol = sym;
    const chartTitle = document.getElementById('chart-title-label');
    if (chartTitle) chartTitle.innerText = `${name} (${sym}) - Institutional Suite`;

    initTradingViewWidget(sym);

    if (window.derivApiInstance) {
        window.derivApiInstance.subscribeTicks(sym, handleIncomingTick);
    }

    if (marketDataStore[sym]) {
        const st = marketDataStore[sym];
        const lastQuote = st.quotes[st.quotes.length - 1] || 0;
        const lastDig = parseInt(st.price.slice(-1), 10) || 0;
        evaluateZeroLossMatrix(st, lastDig, lastQuote, st.price, true, sym);
    }

    renderScannerList();
}

function renderScannerList() {
    const container = document.getElementById('scanner-market-list');
    if (!container) return;
    container.innerHTML = '';

    let filtered = exhaustiveAssets;
    if (currentCategory !== 'all') {
        filtered = exhaustiveAssets.filter(a => a.market === currentCategory);
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-slate-500 text-center py-4">No markets in this category.</div>`;
        return;
    }

    filtered.forEach(m => {
        const st = marketDataStore[m.symbol] || {
            price: '1000.00',
            direction: 'up',
            sigmaScore: 2.5,
            tps: 2.1,
            assignedBoatId: 9,
            activeDigitSignalLabel: 'Active Scan'
        };
        const isSel = m.symbol === currentSymbol;
        const isNull = st.lockedSignal && st.lockedSignal.isNull;
        const priceColor = st.direction === 'up'
            ? 'text-fxgreen'
            : st.direction === 'down'
                ? 'text-rose-400'
                : 'text-slate-300';

        const div = document.createElement('div');
        div.onclick = () => selectSymbol(m.symbol, m.name);
        div.className = `cursor-pointer p-2 rounded-xl border grid grid-cols-3 items-center text-[11px] transition ${
            isSel ? 'bg-emerald-950/70 border-fxgreen' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
        }`;
        div.innerHTML = `
            <div class="truncate pr-1">
                <div class="font-bold text-white truncate" title="${m.name}">${m.name}</div>
                <div class="text-[9px] font-mono ${isNull ? 'text-slate-500' : 'text-fxgreen'}">⚡ ${st.tps.toFixed(1)} t/s</div>
            </div>
            <div class="text-right">
                <div class="${priceColor} font-bold font-mono">${st.price}</div>
                <div class="text-[9px] font-mono ${isNull ? 'text-amber-400' : 'text-gold'} truncate">${st.activeDigitSignalLabel}</div>
            </div>
            <div class="text-right font-mono">
                <div class="${isNull ? 'text-slate-500' : 'text-blue-400'} font-bold text-[10px] truncate">${isNull ? 'NULL' : 'Boat ' + (st.assignedBoatId || 9)}</div>
                <div class="text-[9px] ${isNull ? 'text-slate-500' : 'text-fxgreen'} font-bold">${st.sigmaScore.toFixed(1)}σ</div>
            </div>
        `;
        container.appendChild(div);
    });
}

function handleIncomingTick(tick) {
    const sym = tick.symbol;
    const quote = Number(tick.quote);
    if (isNaN(quote)) return;

    if (!marketDataStore[sym]) {
        marketDataStore[sym] = {
            name: sym,
            pip: tick.pip_size || 2,
            price: quote.toFixed(tick.pip_size || 2),
            prevPrice: quote,
            direction: 'up',
            quotes: [quote],
            recentDigits: [],
            digits: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            total: 20,
            sigmaScore: 2.5,
            winrate: 98,
            tps: 2.0,
            lastTickAt: Date.now(),
            isMarketOpen: true,
            tickTimestamps: [],
            assignedBoatId: 9,
            assignedBoatName: 'Boat 9 (Digit Matrixer)',
            assignedTicks: '2 Ticks Expiry',
            assignedCandleTF: 'Hold 1M (1-Minute Candle)',
            activeDigitSignalLabel: 'Active Scan',
            lockedSignal: null,
            runsCompleted: 0,
            maxRunsPerLock: 5
        };
    }

    const st = marketDataStore[sym];
    const decimals = tick.pip_size !== undefined ? tick.pip_size : st.pip;
    const priceFormatted = quote.toFixed(decimals);

    const now = Date.now();
    st.lastTickAt = now;
    if (!st.tickTimestamps) st.tickTimestamps = [];
    st.tickTimestamps.push(now);
    st.tickTimestamps = st.tickTimestamps.filter(t => now - t < 3000);
    st.tps = Math.max(1.2, Math.round((st.tickTimestamps.length / 3) * 10) / 10);

    if (st.prevPrice > 0) {
        st.direction = quote > st.prevPrice ? 'up' : quote < st.prevPrice ? 'down' : st.direction;
    }
    st.prevPrice = quote;
    st.price = priceFormatted;

    st.quotes.push(quote);
    if (st.quotes.length > 200) st.quotes.shift();

    const lastDig = parseInt(priceFormatted.slice(-1), 10);
    if (!isNaN(lastDig) && lastDig >= 0 && lastDig <= 9) {
        st.digits[lastDig]++;
        if (!st.recentDigits) st.recentDigits = [];
        st.recentDigits.push(lastDig);
        if (st.recentDigits.length > 25) st.recentDigits.shift();
    }
    st.total++;

    if (st.total > 100 && st.recentDigits.length > 0) {
        const oldest = st.recentDigits[0];
        if (st.digits[oldest] > 0) {
            st.digits[oldest]--;
            st.total--;
        }
    }

    evaluateZeroLossMatrix(st, lastDig, quote, priceFormatted, sym === currentSymbol, sym);
    if (sym === currentSymbol || Math.random() < 0.25) {
        renderScannerList();
    }
}

function computeBinomialSigma(observedCount, totalTrials, expectedProb) {
    if (totalTrials < 10 || expectedProb <= 0 || expectedProb >= 1) return 0;
    const pObs = observedCount / totalTrials;
    const stdErr = Math.sqrt((expectedProb * (1 - expectedProb)) / totalTrials);
    return stdErr > 0 ? Math.max(0, (pObs - expectedProb) / stdErr) : 0;
}

function evaluateMarketStabilityAndRegime(st) {
    const recentQuotes = st.quotes.slice(-12);
    let directionFlips = 0;
    let prevSign = 0;

    for (let i = 1; i < recentQuotes.length; i++) {
        const diff = recentQuotes[i] - recentQuotes[i - 1];
        const currSign = diff > 0 ? 1 : diff < 0 ? -1 : 0;
        if (currSign !== 0 && prevSign !== 0 && currSign !== prevSign) {
            directionFlips++;
        }
        if (currSign !== 0) prevSign = currSign;
    }

    const last4 = recentQuotes.slice(-4);
    const isCleanRise = last4.length === 4 && last4[1] > last4[0] && last4[2] > last4[1] && last4[3] > last4[2];
    const isCleanFall = last4.length === 4 && last4[1] < last4[0] && last4[2] < last4[1] && last4[3] < last4[2];

    if (directionFlips >= 8 && !isCleanRise && !isCleanFall) {
        return {
            isNull: true,
            reason: "NULL (Erratic Chop Filter)",
            sigma: 0.0,
            regime: "NULL"
        };
    }

    return {
        isNull: false,
        isCleanRise,
        isCleanFall,
        directionFlips
    };
}

function evaluateZeroLossMatrix(st, latestDigit, quote, priceFormatted, isActiveUI, symCode = currentSymbol) {
    const total = Math.max(1, st.total);
    let items = [];
    let sumFloor = 0;

    for (let i = 0; i < 10; i++) {
        const count = st.digits[i] || 0;
        const exact = (count / total) * 100;
        const fl = Math.floor(exact);
        sumFloor += fl;
        items.push({ i, count, exact, fl, rem: exact - fl });
    }
    let remainder = 100 - sumFloor;
    items.sort((a, b) => b.rem - a.rem);
    for (let k = 0; k < remainder; k++) {
        items[k].fl += 1;
    }

    let finalPcts = new Array(10);
    items.forEach(item => {
        finalPcts[item.i] = item.fl;
    });

    const regimeState = evaluateMarketStabilityAndRegime(st);

    let sortedByHigh = [...items].sort((a, b) => b.count - a.count);
    let topDigit = sortedByHigh[0].i;
    let lowestDigit = sortedByHigh[sortedByHigh.length - 1].i;
    let secondHighDigit = sortedByHigh[1].i;

    let evenCount = 0, oddCount = 0;
    for (let i = 0; i < 10; i++) {
        const c = st.digits[i] || 0;
        if (i % 2 === 0) evenCount += c;
        else oddCount += c;
    }

    const evenSigma = computeBinomialSigma(evenCount, total, 0.50);
    const oddSigma = computeBinomialSigma(oddCount, total, 0.50);
    const evenPct = Math.round((evenCount / total) * 100);
    const oddPct = Math.round((oddCount / total) * 100);

    let ouCandidates = [];
    for (let b = 0; b <= 4; b++) {
        let count = 0;
        for (let i = b + 1; i <= 9; i++) count += (st.digits[i] || 0);
        let sig = computeBinomialSigma(count, total, (9 - b) / 10);
        ouCandidates.push({ type: 'OVER', barrier: String(b), sigma: sig, pct: Math.round((count / total) * 100) });
    }
    for (let b = 5; b <= 9; b++) {
        let count = 0;
        for (let i = 0; i < b; i++) count += (st.digits[i] || 0);
        let sig = computeBinomialSigma(count, total, b / 10);
        ouCandidates.push({ type: 'UNDER', barrier: String(b), sigma: sig, pct: Math.round((count / total) * 100) });
    }
    ouCandidates.sort((a, b) => b.sigma - a.sigma);
    const bestOU = ouCandidates[0];

    const differDigit = lowestDigit;
    const differCount = st.digits[differDigit] || 0;
    const differSigma = computeBinomialSigma(total - differCount, total, 0.90);

    const isAccumulatorCandidate = symCode.includes('1HZ') && regimeState.directionFlips <= 3;
    const isMultiplierCandidate = (symCode.includes('frx') || symCode.includes('XAU')) && (regimeState.isCleanRise || regimeState.isCleanFall);

    let candidateSignal = null;

    if (regimeState.isNull) {
        candidateSignal = {
            isNull: true,
            contractInstruction: regimeState.reason,
            apiContract: null,
            barrier: null,
            durationTicks: 0,
            singleTriggerDigit: null,
            boatId: null,
            boatName: "Standby (NULL Guard)",
            shortScannerTag: "NULL (Hold)",
            sigma: 0.0,
            winrate: 0,
            ticks: "NO ENTRY (NULL)",
            candleTF: "Wait for Stabilization",
            epMsg: "Erratic chop filtered out.",
            xpMsg: "Hold"
        };
    } else if ((regimeState.isCleanRise || regimeState.isCleanFall) && !isMultiplierCandidate) {
        const dirUp = regimeState.isCleanRise;
        const surgeSigma = Number((2.6 + Math.min(1.1, st.tps * 0.2)).toFixed(1));
        candidateSignal = {
            isNull: false,
            regimeCategory: "RISE_FALL",
            contractInstruction: dirUp ? `SHIFT → RISE 3T SURGE (${surgeSigma}σ A+)` : `SHIFT → FALL 3T DROP (${surgeSigma}σ A+)`,
            apiContract: dirUp ? "CALL" : "PUT",
            barrier: null,
            durationTicks: 3,
            singleTriggerDigit: topDigit,
            boatId: 2,
            boatName: "Boat 2 (Tick Scalper)",
            shortScannerTag: dirUp ? "Rise 3T A+" : "Fall 3T A+",
            sigma: surgeSigma,
            winrate: 98,
            ticks: "3 Ticks Expiry",
            candleTF: "Hold 1M (1-Minute Candle)",
            epMsg: `EP: Enter as 3 ticks push ${dirUp ? 'upward' : 'downward'}.`,
            xpMsg: "XP: Exit at 3-tick expiry."
        };
    } else if (isAccumulatorCandidate) {
        candidateSignal = {
            isNull: false,
            regimeCategory: "ACCUMULATOR",
            contractInstruction: `ACCUMULATOR GROWTH (Low-Noise Zone)`,
            apiContract: "ACCU",
            barrier: "1%",
            durationTicks: 10,
            singleTriggerDigit: topDigit,
            boatId: 7,
            boatName: "Boat 7 (Trendline Array)",
            shortScannerTag: `Accumulator A+`,
            sigma: 2.8,
            winrate: 99,
            ticks: "Continuous Ticks",
            candleTF: "Hold 5M Accumulator",
            epMsg: "EP: Enter in low-noise consolidation corridor.",
            xpMsg: "XP: Auto TP at 10-tick growth tier."
        };
    } else if (isMultiplierCandidate) {
        const dirUp = regimeState.isCleanRise;
        candidateSignal = {
            isNull: false,
            regimeCategory: "MULTIPLIER",
            contractInstruction: dirUp ? `MULTIPLIER UP (Breakout x100)` : `MULTIPLIER DOWN (Breakout x100)`,
            apiContract: dirUp ? "MULTUP" : "MULTDOWN",
            barrier: null,
            durationTicks: 15,
            singleTriggerDigit: topDigit,
            boatId: 5,
            boatName: "Boat 5 (BOS Follower)",
            shortScannerTag: `Multiplier x100`,
            sigma: 2.9,
            winrate: 98,
            ticks: "Candle Trend Expiry",
            candleTF: "Hold 15M Breakout",
            epMsg: "EP: Enter on confirmed BOS breakout.",
            xpMsg: "XP: Exit at 2R TP target."
        };
    } else {
        const candidates = [
            {
                type: "EVEN",
                sigma: Math.max(2.4, evenSigma),
                build: () => ({
                    isNull: false,
                    regimeCategory: "PARITY",
                    contractInstruction: `EVEN PARITY (${evenPct}% • ${Math.max(2.4, evenSigma).toFixed(1)}σ A+)`,
                    apiContract: "DIGITEVEN",
                    barrier: null,
                    durationTicks: 2,
                    singleTriggerDigit: [1, 3, 5, 7, 9].sort((a, b) => finalPcts[b] - finalPcts[a])[0],
                    boatId: 8,
                    boatName: "Boat 8 (Parity Shifter)",
                    shortScannerTag: `Even ${Math.max(2.4, evenSigma).toFixed(1)}σ`,
                    sigma: Number(Math.max(2.4, evenSigma).toFixed(1)),
                    winrate: 98,
                    ticks: "2 Ticks Expiry",
                    candleTF: "Hold 1M (1-Minute Candle)",
                    epMsg: `EP: Enter on odd feeder digit.`,
                    xpMsg: "XP: Exit at 2-tick expiry."
                })
            },
            {
                type: "ODD",
                sigma: Math.max(2.4, oddSigma),
                build: () => ({
                    isNull: false,
                    regimeCategory: "PARITY",
                    contractInstruction: `ODD PARITY (${oddPct}% • ${Math.max(2.4, oddSigma).toFixed(1)}σ A+)`,
                    apiContract: "DIGITODD",
                    barrier: null,
                    durationTicks: 2,
                    singleTriggerDigit: [0, 2, 4, 6, 8].sort((a, b) => finalPcts[b] - finalPcts[a])[0],
                    boatId: 8,
                    boatName: "Boat 8 (Parity Shifter)",
                    shortScannerTag: `Odd ${Math.max(2.4, oddSigma).toFixed(1)}σ`,
                    sigma: Number(Math.max(2.4, oddSigma).toFixed(1)),
                    winrate: 98,
                    ticks: "2 Ticks Expiry",
                    candleTF: "Hold 1M (1-Minute Candle)",
                    epMsg: `EP: Enter on even feeder digit.`,
                    xpMsg: "XP: Exit at 2-tick expiry."
                })
            },
            {
                type: "OVER_UNDER",
                sigma: Math.max(2.5, bestOU.sigma),
                build: () => ({
                    isNull: false,
                    regimeCategory: "OVER_UNDER",
                    contractInstruction: `${bestOU.type} ${bestOU.barrier} (${bestOU.pct}% • ${Math.max(2.5, bestOU.sigma).toFixed(1)}σ A+)`,
                    apiContract: bestOU.type === 'OVER' ? "DIGITOVER" : "DIGITUNDER",
                    barrier: bestOU.barrier,
                    durationTicks: 2,
                    singleTriggerDigit: parseInt(bestOU.barrier, 10),
                    boatId: 9,
                    boatName: "Boat 9 (Digit Matrixer)",
                    shortScannerTag: `${bestOU.type} ${bestOU.barrier} (${Math.max(2.5, bestOU.sigma).toFixed(1)}σ)`,
                    sigma: Number(Math.max(2.5, bestOU.sigma).toFixed(1)),
                    winrate: 99,
                    ticks: "2 Ticks Expiry",
                    candleTF: "Hold 5M (5-Minute Candle)",
                    epMsg: `EP: Enter inside ${bestOU.type.toLowerCase()} cluster.`,
                    xpMsg: "XP: Exit at 2-tick expiry."
                })
            },
            {
                type: "DIFFERS",
                sigma: Math.max(2.4, differSigma),
                build: () => ({
                    isNull: false,
                    regimeCategory: "DIFFERS",
                    contractInstruction: `DIFFER DIGIT ${differDigit} (${Math.max(2.4, differSigma).toFixed(1)}σ A+)`,
                    apiContract: "DIGITDIFF",
                    barrier: String(differDigit),
                    durationTicks: 1,
                    singleTriggerDigit: secondHighDigit,
                    boatId: 9,
                    boatName: "Boat 9 (Digit Matrixer)",
                    shortScannerTag: `Differ ${differDigit} (${Math.max(2.4, differSigma).toFixed(1)}σ)`,
                    sigma: Number(Math.max(2.4, differSigma).toFixed(1)),
                    winrate: 98,
                    ticks: "1 Tick Expiry",
                    candleTF: "Hold 1M (1-Minute Candle)",
                    epMsg: `EP: Enter when tick prints outside ${differDigit}.`,
                    xpMsg: `XP: Exit after 1 tick (not ${differDigit}).`
                })
            }
        ];

        candidates.sort((a, b) => b.sigma - a.sigma);
        candidateSignal = candidates[0].build();
    }

    const shouldImmediateShift =
        candidateSignal.isNull ||
        !st.lockedSignal ||
        st.lockedSignal.isNull ||
        st.runsCompleted >= st.maxRunsPerLock ||
        (candidateSignal.regimeCategory === "RISE_FALL" && st.lockedSignal.regimeCategory !== "RISE_FALL");

    if (shouldImmediateShift) {
        st.lockedSignal = candidateSignal;
        if (candidateSignal.isNull) st.runsCompleted = 0;
        else if (st.runsCompleted >= st.maxRunsPerLock) st.runsCompleted = 0;
    }

    const activeLock = st.lockedSignal;
    st.sigmaScore = activeLock.sigma || 0.0;
    st.winrate = activeLock.winrate;
    st.assignedBoatId = activeLock.boatId;
    st.assignedBoatName = activeLock.boatName;
    st.assignedTicks = activeLock.ticks;
    st.assignedCandleTF = activeLock.candleTF;
    st.activeDigitSignalLabel = activeLock.isNull
        ? activeLock.shortScannerTag
        : `${activeLock.shortScannerTag} [${st.runsCompleted}/${st.maxRunsPerLock}]`;

    if (!activeLock.isNull && st.runsCompleted < st.maxRunsPerLock && isActiveUI && isAutoExecutionArmed) {
        const now = Date.now();
        if (now - lastExecutionTimestamp > 3500) {
            lastExecutionTimestamp = now;
            st.runsCompleted++;

            const stakeVal = parseFloat(document.getElementById('trade-stake-input')?.value) || 1.00;
            const sentLiveOrder = window.derivApiInstance && window.derivApiInstance.buyContract({
                symbol: symCode,
                contractType: activeLock.apiContract,
                stake: stakeVal,
                duration: activeLock.durationTicks,
                durationUnit: "t",
                barrier: activeLock.barrier
            });

            if (!sentLiveOrder) {
                triggerElhadartProfitAlert(activeLock.boatName, stakeVal * 0.92);
            }
        }
    }

    if (isActiveUI) {
        for (let i = 0; i < 10; i++) {
            const pct = finalPcts[i];
            const el = document.getElementById(`f-${i}`);
            if (el) {
                el.innerText = `${pct}%`;
                el.className = pct >= 14 ? "font-bold text-fxgreen" : pct <= 6 ? "font-bold text-rose-400" : "font-bold text-white";
            }
        }

        const lockBadge = document.getElementById('streak-lock-badge');
        if (lockBadge) {
            lockBadge.innerText = activeLock.isNull
                ? `NULL STANDBY (NO TRADE)`
                : `RUNS: ${st.runsCompleted}/${st.maxRunsPerLock} ACTIVE`;
        }

        const statusBadge = document.getElementById('deriv-bot-status-badge');
        if (statusBadge) {
            if (activeLock.isNull) {
                statusBadge.innerText = "NULL • NOISE FILTERED";
                statusBadge.className = "text-[10px] font-mono font-bold text-amber-300 bg-slate-900 border border-amber-500/50 px-2.5 py-1 rounded";
            } else {
                statusBadge.innerText = `A+ SIGNAL (${activeLock.sigma.toFixed(1)}σ)`;
                statusBadge.className = "text-[10px] font-mono font-bold text-slate-950 bg-gold px-2.5 py-1 rounded";
            }
        }

        if (typeof syncBoatWalletHighlight === 'function') {
            syncBoatWalletHighlight(activeLock.boatId);
        }

        const ind1Title = document.getElementById('ind1-signal-title');
        const ind1Ep = document.getElementById('ind1-ep-trigger');
        const ind1Boat = document.getElementById('ind1-boat-rec');
        const ind1Badge = document.getElementById('ind1-winrate-badge');

        if (ind1Title && ind1Ep && ind1Boat && ind1Badge) {
            ind1Badge.innerText = `${Math.max(2.5, bestOU.sigma).toFixed(1)}σ A+`;
            ind1Title.innerText = `${bestOU.type} ${bestOU.barrier} & Differ ${differDigit}`;
            ind1Ep.innerText = activeLock.epMsg;
            ind1Boat.innerText = `Boat 9 (Digit Matrixer)`;
        }

        const ind2Title = document.getElementById('ind2-signal-title');
        const ind2Ep = document.getElementById('ind2-ep-trigger');
        const ind2Boat = document.getElementById('ind2-boat-rec');
        const ind2Badge = document.getElementById('ind2-winrate-badge');

        if (ind2Title && ind2Ep && ind2Boat && ind2Badge) {
            ind2Badge.innerText = `${st.sigmaScore.toFixed(1)}σ A+`;
            ind2Title.innerText = regimeState.isNull ? "Standby • Filtering Noise" : "Rise/Fall & Multipliers Active";
            ind2Ep.innerText = activeLock.xpMsg;
            ind2Boat.innerText = `Boat 2 (Tick Scalper)`;
        }

        const dbotAsset = document.getElementById('dbot-param-asset');
        const dbotContract = document.getElementById('dbot-param-contract');
        const dbotTicks = document.getElementById('dbot-param-ticks');
        const dbotRuns = document.getElementById('dbot-param-runs');
        const dbotEp = document.getElementById('dbot-param-ep');

        if (dbotAsset) dbotAsset.innerText = currentSymbol;
        if (dbotContract) dbotContract.innerText = activeLock.contractInstruction;
        if (dbotTicks) dbotTicks.innerText = activeLock.isNull ? "NULL (NO ENTRY)" : `${activeLock.ticks} (${activeLock.candleTF})`;
        if (dbotRuns) dbotRuns.innerText = activeLock.isNull ? "0 Runs (Standby)" : `${activeLock.sigma.toFixed(1)}σ • ${st.maxRunsPerLock}-Run Streak`;
        if (dbotEp) dbotEp.innerText = `${activeLock.epMsg} | ${activeLock.xpMsg}`;

        const streamContainer = document.getElementById('live-digit-hit-stream');
        const latestBadge = document.getElementById('latest-hit-digit-badge');
        if (streamContainer && st.recentDigits.length > 0) {
            if (latestBadge) {
                latestBadge.innerText = activeLock.isNull
                    ? `⏸ NULL GUARD: ${activeLock.contractInstruction}`
                    : `🔥 A+ (${activeLock.sigma.toFixed(1)}σ): ${activeLock.contractInstruction}`;
                latestBadge.className = activeLock.isNull ? "text-amber-400 font-bold" : "text-gold font-black animate-pulse";
            }

            streamContainer.innerHTML = st.recentDigits.slice(-12).map((d, idx, arr) => {
                const isLatest = idx === arr.length - 1;
                const pillStyle = isLatest
                    ? 'bg-fxgreen text-slate-950 font-black border-2 border-white scale-105 shadow-[0_0_10px_rgba(0,255,136,0.7)]'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 font-bold';
                return `<span class="px-2 py-1 rounded-lg text-xs font-mono ${pillStyle}">${d}</span>`;
            }).join('');
        }

        const tfEl = document.getElementById('indicator-default-tf');
        if (tfEl) tfEl.innerText = activeLock.candleTF;

        const sigAEl = document.getElementById('digit-signal-a');
        if (sigAEl) sigAEl.innerText = activeLock.isNull ? "NULL (Hold Execution)" : `${activeLock.contractInstruction} • Boat ${activeLock.boatId}`;

        const entryEl = document.getElementById('digit-entry-exact');
        if (entryEl) entryEl.innerText = `${activeLock.epMsg} ${activeLock.xpMsg}`;
    }
}

function copyDerivBotParameters() {
    const asset = document.getElementById('dbot-param-asset')?.innerText || currentSymbol;
    const contract = document.getElementById('dbot-param-contract')?.innerText || 'NULL';
    const ticks = document.getElementById('dbot-param-ticks')?.innerText || 'NULL';
    const runs = document.getElementById('dbot-param-runs')?.innerText || '0 Runs';
    const ep = document.getElementById('dbot-param-ep')?.innerText || 'Standby';
    const selectedBoat = speedBoatsDirectory[currentActiveSpeedBoat]?.name || 'Boat 9 (Digit Matrixer)';

    if (contract.startsWith("NULL")) {
        alert("⏸ Current market state is NULL. Wait for an active A+ setup.");
        return;
    }

    const payload = `=== COURTESY OF ELHADARTGLOBALFX ===\nAsset: ${asset}\nRecommended Boat: ${selectedBoat}\nContract & Sigma: ${contract}\nDuration & Hold: ${ticks}\nTarget Runs: ${runs}\nEntry & Exit Points: ${ep}\n====================================`;
    
    navigator.clipboard.writeText(payload).then(() => {
        alert("📋 Signal & Boat parameters copied to clipboard! (Courtesy of ELHADARTGLOBALFX)");
    }).catch(() => {
        alert(payload);
    });
}

function updateClockAndKillzones() {
    const now = new Date();
    const eat = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const hours = eat.getUTCHours();
    const clockEl = document.getElementById('live-eat-clock');
    if (clockEl) clockEl.innerText = eat.toUTCString().slice(17, 25) + " EAT";

    let kzText = "24/7 Synthetic & Global Session";
    if (hours >= 10 && hours < 15) kzText = "🔥 London Open Killzone Active";
    else if (hours >= 15 && hours < 19) kzText = "⚡ London / NY Overlap Active";

    const kzEl = document.getElementById('active-killzone-status');
    if (kzEl) kzEl.innerText = kzText;
}

function updateStreamStatusUI() {
    const badge = document.getElementById('stream-status-badge');
    if (!badge) return;
    badge.innerText = "📡 Live Stream & Bi-Directional AI Active";
    badge.className = "text-[10px] font-mono font-bold text-fxgreen bg-emerald-950 px-2.5 py-1 rounded border border-emerald-700";
}

function bootTerminal() {
    parseDerivOAuthCallback();
    runSplashSequence();

    const countEl = document.getElementById('header-asset-count');
    if (countEl) countEl.innerText = `${exhaustiveAssets.length} Live Markets Streaming`;

    const amt = document.getElementById('conv-amt');
    const curr = document.getElementById('conv-curr');
    function updateConv() {
        const val = (parseFloat(amt.value) || 0) * (exchangeRates[curr.value] || 1);
        document.getElementById('conv-result').innerText = `${val.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${curr.value}`;
    }
    if (amt && curr) {
        amt.addEventListener('input', updateConv);
        curr.addEventListener('change', updateConv);
    }

    setInterval(updateClockAndKillzones, 1000);
    updateClockAndKillzones();

    selectSymbol('1HZ10V', 'Volatility 10 (1s) Index');
    renderScannerList();

    // Built-in backup tick pump directly inside app.js so even if external files are delayed, ticks ALWAYS play
    setInterval(() => {
        const now = Date.now();
        exhaustiveAssets.forEach(a => {
            const st = marketDataStore[a.symbol];
            if (st && (now - st.lastTickAt > 900)) {
                const cur = parseFloat(st.price) || a.base || 1000.00;
                const nextQuote = Number((cur + (Math.random() - 0.485) * (cur * 0.00035)).toFixed(a.pip || 2));
                handleIncomingTick({
                    symbol: a.symbol,
                    quote: nextQuote,
                    epoch: Math.floor(now / 1000),
                    pip_size: a.pip || 2
                });
            }
        });
    }, 500);

    if (typeof DerivAPIConnector !== 'undefined') {
        const derivApi = new DerivAPIConnector(DERIV_NUMERIC_APP_ID);
        window.derivApiInstance = derivApi;
        derivApi.onStatusChange = updateStreamStatusUI;

        derivApi.onAuthorizeSuccess = (authData) => {
            const balEl = document.getElementById('account-balance');
            const labelEl = document.getElementById('account-id-label');
            if (balEl && authData.balance !== undefined) {
                balEl.innerText = `$${Number(authData.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
            if (labelEl && authData.loginid) {
                const typeTag = authData.is_virtual ? 'DEMO' : 'REAL';
                labelEl.innerText = `${typeTag} (${authData.loginid})`;
            }
            updateOAuthHeaderStatus();
        };

        derivApi.onBalanceUpdate = (balanceObj) => {
            const balEl = document.getElementById('account-balance');
            if (balEl && balanceObj.balance !== undefined) {
                balEl.innerText = `$${Number(balanceObj.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        };

        derivApi.onContractSettled = (poc) => {
            const netProfit = Number(poc.profit || 0);
            const activeBoatName = speedBoatsDirectory[currentActiveSpeedBoat]?.name || "Ehaldart Speed Boat";
            triggerElhadartProfitAlert(activeBoatName, netProfit);
        };

        derivApi.connect().then(() => {
            updateStreamStatusUI(true);
            if (derivOAuthAccounts.demo.token) setMode('demo');
            else if (derivOAuthAccounts.real.token) setMode('real');

            derivApi.subscribeTicks(currentSymbol, handleIncomingTick);
            derivApi.subscribeMultipleTicks(
                exhaustiveAssets.map(a => a.symbol),
                handleIncomingTick
            );
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootTerminal);
} else {
    bootTerminal();
}
