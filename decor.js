
// adding the scroll event to the explore collection button

document.addEventListener('DOMContentLoaded', () => {
    console.log("JS loaded!");  // Check if this shows in Console
    
    const btn = document.querySelector('.explore-btn');
    console.log("Button found:", btn);  // Check if button detected
    
    if (btn) {
        btn.addEventListener('click', () => {
            console.log("Button clicked!");
            document.getElementById('shop-collect').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// adding the scroll event to the build your glow button

document.addEventListener('DOMContentLoaded', () => {
    console.log("JS loaded!");  // Check if this shows in Console
    
    const btn = document.querySelector('.glow');
    console.log("Button found:", btn);  // Check if button detected
    
    if (btn) {
        btn.addEventListener('click', () => {
            console.log("Button clicked!");
            document.getElementById('decor-card-2').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// adding the scroll event to the shop all button

document.addEventListener('DOMContentLoaded', () => {
    console.log("JS loaded!");  // Check if this shows in Console
    
    const btn = document.querySelector('.shop-all');
    console.log("Button found:", btn);  // Check if button detected
    
    if (btn) {
        btn.addEventListener('click', () => {
            console.log("Button clicked!");
            document.getElementById('collections-head').scrollIntoView({ behavior: 'smooth' });
        });
    }
});
