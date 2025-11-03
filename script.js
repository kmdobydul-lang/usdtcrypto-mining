// Live frontend logic (local-only, no backend)
const CONVERT_RATE = 0.01;
const MIN_WITHDRAW = 2;
const MINING_DURATION_MS = 24 * 60 * 60 * 1000;
const RECHARGE_BNB_ADDRESS = '0x53f90e7a0d2834b772890f4f456d51aaed61de43';

// Load or init state
function getState(k, d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch{ return d; } }
function setState(k,v){ localStorage.setItem(k, JSON.stringify(v)); }

let state = {
  wlfi: getState('wlfi', 0.00),
  usdt: getState('usdt', 0.00),
  teamCount: getState('teamCount', 0),
  miningEnd: getState('miningEnd', null),
  miningActive: getState('miningActive', false)
};

const el = id => document.getElementById(id);
const wlfiAmountEl = el('wlfiAmount');
const meWLFIEl = el('meWLFI');
const meUSDTEl = el('meUSDT');
const progressInner = el('progressInner');
const progressTimer = el('progressTimer');
const mineActionBtn = el('mineActionBtn');
const mineStatus = el('mineStatus');
const mineMessage = el('mineMessage');
const refLinkEl = el('refLink');
const teamCountEl = el('teamCount');
const copyRefBtn = el('copyRefBtn');

// Referral link generator
const userId = 'U' + Math.floor(Math.random()*99999);
const baseInvite = window.location.origin + window.location.pathname;
refLinkEl.value = `${baseInvite}?ref=${userId}`;
copyRefBtn.onclick = () => {
  navigator.clipboard.writeText(refLinkEl.value);
  alert('Referral link copied!');
};

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  }
});

function renderAll(){
  wlfiAmountEl.textContent = state.wlfi.toFixed(2);
  meWLFIEl.textContent = state.wlfi.toFixed(2);
  meUSDTEl.textContent = state.usdt.toFixed(2);
  teamCountEl.textContent = state.teamCount;
  setState('wlfi', state.wlfi);
  setState('usdt', state.usdt);
  setState('teamCount', state.teamCount);
  updateMiningUI();
}

let miningInterval;
function updateMiningUI(){
  if(state.miningActive && state.miningEnd){
    const remain = state.miningEnd - Date.now();
    if(remain <= 0){
      progressInner.style.width = '100%';
      progressTimer.textContent = 'Ready to claim';
      mineActionBtn.textContent = 'Collect Reward (5 WLFI)';
      mineActionBtn.disabled = false;
      mineStatus.textContent = 'Completed';
      mineActionBtn.onclick = collectReward;
    } else {
      const pct = ((MINING_DURATION_MS - remain)/MINING_DURATION_MS)*100;
      progressInner.style.width = pct + '%';
      const hrs = Math.floor(remain/3600000);
      const mins = Math.floor((remain%3600000)/60000);
      const secs = Math.floor((remain%60000)/1000);
      progressTimer.textContent = `${hrs}h ${mins}m ${secs}s left`;
      mineStatus.textContent = 'Mining...';
      mineActionBtn.textContent = 'Mining...';
      mineActionBtn.disabled = true;
      if(!miningInterval){
        miningInterval = setInterval(updateMiningUI, 1000);
      }
    }
  } else {
    mineActionBtn.textContent = 'Start Mining';
    mineStatus.textContent = 'Idle';
    mineActionBtn.disabled = false;
    mineActionBtn.onclick = startMining;
    if(miningInterval){ clearInterval(miningInterval); miningInterval=null; }
  }
}

function startMining(){
  state.miningActive = true;
  state.miningEnd = Date.now() + MINING_DURATION_MS;
  mineMessage.textContent = 'Mining started successfully.';
  setState('miningActive', true);
  setState('miningEnd', state.miningEnd);
  renderAll();
}

function collectReward(){
  state.wlfi += 5;
  state.miningActive = false;
  state.miningEnd = null;
  setState('miningActive', false);
  setState('miningEnd', null);
  mineMessage.textContent = '✅ You collected 5 WLFI!';
  renderAll();
}

renderAll();