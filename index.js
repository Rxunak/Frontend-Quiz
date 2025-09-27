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
  questionContainer.innerHTML = `<h1 class="question-title">${info.quizzes[0].questions[indexx]?.question}</h1>`;
  optionHeader.textContent = info.quizzes[0].title;
  image.src = info.quizzes[0].icon;
  questionCount.innerText = `Question ${currenQuestion} of ${info.quizzes[0].questions.length}`;

  optionContainer.forEach(
    (item, index) =>
      (item.innerHTML = `<span id="optionSpan">${letterArray[index]}</span> <p class="answerText">${info.quizzes[0].questions[indexx].options[index]}</p>`)
  );
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;

  if (currenQuestion <= 9) {
    currenQuestion++;
  }

  handleQuestion(currentQuestionIndex, informationData);
});
