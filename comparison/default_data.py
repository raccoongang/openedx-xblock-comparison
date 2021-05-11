""" Default data for Comparison XBlock """
from .utils import _


DEFAULT_DATA = {
    "questions": [
        {
            "uid": 1,
            "text": _("question 1"),
        },
        {
            "uid": 2,
            "text": _("question 2"),
        },
        {
            "uid": 3,
            "text": _("question 3"),
        },
        {
            "uid": 4,
            "text": _("question 4"),
        },
    ],
    "answers": [
        {
            "uid": 1,
            "text": _("answer 1"),
            "question_uid": 1
        },
        {
            "uid": 2,
            "text": _("answer 2"),
            "question_uid": 2
        },
        {
            "uid": 3,
            "text": _("answer 3"),
            "question_uid": 3
        },
        {
            "uid": 4,
            "text": _("answer 4"),
            "question_uid": 4
        },
        {
            "uid": 5,
            "text": _("answer 5"),
            "question_uid": None
        },
        {
            "uid": 6,
            "text": _("answer 6"),
            "question_uid": None
        },
    ],
}
