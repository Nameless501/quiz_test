import {
  containerElement,
  questionElement,
  currentStepElement,
  selectTemplateElement,
  submitFormTemplate,
  controlButtonsElement,
  inputTemplateElement,
  buttonNextElement,
  buttonPrevElement,
  formElement,
  buttonSelectorDisabled,
  inputWrapperSelector,
  inputLabelSelector,
  inputSelector,
  inputsContainerSelector,
  selectTitleSelector,
  selectValueSelector,
  submitButtonSelector,
  initialFormValue
} from '../utils/constants';

export default class Quiz {
  constructor(data, submitHandler) {
    this._index = 0;
    this._quizList = data;
    this._stepsCount = data.length;
    this._currentQuiz = data[0];
    this._inputsData = initialFormValue;
    this._submitHandler = submitHandler;
  };

  _clear() {
    containerElement.innerHTML = '';
    questionElement.textContent = '';
    currentStepElement.textContent = '';
  };

  _getCurrentQuestion() {
    this._currentQuiz = this._quizList[this._index];
  };

  _renderQuestionAndStep() {
    const { question, step } = this._currentQuiz;

    questionElement.textContent = question;
    currentStepElement.textContent = `Шаг ${step}/${this._stepsCount}`;
  };

  _createInput({ label, value, name, type, placeholder, classes, checked = false }) {
    const newElement = inputTemplateElement.content.cloneNode(true);
    const elementWrapper = newElement.querySelector(inputWrapperSelector);
    const elementLabel = newElement.querySelector(inputLabelSelector);
    const elementInput = newElement.querySelector(inputSelector);

    elementWrapper.classList.add(classes.wrapper);
    elementLabel.classList.add(classes.label);
    elementInput.classList.add(classes.input);

    elementLabel.textContent = label;
    elementLabel.setAttribute('for', `${name}-${value}`);

    elementInput.setAttribute('name', name);
    elementInput.setAttribute('value', value);
    elementInput.setAttribute('type', type);
    elementInput.setAttribute('id', `${name}-${value}`);
    elementInput.setAttribute('placeholder', placeholder);
    elementInput.dataset.selectValue = label;
    elementInput.dataset.type = 'input';

    if (this._inputsData[name] === value) {
      elementInput.setAttribute('checked', checked);
    }

    return newElement;
  };

  _createInputsList() {
    const { inputs, listSelector } = this._currentQuiz;

    const newInputsList = document.createElement('ul');
    newInputsList.classList.add(listSelector);

    inputs.forEach(input => {
      const newInput = this._createInput(input);
      newInputsList.appendChild(newInput);
    });

    return newInputsList;
  };

  _createSelect() {
    const { inputTitle } = this._currentQuiz;

    const newSelect = selectTemplateElement.content.cloneNode(true);
    newSelect.querySelector(inputsContainerSelector).appendChild(this._createInputsList());

    const selectTitle = newSelect.querySelector(selectTitleSelector);
    selectTitle.textContent = inputTitle;

    const selectCurrentValue = newSelect.querySelector(selectValueSelector);

    newSelect.querySelectorAll(inputSelector).forEach(input => {
      input.addEventListener('change', (evt) => {
        selectCurrentValue.textContent = evt.currentTarget.dataset.selectValue;
        evt.target.closest('details').removeAttribute('open');
      })

      if (input.checked === true) {
        selectCurrentValue.textContent = input.dataset.selectValue;
      }
    });

    return newSelect;
  };

  _createSubmitForm() {
    const newSubmitForm = submitFormTemplate.content.cloneNode(true);
    newSubmitForm.querySelector(inputsContainerSelector).prepend(this._createInputsList());

    return newSubmitForm;
  };

  _renderQuizForm() {
    const { type } = this._currentQuiz;

    if (type === 'select') {
      containerElement.appendChild(this._createSelect());
    }

    if (type === 'radio') {
      containerElement.appendChild(this._createInputsList());
    }

    if (type === 'submit') {
      containerElement.appendChild(this._createSubmitForm());
    }
  };

  _renderFormButtons() {
    const isFirstStep = this._index === 0;
    const isLastStep = this._index === this._stepsCount - 1;

    buttonPrevElement.style.visibility = isFirstStep ? 'hidden' : 'visible';
    controlButtonsElement.style.display = isLastStep ? 'none' : 'flex';
  };

  _validate() {
    const isValid = formElement.checkValidity();
    const submitButton = formElement.querySelector(submitButtonSelector);

    if (!isValid) {
      buttonNextElement.setAttribute('disabled', true);
      buttonNextElement.classList.add(buttonSelectorDisabled);

      submitButton && submitButton.setAttribute('disabled', true);
      submitButton && submitButton.classList.add(buttonSelectorDisabled);

      return;
    }

    buttonNextElement.removeAttribute('disabled');
    buttonNextElement.classList.remove(buttonSelectorDisabled);

    submitButton && submitButton.removeAttribute('disabled');
    submitButton && submitButton.classList.remove(buttonSelectorDisabled);
  };

  render() {
    this._getCurrentQuestion();
    this._clear();
    this._renderQuestionAndStep();
    this._renderQuizForm();
    this._renderFormButtons();
    this._validate()
  };

  setEventListeners() {
    buttonNextElement.addEventListener('click', () => {
      if (this._index < this._stepsCount) {
        this._index += 1;
        this.render();
      }
    });

    buttonPrevElement.addEventListener('click', () => {
      if (this._index > 0) {
        this._index -= 1;
        this.render();
      }
    });

    formElement.addEventListener('input', (evt) => {
      this._validate();

      const { name, value } = evt.target;
      this._inputsData[name] = value;
    });

    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this._submitHandler(this._inputsData);
    });
  };
}
