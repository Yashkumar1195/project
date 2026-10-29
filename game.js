/**
 * ====================================================================
 * ESCAPE THE HACKER'S NETWORK - CORE ENGINE & SCENARIOS
 * Target Platform: Universal Windows 1920x1080 (Full HD 16:9 Standard)
 * Features:
 *   - Room 1: Phishing Detective (Email inspection & analysis)
 *   - Room 2: Password Fortress (Password comparison & creation)
 *   - Room 3: Malware Investigation Lab (File inspection & containment)
 * ====================================================================
 */

// ==================== AUDIO SYNTHESIZER (WEB AUDIO API) ====================
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
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

  playQuarantine() {
    if (!this.enabled) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'sine', 0.3, 0.12), i * 110);
    });
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
      <p>Project Lead Sarah has invited you to collaborate on the <strong>EscapeTheHackersNetwork</strong> codebase.</p>
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

// ==================== ROOM 2: PASSWORD FORTRESS DATA ====================
const PASSWORD_CANDIDATES = [
  {
    password: "password123",
    assessment: "Weak",
    tagClass: "weak",
    reason: "Common dictionary password with predictable sequence numbers.",
    isStrongest: false
  },
  {
    password: "Cyber2026",
    assessment: "Moderate",
    tagClass: "moderate",
    reason: "Capitalized single word + year is a predictable pattern easily cracked by targeted wordlists.",
    isStrongest: false
  },
  {
    password: "Violet!Orbit7#Maple",
    assessment: "Strong candidate",
    tagClass: "strong",
    reason: "Long passphrase combining multiple distinct words, special symbols, and numbers.",
    isStrongest: true
  }
];

// ==================== ROOM 3: MALWARE INVESTIGATION DATA ====================
const MALWARE_FILES = [
  {
    id: "notes",
    name: "Meeting_Notes.pdf",
    icon: "📄",
    iconClass: "pdf",
    size: "1.2 MB",
    source: "Sarah Chen <s.chen@organization.internal>",
    dateReceived: "Today, 10:14 AM",
    fileType: "Adobe Acrobat Document (.pdf)",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    warningSigns: "None detected. Valid internal digital signature.",
    evidence: "Expected sender and ordinary meeting documentation. Sent via official internal channels.",
    classification: "Appears legitimate",
    isSuspicious: false
  },
  {
    id: "update",
    name: "Security_Update.exe",
    icon: "⚙️",
    iconClass: "exe",
    size: "4.8 MB",
    source: "unknown-sender-492@external-patch-relay.net",
    dateReceived: "Today, 09:30 AM",
    fileType: "Windows PE32 Executable (.exe)",
    sha256: "a785f0e34c919d854e4c278b0f1994827fb3817169528bc894562810a9163f21",
    warningSigns: "CRITICAL: Unexpected attachment from an unverified external sender. Masquerading as a system patch without IT digital certificate!",
    evidence: "Unexpected attachment from an unknown sender. Normal IT patches are pushed via enterprise SIEM, never emailed as standalone .exe files.",
    classification: "Suspicious",
    isSuspicious: true
  },
  {
    id: "timeline",
    name: "Project_Timeline.docx",
    icon: "📝",
    iconClass: "docx",
    size: "840 KB",
    source: "Operations Team <operations@organization.internal>",
    dateReceived: "Yesterday, 04:45 PM",
    fileType: "Microsoft Word Open XML Document (.docx)",
    sha256: "7d793037a0760186574b0282f2f435e7090a6ff41029c91652481d4b6555198e",
    warningSigns: "None detected. Macro code scan negative.",
    evidence: "Expected project timeline document requested during weekly review.",
    classification: "Appears legitimate",
    isSuspicious: false
  }
];

// ==================== GAME CORE ENGINE ====================
class GameEngine {
  constructor() {
    this.score = 0;
    this.timerSeconds = 300; // 5 minutes
    this.timerInterval = null;
    this.currentScreen = 'main-menu';

    // Room completion states
    this.level1Completed = false;
    this.level2PasswordEvaluated = false;
    this.level2Completed = false;
    this.level3FileIdentified = false;
    this.level3Completed = false;

    // Room 1 state
    this.selectedEmailIndex = 0;
    this.solvedEmails = {};

    // Room 2 state
    this.chosenPasswordSample = null;

    // Room 3 state
    this.selectedFileId = null;
    this.identifiedFileId = null;

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
    this.terminalObj = { x: 960, y: 440, radius: 110 };     // Room 1: Email Terminal Desk
    this.doorObj = { x: 1480, y: 280, radius: 120 };        // Room 2: Vault Access Door
    this.malwareObj = { x: 440, y: 380, radius: 120 };       // Room 3: Malware Forensics Lab

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
    this.setupPasswordOptions();
    this.renderMalwareFiles();
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
        setTimeout(typeWriter, 16);
      }
    };
    typeWriter();
  }

  // Room Transition Cinematic Animation
  triggerRoomTransition(title, subtitle, callback) {
    const overlay = document.getElementById('room-transition-overlay');
    const titleEl = document.getElementById('transition-title');
    const subEl = document.getElementById('transition-subtitle');
    
    titleEl.textContent = title;
    subEl.textContent = subtitle;
    overlay.classList.remove('hidden');
    sounds.playTerminalBoot();

    setTimeout(() => {
      overlay.classList.add('hidden');
      if (callback) callback();
    }, 1800);
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
    // Only allow movement if NO modal is open (Fix Bug 4: include headers and malware)
    const isModalOpen = !document.getElementById('modal-phishing').classList.contains('hidden') ||
                        !document.getElementById('modal-password').classList.contains('hidden') ||
                        !document.getElementById('modal-malware').classList.contains('hidden') ||
                        !document.getElementById('modal-reward').classList.contains('hidden') ||
                        !document.getElementById('modal-briefing').classList.contains('hidden') ||
                        !document.getElementById('modal-headers').classList.contains('hidden') ||
                        !document.getElementById('room-transition-overlay').classList.contains('hidden');

    if (isModalOpen) return;

    let dx = 0;
    let dy = 0;

    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    // Normalize diagonal movement speed
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

    const pulseAlpha = 0.35 + 0.2 * Math.sin(Date.now() / 250);

    // 2. Station 1: Phishing Terminal Desk (Center)
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.terminalObj.x, this.terminalObj.y, 90, 0, Math.PI * 2);
    const termColor = this.level1Completed ? 'rgba(0, 230, 118, ' : 'rgba(0, 229, 255, ';
    this.ctx.fillStyle = `${termColor}${pulseAlpha * 0.35})`;
    this.ctx.fill();
    this.ctx.strokeStyle = `${termColor}${pulseAlpha})`;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Label over terminal
    this.ctx.fillStyle = '#e0f7fa';
    this.ctx.font = 'bold 15px Rajdhani';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('STATION 1: PHISHING TERMINAL', this.terminalObj.x, this.terminalObj.y - 100);
    this.ctx.restore();

    // 3. Station 2: Security Door / Vault (Top Right)
    this.ctx.save();
    const doorColor = this.level2Completed ? '#00e676' : (this.level1Completed ? '#00e5ff' : '#ff1744');
    this.ctx.beginPath();
    this.ctx.arc(this.doorObj.x, this.doorObj.y, 85, 0, Math.PI * 2);
    this.ctx.strokeStyle = doorColor;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.fillStyle = this.level2Completed ? 'rgba(0, 230, 118, 0.15)' : 'rgba(10, 25, 45, 0.4)';
    this.ctx.fill();

    this.ctx.fillStyle = doorColor;
    this.ctx.font = 'bold 15px Rajdhani';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('STATION 2: PASSWORD FORTRESS', this.doorObj.x, this.doorObj.y - 95);
    this.ctx.restore();

    // 4. Station 3: Malware Forensics Lab (Top Left)
    this.ctx.save();
    const malwareColor = this.level3Completed ? '#00e676' : (this.level2Completed ? '#ff1744' : '#546e7a');
    this.ctx.beginPath();
    this.ctx.arc(this.malwareObj.x, this.malwareObj.y, 85, 0, Math.PI * 2);
    this.ctx.strokeStyle = malwareColor;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    if (this.level2Completed && !this.level3Completed) {
      this.ctx.fillStyle = `rgba(255, 23, 68, ${pulseAlpha * 0.25})`;
      this.ctx.fill();
    }

    this.ctx.fillStyle = malwareColor;
    this.ctx.font = 'bold 15px Rajdhani';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('STATION 3: MALWARE LAB', this.malwareObj.x, this.malwareObj.y - 95);
    this.ctx.restore();

    // 5. Draw Player Character
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

    // Draw sprite or procedural detective
    if (this.images.playerSprite && this.images.playerSprite.complete) {
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
      // Procedural fallback
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
    const door3PromptEl = document.getElementById('door3-prompt');

    // Terminal proximity (Station 1)
    const dTerminal = Math.hypot(this.player.x - this.terminalObj.x, this.player.y - this.terminalObj.y);
    if (dTerminal < this.terminalObj.radius) {
      promptEl.classList.remove('hidden');
      promptEl.style.left = `${this.terminalObj.x}px`;
      promptEl.style.top = `${this.terminalObj.y - 60}px`;
      promptEl.querySelector('.prompt-text').innerHTML = `PRESS <span class="key-highlight">[E]</span> TO ACCESS PHISHING TERMINAL`;
    } else {
      promptEl.classList.add('hidden');
    }

    // Door proximity (Station 2: Password Fortress)
    const dDoor = Math.hypot(this.player.x - this.doorObj.x, this.player.y - this.doorObj.y);
    if (dDoor < this.doorObj.radius) {
      doorPromptEl.classList.remove('hidden');
      doorPromptEl.style.left = `${this.doorObj.x}px`;
      doorPromptEl.style.top = `${this.doorObj.y - 60}px`;

      if (this.level1Completed) {
        doorPromptEl.classList.remove('red-prompt');
        doorPromptEl.innerHTML = `<div class="prompt-icon">E</div><div class="prompt-text">PRESS <span class="key-highlight">[E]</span> TO ACCESS ROOM 2 (PASSWORD FORTRESS)</div>`;
      } else {
        doorPromptEl.classList.add('red-prompt');
        doorPromptEl.innerHTML = `<div class="prompt-icon">🔒</div><div class="prompt-text">FIREWALL LOCKED: Complete Level 1 at terminal first!</div>`;
      }
    } else {
      doorPromptEl.classList.add('hidden');
    }

    // Malware Lab proximity (Station 3: Malware Lab)
    const dMalware = Math.hypot(this.player.x - this.malwareObj.x, this.player.y - this.malwareObj.y);
    if (dMalware < this.malwareObj.radius) {
      door3PromptEl.classList.remove('hidden');
      door3PromptEl.style.left = `${this.malwareObj.x}px`;
      door3PromptEl.style.top = `${this.malwareObj.y - 60}px`;

      if (this.level2Completed) {
        door3PromptEl.classList.remove('red-prompt');
        door3PromptEl.innerHTML = `<div class="prompt-icon">E</div><div class="prompt-text">PRESS <span class="key-highlight">[E]</span> TO ACCESS ROOM 3 (MALWARE LAB)</div>`;
      } else {
        door3PromptEl.classList.add('red-prompt');
        door3PromptEl.innerHTML = `<div class="prompt-icon">🔒</div><div class="prompt-text">LAB LOCKED: Secure Password Fortress (Room 2) first!</div>`;
      }
    } else {
      door3PromptEl.classList.add('hidden');
    }
  }

  handleInteraction() {
    const dTerminal = Math.hypot(this.player.x - this.terminalObj.x, this.player.y - this.terminalObj.y);
    const dDoor = Math.hypot(this.player.x - this.doorObj.x, this.player.y - this.doorObj.y);
    const dMalware = Math.hypot(this.player.x - this.malwareObj.x, this.player.y - this.malwareObj.y);

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
    } else if (dMalware < this.malwareObj.radius) {
      if (this.level2Completed) {
        sounds.playClick();
        this.openMalwareModal();
      } else {
        sounds.playError();
        this.setAIRIDialogue("The malware forensics lab is restricted until the Password Fortress credentials barrier is secured!", true);
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

    // Hover inspector on links
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
        document.getElementById('hud-objective-text').textContent = "Room 1 Cleared! Proceed to Password Fortress (Top Right Door)";
        document.getElementById('hud-level-badge').textContent = "LVL 2";
        document.getElementById('hud-level-title').textContent = "DEFENSE ARCHITECT";
        this.setAIRIDialogue("The phishing attack exposed a security weakness. ZERO is attempting to access the network using compromised credentials. We must secure this terminal before proceeding.");
      } else {
        this.setAIRIDialogue("You only got " + correctCount + "/5 correct. A security analyst needs at least 4/5! Review the emails and try again.", true);
      }
    }
  }

  // ==================== SCENARIO 4: PASSWORD FORTRESS ====================
  openPasswordModal() {
    document.getElementById('modal-password').classList.remove('hidden');
    // AIRI opening dialogue from Word doc:
    this.setAIRIDialogue("The phishing attack exposed a security weakness. ZERO is attempting to access the network using compromised credentials. We must secure this terminal before proceeding.");
  }

  setupPasswordOptions() {
    const optionBtns = document.querySelectorAll('.password-option-btn');
    optionBtns.forEach(btn => {
      const idx = parseInt(btn.getAttribute('data-pw-index'));
      const candidate = PASSWORD_CANDIDATES[idx];
      const tagSpan = btn.querySelector('.pw-tag');

      btn.addEventListener('click', () => {
        sounds.playClick();
        this.evaluatePasswordCandidate(idx, btn, tagSpan);
      });
    });
  }

  evaluatePasswordCandidate(idx, btn, tagSpan) {
    const candidate = PASSWORD_CANDIDATES[idx];
    const feedbackEl = document.getElementById('comparison-feedback');
    const creationSection = document.getElementById('password-creation-section');

    // Remove previous selection classes
    document.querySelectorAll('.password-option-btn').forEach(b => {
      b.classList.remove('selected', 'correct', 'wrong');
    });

    tagSpan.textContent = candidate.assessment;
    tagSpan.className = `pw-tag ${candidate.tagClass}`;

    if (candidate.isStrongest) {
      btn.classList.add('correct');
      sounds.playSuccess();
      if (!this.level2PasswordEvaluated) {
        this.addScore(100); // +100 for choosing strongest sample per Word doc
        this.level2PasswordEvaluated = true;
      }
      feedbackEl.className = 'comparison-feedback correct';
      feedbackEl.innerHTML = `<strong>CORRECT!</strong> ${candidate.password} is the strongest candidate. <em>${candidate.reason}</em> (+100 Points)`;
      feedbackEl.classList.remove('hidden');

      // Reveal Step 2: Password Creation
      creationSection.classList.remove('hidden');
      this.setAIRIDialogue("Excellent identification! Long, unique passphrases beat predictable patterns. Now create your own fortress password meeting all rules.");
    } else {
      btn.classList.add('wrong');
      sounds.playError();
      this.addScore(-25); // -25 for wrong selection per Word doc
      feedbackEl.className = 'comparison-feedback wrong';
      feedbackEl.innerHTML = `<strong>WEAK/MODERATE CANDIDATE:</strong> ${candidate.password} (${candidate.assessment}). ${candidate.reason} (-25 Penalty). Try evaluating another option.`;
      feedbackEl.classList.remove('hidden');
      this.setAIRIDialogue("That candidate is still vulnerable. A longer passphrase with varied characters is far safer. Select the strongest candidate.", true);
    }
  }

  evaluatePassword(pwd) {
    // Word document validation rules:
    // check password length, character variety, common-password blacklist, and consecutive duplicate characters.
    const hasLen = pwd.length >= 10;
    const hasUpperLower = /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    // Consecutive duplicate characters check (e.g. 'aaa', '111')
    const hasConsecutiveDupes = /(.)\1{2,}/.test(pwd);
    const noConsecutiveDupes = !hasConsecutiveDupes && pwd.length > 0;

    // Common password blacklist
    const commonBlacklist = ['password', '123456', 'qwerty', 'admin', 'rahul', 'welcome', 'login', 'cyber2026'];
    const lower = pwd.toLowerCase();
    const isCommon = commonBlacklist.some(w => lower.includes(w));

    // Update rule UI checklist (Fix Bug 2: 'rule-dictionary')
    this.updateRuleUI('rule-length', hasLen);
    this.updateRuleUI('rule-upper-lower', hasUpperLower);
    this.updateRuleUI('rule-number', hasNumber);
    this.updateRuleUI('rule-symbol', hasSymbol);
    this.updateRuleUI('rule-dictionary', !isCommon && pwd.length > 0);
    this.updateRuleUI('rule-consecutive', noConsecutiveDupes);

    // Calculate score tier 0 to 5
    let tier = 0;
    if (pwd.length > 0) tier = 1;
    if (hasLen) tier++;
    if (hasUpperLower && hasNumber) tier++;
    if (hasSymbol && noConsecutiveDupes) tier++;
    if (!isCommon && pwd.length >= 14) tier++;

    tier = Math.min(5, tier);

    // Calculate entropy
    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (hasSymbol) poolSize += 32;

    const entropy = poolSize > 0 ? Math.round(pwd.length * Math.log2(poolSize)) : 0;
    document.getElementById('entropy-bits').textContent = entropy;

    // Update 5-bar meter (Fix Bug 3: meter-bar-0 to meter-bar-4)
    for (let i = 0; i < 5; i++) {
      const seg = document.getElementById(`meter-bar-${i}`);
      if (seg) {
        seg.className = 'meter-segment';
        if (i < tier) {
          seg.classList.add(`active-${tier}`);
        }
      }
    }

    // Tier Label & Crack Time
    const tierLabels = [
      { text: "ENTER PASSWORD", color: "tier-0", time: "INSTANT (0.0001 SEC)", timeColor: "text-red" },
      { text: "VERY WEAK", color: "tier-1", time: "0.002 SECONDS", timeColor: "text-red" },
      { text: "WEAK", color: "tier-2", time: "14 MINUTES", timeColor: "text-red" },
      { text: "MODERATE", color: "tier-3", time: "3 MONTHS", timeColor: "text-yellow" },
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

    // Enable button only if all rules pass and tier >= 4
    const allRulesMet = hasLen && hasUpperLower && hasNumber && hasSymbol && !isCommon && noConsecutiveDupes;
    const deployBtn = document.getElementById('btn-deploy-password');
    deployBtn.disabled = !allRulesMet;
    if (allRulesMet) {
      deployBtn.textContent = "🔒 ACTIVATE FIREWALL FORTRESS ▶";
    } else {
      deployBtn.textContent = "🔒 DEPLOY FIREWALL PASSWORD (MEET ALL RULES)";
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

  completePasswordRoom() {
    this.closeAllModals();
    this.level2Completed = true;
    sounds.playSuccess();
    this.addScore(100); // +100 for creating password meeting rules

    // Update HUD and objective
    document.getElementById('hud-objective-text').textContent = "Room 2 Secured! Proceed to Malware Lab (Top Left) to contain active threat";
    document.getElementById('hud-level-badge').textContent = "LVL 3";
    document.getElementById('hud-level-title').textContent = "MALWARE HUNTER";

    // Trigger Room 2 Completion dialogue from Word doc:
    // "PASSWORD FORTRESS SECURED. Excellent! The access barrier is secure. But I'm detecting suspicious activity in the malware investigation lab."
    this.triggerRoomTransition("PASSWORD FORTRESS SECURED", "Access barrier fortified. Unlocking Room 3: Malware Investigation Lab...", () => {
      this.setAIRIDialogue("Excellent! The access barrier is secure. But I'm detecting suspicious activity in the malware investigation lab. Approach Station 3 (Top Left)!");
    });
  }

  // ==================== SCENARIO 5: MALWARE INVESTIGATION LAB (ROOM 3) ====================
  openMalwareModal() {
    document.getElementById('modal-malware').classList.remove('hidden');
    // AIRI opening dialogue from Word doc:
    this.setAIRIDialogue("Warning! A suspicious file has been detected on this workstation. Don't open it. Inspect its properties, examine the clues, and isolate the threat.");
  }

  renderMalwareFiles() {
    const listEl = document.getElementById('malware-file-list');
    const identifyBtnsEl = document.getElementById('malware-identify-btns');
    if (!listEl) return;

    listEl.innerHTML = '';
    identifyBtnsEl.innerHTML = '';

    MALWARE_FILES.forEach(file => {
      // File list card
      const card = document.createElement('div');
      card.className = `malware-file-card ${this.selectedFileId === file.id ? 'active' : ''}`;
      card.setAttribute('data-file-id', file.id);

      card.innerHTML = `
        <div class="file-icon-box ${file.iconClass}">${file.icon}</div>
        <div class="file-meta-info">
          <div class="file-name">${file.name}</div>
          <div class="file-sub">${file.fileType} • ${file.size}</div>
        </div>
        <div class="file-status-badge ${file.isSuspicious ? 'suspicious' : 'legit'}">
          ${file.classification}
        </div>
      `;

      card.addEventListener('click', () => {
        sounds.playClick();
        this.selectMalwareFile(file.id);
      });

      listEl.appendChild(card);

      // Identification button
      const idBtn = document.createElement('button');
      idBtn.className = 'malware-id-btn';
      idBtn.setAttribute('data-id-file', file.id);
      idBtn.textContent = file.name;
      idBtn.addEventListener('click', () => {
        this.identifyThreat(file.id);
      });
      identifyBtnsEl.appendChild(idBtn);
    });
  }

  selectMalwareFile(fileId) {
    this.selectedFileId = fileId;
    const file = MALWARE_FILES.find(f => f.id === fileId);
    if (!file) return;

    // Highlight card
    document.querySelectorAll('.malware-file-card').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-file-id') === fileId);
    });

    // Populate Inspector
    const inspectorEl = document.getElementById('malware-inspector-content');
    inspectorEl.innerHTML = `
      <div class="inspector-prop-table">
        <div class="inspector-row">
          <span class="prop-label">FILE NAME:</span>
          <span class="prop-val">${file.name}</span>
        </div>
        <div class="inspector-row">
          <span class="prop-label">FILE TYPE:</span>
          <span class="prop-val">${file.fileType}</span>
        </div>
        <div class="inspector-row">
          <span class="prop-label">FILE SIZE:</span>
          <span class="prop-val">${file.size}</span>
        </div>
        <div class="inspector-row">
          <span class="prop-label">SOURCE SENDER:</span>
          <span class="prop-val">${file.source}</span>
        </div>
        <div class="inspector-row">
          <span class="prop-label">DATE RECEIVED:</span>
          <span class="prop-val">${file.dateReceived}</span>
        </div>
        <div class="inspector-row">
          <span class="prop-label">SHA-256 HASH:</span>
          <span class="prop-val" style="font-size: 11px;">${file.sha256}</span>
        </div>
      </div>

      <div class="threat-alert-box ${file.isSuspicious ? 'danger' : 'safe'}">
        <strong>EVIDENCE:</strong> ${file.evidence}<br>
        <span style="margin-top: 4px; display: block;"><strong>WARNING SIGNS:</strong> ${file.warningSigns}</span>
      </div>
    `;

    // Reveal Step 2: Identification if not already revealed
    document.getElementById('malware-step-identify').classList.remove('hidden');
  }

  identifyThreat(fileId) {
    const file = MALWARE_FILES.find(f => f.id === fileId);
    const feedbackEl = document.getElementById('malware-identify-feedback');
    const respondStep = document.getElementById('malware-step-respond');

    document.querySelectorAll('.malware-id-btn').forEach(btn => {
      btn.classList.remove('selected-threat', 'wrong-threat');
      if (btn.getAttribute('data-id-file') === fileId) {
        if (file.isSuspicious) {
          btn.classList.add('selected-threat');
        } else {
          btn.classList.add('wrong-threat');
        }
      }
    });

    if (file.isSuspicious) {
      sounds.playSuccess();
      if (!this.level3FileIdentified) {
        this.addScore(100); // +100 for identifying suspicious file
        this.level3FileIdentified = true;
      }
      feedbackEl.className = 'comparison-feedback correct';
      feedbackEl.innerHTML = `<strong>CORRECT THREAT DETECTED!</strong> <code>Security_Update.exe</code> is an unauthorized executable sent from an external relay. (+100 Points)`;
      feedbackEl.classList.remove('hidden');

      // Reveal Step 3: Response decisions
      respondStep.classList.remove('hidden');
      this.setAIRIDialogue("You identified the malicious binary! Now choose how to contain this threat before ZERO executes it.");
    } else {
      sounds.playError();
      this.addScore(-25); // -25 for wrong decision
      feedbackEl.className = 'comparison-feedback wrong';
      feedbackEl.innerHTML = `<strong>INCORRECT:</strong> <code>${file.name}</code> has normal properties and matches expected business operations. (-25 Penalty). Re-examine the other files!`;
      feedbackEl.classList.remove('hidden');
      this.setAIRIDialogue("That file has a valid digital signature and expected source. Inspect the other files for unexpected executables!", true);
    }
  }

  handleMalwareResponse(action) {
    const feedbackEl = document.getElementById('malware-response-feedback');

    if (action === 'open') {
      sounds.playAlarm();
      this.addScore(-25);
      feedbackEl.className = 'comparison-feedback wrong';
      feedbackEl.innerHTML = `<strong>CRITICAL ERROR:</strong> Opening an untrusted executable executes payload code immediately and compromises the machine! (-25 Penalty)`;
      feedbackEl.classList.remove('hidden');
      this.setAIRIDialogue("NEVER open or execute a suspicious file! That triggers the malware payload immediately.", true);
    } else if (action === 'delete') {
      sounds.playError();
      this.addScore(-25);
      feedbackEl.className = 'comparison-feedback wrong';
      feedbackEl.innerHTML = `<strong>INCOMPLETE CONTAINMENT:</strong> Simply deleting the file does not stop active C2 command callbacks or memory-resident processes. The machine must be isolated first! (-25 Penalty)`;
      feedbackEl.classList.remove('hidden');
      this.setAIRIDialogue("Deleting the file without isolating the network allows secondary payloads or command-and-control backdoors to persist.", true);
    } else if (action === 'isolate') {
      sounds.playQuarantine();
      this.addScore(100); // +100 for choosing appropriate containment response
      this.level3Completed = true;

      feedbackEl.className = 'comparison-feedback correct';
      feedbackEl.innerHTML = `<strong>THREAT CONTAINED!</strong> Workstation severed from network backbone. Malware isolated for reverse-engineering. (+100 Points)`;
      feedbackEl.classList.remove('hidden');

      // Disable response buttons
      document.querySelectorAll('.malware-response-btn').forEach(b => b.disabled = true);

      // Trigger Completion Message from Word doc:
      // THREAT CONTAINED
      // AIRI: "The suspicious file has been isolated. ZERO's attempt to spread the attack has been stopped—for now."
      // Button: RETURN TO COMMAND CENTER
      setTimeout(() => {
        this.closeAllModals();
        this.triggerRoomTransition("THREAT CONTAINED", "Workstation isolated. Attack vectors neutralized.", () => {
          this.setAIRIDialogue("The suspicious file has been isolated. ZERO's attempt to spread the attack has been stopped—for now.");
          this.triggerVictory();
        });
      }, 2000);
    }
  }

  // ==================== SCENARIO 6: VICTORY & FINAL DEBRIEF ====================
  triggerVictory() {
    this.closeAllModals();
    sounds.playSuccess();

    const rewardModal = document.getElementById('modal-reward');
    rewardModal.classList.remove('hidden');

    const correctCount = Object.values(this.solvedEmails).filter(v => v.correct).length;
    document.getElementById('final-score').textContent = `${this.score} PTS`;
    document.getElementById('final-accuracy').textContent = `${Math.round((correctCount / 5) * 100)}% (${correctCount}/5 Emails Intercepted)`;
    document.getElementById('final-malware-status').textContent = 'ISOLATED & SECURED';
  }

  resetGame() {
    this.score = 0;
    this.timerSeconds = 300;
    this.solvedEmails = {};
    this.selectedEmailIndex = 0;
    this.level1Completed = false;
    this.level2PasswordEvaluated = false;
    this.level2Completed = false;
    this.level3FileIdentified = false;
    this.level3Completed = false;
    this.selectedFileId = null;
    this.player.x = 960;
    this.player.y = 650;

    this.closeAllModals();
    this.updateHUDTimer();
    this.addScore(0);
    this.renderEmailList();
    this.renderMalwareFiles();
    document.getElementById('hud-objective-text').textContent = "Investigate compromised email terminal (Press E near terminal)";
    document.getElementById('hud-level-badge').textContent = "LVL 1";
    document.getElementById('hud-level-title').textContent = "SECURITY ANALYST";
    document.getElementById('password-creation-section').classList.add('hidden');
    document.getElementById('malware-step-identify').classList.add('hidden');
    document.getElementById('malware-step-respond').classList.add('hidden');
    document.querySelectorAll('.malware-response-btn').forEach(b => b.disabled = false);
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

    // Fix Bug 5: Controls and Objectives button opens briefing with focus on Controls
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
      this.completePasswordRoom();
    });

    // Malware Lab Buttons (Room 3)
    document.getElementById('btn-close-malware').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('modal-malware').classList.add('hidden');
    });

    document.querySelectorAll('.malware-response-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.getAttribute('data-response');
        this.handleMalwareResponse(action);
      });
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
