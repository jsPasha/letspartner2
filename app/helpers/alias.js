const locales = require("../../data/locales");

const transliterate = {
  Ё: "YO",
  Й: "I",
  Ц: "TS",
  У: "U",
  К: "K",
  Е: "E",
  Н: "N",
  Г: "G",
  Ш: "SH",
  Щ: "SCH",
  З: "Z",
  Х: "H",
  Ъ: "'",
  ё: "yo",
  й: "i",
  ц: "ts",
  у: "u",
  к: "k",
  е: "e",
  н: "n",
  г: "g",
  ш: "sh",
  щ: "sch",
  з: "z",
  х: "h",
  ъ: "'",
  Ф: "F",
  Ы: "I",
  В: "V",
  А: "a",
  П: "P",
  Р: "R",
  О: "O",
  Л: "L",
  Д: "D",
  Ж: "ZH",
  Э: "E",
  ф: "f",
  ы: "i",
  Ы: "i",
  і: "i",
  в: "v",
  а: "a",
  п: "p",
  р: "r",
  о: "o",
  л: "l",
  д: "d",
  ж: "zh",
  э: "e",
  Я: "Ya",
  Ч: "CH",
  С: "S",
  М: "M",
  И: "I",
  Т: "T",
  Ь: "'",
  Б: "B",
  Ю: "YU",
  я: "ya",
  ч: "ch",
  с: "s",
  м: "m",
  и: "i",
  т: "t",
  ь: "'",
  Ь: "'",
  б: "b",
  ю: "yu",
  " ": "_",
  "/": "_",
  "-": "_",
  ",": "_",
  ".": "_"
};

const generateAlias = (req, res, next) => {
  let name = req.body.name[locales[0]];
  req.body.alias = aliasGenerator(name);
  next();
};

const aliasGenerator = name => {
  return name
    .split("")
    .map(function(char) {
      return transliterate[char] || char;
    })
    .join("");
};

module.exports = { generateAlias, aliasGenerator };
