const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const PATHS_BLOCK = /^paths:[ \t]*\r?\n((?:[ \t]*-[ \t]*.+(?:\r?\n|$))+)/m;

export const parseRulePaths = (content) => {
  const frontmatter = FRONTMATTER.exec(content);
  if (!frontmatter) return [];

  const block = PATHS_BLOCK.exec(frontmatter[1]);
  if (!block) return [];

  return block[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) =>
      line
        .slice(1)
        .trim()
        .replace(/^["']|["']$/g, ""),
    )
    .filter((glob) => glob.length > 0);
};

export const globToRegExp = (glob) => {
  let source = "";
  let braceDepth = 0;

  for (let i = 0; i < glob.length; i += 1) {
    const char = glob[i];

    if (char === "{") {
      source += "(?:";
      braceDepth += 1;
      continue;
    }

    if (char === "}" && braceDepth > 0) {
      source += ")";
      braceDepth -= 1;
      continue;
    }

    if (char === "," && braceDepth > 0) {
      source += "|";
      continue;
    }

    if (char === "*") {
      if (glob[i + 1] === "*") {
        if (glob[i + 2] === "/") {
          source += "(?:[^/]+/)*";
          i += 2;
        } else {
          source += ".*";
          i += 1;
        }
      } else {
        source += "[^/]*";
      }
      continue;
    }

    if (char === "?") {
      source += "[^/]";
      continue;
    }

    source += char.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }

  return new RegExp(`^${source}$`);
};

export const matchesAnyGlob = ({ relativePath, globs }) =>
  globs.some((glob) => globToRegExp(glob).test(relativePath));

export const rulesForPath = ({ relativePath, rules }) =>
  rules.filter(
    (rule) =>
      rule.globs.length > 0 &&
      matchesAnyGlob({ relativePath, globs: rule.globs }),
  );
