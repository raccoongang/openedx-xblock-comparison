# Xblock Comparison

XBlock which allows you to create comparison tests

## Installation and configuration

After this, XBlock-comparison may be installed using its setup.py, or if you prefer to use pip, running:

    $ pip install git@gitlab.raccoongang.com:hippoteam/exam/edx-xblock-comparison.git

You may specify the `-e` flag if you intend to develop on the repo.

### Setting up a course to use XBlock-comparison

To set up a course to use XBlock-comparison, first go to your course's outline page in the studio and look
for the Advanced settings link in the top menus.

Once there, look for the *Advanced Modules List* and add `"comparison"`.

Save your changes, and you may now add a xblock by clicking on the **Advanced Modules** button on the bottom of a
unit editing page and selecting `Comparison`.

## Working with Translations

For information about working with translations, see the [Internationalization Support](http://edx.readthedocs.io/projects/xblock-tutorial/en/latest/edx_platform/edx_lms.html#internationalization-support)
section of the [Open edX XBlock Tutorial](https://xblock-tutorial.readthedocs.io/en/latest/).

```bash
$ make extract_translations
```

Note that this command generates `django.po` and `djangojs.po` which is supposed to contain
all translatable strings. Add translations for strings.

```bash
$ make compile_translations
```

If everything is correct, it will create `translations/en/LC_MESSAGES/text.mo` and `public/js/translations/en/textjs.js` files.
