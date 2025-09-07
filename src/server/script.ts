import fs from "node:fs";
import { minifyContractRouter } from "@orpc/contract";

import { router } from "./router";

/**
 * This script generates a minified contract.json file from the router definition.
 * The contract.json file is used for client-side type safety and validation.
 * Run this script as part of your build process to keep the contract up-to-date.
 */

const minifiedRouter = minifyContractRouter(router);

fs.writeFileSync("./contract.json", JSON.stringify(minifiedRouter));


