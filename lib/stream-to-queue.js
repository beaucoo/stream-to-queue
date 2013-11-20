/*jshint node: true, expr:true */
/*global module, require, __dirname, process */


var through = require('through');
var async = require('async');


module.exports = function create(taskFunc, concurrency) {
    "use strict";

    var queuedCount = 0;
    var handledCount = 0;
    var drained = false;
    var ended = false;
    var q = async.queue(taskFunc, concurrency);


    function done() {
        if (ended && drained && queuedCount === handledCount) {
            drained = ended = false; // Avoid repeated calls
            stream.emit('end');
        }
    }


    var stream = through(
        function write(data) {
            queuedCount++;
            drained = false;

            q.push(data, function (err, modifiedData) {
                if (err) {
                    return stream.emit('error', err);
                }

                stream.emit('data', modifiedData || data);

                handledCount++;
                done();
            });
        },
        function end(data) {
            if (data) {
                write(data);
            }

            ended = true;
            done();
        }
    );


    q.drain = function () {
        drained = true;
        stream.emit('drained');
        done();
    };


    return stream;
};