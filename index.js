// const htmlOption = document.getElementById("htmlOption");
// const mainContainer = document.querySelector(".gridContainer");
// const htmlContainer = document.querySelector(".htmlDiv");

// htmlOption.addEventListener("click", (event) => {
//   mainContainer.classList.add("unactive");
//   htmlContainer.style.display = "block";
// });

const questionContainer = document.querySelector(".questionContainer");
const optionContainer = document.querySelectorAll(".optionContainer");
const nextButton = document.querySelector(".confirmQuestion");
const nextQuestion = document.querySelector(".nextQuestion");
const optionHeader = document.getElementById("optionIn");
const image = document.getElementById("imageIC");
const questionCount = document.getElementById("questionCount");
const slider = document.getElementById("inputSlider");

let currentQuestionIndex = 0;
let currenQuestion = 1;
let informationData;

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
  handleQuestion(currentQuestionIndex, data);
}

function handleQuestion(indexx, info) {
  const letterArray = ["A", "B", "C", "D"];

  if (info.quizzes[0].questions[indexx]?.question != undefined) {
    questionContainer.innerHTML = `<h1 class="question-title">${info.quizzes[0].questions[indexx].question}</h1>`;
  }

  optionHeader.textContent = info.quizzes[0].title;
  image.src = info.quizzes[0].icon;
  questionCount.innerText = `Question ${currenQuestion} of ${info.quizzes[0].questions.length}`;

  slider.value = indexx;
  slider.max = info.quizzes[0].questions.length - 1;
  const percentage = ((indexx - slider.min) / (slider.max - slider.min)) * 100;

  slider.style.setProperty("--value", percentage + "%");

  optionContainer.forEach((item, index) => {
    if (info?.quizzes[0]?.questions[indexx]?.options[index] != undefined) {
      item.innerHTML = `<span id="optionSpan">${letterArray[index]}</span> <p class="answerText">${info?.quizzes[0]?.questions[indexx]?.options[index]}</p>`;
      item.style.cursor = "pointer";
      item.classList.remove("active");
    }
  });

  handleActiveButton();
  // correctAnswer();
}

function handleActive() {
  optionContainer.forEach((item) => {
    item.addEventListener("click", () => {
      optionContainer.forEach((option) => {
        option.classList.remove("active");

        option.querySelector("#optionSpan").style.backgroundColor = "#edf1f9";
        option.querySelector("#optionSpan").style.color = "#626c7f";
      });
      item.classList.add("active");
      item.querySelector("#optionSpan").style.backgroundColor = "#a729f5";
      item.querySelector("#optionSpan").style.color = "#ffffff";
      handleActiveButton();
      // correctAnswer(currentQuestionIndex, currenQuestion);
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
    informationData?.quizzes[0]?.questions[questionIndex]?.answer;

  if (answerText === correctAns) {
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
  }
}

//Next Button Functionality

nextButton.addEventListener("click", (event) => {
  correctAnswer(currentQuestionIndex);
});

nextQuestion.addEventListener("click", () => {
  document.querySelector(".correctAnswer")?.classList.remove("correctAnswer");
  currentQuestionIndex++;
  if (currenQuestion <= 9) {
    currenQuestion++;
  }
  handleQuestion(currentQuestionIndex, informationData);
  nextQuestion.style.display = "none";
  nextButton.style.display = "block";
});
