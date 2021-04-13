
function sendCommand(command, color, weight) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            drawConfig: {
                color: color,
                weight: weight
            },
            command: command
        })
    });
}

let selectedWeight = () => {
    let weight = document.getElementById('weight');
    return weight.value
}

let selectedColour = (colours) => {
    let colour = colours.find(colour => colour.classList.contains('active'));
    return colour.dataset.colour
}


document.addEventListener('DOMContentLoaded', () => {
    const colours = Array.from(document.querySelectorAll('.colour-choice'));
    const drawIcon = document.querySelector('#draw-button');
    const clear = document.querySelector('#clear-button');
    const stop = document.querySelector('#stop-button');
    const slider = document.querySelector('#weight');
    const weightValue = document.querySelector('#weight-value');

    stop.addEventListener('click', () => {
        let selColour = selectedColour(colours);
        let selWeight = selectedWeight();
        sendCommand('stop', selColour, selWeight);
    })

    clear.addEventListener('click', () => {
        let selColour = selectedColour(colours);
        let selWeight = selectedWeight();
        sendCommand('clear', selColour, selWeight);
    })

    drawIcon.addEventListener('click', () => {
        let selColour = selectedColour(colours);
        let selWeight = selectedWeight();
        sendCommand('updateConfig', selColour, selWeight);
    })

    colours.forEach((colour) => {
        colour.addEventListener('click', () => {
            colours.forEach((colour) => {
                colour.classList.remove('active')
            });
            colour.classList.add('active')
            let selColour = selectedColour(colours);
            let selWeight = selectedWeight();
            sendCommand('updateConfig', selColour, selWeight);
        });

    })

    slider.addEventListener("input", function() {
        let selColour = selectedColour(colours);
        let selWeight = selectedWeight();
        weightValue.innerHTML = selWeight
        sendCommand('updateConfig', selColour, selWeight);
    });
});
