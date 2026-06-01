// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Reading Progress Bar
    const progressBar = document.getElementById("progress-bar");
    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
    });

    // 2. Audio Player Logic
    const audio = document.getElementById("blog-audio");
    const playBtn = document.getElementById("play-btn");
    const playBtnIcon = playBtn.querySelector("svg");
    const progressContainer = document.getElementById("audio-progress-container");
    const progress = document.getElementById("audio-progress");
    const timeDisplay = document.getElementById("audio-time");
    let isPlaying = false;

    const playIcon = '<path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>';
    const pauseIcon = '<path d="M6 5H10V19H6V5ZM14 5H18V19H14V5Z" fill="currentColor"/>';

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    if(audio) {
        // Since we might not have a real audio file, let's mock metadata if not loaded
        audio.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
        });
        
        // Handle play/pause
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                playBtnIcon.innerHTML = playIcon;
            } else {
                audio.play().catch(e => console.warn("Audio playback failed:", e));
                playBtnIcon.innerHTML = pauseIcon;
            }
            isPlaying = !isPlaying;
        });

        audio.addEventListener('timeupdate', () => {
            if(!isNaN(audio.duration)) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progress.style.width = `${percent}%`;
                timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
            }
        });

        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            if (!isNaN(duration)) {
                audio.currentTime = (clickX / width) * duration;
            }
        });
    }

    // 3. Populate Chapter Sidebar
    const chapters = document.querySelectorAll(".chapter");
    const chapterList = document.getElementById("chapter-list");
    
    chapters.forEach((chapter, index) => {
        const id = chapter.getAttribute("id");
        const title = chapter.getAttribute("data-title");
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${id}`;
        a.textContent = title;
        if(index === 0) a.classList.add("active");
        li.appendChild(a);
        chapterList.appendChild(li);

        // Smooth scroll for sidebar links
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // 4. Hero Animations
    // Split text logic for main title
    const mainTitle = document.getElementById("main-title");
    const titleText = mainTitle.innerHTML.split("<br>");
    mainTitle.innerHTML = "";
    
    titleText.forEach((line, lineIndex) => {
        const words = line.split(" ");
        words.forEach((word, wordIndex) => {
            const span = document.createElement("span");
            span.style.display = "inline-block";
            span.style.whiteSpace = "pre";
            
            // split into chars
            const chars = word.split("");
            chars.forEach(char => {
                const charSpan = document.createElement("span");
                charSpan.className = "char";
                charSpan.textContent = char;
                span.appendChild(charSpan);
            });
            
            mainTitle.appendChild(span);
            if (wordIndex < words.length - 1) {
                mainTitle.appendChild(document.createTextNode(" "));
            }
        });
        if (lineIndex < titleText.length - 1) {
            mainTitle.appendChild(document.createElement("br"));
        }
    });

    // Hero GSAP Timeline
    const tl = gsap.timeline();
    
    tl.to(".char", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.02,
        ease: "power4.out",
        delay: 0.2
    })
    .fromTo(".eyebrow, .subtitle, .intro-paragraph, .meta-line", {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    }, "-=0.8")
    .fromTo(".audio-player", {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6")
    .fromTo(".hero-landscape-wrapper", {
        y: 50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    }, "-=0.6")
    .to(".hero-img", {
        scale: 1,
        duration: 1.5,
        ease: "power2.out"
    }, "-=1");

    // 5. Scroll Animations for Chapters
    const sidebarLinks = document.querySelectorAll(".chapter-sidebar a");

    chapters.forEach((chapter, index) => {
        // Text Reveal
        const contentElements = chapter.querySelectorAll(".chapter-number, .chapter-heading, .chapter-text p");
        
        gsap.fromTo(contentElements, {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: chapter,
                start: "top 80%",
            }
        });

        // Media Reveal (Dezoom)
        const mediaImg = chapter.querySelector(".sticky-media-wrapper img");
        const mediaWrapper = chapter.querySelector(".sticky-media-wrapper");
        
        if (mediaImg && mediaWrapper) {
            // Reveal container
            gsap.fromTo(mediaWrapper, {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: chapter,
                    start: "top 75%",
                }
            });
            
            // Setup initial scale
            gsap.set(mediaImg, { scale: 1.15 });
            
            gsap.to(mediaImg, {
                scale: 1,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: chapter,
                    start: "top 75%",
                }
            });
            
            // Subtle parallax on media
            gsap.to(mediaImg, {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: chapter,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Active Chapter Detection
        ScrollTrigger.create({
            trigger: chapter,
            start: "top 50%",
            end: "bottom 50%",
            onToggle: (self) => {
                if (self.isActive) {
                    sidebarLinks.forEach(link => link.classList.remove("active"));
                    if(sidebarLinks[index]) {
                        sidebarLinks[index].classList.add("active");
                    }
                }
            }
        });
    });

    // 6. Back to Top Button
    const backToTop = document.getElementById("back-to-top");
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});
