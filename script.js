function checkSIM() {
  const number = document.getElementById("numberInput").value.trim();
  const outputDiv = document.getElementById("output");
  const outputSection = document.getElementById("outputSection");
  const clickSound = document.getElementById("clickSound");
  const resultSound = document.getElementById("resultSound");

  clickSound.play();

  if (!/^[0-9]{11}$/.test(number)) {
    outputSection.style.display = "block";
    outputDiv.innerHTML = "<p>Please enter a valid 11-digit number.</p>";
    return;
  }

  outputSection.style.display = "block";
  outputDiv.innerHTML = "<p>Loading...</p>";
  document.getElementById("checkBtn").innerText = "Loading...";

  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://fam-official.serv00.net/sim/api.php?num=${number}`)}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("checkBtn").innerText = "Check Info";
      const content = JSON.parse(data.contents);
      if (content.status === "success" && content.data.length > 0) {
        const info = content.data[0];
        const network = detectNetwork(number);
        const resultText = `
          <div class="card">
            <p><strong>Name:</strong> ${info.Name}</p>
            <p><strong>نام:</strong> ${info.Name}</p>
            <p><strong>Mobile:</strong> ${info.Mobile} (${network})</p>
            <p><strong>CNIC:</strong> ${info.CNIC}</p>
            <p><strong>شناختی کارڈ:</strong> ${info.CNIC}</p>
            <p><strong>Address:</strong> ${info.Address}</p>
            <p><strong>پتہ:</strong> ${info.Address}</p>
          </div>
        `;
        outputDiv.innerHTML = resultText;
        resultSound.play();

        // WhatsApp Share Link
        document.getElementById("shareBtn").href = `https://wa.me/?text=${encodeURIComponent(info.Name + "\n" + info.Mobile + "\n" + info.CNIC + "\n" + info.Address)}`;

      } else {
        outputDiv.innerHTML = "<p>No data found.</p>";
      }
    })
    .catch(error => {
      outputDiv.innerHTML = "<p>Error fetching data. Please try again later.</p>";
      document.getElementById("checkBtn").innerText = "Check Info";
    });
}

function detectNetwork(num) {
  const code = num.substring(0, 4);
  if (["0300","0301","0302","0303","0304","0305","0306"].includes(code)) return "Jazz";
  if (["0310","0311","0312","0313","0314","0315"].includes(code)) return "Zong";
  if (["0320","0321","0322","0323","0324","0325"].includes(code)) return "Warid";
  if (["0330","0331","0332","0333","0334","0335"].includes(code)) return "Ufone";
  if (["0340","0341","0342","0343","0344","0345"].includes(code)) return "Telenor";
  return "Unknown";
}

function copyResult() {
  const text = document.getElementById("output").innerText;
  navigator.clipboard.writeText(text)
    .then(() => alert("Result copied to clipboard!"))
    .catch(err => alert("Failed to copy."));
}

function clearResult() {
  document.getElementById("numberInput").value = "";
  document.getElementById("outputSection").style.display = "none";
  document.getElementById("output").innerHTML = "";
}
