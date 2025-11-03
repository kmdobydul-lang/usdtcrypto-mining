// Simple demo: save hashed passwords in localStorage (DEMO ONLY)
async function sha256(str){
  const buf=new TextEncoder().encode(str);
  const hash=await crypto.subtle.digest('SHA-256',buf);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
function saveUser(u,h){const users=JSON.parse(localStorage.getItem('users')||'{}');users[u]={passHash:h};localStorage.setItem('users',JSON.stringify(users))}
function getUser(u){return JSON.parse(localStorage.getItem('users')||'{}')[u]||null}

document.getElementById('signupBtn').onclick=async()=>{
  const u=document.getElementById('su-username').value.trim(); const p=document.getElementById('su-password').value;
  if(!u||!p)return alert('Enter username & password');
  const h=await sha256(p); saveUser(u,h); alert('Signed up (demo). Please login.'); 
};
document.getElementById('loginBtn').onclick=async()=>{
  const u=document.getElementById('li-username').value.trim(); const p=document.getElementById('li-password').value;
  if(!u||!p) return alert('Enter username & password');
  const user=getUser(u); const h=await sha256(p);
  if(!user || user.passHash!==h) return alert('Invalid credentials (demo)');
  localStorage.setItem('loggedInUser',u); showProfile(u);
};
function showProfile(u){
  document.getElementById('profileBox').classList.remove('hidden');
  document.getElementById('signupBox').classList.add('hidden');
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('showUser').innerText=u;
  const balances=JSON.parse(localStorage.getItem('balances')||'{}'); const b=balances[u]||0;
  document.getElementById('balance').innerText=b; document.getElementById('usd').innerText=(b*0.0001).toFixed(4);
}
window.onload=()=>{const cur=localStorage.getItem('loggedInUser'); if(cur) showProfile(cur);}

// withdraw
document.getElementById('openWithdraw').onclick=()=>document.getElementById('withdrawBox').classList.toggle('hidden');
document.getElementById('submitUid').onclick=()=>{
  const method=document.querySelector('input[name="method"]:checked').value;
  const uid=document.getElementById('uidInput').value.trim();
  const user=localStorage.getItem('loggedInUser');
  if(!user) return alert('Please login first.');
  if(!uid) return alert('Enter UID.');
  const reqs=JSON.parse(localStorage.getItem('withdraws')||'[]'); reqs.push({user,method,uid,time:new Date().toISOString()});
  localStorage.setItem('withdraws',JSON.stringify(reqs));
  document.getElementById('withdrawStatus').innerText='Withdraw request saved (demo).';
  document.getElementById('uidInput').value='';
}