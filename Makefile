langs := en uk

extract_translations: ## extract strings to be translated, outputting .po files

	# Extract Python and Django template strings
	$(foreach var,$(langs),mkdir -p comparison/locale/$(var)/LC_MESSAGES/;)
	python manage.py makemessages --ignore="*/css/*" --ignore="*/translations/*"
	python manage.py makemessages --ignore="*/css/*" --ignore="*/translations/*" --domain=djangojs


compile_translations: ## compile translation files, outputting .mo files for each supported language

	$(foreach var,$(langs),cp comparison/locale/$(var)/LC_MESSAGES/django.po comparison/locale/$(var)/LC_MESSAGES/text.po;)
	$(foreach var,$(langs),cp comparison/locale/$(var)/LC_MESSAGES/djangojs.po comparison/locale/$(var)/LC_MESSAGES/textjs.po;)
	i18n_tool generate --config=comparison/locale/config.yaml
	python manage.py compilejsi18n