let balance = 0;
let mining = false;
let secondsLeft = 86400; // 24 hours
let timerInterval;

function startMining() {
  if (mining) return alert("⛏️ Mining already in progress!");
  mining = true;
  document.getElementById("mineBtn").disabled = true;
  timerInterval = setInterval(updateTimer, 1000);
  alert("✅ Mining Started! You’ll be able to claim after 24 hours.");
}

function updateTimer() {
  secondsLeft--;
  if (secondsLeft <= 0) {
    clearInterval(timerInterval);
    document.getElementById("claimBtn").disabled = false;
    document.getElementById("timer").innerText = "00:00:00";
    alert("🎉 Mining complete! You can now claim your reward.");
    return;
  }
  let h = Math.floor(secondsLeft / 3600);
  let m = Math.floor((secondsLeft % 3600) / 60);
  let s = secondsLeft % 60;
  document.getElementById("timer").innerText =
    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function claimReward() {
  if (secondsLeft > 0) return alert("⏳ Mining still running...");
  balance += 5 * 0.01; // 5 coins × 0.01$
  updateDisplay();
  secondsLeft = 86400;
  document.getElementById("mineBtn").disabled = false;
  document.getElementById("claimBtn").disabled = true;
  alert("💰 You earned 0.05 USDT!");
}

function updateDisplay() {
  document.getElementById("balance").innerText = balance.toFixed(4);
}

function convertToUSDT() {
  const amount = parseFloat(document.getElementById("coinInput").value);
  if (isNaN(amount) || amount <= 0) return alert("Enter valid WLFI amount!");
  const usd = amount * 0.01;
  alert(`💱 ${amount} WLFI converted to ${usd.toFixed(2)} USDT`);
}

function withdraw(platform) {
  const uid = prompt(`Enter your ${platform.toUpperCase()} UID:`);
  if (!uid) return alert("❗ UID required!");
  if (balance < 2) return alert("⚠️ Minimum 2 USDT required for withdrawal.");
  alert(`✅ Withdrawal request sent to ${platform.toUpperCase()}!\nUID: ${uid}\nAmount: ${balance.toFixed(2)} USDT`);
  balance = 0;
  updateDisplay();
}
