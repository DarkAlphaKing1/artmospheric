import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

/**
 * Send performance metrics to an analytics endpoint.
 * @param {Object} metric - The Web Vitals metric object.
 */
const sendToAnalytics = (metric) => {
    const body = JSON.stringify(metric);
    const url = '/analytics'; // Replace with your analytics endpoint.

    // Use navigator.sendBeacon if available, otherwise use fetch.
    if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
    } else {
        fetch(url, {
            method: 'POST',
            body,
            keepalive: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((error) => {
            console.error("Error sending Web Vitals metric:", error);
        });
    }
};

// Measure Core Web Vitals and send data to analytics.
export const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && typeof onPerfEntry === 'function') {
        // Pass the metrics to your custom handler
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
    }
};

// Optionally send metrics to your analytics endpoint.
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
