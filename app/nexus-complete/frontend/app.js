/* ===== NEXUS SOCIAL — app.js ===== */
/* Shared data layer using localStorage as the "database" */

const NexusApp = (() => {

  // ─── DB HELPERS ─────────────────────────────────────────────────────────────
  const db = {
    get: (key) => JSON.parse(localStorage.getItem('nexus_' + key) || 'null'),
    set: (key, val) => localStorage.setItem('nexus_' + key, JSON.stringify(val)),
  };

  // ─── SEED DATA ───────────────────────────────────────────────────────────────
  function seed() {
    if (db.get('seeded')) return;

    const users = [
      { id: 'u1', name: 'Alex Carter',    username: 'alex_creates', email: 'alex@demo.com',  password: 'demo1234', bio: 'UI/UX designer & creative coder 🎨', avatar: null, joinedAt: Date.now() - 86400000*60 },
      { id: 'u2', name: 'Sara Dev',       username: 'sara_dev',     email: 'sara@demo.com',  password: 'demo1234', bio: 'Full-stack developer | Open source enthusiast 💻', avatar: null, joinedAt: Date.now() - 86400000*45 },
      { id: 'u3', name: 'Mia Photos',     username: 'mia_photos',   email: 'mia@demo.com',   password: 'demo1234', bio: 'Photography is my language 🌅', avatar: null, joinedAt: Date.now() - 86400000*30 },
      { id: 'u4', name: 'Zaid Writes',    username: 'zaid_writes',  email: 'zaid@demo.com',  password: 'demo1234', bio: 'Words have power ✍️ | Tech blogger', avatar: null, joinedAt: Date.now() - 86400000*20 },
    ];

    const posts = [
      { id: 'p1', userId: 'u1', text: 'Just shipped my new design system 🚀 Three months of work, hundreds of components, and infinite coffee. Drop a ♥ if you love design systems!', image: null, likes: ['u2','u3','u4'], createdAt: Date.now() - 3600000*5 },
      { id: 'p2', userId: 'u2', text: 'Learning Rust today and wow... the borrow checker is both brutal and beautiful 😅\n\nDay 1: Confused\nDay 7: Still confused but differently', image: null, likes: ['u1','u3'], createdAt: Date.now() - 3600000*8 },
      { id: 'p3', userId: 'u3', text: 'Golden hour hits different when you\'re patient enough to wait for it 🌅\nSometimes the best shots come to those who wait.', image: null, likes: ['u1','u2','u4'], createdAt: Date.now() - 3600000*14 },
      { id: 'p4', userId: 'u4', text: 'Hot take: The best code is the code you don\'t write.\n\nEvery line is a liability. Simplicity is the ultimate sophistication. 🧠', image: null, likes: ['u2'], createdAt: Date.now() - 3600000*20 },
      { id: 'p5', userId: 'u1', text: 'Redesigned my portfolio from scratch. Clean, minimal, fast.\nGo check it out and let me know your thoughts! 💜\n\n#design #portfolio #webdev', image: null, likes: ['u2','u3'], createdAt: Date.now() - 86400000*2 },
    ];

    const comments = [
      { id: 'c1', postId: 'p1', userId: 'u2', text: 'This is incredible! The consistency is 🔥', createdAt: Date.now() - 3600000*4 },
      { id: 'c2', postId: 'p1', userId: 'u3', text: 'Please open source this! Would love to use it.', createdAt: Date.now() - 3600000*3 },
      { id: 'c3', postId: 'p2', userId: 'u1', text: 'Rust is worth the pain trust me! Keep going 💪', createdAt: Date.now() - 3600000*7 },
      { id: 'c4', postId: 'p3', userId: 'u4', text: 'This photo is absolutely stunning 😍', createdAt: Date.now() - 3600000*12 },
    ];

    // followers: { followerId: 'u1', followingId: 'u2' }
    const followers = [
      { followerId: 'u1', followingId: 'u2' },
      { followerId: 'u1', followingId: 'u3' },
      { followerId: 'u2', followingId: 'u1' },
      { followerId: 'u3', followingId: 'u1' },
      { followerId: 'u4', followingId: 'u1' },
      { followerId: 'u2', followingId: 'u4' },
    ];

    db.set('users', users);
    db.set('posts', posts);
    db.set('comments', comments);
    db.set('followers', followers);
    db.set('seeded', true);
  }

  seed();

  // ─── AUTH ────────────────────────────────────────────────────────────────────
  function getCurrentUser() {
    return db.get('currentUser');
  }

  function login(username, password) {
    const users = db.get('users') || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return { success: false, error: 'Invalid username or password.' };
    db.set('currentUser', user);
    return { success: true, user };
  }

  function register({ name, username, email, password, bio }) {
    const users = db.get('users') || [];
    if (users.find(u => u.username === username)) return { success: false, error: 'Username already taken.' };
    if (users.find(u => u.email === email)) return { success: false, error: 'Email already registered.' };
    const user = {
      id: 'u' + Date.now(),
      name, username, email, password, bio,
      avatar: null,
      joinedAt: Date.now()
    };
    users.push(user);
    db.set('users', users);
    db.set('currentUser', user);
    return { success: true, user };
  }

  function logout() {
    localStorage.removeItem('nexus_currentUser');
    window.location.href = 'index.html';
  }

  function requireAuth() {
    if (!getCurrentUser()) window.location.href = 'index.html';
  }

  // ─── USERS ───────────────────────────────────────────────────────────────────
  function getAllUsers() { return db.get('users') || []; }
  function getUserById(id) { return getAllUsers().find(u => u.id === id); }
  function getUserByUsername(username) { return getAllUsers().find(u => u.username === username); }

  function updateProfile(userId, updates) {
    const users = db.get('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return;
    Object.assign(users[idx], updates);
    db.set('users', users);
    const cu = getCurrentUser();
    if (cu && cu.id === userId) db.set('currentUser', users[idx]);
  }

  // ─── POSTS ───────────────────────────────────────────────────────────────────
  function getAllPosts() { return db.get('posts') || []; }

  function createPost({ userId, text, image }) {
    const posts = db.get('posts') || [];
    const post = { id: 'p' + Date.now(), userId, text, image: image || null, likes: [], createdAt: Date.now() };
    posts.unshift(post);
    db.set('posts', posts);
    return post;
  }

  function deletePost(postId, userId) {
    let posts = db.get('posts') || [];
    posts = posts.filter(p => !(p.id === postId && p.userId === userId));
    db.set('posts', posts);
  }

  function toggleLike(postId, userId) {
    const posts = db.get('posts') || [];
    const post = posts.find(p => p.id === postId);
    if (!post) return false;
    const idx = post.likes.indexOf(userId);
    if (idx === -1) post.likes.push(userId);
    else post.likes.splice(idx, 1);
    db.set('posts', posts);
    return idx === -1; // true = liked
  }

  function getPostsByUser(userId) {
    return getAllPosts().filter(p => p.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  }

  function getFeedPosts(userId) {
    const following = getFollowing(userId).map(f => f.id);
    following.push(userId);
    return getAllPosts()
      .filter(p => following.includes(p.userId))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // ─── COMMENTS ────────────────────────────────────────────────────────────────
  function getComments(postId) {
    return (db.get('comments') || []).filter(c => c.postId === postId).sort((a, b) => a.createdAt - b.createdAt);
  }

  function addComment(postId, userId, text) {
    const comments = db.get('comments') || [];
    const comment = { id: 'c' + Date.now(), postId, userId, text, createdAt: Date.now() };
    comments.push(comment);
    db.set('comments', comments);
    return comment;
  }

  // ─── FOLLOWERS ───────────────────────────────────────────────────────────────
  function getFollowers(userId) {
    const rows = db.get('followers') || [];
    return rows.filter(r => r.followingId === userId).map(r => getUserById(r.followerId)).filter(Boolean);
  }

  function getFollowing(userId) {
    const rows = db.get('followers') || [];
    return rows.filter(r => r.followerId === userId).map(r => getUserById(r.followingId)).filter(Boolean);
  }

  function isFollowing(followerId, followingId) {
    return (db.get('followers') || []).some(r => r.followerId === followerId && r.followingId === followingId);
  }

  function toggleFollow(followerId, followingId) {
    let rows = db.get('followers') || [];
    const exists = rows.some(r => r.followerId === followerId && r.followingId === followingId);
    if (exists) rows = rows.filter(r => !(r.followerId === followerId && r.followingId === followingId));
    else rows.push({ followerId, followingId });
    db.set('followers', rows);
    return !exists; // true = now following
  }

  // ─── UTILS ───────────────────────────────────────────────────────────────────
  function timeAgo(ts) {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm ago';
    if (h < 24) return h + 'h ago';
    if (d < 7) return d + 'd ago';
    return new Date(ts).toLocaleDateString();
  }

  function getAvatarHTML(user, cls = 'avatar-md') {
    const size = cls.includes('sm') ? '34px' : cls.includes('lg') ? '90px' : '48px';
    const fontSize = cls.includes('sm') ? '14px' : cls.includes('lg') ? '32px' : '18px';
    if (user.avatar) return `<img src="${user.avatar}" class="${cls} avatar-placeholder" alt="${user.name}" />`;
    return `<div class="avatar-placeholder ${cls}" style="width:${size};height:${size};font-size:${fontSize};">${user.name.charAt(0).toUpperCase()}</div>`;
  }

  function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  // ─── RENDER HELPERS ──────────────────────────────────────────────────────────
  function renderPostCard(post, currentUserId) {
    const author = getUserById(post.userId);
    if (!author) return '';
    const liked = post.likes.includes(currentUserId);
    const commentCount = getComments(post.id).length;
    const isOwn = post.userId === currentUserId;

    return `
    <div class="post-card" id="post-${post.id}">
      <div class="post-header">
        ${getAvatarHTML(author, 'avatar-md')}
        <div class="post-meta">
          <div class="post-username" onclick="window.location.href='profile.html?u=${author.username}'">${author.name} <span style="color:var(--text-muted);font-size:13px;">@${author.username}</span></div>
          <div class="post-time">${timeAgo(post.createdAt)}</div>
        </div>
        ${isOwn ? `<button class="btn btn-ghost btn-sm" onclick="deletePostUI('${post.id}')" title="Delete post">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:16px;height:16px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>` : ''}
      </div>
      <div class="post-body">
        <p class="post-text">${escapeHtml(post.text)}</p>
        ${post.image ? `<img src="${post.image}" class="post-image" alt="post image" />` : ''}
      </div>
      <div class="post-actions">
        <button class="action-btn ${liked ? 'liked' : ''}" onclick="toggleLikeUI('${post.id}')">
          <svg fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span id="likes-${post.id}">${post.likes.length}</span>
        </button>
        <button class="action-btn" onclick="toggleCommentsUI('${post.id}')">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span id="comments-count-${post.id}">${commentCount}</span>
        </button>
        <button class="action-btn" onclick="sharePost('${post.id}')">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Share
        </button>
      </div>
      <div class="comments-section" id="comments-${post.id}">
        <div id="comments-list-${post.id}"></div>
        <div class="comment-input-row">
          <input type="text" placeholder="Write a comment..." id="comment-input-${post.id}" onkeydown="if(event.key==='Enter')submitComment('${post.id}')" />
          <button class="comment-send-btn" onclick="submitComment('${post.id}')">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>`;
  }

  function renderComments(postId) {
    const comments = getComments(postId);
    const listEl = document.getElementById(`comments-list-${postId}`);
    if (!listEl) return;
    if (comments.length === 0) {
      listEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:10px 0;">No comments yet. Be first!</p>';
      return;
    }
    listEl.innerHTML = comments.map(c => {
      const u = getUserById(c.userId);
      if (!u) return '';
      return `<div class="comment-item">
        ${getAvatarHTML(u, 'avatar-sm')}
        <div class="comment-content">
          <div class="comment-username">${u.name} <span style="color:var(--text-muted);font-size:11px;">@${u.username} · ${timeAgo(c.createdAt)}</span></div>
          <div class="comment-text">${escapeHtml(c.text)}</div>
        </div>
      </div>`;
    }).join('');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>');
  }

  return {
    getCurrentUser, login, register, logout, requireAuth,
    getAllUsers, getUserById, getUserByUsername, updateProfile,
    getAllPosts, createPost, deletePost, toggleLike, getPostsByUser, getFeedPosts,
    getComments, addComment,
    getFollowers, getFollowing, isFollowing, toggleFollow,
    timeAgo, getAvatarHTML, showToast, renderPostCard, renderComments,
    escapeHtml, db
  };
})();

// ─── GLOBAL UI ACTIONS (called from HTML) ────────────────────────────────────

function toggleLikeUI(postId) {
  const user = NexusApp.getCurrentUser();
  if (!user) return;
  const liked = NexusApp.toggleLike(postId, user.id);
  const post = NexusApp.getAllPosts().find(p => p.id === postId);
  const btn = document.querySelector(`#post-${postId} .action-btn.liked`) ||
              document.querySelector(`#post-${postId} .action-btn`);
  const heartBtn = document.querySelector(`#post-${postId} .action-btn:first-child`);
  if (heartBtn) {
    heartBtn.classList.toggle('liked', liked);
    heartBtn.querySelector('svg').setAttribute('fill', liked ? 'currentColor' : 'none');
  }
  const likeCount = document.getElementById(`likes-${postId}`);
  if (likeCount && post) likeCount.textContent = post.likes.length;
}

function toggleCommentsUI(postId) {
  const section = document.getElementById(`comments-${postId}`);
  if (!section) return;
  section.classList.toggle('open');
  if (section.classList.contains('open')) NexusApp.renderComments(postId);
}

function submitComment(postId) {
  const user = NexusApp.getCurrentUser();
  const input = document.getElementById(`comment-input-${postId}`);
  if (!user || !input || !input.value.trim()) return;
  NexusApp.addComment(postId, user.id, input.value.trim());
  input.value = '';
  NexusApp.renderComments(postId);
  const countEl = document.getElementById(`comments-count-${postId}`);
  if (countEl) countEl.textContent = NexusApp.getComments(postId).length;
}

function deletePostUI(postId) {
  const user = NexusApp.getCurrentUser();
  if (!user) return;
  if (!confirm('Delete this post?')) return;
  NexusApp.deletePost(postId, user.id);
  const el = document.getElementById(`post-${postId}`);
  if (el) el.remove();
  NexusApp.showToast('Post deleted.', 'error');
}

function sharePost(postId) {
  const url = window.location.origin + window.location.pathname + `#post-${postId}`;
  navigator.clipboard?.writeText(url).then(() => NexusApp.showToast('Link copied!', 'success'));
}
