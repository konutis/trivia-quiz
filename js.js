// remove scroll on smaller screens  - make image smaller

(function() {
  let startButton = document.querySelector('#start');
  let startButton2 = document.querySelector('#start2');
  let startButton3 = document.querySelector('#start3');
  let howToButton = document.querySelector('#how-to');
  let closeHowToButton = document.querySelector('#close-how-to');
  let howToPlayScreen = document.querySelector('.how-to-play-screen');
  let mainScreen = document.querySelector('.main-screen');
  let quizScreen = document.querySelector('.quiz-screen');
  let resultScreen = document.querySelector('.result-screen');

  startButton.addEventListener('click', showGamePlay);
  startButton2.addEventListener('click', showGamePlay);
  startButton3.addEventListener('click', showGamePlay);

  howToButton.addEventListener('click', function() {
    howToPlayScreen.classList.remove('hidden');
    mainScreen.classList.add('hidden');
  });

  closeHowToButton.addEventListener('click', function() {
    howToPlayScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
  });

  let questionLength = 10;
  let questionIndex = 0;
  let score = 0;
  let timer = null;
  let questionData = null;
  let usedQuestions = [];

  function showGamePlay () {
    questionIndex = 0;
    score = 0;
    mainScreen.classList.add('hidden');
    howToPlayScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    let questionCount = document.getElementById('question-count');
    questionCount.innerHTML = questionLength.toString();
    populate();
  }

  let isEnded = function () {
    return questionLength === questionIndex;
  };

  function populate() {
    let answersContainer = document.getElementById('answers-container');
    let answerButtons = answersContainer.querySelectorAll('.default-button');

    answerButtons.forEach(function(element) {
      element.blur();
      element.disabled = false;
      element.classList.remove('correct');
      element.classList.remove('wrong');
    });

    if (isEnded()) {
      showScores();
    } else {
      startProgressbar();
      timer = window.setTimeout(function() {
        guess(null);
      }, 10000);

      setQuizText('This cute wapuu is from');

      questionData = getQuestionData();

      let imageElement = document.getElementById('question-image');
      imageElement.src = './assets/wapuus/' + questionData.image + '.png';

      // show choices
      let choices = questionData.answers;
      for (let i = 0; i < choices.length; i++) {
        let element = document.getElementById('answer' + i);
        element.innerHTML = choices[i];

        element.addEventListener('click', handleAnswerClick)
      }

      showProgress();
    }
  }

  function getQuestionData () {
    let randomIndex = getRandomIndexForQuestion();
    let answers = getAnswers(data[randomIndex].city);
    return {
      image: data[randomIndex].image_name,
      correct: data[randomIndex].city,
      answers: answers
    };
  }

  function getAnswers (correctAnswer) {
    let allAnswers = [correctAnswer];
    for (let i = 0; i < 3; i++) {
      let fakeAnswer = getFakeAnswer(allAnswers);
      allAnswers.push(fakeAnswer);
    }
    return shuffle(allAnswers);
  }

  function getFakeAnswer (answers) {
    let randomIndex = getRandomIndex();
    let fakeAnswer = data[randomIndex].city;
    if (answers.indexOf(fakeAnswer) > -1) {
      return getFakeAnswer(answers);
    }
    return fakeAnswer
  }

  function shuffle (array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function getRandomIndex () {
    return Math.floor(Math.random() * data.length);
  }

  function getRandomIndexForQuestion () {
    let index = Math.floor(Math.random() * data.length);
    if (usedQuestions.indexOf(index) > -1) {
      return getRandomIndexForQuestion();
    }
    return index;
  }

  function handleAnswerClick (e) {
    let el = e.currentTarget;
    let answer = el.innerHTML;
    el.removeEventListener('click', handleAnswerClick);
    guess(answer);
  }

  function showProgress () {
    let questionIndexElement = document.getElementById('question-index');
    let index = questionIndex + 1;
    questionIndexElement.innerHTML = index.toString();
  }

  function guess(answer) {
    clearTimeout(timer);
    let answersContainer = document.getElementById('answers-container');
    let answerButtons = answersContainer.querySelectorAll('.default-button');

    answerButtons.forEach(function(element) {
      element.disabled = true;
      if (element.innerHTML === questionData.correct) {
        element.classList.add('correct');
      }
    });

    stopProgressbar();

    if (questionData.correct === answer) { // correct answer
      score++;
      setQuizText('WAPUUTASTIC … YOU’RE RIGHT!')
    } else if (answer) { // incorrect answer
      setQuizText('NICE TRY … YOU WERE CLOSE :P');
      answerButtons.forEach(function(element) {
        if (element.innerHTML === answer) {
          element.classList.add('wrong');
        }
      });
    } else {
      setQuizText('YOUR TIME IS OUT … PO PO POOO')
    }

    questionIndex++;

    window.setTimeout(function() {
      populate();
    }, 3000);
  }

  function setQuizText (text) {
    let el = document.getElementById('quiz-text');
    el.innerHTML = text;
  }

  function showScores () {
    let scoreElement = document.getElementById('score');
    let scoreTotalElement = document.getElementById('score-total');
    let scoreNameElement = document.getElementById('score-name');
    let scoreImage = document.getElementById('result-logo');
    let twitterTweetButton = document.getElementById('twitter-tweet-button');

    scoreElement.innerHTML = score.toString();
    scoreTotalElement.innerHTML = questionLength.toString();

    if (score < 4) {
      scoreNameElement.innerHTML = 'Newbuu';
      scoreImage.src = './assets/wapuu-dumb.png';
      twitterTweetButton.href = `https://twitter.com/intent/tweet?text=My score - ${score.toString()} out of 10! I am a Newbuu! ${encodeURIComponent(location.href)}`;
    } else if (score < 7) {
      scoreNameElement.innerHTML = 'Rookiepuu';
      scoreImage.src = './assets/wapuu-rookie.png';
      twitterTweetButton.href = `https://twitter.com/intent/tweet?text=My score - ${score.toString()} out of 10! I am a Rookiepuu! ${ encodeURIComponent(location.href)}`;
    } else if (score < 10) {
      scoreNameElement.innerHTML = 'Wapuu expertuu';
      twitterTweetButton.href = `https://twitter.com/intent/tweet?text=My score - ${score.toString()} out of 10! I am a Wapuu expertuu! ${encodeURIComponent(location.href)}`;
      scoreImage.src = './assets/Game-Logo.png'
    } else {
      scoreNameElement.innerHTML = 'Grandmuuster';
      scoreImage.src = './assets/wapuu-grandmaster.png';
      twitterTweetButton.href = `https://twitter.com/intent/tweet?text=My score - ${score.toString()} out of 10! I am a Grandmuuster! encodeURIComponent(location.href)`;
    }

    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
  }

  function startProgressbar() {
    let progressbar = document.getElementById('progress-bar');
    progressbar.innerHTML = '';
    let progressbarInner = document.createElement('span');
    progressbar.appendChild(progressbarInner);
    progressbarInner.style.animationPlayState = 'running';
  }

  function stopProgressbar () {
    let progressbar = document.getElementById('progress-bar');
    let progressbarInner = progressbar.querySelector('span');
    progressbarInner.style.animationPlayState = 'paused';
  }
})();