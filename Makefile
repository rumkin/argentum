BIN=./node_modules/.bin

lib-cov: clean-cov
	$(BIN)/istanbul instrument --output lib-cov --no-compact --variable global.__coverage__ src

clean-cov:
	rm -rf lib-cov

clean-cov-report:
	rm -rf html-report

cov: lib-cov
	COVER=1 $(BIN)/mocha --reporter mocha-istanbul "test/*.spec.js"

.PHONY: test
test:
	$(BIN)/istanbul cover $(BIN)/_mocha "test/*.spec.js"

clean: clean-cov clean-cov-report

.PHONY: coveralls
coveralls:
	npm run coveralls
