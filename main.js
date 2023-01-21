import * as DDG from "duck-duck-scrape"
import { readFile, writeFile } from "fs/promises";
import ora from "ora";
import psl from "psl";

const options = {
  safeSearch: DDG.SafeSearchType.OFF,
	locale: "de",
	region: "de",
	marketRegion: "de"
};

let spinner = ora("Loading files...");

const rootSearches = (await readFile("queries.txt", { encoding: "utf-8" })).replaceAll("\r", "").split("\n");
const whitelist = (await readFile("whitelist.txt", { encoding: "utf-8" })).replaceAll("\r", "").split("\n");

spinner.succeed();

const origins = [];

for(const root of rootSearches) {
	//console.log("Searching root " + root);
	spinner = ora("Searching root \"" + root + "\"");
	const searchResults = await DDG.search(root, options);

	if(searchResults.noResults) continue;

	origins.push(...searchResults.results.map(result => new URL(result.url).hostname).filter(origin => !whitelist.includes(origin)));
	
	spinner.succeed();
	
	if(searchResults.related) {
		for(const related of searchResults.related) {
			//console.log("Searching sub " + related.text);
			spinner = ora({ text: "Searching sub \"" + related.text + "\"", indent: 1 })
			const results = await DDG.search(related.text, options);
			if(results.noResults) continue;
			origins.push(...results.results.map(result => new URL(result.url).hostname).filter(origin => !whitelist.includes(origin)));
			spinner.succeed();
		}
	}
	await new Promise(resolve => setTimeout(resolve, 1000));
}

const uniqueOrigins = [...new Set(origins)];

spinner = ora("Writing results...");
await writeFile("origins.txt", uniqueOrigins.join("\n"));
spinner.succeed();

spinner = ora("Creating adguard blocklist...");

const agList = [];

for(const or of uniqueOrigins) {
	agList.push("||" + psl.get(or) + "^");
}

await writeFile("adguard.txt", agList.join("\n"));

spinner.succeed();