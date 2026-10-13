/* ==========================================================================
   ZENLESS ZONE ZERO (ZZZ) SOUND & INTERACTIVITY ENGINE
   CLIENT: 嚴幼喬 (帥哥) // 2D 乞討繪師
   ========================================================================== */

(function () {
  'use strict';

  // 1. WEB AUDIO API SYNTHESIZER (ZZZ Sound Effects)
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'accept') {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';

        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.setValueAtTime(880, now + 0.08); // A5
        osc2.frequency.setValueAtTime(880, now);
        osc2.frequency.setValueAtTime(1174.66, now + 0.08); // D6

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.25);
        osc2.stop(now + 0.25);
      } else if (type === 'coin') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 2. TOAST SYSTEM
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // 3. SFX & CRT CONTROLS
  const sfxBtn = document.getElementById('sfxToggleBtn');
  const crtBtn = document.getElementById('crtToggleBtn');

  if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      const label = sfxBtn.querySelector('.hud-btn-label');
      const icon = sfxBtn.querySelector('.hud-btn-icon');
      if (sfxEnabled) {
        label.innerText = 'SFX: ON';
        icon.innerText = '🔊';
        playSound('accept');
        showToast('🔊 音效反饋已開啟');
      } else {
        label.innerText = 'SFX: OFF';
        icon.innerText = '🔇';
        showToast('🔇 音效已靜音');
      }
    });
  }

  if (crtBtn) {
    crtBtn.addEventListener('click', () => {
      document.body.classList.toggle('crt-enabled');
      const isCrt = document.body.classList.contains('crt-enabled');
      const label = crtBtn.querySelector('.hud-btn-label');
      label.innerText = isCrt ? 'CRT: ON' : 'CRT: OFF';
      playSound('click');
      showToast(isCrt ? '📺 CRT 掃描線渲染已啟動' : '📺 畫面已切換為純淨現代模式');
    });
  }

  // Delegate SFX on elements with data-sfx
  document.addEventListener('click', (e) => {
    const sfxTarget = e.target.closest('[data-sfx]');
    if (sfxTarget) {
      const sfxType = sfxTarget.getAttribute('data-sfx') || 'click';
      playSound(sfxType);
    }
  });

  // 4. HERO POSTER 3D TILT EFFECT
  const heroCard = document.getElementById('agentCard');
  const heroDisplay = document.querySelector('.hero-right-display');

  if (heroCard && heroDisplay) {
    heroDisplay.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const tiltX = (y / (rect.height / 2)) * -12;
      const tiltY = (x / (rect.width / 2)) * 12;

      heroCard.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroDisplay.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 5. BEGGAR COIN CLICKER EASTER EGG (投擲丁尼)
  const beggarBtn = document.getElementById('beggarCoinBtn');
  const coinLayer = document.getElementById('coinLayer');
  let coinCount = 0;

  if (beggarBtn && coinLayer) {
    beggarBtn.addEventListener('click', (e) => {
      coinCount++;
      playSound('coin');

      // Create floating coin
      const coin = document.createElement('div');
      coin.className = 'flying-coin';
      
      const coinTexts = ['+1 ₮', '+10 丁尼', '帥氣度UP!', '拉麵基金+1', '🍜', '🪙'];
      coin.innerText = coinTexts[Math.floor(Math.random() * coinTexts.length)];
      
      const rect = beggarBtn.getBoundingClientRect();
      coin.style.left = `${rect.left + rect.width / 2 + (Math.random() * 60 - 30)}px`;
      coin.style.top = `${rect.top}px`;

      coinLayer.appendChild(coin);
      setTimeout(() => coin.remove(), 1200);

      if (coinCount === 3) {
        showToast('帥哥嚴幼喬對你眨了下眼睛：「感謝好心繩匠！今天能加一顆溫泉蛋了！」');
      } else if (coinCount === 7) {
        showToast('【乞討成就解鎖】：好心的大金主！幼喬手速提升 50%！');
      }
    });
  }

  // 6. GALLERY FILTERING & LIGHTBOX
  const filterBtns = document.querySelectorAll('.filter-btn');
  const artCards = document.querySelectorAll('.art-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      artCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal Data
  const artworkData = {
    ramen: {
      title: '【乞討日常】WILL DRAW FOR RAMEN',
      category: 'MEME & DAILY LIFE',
      rank: 'S-RANK',
      desc: '真實寫照！嚴幼喬在新艾利都六分街暗巷，坐在紅色塑膠啤酒箱上狂按電繪筆。身後是吃完堆成山的一蘭與特大號泡麵碗，以及拿著金幣前來投餵的可愛邦布同伴。即使身無分文，帥氣的眼神依然堅定不移！',
      image: 'assets/images/art_ramen.jpg',
      foodSpent: '豚骨泡麵 x48 + 冰美式 x5',
      speed: '神速 500 RPM'
    },
    rebel: {
      title: '【空洞突襲】SHADOW SLICER',
      category: 'ACTION KEY VISUAL',
      rank: 'S-RANK',
      desc: '為新艾利都委託人量身訂製的高張力戰鬥插畫。雙馬尾刺客在破壞的霓虹街區中高速俯衝，雙持以太光刃撕裂以太骸物，背景噴灑出強烈的塗鴉美學與爆破文字，呈現極致視線引導。',
      image: 'assets/images/art_rebel.jpg',
      foodSpent: '特大份鰻魚飯便當 x1',
      speed: '24 小時極限出圖'
    },
    sniper: {
      title: '【特工立繪】KAELEN // CYBER SNIPER',
      category: 'CONCEPT ART & CHARACTER',
      rank: 'S-RANK',
      desc: '白髮機械臂重裝特工概念設計。冷酷的狙擊手肩負巨大電磁重炮，坐在老式 CRT 顯像管電視堆之上，身旁是拿著噴漆罐的塗鴉邦布 Echo。兼具沉穩冷冽與街頭潮牌機能風。',
      image: 'assets/images/art_sniper.jpg',
      foodSpent: '雙倍起司牛肉漢堡套餐 x2',
      speed: '概念拆分 2 日完稿'
    },
    avatar: {
      title: '【本尊情報】YAN YOU-QIAO // 帥哥',
      category: 'CREATOR DOSSIER',
      rank: 'EX-RANK',
      desc: '新艾利都傳奇街頭 2D 繪師嚴幼喬本人親自立繪。黑髮挑染螢光綠，身穿滿滿安全警示黃黑條紋夾克，配戴全息分析目鏡與發光電繪筆。自帶「帥氣領域光環」，走到哪裡都是目光焦點。',
      image: 'assets/images/avatar.jpg',
      foodSpent: '日常拉麵全席',
      speed: '全天候隨時待命'
    }
  };

  const artModal = document.getElementById('artModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalRank = document.getElementById('modalRank');
  const modalCat = document.getElementById('modalCategory');
  const modalFood = document.getElementById('modalFoodSpent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCommBtn = document.getElementById('modalCommBtn');

  function openModal(artId) {
    const data = artworkData[artId];
    if (!data) return;

    modalImg.src = data.image;
    modalTitle.innerText = data.title;
    modalDesc.innerText = data.desc;
    modalRank.innerText = data.rank;
    modalCat.innerText = data.category;
    modalFood.innerText = data.foodSpent;

    artModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSound('accept');
  }

  function closeModal() {
    artModal.classList.remove('active');
    document.body.style.overflow = '';
    playSound('click');
  }

  artCards.forEach((card) => {
    card.addEventListener('click', () => {
      const artId = card.getAttribute('data-art-id');
      openModal(artId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalCommBtn) modalCommBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && artModal.classList.contains('active')) {
      closeModal();
    }
  });

  // 7. INTERACTIVE FEED & COMMISSION CALCULATOR
  const calcItems = document.querySelectorAll('.calc-item-btn');
  const calcTotalDisplay = document.getElementById('calcTotalDisplay');
  const calcRewardText = document.getElementById('calcRewardText');
  const applyCalcBtn = document.getElementById('applyCalcToFormBtn');

  const itemCounts = {
    coffee: 0,
    ramen: 0,
    bento: 0,
    feast: 0
  };

  calcItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemKey = btn.getAttribute('data-item');
      itemCounts[itemKey] = (itemCounts[itemKey] || 0) + 1;

      // Update badge
      const countEl = document.getElementById(`count-${itemKey}`);
      if (countEl) countEl.innerText = itemCounts[itemKey];
      btn.classList.add('selected');

      playSound('click');
      updateCalculator();
    });
  });

  function updateCalculator() {
    const totalNT =
      itemCounts.coffee * 60 +
      itemCounts.ramen * 180 +
      itemCounts.bento * 350 +
      itemCounts.feast * 1200;

    const dennies = totalNT * 10;
    calcTotalDisplay.innerHTML = `NT$ ${totalNT.toLocaleString()} <span class="calc-dennies">(${dennies.toLocaleString()} 丁尼)</span>`;

    let buffMsg = '';
    if (totalNT === 0) {
      buffMsg = '「目前的狀態只能坐在路邊看著天空嘆氣...快點點選上方食物！」';
    } else if (totalNT < 200) {
      buffMsg = '【熱量回補中】解鎖精緻黑白塗鴉速寫！幼喬眼中重新亮起帥氣光芒！';
    } else if (totalNT < 700) {
      buffMsg = '【戰意狂飆】解鎖賽博潮酷全彩立繪！幼喬吃飽喝足，開始以 400 RPM 超速狂飆畫筆！';
    } else {
      buffMsg = '【S級神聖暴食光環】解鎖頂級全景商業插圖！帥哥幼喬願意為你連續爆肝三天三夜毫無怨言！';
    }

    calcRewardText.innerText = buffMsg;
  }

  if (applyCalcBtn) {
    applyCalcBtn.addEventListener('click', () => {
      const totalNT =
        itemCounts.coffee * 60 +
        itemCounts.ramen * 180 +
        itemCounts.bento * 350 +
        itemCounts.feast * 1200;

      const budgetInput = document.getElementById('budget');
      const detailsInput = document.getElementById('details');

      if (budgetInput && totalNT > 0) {
        budgetInput.value = `NT$ ${totalNT} (${totalNT * 10} 丁尼伙食配給)`;
      }

      if (detailsInput && totalNT > 0) {
        const foodList = [];
        if (itemCounts.coffee > 0) foodList.push(`美式咖啡 x${itemCounts.coffee}`);
        if (itemCounts.ramen > 0) foodList.push(`叉燒拉麵 x${itemCounts.ramen}`);
        if (itemCounts.bento > 0) foodList.push(`炸牛便當 x${itemCounts.bento}`);
        if (itemCounts.feast > 0) foodList.push(`和牛盛宴 x${itemCounts.feast}`);
        detailsInput.value = `【預計投餵伙食】：${foodList.join('、 ')}\n【需求內容】：`;
      }

      // Smooth scroll to form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      showToast('🍜 試算伙食已成功帶入委託終端！');
    });
  }

  // 8. TIER SELECTION BUTTONS IN PRICING TABLE
  const selectTierBtns = document.querySelectorAll('.select-tier-btn');
  selectTierBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tierName = btn.getAttribute('data-tier');
      const typeSelect = document.getElementById('commType');
      const budgetInput = document.getElementById('budget');

      if (typeSelect && budgetInput) {
        budgetInput.value = tierName;
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        showToast(`已鎖定方案：${tierName}`);
      }
    });
  });

  // 9. FORM SUBMISSION
  const commForm = document.getElementById('commissionForm');
  const successModal = document.getElementById('successModal');
  const successCloseBtn = document.getElementById('successCloseBtn');

  if (commForm) {
    commForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSound('accept');

      if (successModal) {
        successModal.classList.add('active');
      }

      commForm.reset();
    });
  }

  if (successCloseBtn && successModal) {
    successCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      playSound('click');
    });
  }

  // 10. ACTIVE LINK HIGHLIGHTING ON SCROLL
  const sections = document.querySelectorAll('main > section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  console.log('%c[ZZZ ENGINE READY] 帥哥嚴幼喬 2D 乞討繪師特工基地啟動完成！', 'background: #e8ff00; color: #000; font-size: 14px; font-weight: bold; padding: 4px 8px;');
})();
