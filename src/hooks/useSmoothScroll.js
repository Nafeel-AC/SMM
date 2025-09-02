import { useEffect } from 'react';

export const useSmoothScroll = () => {
    useEffect(() => {
        // Polyfill for smooth scrolling behavior
        const smoothScrollPolyfill = () => {
            if (!('scrollBehavior' in document.documentElement.style)) {
                import('smoothscroll-polyfill').then(smoothscroll => {
                    smoothscroll.polyfill();
                });
            }
        };

        smoothScrollPolyfill();

        // Enhanced smooth scroll function
        const smoothScrollTo = (element, duration = 800) => {
            const target = element.getBoundingClientRect().top + window.pageYOffset - 80;
            const startPosition = window.pageYOffset;
            const distance = target - startPosition;
            let startTime = null;

            const ease = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            };

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };

            requestAnimationFrame(animation);
        };

        // Override default scroll behavior for hash links
        const handleHashLinkClick = (e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href && href.includes('#')) {
                const hash = href.split('#')[1];
                const element = document.getElementById(hash);
                if (element) {
                    e.preventDefault();
                    smoothScrollTo(element);
                    // Update URL without jumping
                    window.history.pushState(null, null, href);
                }
            }
        };

        // Add event listeners to all hash links
        const hashLinks = document.querySelectorAll('a[href*="#"]');
        hashLinks.forEach(link => {
            link.addEventListener('click', handleHashLinkClick);
        });

        return () => {
            hashLinks.forEach(link => {
                link.removeEventListener('click', handleHashLinkClick);
            });
        };
    }, []);
};

export default useSmoothScroll;
