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

// Function to move between steps
function goToStep(step) {
    let steps = document.getElementsByClassName('form-step');
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }
    document.getElementById('step' + step).style.display = 'block';
}

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

// Function to handle form submission and generate UTM URL
document.getElementById('utmForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Ensure website URL starts with "https://" and ends with "/"
    let websiteURL = document.getElementById('websiteURL').value.trim();
    websiteURL = formatWebsiteURL(websiteURL);

    let utmSource = document.getElementById('utmSource').value;
    let utmMedium = document.getElementById('utmMedium').value;
    const utmCampaign = document.getElementById('utmCampaign').value;
    const utmTerm = document.getElementById('utmTerm').value;
    const utmContent = document.getElementById('utmContent').value;

    // Replace source with mapped value if applicable
    if (sourceMapping[utmSource]) {
        utmSource = sourceMapping[utmSource];
    }

    // Replace medium with mapped value if applicable
    if (mediumMapping[utmMedium]) {
        utmMedium = mediumMapping[utmMedium];
    }

    // Build the UTM string
    let utmString = `${websiteURL}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`;

    // Add optional term and content if provided
    if (utmTerm) {
        utmString += `&utm_term=${encodeURIComponent(utmTerm)}`;
    }

    if (utmContent) {
        utmString += `&utm_content=${encodeURIComponent(utmContent)}`;
    }

    // Show the result
    document.getElementById('generatedURL').textContent = utmString;
    document.getElementById('utmForm').style.display = 'none';
    document.getElementById('result').style.display = 'block';
});

// Function to start over
function startOver() {
    document.getElementById('utmForm').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('utmForm').reset();
    goToStep(1);
}
