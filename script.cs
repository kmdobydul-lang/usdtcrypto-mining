<script>
// --- Local Data Load ---
let wlfi = parseFloat(localStorage.getItem("wlfi") || 0);
let usdt = parseFloat(localStorage.getItem("usdt") || 0);

// --- Convert WLFI → USDT ---
function convertToUSDT() {
  if (wlfi >= 100) {
    wlfi -= 100;
    usdt += 1;
    localStorage.setItem("wlfi", wlfi);
    localStorage.setItem("usdt", usdt);
    alert("✅ Successfully converted 100 WLFI to 1 USDT!");
    updateWallet();
  } else {
    alert("⚠️ You need at least 100 WLFI to convert!");
  }
}

// --- Recharge (USDT / BNB) ---
function recharge() {
  const address = "0xYOUR_WALLET_ADDRESS_HERE";
  const msg = `💰 Send USDT (TRC20/BEP20) to this address:\n\n${address}\n\nAfter sending, contact admin to verify.`;
  navigator.clipboard.writeText(address);
  alert(msg + "\n\n📋 Address copied!");
}

// --- Withdraw Function ---
function withdraw() {
  const uid = prompt("Enter your Binance/Bitget UID to withdraw:");
  const amount = parseFloat(prompt("Enter amount to withdraw (min 1 USDT):"));

  if (!uid || isNaN(amount) || amount < 1) {
    alert("⚠️ Invalid input! Try again.");
    return;
  }

  if (usdt >= amount) {
    usdt -= amount;
    localStorage.setItem("usdt", usdt);
    alert(`✅ Withdrawal request of ${amount} USDT submitted!\nUID: ${uid}\n\nFunds will be sent within 24 hours.`);
    updateWallet();
  } else {
    alert("⚠️ Not enough USDT balance!");
  }
}

// --- Update Wallet Display ---
function updateWallet() {
  document.getElementById("wlfi-balance").innerText = wlfi.toFixed(2);
  document.getElementById("usdt-balance").innerText = usdt.toFixed(2);
}

// Run on load
window.onload = updateWallet;
</script>