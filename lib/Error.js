"use strict";
exports.__esModule = true;
var NotLoadedError = /** @class */ (function () {
    function NotLoadedError(Command) {
        this.name = 'NotLoadedError';
        this.message = "Failed to load " + Command.name + ".";
    }
    return NotLoadedError;
}());
exports.NotLoadedError = NotLoadedError;
