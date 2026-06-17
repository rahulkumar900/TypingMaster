"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transliterate_1 = require("./src/lib/transliterate");
try {
    const engine = (0, transliterate_1.createTypingEngine)({ id: 'MANGAL_GAIL', backspaceAllowed: true });
    console.log("Engine created successfully!");
    console.log(engine.processKey('H'));
    console.log(engine.processKey('k'));
}
catch (e) {
    console.error("Error:", e);
}
