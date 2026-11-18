(() => {
  const products = [
    { name: 'DF07 Silent High-Speed Desktop Fan', image: 'public/Desk_fan.png', alt: 'DF07 Silent High-Speed Desktop Fan', url: 'https://shopee.ph/product/39354259/26831939841?exp_group=rollout&gads_t_sig=gqRjZGVrxHCFomtpsTE0MjUxOnRzc19zZGtfa2V5omt20QACpGFsZ2_SAAAAZKNkZWvAomN0xEAAAAAMc1TPTF0zl9lUk9doKYfbtNkYCBZaTm6dQ6q3WJIrnGYlyLtpSCE1-D6jy2YmlKEe_b7zxJZfI6lpwZ6fqmNpcGhlcnRleHTEkQAAAAyuAWtUuBu8FF-jDmyQ-AH4KC93clG9ylvafewKB2gz2bYofy8uh2V17fz2boQlHn44b3LLjg_hxHbdur4M4XmIogm69xHjcgavpmGFPjRleh-ncWU2J310WKV_gmPpMOIibMUaGSh1jgxhvSt5W17wIf9MCL6J0RBUKSxw9yPDRFvB-OMWB-2aRIF_BBs&mmp_pid=an_13321520220&share_channel_code=5&uls_trackid=575h1oe400sp&utm_campaign=id_84Y9KBuZoyH&utm_content=----&utm_medium=affiliates&utm_source=an_13321520220&utm_term=fvbevref32hd' },
    { name: 'Orashare Portable Emergency Light', image: 'public/Portable_light.png', alt: 'Orashare Portable Emergency Light', url: 'https://shopee.ph/product/264015657/51602808448?exp_group=rollout&gads_t_sig=gqRjZGVrxHCFomtpsTE0MjUxOnRzc19zZGtfa2V5omt20QACpGFsZ2_SAAAAZKNkZWvAomN0xEAAAAAMc1TPTF0zl9lUk9doKYfbtNkYCBZaTm6dQ6q3WJIrnGYlyLtpSCE1-D6jy2YmlKEe_b7zxJZfI6lpwZ6fqmNpcGhlcnRleHTEkwAAAAxAuRZ8mVldY-Fc-3DRNMy9RKCN1chU98kCTL4b1zr68zQLobEUXQ6czDOcumDluU5p4CBchD0kFKPWSgWQBfoFpXMyXA6xDA2HY9p4n4XRal0WGeKRIyRUbxNU5GGss3S8cioyn1EtQCbNYXroBaNLgoXx0z6WhN4mX5OV5-sl8XiUILsEk-eK5GLg7_9Xgg&mmp_pid=an_13321520220&share_channel_code=5&uls_trackid=575h24k600sp&utm_campaign=id_1IOAbhXkSNd&utm_content=----&utm_medium=affiliates&utm_source=an_13321520220&utm_term=fvbf6qamz1kk' }
  ];
  const $ = id => document.getElementById(id);
  const intro = $('intro'), page = $('page'), card = $('card'), loadProgress = $('loadProgress');
  let index = 0, audioContext = null, soundOn = false, entered = false;
  const soundButton = $('sound');

  // Web Audio is created/resumed synchronously from a real gesture for iOS WebKit.
  function unlockAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch (_) { return null; }
  }
  function beep(kind = 'click') {
    if (!soundOn) return;
    const ctx = unlockAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = kind === 'slide' ? 'triangle' : 'square';
      const start = kind === 'slide' ? 420 : 660;
      osc.frequency.setValueAtTime(start, now);
      osc.frequency.exponentialRampToValueAtTime(kind === 'slide' ? 880 : 990, now + .085);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.055, now + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .14);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + .15);
    } catch (_) { /* Audio is optional; visual controls remain usable. */ }
  }
  function enterExperience(fromGesture) {
    if (entered) return;
    entered = true;
    if (fromGesture) { soundOn = true; unlockAudio(); soundButton.querySelector('b').textContent = 'ON'; soundButton.title = 'Sound on'; soundButton.setAttribute('aria-label', 'Turn sound off'); beep('click'); }
    intro.classList.add('exit'); page.classList.add('ready'); page.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => { intro.hidden = true; }, 850);
  }
  // The cover exits at exactly 3 seconds; tapping it enters immediately and unlocks audio.
  const loadingStartedAt = performance.now();
  function updateLoadingProgress(now) {
    if (entered) return;
    const progress = Math.min((now - loadingStartedAt) / 3000, 1);
    loadProgress.style.width = (progress * 100) + '%';
    if (progress < 1) window.requestAnimationFrame(updateLoadingProgress);
  }
  window.requestAnimationFrame(updateLoadingProgress);
  window.setTimeout(() => enterExperience(false), 3000);
  $('enter').addEventListener('click', () => enterExperience(true));
  intro.addEventListener('pointerdown', event => { if (event.target !== $('enter')) { unlockAudio(); } }, { passive: true });
  soundButton.addEventListener('click', () => {
    if (!soundOn) { soundOn = true; unlockAudio(); soundButton.querySelector('b').textContent = 'ON'; soundButton.title = 'Sound on'; soundButton.setAttribute('aria-label', 'Turn sound off'); beep(); }
    else { soundOn = false; soundButton.querySelector('b').textContent = 'OFF'; soundButton.title = 'Sound off'; soundButton.setAttribute('aria-label', 'Turn sound on'); }
  });
  function show(next) {
    index = (next + products.length) % products.length;
    beep('slide'); card.classList.add('changing'); $('count').parentElement.style.transform = 'scale(.94)';
    window.setTimeout(() => {
      const p = products[index];
      $('productImage').src = p.image; $('productImage').alt = p.alt;
      $('productName').textContent = p.name; $('shop').href = p.url;
      $('count').textContent = `${index + 1} of 2 Wishlists`; $('itemNo').textContent = `NO. 0${index + 1}`;
      card.classList.remove('changing'); $('count').parentElement.style.transform = '';
    }, 170);
  }
  $('prev').addEventListener('click', () => show(index - 1));
  $('next').addEventListener('click', () => show(index + 1));
})();
