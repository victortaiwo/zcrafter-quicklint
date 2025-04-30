import { IImperativeConfig } from "@zowe/imperative";

const config: IImperativeConfig = {
  name: "zcrafter-quicklint",
  productDisplayName: "ZCrafter QuickLint",
  rootCommandDescription:
    "Lint COBOL data-set members on z/OS with ChatGPT.",
  commandModuleGlobs: ["**/cli/*/*.definition!(.d).*s"]
};

export = config;
