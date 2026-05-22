// Math Island App Main Logic
document.addEventListener('DOMContentLoaded', () => {
  // --- Game State Variables ---
  let state = {
    player: {
      level: 1,
      xp: 0,
      xpNeeded: 100,
      stars: 30 // Start with some pocket stars!
    },
    pet: {
      selected: false, // false or 'dragon'/'phoenix'/'kitty'
      name: '',
      level: 1,
      xp: 0,
      xpNeeded: 50,
      energy: 50,
      maxEnergy: 100
    },
    unlockedRegions: ['arithmetic'], // arithmetic, patterns, geometry, logic
    completedLevels: {
      arithmetic: [], // e.g. [1, 2]
      patterns: [],
      geometry: [],
      logic: []
    },
    town: Array(36).fill(null), // 6x6 board, stores item objects or null
    inventory: {
      // itemKey: quantity
      'star_berry': 2,
      'magic_apple': 0,
      'cosmic_candy': 0,
      'tent': 0,
      'tree': 0,
      'fountain': 0,
      'tower': 0,
      'statue': 0
    },
    quests: [
      { id: 1, text: 'حل 3 مسائل رياضيات', type: 'math', target: 3, progress: 0, reward: 15, claimed: false },
      { id: 2, text: 'أطعم أليفك السحري', type: 'feed', target: 1, progress: 0, reward: 10, claimed: false },
      { id: 3, text: 'شراء عنصر من المتجر', type: 'buy', target: 1, progress: 0, reward: 15, claimed: false }
    ],
    lastQuestReset: null
  };

  // Static Data definitions
  const REGION_UNLOCK_COSTS = {
    patterns: 30,
    geometry: 60,
    logic: 100
  };

  const SHOP_ITEMS = {
    star_berry: { name: 'توت النجوم 🔮', type: 'food', cost: 5, effect: 'طاقة الأليف +10، خبرة +15', energy: 10, xp: 15, emoji: '🔮' },
    magic_apple: { name: 'تفاحة سحرية 🍎', type: 'food', cost: 8, effect: 'طاقة الأليف +20، خبرة +25', energy: 20, xp: 25, emoji: '🍎' },
    cosmic_candy: { name: 'حلوى الفضاء 🍬', type: 'food', cost: 15, effect: 'طاقة الأليف +40، خبرة +45', energy: 40, xp: 45, emoji: '🍬' },
    
    tent: { name: 'خيمة مغامرات ⛺', type: 'town', cost: 20, effect: 'مبنى لمدينتك السحرية', emoji: '⛺' },
    tree: { name: 'شجرة مضيئة 🌳', type: 'town', cost: 12, effect: 'شجرة متوهجة تزين مدينتك', emoji: '🌳' },
    fountain: { name: 'ينبوع بلوري ⛲', type: 'town', cost: 35, effect: 'ينبوع يشع طاقة سحرية', emoji: '⛲' },
    tower: { name: 'برج الألغاز 🏰', type: 'town', cost: 50, effect: 'برج المراقبة والدراسة الفلكية', emoji: '🏰' },
    statue: { name: 'تمثال الذهب 🗽', type: 'town', cost: 75, effect: 'تمثال التقدير الذهبي اللامع', emoji: '🗽' }
  };

  // --- SVGs for Pets at Different Evolution Stages ---
  const PET_SVGS = {
    dragon: {
      1: `<svg class="pet-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Baby Dragon -->
            <ellipse cx="50" cy="55" rx="20" ry="25" fill="#ff4a4a"/>
            <circle cx="50" cy="30" r="16" fill="#ff4a4a"/>
            <circle cx="44" cy="26" r="3" fill="#fff"/><circle cx="44" cy="26" r="1.5" fill="#000"/>
            <circle cx="56" cy="26" r="3" fill="#fff"/><circle cx="56" cy="26" r="1.5" fill="#000"/>
            <polygon points="50,14 46,2 40,10" fill="#ffa000"/>
            <polygon points="50,14 54,2 60,10" fill="#ffa000"/>
            <path d="M40,55 Q30,55 35,62 Q45,62 40,55" fill="#ff8a8a"/>
            <path d="M60,55 Q70,55 65,62 Q55,62 60,55" fill="#ff8a8a"/>
            <path d="M45,36 Q50,42 55,36" stroke="#000" stroke-width="2" fill="none"/>
            <path d="M50,80 Q45,95 35,90" stroke="#ff4a4a" stroke-width="4" fill="none"/>
          </svg>`,
      2: `<svg class="pet-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Teen Dragon -->
            <path d="M30,70 L20,55 L35,50 Z" fill="#b00000"/><!-- wings -->
            <path d="M70,70 L80,55 L65,50 Z" fill="#b00000"/>
            <ellipse cx="50" cy="60" rx="24" ry="28" fill="#ff2a2a"/>
            <ellipse cx="50" cy="60" rx="14" ry="20" fill="#ffb03a"/>
            <circle cx="50" cy="32" r="18" fill="#ff2a2a"/>
            <circle cx="43" cy="28" r="4" fill="#fff"/><circle cx="43" cy="28" r="2" fill="#000"/>
            <circle cx="57" cy="28" r="4" fill="#fff"/><circle cx="57" cy="28" r="2" fill="#000"/>
            <polygon points="46,15 42,-2 34,10" fill="#ff8a00"/>
            <polygon points="54,15 58,-2 66,10" fill="#ff8a00"/>
            <path d="M44,40 Q50,48 56,40" stroke="#000" stroke-width="2.5" fill="none"/>
            <path d="M50,88 Q60,95 75,90 Q85,80 75,70" stroke="#ff2a2a" stroke-width="5" fill="none" stroke-linecap="round"/>
          </svg>`,
      3: `<svg class="pet-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Ancient Majestic Dragon -->
            <!-- Massive Wings with animation hints -->
            <path d="M25,65 L5,40 L35,35 L20,60 Z" fill="#b00000"/>
            <path d="M75,65 L95,40 L65,35 L80,60 Z" fill="#b00000"/>
            <!-- Fire Particles -->
            <circle cx="20" cy="30" r="3" fill="#ffa000" opacity="0.8"/>
            <circle cx="80" cy="30" r="3" fill="#ffa000" opacity="0.8"/>
            <ellipse cx="50" cy="62" rx="26" ry="32" fill="#d90000"/>
            <ellipse cx="50" cy="62" rx="16" ry="22" fill="#ffcc00"/>
            <circle cx="50" cy="28" r="20" fill="#d90000"/>
            <!-- Glowing Eyes -->
            <circle cx="42" cy="24" r="5" fill="#ffe600" stroke="#ff5500" stroke-width="1.5"/>
            <circle cx="42" cy="24" r="2" fill="#fff"/>
            <circle cx="58" cy="24" r="5" fill="#ffe600" stroke="#ff5500" stroke-width="1.5"/>
            <circle cx="58" cy="24" r="2" fill="#fff"/>
            <!-- Horns -->
            <path d="M43,10 Q35,-5 20,2" fill="#ffcc00" stroke="#d90000" stroke-width="1"/>
            <path d="M57,10 Q65,-5 80,2" fill="#ffcc00" stroke="#d90000" stroke-width="1"/>
            <!-- Fangs -->
            <polygon points="44,38 46,43 48,38" fill="#fff"/>
            <polygon points="56,38 54,43 52,38" fill="#fff"/>
            <path d="M42,36 Q50,44 58,36" stroke="#000" stroke-width="2.5" fill="none"/>
            <!-- Tail holding Magic Orb -->
            <path d="M50,94 Q70,105 85,90 Q95,75 80,65" stroke="#d90000" stroke-width="6" fill="none" stroke-linecap="round"/>
            <circle cx="80" cy="65" r="8" fill="#00ffff" opacity="0.8" class="sparkle"/>
          </svg>`
    },
    phoenix: {
      1: `<svg class="pet-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Baby Phoenix -->
            <circle cx="50" cy="55" r="18" fill="#ffb800"/>
            <circle cx="50" cy="32" r="14" fill="#ffb800"/>
            <circle cx="45" cy="28" r="2.5" fill="#fff"/><circle cx="45" cy="28" r="1" fill="#000"/>
            <circle cx="55" cy="28" r="2.5" fill="#fff"/><circle cx="55" cy="28" r="1" fill="#000"/>
            <!-- Beak -->
            <polygon points="50,32 47,38 53,38" fill="#ff5500"/>
            <!-- Little crest -->
            <path d="M50,18 Q45,8 50,4" stroke="#ff5500" stroke-width="3" fill="none"/>
            <!-- Tiny Wings -->
            <path d="M32,55 Q25,50 30,60" stroke="#ff5500" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M68,55 Q75,50 70,60" stroke="#ff5500" stroke-width="4" fill="none" stroke-linecap="round"/>
          </svg>`,
      2: `<svg class="pet-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Teen Phoenix -->
            <path d="M30,60 C15,45 25,35 32,50" stroke="#ff7a00" stroke-width="6" fill="none"/>
            <path d="M70,60 C85,45 75,35 68,50" stroke="#ff7a00" stroke-width="6" fill="none"/>
            <ellipse cx="50" cy="58" rx="20" ry="24" fill="#ffa800"/>
            <ellipse cx="50" cy="58" rx="10" ry="18" fill="#ffe600"/>
            <circle cx="50" cy="30" r="16" fill="#ffa800"/>
            <circle cx="44" cy="26" r="3.5" fill="#fff"/><circle cx="44" cy="26" r="1.5" fill="#000"/>
            <circle cx="56" cy="26" r="3.5" fill="#fff"/><circle cx="56" cy="26" r="1.5" fill="#000"/>
            <polygon points="50,30 46,38 54,38" fill="#d94100"/>
            <!-- Double Crest -->
            <path d="M48,14 Q40,0 48,-4" stroke="#ff3c00" stroke-width="3.5" fill="none"/>
            <path d="M52,14 Q60,0 52,-4" stroke="#ff3c00" stroke-width="3.5" fill="none"/>
            <!-- Tail feathers -->
            <path d="M46,82 L40,98 L48,90 Z" fill="#ff3c00"/>
            <path d="M54,82 L60,98 L52,90 Z" fill="#ff3c00"/>
          </svg>`,
      3: `<svg class="pet-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Ultimate Fire/Lightning Phoenix -->
            <!-- Large glowing wings -->
            <path d="M30,55 C0,20 15,10 25,45 Z" fill="#ff3c00" opacity="0.9"/>
            <path d="M70,55 C100,20 85,10 75,45 Z" fill="#ff3c00" opacity="0.9"/>
            <ellipse cx="50" cy="58" rx="22" ry="26" fill="#ff8a00"/>
            <ellipse cx="50" cy="58" rx="12" ry="20" fill="#ffee00"/>
            <circle cx="50" cy="26" r="18" fill="#ff8a00"/>
            <!-- Glowing Lightning Eyes -->
            <circle cx="43" cy="22" r="4.5" fill="#00ffff"/><circle cx="43" cy="22" r="1.5" fill="#fff"/>
            <circle cx="57" cy="22" r="4.5" fill="#00ffff"/><circle cx="57" cy="22" r="1.5" fill="#fff"/>
            <polygon points="50,26 45,34 55,34" fill="#b31c00"/>
            <!-- Massive fiery crest -->
            <path d="M46,10 Q30,-15 45,-20" stroke="#ff2600" stroke-width="4" fill="none"/>
            <path d="M50,8 Q50,-18 55,-22" stroke="#ff9000" stroke-width="3" fill="none"/>
            <path d="M54,10 Q70,-15 55,-20" stroke="#ff2600" stroke-width="4" fill="none"/>
            <!-- 3 Majestic tail feathers -->
            <path d="M45,84 Q30,105 15,95 Q35,90 47,84" fill="#ff2600"/>
            <path d="M55,84 Q70,105 85,95 Q65,90 53,84" fill="#ff2600"/>
            <path d="M50,84 L50,105 L52,90 Z" fill="#ffee00"/>
          </svg>`
    },
    kitty: {
      1: `<svg class="pet-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Baby Wizard Kitty -->
            <ellipse cx="50" cy="58" rx="16" ry="18" fill="#9b51e0"/>
            <circle cx="50" cy="36" r="15" fill="#9b51e0"/>
            <!-- Ears -->
            <polygon points="36,28 30,12 42,24" fill="#9b51e0"/>
            <polygon points="64,28 70,12 58,24" fill="#9b51e0"/>
            <!-- Big Eyes -->
            <circle cx="44" cy="34" r="3.5" fill="#fff"/><circle cx="44" cy="34" r="1.5" fill="#000"/>
            <circle cx="56" cy="34" r="3.5" fill="#fff"/><circle cx="56" cy="34" r="1.5" fill="#000"/>
            <!-- Nose & Whiskers -->
            <polygon points="50,38 48,36 52,36" fill="#ff4a7d"/>
            <line x1="38" y1="38" x2="30" y2="37" stroke="#fff" stroke-width="1"/>
            <line x1="38" y1="40" x2="28" y2="41" stroke="#fff" stroke-width="1"/>
            <line x1="62" y1="38" x2="70" y2="37" stroke="#fff" stroke-width="1"/>
            <line x1="62" y1="40" x2="72" y2="41" stroke="#fff" stroke-width="1"/>
            <!-- Mini Wizard Hat -->
            <polygon points="50,10 40,24 60,24" fill="#3a006f"/>
            <circle cx="50" cy="9" r="2.5" fill="#ffd700"/>
          </svg>`,
      2: `<svg class="pet-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Teen Wizard Kitty -->
            <ellipse cx="50" cy="62" rx="20" ry="22" fill="#8632d4"/>
            <ellipse cx="50" cy="65" rx="10" ry="15" fill="#d6aaff"/>
            <circle cx="50" cy="38" r="18" fill="#8632d4"/>
            <!-- Ears -->
            <polygon points="34,28 26,10 40,24" fill="#8632d4"/>
            <polygon points="66,28 74,10 60,24" fill="#8632d4"/>
            <!-- Eyes -->
            <circle cx="42" cy="35" r="4.5" fill="#fff"/><circle cx="42" cy="35" r="2" fill="#000"/>
            <circle cx="58" cy="35" r="4.5" fill="#fff"/><circle cx="58" cy="35" r="2" fill="#000"/>
            <polygon points="50,40 48,38 52,38" fill="#ff4a7d"/>
            <!-- Wizard Hat with brim -->
            <ellipse cx="50" cy="24" rx="16" ry="3" fill="#ffd700"/>
            <polygon points="50,4 38,23 62,23" fill="#2d0059"/>
            <circle cx="50" cy="3" r="3" fill="#ffd700"/>
            <!-- Glowing Forehead Rune -->
            <path d="M50,28 L50,32" stroke="#00ffff" stroke-width="2"/>
            <path d="M48,30 L52,30" stroke="#00ffff" stroke-width="2"/>
          </svg>`,
      3: `<svg class="pet-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Elder Mystic floating Kitty -->
            <!-- Floating Magic Cloud -->
            <ellipse cx="50" cy="85" rx="30" ry="12" fill="#e0c3fc" opacity="0.6"/>
            <circle cx="35" cy="83" r="10" fill="#e0c3fc" opacity="0.8"/>
            <circle cx="65" cy="83" r="10" fill="#e0c3fc" opacity="0.8"/>
            
            <ellipse cx="50" cy="56" rx="22" ry="24" fill="#6d1bb0"/>
            <ellipse cx="50" cy="58" rx="12" ry="16" fill="#d6aaff"/>
            <circle cx="50" cy="32" r="20" fill="#6d1bb0"/>
            <!-- Ears -->
            <polygon points="32,22 22,2 38,18" fill="#6d1bb0"/>
            <polygon points="68,22 78,2 62,18" fill="#6d1bb0"/>
            <!-- Glowing Starry Eyes -->
            <circle cx="41" cy="30" r="5" fill="#00ffff"/><circle cx="41" cy="30" r="2" fill="#fff"/>
            <circle cx="59" cy="30" r="5" fill="#00ffff"/><circle cx="59" cy="30" r="2" fill="#fff"/>
            <!-- Large Wizard Hat with Stars -->
            <ellipse cx="50" cy="16" rx="20" ry="4" fill="#ffd700"/>
            <path d="M50,-6 Q45,2 35,15 L65,15 Q55,2 50,-6" fill="#1c003a"/>
            <circle cx="50" cy="-6" r="3.5" fill="#00ffff" class="sparkle"/>
            <!-- Star Wand -->
            <line x1="72" y1="40" x2="85" y2="70" stroke="#ffd700" stroke-width="3"/>
            <polygon points="72,36 74,42 80,42 75,45 77,51 72,47 67,51 69,45 64,42 70,42" fill="#00ffff"/>
          </svg>`
    }
  };

  // --- HTML Elements Selectors ---
  const el = {
    // Top stats
    starsCount: document.getElementById('stars-count'),
    playerLevel: document.getElementById('player-level'),
    xpFill: document.getElementById('xp-fill'),
    xpText: document.getElementById('xp-text'),
    muteBtn: document.getElementById('mute-btn'),
    pwaInstallBtn: document.getElementById('pwa-install-btn'),
    
    // Nav tabs
    tabBtns: document.querySelectorAll('.nav-tab'),
    screens: document.querySelectorAll('.game-screen'),
    
    // Pet Dialog & screen
    petSelectionOverlay: document.getElementById('pet-selection-overlay'),
    petSelectCards: document.querySelectorAll('.pet-select-card'),
    petVisual: document.getElementById('pet-visual'),
    petName: document.getElementById('pet-name'),
    petType: document.getElementById('pet-type'),
    petLevel: document.getElementById('pet-level'),
    petEnergyFill: document.getElementById('pet-energy-fill'),
    petEnergyText: document.getElementById('pet-energy-text'),
    petXpFill: document.getElementById('pet-xp-fill'),
    petXpText: document.getElementById('pet-xp-text'),
    feedBtn: document.getElementById('feed-btn'),
    playPetBtn: document.getElementById('play-pet-btn'),
    
    // Town elements
    townBoard: document.getElementById('town-board'),
    inventoryList: document.getElementById('town-inventory-list'),
    clearTownBtn: document.getElementById('clear-town-btn'),
    
    // Shop elements
    shopGrid: document.getElementById('shop-items-grid'),
    shopCategoryTabs: document.querySelectorAll('.shop-tab'),
    
    // Quests elements
    questsList: document.getElementById('quests-list'),
    
    // Quiz modal
    quizModal: document.getElementById('quiz-modal'),
    quizHudFill: document.getElementById('quiz-hud-fill'),
    quizHudText: document.getElementById('quiz-hud-text'),
    quizCloseBtn: document.getElementById('quiz-close-btn'),
    quizQuestionBox: document.getElementById('quiz-question-box'),
    quizChoicesGrid: document.getElementById('quiz-choices-grid'),
    quizHintBtn: document.getElementById('quiz-hint-btn'),
    quizHintContainer: document.getElementById('quiz-hint-container'),
    
    // Feedback overlay
    quizFeedbackOverlay: document.getElementById('quiz-feedback-overlay'),
    feedbackIcon: document.getElementById('feedback-icon'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackMessage: document.getElementById('feedback-message'),
    feedbackStars: document.getElementById('feedback-stars-val'),
    feedbackXp: document.getElementById('feedback-xp-val'),
    feedbackNextBtn: document.getElementById('feedback-next-btn'),

    // Regions on Map
    regionCards: document.querySelectorAll('.region-card')
  };

  // --- Local Storage Integration ---
  function loadGame() {
    const saved = localStorage.getItem('math_island_save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle version updates
        state = { ...state, ...parsed };
        state.player = { ...state.player, ...parsed.player };
        state.pet = { ...state.pet, ...parsed.pet };
        state.inventory = { ...state.inventory, ...parsed.inventory };
      } catch (err) {
        console.error("Failed to parse save data:", err);
      }
    }
    
    // Ensure daily quests are valid or reset
    checkQuestReset();
  }

  function saveGame() {
    localStorage.setItem('math_island_save', JSON.stringify(state));
  }

  // --- UI Update Functions ---
  function updateDashboardUI() {
    el.starsCount.textContent = state.player.stars;
    el.playerLevel.textContent = `مستوى ${state.player.level}`;
    
    const xpPercent = Math.min(100, (state.player.xp / state.player.xpNeeded) * 100);
    el.xpFill.style.width = `${xpPercent}%`;
    el.xpText.textContent = `${state.player.xp}/${state.player.xpNeeded} XP`;
    
    // Update Mute button icon
    el.muteBtn.textContent = window.gameAudio.isMuted ? '🔇' : '🔊';
  }

  // --- Tab Switcher ---
  el.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.gameAudio.playClick();
      const screenId = btn.getAttribute('data-screen');
      
      el.tabBtns.forEach(b => b.classList.remove('active'));
      el.screens.forEach(s => s.classList.remove('active'));
      
      btn.classList.add('active');
      const activeScreen = document.getElementById(`${screenId}-screen`);
      if (activeScreen) activeScreen.classList.add('active');

      // Hook for specific screens
      if (screenId === 'pet') {
        renderPetScreen();
      } else if (screenId === 'town') {
        renderTownBoard();
        renderTownInventory();
      } else if (screenId === 'shop') {
        renderShop('food'); // default category
      } else if (screenId === 'challenges') {
        renderQuests();
      } else if (screenId === 'map') {
        renderMapScreen();
      }
    });
  });

  // --- AUDIO MUTE BUTTON ---
  el.muteBtn.addEventListener('click', () => {
    const isMuted = window.gameAudio.toggleMute();
    el.muteBtn.textContent = isMuted ? '🔇' : '🔊';
    // If unmuted, play click to confirm
    if (!isMuted) {
      window.gameAudio.playClick();
    }
  });

  // --- PWA Installation Flow ---
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to show the install button
    el.pwaInstallBtn.style.display = 'flex';
  });

  el.pwaInstallBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    window.gameAudio.playClick();
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again
    deferredPrompt = null;
    // Hide the install button
    el.pwaInstallBtn.style.display = 'none';
  });

  window.addEventListener('appinstalled', () => {
    console.log('Math Island App installed successfully!');
    el.pwaInstallBtn.style.display = 'none';
  });

  // --- SCREEN: Map & Levels ---
  function renderMapScreen() {
    el.regionCards.forEach(card => {
      const regionId = card.getAttribute('data-region');
      const isUnlocked = state.unlockedRegions.includes(regionId);
      const levelsContainer = card.querySelector('.region-levels-container');
      const unlockBtn = card.querySelector('.region-unlock-cost');
      
      // Clear levels
      levelsContainer.innerHTML = '';
      if (unlockBtn) unlockBtn.remove();
      
      if (isUnlocked) {
        card.classList.remove('locked');
        
        // Render 5 levels
        const compLevels = state.completedLevels[regionId] || [];
        for (let l = 1; l <= 5; l++) {
          const dot = document.createElement('div');
          dot.classList.add('level-dot');
          dot.textContent = l;
          
          if (compLevels.includes(l)) {
            dot.classList.add('completed');
          } else if (l === 1 || compLevels.includes(l - 1)) {
            dot.classList.add('active-now');
            dot.addEventListener('click', (e) => {
              e.stopPropagation(); // prevent card click
              startQuiz(regionId, l);
            });
          } else {
            // locked level inside unlocked region
            dot.classList.add('level-locked');
          }
          levelsContainer.appendChild(dot);
        }
      } else {
        card.classList.add('locked');
        
        // Render Unlock Button
        const cost = REGION_UNLOCK_COSTS[regionId];
        const unlock = document.createElement('button');
        unlock.className = 'region-unlock-cost';
        unlock.innerHTML = `🔓 افتح المنطقة مقابل ${cost} 🌟`;
        unlock.addEventListener('click', (e) => {
          e.stopPropagation();
          unlockRegion(regionId, cost);
        });
        card.appendChild(unlock);
      }
    });
  }

  function unlockRegion(regionId, cost) {
    if (state.player.stars >= cost) {
      state.player.stars -= cost;
      state.unlockedRegions.push(regionId);
      window.gameAudio.playLevelUp(); // Triumph sound!
      
      // Spawn confetti
      triggerConfetti(50);
      
      saveGame();
      updateDashboardUI();
      renderMapScreen();
    } else {
      window.gameAudio.playFailure();
      alert(`عذراً، أنت بحاجة إلى ${cost} نجوم سحرية لفتح هذه المنطقة. حل التمارين لتجمع المزيد!`);
    }
  }

  // Set card clicks to launch next active level of unlocked region
  el.regionCards.forEach(card => {
    card.addEventListener('click', () => {
      const regionId = card.getAttribute('data-region');
      if (!state.unlockedRegions.includes(regionId)) return;
      
      const compLevels = state.completedLevels[regionId] || [];
      let nextLevel = 1;
      for (let l = 1; l <= 5; l++) {
        if (!compLevels.includes(l)) {
          nextLevel = l;
          break;
        }
      }
      if (nextLevel <= 5) {
        startQuiz(regionId, nextLevel);
      } else {
        // replay level 5
        startQuiz(regionId, 5);
      }
    });
  });

  // --- SCREEN: Pet Companion (المرافق الأليف) ---
  function renderPetScreen() {
    if (!state.pet.selected) {
      el.petSelectionOverlay.style.display = 'flex';
      return;
    }
    
    el.petSelectionOverlay.style.display = 'none';
    
    // Evolve state check
    // Stage 1: level 1-4, Stage 2: level 5-9, Stage 3: level 10+
    let stage = 1;
    let stageName = 'طفل صغير 🥚';
    if (state.pet.level >= 10) {
      stage = 3;
      stageName = 'حكيم سحري أسطوري 🌌';
    } else if (state.pet.level >= 5) {
      stage = 2;
      stageName = 'مرافق يافع متطور 🔥';
    }
    
    // Render SVG
    el.petVisual.innerHTML = PET_SVGS[state.pet.selected][stage] + `<div class="pet-shadow"></div>`;
    
    // Name translating
    const petTypes = { dragon: 'تنين النار', phoenix: 'عنقاء البرق', kitty: 'القط السحري' };
    el.petName.textContent = state.pet.name || petTypes[state.pet.selected];
    el.petType.textContent = stageName;
    el.petLevel.textContent = `مستوى الأليف: ${state.pet.level}`;
    
    // Energy progress
    const energyPct = (state.pet.energy / state.pet.maxEnergy) * 100;
    el.petEnergyFill.style.width = `${energyPct}%`;
    el.petEnergyText.textContent = `${state.pet.energy}/${state.pet.maxEnergy}`;
    
    // XP progress
    const xpPct = (state.pet.xp / state.pet.xpNeeded) * 100;
    el.petXpFill.style.width = `${xpPct}%`;
    el.petXpText.textContent = `${state.pet.xp}/${state.pet.xpNeeded} XP`;
    
    // Feeding button availability
    const berryQty = state.inventory['star_berry'] || 0;
    const appleQty = state.inventory['magic_apple'] || 0;
    const candyQty = state.inventory['cosmic_candy'] || 0;
    
    el.feedBtn.innerHTML = `🍎 أطعم الأليف (مخزونك: ${berryQty + appleQty + candyQty})`;
    
    // disable buttons if no energy or items
    if (berryQty + appleQty + candyQty === 0) {
      el.feedBtn.disabled = true;
    } else {
      el.feedBtn.disabled = false;
    }
    
    if (state.pet.energy >= state.pet.maxEnergy) {
      el.feedBtn.disabled = true;
      el.feedBtn.innerHTML = `الأليف ممتلئ تماماً 😋`;
    }
  }

  // Pet selection click handler
  el.petSelectCards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-pet-type');
      let defaultName = '';
      if (type === 'dragon') defaultName = 'لهبوش';
      else if (type === 'phoenix') defaultName = 'شرارة';
      else defaultName = 'مشمش';
      
      const petName = prompt(`ماذا تريد أن تسمي مرافقك الأليف؟`, defaultName) || defaultName;
      
      state.pet.selected = type;
      state.pet.name = petName;
      state.pet.level = 1;
      state.pet.xp = 0;
      state.pet.energy = 50;
      
      window.gameAudio.playEvolve(); // Magical portal noise
      triggerConfetti(60);
      
      saveGame();
      renderPetScreen();
    });
  });

  // Feeding action
  el.feedBtn.addEventListener('click', () => {
    // Spend the cheapest food item first
    let selectedFood = null;
    if (state.inventory['star_berry'] > 0) selectedFood = 'star_berry';
    else if (state.inventory['magic_apple'] > 0) selectedFood = 'magic_apple';
    else if (state.inventory['cosmic_candy'] > 0) selectedFood = 'cosmic_candy';
    
    if (!selectedFood) return;
    
    const foodData = SHOP_ITEMS[selectedFood];
    state.inventory[selectedFood]--;
    
    state.pet.energy = Math.min(state.pet.maxEnergy, state.pet.energy + foodData.energy);
    
    // Add XP to pet
    addPetXp(foodData.xp);
    
    window.gameAudio.playBuy(); // crunch/ding sound
    triggerConfetti(20);
    
    // Quest progress
    updateQuestProgress('feed', 1);
    
    saveGame();
    renderPetScreen();
  });

  function addPetXp(amount) {
    let currentStage = 1;
    if (state.pet.level >= 10) currentStage = 3;
    else if (state.pet.level >= 5) currentStage = 2;

    state.pet.xp += amount;
    while (state.pet.xp >= state.pet.xpNeeded) {
      state.pet.xp -= state.pet.xpNeeded;
      state.pet.level++;
      state.pet.xpNeeded = Math.floor(state.pet.xpNeeded * 1.3);
      
      // Visual feedback
      alert(`🎉 مبروك! ترقى مرافقك الأليف إلى المستوى ${state.pet.level}!`);
      
      // check if it evolved!
      let newStage = 1;
      if (state.pet.level >= 10) newStage = 3;
      else if (state.pet.level >= 5) newStage = 2;

      if (newStage > currentStage) {
        window.gameAudio.playEvolve();
        alert(`🌟 مذهل! لقد تطور شكل مرافقك الأليف وأصبح أقوى! 🌟`);
        triggerConfetti(100);
      } else {
        window.gameAudio.playLevelUp();
      }
    }
  }

  // Play Pet action
  el.playPetBtn.addEventListener('click', () => {
    // Energy decreases but gives player XP and rewards!
    if (state.pet.energy >= 15) {
      state.pet.energy -= 15;
      
      // Earn 5 stars & 10 player XP
      state.player.stars += 5;
      addPlayerXp(12);
      
      // Give pet 5 XP too
      addPetXp(5);
      
      window.gameAudio.playSuccess();
      triggerConfetti(15);
      
      saveGame();
      updateDashboardUI();
      renderPetScreen();
    } else {
      window.gameAudio.playFailure();
      alert(`أليفك متعب جداً! طاقته أقل من 15. يرجى إطعامه أولاً لكي يتمكن من اللعب.`);
    }
  });

  function addPlayerXp(amount) {
    state.player.xp += amount;
    while (state.player.xp >= state.player.xpNeeded) {
      state.player.xp -= state.player.xpNeeded;
      state.player.level++;
      state.player.xpNeeded = Math.floor(state.player.xpNeeded * 1.4);
      
      window.gameAudio.playLevelUp();
      alert(`🎉 رائع! لقد زاد مستواك كبطل للرياضيات وأصبحت في المستوى ${state.player.level}! 🎉`);
      triggerConfetti(80);
    }
  }

  // --- SCREEN: Magic Town (المدينة السحرية) ---
  let selectedInventoryItem = null;
  
  function renderTownBoard() {
    el.townBoard.innerHTML = '';
    
    state.town.forEach((cellItem, index) => {
      const cell = document.createElement('div');
      cell.classList.add('board-cell');
      cell.setAttribute('data-index', index);
      
      if (cellItem) {
        cell.classList.add('occupied');
        cell.textContent = cellItem.emoji;
        cell.title = cellItem.name;
      } else if (selectedInventoryItem) {
        cell.classList.add('empty-place-hint');
      }
      
      cell.addEventListener('click', () => {
        handleCellClick(index);
      });
      
      el.townBoard.appendChild(cell);
    });
  }

  function renderTownInventory() {
    el.inventoryList.innerHTML = '';
    let hasItems = false;
    
    Object.keys(state.inventory).forEach(key => {
      const itemData = SHOP_ITEMS[key];
      if (itemData && itemData.type === 'town' && state.inventory[key] > 0) {
        hasItems = true;
        const row = document.createElement('div');
        row.className = 'inventory-item-row';
        if (selectedInventoryItem === key) {
          row.classList.add('selected');
        }
        
        row.innerHTML = `
          <div class="item-visual-info">
            <span class="item-emoji">${itemData.emoji}</span>
            <span class="item-name">${itemData.name}</span>
          </div>
          <span class="item-qty">${state.inventory[key]}x</span>
        `;
        
        row.addEventListener('click', () => {
          window.gameAudio.playClick();
          if (selectedInventoryItem === key) {
            selectedInventoryItem = null; // deselect
          } else {
            selectedInventoryItem = key; // select
          }
          renderTownInventory();
          renderTownBoard();
        });
        
        el.inventoryList.appendChild(row);
      }
    });
    
    if (!hasItems) {
      el.inventoryList.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.8rem; padding: 20px 0;">
        حقيبتك فارغة من المباني! اذهب للمتجر لشراء خيام، أشجار أو قلاع.
      </div>`;
    }
  }

  function handleCellClick(index) {
    const existingItem = state.town[index];
    
    if (selectedInventoryItem) {
      // Place mode
      if (existingItem) {
        // Cell is already full, cannot place
        window.gameAudio.playFailure();
        return;
      }
      
      // Place new item
      const itemData = SHOP_ITEMS[selectedInventoryItem];
      state.town[index] = {
        key: selectedInventoryItem,
        name: itemData.name,
        emoji: itemData.emoji
      };
      
      // Deduct from inventory
      state.inventory[selectedInventoryItem]--;
      if (state.inventory[selectedInventoryItem] === 0) {
        selectedInventoryItem = null; // no more left
      }
      
      window.gameAudio.playBuy(); // pop placing sound
      triggerConfetti(10, el.townBoard.children[index]);
      
      saveGame();
      renderTownBoard();
      renderTownInventory();
    } else {
      // Remove mode (click placed item to return it to inventory)
      if (existingItem) {
        const itemKey = existingItem.key;
        state.inventory[itemKey] = (state.inventory[itemKey] || 0) + 1;
        state.town[index] = null;
        
        window.gameAudio.playClick();
        
        saveGame();
        renderTownBoard();
        renderTownInventory();
      }
    }
  }

  el.clearTownBtn.addEventListener('click', () => {
    // Return all items to inventory
    let itemsReturned = false;
    state.town.forEach((item, index) => {
      if (item) {
        state.inventory[item.key] = (state.inventory[item.key] || 0) + 1;
        state.town[index] = null;
        itemsReturned = true;
      }
    });
    
    if (itemsReturned) {
      window.gameAudio.playClick();
      selectedInventoryItem = null;
      saveGame();
      renderTownBoard();
      renderTownInventory();
    }
  });

  // --- SCREEN: Shop (المتجر السحري) ---
  el.shopCategoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      window.gameAudio.playClick();
      el.shopCategoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-category');
      renderShop(category);
    });
  });

  function renderShop(category) {
    el.shopGrid.innerHTML = '';
    
    Object.keys(SHOP_ITEMS).forEach(key => {
      const item = SHOP_ITEMS[key];
      // Filter by category
      if ((category === 'food' && item.type === 'food') || (category === 'town' && item.type === 'town')) {
        const card = document.createElement('div');
        card.className = 'shop-card';
        
        const canBuy = state.player.stars >= item.cost;
        
        card.innerHTML = `
          <div class="shop-card-visual">${item.emoji}</div>
          <div class="shop-card-name">${item.name}</div>
          <div class="shop-card-effect">${item.effect}</div>
          <button class="shop-buy-btn" ${canBuy ? '' : 'disabled'}>
            شراء ${item.cost} 🌟
          </button>
        `;
        
        const buyBtn = card.querySelector('.shop-buy-btn');
        buyBtn.addEventListener('click', () => {
          buyItem(key, item.cost);
        });
        
        el.shopGrid.appendChild(card);
      }
    });
  }

  function buyItem(itemKey, cost) {
    if (state.player.stars >= cost) {
      state.player.stars -= cost;
      state.inventory[itemKey] = (state.inventory[itemKey] || 0) + 1;
      
      window.gameAudio.playBuy();
      triggerConfetti(20);
      
      // Update quest
      updateQuestProgress('buy', 1);
      
      saveGame();
      updateDashboardUI();
      
      // Re-render active shop category
      const activeTab = document.querySelector('.shop-tab.active');
      const activeCat = activeTab ? activeTab.getAttribute('data-category') : 'food';
      renderShop(activeCat);
    }
  }

  // --- SCREEN: Challenges (المهام والتحديات اليومية) ---
  function checkQuestReset() {
    const today = new Date().toDateString();
    if (state.lastQuestReset !== today) {
      // Reset progress
      state.quests.forEach(q => {
        q.progress = 0;
        q.claimed = false;
      });
      state.lastQuestReset = today;
      saveGame();
    }
  }

  function updateQuestProgress(type, amount) {
    state.quests.forEach(q => {
      if (q.type === type && !q.claimed) {
        q.progress = Math.min(q.target, q.progress + amount);
      }
    });
    saveGame();
  }

  function renderQuests() {
    el.questsList.innerHTML = '';
    
    state.quests.forEach(q => {
      const card = document.createElement('div');
      card.className = 'quest-card';
      const isDone = q.progress >= q.target;
      if (isDone) card.classList.add('completed');
      
      const pct = (q.progress / q.target) * 100;
      
      let actionHtml = '';
      if (q.claimed) {
        actionHtml = `<span class="quest-done-tag">✅ تم الاستلام</span>`;
      } else if (isDone) {
        actionHtml = `<button class="claim-btn">احصل على ${q.reward} 🌟</button>`;
      } else {
        actionHtml = `
          <div class="quest-reward-badge">
            <span>+${q.reward}</span>
            <span>🌟</span>
          </div>
        `;
      }
      
      const emojiMap = { math: '📝', feed: '🍖', buy: '🛒' };
      
      card.innerHTML = `
        <div class="quest-info-block">
          <div class="quest-icon">${emojiMap[q.type] || '✨'}</div>
          <div class="quest-details">
            <span class="quest-name">${q.text}</span>
            <div class="quest-progress-track">
              <div class="quest-bar-bg">
                <div class="quest-bar-fill" style="width: ${pct}%"></div>
              </div>
              <span class="quest-text-prog">${q.progress}/${q.target}</span>
            </div>
          </div>
        </div>
        <div class="quest-reward-action">
          ${actionHtml}
        </div>
      `;
      
      if (isDone && !q.claimed) {
        const cBtn = card.querySelector('.claim-btn');
        cBtn.addEventListener('click', () => {
          claimQuestReward(q.id);
        });
      }
      
      el.questsList.appendChild(card);
    });
  }

  function claimQuestReward(questId) {
    const quest = state.quests.find(q => q.id === questId);
    if (quest && quest.progress >= quest.target && !quest.claimed) {
      quest.claimed = true;
      state.player.stars += quest.reward;
      
      window.gameAudio.playLevelUp(); // Ding triumphant sound
      triggerConfetti(35);
      
      saveGame();
      updateDashboardUI();
      renderQuests();
    }
  }

  // --- QUIZ OVERLAY SYSTEM (محرك اللعب التفاعلي والأسئلة) ---
  let currentQuiz = {
    regionId: '',
    level: 1,
    questionIndex: 0,
    totalQuestions: 5,
    correctCount: 0,
    activeQuestion: null,
    earnedStars: 0,
    earnedXp: 0,
    hintUsed: false
  };

  function startQuiz(regionId, level) {
    currentQuiz.regionId = regionId;
    currentQuiz.level = level;
    currentQuiz.questionIndex = 0;
    currentQuiz.correctCount = 0;
    currentQuiz.earnedStars = 0;
    currentQuiz.earnedXp = 0;
    currentQuiz.hintUsed = false;
    
    // Hide hint panel
    el.quizHintContainer.style.display = 'none';
    
    // Show Modal
    el.quizModal.style.display = 'flex';
    
    // Load first question
    loadNextQuizQuestion();
  }

  function loadNextQuizQuestion() {
    // Hide hint panel
    el.quizHintContainer.style.display = 'none';
    currentQuiz.hintUsed = false;
    
    // Update Progress bar
    const progressPct = (currentQuiz.questionIndex / currentQuiz.totalQuestions) * 100;
    el.quizHudFill.style.width = `${progressPct}%`;
    el.quizHudText.textContent = `السؤال ${currentQuiz.questionIndex + 1} / ${currentQuiz.totalQuestions}`;
    
    // Generate new question from library
    const qData = window.mathEngine.generateQuestion(currentQuiz.regionId, currentQuiz.level);
    currentQuiz.activeQuestion = qData;
    
    // Populate Question HTML
    el.quizQuestionBox.innerHTML = qData.questionHtml;
    
    // Populate choices grid
    el.quizChoicesGrid.innerHTML = '';
    qData.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleChoiceClick(idx, btn));
      el.quizChoicesGrid.appendChild(btn);
    });
    
    // Update Hint button content
    el.quizHintBtn.style.display = qData.hint ? 'block' : 'none';
  }

  function handleChoiceClick(idx, buttonEl) {
    const isCorrect = idx === currentQuiz.activeQuestion.correctIndex;
    
    // Disable all options during review
    const allButtons = el.quizChoicesGrid.querySelectorAll('.choice-btn');
    
    if (isCorrect) {
      window.gameAudio.playSuccess();
      buttonEl.classList.add('correct-choice');
      allButtons.forEach(btn => btn.disabled = true);
      
      triggerConfetti(30, buttonEl);
      
      // Calculate rewards
      const baseReward = currentQuiz.activeQuestion.reward;
      // Bonus: if no hint used, extra stars!
      const bonus = currentQuiz.hintUsed ? 0 : 2;
      
      currentQuiz.earnedStars += baseReward + bonus;
      currentQuiz.earnedXp += Math.ceil(baseReward * 1.2);
      
      currentQuiz.correctCount++;
      currentQuiz.questionIndex++;
      
      // Move forward after 1 second
      setTimeout(() => {
        if (currentQuiz.questionIndex < currentQuiz.totalQuestions) {
          loadNextQuizQuestion();
        } else {
          finishQuiz();
        }
      }, 1200);
      
    } else {
      window.gameAudio.playFailure();
      buttonEl.classList.add('wrong-choice');
      buttonEl.disabled = true; // disable this wrong one so they try others
      
      // Deduct 1 star penalty, but not below 0 stars per question
      // This is a gentle reminder, not punishing kids. They can still retry!
    }
  }

  el.quizHintBtn.addEventListener('click', () => {
    window.gameAudio.playClick();
    if (currentQuiz.activeQuestion && currentQuiz.activeQuestion.hint) {
      el.quizHintContainer.innerHTML = `💡 <strong>تلميح مساعد:</strong> ${currentQuiz.activeQuestion.hint}`;
      el.quizHintContainer.style.display = 'block';
      currentQuiz.hintUsed = true;
    }
  });

  el.quizCloseBtn.addEventListener('click', () => {
    window.gameAudio.playClick();
    if (confirm('هل تريد حقاً مغادرة المغامرة وفقدان التقدم الحالي في هذا المستوى؟')) {
      el.quizModal.style.display = 'none';
    }
  });

  function finishQuiz() {
    // Add rewards to player state
    state.player.stars += currentQuiz.earnedStars;
    addPlayerXp(currentQuiz.earnedXp);
    
    // Quest progress
    updateQuestProgress('math', currentQuiz.totalQuestions);
    
    // Mark level completed on map
    const region = currentQuiz.regionId;
    const level = currentQuiz.level;
    if (!state.completedLevels[region].includes(level)) {
      state.completedLevels[region].push(level);
    }
    
    // Play triumphant sound
    window.gameAudio.playLevelUp();
    triggerConfetti(80);
    
    // Display feedback screen inside modal
    el.quizFeedbackOverlay.style.display = 'flex';
    el.feedbackIcon.textContent = '🏆';
    el.feedbackTitle.textContent = 'مستوى مكتمل بنجاح!';
    
    const regionNames = { arithmetic: 'غابة الأرقام', patterns: 'وادي الأنماط', geometry: 'جبل الأشكال', logic: 'شاطئ الألغاز' };
    el.feedbackMessage.textContent = `تهانينا البطل! لقد أنهيت بنجاح المستوى (${level}) في منطقة (${regionNames[region]}). لقد طورت ذكائك وربحت جوائز رائعة!`;
    
    el.feedbackStars.textContent = `+${currentQuiz.earnedStars}`;
    el.feedbackXp.textContent = `+${currentQuiz.earnedXp} XP`;
    
    saveGame();
    updateDashboardUI();
  }

  el.feedbackNextBtn.addEventListener('click', () => {
    window.gameAudio.playClick();
    // Close overlays
    el.quizFeedbackOverlay.style.display = 'none';
    el.quizModal.style.display = 'none';
    
    // Re-render map
    renderMapScreen();
  });

  // --- Confetti particle generator ---
  function triggerConfetti(count, anchorEl) {
    const parent = anchorEl || document.getElementById('game-container');
    const rect = parent.getBoundingClientRect();
    
    const colors = ['#ffd700', '#00ffd5', '#ff4a7d', '#7000ff', '#ffffff'];
    
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      
      const pColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.backgroundColor = pColor;
      
      // Calculate drop position
      let startX, startY;
      if (anchorEl) {
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      } else {
        startX = rect.left + rect.width * (0.2 + Math.random() * 0.6);
        startY = rect.top + rect.height * 0.3;
      }
      
      // relative coordinates inside game container
      const containerRect = document.getElementById('game-container').getBoundingClientRect();
      const x = startX - containerRect.left;
      const y = startY - containerRect.top;
      
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      
      // randomize motion vectors
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 150;
      const targetX = Math.cos(angle) * velocity;
      const targetY = Math.sin(angle) * velocity + 100; // gravity pull
      
      p.style.setProperty('--x', `${targetX}px`);
      p.style.setProperty('--y', `${targetY}px`);
      p.style.setProperty('--r', `${Math.floor(Math.random() * 360)}deg`);
      
      document.getElementById('game-container').appendChild(p);
      
      // Cleanup particle after animation finishes
      setTimeout(() => {
        p.remove();
      }, 2000);
    }
  }

  // --- Initialization ---
  loadGame();
  updateDashboardUI();
  
  // Set default view active (Map view)
  const defaultTab = document.querySelector('.nav-tab[data-screen="map"]');
  if (defaultTab) defaultTab.click();
});
