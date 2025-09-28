// const htmlOption = document.getElementById("htmlOption");
// const mainContainer = document.querySelector(".gridContainer");
// const htmlContainer = document.querySelector(".htmlDiv");

// htmlOption.addEventListener("click", (event) => {
//   mainContainer.classList.add("unactive");
//   htmlContainer.style.display = "block";
// });

const questionContainer = document.querySelector(".questionContainer");
const optionContainer = document.querySelectorAll(".optionContainer");
const nextButton = document.querySelector(".nextQuestion");
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
  nextButton.classList.add("disableButton");
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
}

function handleActive() {
  optionContainer.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      optionContainer.forEach((option) => {
        option.classList.remove("active");

        option.querySelector("#optionSpan").style.backgroundColor = "#edf1f9";
        option.querySelector("#optionSpan").style.color = "#626c7f";
      });
      item.classList.add("active");
      item.querySelector("#optionSpan").style.backgroundColor = "#a729f5";
      item.querySelector("#optionSpan").style.color = "#ffffff";
    });
  });
}

handleActive();

//Next Button Functionality

nextButton.disabled = true;

nextButton.addEventListener("click", (event) => {
  currentQuestionIndex++;

  if (currenQuestion <= 9) {
    currenQuestion++;
  }

  handleQuestion(currentQuestionIndex, informationData);
});
