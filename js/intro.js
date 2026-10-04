(function () {
    var duration = 2500;
    var start = null;
    var progressBar = document.getElementById('introProgressBar');
    var introBg = document.getElementById('introBg');
    var percentEl = document.getElementById('introPercent');
    var root = document.documentElement;

    function tick(timestamp) {
        if (!start) start = timestamp;
        var elapsed = timestamp - start;
        var progress = Math.min(100, (elapsed / duration) * 100);

        if (progressBar) progressBar.style.width = progress + '%';
        if (percentEl) percentEl.textContent = Math.floor(progress) + '%';
        if (root) root.style.setProperty('--progress', String(progress));

        if (progress >= 100) {
            try {
                sessionStorage.setItem('from_intro', '1');
            } catch (e) {}
            window.location.replace('index.html');
            return;
        }
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
})();
