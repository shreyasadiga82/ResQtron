/* ================================================================
   RESQTRON — AI-Powered Intelligent Ambulance Emergency Response System
   Complete Application Logic with Mappls Maps Integration
   ================================================================ */

// ===== GLOBAL STATE =====
let mapplsReady = false;
let dashboardMap = null, trafficMap = null, fleetMap = null;
let dashboardMarkers = [], trafficMarkers = [], fleetMarkers = [];
let dashboardRoute = null, trafficRoute = null;
let demoCharts = {}, dashCharts = {}, analyticsCharts = {};
let simulationRunning = false;
let currentPage = 'landing';
let currentRole = null; // 'admin' or 'patient'
let loggedInUser = null;
let patientBooking = null; // current active booking for patient
let patientTrackMap = null;
let patientBookingHistory = [];

let fleetData = JSON.parse(localStorage.getItem('resqtron_fleet') || 'null');
if (!fleetData) {
    fleetData = [
        { id: 'AMB-001', driver: 'Rajesh Kumar', phone: '+91 98451 23456', status: 'active', lat: 12.9352, lng: 77.6245, patient: 'Raj Mehta, 54M', emergency: 'Cardiac Arrest', paramedic: 'Dr. Priya Sharma', destination: 'City General Hospital', destLat: 12.9611, destLng: 77.6387, speed: 72, eta: 5, severity: 'critical' },
        { id: 'AMB-002', driver: 'Suresh Patil', phone: '+91 98452 34567', status: 'active', lat: 12.9784, lng: 77.6408, patient: 'Ananya Rao, 32F', emergency: 'Trauma', paramedic: 'Dr. Karthik N', destination: 'Apollo Hospital', destLat: 12.9716, destLng: 77.5946, speed: 58, eta: 8, severity: 'moderate' },
        { id: 'AMB-003', driver: 'Mohammed Ali', phone: '+91 98453 45678', status: 'active', lat: 12.9563, lng: 77.5857, patient: 'Vikram Singh, 28M', emergency: 'Respiratory Distress', paramedic: 'Dr. Meera Joshi', destination: 'Fortis Hospital', destLat: 12.9906, destLng: 77.5717, speed: 45, eta: 12, severity: 'moderate' },
        { id: 'AMB-004', driver: 'Anil Reddy', phone: '+91 98454 56789', status: 'available', lat: 12.9063, lng: 77.5857, patient: '—', emergency: '—', paramedic: '—', destination: '—', destLat: 0, destLng: 0, speed: 0, eta: 0, severity: 'none' },
        { id: 'AMB-005', driver: 'Prakash Rao', phone: '+91 98455 67890', status: 'available', lat: 12.9698, lng: 77.7500, patient: '—', emergency: '—', paramedic: '—', destination: '—', destLat: 0, destLng: 0, speed: 0, eta: 0, severity: 'none' },
        { id: 'AMB-006', driver: 'Deepak Shetty', phone: '+91 98456 78901', status: 'maintenance', lat: 12.9516, lng: 77.5946, patient: '—', emergency: '—', paramedic: '—', destination: '—', destLat: 0, destLng: 0, speed: 0, eta: 0, severity: 'none' },
        { id: 'AMB-007', driver: 'Kiran Nair', phone: '+91 98457 89012', status: 'active', lat: 12.9756, lng: 77.6060, patient: 'Lakshmi Devi, 67F', emergency: 'Stroke', paramedic: 'Dr. Ravi Kumar', destination: 'Narayana Health', destLat: 12.9093, destLng: 77.5990, speed: 65, eta: 7, severity: 'critical' },
        { id: 'AMB-008', driver: 'Ramesh Gowda', phone: '+91 98458 90123', status: 'available', lat: 13.0358, lng: 77.5970, patient: '—', emergency: '—', paramedic: '—', destination: '—', destLat: 0, destLng: 0, speed: 0, eta: 0, severity: 'none' }
    ];
    localStorage.setItem('resqtron_fleet', JSON.stringify(fleetData));
}

function saveFleetData() {
    localStorage.setItem('resqtron_fleet', JSON.stringify(fleetData));
}

// ===== HOSPITAL DATA =====
let hospitalsData = [
    { name: 'City General Hospital', dist: '2.3 km', beds: 34, icu: 8, docs: 12, lat: 12.9611, lng: 77.6387, status: 'available', rating: 4.5, phone: '+91 80 2553 1234' },
    { name: 'Apollo Hospital', dist: '4.1 km', beds: 56, icu: 15, docs: 22, lat: 12.9716, lng: 77.5946, status: 'available', rating: 4.8, phone: '+91 80 2630 4050' },
    { name: 'Fortis Hospital', dist: '5.6 km', beds: 12, icu: 3, docs: 8, lat: 12.9906, lng: 77.5717, status: 'limited', rating: 4.3, phone: '+91 80 6621 4444' },
    { name: 'Narayana Health', dist: '6.2 km', beds: 45, icu: 12, docs: 18, lat: 12.9093, lng: 77.5990, status: 'available', rating: 4.6, phone: '+91 80 7122 2222' },
    { name: 'Manipal Hospital', dist: '3.8 km', beds: 0, icu: 0, docs: 5, lat: 12.9587, lng: 77.6476, status: 'full', rating: 4.4, phone: '+91 80 2502 4444' },
    { name: 'Columbia Asia', dist: '7.4 km', beds: 28, icu: 6, docs: 14, lat: 12.9921, lng: 77.6965, status: 'available', rating: 4.2, phone: '+91 80 7154 8000' },
    { name: 'MS Ramaiah Memorial Hospital', dist: '8.1 km', beds: 42, icu: 10, docs: 20, lat: 13.0291, lng: 77.5647, status: 'available', rating: 4.7, phone: '+91 80 2360 8888' },
    { name: 'NIMHANS Hospital', dist: '3.5 km', beds: 60, icu: 18, docs: 35, lat: 12.9416, lng: 77.5964, status: 'available', rating: 4.9, phone: '+91 80 2699 5000' },
    { name: 'St. John\'s Medical College Hospital', dist: '5.2 km', beds: 38, icu: 9, docs: 16, lat: 12.9286, lng: 77.6213, status: 'limited', rating: 4.5, phone: '+91 80 2206 5000' },
    { name: 'BGS Gleneagles Global Hospital', dist: '9.3 km', beds: 50, icu: 14, docs: 25, lat: 12.8893, lng: 77.5169, status: 'available', rating: 4.6, phone: '+91 80 2625 5555' },
    { name: 'Sakra World Hospital', dist: '10.5 km', beds: 35, icu: 8, docs: 15, lat: 12.9353, lng: 77.6922, status: 'available', rating: 4.4, phone: '+91 80 4969 4969' },
    { name: 'Aster CMI Hospital', dist: '11.2 km', beds: 30, icu: 7, docs: 12, lat: 13.0467, lng: 77.5694, status: 'limited', rating: 4.3, phone: '+91 80 4342 0100' },
    { name: 'Sagar Hospitals', dist: '4.8 km', beds: 25, icu: 6, docs: 10, lat: 12.9132, lng: 77.5655, status: 'available', rating: 4.1, phone: '+91 80 4969 6969' },
    { name: 'Sparsh Hospital', dist: '6.7 km', beds: 20, icu: 5, docs: 8, lat: 12.9078, lng: 77.6384, status: 'available', rating: 4.2, phone: '+91 80 6624 4444' },
    { name: 'Vikram Hospital', dist: '3.2 km', beds: 18, icu: 4, docs: 9, lat: 12.9698, lng: 77.6100, status: 'available', rating: 4.0, phone: '+91 80 2558 9999' },
    { name: 'Bangalore Baptist Hospital', dist: '7.9 km', beds: 32, icu: 8, docs: 14, lat: 13.0105, lng: 77.5560, status: 'available', rating: 4.3, phone: '+91 80 2204 0700' },
    { name: 'Bowring & Lady Curzon Hospital', dist: '2.8 km', beds: 40, icu: 10, docs: 16, lat: 12.9803, lng: 77.6065, status: 'limited', rating: 3.9, phone: '+91 80 2559 1325' }
];

// ===== PATIENT QUEUE =====
let patientQueue = [];
let patientIdCounter = 1000;

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 1500);
});

// ===== MAPPLS CALLBACK (called by SDK) =====
function initMappls() {
    mapplsReady = true;
    console.log('✅ Mappls SDK loaded successfully');
    // Initialize maps if pages are already active
    if (currentPage === 'dashboard') initDashboardMap();
    if (currentPage === 'traffic') initTrafficMap();
    if (currentPage === 'admin') initFleetMap();
}

// ===== NAVIGATION =====
    document.addEventListener('DOMContentLoaded', () => {
        fetchFromDB().then(() => {
            console.log("DB Loaded");
        }).catch(e => console.error('Early DB load error', e));
        initLogin();
        initNavigation();
        initDemoSection();
        initDashboard();
        initHospitals();
        initTrafficPage();
        initCommunication();
        initAnalytics();
        initAdminPage();
        initPatientForm();
        initPatientPortal();
        animateCounters();
    });

    function initNavigation() {
        const navLinks = document.querySelectorAll('[data-page]');
        const mobileNav = document.getElementById('mobile-nav');
        const navToggle = document.getElementById('nav-toggle');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                navigateTo(page);
                if (mobileNav) mobileNav.classList.remove('active');
            });
        });

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
            });
        }
    }

    function navigateTo(page) {
        currentPage = page;
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });
        // Show target
        const target = document.getElementById(`page-${page}`);
        if (target) {
            target.style.display = '';
            target.classList.add('active');
        }
        // Update nav — only update the active nav group
        const navGroup = currentRole === 'patient' ? '#patient-nav-links' : '#admin-nav-links';
        document.querySelectorAll(`${navGroup} .nav-link`).forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`${navGroup} .nav-link[data-page="${page}"]`).forEach(l => l.classList.add('active'));

        window.scrollTo(0, 0);

        // Initialize maps when navigating to relevant pages
        if (mapplsReady) {
            setTimeout(() => {
                if (page === 'dashboard') {
                    if (!dashboardMap) initDashboardMap();
                    else try { dashboardMap.resize(); } catch (e) { initDashboardMap(); }
                }
                if (page === 'traffic') {
                    if (!trafficMap) initTrafficMap();
                    else try { trafficMap.resize(); } catch (e) { initTrafficMap(); }
                }
                if (page === 'admin') {
                    if (!fleetMap) initFleetMap();
                    else try { fleetMap.resize(); } catch (e) { fleetMap = null; initFleetMap(); }
                }
                if (page === 'patient-track' && patientBooking) {
                    if (!patientTrackMap) initPatientTrackMap();
                    else try { patientTrackMap.resize(); } catch (e) { patientTrackMap = null; initPatientTrackMap(); }
                }
            }, 250);
        }

        // Show/hide admin-only hospital button
        if (page === 'hospital') {
            const addHospBtn = document.getElementById('btn-add-hospital');
            if (addHospBtn) {
                addHospBtn.style.display = currentRole === 'admin' ? '' : 'none';
            }
        }
    }

    // ===== CUSTOM AMBULANCE ICON (Canvas PNG for Mappls compatibility) =====
    function createAmbulanceSVG(rotation = 0, color = '#FF6B00') {
        const canvas = document.createElement('canvas');
        canvas.width = 52;
        canvas.height = 52;
        const ctx = canvas.getContext('2d');

        // Outer glow circle
        ctx.beginPath();
        ctx.arc(26, 26, 25, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.fill();

        // Main circle
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(26, 26, 20, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Direction arrow (triangle at top)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(26, 3);
        ctx.lineTo(31, 11);
        ctx.lineTo(21, 11);
        ctx.closePath();
        ctx.fill();

        // Ambulance body (white rectangle)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(16, 20, 20, 14, 2);
        ctx.fill();

        // Red stripe  
        ctx.fillStyle = '#cc0000';
        ctx.beginPath();
        ctx.roundRect(16, 20, 20, 3, [2, 2, 0, 0]);
        ctx.fill();

        // Medical cross
        ctx.fillStyle = color;
        ctx.fillRect(23, 24, 6, 2);
        ctx.fillRect(25, 22, 2, 6);

        // Wheels
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(20, 35, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(32, 35, 2, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL('image/png');
    }

    // Simple fallback icon
    function createSimpleAmbulanceIcon(color = '#FF6B00') {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(20, 20, 18, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.fillRect(12, 18, 16, 4);
        ctx.fillRect(18, 12, 4, 16);
        return canvas.toDataURL('image/png');
    }

    function getDirectionAngle(lat1, lng1, lat2, lng2) {
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const y = Math.sin(dLng) * Math.cos(lat2 * Math.PI / 180);
        const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLng);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }

    // Track which ambulance is currently shown on dashboard map
    let currentDashboardAmbId = 'AMB-001';
    let currentTrafficAmbId = 'AMB-001';
    let dashboardAnimInterval = null;
    let trafficAnimInterval = null;

    // ===== MAPPLS: DASHBOARD MAP =====
    function destroyMap(map, markers, route, animInterval) {
        if (animInterval) clearInterval(animInterval);
        if (map) {
            try {
                if (markers && markers.length) {
                    markers.forEach(m => { try { mappls.remove({ map: map, layer: m }); } catch (e) { } });
                }
                if (route) try { mappls.remove({ map: map, layer: route }); } catch (e) { }
                map.remove();
            } catch (e) { console.warn('Map destroy error:', e); }
        }
    }

    function initDashboardMap() {
        const container = document.getElementById('dashboard-mappls-map');
        if (!container || !mapplsReady) return;

        // Destroy existing map completely to prevent blue/blank screen
        destroyMap(dashboardMap, dashboardMarkers, dashboardRoute, dashboardAnimInterval);
        dashboardMap = null;
        dashboardMarkers = [];
        dashboardRoute = null;
        dashboardAnimInterval = null;

        // Clear the container content and force a reflow
        container.innerHTML = '';
        container.style.background = 'var(--bg-secondary, #1a1a2e)';

        // Small delay ensures DOM is ready after cleanup
        setTimeout(() => {
            try {
                const amb = fleetData.find(a => a.id === currentDashboardAmbId) || fleetData.find(a => a.status === 'active') || fleetData[0];

                dashboardMap = new mappls.Map('dashboard-mappls-map', {
                    center: [amb.lat, amb.lng],
                    zoom: 13,
                    zoomControl: true,
                    search: false
                });

                dashboardMap.addListener('load', () => {
                    // Reset background once map is loaded
                    container.style.background = '';
                    loadDashboardAmbulance(amb);
                });
            } catch (e) {
                console.warn('Dashboard map init error:', e);
            }
        }, 100);
    }

    function loadDashboardAmbulance(amb) {
        if (!dashboardMap) return;

        // Clear old markers
        dashboardMarkers.forEach(m => { try { mappls.remove({ map: dashboardMap, layer: m }); } catch (e) { } });
        if (dashboardRoute) try { mappls.remove({ map: dashboardMap, layer: dashboardRoute }); } catch (e) { }
        dashboardMarkers = [];
        dashboardRoute = null;
        if (dashboardAnimInterval) { clearInterval(dashboardAnimInterval); dashboardAnimInterval = null; }

        // Direction angle for ambulance icon
        const angle = amb.destLat ? getDirectionAngle(amb.lat, amb.lng, amb.destLat, amb.destLng) : 0;
        const iconColor = amb.severity === 'critical' ? '#FF4500' : '#FF6B00';

        // Ambulance marker with custom directional SVG
        const ambMarker = new mappls.Marker({
            map: dashboardMap,
            position: { lat: amb.lat, lng: amb.lng },
            popupHtml: buildPopupHTML(amb),
            popupOptions: { openPopup: true },
            icon_url: createAmbulanceSVG(angle, iconColor),
            width: 52,
            height: 52
        });
        dashboardMarkers.push(ambMarker);

        // Hospital marker
        if (amb.destLat) {
            const hospMarker = new mappls.Marker({
                map: dashboardMap,
                position: { lat: amb.destLat, lng: amb.destLng },
                popupHtml: `<div class="amb-popup"><h4>🏥 ${amb.destination}</h4><p style="font-size:0.8rem;color:#666;">Destination Hospital</p></div>`,
                popupOptions: { openPopup: false },
                icon_url: 'https://img.icons8.com/color/36/hospital-2.png'
            });
            dashboardMarkers.push(hospMarker);
        }

        // Route polyline with gradient-like dashed pattern
        if (amb.destLat) {
            const routePath = generateRoutePath(amb.lat, amb.lng, amb.destLat, amb.destLng);

            // Shadow route (wider, transparent)
            const shadowRoute = new mappls.Polyline({
                map: dashboardMap,
                path: routePath,
                strokeColor: iconColor,
                strokeOpacity: 0.15,
                strokeWeight: 12,
                fitbounds: true
            });
            dashboardMarkers.push(shadowRoute);

            // Main route
            dashboardRoute = new mappls.Polyline({
                map: dashboardMap,
                path: routePath,
                strokeColor: iconColor,
                strokeOpacity: 0.8,
                strokeWeight: 4,
                fitbounds: true,
                dasharray: [12, 8]
            });
        }

        // Update info panel
        const caseRows = document.querySelectorAll('.case-row .case-value');
        if (caseRows.length >= 7) {
            caseRows[0].textContent = amb.patient;
            caseRows[1].textContent = amb.emergency;
            caseRows[1].className = `case-value ${amb.severity === 'critical' ? 'critical-text' : ''}`;
            caseRows[2].textContent = amb.id;
            caseRows[3].textContent = amb.paramedic;
            caseRows[4].textContent = amb.destination;
        }

        // Simulate movement
        simulateAmbulanceMovement(dashboardMap, ambMarker, amb, 'dashboard');
    }

    // ===== MAPPLS: TRAFFIC MAP =====
    function initTrafficMap() {
        const container = document.getElementById('traffic-mappls-map');
        if (!container || !mapplsReady) return;

        // Destroy existing map completely to prevent blue/blank screen
        destroyMap(trafficMap, trafficMarkers, trafficRoute, trafficAnimInterval);
        trafficMap = null;
        trafficMarkers = [];
        trafficRoute = null;
        trafficAnimInterval = null;

        // Clear the container and force reflow
        container.innerHTML = '';
        container.style.background = 'var(--bg-secondary, #1a1a2e)';

        setTimeout(() => {
            try {
                const amb = fleetData.find(a => a.id === currentTrafficAmbId) || fleetData.find(a => a.status === 'active') || fleetData[0];

                trafficMap = new mappls.Map('traffic-mappls-map', {
                    center: [amb.lat, amb.lng],
                    zoom: 13,
                    zoomControl: true,
                    search: false
                });

                trafficMap.addListener('load', () => {
                    container.style.background = '';
                    loadTrafficAmbulance(amb);
                });
            } catch (e) {
                console.warn('Traffic map init error:', e);
            }
        }, 100);
    }

    function loadTrafficAmbulance(amb) {
        if (!trafficMap) return;

        // Clear old
        trafficMarkers.forEach(m => { try { mappls.remove({ map: trafficMap, layer: m }); } catch (e) { } });
        if (trafficRoute) try { mappls.remove({ map: trafficMap, layer: trafficRoute }); } catch (e) { }
        trafficMarkers = [];
        trafficRoute = null;
        if (trafficAnimInterval) { clearInterval(trafficAnimInterval); trafficAnimInterval = null; }

        // Traffic signal markers (junctions along route)
        const signals = [
            { lat: (amb.lat + (amb.destLat || amb.lat)) / 2 - 0.005, lng: (amb.lng + (amb.destLng || amb.lng)) / 2, name: 'Junction A — MG Road × 1st Cross', status: 'green' },
            { lat: (amb.lat + (amb.destLat || amb.lat)) / 2, lng: (amb.lng + (amb.destLng || amb.lng)) / 2 + 0.005, name: 'Junction B — MG Road × 3rd Cross', status: 'red' },
            { lat: (amb.lat + (amb.destLat || amb.lat)) / 2 + 0.005, lng: (amb.lng + (amb.destLng || amb.lng)) / 2 + 0.003, name: 'Junction C — Brigade Road × 5th Cross', status: 'red' }
        ];

        signals.forEach((sig) => {
            const marker = new mappls.Marker({
                map: trafficMap,
                position: { lat: sig.lat, lng: sig.lng },
                popupHtml: `<div class="amb-popup"><h4>🚦 ${sig.name}</h4><p style="font-size:0.8rem;color:${sig.status === 'green' ? '#22c55e' : '#ef4444'};">${sig.status.toUpperCase()}</p></div>`,
                popupOptions: { openPopup: false },
                icon_url: sig.status === 'green'
                    ? 'https://img.icons8.com/color/30/traffic-light-green.png'
                    : 'https://img.icons8.com/color/30/traffic-light-red.png'
            });
            trafficMarkers.push(marker);
        });

        // Ambulance with directional icon
        const angle = amb.destLat ? getDirectionAngle(amb.lat, amb.lng, amb.destLat, amb.destLng) : 0;
        const iconColor = amb.severity === 'critical' ? '#FF4500' : '#FF6B00';

        const ambMarker = new mappls.Marker({
            map: trafficMap,
            position: { lat: amb.lat, lng: amb.lng },
            popupHtml: buildPopupHTML(amb),
            popupOptions: { openPopup: true },
            icon_url: createAmbulanceSVG(angle, iconColor),
            width: 52,
            height: 52
        });
        trafficMarkers.push(ambMarker);

        // Hospital
        if (amb.destLat) {
            const hospMarker = new mappls.Marker({
                map: trafficMap,
                position: { lat: amb.destLat, lng: amb.destLng },
                popupHtml: `<div class="amb-popup"><h4>🏥 ${amb.destination}</h4></div>`,
                popupOptions: { openPopup: false },
                icon_url: 'https://img.icons8.com/color/36/hospital-2.png'
            });
            trafficMarkers.push(hospMarker);

            // Route with glow
            const routePath = generateRoutePath(amb.lat, amb.lng, amb.destLat, amb.destLng);

            const shadowRoute = new mappls.Polyline({
                map: trafficMap,
                path: routePath,
                strokeColor: iconColor,
                strokeOpacity: 0.15,
                strokeWeight: 12,
                fitbounds: true
            });
            trafficMarkers.push(shadowRoute);

            trafficRoute = new mappls.Polyline({
                map: trafficMap,
                path: routePath,
                strokeColor: iconColor,
                strokeOpacity: 0.8,
                strokeWeight: 4,
                fitbounds: true,
                dasharray: [12, 8]
            });
        }

        // Center map
        trafficMap.setCenter([amb.lat, amb.lng]);

        // Simulate movement
        simulateAmbulanceMovement(trafficMap, ambMarker, amb, 'traffic');
    }

    // ===== MAPPLS: FLEET TRACKING MAP =====
    function initFleetMap() {
        const container = document.getElementById('fleet-mappls-map');
        if (!container || !mapplsReady) return;

        // If fleet map already exists, just resize and update markers
        if (fleetMap) {
            try {
                fleetMap.resize();
                updateFleetMapMarkers();
                return;
            } catch (e) {
                // Map is corrupted, destroy and recreate
                destroyMap(fleetMap, fleetMarkers, null, null);
                fleetMap = null;
                fleetMarkers = [];
            }
        }

        container.innerHTML = '';
        container.style.background = 'var(--bg-secondary, #1a1a2e)';

        setTimeout(() => {
            try {
                fleetMap = new mappls.Map('fleet-mappls-map', {
                    center: [12.9600, 77.6200],
                    zoom: 12,
                    zoomControl: true,
                    search: false
                });

                fleetMap.addListener('load', () => {
                    container.style.background = '';
                    updateFleetMapMarkers();
                });
            } catch (e) {
                console.warn('Fleet map init error:', e);
            }
        }, 100);
    }

    function updateFleetMapMarkers() {
        if (!fleetMap) return;

        // Clear existing markers
        fleetMarkers.forEach(m => {
            try { mappls.remove({ map: fleetMap, layer: m }); } catch (e) { }
        });
        fleetMarkers = [];

        // Add marker for each ambulance with the custom ambulance icon
        fleetData.forEach(amb => {
            let iconUrl;
            if (amb.status === 'active') {
                const angle = amb.destLat ? getDirectionAngle(amb.lat, amb.lng, amb.destLat, amb.destLng) : 0;
                const iconColor = amb.severity === 'critical' ? '#FF4500' : '#FF6B00';
                iconUrl = createAmbulanceSVG(angle, iconColor);
            } else if (amb.status === 'available') {
                iconUrl = createAmbulanceSVG(0, '#22c55e');
            } else {
                iconUrl = createAmbulanceSVG(0, '#f59e0b');
            }

            const marker = new mappls.Marker({
                map: fleetMap,
                position: { lat: amb.lat, lng: amb.lng },
                popupHtml: buildPopupHTML(amb),
                popupOptions: { openPopup: false },
                icon_url: iconUrl,
                width: 52,
                height: 52
            });
            fleetMarkers.push(marker);

            // Add route lines for active ambulances on fleet map
            if (amb.status === 'active' && amb.destLat) {
                const routePath = generateRoutePath(amb.lat, amb.lng, amb.destLat, amb.destLng);
                const routeColor = amb.severity === 'critical' ? '#FF4500' : '#FF6B00';
                const route = new mappls.Polyline({
                    map: fleetMap,
                    path: routePath,
                    strokeColor: routeColor,
                    strokeOpacity: 0.5,
                    strokeWeight: 3,
                    fitbounds: false,
                    dasharray: [8, 6]
                });
                fleetMarkers.push(route);
            }
        });

        // Also add hospital markers
        hospitalsData.forEach(h => {
            const marker = new mappls.Marker({
                map: fleetMap,
                position: { lat: h.lat, lng: h.lng },
                popupHtml: `<div class="amb-popup"><h4>🏥 ${h.name}</h4><div class="popup-row"><span class="popup-label">Beds</span><span class="popup-value">${h.beds}</span></div><div class="popup-row"><span class="popup-label">ICU</span><span class="popup-value">${h.icu}</span></div><div class="popup-row"><span class="popup-label">Doctors</span><span class="popup-value">${h.docs}</span></div></div>`,
                popupOptions: { openPopup: false },
                icon_url: 'https://img.icons8.com/color/30/hospital-2.png'
            });
            fleetMarkers.push(marker);
        });
    }

    // ===== POPUP HTML BUILDER =====
    function buildPopupHTML(amb) {
        const statusClass = amb.status === 'active' ? 'active' : amb.status === 'available' ? 'available' : 'maintenance';
        const statusLabel = amb.status.charAt(0).toUpperCase() + amb.status.slice(1);

        let html = `<div class="amb-popup">
        <h4>🚑 ${amb.id} <span class="popup-status ${statusClass}">${statusLabel}</span></h4>
        <div class="popup-row"><span class="popup-label">Driver</span><span class="popup-value">${amb.driver}</span></div>`;

        if (amb.status === 'active') {
            html += `
        <div class="popup-row"><span class="popup-label">Patient</span><span class="popup-value">${amb.patient}</span></div>
        <div class="popup-row"><span class="popup-label">Emergency</span><span class="popup-value popup-emergency">${amb.emergency}</span></div>
        <div class="popup-row"><span class="popup-label">Paramedic</span><span class="popup-value">${amb.paramedic}</span></div>
        <div class="popup-row"><span class="popup-label">Destination</span><span class="popup-value">${amb.destination}</span></div>
        <div class="popup-row"><span class="popup-label">Speed</span><span class="popup-value">${amb.speed} km/h</span></div>
        <div class="popup-row"><span class="popup-label">ETA</span><span class="popup-value">${amb.eta} min</span></div>`;
        }

        html += `</div>`;
        return html;
    }

    // ===== ROUTE PATH GENERATOR (Realistic road-like routing with turns) =====
    function generateRoutePath(lat1, lng1, lat2, lng2) {
        const path = [];
        const dLat = lat2 - lat1;
        const dLng = lng2 - lng1;
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);

        // Generate road-like waypoints that follow a grid pattern (simulating real streets)
        // Instead of a simple curve, we create L-shaped and S-shaped turns
        const numSegments = Math.max(4, Math.min(8, Math.round(distance * 500)));

        // Create intermediate waypoints that simulate road turns
        const waypoints = [{ lat: lat1, lng: lng1 }];

        // Strategy: Move in a road-grid pattern with some randomness
        // First segment: Go primarily in one direction (horizontal or vertical)
        // Then turn and go the other direction, creating realistic road routing

        const goLatFirst = Math.abs(dLat) > Math.abs(dLng);

        // Generate 3-5 turn points to simulate real road navigation
        const turnCount = 3 + Math.floor(Math.random() * 2);

        for (let i = 1; i < turnCount; i++) {
            const progress = i / turnCount;
            // Base position along the direct line
            let wpLat = lat1 + dLat * progress;
            let wpLng = lng1 + dLng * progress;

            // Add road-grid offset (simulating turns at intersections)
            // Alternate between lateral and longitudinal offsets
            const offsetMagnitude = distance * 0.08 * Math.sin(progress * Math.PI);
            if (i % 2 === 1) {
                wpLat += (goLatFirst ? 0 : offsetMagnitude) * (i % 4 < 2 ? 1 : -1);
                wpLng += (goLatFirst ? offsetMagnitude : 0) * (i % 4 < 2 ? 1 : -1);
            } else {
                wpLat += offsetMagnitude * 0.3 * (Math.random() > 0.5 ? 1 : -1);
                wpLng += offsetMagnitude * 0.3 * (Math.random() > 0.5 ? 1 : -1);
            }

            waypoints.push({ lat: wpLat, lng: wpLng });
        }

        waypoints.push({ lat: lat2, lng: lng2 });

        // Now interpolate smoothly between waypoints using Catmull-Rom spline
        const stepsPerSegment = 8;

        for (let seg = 0; seg < waypoints.length - 1; seg++) {
            const p0 = waypoints[Math.max(0, seg - 1)];
            const p1 = waypoints[seg];
            const p2 = waypoints[Math.min(waypoints.length - 1, seg + 1)];
            const p3 = waypoints[Math.min(waypoints.length - 1, seg + 2)];

            for (let s = 0; s < stepsPerSegment; s++) {
                const t = s / stepsPerSegment;
                const t2 = t * t;
                const t3 = t2 * t;

                // Catmull-Rom spline interpolation for smooth road curves
                const lat = 0.5 * (
                    (2 * p1.lat) +
                    (-p0.lat + p2.lat) * t +
                    (2 * p0.lat - 5 * p1.lat + 4 * p2.lat - p3.lat) * t2 +
                    (-p0.lat + 3 * p1.lat - 3 * p2.lat + p3.lat) * t3
                );
                const lng = 0.5 * (
                    (2 * p1.lng) +
                    (-p0.lng + p2.lng) * t +
                    (2 * p0.lng - 5 * p1.lng + 4 * p2.lng - p3.lng) * t2 +
                    (-p0.lng + 3 * p1.lng - 3 * p2.lng + p3.lng) * t3
                );

                path.push({ lat, lng });
            }
        }

        // Add final point
        path.push({ lat: lat2, lng: lng2 });

        return path;
    }

    // ===== AMBULANCE MOVEMENT SIMULATION =====
    function simulateAmbulanceMovement(map, marker, amb, context = 'dashboard') {
        if (!amb.destLat) return;
        let step = 0;
        const path = generateRoutePath(amb.lat, amb.lng, amb.destLat, amb.destLng);

        const interval = setInterval(() => {
            step = (step + 1) % path.length;
            const prevStep = step === 0 ? path.length - 1 : step - 1;

            try {
                marker.setPosition(path[step]);
                // Update icon with new direction
                const angle = getDirectionAngle(path[prevStep].lat, path[prevStep].lng, path[step].lat, path[step].lng);
                const iconColor = amb.severity === 'critical' ? '#FF4500' : '#FF6B00';
                try { marker.setIcon(createAmbulanceSVG(angle, iconColor)); } catch (e) { }
            } catch (e) { }

            // Update info panel (only for dashboard context)
            if (context === 'dashboard') {
                const speed = 50 + Math.floor(Math.random() * 40);
                const eta = Math.max(1, amb.eta - Math.floor(step / 3));
                const dist = Math.max(0.5, (amb.eta * 0.8 - step * 0.15)).toFixed(1);
                const speedEl = document.getElementById('dash-speed');
                const etaEl = document.getElementById('dash-eta');
                const distEl = document.getElementById('dash-distance');
                if (speedEl) speedEl.textContent = speed;
                if (etaEl) etaEl.textContent = eta;
                if (distEl) distEl.textContent = dist;
            }
        }, 2500);

        // Store interval for cleanup
        if (context === 'dashboard') dashboardAnimInterval = interval;
        else if (context === 'traffic') trafficAnimInterval = interval;
    }

    // ===== DEMO SECTION (Landing Page) =====
    function initDemoSection() {
        const hrCtx = document.getElementById('demo-hr-chart');
        const spo2Ctx = document.getElementById('demo-spo2-chart');
        const bpCtx = document.getElementById('demo-bp-chart');

        if (!hrCtx || !spo2Ctx || !bpCtx) return;

        const chartConfig = (color, data) => ({
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: color.replace(')', ',0.1)').replace('rgb', 'rgba'),
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                animation: false
            }
        });

        const hrData = Array(20).fill(0).map(() => 65 + Math.random() * 25);
        const spo2Data = Array(20).fill(0).map(() => 94 + Math.random() * 5);
        const bpData = Array(20).fill(0).map(() => 110 + Math.random() * 30);

        demoCharts.hr = new Chart(hrCtx, chartConfig('rgb(239, 68, 68)', hrData));
        demoCharts.spo2 = new Chart(spo2Ctx, chartConfig('rgb(59, 130, 246)', spo2Data));
        demoCharts.bp = new Chart(bpCtx, chartConfig('rgb(168, 85, 247)', bpData));

        // Update live demo
        setInterval(() => {
            // HR
            const newHR = 65 + Math.random() * 25;
            demoCharts.hr.data.datasets[0].data.push(newHR);
            demoCharts.hr.data.datasets[0].data.shift();
            demoCharts.hr.update('none');
            const hrEl = document.getElementById('demo-hr');
            if (hrEl) hrEl.textContent = Math.round(newHR);

            // SpO2
            const newSpo2 = 94 + Math.random() * 5;
            demoCharts.spo2.data.datasets[0].data.push(newSpo2);
            demoCharts.spo2.data.datasets[0].data.shift();
            demoCharts.spo2.update('none');
            const spo2El = document.getElementById('demo-spo2');
            if (spo2El) spo2El.textContent = Math.round(newSpo2);

            // BP
            const sys = 110 + Math.random() * 30;
            const dia = 70 + Math.random() * 15;
            demoCharts.bp.data.datasets[0].data.push(sys);
            demoCharts.bp.data.datasets[0].data.shift();
            demoCharts.bp.update('none');
            const bpEl = document.getElementById('demo-bp');
            if (bpEl) bpEl.textContent = `${Math.round(sys)}/${Math.round(dia)}`;

            // Speed/ETA
            const speedEl = document.getElementById('demo-speed');
            const etaEl = document.getElementById('demo-eta');
            if (speedEl) speedEl.textContent = 50 + Math.floor(Math.random() * 40);
            if (etaEl) etaEl.textContent = 3 + Math.floor(Math.random() * 6);
        }, 2000);

        // Simulation button
        const simBtn = document.getElementById('btn-start-simulation');
        if (simBtn) {
            simBtn.addEventListener('click', () => {
                navigateTo('dashboard');
                showToast('🚨 Emergency simulation started!', 'success');
            });
        }
    }

    // ===== DASHBOARD =====
    function initDashboard() {
        initDashboardCharts();
        startVitalUpdates();

        // Ambulance select
        const ambSelect = document.getElementById('ambulance-select');
        if (ambSelect) {
            // Populate from fleet data
            ambSelect.innerHTML = '';
            fleetData.filter(a => a.status === 'active').forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.id;
                opt.textContent = `${a.id} — ${a.severity === 'critical' ? 'Critical' : 'En Route'}`;
                ambSelect.appendChild(opt);
            });

            ambSelect.addEventListener('change', (e) => {
                const amb = fleetData.find(a => a.id === e.target.value);
                if (amb) updateDashboardForAmbulance(amb);
            });
        }

        // Relocate button for dashboard map — safely re-center without breaking the map
        const relocateBtn = document.getElementById('btn-relocate-dashboard');
        if (relocateBtn) {
            relocateBtn.addEventListener('click', () => {
                const amb = fleetData.find(a => a.id === currentDashboardAmbId);
                if (!amb || !mapplsReady) return;

                // If map is valid and responsive, just re-center
                if (dashboardMap) {
                    try {
                        dashboardMap.setCenter([amb.lat, amb.lng]);
                        dashboardMap.setZoom(14);
                        showToast('📍 Map re-centered on ambulance', 'info');
                        return;
                    } catch (e) {
                        // Map is broken, reinitialize
                        console.warn('Dashboard map re-center failed, reinitializing:', e);
                    }
                }
                // Reinitialize map if needed
                initDashboardMap();
                showToast('📍 Map re-initialized and centered', 'info');
            });
        }

        // Buttons
        const escalateBtn = document.getElementById('btn-escalate');
        if (escalateBtn) escalateBtn.addEventListener('click', () => showToast('⚠️ Case escalated to Level 3!', 'danger'));

        const notifyBtn = document.getElementById('btn-notify-hospital');
        if (notifyBtn) notifyBtn.addEventListener('click', () => showToast('🏥 Hospital alert sent successfully!', 'success'));

        // Add Patient button
        const addPatientBtn = document.getElementById('btn-add-patient');
        if (addPatientBtn) {
            addPatientBtn.addEventListener('click', () => {
                document.getElementById('patient-modal').classList.add('active');
            });
        }
    }

    function updateDashboardForAmbulance(amb) {
        currentDashboardAmbId = amb.id;

        // If map is valid, just reload the ambulance data without full map reinit
        if (dashboardMap && mapplsReady) {
            try {
                loadDashboardAmbulance(amb);
                dashboardMap.setCenter([amb.lat, amb.lng]);
                dashboardMap.setZoom(13);
                showToast(`📍 Tracking ${amb.id} — ${amb.patient}`, 'info');
                return;
            } catch (e) {
                console.warn('Dashboard reload failed, reinitializing:', e);
            }
        }

        // Fallback: full map reinit
        if (mapplsReady) {
            initDashboardMap();
        }

        showToast(`📍 Tracking ${amb.id} — ${amb.patient}`, 'info');
    }

    function initDashboardCharts() {
        const chartIds = ['dash-hr-chart', 'dash-spo2-chart', 'dash-bp-chart', 'dash-temp-chart'];
        const colors = ['#ef4444', '#3b82f6', '#a855f7', '#f97316'];
        const initValues = [
            Array(20).fill(0).map(() => 100 + Math.random() * 20),
            Array(20).fill(0).map(() => 90 + Math.random() * 8),
            Array(20).fill(0).map(() => 130 + Math.random() * 30),
            Array(20).fill(0).map(() => 36.5 + Math.random() * 1.5)
        ];

        chartIds.forEach((id, i) => {
            const ctx = document.getElementById(id);
            if (!ctx) return;
            dashCharts[id] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array(20).fill(''),
                    datasets: [{
                        data: initValues[i],
                        borderColor: colors[i],
                        backgroundColor: colors[i] + '15',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { display: false } },
                    animation: false
                }
            });
        });
    }

    function startVitalUpdates() {
        setInterval(() => {
            // Heart rate
            const hr = 90 + Math.random() * 30;
            updateVitalChart('dash-hr-chart', hr);
            updateVitalDisplay('dash-hr-value', Math.round(hr), 'hr-status', hr > 100 ? 'Critical' : 'Normal', hr > 100 ? 'status-critical' : 'status-normal');

            // SpO2
            const spo2 = 89 + Math.random() * 10;
            updateVitalChart('dash-spo2-chart', spo2);
            updateVitalDisplay('dash-spo2-value', Math.round(spo2), 'spo2-status', spo2 < 95 ? 'Warning' : 'Normal', spo2 < 95 ? 'status-warning' : 'status-normal');

            // BP
            const sys = 130 + Math.random() * 30;
            const dia = 80 + Math.random() * 20;
            updateVitalChart('dash-bp-chart', sys);
            const bpVal = document.getElementById('dash-bp-value');
            if (bpVal) bpVal.textContent = `${Math.round(sys)}/${Math.round(dia)}`;
            const bpStatus = document.getElementById('bp-status');
            if (bpStatus) {
                bpStatus.textContent = sys > 140 ? 'Elevated' : 'Normal';
                bpStatus.className = `status-indicator ${sys > 140 ? 'status-warning' : 'status-normal'}`;
            }

            // Temp
            const temp = 36.5 + Math.random() * 1.5;
            updateVitalChart('dash-temp-chart', temp);
            updateVitalDisplay('dash-temp-value', temp.toFixed(1), 'temp-status', temp > 37.5 ? 'Fever' : 'Normal', temp > 37.5 ? 'status-warning' : 'status-normal');
        }, 2500);
    }

    function updateVitalChart(chartId, value) {
        if (!dashCharts[chartId]) return;
        dashCharts[chartId].data.datasets[0].data.push(value);
        dashCharts[chartId].data.datasets[0].data.shift();
        dashCharts[chartId].update('none');
    }

    function updateVitalDisplay(valueId, value, statusId, statusText, statusClass) {
        const valEl = document.getElementById(valueId);
        if (valEl) valEl.textContent = value;
        const statEl = document.getElementById(statusId);
        if (statEl) {
            statEl.textContent = statusText;
            statEl.className = `status-indicator ${statusClass}`;
        }
    }

    // ===== HOSPITALS =====
    function initHospitals() {
        const grid = document.getElementById('hospitals-grid');
        if (!grid) return;

        // Load any custom hospitals from localStorage
        const savedHospitals = JSON.parse(localStorage.getItem('resqtron_custom_hospitals') || '[]');
        savedHospitals.forEach(h => {
            if (!hospitalsData.find(existing => existing.name === h.name)) {
                hospitalsData.push(h);
            }
        });

        // Show/hide Add Hospital button based on role
        const addHospBtn = document.getElementById('btn-add-hospital');
        if (addHospBtn) {
            addHospBtn.style.display = currentRole === 'admin' ? '' : 'none';
        }

        renderHospitals(grid);
    }

    function renderHospitals(grid) {
        grid.innerHTML = '';
        hospitalsData.forEach((h, i) => {
            const statusClass = h.status === 'available' ? 'hosp-available' : h.status === 'limited' ? 'hosp-limited' : 'hosp-full';
            const statusText = h.status === 'available' ? '✅ Available' : h.status === 'limited' ? '⚠️ Limited' : '❌ Full';
            const escapedName = h.name.replace(/'/g, "\\'");
            const deleteBtn = (currentRole === 'admin' && h.custom)
                ? `<button class="btn btn-sm" style="background:rgba(255,0,0,0.15);color:#ff4444;border:1px solid rgba(255,0,0,0.3);padding:0.3rem 0.6rem;font-size:0.75rem;" onclick="deleteHospital(${i})"><i class="fa-solid fa-trash"></i> Remove</button>`
                : '';
            grid.innerHTML += `
            <div class="hospital-card ${statusClass}">
                <div class="hosp-header">
                    <div>
                        <h3><i class="fa-solid fa-hospital"></i> ${h.name}</h3>
                        <span class="hosp-dist"><i class="fa-solid fa-location-dot"></i> ${h.dist}</span>
                    </div>
                    <span class="hosp-status">${statusText}</span>
                </div>
                <div class="hosp-stats">
                    <div class="hosp-stat"><span class="hosp-stat-value">${h.beds}</span><span class="hosp-stat-label">Beds</span></div>
                    <div class="hosp-stat"><span class="hosp-stat-value">${h.icu}</span><span class="hosp-stat-label">ICU</span></div>
                    <div class="hosp-stat"><span class="hosp-stat-value">${h.docs}</span><span class="hosp-stat-label">Doctors</span></div>
                    <div class="hosp-stat"><span class="hosp-stat-value">⭐ ${h.rating}</span><span class="hosp-stat-label">Rating</span></div>
                </div>
                <div style="padding:0 1.2rem;margin-bottom:0.6rem;display:flex;align-items:center;gap:0.5rem;">
                    <i class="fa-solid fa-phone" style="color:var(--accent-green);"></i>
                    <a href="tel:${h.phone}" style="color:var(--accent-green);text-decoration:none;font-weight:600;font-size:0.9rem;">${h.phone}</a>
                </div>
                <div class="hosp-actions">
                    <button class="btn btn-primary btn-sm" onclick="sendPatientData('${escapedName}')"><i class="fa-solid fa-paper-plane"></i> Send Patient Data</button>
                    <a href="tel:${h.phone}" class="btn btn-outline btn-sm"><i class="fa-solid fa-phone"></i> Call</a>
                    <button class="btn btn-outline btn-sm" onclick="navigateToHospital(${h.lat}, ${h.lng}, '${escapedName}')"><i class="fa-solid fa-route"></i> Navigate</button>
                    ${deleteBtn}
                </div>
            </div>`;
        });
    }

    // ===== ADD HOSPITAL (Admin Only) =====
    function openAddHospitalModal() {
        const modal = document.getElementById('add-hospital-modal');
        if (modal) modal.classList.add('active');
    }

    function closeAddHospitalModal() {
        const modal = document.getElementById('add-hospital-modal');
        if (modal) modal.classList.remove('active');
        document.getElementById('add-hospital-form')?.reset();
    }

    function submitAddHospital(e) {
        e.preventDefault();

        const name = document.getElementById('new-hosp-name').value.trim();
        const phone = document.getElementById('new-hosp-phone').value.trim();
        const lat = parseFloat(document.getElementById('new-hosp-lat').value);
        const lng = parseFloat(document.getElementById('new-hosp-lng').value);
        const beds = parseInt(document.getElementById('new-hosp-beds').value);
        const icu = parseInt(document.getElementById('new-hosp-icu').value);
        const docs = parseInt(document.getElementById('new-hosp-docs').value);
        const rating = parseFloat(document.getElementById('new-hosp-rating').value);
        const status = document.getElementById('new-hosp-status').value;

        // Check for duplicate
        if (hospitalsData.find(h => h.name.toLowerCase() === name.toLowerCase())) {
            showToast('❌ Hospital with this name already exists.', 'danger');
            return;
        }

        const newHospital = {
            name, phone, lat, lng, beds, icu, docs, rating, status,
            dist: 'Custom',
            custom: true  // Flag to identify admin-added hospitals
        };

        hospitalsData.push(newHospital);

        // Save custom hospitals to localStorage
        const customHospitals = hospitalsData.filter(h => h.custom);
        localStorage.setItem('resqtron_custom_hospitals', JSON.stringify(customHospitals));

        // Re-render
        const grid = document.getElementById('hospitals-grid');
        if (grid) renderHospitals(grid);

        closeAddHospitalModal();
        showToast(`🏥 ${name} added successfully!`, 'success');
    }

    function deleteHospital(index) {
        const hospital = hospitalsData[index];
        if (!hospital) return;
        if (!hospital.custom) {
            showToast('❌ Cannot delete built-in hospitals.', 'danger');
            return;
        }

        if (!confirm(`Are you sure you want to remove "${hospital.name}"?`)) return;

        hospitalsData.splice(index, 1);

        // Update localStorage
        const customHospitals = hospitalsData.filter(h => h.custom);
        localStorage.setItem('resqtron_custom_hospitals', JSON.stringify(customHospitals));

        // Re-render
        const grid = document.getElementById('hospitals-grid');
        if (grid) renderHospitals(grid);

        showToast(`🗑️ ${hospital.name} removed.`, 'info');
    }

    function sendPatientData(hospitalName) {
        const modal = document.getElementById('hospital-modal');
        const nameEl = document.getElementById('modal-hospital-name');
        if (modal && nameEl) {
            nameEl.textContent = hospitalName;
            modal.classList.add('active');
        }

        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.remove('active');
        }
    }

    function navigateToHospital(lat, lng, name) {
        // Open Mappls directions in new tab
        const url = `https://www.mappls.com/direction?places=12.9352,77.6245;${lat},${lng}`;
        window.open(url, '_blank');
        showToast(`🗺️ Navigation to ${name} opened in Mappls`, 'success');
    }

    // ===== TRAFFIC PAGE =====
    function initTrafficPage() {
        const overrideBtn = document.getElementById('btn-override-all');
        if (overrideBtn) {
            overrideBtn.addEventListener('click', () => overrideAllSignals());
        }

        // Populate traffic ambulance selector with active ambulances
        const trafficAmbSelect = document.getElementById('traffic-ambulance-select');
        if (trafficAmbSelect) {
            trafficAmbSelect.innerHTML = '';
            fleetData.filter(a => a.status === 'active').forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.id;
                opt.textContent = `${a.id} — ${a.patient} (${a.severity === 'critical' ? '🔴 Critical' : '🟡 Moderate'})`;
                trafficAmbSelect.appendChild(opt);
            });

            trafficAmbSelect.addEventListener('change', (e) => {
                const amb = fleetData.find(a => a.id === e.target.value);
                if (amb) {
                    currentTrafficAmbId = amb.id;
                    initTrafficMap();
                    showToast(`🚦 Now tracking ${amb.id} — ${amb.patient} on traffic`, 'info');
                }
            });
        }

        // Relocate button for traffic map
        const relocateTraffic = document.getElementById('btn-relocate-traffic');
        if (relocateTraffic) {
            relocateTraffic.addEventListener('click', () => {
                const amb = fleetData.find(a => a.id === currentTrafficAmbId);
                if (!amb || !mapplsReady) return;

                if (trafficMap) {
                    try {
                        trafficMap.setCenter([amb.lat, amb.lng]);
                        trafficMap.setZoom(14);
                        showToast('📍 Map re-centered on ambulance', 'info');
                        return;
                    } catch (e) {
                        console.warn('Traffic map re-center failed, reinitializing:', e);
                    }
                }
                initTrafficMap();
                showToast('📍 Map re-initialized and centered', 'info');
            });
        }
    }

    function overrideAllSignals() {
        const log = document.getElementById('traffic-log');
        const now = new Date().toLocaleTimeString('en-IN', { hour12: false });

        // Update signal items
        const s1 = document.getElementById('signal-item-1');
        const s2 = document.getElementById('signal-item-2');

        if (s1) {
            const lights = s1.querySelectorAll('.signal-light');
            lights.forEach(l => l.classList.remove('active'));
            lights[2]?.classList.add('active'); // green
            const statusT = s1.querySelector('.signal-status-text');
            if (statusT) { statusT.textContent = 'Signal Overridden ✅'; statusT.className = 'signal-status-text overridden'; }
        }

        if (s2) {
            setTimeout(() => {
                const lights = s2.querySelectorAll('.signal-light');
                lights.forEach(l => l.classList.remove('active'));
                lights[2]?.classList.add('active'); // green
                const statusT = s2.querySelector('.signal-status-text');
                if (statusT) { statusT.textContent = 'Signal Overridden ✅'; statusT.className = 'signal-status-text overridden'; }
            }, 1500);
        }

        // Override message
        const overrideMsg = document.getElementById('override-message');
        if (overrideMsg) overrideMsg.style.display = 'flex';

        // Log entries
        if (log) {
            log.innerHTML += `
            <div class="log-entry"><span class="log-time">${now}</span><span class="log-message">🟢 Junction A — Signal overridden to GREEN</span></div>
            <div class="log-entry"><span class="log-time">${now}</span><span class="log-message">🟢 Junction B — Signal overridden to GREEN</span></div>
            <div class="log-entry"><span class="log-time">${now}</span><span class="log-message">✅ All signals cleared for AMB-001 corridor</span></div>`;
            log.scrollTop = log.scrollHeight;
        }

        showToast('🚦 All traffic signals overridden!', 'success');
    }

    // ===== COMMUNICATION =====
    function initCommunication() {
        const sendSmsBtn = document.getElementById('btn-send-sms');
        const smsInput = document.getElementById('sms-input');

        if (sendSmsBtn && smsInput) {
            const sendSms = () => {
                const msg = smsInput.value.trim();
                if (!msg) return;
                const messages = document.getElementById('sms-messages');
                const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
                messages.innerHTML += `<div class="sms-bubble outgoing"><p>${msg}</p><span class="sms-time">${now}</span></div>`;
                smsInput.value = '';
                messages.scrollTop = messages.scrollHeight;

                // Auto reply
                setTimeout(() => {
                    const replies = [
                        '✅ Message received. Hospital team notified.',
                        '📍 Acknowledged. Route updated.',
                        '🏥 ICU team on standby. Ready for arrival.',
                        '✅ Copy that. ETA noted.'
                    ];
                    messages.innerHTML += `<div class="sms-bubble incoming"><p>${replies[Math.floor(Math.random() * replies.length)]}</p><span class="sms-time">${now}</span></div>`;
                    messages.scrollTop = messages.scrollHeight;
                }, 1500);
            };

            sendSmsBtn.addEventListener('click', sendSms);
            smsInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendSms(); });
        }

        // Voice button
        const voiceBtn = document.getElementById('btn-voice');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                voiceBtn.classList.toggle('listening');
                const voiceText = document.getElementById('voice-text');
                const visualizer = document.getElementById('voice-visualizer');

                if (voiceBtn.classList.contains('listening')) {
                    voiceBtn.querySelector('span').textContent = 'Listening...';
                    visualizer.classList.add('active');
                    if (voiceText) voiceText.textContent = '"Listening..."';

                    setTimeout(() => {
                        const commands = [
                            '"Route to nearest trauma center"',
                            '"Alert hospital — patient critical"',
                            '"Update ETA: arriving in 3 minutes"',
                            '"Request additional ambulance backup"'
                        ];
                        if (voiceText) voiceText.textContent = commands[Math.floor(Math.random() * commands.length)];
                        voiceBtn.classList.remove('listening');
                        voiceBtn.querySelector('span').textContent = 'Tap to Speak';
                        visualizer.classList.remove('active');
                        showToast('🎙️ Voice command processed!', 'success');
                    }, 3000);
                } else {
                    voiceBtn.querySelector('span').textContent = 'Tap to Speak';
                    visualizer.classList.remove('active');
                }
            });
        }
    }

    // ===== ANALYTICS =====
    function initAnalytics() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#8a8aaf', font: { family: 'Inter' } } }
            },
            scales: {
                x: { ticks: { color: '#5a5a7f' }, grid: { color: 'rgba(255,255,255,0.03)' } },
                y: { ticks: { color: '#5a5a7f' }, grid: { color: 'rgba(255,255,255,0.03)' } }
            }
        };

        // Response Time
        const rtCtx = document.getElementById('chart-response-time');
        if (rtCtx) {
            new Chart(rtCtx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        { label: 'With RESQTRON', data: [14.2, 13.1, 12.4, 11.8, 10.5, 9.8, 9.2, 8.8, 8.5, 8.3, 8.2, 8.0], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 },
                        { label: 'Without AI', data: [14.5, 14.3, 14.6, 14.2, 14.8, 14.5, 14.9, 14.3, 14.7, 14.4, 14.6, 14.5], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4, borderDash: [5, 5] }
                    ]
                },
                options: { ...chartOptions }
            });
        }

        // Emergencies
        const emCtx = document.getElementById('chart-emergencies');
        if (emCtx) {
            new Chart(emCtx, {
                type: 'bar',
                data: {
                    labels: ['Cardiac', 'Trauma', 'Stroke', 'Respiratory', 'Burns', 'Other'],
                    datasets: [{ label: 'Cases', data: [342, 287, 198, 156, 89, 145], backgroundColor: ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#06b6d4'] }]
                },
                options: { ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }
            });
        }

        // Survival Rate
        const srCtx = document.getElementById('chart-survival');
        if (srCtx) {
            new Chart(srCtx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{ label: 'Survival Rate %', data: [94.2, 94.8, 95.3, 95.8, 96.2, 96.8, 97.1, 97.4, 97.6, 97.8, 98.0, 98.2], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.15)', fill: true, tension: 0.4 }]
                },
                options: { ...chartOptions }
            });
        }

        // Hourly
        const hCtx = document.getElementById('chart-hourly');
        if (hCtx) {
            const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
            const hourlyData = [12, 8, 5, 4, 6, 9, 15, 28, 35, 32, 38, 42, 45, 40, 38, 35, 30, 32, 45, 48, 42, 35, 25, 18];
            new Chart(hCtx, {
                type: 'bar',
                data: {
                    labels: hours,
                    datasets: [{ label: 'Emergencies', data: hourlyData, backgroundColor: hourlyData.map(v => v > 40 ? '#ef4444' : v > 25 ? '#eab308' : '#3b82f6'), borderRadius: 4 }]
                },
                options: { ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }
            });
        }

        // KPI counters
        setTimeout(() => animateCounters(), 200);
    }

    // ===== ADMIN PAGE =====
    function initAdminPage() {
        renderFleetTable();
        renderActiveCases();

        const searchInput = document.getElementById('fleet-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const q = e.target.value.toLowerCase();
                const rows = document.querySelectorAll('#fleet-tbody tr');
                rows.forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
                });
            });
        }

        const addAmbBtn = document.getElementById('btn-add-ambulance');
        if (addAmbBtn) {
            addAmbBtn.addEventListener('click', () => {
                const newId = `AMB-${String(fleetData.length + 1).padStart(3, '0')}`;
                fleetData.push({
                    id: newId, driver: 'New Driver', status: 'available',
                    lat: 12.95 + Math.random() * 0.05, lng: 77.58 + Math.random() * 0.08,
                    patient: '—', emergency: '—', paramedic: '—', destination: '—',
                    destLat: 0, destLng: 0, speed: 0, eta: 0, severity: 'none'
                });
                saveFleetData();
                renderFleetTable();
                updateFleetMapMarkers();
                updateAmbulanceSelect();
                showToast(`🚑 ${newId} added to fleet!`, 'success');
            });
        }
    }

    function renderFleetTable() {
        const tbody = document.getElementById('fleet-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        fleetData.forEach(amb => {
            const statusBadge = amb.status === 'active' ? 'status-critical' : amb.status === 'available' ? 'status-normal' : 'status-warning';
            const statusText = amb.status.charAt(0).toUpperCase() + amb.status.slice(1);
            const location = amb.status === 'active' ? `${amb.lat.toFixed(4)}, ${amb.lng.toFixed(4)}` : 'Depot';
            tbody.innerHTML += `
            <tr>
                <td><strong>${amb.id}</strong></td>
                <td>${amb.driver}</td>
                <td><span class="status-badge ${statusBadge}">${statusText}</span></td>
                <td>${location}</td>
                <td>${amb.patient}</td>
                <td>${amb.emergency}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="trackAmbulance('${amb.id}')" title="Track"><i class="fa-solid fa-location-crosshairs"></i></button>
                </td>
            </tr>`;
        });
    }

    function trackAmbulance(ambId) {
        const amb = fleetData.find(a => a.id === ambId);
        if (!amb) return;

        if (fleetMap && mapplsReady) {
            fleetMap.setCenter([amb.lat, amb.lng]);
            fleetMap.setZoom(15);
        }
        showToast(`📍 Tracking ${ambId} on map`, 'info');
    }

    function renderActiveCases() {
        const timeline = document.getElementById('cases-timeline');
        if (!timeline) return;
        timeline.innerHTML = '';
        const activeCases = fleetData.filter(a => a.status === 'active');
        const count = document.getElementById('case-count');
        if (count) count.textContent = `${activeCases.length} Active Cases`;

        activeCases.forEach(amb => {
            const severityClass = amb.severity === 'critical' ? 'case-critical' : 'case-moderate';
            timeline.innerHTML += `
            <div class="case-timeline-item ${severityClass}">
                <div class="case-timeline-header">
                    <span class="case-amb-id">${amb.id}</span>
                    <span class="status-badge ${amb.severity === 'critical' ? 'status-critical' : 'status-warning'}">${amb.severity}</span>
                </div>
                <p class="case-patient">${amb.patient} — ${amb.emergency}</p>
                <p class="case-detail"><i class="fa-solid fa-user-doctor"></i> ${amb.paramedic} → ${amb.destination}</p>
                <div class="case-meta">
                    <span><i class="fa-solid fa-gauge"></i> ${amb.speed} km/h</span>
                    <span><i class="fa-solid fa-clock"></i> ETA: ${amb.eta} min</span>
                </div>
            </div>`;
        });
    }

    // ===== PATIENT FORM =====
    function initPatientForm() {
        const form = document.getElementById('patient-form');
        const modal = document.getElementById('patient-modal');
        const closeBtn = document.getElementById('close-patient-modal');
        const cancelBtn = document.getElementById('cancel-patient-form');

        // Populate ambulance dropdown with available ambulances
        updateAmbulanceSelect();

        const closeModal = () => {
            modal.classList.remove('active');
            form.reset();
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('pf-name').value;
                const age = document.getElementById('pf-age').value;
                const gender = document.getElementById('pf-gender').value;
                const emergency = document.getElementById('pf-emergency').value;
                const severity = document.getElementById('pf-severity').value;
                const location = document.getElementById('pf-location').value;
                const notes = document.getElementById('pf-notes').value;
                const phone = document.getElementById('pf-phone').value;
                const ambChoice = document.getElementById('pf-ambulance').value;

                // Find available ambulance
                let assignedAmb;
                if (ambChoice === 'auto') {
                    assignedAmb = fleetData.find(a => a.status === 'available');
                } else {
                    assignedAmb = fleetData.find(a => a.id === ambChoice);
                }

                if (!assignedAmb) {
                    showToast('❌ No available ambulances! All units deployed.', 'danger');
                    return;
                }

                // Assign patient to ambulance
                patientIdCounter++;
                assignedAmb.status = 'active';
                assignedAmb.patient = `${name}, ${age}${gender}`;
                assignedAmb.emergency = emergency;
                assignedAmb.severity = severity;
                assignedAmb.paramedic = 'Dr. Auto-Assigned';
                assignedAmb.destination = hospitalsData[0].name;
                assignedAmb.destLat = hospitalsData[0].lat;
                assignedAmb.destLng = hospitalsData[0].lng;
                assignedAmb.speed = 60 + Math.floor(Math.random() * 30);
                assignedAmb.eta = 5 + Math.floor(Math.random() * 10);

                // Add to patient queue
                const newPatient = {
                    id: `PAT-${patientIdCounter}`,
                    name, age, gender, emergency, severity, location, notes, phone,
                    assignedAmbulance: assignedAmb.id,
                    timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false })
                };
                patientQueue.push(newPatient);
                
                // Add to database
                const patientsList = getPatients();
                patientsList.push(newPatient);
                savePatients(patientsList);

                saveFleetData(); // Prevent active ambulance from reverting on reload

                // Update UI
                renderFleetTable();
                renderActiveCases();
                updateFleetMapMarkers();
                updateAmbulanceSelect();
                closeModal();

                showToast(`🚑 ${assignedAmb.id} dispatched for ${name}! Emergency: ${emergency}`, 'success');

                // Navigate to dashboard
                setTimeout(() => {
                    navigateTo('dashboard');
                    // Set the ambulance selector to show the new assignment
                    const ambSelect = document.getElementById('ambulance-select');
                    if (ambSelect) {
                        // Refresh options
                        ambSelect.innerHTML = '';
                        fleetData.filter(a => a.status === 'active').forEach(a => {
                            const opt = document.createElement('option');
                            opt.value = a.id;
                            opt.textContent = `${a.id} — ${a.severity === 'critical' ? 'Critical' : 'En Route'}`;
                            ambSelect.appendChild(opt);
                        });
                        ambSelect.value = assignedAmb.id;
                    }
                }, 800);
            });
        }
    }

    function updateAmbulanceSelect() {
        const pfAmbSelect = document.getElementById('pf-ambulance');
        if (!pfAmbSelect) return;
        pfAmbSelect.innerHTML = '<option value="auto">🤖 Auto-Assign (Nearest)</option>';
        fleetData.filter(a => a.status === 'available').forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.id;
            opt.textContent = `${a.id} — ${a.driver}`;
            pfAmbSelect.appendChild(opt);
        });
    }

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        document.querySelectorAll('[data-counter]').forEach(el => {
            const target = parseFloat(el.dataset.counter);
            const isFloat = target % 1 !== 0;
            let current = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
            }, 25);
        });
    }

    // ===== TOAST NOTIFICATIONS =====
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>`;
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 50);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ===== MAKE FUNCTIONS GLOBALLY ACCESSIBLE =====
    window.navigateTo = navigateTo;
    window.sendPatientData = sendPatientData;
    window.navigateToHospital = navigateToHospital;
    window.trackAmbulance = trackAmbulance;
    window.showToast = showToast;
    window.initMappls = initMappls;
    window.deleteUser = deleteUser;
    window.openAddHospitalModal = openAddHospitalModal;
    window.closeAddHospitalModal = closeAddHospitalModal;
    window.submitAddHospital = submitAddHospital;
    window.deleteHospital = deleteHospital;

    // ===== MONGODB API DATABASE =====
    const API_URL = 'http://localhost:5000/api';

    let cachedUsers = [];
    let cachedBookings = [];
    let cachedIncidents = [];
    let cachedPatients = [];

    async function fetchFromDB() {
        try {
            const [u, b, i, p] = await Promise.all([
                fetch(`${API_URL}/users`).then(res => res.json()),
                fetch(`${API_URL}/bookings`).then(res => res.json()),
                fetch(`${API_URL}/incidents`).then(res => res.json()),
                fetch(`${API_URL}/patients`).then(res => res.json())
            ]);
            cachedUsers = Array.isArray(u) ? u : [];
            cachedBookings = Array.isArray(b) ? b : [];
            cachedIncidents = Array.isArray(i) ? i : [];
            cachedPatients = Array.isArray(p) ? p : [];
        } catch (e) {
            console.error("Failed to load from MongoDB, running in offline mode.", e);
        }
    }

    function initDB() {
        // Legacy mapping - now done synchronously on startup via fetchFromDB
    }

    function getUsers() { return cachedUsers; }
    async function saveUsers(users) { cachedUsers = users; }

    function getBookings() { return cachedBookings; }
    async function saveBookings(bookings) {
        cachedBookings = bookings;
        const last = bookings[bookings.length - 1];
        if (last) {
            fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(last)
            }).catch(e => console.error(e));
        }
    }

    function getIncidents() { return cachedIncidents; }
    async function saveIncidents(incidents) {
        cachedIncidents = incidents;
        const last = incidents[incidents.length - 1];
        if (last) {
            fetch(`${API_URL}/incidents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(last)
            }).catch(e => console.error(e));
        }
    }

    function getPatients() { return cachedPatients; }
    async function savePatients(patients) {
        cachedPatients = patients;
        const last = patients[patients.length - 1];
        if (last) {
            fetch(`${API_URL}/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(last)
            }).catch(e => console.error(e));
        }
    }

    function getUserByUsername(username) {
        return cachedUsers.find(u => u.username === username);
    }

    function addUser(user) {
        cachedUsers.push(user);
        // API logic happens in register submit for robust error handling
    }

    function updateUser(username, updates) {
        const idx = cachedUsers.findIndex(u => u.username === username);
        if (idx !== -1) {
            cachedUsers[idx] = { ...cachedUsers[idx], ...updates };
            // Could sync patch here if needed
        }
    }

    // ===== LOGIN SYSTEM =====
    function initLogin() {
        initDB();

        // Mode toggle (Login / Register)
        const modeTabs = document.querySelectorAll('.login-mode-tab');
        modeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                modeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const mode = tab.dataset.mode;
                document.getElementById('login-panel').style.display = mode === 'login' ? '' : 'none';
                document.getElementById('register-panel').style.display = mode === 'register' ? '' : 'none';
                // Reset errors
                document.getElementById('login-error').style.display = 'none';
                document.getElementById('register-error').style.display = 'none';
                document.getElementById('register-success').style.display = 'none';
            });
        });

        // Role tabs
        const loginTabs = document.querySelectorAll('.login-tab');
        let selectedRole = 'admin';
        loginTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                loginTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                selectedRole = tab.dataset.role;
            });
        });

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value.trim();
                const password = document.getElementById('login-password').value;
                const loginError = document.getElementById('login-error');
                const errorText = document.getElementById('login-error-text');

                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
                submitBtn.disabled = true;

                try {
                    const res = await fetch(`${API_URL}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();

                    if (data.success && data.user) {
                        if (data.user.role === selectedRole) {
                            loginError.style.display = 'none';
                            submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Syncing Data...';
                            // Fetch latest data after login
                            await fetchFromDB();
                            handleLoginSuccess(data.user);
                        } else {
                            errorText.textContent = `This account is registered as ${data.user.role}. Switch tab.`;
                            loginError.style.display = 'flex';
                        }
                    } else {
                        errorText.textContent = 'Invalid username or password. Try again.';
                        loginError.style.display = 'flex';
                    }
                } catch (err) {
                    console.error("Login fetch error:", err);
                    errorText.textContent = 'Server connection error. Ensure backend is running.';
                    loginError.style.display = 'flex';
                } finally {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fullname = document.getElementById('reg-fullname').value.trim();
                const username = document.getElementById('reg-username').value.trim();
                const email = document.getElementById('reg-email').value.trim();
                const phone = document.getElementById('reg-phone').value.trim();
                const password = document.getElementById('reg-password').value;
                const confirm = document.getElementById('reg-confirm').value;
                const regError = document.getElementById('register-error');
                const regErrorText = document.getElementById('register-error-text');
                const regSuccess = document.getElementById('register-success');

                regError.style.display = 'none';
                regSuccess.style.display = 'none';

                // Validation
                if (password.length < 6) {
                    regErrorText.textContent = 'Password must be at least 6 characters.';
                    regError.style.display = 'flex';
                    return;
                }
                if (password !== confirm) {
                    regErrorText.textContent = 'Passwords do not match.';
                    regError.style.display = 'flex';
                    return;
                }

                const submitBtn = registerForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
                submitBtn.disabled = true;

                try {
                    // Check locally or via API if username taken
                    const res = await fetch(`${API_URL}/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username, password, role: 'patient',
                            fullname, email, phone, blood: '', bookings: []
                        })
                    });

                    const data = await res.json();

                    if (!res.ok || !data.success) {
                        regErrorText.textContent = data.message || 'Error creating account.';
                        regError.style.display = 'flex';
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        return;
                    }

                    // Add to local cache
                    cachedUsers.push(data.user);

                    regSuccess.style.display = 'flex';
                    registerForm.reset();
                    showToast(`✅ Account "${username}" created! Login to continue.`, 'success');

                    // Auto-switch to login after 2s
                    setTimeout(() => {
                        document.querySelectorAll('.login-mode-tab').forEach(t => t.classList.remove('active'));
                        document.querySelector('.login-mode-tab[data-mode="login"]').classList.add('active');
                        document.getElementById('login-panel').style.display = '';
                        document.getElementById('register-panel').style.display = 'none';
                        // Pre-select patient tab
                        loginTabs.forEach(t => t.classList.remove('active'));
                        document.querySelector('.login-tab[data-role="patient"]').classList.add('active');
                        selectedRole = 'patient';
                        // Pre-fill username
                        document.getElementById('login-username').value = username;
                        document.getElementById('login-password').focus();
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }, 1500);

                } catch (err) {
                    console.error("Register fetch error:", err);
                    regErrorText.textContent = 'Server connection error. Ensure backend is running.';
                    regError.style.display = 'flex';
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        }
    }

    function handleLoginSuccess(user) {
        currentRole = user.role;
        loggedInUser = user.username;

        // Load user's bookings from DB
        const allBookings = getBookings();
        patientBookingHistory = allBookings.filter(b => b.bookedBy === user.username);

        // Restore active booking if there is a recent dispatched one
        const activeBookings = patientBookingHistory.filter(b => b.status === 'dispatched');
        if (activeBookings.length > 0) {
            patientBooking = activeBookings[activeBookings.length - 1];
        } else {
            patientBooking = null;
        }

        // Pre-fill booking form with user profile details
        const pbName = document.getElementById('pb-name');
        const pbPhone = document.getElementById('pb-phone');
        if (pbName && user.fullname) pbName.value = user.fullname;
        if (pbPhone && user.phone) pbPhone.value = user.phone;

        // Hide login page
        document.getElementById('login-page').classList.add('hidden');
        // Show nav
        document.getElementById('main-nav').style.display = '';

        if (user.role === 'admin') {
            document.getElementById('admin-nav-links').style.display = '';
            document.getElementById('patient-nav-links').style.display = 'none';
            navigateTo('landing');
            // Refresh admin panels
            refreshAdminPatientBookings();
            refreshAdminUsersTable();
            showToast(`🔐 Welcome, ${user.fullname}! Full system access granted.`, 'success');
        } else {
            document.getElementById('admin-nav-links').style.display = 'none';
            document.getElementById('patient-nav-links').style.display = '';
            const welcomeName = document.getElementById('patient-welcome-name');
            if (welcomeName) welcomeName.textContent = user.fullname.split(' ')[0];
            // Update profile card
            const pName = document.getElementById('profile-name');
            const pPhone = document.getElementById('profile-phone');
            const pEmail = document.getElementById('profile-email');
            const pBlood = document.getElementById('profile-blood');
            if (pName) pName.textContent = user.fullname;
            if (pPhone) pPhone.textContent = user.phone;
            if (pEmail) pEmail.textContent = user.email;
            if (pBlood) pBlood.textContent = user.blood || 'Not set';
            updateProfileHistory();
            navigateTo('patient-home');
            showToast(`👋 Welcome, ${user.fullname.split(' ')[0]}! Book an ambulance anytime.`, 'success');
        }

        // Setup logout buttons
        document.getElementById('btn-logout')?.removeEventListener('click', handleLogout);
        document.getElementById('btn-logout-patient')?.removeEventListener('click', handleLogout);
        document.getElementById('btn-logout')?.addEventListener('click', handleLogout);
        document.getElementById('btn-logout-patient')?.addEventListener('click', handleLogout);
    }

    function handleLogout() {
        currentRole = null;
        loggedInUser = null;
        patientBooking = null;
        patientBookingHistory = [];

        document.getElementById('main-nav').style.display = 'none';
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });
        document.getElementById('login-page').classList.remove('hidden');
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.reset();
        document.getElementById('login-error').style.display = 'none';
        showToast('👋 Logged out successfully.', 'info');
    }

    // ===== PATIENT PORTAL =====
    function initPatientPortal() {
        initPatientBookingForm();
        initIncidentForm();

        document.querySelectorAll('.patient-action-card[data-page]').forEach(card => {
            card.addEventListener('click', () => navigateTo(card.dataset.page));
        });
        document.querySelectorAll('#patient-track-content .btn[data-page]').forEach(btn => {
            btn.addEventListener('click', () => navigateTo(btn.dataset.page));
        });
    }

    function initPatientBookingForm() {
        const form = document.getElementById('patient-book-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('pb-name').value;
            const age = document.getElementById('pb-age').value;
            const gender = document.getElementById('pb-gender').value;
            const phone = document.getElementById('pb-phone').value;
            const blood = document.getElementById('pb-blood').value;
            const emergency = document.getElementById('pb-emergency').value;
            const severity = document.getElementById('pb-severity').value;
            const location = document.getElementById('pb-location').value;
            const notes = document.getElementById('pb-notes').value;

            const assignedAmb = fleetData.find(a => a.status === 'available');
            if (!assignedAmb) {
                showToast('❌ All ambulances are currently deployed. Please wait.', 'danger');
                return;
            }

            // Assign ambulance
            assignedAmb.status = 'active';
            assignedAmb.patient = `${name}, ${age}${gender}`;
            assignedAmb.emergency = emergency;
            assignedAmb.severity = severity;
            assignedAmb.paramedic = 'Dr. Auto-Assigned';
            assignedAmb.destination = hospitalsData[0].name;
            assignedAmb.destLat = hospitalsData[0].lat;
            assignedAmb.destLng = hospitalsData[0].lng;
            assignedAmb.speed = 60 + Math.floor(Math.random() * 30);
            assignedAmb.eta = 5 + Math.floor(Math.random() * 8);

            // Create booking record
            patientBooking = {
                id: `BK-${Date.now().toString().slice(-6)}`,
                name, age, gender, phone, blood, emergency, severity, location, notes,
                ambulanceId: assignedAmb.id,
                driver: assignedAmb.driver,
                driverPhone: assignedAmb.phone,
                eta: assignedAmb.eta,
                hospital: assignedAmb.destination,
                timestamp: new Date().toLocaleString('en-IN'),
                status: 'dispatched',
                bookedBy: loggedInUser
            };

            // Save to network DB
            const allBookings = getBookings();
            allBookings.push({ ...patientBooking });
            saveBookings(allBookings);
            
            // Sync patient's blood and phone to DB
            if (loggedInUser) {
                fetch(`${API_URL}/users/${loggedInUser}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone, blood })
                }).catch(e => console.error("Failed to update user profile", e));
            }

            saveFleetData(); // Prevent active ambulance from reverting on reload

            // Update local history
            patientBookingHistory.push({ ...patientBooking });

            // Update admin fleet table
            refreshFleetTable();
            refreshAdminPatientBookings();
            updateFleetMapMarkers();

            form.reset();
            showToast(`🚑 ${assignedAmb.id} dispatched! Driver: ${assignedAmb.driver} (📞 ${assignedAmb.phone}). ETA: ${assignedAmb.eta} min`, 'success');

            setTimeout(() => {
                updatePatientTrackingUI();
                updateProfileHistory();
                navigateTo('patient-track');
            }, 500);
        });
    }

    function updatePatientTrackingUI() {
        const noBooking = document.getElementById('patient-no-booking');
        const activeBooking = document.getElementById('patient-active-booking');
        const bookingInfo = document.getElementById('patient-booking-info');

        if (!patientBooking) {
            if (noBooking) noBooking.style.display = '';
            if (activeBooking) activeBooking.style.display = 'none';
            return;
        }

        if (noBooking) noBooking.style.display = 'none';
        if (activeBooking) activeBooking.style.display = '';

        if (bookingInfo) {
            const driverContact = patientBooking.driverPhone || 'N/A';
            bookingInfo.innerHTML = `
            <div class="case-row"><span class="case-label">Booking ID</span><span class="case-value">${patientBooking.id}</span></div>
            <div class="case-row"><span class="case-label">Patient</span><span class="case-value">${patientBooking.name}, ${patientBooking.age}${patientBooking.gender}</span></div>
            <div class="case-row"><span class="case-label">Emergency</span><span class="case-value critical-text">${patientBooking.emergency}</span></div>
            <div class="case-row"><span class="case-label">Severity</span><span class="case-value">${patientBooking.severity.toUpperCase()}</span></div>
            <div class="case-row"><span class="case-label">Pickup</span><span class="case-value">${patientBooking.location}</span></div>
            <div class="case-row"><span class="case-label">Ambulance</span><span class="case-value">${patientBooking.ambulanceId}</span></div>
            <div class="case-row"><span class="case-label">Driver</span><span class="case-value">${patientBooking.driver}</span></div>
            <div class="case-row"><span class="case-label">📞 Driver Contact</span><span class="case-value" style="color:var(--accent-green);font-weight:700;"><a href="tel:${driverContact}" style="color:var(--accent-green);text-decoration:none;">${driverContact}</a></span></div>
            <div class="case-row"><span class="case-label">ETA</span><span class="case-value" style="color:var(--accent-blue);font-weight:700;">${patientBooking.eta} min</span></div>
            <div class="case-row"><span class="case-label">Hospital</span><span class="case-value">${patientBooking.hospital}</span></div>
            <div class="case-row"><span class="case-label">Status</span><span class="case-value"><span class="status-badge status-active">Dispatched</span></span></div>
        `;
        }
        if (mapplsReady) setTimeout(() => initPatientTrackMap(), 300);
    }

    function initPatientTrackMap() {
        const container = document.getElementById('patient-track-map');
        if (!container || !mapplsReady || !patientBooking) return;
        const amb = fleetData.find(a => a.id === patientBooking.ambulanceId);
        if (!amb) return;
        if (patientTrackMap) { try { patientTrackMap.resize(); } catch (e) { } return; }

        container.style.background = 'var(--bg-secondary, #1a1a2e)';

        try {
            patientTrackMap = new mappls.Map('patient-track-map', {
                center: [amb.lat, amb.lng], zoom: 14, zoomControl: true, search: false
            });
            patientTrackMap.addListener('load', () => {
                container.style.background = '';
                const angle = amb.destLat ? getDirectionAngle(amb.lat, amb.lng, amb.destLat, amb.destLng) : 0;
                const iconColor = amb.severity === 'critical' ? '#FF4500' : '#FF6B00';
                const ambMarker = new mappls.Marker({
                    map: patientTrackMap, position: { lat: amb.lat, lng: amb.lng },
                    popupHtml: buildPopupHTML(amb), popupOptions: { openPopup: true },
                    icon_url: createAmbulanceSVG(angle, iconColor),
                    width: 52, height: 52
                });
                if (amb.destLat) {
                    new mappls.Marker({
                        map: patientTrackMap, position: { lat: amb.destLat, lng: amb.destLng },
                        popupHtml: `<div class="amb-popup"><h4>🏥 ${amb.destination}</h4></div>`,
                        popupOptions: { openPopup: false },
                        icon_url: 'https://img.icons8.com/color/36/hospital-2.png'
                    });
                }
                const routePath = generateRoutePath(amb.lat, amb.lng, amb.destLat, amb.destLng);
                // Shadow route
                new mappls.Polyline({
                    map: patientTrackMap, path: routePath,
                    strokeColor: iconColor, strokeOpacity: 0.15, strokeWeight: 12, fitbounds: true
                });
                // Main route
                new mappls.Polyline({
                    map: patientTrackMap, path: routePath,
                    strokeColor: iconColor, strokeOpacity: 0.8, strokeWeight: 4, fitbounds: true,
                    dasharray: [12, 8]
                });
                simulateAmbulanceMovement(patientTrackMap, ambMarker, amb);
            });
        } catch (e) { console.warn('Patient track map error:', e); }
    }

    function initIncidentForm() {
        const form = document.getElementById('incident-form');
        if (!form) return;

        // Auto-detect location on page load
        autoDetectLocation();

        // Detect location button
        const detectBtn = document.getElementById('btn-detect-location');
        if (detectBtn) {
            detectBtn.addEventListener('click', autoDetectLocation);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const location = document.getElementById('inc-location').value;
            const lat = document.getElementById('inc-lat').value;
            const lng = document.getElementById('inc-lng').value;
            const type = document.getElementById('inc-type').value;
            const victims = document.getElementById('inc-victims').value;
            const description = document.getElementById('inc-description').value;
            const name = document.getElementById('inc-name').value;
            const phone = document.getElementById('inc-phone').value;

            const incident = {
                id: `INC-${Date.now().toString().slice(-6)}`,
                location, lat, lng, type, victims, description, name, phone,
                timestamp: new Date().toLocaleString('en-IN'),
                reportedBy: loggedInUser
            };

            // Save to DB
            const incidents = getIncidents();
            incidents.push(incident);
            saveIncidents(incidents);

            showToast(`🚨 Incident ${incident.id} reported! Emergency services alerted for ${location}.`, 'success');
            setTimeout(() => {
                showToast(`📍 Nearest ambulance dispatched to ${location}. ETA: ${5 + Math.floor(Math.random() * 10)} min`, 'info');
            }, 2000);

            form.reset();
            setTimeout(() => navigateTo('patient-home'), 1500);
        });
    }

    function autoDetectLocation() {
        const locInput = document.getElementById('inc-location');
        const latInput = document.getElementById('inc-lat');
        const lngInput = document.getElementById('inc-lng');
        const locStatus = document.getElementById('loc-status');
        const detectBtn = document.getElementById('btn-detect-location');

        if (!navigator.geolocation) {
            if (locStatus) locStatus.textContent = '❌ Geolocation not supported by your browser.';
            return;
        }

        if (detectBtn) {
            detectBtn.disabled = true;
            detectBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Detecting...';
        }
        if (locStatus) locStatus.textContent = '📡 Detecting your location...';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);
                if (latInput) latInput.value = lat;
                if (lngInput) lngInput.value = lng;
                if (locInput) locInput.value = `Lat: ${lat}, Lng: ${lng} (Current Location)`;
                if (locStatus) locStatus.textContent = '✅ Location detected successfully!';
                if (detectBtn) {
                    detectBtn.disabled = false;
                    detectBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Detect';
                }

                // Try reverse geocoding via Mappls
                if (mapplsReady && window.mappls && mappls.reverseGeocode) {
                    try {
                        mappls.reverseGeocode({
                            lat: lat, lng: lng
                        }, (data) => {
                            if (data && data.results && data.results[0]) {
                                locInput.value = data.results[0].formatted_address;
                                locStatus.textContent = `✅ ${data.results[0].formatted_address}`;
                            }
                        });
                    } catch (e) { /* reverse geocode not available, keep lat/lng */ }
                }

                showToast('📍 Current location detected!', 'success');
            },
            (error) => {
                if (locStatus) locStatus.textContent = `❌ Location error: ${error.message}`;
                if (detectBtn) {
                    detectBtn.disabled = false;
                    detectBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Detect';
                }
                showToast('❌ Could not detect location. Please enter manually.', 'danger');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function updateProfileHistory() {
        const historyContainer = document.getElementById('booking-history');
        const bookingCount = document.getElementById('profile-bookings');

        // Reload from DB for this user
        if (loggedInUser) {
            patientBookingHistory = getBookings().filter(b => b.bookedBy === loggedInUser);
        }

        if (bookingCount) bookingCount.textContent = patientBookingHistory.length;
        if (!historyContainer) return;

        if (patientBookingHistory.length === 0) {
            historyContainer.innerHTML = `
            <div class="history-empty">
                <i class="fa-solid fa-inbox" style="font-size:2rem; color:var(--text-muted);"></i>
                <p>No bookings yet. Your ambulance booking history will appear here.</p>
            </div>`;
            return;
        }

        historyContainer.innerHTML = '';
        patientBookingHistory.slice().reverse().forEach(b => {
            const severityBadge = b.severity === 'critical' ? 'status-critical' : b.severity === 'moderate' ? 'status-warning' : 'status-normal';
            historyContainer.innerHTML += `
            <div class="history-item">
                <div class="history-item-header">
                    <h4>🚑 ${b.ambulanceId} — ${b.emergency}</h4>
                    <span class="status-badge ${severityBadge}">${b.severity}</span>
                </div>
                <p><i class="fa-solid fa-user"></i> ${b.name}, ${b.age}${b.gender} &nbsp;|&nbsp; <i class="fa-solid fa-location-dot"></i> ${b.location}</p>
                <p><i class="fa-solid fa-clock"></i> ${b.timestamp} &nbsp;|&nbsp; <strong>${b.id}</strong></p>
            </div>`;
        });
    }

    // ===== ADMIN ↔ PATIENT INTERCONNECTION =====
    function refreshAdminPatientBookings() {
        const container = document.getElementById('admin-patient-bookings');
        const countEl = document.getElementById('portal-booking-count');
        const allBookings = getBookings();

        if (countEl) countEl.textContent = `${allBookings.length} booking${allBookings.length !== 1 ? 's' : ''}`;

        if (!container) return;

        if (allBookings.length === 0) {
            container.innerHTML = `
            <div class="history-empty" style="padding:2rem;text-align:center;">
                <i class="fa-solid fa-inbox" style="font-size:1.5rem;color:var(--text-muted);"></i>
                <p style="color:var(--text-secondary);margin-top:0.5rem;">No patient bookings yet.</p>
            </div>`;
            return;
        }

        container.innerHTML = '';
        allBookings.slice().reverse().forEach(b => {
            const severityBadge = b.severity === 'critical' ? 'status-critical' : b.severity === 'moderate' ? 'status-warning' : 'status-normal';
            container.innerHTML += `
            <div class="case-card">
                <div class="case-header">
                    <span class="case-id">${b.id}</span>
                    <span class="status-badge ${severityBadge}">${b.severity}</span>
                </div>
                <div class="case-row"><span class="case-label">Patient</span><span class="case-value">${b.name}, ${b.age}${b.gender}</span></div>
                <div class="case-row"><span class="case-label">Emergency</span><span class="case-value">${b.emergency}</span></div>
                <div class="case-row"><span class="case-label">Location</span><span class="case-value">${b.location}</span></div>
                <div class="case-row"><span class="case-label">Ambulance</span><span class="case-value">${b.ambulanceId}</span></div>
                <div class="case-row"><span class="case-label">Driver</span><span class="case-value">${b.driver}</span></div>
                <div class="case-row"><span class="case-label">Booked By</span><span class="case-value">@${b.bookedBy}</span></div>
                <div class="case-row"><span class="case-label">Time</span><span class="case-value">${b.timestamp}</span></div>
            </div>`;
        });
    }

    function refreshAdminUsersTable() {
        const tbody = document.getElementById('users-tbody');
        const countEl = document.getElementById('registered-user-count');
        const users = getUsers();
        const allBookings = getBookings();

        if (countEl) countEl.textContent = `${users.length} user${users.length !== 1 ? 's' : ''}`;
        if (!tbody) return;

        tbody.innerHTML = '';
        users.forEach(u => {
            const userBookings = allBookings.filter(b => b.bookedBy === u.username).length;
            const roleBadge = u.role === 'admin' ? 'status-warning' : 'status-active';
            const deleteBtn = u.role === 'admin'
                ? `<span class="text-muted" style="font-size:0.75rem;color:var(--text-muted);">Protected</span>`
                : `<button class="btn btn-danger btn-sm btn-delete-user" data-username="${u.username}" title="Delete user">
                <i class="fa-solid fa-trash"></i>
               </button>`;
            tbody.innerHTML += `
            <tr>
                <td><strong>${u.username}</strong></td>
                <td>${u.fullname}</td>
                <td>${u.email}</td>
                <td>${u.phone}</td>
                <td><span class="status-badge ${roleBadge}">${u.role}</span></td>
                <td>${userBookings}</td>
                <td>${deleteBtn}</td>
            </tr>`;
        });

        // Attach delete handlers
        document.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const username = btn.dataset.username;
                if (confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
                    deleteUser(username);
                }
            });
        });
    }

    async function deleteUser(username) {
        const users = getUsers();
        const targetUser = users.find(u => u.username === username);

        if (!targetUser) {
            showToast('❌ User not found.', 'danger');
            return;
        }

        if (targetUser.role === 'admin') {
            showToast('❌ Cannot delete admin accounts.', 'danger');
            return;
        }

        try {
            await fetch(`${API_URL}/users/${username}`, {
                method: 'DELETE'
            });

            // Remove user locally
            cachedUsers = cachedUsers.filter(u => u.username !== username);

            // Also remove their bookings
            cachedBookings = cachedBookings.filter(b => b.bookedBy !== username);

            // Refresh UI
            refreshAdminUsersTable();
            refreshAdminPatientBookings();
            showToast(`🗑️ User "${username}" deleted successfully.`, 'success');
        } catch (err) {
            console.error("Delete user error:", err);
            showToast('❌ Server error during deletion.', 'danger');
        }
    }

    function refreshFleetTable() {
        // This updates the existing fleet table in admin panel
        const tbody = document.getElementById('fleet-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        fleetData.forEach(amb => {
            const statusClass = amb.status === 'active' ? 'status-active' : amb.status === 'available' ? 'status-available' : 'status-maintenance';
            const location = amb.status === 'active' ? `${amb.lat.toFixed(4)}, ${amb.lng.toFixed(4)}` : 'Depot';
            tbody.innerHTML += `
            <tr>
                <td><strong>${amb.id}</strong></td>
                <td>${amb.driver}</td>
                <td><span class="status-badge ${statusClass}">${amb.status}</span></td>
                <td>${location}</td>
                <td>${amb.patient}</td>
                <td>${amb.emergency}</td>
                <td><button class="btn btn-primary btn-sm" onclick="trackAmbulance('${amb.id}')">📍 Track</button></td>
            </tr>`;
        });
    }