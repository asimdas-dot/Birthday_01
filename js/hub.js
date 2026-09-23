document.addEventListener("DOMContentLoaded", () => {
    // 1. Heart Tap Counter
    const heartBtn = document.getElementById("heartBtn");
    const heartCount = document.getElementById("heartCount");
    let count = 0;

    if (heartBtn) {
        heartBtn.addEventListener("click", (e) => {
            count++;
            heartCount.innerText = count;

            // Mini Confetti on tap
            confetti({
                particleCount: 15,
                scalar: 0.7,
                origin: {
                    x: e.clientX / window.innerWidth,
                    y: e.clientY / window.innerHeight
                }
            });
        });
    }

    // 2. Typewriter Effect for Love Letter
    const textToType = "Happy Birthday my love! You bring so much joy, laughter, and light into my life. Thank you for being my favorite person, my best friend, and my partner in everything. Hope this year brings you all the happiness you deserve! 💕";
    const typewriterElement = document.getElementById("typewriterText");
    let charIndex = 0;

    function typeWriter() {
        if (typewriterElement && charIndex < textToType.length) {
            typewriterElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 40);
        }
    }
    typeWriter();

    // 3. Redeemable Coupon Alert
    const couponBtns = document.querySelectorAll(".coupon-btn");
    couponBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.innerText = "Redeemed! ✨";
            btn.classList.replace("bg-pink-500/20", "bg-emerald-500/20");
            btn.classList.replace("text-pink-300", "text-emerald-300");
            confetti({ particleCount: 30, spread: 50 });
        });
    });

    // 4. Synth Melody Player
    const musicToggle = document.getElementById("musicToggle");
    let isPlaying = false;
    let audioCtx;

    if (musicToggle) {
        musicToggle.addEventListener("click", () => {
            if (!isPlaying) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                playMelody(audioCtx);
                isPlaying = true;
                musicToggle.innerHTML = `<i class="fa-solid fa-volume-high"></i> Playing...`;
            }
        });
    }

    function playMelody(ctx) {
        const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63]; // Happy Birthday intro notes
        let now = ctx.currentTime;

        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, now + index * 0.4);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.4 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + index * 0.4);
            osc.stop(now + index * 0.4 + 0.35);
        });
    }
});