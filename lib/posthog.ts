import posthog from 'posthog-js';

// Initialize PostHog (only in browser)
export const initPostHog = () => {
    if (typeof window !== 'undefined' && !posthog.__loaded) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
            person_profiles: 'identified_only',
            capture_pageview: true,
            capture_pageleave: true,
            autocapture: true,
            loaded: () => {
                if (process.env.NODE_ENV === 'development') {
                    // Optionally disable in development
                    // posthog.opt_out_capturing();
                    console.log('PostHog initialized in development mode');
                }
            },
        });
    }
    return posthog;
};

// Standard tracking events
export const trackingEvents = {
    // User landed event - tracks when user first lands on the site
    userLanded: () => {
        posthog.capture('user_landed', {
            timestamp: new Date().toISOString(),
            page: typeof window !== 'undefined' ? window.location.pathname : '',
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
            screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
    },

    // Page view event
    pageView: (pageName: string, additionalProps?: Record<string, unknown>) => {
        posthog.capture('page_view', {
            page_name: pageName,
            timestamp: new Date().toISOString(),
            path: typeof window !== 'undefined' ? window.location.pathname : '',
            ...additionalProps,
        });
    },

    // Section view - when user scrolls to a specific section
    sectionViewed: (sectionName: string) => {
        posthog.capture('section_viewed', {
            section_name: sectionName,
            timestamp: new Date().toISOString(),
        });
    },

    // Click event - track important button/link clicks
    buttonClicked: (buttonName: string, additionalProps?: Record<string, unknown>) => {
        posthog.capture('button_clicked', {
            button_name: buttonName,
            timestamp: new Date().toISOString(),
            ...additionalProps,
        });
    },

    // Contact form opened
    contactFormOpened: () => {
        posthog.capture('contact_form_opened', {
            timestamp: new Date().toISOString(),
        });
    },

    // Contact form submitted
    contactFormSubmitted: (success: boolean) => {
        posthog.capture('contact_form_submitted', {
            success,
            timestamp: new Date().toISOString(),
        });
    },

    // Project viewed
    projectViewed: (projectName: string) => {
        posthog.capture('project_viewed', {
            project_name: projectName,
            timestamp: new Date().toISOString(),
        });
    },

    // External link clicked (e.g., GitHub, LinkedIn)
    externalLinkClicked: (linkName: string, url: string) => {
        posthog.capture('external_link_clicked', {
            link_name: linkName,
            url,
            timestamp: new Date().toISOString(),
        });
    },

    // Resume/CV downloaded
    resumeDownloaded: () => {
        posthog.capture('resume_downloaded', {
            timestamp: new Date().toISOString(),
        });
    },

    // Social profile clicked
    socialProfileClicked: (platform: string) => {
        posthog.capture('social_profile_clicked', {
            platform,
            timestamp: new Date().toISOString(),
        });
    },

    // Skills section interaction
    skillViewed: (skillName: string) => {
        posthog.capture('skill_viewed', {
            skill_name: skillName,
            timestamp: new Date().toISOString(),
        });
    },

    // User scroll depth tracking
    scrollDepthReached: (percentage: number) => {
        posthog.capture('scroll_depth_reached', {
            depth_percentage: percentage,
            timestamp: new Date().toISOString(),
        });
    },

    // Time spent on page
    timeSpentOnPage: (seconds: number, pageName: string) => {
        posthog.capture('time_spent_on_page', {
            time_seconds: seconds,
            page_name: pageName,
            timestamp: new Date().toISOString(),
        });
    },

    // Custom event for flexibility
    customEvent: (eventName: string, properties?: Record<string, unknown>) => {
        posthog.capture(eventName, {
            timestamp: new Date().toISOString(),
            ...properties,
        });
    },
};

// Export posthog instance for direct access if needed
export { posthog };
