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
  let bestScoreElement = document.querySelector('.best-score');

  let metaOgImage = document.querySelector('meta[property="og:image"]');
  let newImage = document.createElement('img');
  newImage.src = 'assets/facebook-wapuu-trivia-quizz.png';
  metaOgImage.content = newImage.src;

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

  let storageScore = window.localStorage.getItem('vcWapuuTriviaBestScore');
  if (storageScore) {
    bestScoreElement.innerHTML = `Best score: ${storageScore} out of 10`
  }

  let questionLength = window.localStorage.getItem('vcWapuuTriviaQuestionsLength');

  if (!questionLength) {
    window.localStorage.setItem('vcWapuuTriviaQuestionsLength', '10');
    questionLength = 10
  } else {
    questionLength = parseInt(questionLength)
  }

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
      imageElement.src = '';
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
    let scoreDescription = document.getElementById('score-description');

    scoreElement.innerHTML = score.toString();
    scoreTotalElement.innerHTML = questionLength.toString();
    let metaText = 'Can You Guess the Origin of Each Wappu?'

    let bestScore = window.localStorage.getItem('vcWapuuTriviaBestScore');
    if (!bestScore || (parseInt(bestScore) < parseInt(score))) {
      window.localStorage.setItem('vcWapuuTriviaBestScore', score);
      bestScoreElement.innerHTML = `Best score: ${score.toString()} out of 10`
    }

    if (score < 4) {
      scoreNameElement.innerHTML = 'Newbuu';
      scoreImage.src = './assets/wapuu-dumb.png';
      metaText = `I am Newbuu - Can You Guess the Origin of Each Wappu?`
      scoreDescription.innerHTML = 'You are not bad — you are just bad at this. We know you can do better!'
    } else if (score < 7) {
      scoreNameElement.innerHTML = 'Rookiepuu';
      scoreImage.src = './assets/wapuu-rookie.png';
      metaText = `I am Rookiepuu - Can You Guess the Origin of Each Wappu?`
      scoreDescription.innerHTML = 'You know enough, but there is a touch of smallness. You need more to shine!'
    } else if (score < 10) {
      scoreNameElement.innerHTML = 'Wapuu expertuu';
      scoreImage.src = './assets/Game-Logo.png'
      metaText = `I am Wapuu expertuu - Can You Guess the Origin of Each Wappu?`
      scoreDescription.innerHTML = 'So close — you are getting hot, unable to stop. With a burning heart, you are on your way to shine!'
    } else {
      scoreNameElement.innerHTML = 'Grandmuuster';
      scoreImage.src = './assets/wapuu-grandmaster.png';
      metaText = `I am Grandmuuster - Can You Guess the Origin of Each Wappu?`
      scoreDescription.innerHTML = 'WooHoo! Your star hour is here! You recognize all the origins of Wapuu - a true Wapuu guru!'
    }

    twitterTweetButton.href = `https://twitter.com/intent/tweet?text=${metaText} Wappu Trivia game for WordPress enthusiasts ${encodeURIComponent(location.href)}`;

    let metaElement = document.querySelector('meta[name=description]');
    metaElement.parentNode.removeChild(metaElement);

    let newMetaElement = document.createElement('meta')
    newMetaElement.name = 'description'
    newMetaElement.content = metaText
    document.head.appendChild(newMetaElement)

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