/* Javascript for ComparisonStudioEditXBlock. */
function ComparisonStudioEditXBlock(runtime, element, params) {
  const upperCaseAlp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        minNumberQuestions = 1;

  let questions = params.data.questions,
      answers = params.data.answers,
      handlerStudioSubmitUrl = runtime.handlerUrl(element, 'studio_submit'),
      $displayNameField = $('#xb-field-edit-display-name', element),
      $weightField = $('#xb-field-edit-weight', element),
      $displayOptionField = $('#xb-field-edit-display-option', element),
      $questionsTab = $('.questions-tab', element),
      $answersTab = $('.answers-tab', element),
      $blockQuestions = $('.js-block-questions', element),
      $blockAnswers = $('.js-block-answers', element),
      $saveButton = $('.save-button', element),
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

  // Questions tab
  let renderQuestions = function (questions) {
    let tplQuestions = $('#js-questions-tpl', element).html();
    $blockQuestions.html(_.template(tplQuestions)({questions: questions, gettext: gettext}));
  }

  renderQuestions(questions);

  let toggleQuestionDeleteButtons = function () {
    let $removeButtons = $('.js-remove-question', element);
    if (questions.length === minNumberQuestions) {
      $removeButtons.addClass('hidden');
    } else {
      $removeButtons.removeClass('hidden');
    }
  }

  let validateQuestions = function() {
    let $fields = $blockQuestions.find('input.js-question-text'),
        success = true;
    $fields.each(function(index, field) {
      let $field = $(field);
      $field.removeClass('field-error');

      if (!$field.val()) {
        $field.addClass('field-error');
        success = false;
      }
    });

    if (!success) {
      runtime.notify('error', {
        'title': gettext('There was an error with your form.'),
        'message': gettext('Please check over your questions.')
      });
    }
    return success
  }

  $('.js-add-question', element).on('click', function() {
    let maxUid = _.max(questions, function(question){ return question.uid; }).uid;
    questions.push({
      uid: maxUid + 1,
      text: '',
    })
    renderQuestions(questions);
    toggleQuestionDeleteButtons();
  })

  $blockQuestions.on('click', '.js-remove-question', function(ev) {
    let uid = $(ev.currentTarget).data('uid');
    questions = _.filter(questions, function(q) { return q.uid !== uid; });
    renderQuestions(questions);
    toggleQuestionDeleteButtons();
  })

  $blockQuestions.on('change', '.js-question-text', function(ev) {
    let $ev = $(ev.currentTarget),
        uid = $ev.data('uid');
    _.each(questions, function(q) {
      if (q.uid === uid) {
        q.text = $ev.val();
      }
    });
  })

  $('.continue-button', element).on('click', function(ev) {
    ev.preventDefault();
    if (validateQuestions()) {
      $questionsTab.addClass('hidden');
      $answersTab.removeClass('hidden');
      $(ev.currentTarget).addClass('hidden');
      $saveButton.removeClass('hidden');
      $saveButton.on('click', studioSubmit);
      renderAnswers(answers);
    }
  })

  // Answers tab
  let renderAnswers = function(answers) {
    let tplAnswers = $('#js-answers-tpl', element).html();
    $blockAnswers.html(_.template(tplAnswers)(
      {
        questions: questions,
        answers: answers,
        upperCaseAlp: upperCaseAlp,
        gettext: gettext
      }
    ));

    _.each(answers, function(a) {
      if (a.question_uid) {
        $blockAnswers.find(`input[value = ${a.question_uid}]:checkbox:not(:checked)`).attr('disabled', 'disabled');
      }
    });

    toggleAnswerDeleteButtons();
  }

  $blockAnswers.on('click', '.js-remove-answer', function(ev) {
    let uid = $(ev.currentTarget).data('uid');
    answers = _.filter(answers, function(a) { return a.uid !== uid; });
    renderAnswers(answers);
  })

  let toggleAnswerDeleteButtons = function () {
    let $removeButtons = $('.js-remove-answer', element);
    if (answers.length === questions.length) {
      $removeButtons.addClass('hidden');
    } else {
      $removeButtons.removeClass('hidden');
    }
  }

  $('.js-add-answer', element).on('click', function() {
    let maxUid = _.max(answers, function(answer){ return answer.uid; }).uid;
    answers.push({
      uid: maxUid + 1,
      text: '',
      question_uid: null,
    })
    renderAnswers(answers);
  })

  $blockAnswers.on('change', '.js-answer-text', function(ev) {
    let $ev = $(ev.currentTarget),
        uid = $ev.data('uid');
    _.each(answers, function(a) {
      if (a.uid === uid) {
        a.text = $ev.val();
      }
    });
  })

  $blockAnswers.on('change', 'input:checkbox', function(ev) {
    let $ev = $(ev.currentTarget),
        questionUid = parseInt($ev.val()),
        answerUid = $ev.data('answer-uid');
    _.each(answers, function(a) {
      if (a.uid === answerUid) {
        a.question_uid = $ev.is(':checked') ? questionUid : null;
      }
    });
    renderAnswers(answers);
  })

  let validateAnswers = function() {
    let fields = $blockAnswers.find('input.js-answer-text'),
        questionsChecked = $blockAnswers.find(`input.question-checkbox:checked`),
        success = true;
    $('.field-error', element).removeClass('field-error');

    fields.each(function(index, field) {
      let $field = $(field);
      if (!$field.val()) {
        $field.addClass('field-error');
        success = false;
      }
    });

    if (questionsChecked.length !== questions.length) {
      success = false;
      $blockAnswers.find(`input.question-checkbox:not(:checked):not(:disabled)`).addClass('field-error');
    }

    if (!success) {
      runtime.notify('error', {
        'title': gettext('There was an error with your form.'),
        'message': gettext('Please check the settings for your answers.')
      });
    }
    return success
  }

  let studioSubmit = function(ev) {
    ev.preventDefault();

    if (validateAnswers()) {
      runtime.notify('save', {state: 'start', message: gettext('Saving')});
      let data = {
        display_name: $displayNameField.val(),
        weight: $weightField.val(),
        display_option: $displayOptionField.val(),
        data: {
          questions: questions,
          answers: answers
        }
      };

      $.ajax({
        type: 'POST',
        url: handlerStudioSubmitUrl,
        data: JSON.stringify(data),
        dataType: 'json',
        global: false,  // Disable Studio's error handling that conflicts with studio's notify('save') and notify('cancel') :-/
        success: function (response) {
          runtime.notify('save', {state: 'end'});
        }
      }).fail(function (jqXHR) {
        let message = gettext('This may be happening because of an error with our server or your internet connection. Try refreshing the page or making sure you are online.');
        if (jqXHR.responseText) { // Is there a more specific error message we can show?
          try {
            message = JSON.parse(jqXHR.responseText).error;
            if (typeof message === 'object' && message.messages) {
              // e.g. {'error': {'messages': [{'text': 'Unknown user "bob"!', 'type': 'error'}, ...]}} etc.
              message = $.map(message.messages, function (msg) {
                return msg.text;
              }).join(', ');
            }
          } catch (error) {
            message = jqXHR.responseText.substr(0, 300);
          }
        }
        runtime.notify('error', {title: gettext('Unable to update settings'), message: message});
      });
    }
  };

  $('.cancel-button', element).on('click', function(ev) {
    ev.preventDefault();
    runtime.notify('cancel', {});
  });
}
