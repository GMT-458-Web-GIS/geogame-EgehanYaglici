const tutorialSteps = [
  {
    message: {
      en: "This is your map area. You can move your units on the map.",
      tr: "Bu sizin harita alanınız. Birimlerinizi harita üzerinde hareket ettirebilirsiniz."
    },
    highlight: "#map"
  },
  {
    message: {
      en: "Here, you can purchase units. It will be added at start point.",
      tr: "Buradan birimler satın alabilirsiniz. Satın aldığınız birimler başlangıç noktasına eklenecektir."
    },
    highlight: ".unit-buttons-container"
  },
  {
    message: {
      en: "This section shows your remaining GIS Coins.",
      tr: "Bu bölüm kalan GIS Coin miktarınızı gösterir."
    },
    highlight: "#control-panel p"
  },
  {
    message: {
      en: "Use 'Confirm Route' to finalize your unit movements. Infantry and Cavalry must follow roads. Confirm routes one-by-one.",
      tr: "'Confirm Route' düğmesini kullanarak birim hareketlerini onaylayabilirsiniz. Piyade ve Süvari yalnızca yolları kullanabilir. Rotaları teker teker onaylamalısınız." +
        "!! Yani ilk önce birimleri satın alın. Sonrasında harita üzerinden kendi birimlerinizden birine tıklayın. Seçili birim için yollara basıp rotasını saldıracağınız bölgeye doğru seçin. Burada, her birim için bir kere rotayı belirleyip confirm route tuşuna basıp, o rotayı kaydederek ilerlemeniz " +
        "lazım. Bu şekilde hepsinin rotasını belirledikten sonra...(sonraki sayfaya geç)"
    },
    highlight: ".action-buttons .action-button:nth-child(1)"
  },
  {
    message: {
      en: "Click 'Mobilize Units' to deploy your troops.",
      tr: "'Mobilize Units' düğmesine tıklayarak birliklerinizi harekete geçirebilirsiniz."
    },
    highlight: ".action-buttons .action-button:nth-child(2)"
  },
  {
    message: {
      en: "Roll dice here to determine attack and defense effects. There are 25 different effects.",
      tr: "Burada zar atarak saldırı ve savunma etkilerini belirleyebilirsiniz. 25 farklı etki mevcuttur."
    },
    highlight: "#dice-area"
  },
  {
    message: {
      en: "Check your units' status in this table. You can see Health, Attack, and Range.",
      tr: "Birimlerinizin durumunu bu tabloda kontrol edebilirsiniz. Sağlık, Saldırı ve Menzil bilgilerini görebilirsiniz."
    },
    highlight: "#current-status"
  },
  {
    message: {
      en: "Monitor battle progress in the battle status section. This part is for detailed analysis.",
      tr: "Savaş durumunu battle status bölümünde izleyebilirsiniz. Bu kısım detaylı analiz için mevcuttur."
    },
    highlight: "#battle-status"
  },
  {
    message: {
      en: "Click here to start the battle when ready!",
      tr: "Hazır olduğunuzda savaşı başlatmak için buraya tıklayın!"
    },
    highlight: ".start-battle"
  }
];

let currentStep = 0;

function positionHighlight(selector) {
  const element = document.querySelector(selector);
  const highlight = document.querySelector(".tutorial-highlight");
  const arrow = document.querySelector(".tutorial-arrow");

  if (element) {
    const rect = element.getBoundingClientRect();
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.top = `${rect.top + window.scrollY}px`;
    highlight.style.left = `${rect.left + window.scrollX}px`;
    highlight.style.display = "block";

    // Arrow positioning
    arrow.style.top = `${rect.top + window.scrollY - 30}px`;
    arrow.style.left = `${rect.left + rect.width / 2 - 10}px`;
    arrow.style.display = "block";
    arrow.classList.add("arrow-animation");
  }
}

function showTutorialStep() {
  const step = tutorialSteps[currentStep];
  if (!step) {
    closeTutorial();
    return;
  }

  const message = document.getElementById("tutorial-message");
  message.innerHTML = `
    <strong>EN:</strong> ${step.message.en}<br/>
    <strong>TR:</strong> ${step.message.tr}
    <br/><br/>
    <a href="https://youtu.be/N-K88tPyVBY" target="_blank" style="color: #007bff; text-decoration: underline;">
      Watch Gameplay Video
    </a>
  `;
  positionHighlight(step.highlight);
}

function startTutorial() {
  document.getElementById("tutorial-overlay").classList.remove("hidden");
  currentStep = 0;
  showTutorialStep();
}

function closeTutorial() {
  document.getElementById("tutorial-overlay").classList.add("hidden");
  document.querySelector(".tutorial-highlight").style.display = "none";
  document.querySelector(".tutorial-arrow").style.display = "none";
}

document.getElementById("tutorial-next").addEventListener("click", () => {
  currentStep++;
  showTutorialStep();
});

document.getElementById("tutorial-close").addEventListener("click", closeTutorial);

window.onload = () => startTutorial();

window.addEventListener("resize", () => {
  if (tutorialSteps[currentStep]) {
    positionHighlight(tutorialSteps[currentStep].highlight);
  }
});

window.addEventListener("scroll", () => {
  if (tutorialSteps[currentStep]) {
    positionHighlight(tutorialSteps[currentStep].highlight);
  }
});
