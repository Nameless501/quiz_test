import '../../styles/index.css';
import Quiz from '../components/Quiz';
import { postQuizData } from '../components/Api';
import { quizConfig } from '../utils/config';

function handleSubmit(quizData) {
    postQuizData(quizData)
        .then(res => console.log(res))
        .catch(err => console.log(err));
}

const quiz = new Quiz(quizConfig, handleSubmit);

quiz.setEventListeners();
quiz.render();