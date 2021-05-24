/* Javascript for ComparisonXBlock. */
function ComparisonXBlock(runtime, element, params) {
  const currentLanguage = $('html').attr('lang');
  let upperCaseAlp = currentLanguage === 'uk' ? 'АБВГДЕЖИКЛМНПРСТУФХЦШЩЮЯ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    handlerSubmitUrl = runtime.handlerUrl(element, 'submit_problem'),
    userAnswers = params.answers,
    isPastDue = params.has_deadline_passed,
    $answers = $('.js-answer', element),
    $dropdownItemBlank = $('.dropdown--item_blank', element),
    $submitButton = $('.submit', element),
    $submitLabel = $('.submit-label', element),
    $notification = $('.notification'),
    $notificationMessage = $('.js-notification-message', element),
    gettext;

  if ('СomparisonXBlockI18N' in window) {
    // Use Сomparison's local translations
    gettext = window.СomparisonXBlockI18N.gettext;
  } else if ('gettext' in window) {
    // Use edxapp's global translations
    gettext = window.gettext;
  }
  if (typeof gettext == 'undefined') {
    // No translations -- used by test environment
    gettext = function(string) {return string;};
  }

  let render = function() {
     _.each($('.js-alp', element), function(el, index) {
      $(el).text(`${upperCaseAlp[index]}.`)
    });

    _.each(userAnswers, function(userAnswer) {
      let $answer = $(`.dropdown-list_answers .answer-uid-${userAnswer.answer_uid}`, element),
          $question = $(`.dropdown--item_blank.question-uid-${userAnswer.question_uid}`, element);
      dropdownAnswer($answer, $question);
    })
  };

  let dropdownAnswer = function($selectedAnswer, $question) {
    $selectedAnswer.removeClass('selected-answer');
    let $cloneSelectedAnswer = $selectedAnswer.clone();
    $selectedAnswer.addClass('dropdown-answer');
    $question.html($cloneSelectedAnswer);
    checkAvailabilitySubmit();
  };

  let removeAnswer = function($answer) {
    let answerUid = $answer.data('answer-uid');
    $(`.dropdown-list_answers .answer-uid-${answerUid}`, element).removeClass('dropdown-answer');
    $answer.remove();
  };

  let checkAvailabilitySubmit = function() {
    let $answers = $('.dropdown-list_questions .js-answer', element);
    $submitButton.attr('disabled', isPastDue || $dropdownItemBlank.length !== $answers.length);
  };

  let showMessage = function() {
    $notification.removeClass('is-hidden');
    $notificationMessage.text(gettext('Your response has been sent successfully.'));
  };

  let hideMessage = function() {
    $notification.addClass('is-hidden');
    $notificationMessage.text('');
  };

  render();

  // mark the answer to the selected
  $answers.on('click', function(ev) {
    let $ev = $(ev.currentTarget),
        hasClassSelectedAnswer = $(ev.currentTarget).hasClass('selected-answer');
    $answers.removeClass('selected-answer');

    if (!hasClassSelectedAnswer) {
      $ev.addClass('selected-answer')
    }
  });

  $dropdownItemBlank.on('click', function(ev) {
    let $question = $(ev.currentTarget),
        $answer = $question.children('.js-answer'),
        $selectedAnswer = $('.selected-answer', element);

    if ($selectedAnswer.length) {
      if ($answer.length) {
        removeAnswer($answer);
      }
      dropdownAnswer($selectedAnswer, $question)
    }
  });

  $('.dropdown-list_questions', element).on('click', '.js-remove-answer', function(ev) {
    removeAnswer($(ev.currentTarget).parent('.js-answer'));
    checkAvailabilitySubmit();
  });

  $submitButton.on('click', function() {
    let answers = [];

    if (isPastDue) {
      return
    }

    _.each($dropdownItemBlank, function(el) {
      let questionUid = $(el).data('question-uid'),
          answerUid = $('.js-answer', el).data('answer-uid');
      answers.push({
        question_uid: questionUid,
        answer_uid: answerUid
      })
    });

    $submitLabel.text($submitButton.data('submitting'));

    $.ajax({
      type: 'POST',
      url: handlerSubmitUrl,
      data: JSON.stringify({answers: answers}),
      dataType: 'json',
      success: function (response) {
        $submitLabel.text($submitButton.data('value'));
        showMessage();
        setTimeout(hideMessage, 5000);
      }
    })
  })
}
