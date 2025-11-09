const mainContainer = document.querySelector(".landing");
const quizContainer = document.querySelector(".quizQuestions");
const cssContainer = document.querySelector(".CSSQuestions");
const palayAgainButton = document.querySelector(".playAgain");
const backHome = document.querySelector(".backToHome");
const scoreContainer = document.querySelector(".scorePage");
const scoreNumber = document.querySelector(".scoreNumber");
const questionContainer = document.querySelector(".questionContainer");
const optionContainer = document.querySelectorAll(".optionContainer");
const nextButton = document.querySelector(".confirmQuestion");
const nextQuestion = document.querySelector(".nextQuestion");
const optionHeader = document.getElementById("optionIn");
const image = document.getElementById("imageIC");
const questionCount = document.getElementById("questionCount");
const slider = document.getElementById("inputSlider");
const scorePage = document.querySelector(".scorePage");
const testContainer = document.querySelectorAll(".optionDiv");
const background = document.querySelector(".changeColor");

let currentQuestionIndex = 0;
let currentQuizIndex;
let currenQuestion = 1;
let informationData;
let count = 0;

testContainer.forEach((item) =>
  item.addEventListener("click", () => {
    item.classList.add("activeClass");

    if (item.classList.contains("activeClass")) {
      mainContainer.classList.add("unactive");
      quizContainer.style.display = "block";
    }

    if (
      item.classList.contains("activeClass") &&
      item.querySelector("span").classList.contains("html")
    ) {
      currentQuizIndex = 0;
      background.classList.add("html");
    } else if (
      item.classList.contains("activeClass") &&
      item.querySelector("span").classList.contains("css")
    ) {
      currentQuizIndex = 1;
      background.classList.add("css");
    } else if (
      item.classList.contains("activeClass") &&
      item.querySelector("span").classList.contains("javasript")
    ) {
      currentQuizIndex = 2;
      background.classList.add("javasript");
    } else {
      currentQuizIndex = 3;
      background.classList.add("accessibility");
    }
    handleQuestion(currentQuestionIndex, informationData, currentQuizIndex);
  })
);

fetch("data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    return response.json();
  })
  .then((data) => getData(data))
  .catch((error) => console.log(error));

function getData(data) {
  informationData = data;
  handleQuestion(currentQuestionIndex, data, currentQuizIndex);
}

function handleQuestion(indexx, info, quizIndex) {
  const letterArray = ["A", "B", "C", "D"];

  if (info.quizzes[quizIndex].questions[indexx]?.question != undefined) {
    questionContainer.innerHTML = `<h1 class="question-title">${info.quizzes[quizIndex].questions[indexx].question}</h1>`;
  }

  optionHeader.textContent = info.quizzes[quizIndex].title;
  image.src = info.quizzes[quizIndex].icon;

  questionCount.innerText = `Question ${currenQuestion} of ${info.quizzes[quizIndex].questions.length}`;

  slider.value = indexx;
  slider.max = info.quizzes[quizIndex].questions.length - 1;
  const percentage = ((indexx - slider.min) / (slider.max - slider.min)) * 100;

  slider.style.setProperty("--value", percentage + "%");

  optionContainer.forEach((item, index) => {
    if (
      info?.quizzes[quizIndex]?.questions[indexx]?.options[index] != undefined
    ) {
      item.innerHTML = `<span id="optionSpan">${letterArray[index]}</span> <p class="answerText">${info?.quizzes[quizIndex]?.questions[indexx]?.options[index]}</p>`;
      item.style.cursor = "pointer";
      item.classList.remove("active");
    }
  });

  handleActiveButton();
}

function handleActive() {
  optionContainer.forEach((item) => {
    item.addEventListener("click", () => {
      optionContainer.forEach((option) => {
        option.classList.remove("active");
        option.querySelector("#optionSpan").style.backgroundColor = "red";

        option.querySelector("#optionSpan").style.backgroundColor = "#edf1f9";
        option.querySelector("#optionSpan").style.color = "#626c7f";
      });
      item.classList.add("active");
      item.querySelector("#optionSpan").style.backgroundColor = "#a729f5";
      item.querySelector("#optionSpan").style.color = "#ffffff";
      handleActiveButton();
    });
  });
}

handleActive();

function handleActiveButton() {
  const hasActiveClass = document.getElementsByClassName("active").length > 0;

  if (hasActiveClass) {
    nextButton.disabled = false;
    nextButton.classList.remove("disableButton");
  } else {
    nextButton.disabled = true;
    nextButton.classList.add("disableButton");
  }
}

function correctAnswer(questionIndex) {
  const hasActiveClass = document.querySelector(".active");

  const answerText = hasActiveClass?.querySelector(".answerText").textContent;
  const correctAns =
    informationData?.quizzes[currentQuizIndex]?.questions[questionIndex]
      ?.answer;

  if (answerText === correctAns) {
    count++;
    hasActiveClass.classList.replace("active", "correctAnswer");
    nextQuestion.style.display = "block";
    nextButton.style.display = "none";

    optionContainer.forEach((item) => {
      if (item.classList.contains("correctAnswer")) {
        item.querySelector("#optionSpan").style.backgroundColor = "#2fd887";
        let img = document.createElement("img");
        img.src = "assets/images/icon-correct.svg";
        img.style.width = "28px";
        img.style.marginLeft = "auto";

        item.appendChild(img);
      }
    });
    scoreNumber.textContent = count;
  } else if (answerText !== correctAns) {
    hasActiveClass.classList.replace("active", "wrongAnswer");
    nextQuestion.style.display = "block";
    nextButton.style.display = "none";

    optionContainer.forEach((item) => {
      if (item.querySelector(".answerText").textContent === correctAns) {
        let img = document.createElement("img");
        img.src = "assets/images/icon-correct.svg";
        img.style.width = "28px";
        img.style.marginLeft = "auto";

        item.appendChild(img);
      }
      if (item.classList.contains("wrongAnswer")) {
        item.querySelector("#optionSpan").style.backgroundColor = "#ee5454";
        let img = document.createElement("img");
        img.src = "assets/images/icon-incorrect.svg";
        img.style.width = "28px";
        img.style.marginLeft = "auto";
        item.appendChild(img);
      }
    });
  }
}

//Next Button Functionality

nextButton.addEventListener("click", (event) => {
  correctAnswer(currentQuestionIndex);
});

nextQuestion.addEventListener("click", () => {
  document.querySelector(".correctAnswer")?.classList.remove("correctAnswer");
  document.querySelector(".wrongAnswer")?.classList.remove("wrongAnswer");
  currentQuestionIndex++;
  currenQuestion++;

  handleQuestion(currentQuestionIndex, informationData, currentQuizIndex);
  nextQuestion.style.display = "none";
  nextButton.style.display = "block";

  if (currenQuestion > 10) {
    quizContainer.style.display = "none";
    scorePage.style.display = "block";
  }
});

//reset values

function reset(indexx, info) {
  const letterArray = ["A", "B", "C", "D"];
  questionCount.innerText = `Question ${currenQuestion} of ${info.quizzes[currentQuizIndex].questions.length}`;

  if (
    info.quizzes[currentQuizIndex]?.questions[indexx]?.question != undefined
  ) {
    questionContainer.innerHTML = `<h1 class="question-title">${info.quizzes[currentQuizIndex].questions[indexx].question}</h1>`;
  }

  slider.value = indexx;
  slider.max = info.quizzes[currentQuizIndex]?.questions.length - 1;
  const percentage = ((indexx - slider.min) / (slider.max - slider.min)) * 100;

  slider.style.setProperty("--value", percentage + "%");

  optionContainer.forEach((item, index) => {
    if (
      info?.quizzes[currentQuizIndex]?.questions[indexx]?.options[index] !=
      undefined
    ) {
      item.innerHTML = `<span id="optionSpan">${letterArray[index]}</span> <p class="answerText">${info?.quizzes[currentQuizIndex]?.questions[indexx]?.options[index]}</p>`;
      item.style.cursor = "pointer";
      item.classList.remove("active");
    }
  });
}

//play again button functionality

palayAgainButton.addEventListener("click", () => {
  quizContainer.style.display = "block";
  scoreContainer.style.display = "none";
  currenQuestion = 1;
  currentQuestionIndex = 0;
  count = 0;
  reset(currentQuestionIndex, informationData);
});

backHome.addEventListener("click", () => {
  scoreContainer.style.display = "none";
  mainContainer.style.display = "block";
});
