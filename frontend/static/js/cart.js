document.querySelectorAll('.clip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
    btn.innerText = '✓ Coupon clipped';
    btn.style.backgroundColor = '#d4ffd6';
    btn.style.color = '#007a52';
    });
});