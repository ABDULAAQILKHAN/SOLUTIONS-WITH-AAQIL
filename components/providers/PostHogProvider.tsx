'use client';

import { useEffect, useRef } from 'react';
import { initPostHog, trackingEvents, posthog } from '@/lib/posthog';

interface PostHogProviderProps {
    children: React.ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
    const hasTrackedLanding = useRef(false);

    useEffect(() => {
        // Initialize PostHog
        initPostHog();

        // Track user landed event (only once per session)
        if (!hasTrackedLanding.current) {
            // Small delay to ensure PostHog is fully loaded
            const timer = setTimeout(() => {
                trackingEvents.userLanded();
                hasTrackedLanding.current = true;
            }, 100);

            return () => clearTimeout(timer);
        }
    }, []);

    // Track page views on route changes (for SPA navigation)
    useEffect(() => {
        const handleRouteChange = () => {
            posthog.capture('$pageview');
        };

        // Listen for browser navigation
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    // Track scroll depth
    useEffect(() => {
        const scrollThresholds = [25, 50, 75, 100];
        const trackedThresholds = new Set<number>();

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = Math.round((scrollTop / docHeight) * 100);

            scrollThresholds.forEach((threshold) => {
                if (scrollPercentage >= threshold && !trackedThresholds.has(threshold)) {
                    trackedThresholds.add(threshold);
                    trackingEvents.scrollDepthReached(threshold);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track time spent on page
    useEffect(() => {
        const startTime = Date.now();
        const pageName = window.location.pathname;

        const handleBeforeUnload = () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            trackingEvents.timeSpentOnPage(timeSpent, pageName);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    return <>{children}</>;
}
