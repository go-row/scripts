(function () {
    const VIDEO_SELECTOR = "ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-playlist-video-renderer";
    const TITLE_SELECTOR = "#video-title";
    const DURATION_SELECTOR = "ytd-thumbnail-overlay-time-status-renderer span";

    function parseDuration(durationString) {
        const parts = durationString.split(":").map(Number);
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 1) {
            return parts[0];
        }
        return 0;
    }

    function formatDuration(totalSeconds) {
        const days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return { days, hours, minutes, seconds };
    }

    function extractVideos() {
        const elements = document.querySelectorAll(VIDEO_SELECTOR);
        const seen = new Set();
        const videos = [];

        for (const el of elements) {
            const titleElement = el.querySelector(TITLE_SELECTOR);
            const durationElement = el.querySelector(DURATION_SELECTOR);

            const title = titleElement?.textContent.trim();
            const duration = durationElement?.textContent.trim();

            if (!title || !duration) continue;

            const key = `${title}__${duration}`;
            if (seen.has(key)) continue;

            seen.add(key);
            videos.push({ title, duration });
        }

        return videos;
    }

    function calculateTotalDuration(videos) {
        return videos.reduce((acc, video) => acc + parseDuration(video.duration), 0);
    }

    function main() {
        const videos = extractVideos();
        const totalSeconds = calculateTotalDuration(videos);
        const formatted = formatDuration(totalSeconds);

        console.clear();
        console.log("Videos processed:", videos.length);
        console.table(videos);

        console.log(
            `Total watch time: ${formatted.days} days, ${formatted.hours} hours, ${formatted.minutes} minutes, ${formatted.seconds} seconds`
        );
    }

    main();
})();

