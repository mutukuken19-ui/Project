// Local storage-based mini-database with added features
let ads = JSON.parse(localStorage.getItem('ads')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let user = JSON.parse(localStorage.getItem('user')) || null;// Hash helper (SHA-256)


// Profile page
if(document.getElementById('profileInfo')){
const info=document.getElementById('profileInfo');
const u = user; if(!u){ location.href='login.html'; }
info.innerHTML = `<p><strong>Username:</strong> ${u.username}</p><p><strong>Admin:</strong> ${u.isAdmin? 'Yes':'No'}</p>`;
const userAds = ads.filter(a=>a.user===u.username);
const container = document.getElementById('userAds'); container.innerHTML=''; userAds.forEach(a=>{ container.innerHTML += `<div class='ad-box'><h3>${a.title}</h3><p>${a.desc}</p><button onclick='deleteOwnAd(${ads.indexOf(a)})'>Delete</button></div>`; });
const lb = document.getElementById('logoutBtn'); if(lb) lb.addEventListener('click', ()=>{ clearUser(); location.href='login.html'; });
}
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Add your logic here (e.g., send data to server, validate)
    alert(`Username: ${username}\nPassword: ${password}`);
});

function deleteOwnAd(i){ if(!confirm('Delete this ad?')) return; ads.splice(i,1); localStorage.setItem('ads', JSON.stringify(ads)); location.reload(); }


// Admin page
if(document.getElementById('admin-ads')){
if(!requireAdmin()) return;
const box=document.getElementById('admin-ads'); box.innerHTML=''; ads.forEach((a,i)=>{ box.innerHTML += `<div class='ad-box'><h3>${a.title}</h3><p class='muted'>Posted by ${a.user}</p><p>${a.desc}</p><div style='margin-top:8px'><button onclick='approveAd(${i})'>Approve (mark)</button> <button onclick='removeAd(${i})'>Delete</button></div></div>`; });
}
function approveAd(i){ ads[i].approved = true; localStorage.setItem('ads', JSON.stringify(ads)); alert('Marked approved'); }
function removeAd(i){ if(!confirm('Delete?')) return; ads.splice(i,1); localStorage.setItem('ads', JSON.stringify(ads)); location.reload(); }


// Analytics
if(document.getElementById('analyticsSummary')){
const el=document.getElementById('analyticsSummary');
const totalAds = ads.length;
const totalUsers = users.length;
const byCategory = {};
ads.forEach(a=> byCategory[a.category] = (byCategory[a.category]||0)+1);
let html = `<p>Total users: <strong>${totalUsers}</strong></p><p>Total ads: <strong>${totalAds}</strong></p><h4>By category</h4><ul>`;
for(const k in byCategory) html += `<li>${k}: ${byCategory[k]}</li>`;
html += '</ul>';
el.innerHTML = html;
}


// Logout buttons
const lb = document.getElementById('logoutBtn'); if(lb) lb.addEventListener('click', ()=>{ clearUser(); location.href='login.html'; });
const lb2 = document.getElementById('logoutBtn2'); if(lb2) lb2.addEventListener('click', ()=>{ clearUser(); location.href='login.html'; });


// Init: if logged in, ensure user object pulled from storage is up-to-date

(function(){ const raw = localStorage.getItem('user'); if(raw) user = JSON.parse(raw); if(!users.length) { const stored = localStorage.getItem('users'); if(stored) users = JSON.parse(stored); } updateAuthLink(); })();

document.body.classList.toggle('dark');
