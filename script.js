const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const shareBtn = document.getElementById('shareBtn');
const numberInput = document.getElementById('numberInput');
const resultBox = document.getElementById('result');
const spinner = document.getElementById('spinner');
const clickSound = document.getElementById('clickSound');
const successSound = document.getElementById('successSound');

function validateNumber(number) {
    return /^03[0-9]{9}$/.test(number);
}

function detectNetwork(number) {
    const code = number.slice(2, 5);
    const network = {
        "300": "Jazz", "301": "Jazz", "302": "Jazz", "303": "Jazz", "304": "Jazz",
        "310": "Zong", "311": "Zong", "312": "Zong", "313": "Zong",
        "320": "Ufone", "321": "Ufone", "322": "Ufone", "323": "Ufone",
        "330": "Telenor", "331": "Telenor", "332": "Telenor", "333": "Telenor"
    };
    return network[code] || "Unknown Network";
}

searchBtn.addEventListener('click', async () => {
    clickSound.play();
    const number = numberInput.value.trim();
    if (!validateNumber(number)) {
        alert('Please enter a valid Pakistani number starting with 03...');
        return;
    }
    spinner.classList.remove('hidden');
    resultBox.innerHTML = '';

    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://fam-official.serv00.net/sim/api.php?num=${number}`)}`);
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);

        let resultHTML = `
            <strong>Network:</strong> ${detectNetwork(number)}<br>
            <strong>Owner (English):</strong> ${parsedData.data.name}<br>
            <strong>مالک (اردو):</strong> ${parsedData.data.urdu_name}<br>
            <strong>City:</strong> ${parsedData.data.city}
        `;

        resultBox.innerHTML = resultHTML;
        successSound.play();
    } catch (error) {
        resultBox.innerHTML = 'Error fetching number information!';
    } finally {
        spinner.classList.add('hidden');
    }
});

clearBtn.addEventListener('click', () => {
    numberInput.value = '';
    resultBox.innerHTML = '';
});

shareBtn.addEventListener('click', () => {
    if (resultBox.innerText.trim() !== "") {
        const message = `Number Information:\n${resultBox.innerText}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    } else {
        alert('No result to share!');
    }
});
