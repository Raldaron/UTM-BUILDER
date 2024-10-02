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
    "video ads": "video",
    "3rd party event": "partnership"
};

// Encouraging messages for the panda
const encouragements = [
    "Way to go!",
    "Keep going, you can do it!",
    "Great job! You're making a UTM all by yourself! Yay!",
    "You're almost there!",
    "Wow! You're doing great!",
    "And they said you couldn't do it... Look at you go! Good job proving them wrong!"
];

// Messages for the panda when pressing back
const backButtonMessages = [
    "Backstreet's back; ALRIGHT!",
    "No worries, mistakes happen!",
    "Backtracking is part of the journey!",
    "Well, well, well... Look who made a mistake. Don't worry, I won't tell. Promise.",
    "Oh no! You made a mistake, but that's okay! That's why there's a back button!"
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
function showPanda(messagesArray) {
    const pandaContainer = document.getElementById('pandaContainer');
    const speechBubble = document.getElementById('speechBubble');
    
    const messages = messagesArray || encouragements;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
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
    goToStep(0);
}

// Function to navigate between steps
function goToStep(step, showPandaFlag = true) {
    let steps = document.getElementsByClassName('form-step');
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }
    document.getElementById('step' + step).style.display = 'block';

    if (showPandaFlag && step > 0) {
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

// Function to display fireworks
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
    const userEmail = document.getElementById('userEmail').value.trim();

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

    showPanda();
    await showFireworks();

    // Prepare form data
    const formData = new FormData();
    formData.append('entry.959683567', utmString); // UTM entry ID
    formData.append('entry.1080429257', userEmail); // Email entry ID

    // Submit the form data
    fetch('https://docs.google.com/forms/d/e/1FAIpQLSfx0wHXDfgtadXe7C-FIObVADGmLZumwcLrjKKZDmBl0G2JnQ/formResponse', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
    .then(() => {
        console.log('UTM data and email submitted to Google Form');
    })
    .catch((error) => {
        console.error('Error submitting data to Google Form:', error);
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

            // Validate consent checkbox and email at step 0
            if (currentStep === 0) {
                const consentGiven = document.getElementById('consentCheckbox').checked;
                if (!consentGiven) {
                    alert('Please agree to the collection and processing of your email address.');
                    return;
                }

                // Validate email input
                const userEmail = document.getElementById('userEmail').value.trim();
                if (!userEmail) {
                    alert('Please enter your email address.');
                    return;
                }
            }

            goToStep(currentStep + 1);
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const currentStep = parseInt(this.closest('.form-step').id.replace('step', ''));
            goToStep(currentStep - 1, false); // Do not show the default panda message
    
            // Show the panda with a random message from backButtonMessages
            showPanda(backButtonMessages);
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

    // Start at step 0
    goToStep(0);
});
