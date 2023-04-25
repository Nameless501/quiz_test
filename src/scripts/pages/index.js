import '../../styles/index.css';
import Quiz from '../components/Quiz';
import { postQuizData } from '../components/Api';
import { quizConfig } from '../utils/config';
import { formElement, successMessageElement, formHideSelector, messageVisibleSelector } from '../utils/constants';

function handleSubmit(quizData) {
  postQuizData(quizData)
    .then(res => {
      console.log(res);
      formElement.classList.add(formHideSelector);
      successMessageElement.classList.add(messageVisibleSelector);
    })
    .catch(err => console.log(err));
}

const quiz = new Quiz(quizConfig, handleSubmit);

quiz.setEventListeners();
quiz.render();
