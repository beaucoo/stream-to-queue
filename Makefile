test:
	mocha test/* --require must --reporter spec --recursive #--grep [VALUE]

watch:
	mocha -w --require must --reporter spec --recursive #--grep [VALUE]

.PHONY: test