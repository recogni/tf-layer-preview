
test:
	@python -m unittest discover -s . -p '*_test.py'

lint:
	@flake8 --ignore=E221,E241,E721 *.py

app:
	(cd preview-app && npm run-script build)

serve:
	(cd preview-app && npm run-script start)

.PHONY: init test
