document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const navLinks = document.querySelector('.nav-links');
    const burgerMenu = document.querySelector('.burger-menu');
    // Pastikan ini mengambil semua section yang ada di DOM, termasuk yang baru
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    const navbar = document.querySelector('.navbar');

    // --- 1. Mobile Navigation Toggle ---
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burgerMenu.classList.toggle('active');
            // Close submenu if burger menu is opened/closed
            const profileSubmenu = document.querySelector('.nav-links .submenu');
            if (profileSubmenu && !navLinks.classList.contains('active')) {
                profileSubmenu.classList.remove('active');
            }
        });
    }

    // --- 2. Submenu Toggle in Mobile Burger Menu ---
    const profileNavLink = document.querySelector('.nav-links .has-submenu');
    const profileSubmenu = document.querySelector('.nav-links .submenu');

    if (profileNavLink && profileSubmenu) {
        profileNavLink.addEventListener('click', (e) => {
            // Check if burger menu is visible (indicates mobile view)
            // Use getComputedStyle for more reliable check against CSS display property
            if (window.getComputedStyle(burgerMenu).display !== 'none') {
                e.preventDefault(); // Prevent default navigation only in mobile view
                profileSubmenu.classList.toggle('active');
            }
        });
    }

    // --- 3. Universal Navigation & Smooth Scroll Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            const currentPathname = window.location.pathname.split('/').pop() || '';

            const hrefParts = href.split('#');
            let targetPage = hrefParts[0] || currentPathname;
            const targetHash = hrefParts[1];

            if (targetPage === '' && (currentPathname === 'index.html' || currentPathname === '')) {
                targetPage = 'index.html';
            }

            // Case 1: Link points to a section on the *current* page.
            if (targetPage === currentPathname && targetHash) {
                e.preventDefault();

                if (navLinks && burgerMenu && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burgerMenu.classList.remove('active');
                    if (profileSubmenu) profileSubmenu.classList.remove('active');
                }

                const targetSection = document.getElementById(targetHash);
                if (targetSection) {
                    const headerHeight = navbar ? navbar.offsetHeight : 0;
                    window.scrollTo({
                        top: targetSection.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
            // Case 2: Link points to a *different* page, potentially with a hash.
            else if (targetPage !== currentPathname) {
                if (navLinks && burgerMenu && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burgerMenu.classList.remove('active');
                    if (profileSubmenu) profileSubmenu.classList.remove('active');
                }
                // Let browser handle the navigation to the new page.
            }
            // Case 3: Link points to the root of the current page (e.g., "index.html" on index.html).
            // Let default browser behavior handle it.
        });
    });

    // --- 4. Smooth Scroll for "Daftar Sekarang!" Button on index.html ---
    const daftarSekarangBtn = document.querySelector('.hero-section .btn-primary');
    if (daftarSekarangBtn && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
        daftarSekarangBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = daftarSekarangBtn.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const headerHeight = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    }

    // --- 5. Highlight Active Navigation Link on Scroll ---
    const highlightNavOnScroll = () => {
        let currentActiveSectionId = '';
        const headerHeight = navbar ? navbar.offsetHeight : 0;
        const currentPage = window.location.pathname.split('/').pop() || '';

        // Find the currently visible section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 10;
            const sectionBottom = sectionTop + section.clientHeight;

            if (pageYOffset >= sectionTop && pageYOffset < sectionBottom) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');

            const itemHref = item.getAttribute('href');
            if (!itemHref) return;

            const linkParts = itemHref.split('#');
            const linkPage = linkParts[0] || (currentPage === 'index.html' || currentPage === '' ? 'index.html' : currentPage);
            const linkHash = linkParts[1];

            let shouldBeActive = false;

            const normalizedLinkPage = (linkPage === '' && (currentPage === 'index.html' || currentPage === '')) ? 'index.html' : linkPage;

            // Check if the link's page matches the current page
            if (normalizedLinkPage === currentPage) {
                if (linkHash) {
                    // It's a hash link on the current page
                    if (linkHash === currentActiveSectionId) {
                        shouldBeActive = true;
                    }
                    // Special handling for main 'Profile' link if any of its sub-sections are active
                    if (currentPage === 'profile.html' && item.classList.contains('has-submenu') &&
                        (currentActiveSectionId === 'profile-main' ||
                         currentActiveSectionId === 'kata-sambutan' ||
                         currentActiveSectionId === 'sejarah' ||
                         currentActiveSectionId === 'visi-misi' ||
                         currentActiveSectionId === 'struktur-organisasi' ||
                         currentActiveSectionId === 'profile-guru' ||
                         currentActiveSectionId === 'kegiatan-siswa' ||
                         currentActiveSectionId === 'fasilitas')) {
                        if (itemHref === 'profile.html' || itemHref === '#profile-main') {
                            shouldBeActive = true;
                        }
                    }
                } else if (itemHref === currentPage) {
                     // Activate 'Beranda' if on index.html and at the top or 'beranda' section is active
                    if ((currentPage === 'index.html' || currentPage === '') && (currentActiveSectionId === 'beranda' || window.pageYOffset === 0)) {
                        if (itemHref === 'index.html') shouldBeActive = true;
                    }
                    // Activate 'Profile' if on profile.html and at the top or 'profile-main' section is active
                    else if (currentPage === 'profile.html' && (currentActiveSectionId === 'profile-main' || window.pageYOffset === 0)) {
                        if (itemHref === 'profile.html') shouldBeActive = true;
                    }
                }
            }
            // Handle links to other pages (e.g., 'index.html' or 'profile.html' without hashes)
            else if (itemHref === 'index.html' && (currentPage === 'index.html' || currentPage === '')) {
                shouldBeActive = true;
            }
            else if (itemHref === 'profile.html' && currentPage === 'profile.html') {
                shouldBeActive = true;
            }

            if (shouldBeActive) {
                item.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavOnScroll);
    highlightNavOnScroll(); // Initial call

    // --- 6. Handle Initial Scroll to Hash on Page Load ---
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetSection = document.getElementById(hash);

        if (targetSection) {
            const headerHeight = navbar ? navbar.offsetHeight : 0;
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });

                navItems.forEach(link => link.classList.remove('active'));

                const relevantNavItem = document.querySelector(`.nav-links a[href*="${hash}"]`);
                if (relevantNavItem) {
                    relevantNavItem.classList.add('active');
                }

                if (window.location.pathname.endsWith('profile.html') && profileNavLink && profileSubmenu && profileSubmenu.contains(relevantNavItem)) {
                    profileNavLink.classList.add('active');
                }
            }, 100);
        }
    }

    // --- 7. Section Fade-in Animation on Scroll ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- 8. Gallery Slider Logic (Only if on index.html) ---
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const gallerySlides = document.querySelector('.gallery-slides');

        if (gallerySlides) {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const prevBtn = document.querySelector('.slider-btn.prev');
            const nextBtn = document.querySelector('.slider-btn.next');
            const sliderDotsContainer = document.querySelector('.slider-dots');

            let currentIndex = 0;
            const totalSlides = galleryItems.length;

            if (sliderDotsContainer) {
                sliderDotsContainer.innerHTML = '';
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    dot.dataset.index = i;
                    sliderDotsContainer.appendChild(dot);
                }
            }
            const dots = document.querySelectorAll('.slider-dots .dot');

            const showSlide = (index) => {
                if (index >= totalSlides) {
                    currentIndex = 0;
                } else if (index < 0) {
                    currentIndex = totalSlides - 1;
                } else {
                    currentIndex = index;
                }

                const offset = -currentIndex * 100;
                gallerySlides.style.transform = `translateX(${offset}%)`;

                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            };

            const nextSlide = () => { showSlide(currentIndex + 1); };
            const prevSlide = () => { showSlide(currentIndex - 1); };

            if (prevBtn) { prevBtn.addEventListener('click', prevSlide); }
            if (nextBtn) { nextBtn.addEventListener('click', nextSlide); }

            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    showSlide(parseInt(e.target.dataset.index));
                });
            });

            showSlide(0);

            let touchStartX = 0;
            let touchEndX = 0;

            gallerySlides.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });

            gallerySlides.addEventListener('touchmove', (e) => {
                touchEndX = e.touches[0].clientX;
            });

            gallerySlides.addEventListener('touchend', () => {
                if (touchStartX - touchEndX > 50) {
                    nextSlide();
                }
                if (touchStartX - touchEndX < -50) {
                    prevSlide();
                }
                touchStartX = 0;
                touchEndX = 0;
            });
        }
    }
});