// Demo behavior (frontend only)
let wlfi = 214.00;
let usdt = 0.00;
let mining = false;
function updateUI(){ if(document.getElementById('wlfi')) document.getElementById('wlfi').innerText = wlfi.toFixed(2); if(document.getElementById('usdt')) document.getElementById('usdt').innerText = usdt.toFixed(2); if(document.getElementById('teamCount')) document.getElementById('teamCount').innerText = 2;}
document.addEventListener('DOMContentLoaded', ()=>{ updateUI();
  document.getElementById('mineBtn').addEventListener('click', ()=>{ wlfi += 1.5; updateUI(); alert('Mined +1.5 WLFI (demo)');});
  document.getElementById('bonusBtn').addEventListener('click', ()=>{ wlfi += 10; updateUI(); alert('Daily bonus +10 WLFI (demo)');});
  document.getElementById('withdrawBtn').addEventListener('click', ()=>{ const bin = prompt('Enter Binance UID (demo)'); const bit = prompt('Enter Bitget UID (demo)'); if(!bin && !bit){ alert('Enter at least one UID'); return; } if(usdt < 2){ alert('Minimum 2 USDT required (demo)'); return; } alert('Withdraw request sent (demo)'); usdt = 0; updateUI();});
  document.getElementById('copyRef').addEventListener('click', ()=>{ const ref = document.getElementById('refLink').value; navigator.clipboard && navigator.clipboard.writeText(ref); alert('Referral copied (demo)');});
// ==========================
// Mining Timer & Reward Logic
// ==========================
const mineBtn = document.getElementById("mine-btn");
const mineTimer = document.getElementById("mine-timer");
const mineResult = document.getElementById("mine-result");

function startMining() {
  const startTime = Date.now();
  const endTime = startTime + 24 * 60 * 60 * 1000; // 24 hours later
  localStorage.setItem("miningEnd", endTime);
  localStorage.setItem("miningStarted", "true");
  mineBtn.disabled = true;
  mineBtn.innerText = "Mining in Progress...";
  updateTimer();
}

function updateTimer() {
  const miningEnd = localStorage.getItem("miningEnd");
  if (!miningEnd) return;

  const interval = setInterval(() => {
    const now = Date.now();
    const remaining = miningEnd - now;

    if (remaining <= 0) {
      clearInterval(interval);
      mineBtn.disabled = false;
      mineBtn.innerText = "Collect Reward (5 WLF)";
      mineBtn.onclick = collectReward;
      mineTimer.innerText = "Mining completed!";
      return;
    }

    const hrs = Math.floor(remaining / (1000 * 60 * 60));
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remaining % (1000 * 60)) / 1000);
    mineTimer.innerText = `Time left: ${hrs}h ${mins}m ${secs}s`;
  }, 1000);
}

function collectReward() {
  mineResult.innerText = "✅ You collected 5 WLF coins!";
  localStorage.removeItem("miningEnd");
  localStorage.removeItem("miningStarted");
  mineBtn.innerText = "Start Mining";
  mineBtn.onclick = startMining;
}

if (localStorage.getItem("miningStarted")) {
  const miningEnd = localStorage.getItem("miningEnd");
  if (Date.now() < miningEnd) {
    mineBtn.disabled = true;
    mineBtn.innerText = "Mining in Progress...";
    updateTimer();
  } else {
    mineBtn.innerText = "Collect Reward (5 WLF)";
    mineBtn.onclick = collectReward;
  }
} else {
  mineBtn.onclick = startMining;
}});
