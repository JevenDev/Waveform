const waveformStack = document.getElementById('waveform-stack');
const dropZone = document.getElementById('drop-zone');
const waveforms = [];
let defaultWaveWrapper = null;

// create default waveform

function createDefaultWaveform() {
    defaultWaveWrapper = document.createElement('div');
    defaultWaveWrapper.className = 'wave-wrapper';
    defaultWaveWrapper.style.opacity = '0.3';

    const label = document.createElement('div');
    label.className = 'wave-filename';
    label.textContent = 'Sample Waveform – drop your audio below to begin';

    const waveformDiv = document.createElement('div');
    waveformDiv.className = 'waveform';

    defaultWaveWrapper.appendChild(label);
    defaultWaveWrapper.appendChild(waveformDiv);
    waveformStack.appendChild(defaultWaveWrapper);

    const wavesurfer = WaveSurfer.create({
        container: waveformDiv,
        waveColor: '#6666ff',
        progressColor: '#6666ff',
        cursorColor: 'transparent',
        barWidth: 2,
        barGap: 1,
        height: 100,
        barRadius: 2,
        normalize: true
    });

    wavesurfer.load('sample_audio.wav');
}

// create new waveform

function createWaveform(name, fileUrl) {
    const wrapper = document.createElement('div');
    wrapper.className = 'wave-wrapper';

    const label = document.createElement('div');
    label.className = 'wave-filename';
    label.textContent = name;

    // delete button
    const delButton = document.createElement('button');
    delButton.textContent = '✖';
    delButton.className = 'delete-button';
    delButton.addEventListener('click', () => {
        waveformStack.removeChild(wrapper);
        const index = waveforms.findIndex(w => w.wrapper === wrapper);
        if (index !== -1) waveforms.splice(index, 1);
    });

    // buttons container
    const buttonStack = document.createElement('div');
    buttonStack.style.display = 'flex';
    buttonStack.style.flexDirection = 'column';
    buttonStack.style.alignItems = 'flex-end';
    buttonStack.appendChild(delButton);

    const header = document.createElement('div');
    header.className = 'wave-header';
    header.appendChild(label);
    header.appendChild(buttonStack);

    const waveformDiv = document.createElement('div');
    waveformDiv.className = 'waveform';

    wrapper.appendChild(header);
    wrapper.appendChild(waveformDiv);
    waveformStack.appendChild(wrapper);

    // wavesurfer instance
    const wavesurfer = WaveSurfer.create({
        container: waveformDiv,
        waveColor: document.getElementById('waveColor').value,
        progressColor: document.getElementById('waveColor').value,
        cursorColor: 'transparent',
        barWidth: parseInt(document.getElementById('barWidth').value),
        barGap: parseInt(document.getElementById('barGap').value),
        height: parseInt(document.getElementById('height').value),
        barRadius: 2,
        normalize: true
    });

    wavesurfer.load(fileUrl);
    waveforms.push({ wavesurfer, wrapper });
}

// drag and drop events

dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('hover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('hover');
});

dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('hover');

    const files = [...e.dataTransfer.files];

    // remove default waveform
    if (defaultWaveWrapper) {
        defaultWaveWrapper.remove();
        defaultWaveWrapper = null;
    }

    files.forEach(file => {
        if (file && file.type.startsWith('audio/')) {
        const objectUrl = URL.createObjectURL(file);
        createWaveform(file.name, objectUrl);
        }
    });
});

// styling updates

['barWidth', 'barGap', 'height'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        const opts = {
        barWidth: parseInt(document.getElementById('barWidth').value),
        barGap: parseInt(document.getElementById('barGap').value),
        height: parseInt(document.getElementById('height').value)
        };
        waveforms.forEach(w => {
        w.wavesurfer.setOptions(opts);
        });
    });
});

document.getElementById('waveColor').addEventListener('change', () => {
    const color = document.getElementById('waveColor').value;
    waveforms.forEach(w => {
        w.wavesurfer.setOptions({
        waveColor: color,
        progressColor: color
        });
    });
});

// load default waveform on startup
createDefaultWaveform();