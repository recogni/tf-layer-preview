
test:
	@python -m unittest discover -s . -p '*_test.py'

lint:
	@flake8 --ignore=E221,E241,E721 *.py

app:
	(cd preview-app && npm run-script build)

serve:
	(cd preview-app && npm run-script start)

proto-build:
	(cd proto && make)

proto-install: proto-build
	(cd proto && make install)


clean:
	(cd proto && make clean)

lib-install:
	sudo python setup.py install

install: lib-install proto-install

.PHONY: test lint serve install
