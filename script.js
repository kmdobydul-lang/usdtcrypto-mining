let balance = 0;
let mining = false;
let seconds = 0;
let timer;

document.getElementById("start").onclick = function() {
  if (mining) return;
  mining = true;
  timer = setInterval(() => {
    seconds++;
    document.getElementById("timer").innerText = new Date(seconds * 1000).toISOString().substr(11, 8);
    if (seconds >= 10) { // demo 10 sec = 24h
      clearInterval(timer);
      balance += 1;
      document.getElementById("balance").innerText = balance;
      mining = false;
    }
  }, 1000);
};

document.getElementById("withdraw").onclick = function() {
  const uid = document.getElementById("uid").value;
  alert("Withdraw request sent for UID: " + uid);
};
