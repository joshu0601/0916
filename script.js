/**
 * Personal Space & Real-Time Clock Engine
 * Built with Vanilla JavaScript
 */

(function () {
  'use strict';

  // --- STATE & DEFAULTS ---
  const DEFAULT_PROFILE = {
    name: 'Joshu',
    dept: '資訊工程學系 (CSIE)',
    specialty: '專長：Web Dev · AI/ML · IoT · 系統設計',
    role: 'Full-Stack Architect & Digital Explorer',
    location: 'Taipei, Taiwan',
    status: 'Available for projects',
    bio: '熱愛探索前沿軟體架構、人機互動介面與人工智慧應用，致力於打造高效能、具直覺美感與流暢互動體驗的現代化數位產品。',
    email: 'joshu0601@users.noreply.github.com',
    avatar: 'avatar.jpg'
  };

  const DEFAULT_FOCUS_ITEMS = [
    { id: '1', text: 'Architect scalable web services & UI components', done: false },
    { id: '2', text: 'Review system design & performance metrics', done: true },
    { id: '3', text: 'Explore innovative modern frontend patterns', done: false }
  ];

  let soundEnabled = false;
  let audioCtx = null;

  // --- DOM ELEMENT REFERENCES ---
  const elements = {
    // Clock
    clockHours: document.getElementById('clock-hours'),
    clockMinutes: document.getElementById('clock-minutes'),
    clockSeconds: document.getElementById('clock-seconds'),
    clockPeriod: document.getElementById('clock-period'),
    clockFullDate: document.getElementById('clock-full-date'),
    secondsCounter: document.getElementById('seconds-counter'),
    secondProgressFill: document.getElementById('second-progress-fill'),
    tzName: document.getElementById('tz-name'),
    tzOffset: document.getElementById('tz-offset'),
    tzDayYear: document.getElementById('tz-day-year'),
    tzDayProgress: document.getElementById('tz-day-progress'),

    // Analog
    analogHourHand: document.getElementById('analog-hour-hand'),
    analogMinuteHand: document.getElementById('analog-minute-hand'),
    analogSecondHand: document.getElementById('analog-second-hand'),
    digitalClockContainer: document.getElementById('digital-clock-container'),
    analogClockContainer: document.getElementById('analog-clock-container'),
    btnViewDigital: document.getElementById('clock-view-digital'),
    btnViewAnalog: document.getElementById('clock-view-analog'),

    // World Clocks
    timeNY: document.getElementById('time-ny'),
    diffNY: document.getElementById('diff-ny'),
    timeLondon: document.getElementById('time-london'),
    diffLondon: document.getElementById('diff-london'),
    timeTokyo: document.getElementById('time-tokyo'),
    diffTokyo: document.getElementById('diff-tokyo'),
    timeSydney: document.getElementById('time-sydney'),
    diffSydney: document.getElementById('diff-sydney'),

    // Greeting & Header
    dynamicGreetingChip: document.getElementById('dynamic-greeting-chip'),
    greetingText: document.getElementById('greeting-text'),
    greetingIcon: document.getElementById('greeting-icon'),
    headerStatusText: document.getElementById('header-status-text'),
    navTitle: document.getElementById('nav-title'),

    // Profile Details
    profileName: document.getElementById('profile-name'),
    profileDept: document.getElementById('profile-dept'),
    profileSpecialty: document.getElementById('profile-specialty'),
    profileRole: document.getElementById('profile-role'),
    profileBio: document.getElementById('profile-bio'),
    profileLocation: document.getElementById('profile-location'),
    profileEmail: document.getElementById('profile-email'),
    profileAvatarImg: document.getElementById('profile-avatar-img'),
    footerName: document.getElementById('footer-name'),
    footerYear: document.getElementById('footer-year'),

    // Modals & Forms
    openEditModalBtn: document.getElementById('open-edit-modal-btn'),
    inlineEditNameBtn: document.getElementById('inline-edit-name-btn'),
    avatarChangeBtn: document.getElementById('avatar-change-btn'),
    editModalOverlay: document.getElementById('edit-modal-overlay'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    cancelModalBtn: document.getElementById('cancel-modal-btn'),
    profileEditForm: document.getElementById('profile-edit-form'),
    resetDefaultsBtn: document.getElementById('reset-defaults-btn'),

    // Form inputs
    inputName: document.getElementById('input-name'),
    inputDept: document.getElementById('input-dept'),
    inputSpecialty: document.getElementById('input-specialty'),
    inputRole: document.getElementById('input-role'),
    inputLocation: document.getElementById('input-location'),
    inputStatus: document.getElementById('input-status'),
    inputEmail: document.getElementById('input-email'),
    inputBio: document.getElementById('input-bio'),
    inputAvatar: document.getElementById('input-avatar'),

    // Action Buttons
    copyTimeBtn: document.getElementById('copy-time-btn'),
    shareProfileBtn: document.getElementById('share-profile-btn'),
    copyEmailActionBtn: document.getElementById('copy-email-action-btn'),
    copyEmailLabel: document.getElementById('copy-email-label'),
    soundToggleBtn: document.getElementById('sound-toggle-btn'),
    soundIcon: document.getElementById('sound-icon'),

    // Theme Switcher
    themeBtn: document.getElementById('theme-btn'),
    themeMenu: document.getElementById('theme-menu'),
    themeOptions: document.querySelectorAll('.theme-option'),

    // Focus List
    focusList: document.getElementById('focus-items-list'),
    addFocusBtn: document.getElementById('add-focus-btn'),
    focusInputRow: document.getElementById('focus-input-row'),
    newFocusInput: document.getElementById('new-focus-input'),
    saveNewFocusBtn: document.getElementById('save-new-focus-btn'),
    cancelNewFocusBtn: document.getElementById('cancel-new-focus-btn'),

    // Toast
    toastContainer: document.getElementById('toast-container')
  };

  // --- AUDIO SYNTHESIZER ---
  function playTickChime() {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, iconClass = 'fa-check') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --- TIME UTILITIES ---
  function padZero(num) {
    return String(num).padStart(2, '0');
  }

  function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  function getUtcOffsetString(date) {
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const hours = padZero(Math.floor(Math.abs(offsetMinutes) / 60));
    const mins = padZero(Math.abs(offsetMinutes) % 60);
    return `UTC${sign}${hours}:${mins}`;
  }

  // --- CLOCK & DATE ENGINE ---
  function updateClock() {
    const now = new Date();

    // 1. Digital Time Components
    let hours24 = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let period = hours24 >= 12 ? 'PM' : 'AM';
    let hours12 = hours24 % 12 || 12;

    if (elements.clockHours) elements.clockHours.textContent = padZero(hours12);
    if (elements.clockMinutes) elements.clockMinutes.textContent = padZero(minutes);
    if (elements.clockSeconds) elements.clockSeconds.textContent = padZero(seconds);
    if (elements.clockPeriod) elements.clockPeriod.textContent = period;
    if (elements.secondsCounter) elements.secondsCounter.textContent = `${padZero(seconds)}s`;

    // 2. Seconds Progress Bar
    if (elements.secondProgressFill) {
      const progressPercent = ((seconds + now.getMilliseconds() / 1000) / 60) * 100;
      elements.secondProgressFill.style.width = `${progressPercent}%`;
    }

    // 3. Full Date Display
    if (elements.clockFullDate) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      elements.clockFullDate.textContent = now.toLocaleDateString(undefined, options);
    }

    // 4. Analog Clock Hands
    if (elements.analogSecondHand) {
      const secDeg = (seconds + now.getMilliseconds() / 1000) * 6;
      const minDeg = (minutes + seconds / 60) * 6;
      const hourDeg = ((hours24 % 12) + minutes / 60) * 30;

      elements.analogSecondHand.style.transform = `rotate(${secDeg}deg)`;
      elements.analogMinuteHand.style.transform = `rotate(${minDeg}deg)`;
      elements.analogHourHand.style.transform = `rotate(${hourDeg}deg)`;
    }

    // 5. Day Progress & Meta Info
    const totalSecondsToday = hours24 * 3600 + minutes * 60 + seconds;
    const dayProgressPercent = ((totalSecondsToday / 86400) * 100).toFixed(1);
    if (elements.tzDayProgress) elements.tzDayProgress.textContent = `${dayProgressPercent}%`;

    const dayOfYear = getDayOfYear(now);
    const weekNum = getWeekNumber(now);
    if (elements.tzDayYear) elements.tzDayYear.textContent = `Day ${dayOfYear} / Wk ${weekNum}`;

    // 6. Audio tick
    if (soundEnabled && seconds !== lastSecondChime) {
      playTickChime();
      lastSecondChime = seconds;
    }
  }

  let lastSecondChime = -1;

  // --- TIMEZONE & WORLD CLOCKS ---
  function updateTimezones() {
    const now = new Date();

    // Local Timezone Info
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Standard Time';
    if (elements.tzName) elements.tzName.textContent = localTz;
    if (elements.tzOffset) elements.tzOffset.textContent = getUtcOffsetString(now);

    // Format World Cities
    const cities = [
      { idTime: elements.timeNY, idDiff: elements.diffNY, timeZone: 'America/New_York', label: 'EST / EDT' },
      { idTime: elements.timeLondon, idDiff: elements.diffLondon, timeZone: 'Europe/London', label: 'GMT / BST' },
      { idTime: elements.timeTokyo, idDiff: elements.diffTokyo, timeZone: 'Asia/Tokyo', label: 'JST' },
      { idTime: elements.timeSydney, idDiff: elements.diffSydney, timeZone: 'Australia/Sydney', label: 'AEST / AEDT' }
    ];

    cities.forEach(city => {
      if (!city.idTime) return;
      try {
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: city.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        city.idTime.textContent = timeStr;

        // Relative offset computation
        const cityDateStr = now.toLocaleString('en-US', { timeZone: city.timeZone });
        const cityDate = new Date(cityDateStr);
        const hourDiff = Math.round((cityDate - now) / 3600000);
        const diffText = hourDiff === 0 ? 'Same time' : (hourDiff > 0 ? `+${hourDiff}h` : `${hourDiff}h`);
        if (city.idDiff) city.idDiff.textContent = `${city.label} (${diffText})`;
      } catch (err) {
        console.warn('World clock calculation error:', err);
      }
    });
  }

  // --- DYNAMIC GREETING ---
  function updateDynamicGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    let iconClass = 'fa-sun';
    let greetingColor = '#feca57';

    if (hour >= 5 && hour < 12) {
      greeting = 'Good morning';
      iconClass = 'fa-sun';
      greetingColor = '#feca57';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Good afternoon';
      iconClass = 'fa-cloud-sun';
      greetingColor = '#ff9f43';
    } else if (hour >= 17 && hour < 21) {
      greeting = 'Good evening';
      iconClass = 'fa-mountain-sun';
      greetingColor = '#ff6b6b';
    } else {
      greeting = 'Burning the midnight oil';
      iconClass = 'fa-moon';
      greetingColor = '#00f2fe';
    }

    if (elements.greetingText) elements.greetingText.textContent = greeting;
    if (elements.greetingIcon) {
      elements.greetingIcon.className = `fa-solid ${iconClass}`;
      elements.greetingIcon.style.color = greetingColor;
    }
  }

  // --- PROFILE STATE & LOCALSTORAGE ---
  function getStoredProfile() {
    try {
      const stored = localStorage.getItem('personal_web_profile');
      if (stored) return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    } catch (e) {
      console.warn('Failed to parse stored profile:', e);
    }
    return { ...DEFAULT_PROFILE };
  }

  function saveStoredProfile(profile) {
    try {
      localStorage.setItem('personal_web_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile:', e);
    }
  }

  function applyProfile(profile) {
    if (elements.profileName) elements.profileName.textContent = profile.name || DEFAULT_PROFILE.name;
    if (elements.profileDept) elements.profileDept.textContent = profile.dept || DEFAULT_PROFILE.dept;
    if (elements.profileSpecialty) elements.profileSpecialty.textContent = profile.specialty || DEFAULT_PROFILE.specialty;
    if (elements.navTitle) elements.navTitle.textContent = `${profile.name || DEFAULT_PROFILE.name}'s Space`;
    if (elements.footerName) elements.footerName.textContent = profile.name || DEFAULT_PROFILE.name;
    document.title = `${profile.name || DEFAULT_PROFILE.name} — 個人首頁 & 即時時鐘`;

    if (elements.profileRole) elements.profileRole.textContent = profile.role || DEFAULT_PROFILE.role;
    if (elements.profileBio) elements.profileBio.textContent = profile.bio || DEFAULT_PROFILE.bio;
    if (elements.headerStatusText) elements.headerStatusText.textContent = profile.status || DEFAULT_PROFILE.status;

    const loc = profile.location || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Taipei, Taiwan';
    if (elements.profileLocation) elements.profileLocation.textContent = loc;

    if (elements.profileEmail) {
      elements.profileEmail.textContent = profile.email || DEFAULT_PROFILE.email;
      const mailLink = document.getElementById('link-mail');
      if (mailLink) mailLink.href = `mailto:${profile.email || DEFAULT_PROFILE.email}`;
    }

    if (elements.profileAvatarImg && profile.avatar) {
      elements.profileAvatarImg.src = profile.avatar;
    }
  }

  function openEditModal() {
    const profile = getStoredProfile();
    elements.inputName.value = profile.name || '';
    if (elements.inputDept) elements.inputDept.value = profile.dept || '';
    if (elements.inputSpecialty) elements.inputSpecialty.value = profile.specialty || '';
    elements.inputRole.value = profile.role || '';
    elements.inputLocation.value = profile.location || '';
    elements.inputStatus.value = profile.status || '';
    elements.inputEmail.value = profile.email || '';
    elements.inputBio.value = profile.bio || '';
    elements.inputAvatar.value = profile.avatar || '';

    elements.editModalOverlay.classList.add('open');
    elements.inputName.focus();
  }

  function closeEditModal() {
    elements.editModalOverlay.classList.remove('open');
  }

  // --- DAILY FOCUS ENGINE ---
  function getStoredFocus() {
    try {
      const stored = localStorage.getItem('personal_web_focus');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading focus items:', e);
    }
    return [...DEFAULT_FOCUS_ITEMS];
  }

  function saveStoredFocus(items) {
    try {
      localStorage.setItem('personal_web_focus', JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving focus items:', e);
    }
  }

  function renderFocusList() {
    if (!elements.focusList) return;
    const items = getStoredFocus();
    elements.focusList.innerHTML = '';

    if (items.length === 0) {
      elements.focusList.innerHTML = `<li class="focus-empty" style="color: var(--text-muted); font-size: 0.85rem; padding: 0.5rem 0;">No active focus goals right now. Click "+ Add" to create one!</li>`;
      return;
    }

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = `focus-item ${item.done ? 'completed' : ''}`;
      li.innerHTML = `
        <div class="focus-item-left">
          <input type="checkbox" class="focus-checkbox" ${item.done ? 'checked' : ''} data-id="${item.id}">
          <span class="focus-text">${item.text}</span>
        </div>
        <button class="focus-del-btn" data-id="${item.id}" title="Remove goal" aria-label="Delete goal">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
      elements.focusList.appendChild(li);
    });

    // Attach listeners
    elements.focusList.querySelectorAll('.focus-checkbox').forEach(chk => {
      chk.addEventListener('change', e => {
        const id = e.target.dataset.id;
        const currentItems = getStoredFocus();
        const target = currentItems.find(i => i.id === id);
        if (target) {
          target.done = e.target.checked;
          saveStoredFocus(currentItems);
          renderFocusList();
        }
      });
    });

    elements.focusList.querySelectorAll('.focus-del-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        let currentItems = getStoredFocus();
        currentItems = currentItems.filter(i => i.id !== id);
        saveStoredFocus(currentItems);
        renderFocusList();
        showToast('Focus item removed', 'fa-trash');
      });
    });
  }

  // --- THEME ENGINE ---
  function initTheme() {
    const savedTheme = localStorage.getItem('personal_web_theme') || 'obsidian';
    applyTheme(savedTheme);

    if (elements.themeBtn) {
      elements.themeBtn.addEventListener('click', e => {
        e.stopPropagation();
        elements.themeMenu.classList.toggle('show');
      });
    }

    document.addEventListener('click', e => {
      if (elements.themeMenu && !elements.themeMenu.contains(e.target) && e.target !== elements.themeBtn) {
        elements.themeMenu.classList.remove('show');
      }
    });

    elements.themeOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        applyTheme(theme);
        localStorage.setItem('personal_web_theme', theme);
        elements.themeMenu.classList.remove('show');
        showToast(`Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    elements.themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === theme);
    });
  }

  // --- SETUP EVENT LISTENERS ---
  function setupEventListeners() {
    // 1. Clock Digital / Analog Switch
    if (elements.btnViewDigital && elements.btnViewAnalog) {
      elements.btnViewDigital.addEventListener('click', () => {
        elements.btnViewDigital.classList.add('active');
        elements.btnViewAnalog.classList.remove('active');
        elements.digitalClockContainer.classList.add('active');
        elements.analogClockContainer.classList.remove('active');
      });

      elements.btnViewAnalog.addEventListener('click', () => {
        elements.btnViewAnalog.classList.add('active');
        elements.btnViewDigital.classList.remove('active');
        elements.analogClockContainer.classList.add('active');
        elements.digitalClockContainer.classList.remove('active');
      });
    }

    // 2. Sound Toggle
    if (elements.soundToggleBtn) {
      elements.soundToggleBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
          elements.soundIcon.className = 'fa-solid fa-volume-high';
          elements.soundToggleBtn.style.color = 'var(--accent-primary)';
          showToast('Audio chime enabled', 'fa-volume-high');
          playTickChime();
        } else {
          elements.soundIcon.className = 'fa-solid fa-volume-xmark';
          elements.soundToggleBtn.style.color = '';
          showToast('Audio chime muted', 'fa-volume-xmark');
        }
      });
    }

    // 3. Modal Opening & Closing
    if (elements.openEditModalBtn) elements.openEditModalBtn.addEventListener('click', openEditModal);
    if (elements.inlineEditNameBtn) elements.inlineEditNameBtn.addEventListener('click', openEditModal);
    if (elements.avatarChangeBtn) elements.avatarChangeBtn.addEventListener('click', openEditModal);
    if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeEditModal);
    if (elements.cancelModalBtn) elements.cancelModalBtn.addEventListener('click', closeEditModal);

    if (elements.editModalOverlay) {
      elements.editModalOverlay.addEventListener('click', e => {
        if (e.target === elements.editModalOverlay) closeEditModal();
      });
    }

    // 4. Save Form
    if (elements.profileEditForm) {
      elements.profileEditForm.addEventListener('submit', e => {
        e.preventDefault();
        const updated = {
          name: elements.inputName.value.trim() || DEFAULT_PROFILE.name,
          dept: (elements.inputDept ? elements.inputDept.value.trim() : '') || DEFAULT_PROFILE.dept,
          specialty: (elements.inputSpecialty ? elements.inputSpecialty.value.trim() : '') || DEFAULT_PROFILE.specialty,
          role: elements.inputRole.value.trim() || DEFAULT_PROFILE.role,
          location: elements.inputLocation.value.trim() || '',
          status: elements.inputStatus.value.trim() || DEFAULT_PROFILE.status,
          email: elements.inputEmail.value.trim() || DEFAULT_PROFILE.email,
          bio: elements.inputBio.value.trim() || DEFAULT_PROFILE.bio,
          avatar: elements.inputAvatar.value.trim() || DEFAULT_PROFILE.avatar
        };
        saveStoredProfile(updated);
        applyProfile(updated);
        closeEditModal();
        showToast('個人檔案儲存成功！', 'fa-user-check');
      });
    }

    // 5. Reset Defaults
    if (elements.resetDefaultsBtn) {
      elements.resetDefaultsBtn.addEventListener('click', () => {
        if (confirm('Reset profile details to initial default values?')) {
          localStorage.removeItem('personal_web_profile');
          applyProfile(DEFAULT_PROFILE);
          closeEditModal();
          showToast('Reset to defaults');
        }
      });
    }

    // 6. Copy Local Time Button
    if (elements.copyTimeBtn) {
      elements.copyTimeBtn.addEventListener('click', () => {
        const now = new Date();
        const readableTime = `${now.toLocaleTimeString()} (${getUtcOffsetString(now)} - ${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
        navigator.clipboard.writeText(readableTime).then(() => {
          showToast(`Copied: ${readableTime}`, 'fa-copy');
        }).catch(() => {
          showToast('Failed to copy time to clipboard');
        });
      });
    }

    // 7. Copy Email
    if (elements.copyEmailActionBtn) {
      elements.copyEmailActionBtn.addEventListener('click', () => {
        const profile = getStoredProfile();
        const email = profile.email || DEFAULT_PROFILE.email;
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`, 'fa-envelope');
          if (elements.copyEmailLabel) {
            const orig = elements.copyEmailLabel.textContent;
            elements.copyEmailLabel.textContent = 'Copied!';
            setTimeout(() => elements.copyEmailLabel.textContent = orig, 2000);
          }
        }).catch(() => {
          showToast('Failed to copy email');
        });
      });
    }

    // 8. Share Profile
    if (elements.shareProfileBtn) {
      elements.shareProfileBtn.addEventListener('click', () => {
        const shareData = {
          title: document.title,
          text: `Check out ${elements.profileName.textContent}'s personal space with real-time local time!`,
          url: window.location.href
        };
        if (navigator.share) {
          navigator.share(shareData).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Page link copied to clipboard!', 'fa-link');
          });
        }
      });
    }

    // 9. Focus Add Controls
    if (elements.addFocusBtn && elements.focusInputRow) {
      elements.addFocusBtn.addEventListener('click', () => {
        elements.focusInputRow.style.display = 'flex';
        elements.newFocusInput.focus();
      });
    }

    if (elements.cancelNewFocusBtn && elements.focusInputRow) {
      elements.cancelNewFocusBtn.addEventListener('click', () => {
        elements.focusInputRow.style.display = 'none';
        elements.newFocusInput.value = '';
      });
    }

    if (elements.saveNewFocusBtn && elements.newFocusInput) {
      const saveItem = () => {
        const text = elements.newFocusInput.value.trim();
        if (!text) return;
        const currentItems = getStoredFocus();
        currentItems.push({ id: Date.now().toString(), text, done: false });
        saveStoredFocus(currentItems);
        renderFocusList();
        elements.newFocusInput.value = '';
        elements.focusInputRow.style.display = 'none';
        showToast('New focus added!', 'fa-check');
      };

      elements.saveNewFocusBtn.addEventListener('click', saveItem);
      elements.newFocusInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') saveItem();
        if (e.key === 'Escape') {
          elements.focusInputRow.style.display = 'none';
          elements.newFocusInput.value = '';
        }
      });
    }
  }

  // --- INITIALIZATION ---
  function init() {
    // 1. Load Profile
    const profile = getStoredProfile();
    applyProfile(profile);

    // 2. Set Footer Year
    if (elements.footerYear) {
      elements.footerYear.textContent = new Date().getFullYear();
    }

    // 3. Init Theme
    initTheme();

    // 4. Init Focus List
    renderFocusList();

    // 5. Setup Listeners
    setupEventListeners();

    // 6. Start Clock
    updateClock();
    updateTimezones();
    updateDynamicGreeting();

    // Run high precision loop for smooth progression bar and analog seconds hand
    function animationLoop() {
      updateClock();
      requestAnimationFrame(animationLoop);
    }
    requestAnimationFrame(animationLoop);

    // Update world clocks every 10 seconds & greeting every minute
    setInterval(updateTimezones, 10000);
    setInterval(updateDynamicGreeting, 60000);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
