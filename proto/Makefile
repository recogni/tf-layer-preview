.PHONY: build

all: js python

clean:
	rm -rf gen/py
	rm -rf gen/js

build:
	mkdir -p gen/py gen/js
	touch gen/py/__init__.py

js: build
	protoc -I=. --js_out=import_style=commonjs,binary:gen/js *.proto

python: build
	protoc -I=. --python_out=gen/py *.proto

install: all
	sudo python setup.py install
	mkdir -p ../preview-app/src/proto
	(echo "/* eslint-disable */" && cat gen/js/preview_pb.js) > ../preview-app/src/proto/preview_pb.js
