// Navigation Menu Functions
function openMenu() {
    document.getElementById('menuDrawer').classList.add('active');
    document.getElementById('menuOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    document.getElementById('menuDrawer').classList.remove('active');
    document.getElementById('menuOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Close menu on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMenu();
    }
});
