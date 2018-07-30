const { aliasGenerator } = require("./alias");

test("should generate right alias", () => {
  const name = [
    {
      val: "Привет",
      toBe: "Privet"
	 },
	 {
      val: "Проверка алиаса 4",
      toBe: "Proverka_aliasa_4"
	 },
	 {
      val: "_ -ёa",
      toBe: "___yoa"
	 }
  ];
  name.forEach(el => {
    expect(aliasGenerator(el.val)).toBe(el.toBe);
  });
});
