document.addEventListener("DOMContentLoaded", () => {
    let candleBlown = false;
    const flamesGroup = document.getElementById("flamesGroup");
    const smoke = document.getElementById("smoke");
    const blowBtn = document.getElementById("blowBtn");
    const cutBtn = document.getElementById("cutBtn");
    const enterHubBtn = document.getElementById("enterHubBtn");
    const statusBadge = document.getElementById("statusBadge");
    const instruction = document.getElementById("instruction");
    const eatModal = document.getElementById("eatModal");
    const eatSliceBtn = document.getElementById("eatSliceBtn");
    const actionControls = document.getElementById("actionControls");
    const readyDelay = 4000;

    window.setTimeout(() => {
        if (actionControls) actionControls.classList.remove("opacity-0", "pointer-events-none");
        if (instruction) instruction.innerText = "Your cake is ready! Blow out the candle!";
        if (statusBadge) statusBadge.innerText = "🎤 Mic Ready — blow into your microphone!";
    }, readyDelay);

    async function initMicrophone() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            if (statusBadge) statusBadge.innerText = "👆 Microphone unavailable — click the button to blow!";
            return;
        }
        try {
            if (statusBadge) statusBadge.innerText = "🎤 Allow microphone access, then blow!";
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            microphone.connect(analyser);
            if (statusBadge) statusBadge.innerText = "🎤 Listening... blow toward your microphone!";
            function checkVolume() {
                if (candleBlown) return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
                if (sum / bufferLength > 25) extinguishCandle();
                else requestAnimationFrame(checkVolume);
            }
            checkVolume();
        } catch (err) {
            console.warn("Microphone access denied or unsupported. Fallback button active.", err);
            if (statusBadge) statusBadge.innerText = "👆 Mic blocked — click the button to blow!";
        }
    }

    function extinguishCandle() {
        if (candleBlown) return;
        candleBlown = true;
        if (blowBtn) blowBtn.disabled = true;
        if (flamesGroup) flamesGroup.classList.add("blowing");
        if (smoke) window.setTimeout(() => smoke.classList.remove("hidden"), 450);
        statusBadge.innerText = "🎉 Wish Granted! Candle Blown!";
        statusBadge.className = "mb-6 px-4 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
        instruction.innerText = "Now cut your birthday cake!";
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        window.setTimeout(() => {
            if (flamesGroup) flamesGroup.classList.add("hidden");
            blowBtn.classList.add("hidden");
            cutBtn.classList.remove("hidden");
        }, 700);
    }

    cutBtn.addEventListener("click", () => {
        cutBtn.classList.add("hidden");
        eatModal.classList.remove("opacity-0", "pointer-events-none");
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    });

    eatSliceBtn.addEventListener("click", () => {
        eatModal.classList.add("opacity-0", "pointer-events-none");
        statusBadge.innerText = "💖 Yummy! Head to your Celebration Hub!";
        instruction.innerText = "Click below to explore your birthday surprises!";
        enterHubBtn.classList.remove("hidden");
        confetti({ particleCount: 100, spread: 60 });
    });

    blowBtn.addEventListener("click", extinguishCandle);
    window.setTimeout(initMicrophone, readyDelay);
});