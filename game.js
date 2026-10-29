/**
 * ====================================================================
 * ESCAPE THE HACKER'S NETWORK - CORE ENGINE & SCENARIOS
 * Target Platform: Universal Windows 1920x1080 (Full HD 16:9 Standard)
 * ====================================================================
 */

// ==================== AUDIO SYNTHESIZER (WEB AUDIO API) ====================
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientOsc = null;
    this.ambientGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  playClick() {
    this.playTone(880, 'sine', 0.08, 0.12);
  }

  playHover() {
    this.playTone(440, 'triangle', 0.05, 0.04);
  }

  playTerminalBoot() {
    if (!this.enabled) return;
    this.init();
    const notes = [220, 330, 440, 660, 880];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'sawtooth', 0.1, 0.08), i * 60);
    });
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    chords.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'triangle', 0.25, 0.15), i * 90);
    });
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    this.playTone(150, 'sawtooth', 0.25, 0.2);
    setTimeout(() => this.playTone(110, 'sawtooth', 0.35, 0.2), 120);
  }

  playAlarm() {
    if (!this.enabled) return;
    this.init();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.playTone(800, 'square', 0.1, 0.15), i * 150);
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sounds = new SoundManager();

// ==================== EMAIL DATASET (LEVEL 1: PHISHING DETECTIVE) ====================
const PHISHING_EMAILS = [
  {
    id: 1,
    title: "Account Verification Required",
    from: "support@amaz2n-secority.com",
    to: "security-ops@organization.internal",
    subject: "URGENT: Your Corporate AWS Account has been suspended",
    date: "Today, 09:42 AM",
    isPhishing: true,
    securityTag: "SUSPICIOUS DOMAIN",
    body: `
      <p>Dear System Administrator,</p>
      <p>We detected unauthorized sign-in attempts to your cloud workspace from IP address <code>185.220.101.5</code> (St. Petersburg, RU).</p>
      <p style="color: #ff5252; font-weight: bold;">Immediate action required: Your account credentials will be permanently deactivated in 24 hours unless you confirm your identity.</p>
      <p>Please re-authenticate your administrative credentials immediately:</p>
      <p style="margin: 20px 0;">
        <a class="inspectable-link" data-url="http://192.168.1.105/amaz2n-credential-stealer.php">▶ Click Here to Verify Your Amazon Account Credentials</a>
      </p>
      <p>Security Response Team<br>Cloud Infrastructure Services</p>
    `,
    rawHeaders: `Received: from mail.amaz2n-secority.com (192.168.1.105)
Sender: support@amaz2n-secority.com
DKIM-Signature: FAIL (domain key mismatch)
SPF: SoftFail (domain amaz2n-secority.com does not match authorized IP)
X-Priority: 1 (Urgent)
Subject: URGENT: Your Corporate AWS Account has been suspended`,
    explanation: "This is a classic Phishing attack! The sender uses typo-squatting ('amaz2n-secority.com' instead of 'amazon.com'), false urgency ('deactivated in 24 hours'), and the link points to a rogue IP address (192.168.1.105).",
    cyberTip: "Always scrutinize the sender domain and never click unverified verification links under pressure."
  },
  {
    id: 2,
    title: "Free $500 Gift Card Claim",
    from: "rewards@win-exclusive-voucher.xyz",
    to: "security-ops@organization.internal",
    subject: "CONGRATULATIONS: You've Won a $500 Gift Voucher!",
    date: "Today, 08:15 AM",
    isPhishing: true,
    securityTag: "MALICIOUS LURE",
    body: `
      <p>Valued Employee,</p>
      <p>As part of our Employee Appreciation Rewards Program, your email address was randomly selected to receive a complimentary <strong>$500 Shopping Voucher</strong>!</p>
      <p>Only 3 gift vouchers remain today! Claim your promotional code now:</p>
      <p style="margin: 20px 0;">
        <a class="inspectable-link" data-url="http://malicious-redirect-domain.xyz/dropper.exe">🎁 Claim Your $500 Gift Card Code Now</a>
      </p>
      <p>Terms and conditions apply. Promotion expires within 30 minutes.</p>
    `,
    rawHeaders: `Received: from relay-88.win-exclusive-voucher.xyz (45.33.32.156)
Sender: rewards@win-exclusive-voucher.xyz
DKIM-Signature: NONE
SPF: Fail
Subject: CONGRATULATIONS: You've Won a $500 Gift Voucher!`,
    explanation: "This is a classic 'Too Good to be True' phishing lure. It uses free prizes to bait curiosity, but hovering over the link reveals an executable payload ('dropper.exe') disguised as a website!",
    cyberTip: "Legitimate companies never distribute software executables (.exe) as gift card links."
  },
  {
    id: 3,
    title: "Meeting Reminder: Q3 Review",
    from: "calendar@university.edu",
    to: "security-ops@organization.internal",
    subject: "Reminder: Cybersecurity Curriculum Review Meeting @ 2:00 PM",
    date: "Today, 07:30 AM",
    isPhishing: false,
    securityTag: "VERIFIED SOURCE",
    body: `
      <p>Hello Team,</p>
      <p>This is a friendly reminder for today's scheduled Project-Based Learning (PBL) review with the evaluation panel at 2:00 PM in Conference Room B.</p>
      <p>You can review the meeting agenda and submitted documentation in the official academic portal:</p>
      <p style="margin: 20px 0;">
        <a class="inspectable-link" data-url="https://portal.university.edu/calendar/event-492">📅 Open Academic Calendar: PBL Project Review</a>
      </p>
      <p>Best regards,<br>Department Academic Office</p>
    `,
    rawHeaders: `Received: from mail.university.edu (140.211.9.88)
Sender: calendar@university.edu
DKIM-Signature: PASS (domain university.edu verified)
SPF: Pass (140.211.9.88 is authorized by university.edu)
Subject: Reminder: Cybersecurity Curriculum Review Meeting @ 2:00 PM`,
    explanation: "This is a LEGITIMATE email. The sender is from the verified institutional domain ('university.edu'), the SPF/DKIM headers pass authentication, and the link leads safely to the HTTPS portal.",
    cyberTip: "When headers pass SPF/DKIM authentication and the link matches the legitimate corporate/academic domain, the email is safe."
  },
  {
    id: 4,
    title: "URGENT: Outstanding Invoice",
    from: "billing@paypa1-support.net",
    to: "security-ops@organization.internal",
    subject: "OVERDUE NOTICE: Invoice #INV-98231 Pending Legal Action",
    date: "Yesterday, 11:20 PM",
    isPhishing: true,
    securityTag: "TYPOSQUAT ATTACK",
    body: `
      <p>ATTENTION:</p>
      <p>Your payment of <strong>$1,420.00 USD</strong> for Order #INV-98231 has failed to process. If this invoice is not settled immediately, your account will be reported to legal authorities.</p>
      <p>If you believe this charge is in error, download your itemized dispute documentation below:</p>
      <p style="margin: 20px 0;">
        <a class="inspectable-link" data-url="http://payload-host.ru/Invoice_98231.pdf.exe">📄 Download Overdue_Invoice_98231.pdf</a>
      </p>
      <p>Financial Compliance Department</p>
    `,
    rawHeaders: `Received: from outbound.paypa1-support.net (194.67.112.55)
Sender: billing@paypa1-support.net
DKIM: Fail
SPF: Fail
Subject: OVERDUE NOTICE: Invoice #INV-98231 Pending Legal Action`,
    explanation: "Dangerous spear-phishing attack! Notice the typo in the sender ('paypa1' with a number 1) and the dangerous double extension link ('Invoice_98231.pdf.exe') which tricks users into launching a Trojan!",
    cyberTip: "Never download or open attachments that end in .exe, .scr, or have disguised double extensions."
  },
  {
    id: 5,
    title: "Git Repository Access Granted",
    from: "notifications@github-enterprise.internal",
    to: "security-ops@organization.internal",
    subject: "You've been invited to collaborate on 'EscapeTheHackersNetwork'",
    date: "Yesterday, 04:10 PM",
    isPhishing: false,
    securityTag: "VERIFIED INTERNAL",
    body: `
      <p>Hi Detective,</p>
      <p>Project Lead Sarah has invited you to collaborate on the <strong>EscapeTheHackersNetwork</strong> Unity 6 2D codebase.</p>
      <p>You have been assigned read and write permissions to the repository. View the repository overview here:</p>
      <p style="margin: 20px 0;">
        <a class="inspectable-link" data-url="https://github-enterprise.internal/defense/EscapeTheHackersNetwork">📂 View Repository & Clone Codebase</a>
      </p>
      <p>System Security Notification</p>
    `,
    rawHeaders: `Received: from git-int.github-enterprise.internal (10.0.1.25)
Sender: notifications@github-enterprise.internal
DKIM: PASS
SPF: Pass
Subject: You've been invited to collaborate on 'EscapeTheHackersNetwork'`,
    explanation: "This is a LEGITIMATE internal communication. It originates from the organization's internal domain (.internal) and matches the team's ongoing development workflow.",
    cyberTip: "Familiarity with regular team collaboration workflows helps differentiate valid notifications from fake invitations."
  }
];

// ==================== GAME CORE STATE ====================
class GameEngine {
  constructor() {
    this.score = 0;
    this.timerSeconds = 300; // 5 minutes
    this.timerInterval = null;
    this.currentScreen = 'main-menu';

    // Minigame states
    this.selectedEmailIndex = 0;
    this.solvedEmails = {}; // { id: { correct: bool } }
    this.level1Completed = false;
    this.level2Completed = false;

    // Canvas & Player
    this.canvas = document.getElementById('room-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.player = {
      x: 960,
      y: 650,
      width: 48,
      height: 72,
      speed: 6.5,
      vx: 0,
      vy: 0,
      facing: 'down',
      isMoving: false,
      stepAnimTimer: 0
    };

    // Environment Interactive Objects
    this.terminalObj = { x: 960, y: 440, radius: 110 };
    this.doorObj = { x: 1480, y: 280, radius: 120 };

    // Keys pressed
    this.keys = {};

    // Images
    this.images = {};
    this.imagesLoaded = false;

    // Viewport scaling
    this.scale = 1;
  }

  init() {
    this.setupResizeListener();
    this.setupInputListeners();
    this.loadAssets();
    this.renderEmailList();
    this.setupUIEventListeners();
  }

  // Responsive Scaling for 1920x1080 Viewport
  setupResizeListener() {
    const resize = () => {
      const vp = document.getElementById('game-viewport');
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.scale = Math.min(w / 1920, h / 1080);
      vp.style.transform = `scale(${this.scale})`;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  loadAssets() {
    const assetsToLoad = {
      roomBg: 'assets/hd/Backgrounds_1080p/CyberRoom_Scene_1080p.png',
      playerSprite: 'assets/hd/Sprites/player_idle_sharp.png',
      terminal: 'assets/unity_sprites/InteractiveObjects/Terminal_Laptop.png',
      doorLocked: 'assets/unity_sprites/InteractiveObjects/Security_Door_Locked.png',
      keycard: 'assets/unity_sprites/InteractiveObjects/Access_Keycard.png'
    };

    let loadedCount = 0;
    const total = Object.keys(assetsToLoad).length;

    for (let key in assetsToLoad) {
      this.images[key] = new Image();
      this.images[key].src = assetsToLoad[key];
      this.images[key].onload = () => {
        loadedCount++;
        if (loadedCount >= total) {
          this.imagesLoaded = true;
          this.startRoomLoop();
        }
      };
      this.images[key].onerror = () => {
        console.warn(`Failed loading image: ${assetsToLoad[key]}, using procedural fallback`);
        loadedCount++;
        if (loadedCount >= total) {
          this.imagesLoaded = true;
          this.startRoomLoop();
        }
      };
    }
  }

  setupInputListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;

      // Interaction Key E
      if ((e.key === 'e' || e.key === 'E') && this.currentScreen === 'room') {
        this.handleInteraction();
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
    });
  }

  // ==================== SCREEN SWITCHING ====================
  switchScreen(screenName) {
    this.currentScreen = screenName;
    document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));

    if (screenName === 'main-menu') {
      document.getElementById('screen-main-menu').classList.add('active');
      this.stopTimer();
    } else if (screenName === 'room') {
      document.getElementById('screen-room').classList.add('active');
      this.startTimer();
      sounds.playTerminalBoot();
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        this.updateHUDTimer();
      } else {
        clearInterval(this.timerInterval);
        sounds.playAlarm();
        this.setAIRIDialogue("TIME'S UP! ZERO has locked down the network. Restarting the mission...", true);
        setTimeout(() => this.resetGame(), 3000);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  updateHUDTimer() {
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const el = document.getElementById('hud-timer');
    if (el) el.textContent = str;
  }

  addScore(pts) {
    this.score = Math.max(0, this.score + pts);
    const el = document.getElementById('hud-score');
    if (el) el.textContent = String(this.score).padStart(4, '0');
  }

  setAIRIDialogue(text, isAlert = false) {
    const el = document.getElementById('airi-dialogue-text');
    if (!el) return;

    el.innerHTML = '';
    let index = 0;
    const fullText = `"${text}"`;

    if (isAlert) {
      el.style.color = '#ff5252';
    } else {
      el.style.color = '#ffffff';
    }

    const typeWriter = () => {
      if (index < fullText.length) {
        el.textContent += fullText.charAt(index);
        index++;
        setTimeout(typeWriter, 18);
      }
    };
    typeWriter();
  }

  // ==================== SCENARIO 2: 2D ROOM EXPLORATION ====================
  startRoomLoop() {
    const loop = () => {
      if (this.currentScreen === 'room') {
        this.updatePlayerMovement();
        this.renderRoom();
        this.checkProximities();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  updatePlayerMovement() {
    // Only allow movement if no modal is active
    const isModalOpen = !document.getElementById('modal-phishing').classList.contains('hidden') ||
                        !document.getElementById('modal-password').classList.contains('hidden') ||
                        !document.getElementById('modal-reward').classList.contains('hidden') ||
                        !document.getElementById('modal-briefing').classList.contains('hidden');

    if (isModalOpen) return;

    let dx = 0;
    let dy = 0;

    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    // Normalizing diagonal speed
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.player.isMoving = (dx !== 0 || dy !== 0);

    if (dx < 0) this.player.facing = 'left';
    else if (dx > 0) this.player.facing = 'right';
    else if (dy < 0) this.player.facing = 'up';
    else if (dy > 0) this.player.facing = 'down';

    this.player.x += dx * this.player.speed;
    this.player.y += dy * this.player.speed;

    // Bounds checking (inside room)
    const minX = 180;
    const maxX = 1740;
    const minY = 320;
    const maxY = 900;

    this.player.x = Math.max(minX, Math.min(maxX, this.player.x));
    this.player.y = Math.max(minY, Math.min(maxY, this.player.y));

    // Collision with central terminal desk (x: 820..1100, y: 350..470)
    if (this.player.x > 820 && this.player.x < 1100 && this.player.y > 350 && this.player.y < 470) {
      if (dy > 0) this.player.y = 350;
      else if (dy < 0) this.player.y = 470;
      else if (dx > 0) this.player.x = 820;
      else if (dx < 0) this.player.x = 1100;
    }

    if (this.player.isMoving) {
      this.player.stepAnimTimer += 0.2;
    }
  }

  renderRoom() {
    this.ctx.clearRect(0, 0, 1920, 1080);

    // 1. Draw Background
    if (this.images.roomBg && this.images.roomBg.complete) {
      this.ctx.drawImage(this.images.roomBg, 0, 0, 1920, 1080);
    } else {
      // Procedural Cyber Command Hub fallback
      this.ctx.fillStyle = '#060d1a';
      this.ctx.fillRect(0, 0, 1920, 1080);

      // Floor grid
      this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
      this.ctx.lineWidth = 1;
      for (let x = 0; x < 1920; x += 60) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 260);
        this.ctx.lineTo(x, 1080);
        this.ctx.stroke();
      }
      for (let y = 260; y < 1080; y += 60) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(1920, y);
        this.ctx.stroke();
      }
    }

    // 2. Pulsing Glow around Interactive Terminal Desk
    const tDist = Math.hypot(this.player.x - this.terminalObj.x, this.player.y - this.terminalObj.y);
    const pulseAlpha = 0.3 + 0.2 * Math.sin(Date.now() / 250);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.terminalObj.x, this.terminalObj.y, 90, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(0, 229, 255, ${pulseAlpha * 0.4})`;
    this.ctx.fill();
    this.ctx.strokeStyle = `rgba(0, 229, 255, ${pulseAlpha})`;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.restore();

    // 3. Security Door Indicator (Top Right)
    this.ctx.save();
    const doorColor = this.level1Completed ? '#00e676' : '#ff1744';
    this.ctx.beginPath();
    this.ctx.arc(this.doorObj.x, this.doorObj.y, 80, 0, Math.PI * 2);
    this.ctx.strokeStyle = doorColor;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.restore();

    // 4. Draw Player Character
    this.renderPlayerSprite();
  }

  renderPlayerSprite() {
    const p = this.player;

    this.ctx.save();

    // Player Shadow
    this.ctx.beginPath();
    this.ctx.ellipse(p.x, p.y + p.height / 2 - 2, 22, 9, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    this.ctx.fill();

    // Draw sprite or procedural anime boy
    if (this.images.playerSprite && this.images.playerSprite.complete) {
      // Bobbing walking animation
      const bob = p.isMoving ? Math.sin(p.stepAnimTimer) * 3 : 0;

      this.ctx.translate(p.x, p.y + bob);
      if (p.facing === 'left') {
        this.ctx.scale(-1, 1);
      }
      this.ctx.drawImage(
        this.images.playerSprite,
        -p.width / 2,
        -p.height / 2,
        p.width,
        p.height
      );
    } else {
      // Procedural pixel detective
      this.ctx.fillStyle = '#1e88e5';
      this.ctx.fillRect(p.x - 16, p.y - 20, 32, 40);
      this.ctx.fillStyle = '#ffcc80';
      this.ctx.fillRect(p.x - 12, p.y - 36, 24, 18);
    }

    this.ctx.restore();
  }

  checkProximities() {
    const promptEl = document.getElementById('interaction-prompt');
    const doorPromptEl = document.getElementById('door-prompt');

    // Terminal proximity
    const dTerminal = Math.hypot(this.player.x - this.terminalObj.x, this.player.y - this.terminalObj.y);
    if (dTerminal < this.terminalObj.radius) {
      promptEl.classList.remove('hidden');
      promptEl.style.left = `${this.terminalObj.x}px`;
      promptEl.style.top = `${this.terminalObj.y - 60}px`;
    } else {
      promptEl.classList.add('hidden');
    }

    // Door proximity
    const dDoor = Math.hypot(this.player.x - this.doorObj.x, this.player.y - this.doorObj.y);
    if (dDoor < this.doorObj.radius) {
      doorPromptEl.classList.remove('hidden');
      doorPromptEl.style.left = `${this.doorObj.x}px`;
      doorPromptEl.style.top = `${this.doorObj.y - 60}px`;

      if (this.level1Completed) {
        doorPromptEl.classList.remove('red-prompt');
        doorPromptEl.innerHTML = `<div class="prompt-icon">E</div><div class="prompt-text">PRESS <span class="key-highlight">[E]</span> TO ACCESS LEVEL 2 (PASSWORD FORTRESS)</div>`;
      } else {
        doorPromptEl.classList.add('red-prompt');
        doorPromptEl.innerHTML = `<div class="prompt-icon">🔒</div><div class="prompt-text">FIREWALL LOCKED: Complete Level 1 at terminal first!</div>`;
      }
    } else {
      doorPromptEl.classList.add('hidden');
    }
  }

  handleInteraction() {
    const dTerminal = Math.hypot(this.player.x - this.terminalObj.x, this.player.y - this.terminalObj.y);
    const dDoor = Math.hypot(this.player.x - this.doorObj.x, this.player.y - this.doorObj.y);

    if (dTerminal < this.terminalObj.radius) {
      sounds.playClick();
      this.openPhishingModal();
    } else if (dDoor < this.doorObj.radius) {
      if (this.level1Completed) {
        sounds.playClick();
        this.openPasswordModal();
      } else {
        sounds.playError();
        this.setAIRIDialogue("That security door requires Level 2 clearance. Investigate the phishing emails on the central terminal first!", true);
      }
    }
  }

  closeAllModals() {
    document.querySelectorAll('.cyber-modal').forEach(m => m.classList.add('hidden'));
  }

  // ==================== SCENARIO 3: PHISHING DETECTIVE ====================
  openPhishingModal() {
    document.getElementById('modal-phishing').classList.remove('hidden');
    this.displayEmail(this.selectedEmailIndex);
    this.setAIRIDialogue("Carefully inspect each email's sender address and hover over any hyperlinks before making a decision. We need at least 4 out of 5 correct!");
  }

  renderEmailList() {
    const listEl = document.getElementById('email-list');
    listEl.innerHTML = '';

    PHISHING_EMAILS.forEach((email, idx) => {
      const li = document.createElement('li');
      li.className = `email-item ${idx === this.selectedEmailIndex ? 'active' : ''}`;
      if (this.solvedEmails[email.id]) {
        li.classList.add(this.solvedEmails[email.id].correct ? 'solved-correct' : 'solved-wrong');
      }

      li.innerHTML = `
        <div class="email-item-header">
          <span>EMAIL #${idx + 1}</span>
          <span>${email.date}</span>
        </div>
        <div class="email-item-sender">${email.from}</div>
        <div class="email-item-subject">${email.subject}</div>
      `;

      li.addEventListener('click', () => {
        sounds.playClick();
        this.selectedEmailIndex = idx;
        this.renderEmailList();
        this.displayEmail(idx);
      });

      listEl.appendChild(li);
    });

    this.updatePhishingProgress();
  }

  displayEmail(index) {
    const email = PHISHING_EMAILS[index];
    if (!email) return;

    document.getElementById('email-from').textContent = email.from;
    document.getElementById('email-subject').textContent = email.subject;
    document.getElementById('email-date').textContent = email.date;

    const tagEl = document.getElementById('email-security-tag');
    tagEl.textContent = email.securityTag;
    if (!email.isPhishing) {
      tagEl.classList.add('verified');
    } else {
      tagEl.classList.remove('verified');
    }

    const bodyEl = document.getElementById('email-body-content');
    bodyEl.innerHTML = email.body;

    // Hook hover inspector on links
    const inspectorText = document.getElementById('inspected-url');
    bodyEl.querySelectorAll('.inspectable-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        sounds.playHover();
        const targetUrl = link.getAttribute('data-url');
        inspectorText.textContent = `🎯 TARGET DESTINATION: ${targetUrl}`;
        inspectorText.style.color = targetUrl.includes('.exe') || targetUrl.includes('192.168.') ? '#ff1744' : '#00e676';
      });
      link.addEventListener('mouseleave', () => {
        inspectorText.textContent = '[Hover over any link above to inspect actual target URL]';
        inspectorText.style.color = '#ffd600';
      });
      link.addEventListener('click', (e) => {
        e.preventDefault();
        sounds.playAlarm();
        alert(`SECURITY WARNING: Unverified link blocked by AIRI Sentinel.\nTarget: ${link.getAttribute('data-url')}`);
      });
    });

    // Disable action buttons if already answered
    const isAnswered = !!this.solvedEmails[email.id];
    document.getElementById('btn-report-phishing').disabled = isAnswered;
    document.getElementById('btn-mark-safe').disabled = isAnswered;
  }

  evaluateEmailDecision(reportedAsPhishing) {
    const email = PHISHING_EMAILS[this.selectedEmailIndex];
    const isCorrect = (reportedAsPhishing && email.isPhishing) || (!reportedAsPhishing && !email.isPhishing);

    this.solvedEmails[email.id] = { correct: isCorrect };

    if (isCorrect) {
      sounds.playSuccess();
      this.addScore(250);
    } else {
      sounds.playError();
      this.addScore(-50);
    }

    this.showEmailFeedback(isCorrect, email);
    this.renderEmailList();
  }

  showEmailFeedback(isCorrect, email) {
    const overlay = document.getElementById('email-feedback-overlay');
    const icon = document.getElementById('feedback-icon');
    const title = document.getElementById('feedback-title');
    const scoreDiff = document.getElementById('feedback-score-diff');
    const expl = document.getElementById('feedback-explanation');
    const tip = document.getElementById('feedback-cyber-tip');

    overlay.classList.remove('hidden');

    if (isCorrect) {
      icon.className = 'feedback-icon correct';
      icon.textContent = '✓';
      title.textContent = 'CORRECT IDENTIFICATION!';
      title.style.color = '#00e676';
      scoreDiff.className = 'feedback-score-tag plus';
      scoreDiff.textContent = '+250 POINTS AWARDED';
    } else {
      icon.className = 'feedback-icon wrong';
      icon.textContent = '✕';
      title.textContent = 'SECURITY BREACH DETECTED!';
      title.style.color = '#ff1744';
      scoreDiff.className = 'feedback-score-tag minus';
      scoreDiff.textContent = '-50 PENALTY';
    }

    expl.textContent = email.explanation;
    tip.textContent = email.cyberTip;
  }

  updatePhishingProgress() {
    const solvedCount = Object.keys(this.solvedEmails).length;
    const correctCount = Object.values(this.solvedEmails).filter(v => v.correct).length;

    document.getElementById('phishing-progress-text').textContent = `${solvedCount}/5 Solved (${correctCount} Correct)`;
    document.getElementById('phishing-progress-fill').style.width = `${(solvedCount / 5) * 100}%`;

    // Check level completion
    if (solvedCount === 5) {
      if (correctCount >= 4) {
        this.level1Completed = true;
        document.getElementById('hud-objective-text').textContent = "Level 1 Cleared! Walk to Security Door (Top Right) to unlock Level 2";
        this.setAIRIDialogue("Superb work! You scored " + correctCount + "/5 on phishing defense. The security door is now unlocked! Head over and press [E].");
      } else {
        this.setAIRIDialogue("You only got " + correctCount + "/5 correct. A security analyst needs at least 4/5! Review the emails and try again.", true);
      }
    }
  }

  // ==================== SCENARIO 4: PASSWORD FORTRESS ====================
  openPasswordModal() {
    document.getElementById('modal-password').classList.remove('hidden');
    this.setAIRIDialogue("ZERO is attempting a dictionary brute-force attack! Enter a fortress-grade passphrase with high entropy to lock him out.");
  }

  evaluatePassword(pwd) {
    // 5 criteria checks
    const hasLen = pwd.length >= 10;
    const hasUpperLower = /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    const commonBlacklist = ['password', '123456', 'qwerty', 'admin', 'rahul', 'welcome', 'login'];
    const lower = pwd.toLowerCase();
    const isCommon = commonBlacklist.some(w => lower.includes(w));

    // Update rule UI checklist
    this.updateRuleUI('rule-length', hasLen);
    this.updateRuleUI('rule-upper-lower', hasUpperLower);
    this.updateRuleUI('rule-number', hasNumber);
    this.updateRuleUI('rule-symbol', hasSymbol);
    this.updateRuleUI('rule-common-word', !isCommon && pwd.length > 0);

    // Calculate score 0 to 5
    let tier = 0;
    if (pwd.length > 0) tier = 1;
    if (hasLen) tier++;
    if (hasUpperLower && hasNumber) tier++;
    if (hasSymbol) tier++;
    if (!isCommon && pwd.length >= 14) tier++;

    tier = Math.min(5, tier);

    // Calculate simulated entropy
    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (hasSymbol) poolSize += 32;

    const entropy = poolSize > 0 ? Math.round(pwd.length * Math.log2(poolSize)) : 0;
    document.getElementById('entropy-bits').textContent = entropy;

    // Update 5-bar meter
    for (let i = 1; i <= 5; i++) {
      const seg = document.getElementById(`meter-bar-${i}`);
      seg.className = 'meter-segment';
      if (i <= tier) {
        seg.classList.add(`active-${tier}`);
      }
    }

    // Tier Label & Crack Time
    const tierLabels = [
      { text: "ENTER PASSWORD", color: "tier-0", time: "INSTANT (0.0001 SEC)", timeColor: "text-red" },
      { text: "VERY WEAK", color: "tier-1", time: "0.002 SECONDS", timeColor: "text-red" },
      { text: "WEAK", color: "tier-2", time: "14 MINUTES", timeColor: "text-red" },
      { text: "MEDIUM", color: "tier-3", time: "3 MONTHS", timeColor: "text-yellow" },
      { text: "STRONG", color: "tier-4", time: "850 YEARS", timeColor: "text-green" },
      { text: "FORTRESS GRADE", color: "tier-5", time: "42 MILLION CENTURIES", timeColor: "text-cyan" }
    ];

    const currentTierData = tierLabels[tier];
    const lbl = document.getElementById('strength-label');
    lbl.className = `tier-tag ${currentTierData.color}`;
    lbl.textContent = currentTierData.text;

    const crackEl = document.getElementById('crack-time-value');
    crackEl.textContent = currentTierData.time;
    crackEl.className = `crack-time-display ${currentTierData.timeColor}`;

    // Enable button only if tier >= 4
    const deployBtn = document.getElementById('btn-deploy-password');
    deployBtn.disabled = (tier < 4);
    if (tier >= 4) {
      deployBtn.textContent = "🔒 ACTIVATE FIREWALL FORTRESS ▶";
    } else {
      deployBtn.textContent = "🔒 DEPLOY FIREWALL PASSWORD (REACH STRONG / FORTRESS)";
    }
  }

  updateRuleUI(id, isValid) {
    const el = document.getElementById(id);
    if (!el) return;
    if (isValid) {
      el.className = 'rule-item valid';
      el.querySelector('.rule-icon').textContent = '✓';
    } else {
      el.className = 'rule-item invalid';
      el.querySelector('.rule-icon').textContent = '✕';
    }
  }

  // ==================== SCENARIO 5: VICTORY & REWARD ====================
  triggerVictory() {
    this.closeAllModals();
    this.level2Completed = true;
    sounds.playSuccess();
    this.addScore(500);

    const rewardModal = document.getElementById('modal-reward');
    rewardModal.classList.remove('hidden');

    const correctCount = Object.values(this.solvedEmails).filter(v => v.correct).length;
    document.getElementById('final-score').textContent = `${this.score} PTS`;
    document.getElementById('final-accuracy').textContent = `${Math.round((correctCount / 5) * 100)}% (${correctCount}/5 Emails Intercepted)`;
  }

  resetGame() {
    this.score = 0;
    this.timerSeconds = 300;
    this.solvedEmails = {};
    this.selectedEmailIndex = 0;
    this.level1Completed = false;
    this.level2Completed = false;
    this.player.x = 960;
    this.player.y = 650;

    this.closeAllModals();
    this.updateHUDTimer();
    this.addScore(0);
    this.renderEmailList();
    document.getElementById('hud-objective-text').textContent = "Investigate compromised email terminal (Press E near terminal)";
    this.switchScreen('main-menu');
  }

  // ==================== EVENT LISTENERS WIRING ====================
  setupUIEventListeners() {
    // Menu buttons
    document.getElementById('btn-start-game').addEventListener('click', () => {
      sounds.playClick();
      this.switchScreen('room');
    });

    document.getElementById('btn-mission-brief').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('modal-briefing').classList.remove('hidden');
    });

    document.getElementById('btn-how-to-play').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('modal-briefing').classList.remove('hidden');
    });

    document.getElementById('btn-close-briefing').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('modal-briefing').classList.add('hidden');
    });

    document.getElementById('btn-start-from-brief').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('modal-briefing').classList.add('hidden');
      this.switchScreen('room');
    });

    document.getElementById('btn-sound-toggle').addEventListener('click', (e) => {
      const on = sounds.toggleSound();
      e.target.closest('.cyber-btn').querySelector('.btn-text').textContent = on ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF';
    });

    document.getElementById('btn-hud-audio').addEventListener('click', () => {
      const on = sounds.toggleSound();
      document.getElementById('btn-hud-audio').textContent = on ? '🔊' : '🔇';
    });

    document.getElementById('btn-hud-menu').addEventListener('click', () => {
      sounds.playClick();
      this.switchScreen('main-menu');
    });

    document.getElementById('btn-fullscreen-toggle').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen();
      }
    });

    // Phishing Minigame Buttons
    document.getElementById('btn-close-phishing').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('modal-phishing').classList.add('hidden');
    });

    document.getElementById('btn-report-phishing').addEventListener('click', () => {
      this.evaluateEmailDecision(true);
    });

    document.getElementById('btn-mark-safe').addEventListener('click', () => {
      this.evaluateEmailDecision(false);
    });

    document.getElementById('btn-feedback-next').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('email-feedback-overlay').classList.add('hidden');

      // Advance to next unsolved email
      let nextUnsolved = PHISHING_EMAILS.findIndex((e, i) => !this.solvedEmails[e.id]);
      if (nextUnsolved !== -1) {
        this.selectedEmailIndex = nextUnsolved;
        this.renderEmailList();
        this.displayEmail(this.selectedEmailIndex);
      } else {
        // All 5 answered
        if (this.level1Completed) {
          document.getElementById('modal-phishing').classList.add('hidden');
        }
      }
    });

    document.getElementById('btn-inspect-headers').addEventListener('click', () => {
      sounds.playClick();
      const email = PHISHING_EMAILS[this.selectedEmailIndex];
      document.getElementById('raw-header-content').textContent = email.rawHeaders;
      document.getElementById('modal-headers').classList.remove('hidden');
    });

    document.getElementById('btn-close-headers').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('modal-headers').classList.add('hidden');
    });

    // Password Fortress Input
    const passInput = document.getElementById('input-password');
    passInput.addEventListener('input', (e) => {
      sounds.playHover();
      this.evaluatePassword(e.target.value);
    });

    document.getElementById('btn-toggle-pass-visibility').addEventListener('click', () => {
      const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passInput.setAttribute('type', type);
    });

    document.getElementById('btn-close-password').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('modal-password').classList.add('hidden');
    });

    document.getElementById('btn-deploy-password').addEventListener('click', () => {
      this.triggerVictory();
    });

    // Reward Modal Buttons
    document.getElementById('btn-replay-demo').addEventListener('click', () => {
      sounds.playClick();
      this.resetGame();
      this.switchScreen('room');
    });

    document.getElementById('btn-return-menu').addEventListener('click', () => {
      sounds.playClick();
      this.resetGame();
      this.switchScreen('main-menu');
    });
  }
}

// Boot game when DOM loads
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
  window.game.init();
});
