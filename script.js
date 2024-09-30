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

// Function to move between steps
function goToStep(step) {
    let steps = document.getElementsByClassName('form-step');
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }
    document.getElementById('step' + step).style.display = 'block';
    
    // Show panda animation when moving to the next step (except for the first step)
    if (step > 1) {
        showPanda();
    }
}

// Function to handle form submission and generate UTM URL
function handleSubmit(event) {
    event.preventDefault();
    
    // Ensure website URL starts with "https://" and ends with "/"
    let websiteURL = document.getElementById('websiteURL').value.trim();
    websiteURL = formatWebsiteURL(websiteURL);

    let utmSource = document.getElementById('utmSource').value;
    let utmMedium = document.getElementById('utmMedium').value;
    const utmCampaign = document.getElementById('utmCampaign').value;
    const utmContent = document.getElementById('utmContent').value;

    // Replace source with mapped value if applicable
    if (sourceMapping[utmSource.toLowerCase()]) {
        utmSource = sourceMapping[utmSource.toLowerCase()];
    }

    // Replace medium with mapped value if applicable
    if (mediumMapping[utmMedium.toLowerCase()]) {
        utmMedium = mediumMapping[utmMedium.toLowerCase()];
    }

    // Build the UTM string
    let utmString = `${websiteURL}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`;

    // Add optional content if provided
    if (utmContent) {
        utmString += `&utm_content=${encodeURIComponent(utmContent)}`;
    }

    // Show the result
    document.getElementById('generatedURL').textContent = utmString;
    document.getElementById('utmForm').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    
    // Show panda animation when form is submitted
    showPanda();
}

// Function to start over
function startOver() {
    document.getElementById('utmForm').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('utmForm').reset();
    goToStep(1);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for form submission
    document.getElementById('utmForm').addEventListener('submit', handleSubmit);

    // Add event listeners for navigation buttons
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.prev-btn');
    const generateButton = document.querySelector('.generate-btn');
    const startOverButton = document.querySelector('.start-over-btn');

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').id.replace('step', ''));
            goToStep(currentStep + 1);
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').id.replace('step', ''));
            goToStep(currentStep - 1);
        });
    });

    if (generateButton) {
        generateButton.addEventListener('click', handleSubmit);
    }

    if (startOverButton) {
        startOverButton.addEventListener('click', startOver);
    }
});