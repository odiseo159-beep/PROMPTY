// Shim so Tailwind v4 @plugin can load @heroui/theme.
// heroui() returns { handler, config } — the Tailwind v3 plugin format.
// We re-export the heroui factory as the module default so Tailwind v4 calls it correctly.
const { heroui } = require("@heroui/theme");
module.exports = heroui;
