import { writeFileSync } from "node:fs";

const WIDTH = 53;
const HEIGHT = 7;
const GAP = "....";
const LETTERS = {
  P: [
    "11111100",
    "10000110",
    "10000010",
    "10000110",
    "11111100",
    "10000000",
    "10000000",
  ],
  e: [
    "0111100",
    "1000010",
    "1000000",
    "1111110",
    "1000000",
    "1000010",
    "0111100",
  ],
  p: [
    "11111100",
    "10000110",
    "10000010",
    "11111100",
    "10000000",
    "10000000",
    "10000000",
  ],
  s: [
    "0111110",
    "1000000",
    "1000000",
    "0111100",
    "0000010",
    "0000010",
    "1111100",
  ],
  i: [
    "111",
    "010",
    "010",
    "010",
    "010",
    "010",
    "111",
  ],
};

const letters = [..."Pepsi"].map((letter) => LETTERS[letter]);
const wordWidth = letters.reduce((sum, rows) => sum + rows[0].length, 0) + GAP.length * (letters.length - 1);
const left = Math.floor((WIDTH - wordWidth) / 2);
const right = WIDTH - wordWidth - left;

const art = Array.from({ length: HEIGHT }, (_, row) =>
  ".".repeat(left) + letters.map((rows) => rows[row]).join(GAP) + ".".repeat(right),
);

const start = Date.UTC(2025, 0, 5);
const days = [];
for (let x = 0; x < WIDTH; x += 1) {
  for (let y = 0; y < HEIGHT; y += 1) {
    const active = art[y][x] === "1";
    days.push({
      date: new Date(start + (x * HEIGHT + y) * 86400000).toISOString().slice(0, 10),
      count: active ? 4 : 0,
      level: active ? 4 : 0,
    });
  }
}

const output = process.argv[2] ?? ".contriboom-input.json";
writeFileSync(output, `${JSON.stringify(days, null, 2)}\n`);
console.log(`Wrote ${days.length} days to ${output}; ${days.filter((day) => day.level > 0).length} active blocks.`);