import degit from "degit";

const repo = degit("Muttley/foundryvtt-shadowdark/system/packs", {
  verbose: true,
});

repo.on("info", (info) => {
  console.log(info.message);
});

await repo.clone("./tmp");
