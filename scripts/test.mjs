import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const failures = [];

function check(ok, message) {
  if (!ok) failures.push(message);
}

check(html.includes("Suple Vitae"), "o nome visível precisa ser Suple Vitae");
check(!html.includes("Supla"), "o nome antigo Supla não pode aparecer");
check(!html.includes("R$"), "a página não pode mostrar preços");
check(html.includes('src="images/logo.png"'), "o logo da empresa precisa estar na página");
check(html.includes("images/logo.png"), "o favicon precisa usar o logo");
check(existsSync(join(root, "images/logo.png")), "images/logo.png precisa existir");

for (const match of html.matchAll(/(?:src|href)="(images\/[^"]+)"/g)) {
  check(existsSync(join(root, match[1])), `arquivo ausente: ${match[1]}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("ok");
