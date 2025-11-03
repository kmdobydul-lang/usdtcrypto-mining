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
});