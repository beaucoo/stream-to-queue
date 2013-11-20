#stream-to-queue

A read/write stream that wraps an [async.queue](https://github.com/caolan/async/#queue) to easily queue up tasks.

Output order is not guaranteed to be the same as input order when the queued up tasks perform asynchronous processing.

Install via <code>npm install stream-to-queue</code>

<pre>
// Example (see tests for more):
<code>
// Create the task handling function
var taskFunc = function (task, callback) {
    doSomeWork(function(err, result) {
        if (err) return callback(err);

        callback(null, result); // Pass back the result or whatever the stream should emit out. Passing null defaults to emitting the original input.
    });
}

var concurrency = 10;
var StreamToQueue = require('stream-to-queue');
var streamToQueue = StreamToQueue(taskFunc, concurrency);

// Check out what happens
streamToQueue
    .on('error), console.log)
    .on('data), console.log)
    .on('end'), function() {
        console.log("The streamToQueue has been told to end and all given data has been processed");
    )
    .on('drained', function() {
        console.log("Queue drained i.e. out of data but stream is not closed. May be called multiple times as per async.queue");
    });

// Start the data flowing
inStream.pipe(streamToQueue).pipe(outStream);
</code>
</pre>


##Release Notes
v1.0.0 First

##Running Tests

* Run 'npm test'
* or run `mocha test --require must --reporter spec --recursive`
* or run 'make test'
* or run 'make watch' for continuous testing

##License
(The MIT License)

Copyright (c) 2013-20* BeauCoo Technologies Inc. <info@beaucoo.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

