/*jshint node: true, expr:true */
/*global require, describe, beforeEach, it */

require('must');
var es = require('event-stream');
var StreamToQueue = require("../lib/stream-to-queue");


describe("Streamable Queue", function () {
    "use strict";


    it("should end when input is done", function (done) {
        var count = 0;
        var taskFunc = function (task, callback) {
            count++;
            task.must.eql("task" + count);
            callback();
        };

        var testStream = StreamToQueue(taskFunc, 1);
        testStream.on('end', function () {
            count.must.eql(2);
            done();
        });

        es.readArray(["task1", "task2"]).pipe(testStream);
    });


    it("should not end data temporarily drys up", function (done) {
        var count = 0;
        var taskFunc = function (task, callback) {
            count++;
            task.must.eql("task" + count);
            callback();
        };

        var testStream = StreamToQueue(taskFunc, 1);
        testStream.on('end', function () {
            count.must.eql(2);
            done();
        });

        testStream.write("task1");
        testStream.once('drained', function () {
            testStream.write("task2");
            testStream.end();
        });
    });


    it("should emit data when processing is complete", function (done) {
        var count = 0;
        var taskFunc = function (task, callback) {
            setTimeout(function () {
                callback(null, ++count);
            }, 50);
        };

        var trackedData = 0;
        var testStream = StreamToQueue(taskFunc, 1);
        testStream.on('data', function (data) {
            (++trackedData).must.eql(data);

            if (2 === data) {
                done();
            }
        });

        es.readArray(["test1", "test2"]).pipe(testStream);
    });


    it("should end stream with data", function (done) {
        var count = 0;
        var taskFunc = function (task, callback) {
            count++;
            task.must.eql("task" + count);
            callback();
        };

        var testStream = StreamToQueue(taskFunc, 1);
        testStream.on('end', function () {
            count.must.eql(2);
            done();
        });

        var dataStream = es.through();
        dataStream.pipe(testStream);
        dataStream.write("task1");
        dataStream.end("task2");
    });


    it("should emit error when processing fails", function (done) {
        var taskFunc = function (task, callback) {
            callback("error");
        };

        var testStream = StreamToQueue(taskFunc, 1);
        testStream.on('error', function (err) {
            err.must.eql("error");
            done();
        });

        es.readArray(["test1"]).pipe(testStream);
    });


    it("should not end stream", function (done) {
        var taskFunc = function (task, callback) {
            callback();
        };

        var testStream = StreamToQueue(taskFunc, 1);
        testStream.on('end', function() {
            throw "END NOT EXPECTED";
        });

        es.readArray(["test1"]).pipe(testStream, {end: false});

        setTimeout(function () {
            done();
        }, 50);
    });
});