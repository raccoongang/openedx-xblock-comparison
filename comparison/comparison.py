import json

import logging
from random import sample

import pkg_resources
import six
from django.utils import translation
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.exceptions import JsonHandlerError
from xblock.fields import Float, Dict, Integer, List, Scope, String
from xblockutils.resources import ResourceLoader

from .default_data import DEFAULT_DATA
from .utils import _

log = logging.getLogger(__name__)
loader = ResourceLoader(__name__)


@XBlock.needs('i18n')
class ComparisonXBlock(XBlock):

    DISPLAY_OPTION_MIN = 'min'
    DISPLAY_OPTION_MIDDLE = 'middle'
    DISPLAY_OPTION_MAX = 'max'

    display_name = String(
        display_name=_('Display Name'),
        help=_('The display name for this comparison problem.'),
        scope=Scope.settings,
        default=_('Comparison'),
    )
    title = String(
        display_name=_('Title'),
        help=_('The title of the comparison problem. The title is displayed to learners.'),
        scope=Scope.settings,
        default='',
    )
    weight = Float(
        display_name=_('Problem Weight'),
        help=_('Defines the number of points the problem is worth.'),
        scope=Scope.settings,
        default=1,
    )
    display_option = String(
        display_name=_('Display Option'),
        scope=Scope.settings,
        values=[
            {'display_name': _('min'), 'value': DISPLAY_OPTION_MIN},
            {'display_name': _('middle'), 'value': DISPLAY_OPTION_MIDDLE},
            {'display_name': _('max'), 'value': DISPLAY_OPTION_MAX},
        ],
        default=DISPLAY_OPTION_MIN,
    )
    data = Dict(
        display_name=_('Problem data'),
        help=_(
            'Information about questions and answers for this problem. '
            'This information is derived from the input that a course author provides via the interactive editor '
            'when configuring the problem.'
        ),
        scope=Scope.content,
        default=DEFAULT_DATA,
    )

    user_answers = List(
        scope=Scope.user_state,
        default=[],
    )

    user_data = Dict(
        scope=Scope.user_state,
        default=DEFAULT_DATA,
    )

    attempts = Integer(
        help=_('Number of attempts learner used'),
        scope=Scope.user_state,
        default=0,
    )

    has_score = True
    icon_class = 'problem'

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode('utf8')

    def student_view(self, context=None):
        """
        The primary view of the ComparisonXBlock, shown to students
        when viewing courses.
        """
        context = context or {}

        questions = self.data.get('questions')
        answers = self.data.get('answers')

        if self.attempts and self.user_data:
            questions = self.user_data.get('questions')
            answers = self.user_data.get('answers')
        else:
            questions = sample(questions, k=len(questions))
            answers = sample(answers, k=len(answers))
            self.user_data = {
                'questions': questions,
                'answers': answers
            }

        context.update({
            'xblock': self,
            'questions': questions,
            'answers': answers,
        })

        fragment = Fragment()
        fragment.add_content(loader.render_django_template(
            'static/html/comparison.html',
            context=context,
            i18n_service=self.runtime.service(self, 'i18n')
        ))

        statici18n_js_url = self._get_statici18n_js_url()
        if statici18n_js_url:
            fragment.add_javascript_url(self.runtime.local_resource_url(self, statici18n_js_url))

        fragment.add_css(self.resource_string('static/css/comparison.css'))
        fragment.add_javascript(self.resource_string('static/js/src/comparison.js'))
        fragment.initialize_js(
            'ComparisonXBlock',
            {'answers': self.user_answers, 'has_deadline_passed': self.has_submission_deadline_passed}
        )
        return fragment

    def studio_view(self, context=None):
        """
        Editing view in Studio
        """
        context = context or {}

        context.update({
            'fields': self.fields,
            'self': self,
            'data': six.moves.urllib.parse.quote(json.dumps(self.data)),
        })

        fragment = Fragment()
        fragment.add_content(loader.render_django_template(
            'static/html/studio_edit.html',
            context=context,
            i18n_service=self.runtime.service(self, 'i18n')
        ))
        fragment.add_css(self.resource_string('static/css/comparison.css'))

        statici18n_js_url = self._get_statici18n_js_url()
        if statici18n_js_url:
            fragment.add_javascript_url(self.runtime.local_resource_url(self, statici18n_js_url))

        fragment.add_javascript(self.resource_string('static/js/src/studio_edit.js'))
        fragment.initialize_js(
            'ComparisonStudioEditXBlock',
            {'data': self.data}
        )
        return fragment

    @XBlock.json_handler
    def studio_submit(self, submissions, suffix=''):
        """
        Handles studio save.
        """
        self.display_name = submissions['display_name']
        self.title = submissions['title']
        self.weight = float(submissions['weight'])
        self.display_option = submissions['display_option']
        self.data = submissions['data']

        return {
            'result': 'success',
        }

    @XBlock.json_handler
    def submit_problem(self, data, suffix=''):
        """
        Checks submitted solution.
        """
        if self.has_submission_deadline_passed:
            i18n_service = self.runtime.service(self, 'i18n')
            raise JsonHandlerError(
                409,
                i18n_service.gettext('Submission deadline has passed.')
            )

        correct = 0
        user_answers = data.get('answers', [])

        for answer in user_answers:
            try:
                answer_uid = int(answer.get('answer_uid'))
                question_uid = int(answer.get('question_uid'))
            except (TypeError, ValueError):
                continue

            data_answer = list(filter(lambda a: a['uid'] == answer_uid, self.data['answers']))

            if data_answer and data_answer[0]['question_uid'] == question_uid:
                correct += 1

        self.attempts += 1
        self.user_answers = user_answers
        score = correct / len(self.data.get('questions')) * self.weight
        self.publish_grade(score)
        return {
            'result': 'success'
        }

    def publish_grade(self, score):
        self.runtime.publish(
            self,
            'grade',
            {
                'value': score,
                'max_value': self.weight,
            })

    def max_score(self):
        """
        Return the maximum score possible.
        """
        return self.weight

    @staticmethod
    def _get_statici18n_js_url():
        """
        Returns the Javascript translation file for the currently selected language, if any found by
        `pkg_resources`
        """
        lang_code = translation.get_language()

        if not lang_code:
            return

        text_js = 'public/js/translations/{lang_code}/textjs.js'
        country_code, *_ = lang_code.partition('-')

        for code in (lang_code, country_code):
            if pkg_resources.resource_exists(loader.module_name, text_js.format(lang_code=code)):
                return text_js.format(lang_code=code)

    @property
    def has_submission_deadline_passed(self):
        """
        Returns a boolean indicating if the submission is past its deadline.

        Using the `has_deadline_passed` method from InheritanceMixin which gets
        added on the LMS/Studio, return if the submission is past its due date.
        """
        return self.has_deadline_passed() if hasattr(self, 'has_deadline_passed') else False

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("ComparisonXBlock",
             """<comparison/>
             """),
            ("Multiple ComparisonXBlock",
             """<vertical_demo>
                <comparison/>
                <comparison/>
                <comparison/>
                </vertical_demo>
             """),
        ]
