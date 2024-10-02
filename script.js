// Mapping for sources
const sourceMapping = {
    "physical flyer": "offline-flyer",
    "billboard": "offline-outdoor-display",
    "sponsored email sent by a 3rd party": "sponsored-email",
    "digital billboard or outdoor display": "dooh",
    "qr code on a physical banner": "qr_code_banner"
};

// Mapping for mediums
const mediumMapping = {
    "search ads": "cpc",
    "image ads": "display",
    "unpaid social posts": "organic-social",
    "paid social posts": "paid-social",
    "paid video ads": "video",
    "3rd party event": "partnership"
};

// Encouraging messages for the panda
const encouragements = [
    "Way To Go!",
    "Keep Going. You Can Do it!",
    "Great Job! You Made a UTM All By Yourself! YAY!"
];

// Function to ensure the websiteURL starts with "https://" and ends with "/"
function formatWebsiteURL(url) {
    if (!url.startsWith("https://")) {
        url = "https://" + url;
    }
    if (!url.endsWith("/")) {
        url = url + "/";
    }
    return url;
}

// Function to show the animated panda
function showPanda() {
    const pandaContainer = document.getElementById('pandaContainer');
    const speechBubble = document.getElementById('speechBubble');
    const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    speechBubble.textContent = randomMessage;
    pandaContainer.style.display = 'flex';
    setTimeout(() => {
        pandaContainer.classList.add('show');
    }, 50);

    setTimeout(() => {
        pandaContainer.classList.remove('show');
        setTimeout(() => {
            pandaContainer.style.display = 'none';
        }, 500);
    }, 3000);
}

// Function to start over
function startOver() {
    document.getElementById('utmForm').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('utmForm').reset();
    goToStep(1);
}

function goToStep(step) {
    let steps = document.getElementsByClassName('form-step');
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }
    document.getElementById('step' + step).style.display = 'block';
    
    if (step > 1) {
        showPanda();
    }
}

// Function to create fireworks effect using tsParticles
async function startFireworks() {
    await tsParticles.load("fireworks", {
        preset: "fireworks",
        fullScreen: {
            enable: false,
            zIndex: 100
        },
        background: {
            color: "#00000000",
            opacity: 0
        }
    });
}

async function showFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    fireworksContainer.style.display = 'block';
    fireworksContainer.style.position = 'fixed';
    fireworksContainer.style.top = '0';
    fireworksContainer.style.left = '0';
    fireworksContainer.style.width = '100%';
    fireworksContainer.style.height = '100%';
    fireworksContainer.style.pointerEvents = 'none';
    fireworksContainer.style.zIndex = '1000';

    await startFireworks();
    
    setTimeout(async () => {
        const particles = tsParticles.domItem(0);
        if (particles) {
            await particles.destroy();
        }
        fireworksContainer.style.display = 'none';
    }, 5000); // Display fireworks for 5 seconds
}

// Function to handle form submission and generate UTM URL
async function generateUTM() {
    let websiteURL = document.getElementById('websiteURL').value.trim();
    websiteURL = formatWebsiteURL(websiteURL);

    let utmSource = document.getElementById('utmSource').value;
    let utmMedium = document.getElementById('utmMedium').value;
    const utmCampaign = document.getElementById('utmCampaign').value;
    const utmContent = document.getElementById('utmContent').value;

    if (sourceMapping[utmSource.toLowerCase()]) {
        utmSource = sourceMapping[utmSource.toLowerCase()];
    }
    if (mediumMapping[utmMedium.toLowerCase()]) {
        utmMedium = mediumMapping[utmMedium.toLowerCase()];
    }

    let utmString = `${websiteURL}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`;

    if (utmContent) {
        utmString += `&utm_content=${encodeURIComponent(utmContent)}`;
    }

    document.getElementById('generatedURL').textContent = utmString;
    document.getElementById('utmForm').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    // Set the UTM value in the hidden form
    document.getElementById('utmInput').value = utmString;
    // Submit the hidden form
    document.getElementById('googleForm').submit();
    
    showPanda();
    await showFireworks();

    // Prepare form data
    const formData = new FormData();
    formData.append('entry.959683567', utmString); // Using your actual entry ID

    // Submit the form data
    fetch('https://docs.google.com/forms/d/e/11zBFh23TlPw0U_bFl6hkT_eNKss7Caere-pvsG7gqnM/formResponse', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
    .then(() => {
        console.log('UTM data submitted to Google Form');
    })
    .catch((error) => {
        console.error('Error submitting UTM to Google Form:', error);
    });
}


// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('utmForm');

    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.prev-btn');
    const generateButton = document.querySelector('.generate-btn');
    const startOverButton = document.querySelector('.start-over-btn');

    nextButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const currentStep = parseInt(this.closest('.form-step').id.replace('step', ''));
            goToStep(currentStep + 1);
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const currentStep = parseInt(this.closest('.form-step').id.replace('step', ''));
            goToStep(currentStep - 1);
        });
    });

    if (generateButton) {
        generateButton.addEventListener('click', function(event) {
            event.preventDefault();
            generateUTM();
        });
    }

    if (startOverButton) {
        startOverButton.addEventListener('click', startOver);
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        generateUTM();
    });
});