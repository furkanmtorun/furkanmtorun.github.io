/* 
 * Furkan M. Torun | Personal Website
 * https://furkanmtorun.github.io/
 */

// Google Analytics
window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'G-V69JP3D22N');

/**
 * Tab functionality
 * @param {Event} evt - The event object
 * @param {string} tabName - Name of the tab to open
 */
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("content-tab");
    const tabLinks = document.getElementsByClassName("tab");
    
    // Hide all tab contents
    Array.from(tabContents).forEach(tab => {
        tab.style.display = "none";
    });
    
    // Remove active class from all tabs
    Array.from(tabLinks).forEach(link => {
        link.className = link.className.replace(" is-active", "");
    });
    
    // Show selected tab and mark it as active
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " is-active";
}

// GDPR Notification handling
if (document.cookie.includes('gdprNotificationClosed')) {
    document.getElementById('gdprNotification').style.display = 'none';
}

function closeNotification() {
    const farFuture = new Date(9999, 11, 31).toUTCString();
    document.cookie = `gdprNotificationClosed=true; expires=${farFuture}; path=/`;
    document.getElementById('gdprNotification').style.display = 'none';
}
