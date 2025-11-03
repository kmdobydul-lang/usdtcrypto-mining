// Demo frontend logic (no backend). Persists to localStorage.

// Constants
const CONVERT_RATE = 0.01; // 1 WLFI = 0.01 USDT
const MIN_WITHDRAW = 2; // USDT
const MINING_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const RECHARGE_BNB_ADDRESS = '0x53f90e7a0d2834b772890f4f456d51aaed61de43';

// State helpers
function getState(key, defaultVal) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : defaultVal; }
  catch(e){ return defaultVal; }
}
function setState(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

// Initial state defaults
let state = {
  wlfi: getState('wlfi', 214.00),   // give starting coins
  usdt: getState('usdt', 0.00),
  teamCount: getState('teamCount', 2),
  miningEnd: getState('miningEnd', null), // timestamp when mining ends
  miningActive: getState('miningActive', false)
};

// UI elements
const pages = {
  mine: document.getElementById('page-mine'),
  team: document.getElementById('page-team'),
  me: document.getElementById('page-me')
};
const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
const wlfiAmountEl = document.getElementById('wlfiAmount');
const meWLFIEl = document.getElementById('meWLFI');
const meUSDTE = document.getElementById('meUSDT');
const progressInner = document.getElementById('progressInner');
const progressTimer = document.getElementById('progressTimer');
const mineActionBtn = document.getElementById('mineActionBtn');
const mineStatus = document.getElementById('mineStatus');
const mineMessage = document.getElementById('mineMessage');

const copyRefBtn = document.getElementById('copyRefBtn');
const refLinkEl = document.getElementById('refLink');
const teamCountEl = document.getElementById('teamCount');

const openConvert = document.getElementById('openConvert');
const modalConvert = document.getElementById('modalConvert');
const convertInput = document.getElementById('convertInput');
const convertDo = document.getElementById('convertDo');
const convertResult = document.getElementById('convertResult');
const closeConvert = document.getElementById('closeConvert');

const openRecharge = document.getElementById('openRecharge');
const modalRecharge = document.getElementById('modalRecharge');
const rechargeSelect = document.getElementById('rechargeSelect');
const rechargeInfo = document.getElementById('rechargeInfo');
const closeRecharge = document.getElementById('closeRecharge');

const openWithdraw = document.getElementById('openWithdraw');
const modalWithdraw = document.getElementById('modalWithdraw');
const withdrawMethod = document.getElementById('withdrawMethod');
const binanceInput = document.getElementById('binanceInput');
const bitgetInput = document.getElementById('bitgetInput');
const withdrawAmount = document.getElementById('withdrawAmount');
const submitWithdraw = document.getElementById('submitWithdraw');
const withdrawMsg = document.getElementById('withdrawMsg');
const closeWithdraw = document.getElementById('closeWithdraw');

const fakeInviteBtn = document.getElementById('fakeInviteBtn');

// navigation
navBtns.forEach(btn=>{
  btn.addEventListener('click', ()=> {
    navBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    Object.values(pages).forEach(p=>p.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// render UI from state
function renderAll(){
  wlfiAmountEl.innerText = parseFloat(state.wlfi).toFixed(2);
  meWLFIEl.innerText = parseFloat(state.wlfi).toFixed(2);
  meUSDTE.innerText = parseFloat(state.usdt).toFixed(2);
  teamCountEl.innerText = state.teamCount;
  updateMiningUI();
  setState('wlfi', state.wlfi);
  setState('usdt', state.usdt);
  setState('teamCount', state.teamCount);
}

// Mining logic
let miningInterval = null;
function updateMiningUI(){
  if(state.miningActive && state.miningEnd){
    const remaining = state.miningEnd - Date.now();
    if(remaining <= 0){
      // mining finished
      progressInner.style.width = '100%';
      progressTimer.innerText = 'Mining complete — ready to claim';
      mineActionBtn.innerText = 'Collect Reward (5 WLFI)';
      mineActionBtn.disabled = false;
      mineStatus.innerText = 'Completed';
      mineActionBtn.onclick = collectReward;
    } else {
      // still mining
      const pct = Math.max(0, Math.min(100, ((MINING_DURATION_MS - remaining)/MINING_DURATION_MS)*100));
      progressInner.style.width = pct + '%';
      const hrs = Math.floor(remaining / (1000*60*60));
      const mins = Math.floor((remaining % (1000*60*60)) / (1000*60));
      const secs = Math.floor((remaining % (1000*60)) / 1000);
      progressTimer.innerText = `Time left: ${hrs}h ${mins}m ${secs}s`;
      mineActionBtn.innerText = 'Mining in progress...';
      mineActionBtn.disabled = true;
      mineStatus.innerText = 'Mining';
      // update interval if not set
      if(!miningInterval){
        miningInterval = setInterval(()=> {
          updateMiningUI();
        },1000);
      }
    }
  } else {
    // not started
    progressInner.style.width = '0%';
    progressTimer.innerText = 'Not started';
    mineActionBtn.innerText = 'Start Mining';
    mineActionBtn.disabled = false;
    mineStatus.innerText = 'Not started';
    if(miningInterval){ clearInterval(miningInterval); miningInterval = null; }
    mineActionBtn.onclick = startMining;
  }
}

function startMining(){
  state.miningActive = true;
  state.miningEnd = Date.now() + MINING_DURATION_MS;
  setState('miningActive', true);
  setState('miningEnd', state.miningEnd);
  mineMessage.innerText = 'Mining started — come back after 24 hours to collect 5 WLFI (demo).';
  renderAll();
}

function collectReward(){
  // add 5 WLFI
  state.wlfi = parseFloat(state.wlfi) + 5;
  state.miningActive = false;
  state.miningEnd = null;
  setState('miningActive', false);
  setState('miningEnd', null);
  mineMessage.innerText = '✅ You collected 5 WLFI!';
  renderAll();
}

// Convert logic
openConvert.addEventListener('click', ()=>modalConvert.classList.remove('hidden'));
closeConvert.addEventListener('click', ()=>modalConvert.classList.add('hidden'));
convertDo.addEventListener('click', ()=>{
  const v = parseFloat(convertInput.value || 0);
  if(!v || v <= 0){ alert('Enter WLFI amount'); return; }
  if(v > state.wlfi){ alert('Not enough WLFI'); return; }
  const converted = v * CONVERT_RATE;
  state.wlfi = parseFloat(state.wlfi) - v;
  state.usdt = parseFloat(state.usdt) + converted;
  setState('wlfi', state.wlfi); setState('usdt', state.usdt);
  convertResult.innerText = `Converted ${v} WLFI → ${converted.toFixed(2)} USDT`;
  renderAll();
});

// Recharge modal
openRecharge.addEventListener('click', ()=>{ modalRecharge.classList.remove('hidden'); updateRechargeInfo(); });
closeRecharge.addEventListener('click', ()=>modalRecharge.classList.add('hidden'));
rechargeSelect.addEventListener('change', updateRechargeInfo);
function updateRechargeInfo(){
  const v = rechargeSelect.value;
  if(v === 'USDT'){
    rechargeInfo.innerHTML = `<div>Deposit USDT (ERC20 / TRC20). Use your user-id as memo (demo only).</div>`;
  } else {
    rechargeInfo.innerHTML = `<div>Deposit BNB (BEP20) to address:<br><code style="color:#9ee9b8">${RECHARGE_BNB_ADDRESS}</code></div>`;
  }
}

// Withdraw modal
openWithdraw.addEventListener('click', ()=>{ modalWithdraw.classList.remove('hidden'); });
closeWithdraw.addEventListener('click', ()=>modalWithdraw.classList.add('hidden'));
withdrawMethod.addEventListener('change', ()=>{
  const v = withdrawMethod.value;
  if(v === 'binance'){ binanceInput.classList.remove('hidden'); bitgetInput.classList.add('hidden'); }
  else { bitgetInput.classList.remove('hidden'); binanceInput.classList.add('hidden'); }
});
submitWithdraw.addEventListener('click', ()=>{
  const amount = parseFloat(withdrawAmount.value || 0);
  if(isNaN(amount) || amount <= 0){ alert('Enter withdraw amount'); return; }
  if(amount < MIN_WITHDRAW){ alert('Minimum withdraw is ' + MIN_WITHDRAW + ' USDT'); return; }
  if(amount > state.usdt){ alert('Not enough USDT balance'); return; }
  const method = withdrawMethod.value;
  if(method === 'binance' && !binanceInput.value.trim()){ alert('Enter Binance UID'); return; }
  if(method === 'bitget' && !bitgetInput.value.trim()){ alert('Enter Bitget UID'); return; }
  // simulate withdraw
  state.usdt = parseFloat(state.usdt) - amount;
  setState('usdt', state.usdt);
  withdrawMsg.innerText = `Withdraw request submitted (demo). Method: ${method.toUpperCase()}, Amount: ${amount.toFixed(2)} USDT`;
  renderAll();
});

// Copy referral
copyRefBtn.addEventListener('click', ()=>{
  const val = refLinkEl.value;
  navigator.clipboard && navigator.clipboard.writeText(val);
  alert('Referral link copied (demo).');
});

// Fake invite to demo team
fakeInviteBtn.addEventListener('click', ()=>{
  state.teamCount = parseInt(state.teamCount) + 1;
  setState('teamCount', state.teamCount);
  renderAll();
});

// Page startup: restore mining state if present
(function init(){
  // restore mining info from localStorage
  const miningActive = getState('miningActive', false);
  const miningEnd = getState('miningEnd', null);
  if(miningActive && miningEnd){
    state.miningActive = true;
    state.miningEnd = miningEnd;
  } else {
    state.miningActive = false;
    state.miningEnd = null;
    setState('miningActive', false);
    setState('miningEnd', null);
  }
  // ensure UI elements exist
  renderAll();
})();