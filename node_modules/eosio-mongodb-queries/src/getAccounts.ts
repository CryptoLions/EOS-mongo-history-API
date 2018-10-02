import { AggregationCursor, MongoClient } from "mongodb";
import { Accounts } from "./types/accounts";
import { setDefaultLimit } from "./utils";

/**
 * EOSIO MongoDB Accounts
 *
 * @param {MongoClient} client MongoDB Client
 * @param {Object} [options={}] Optional Parameters
 * @param {boolean} [options.abi] Does abi exist (eg: true/false)
 * @param {number} [options.limit=25] Limit the maximum amount of of actions returned
 * @param {object} [options.sort] Sort by ascending order (1) or descending order (-1) (eg: {controlled_account: -1})
 * @param {number} [options.skip] Skips number of documents
 * @param {object} [options.match] Match by entries (eg: {controlled_account: "eosio.saving"})
 * @returns {AggregationCursor<AccountControls>} MongoDB Aggregation Cursor
 * @example
 * const options = {
 *     match: {controlled_account: "eosio.saving"},
 * };
 * const results = await getAccounControls(client, options);
 * console.log(await results.toArray());
 */
export function getAccounts(client: MongoClient, options: {
    abi?: boolean,
    limit?: number,
    match?: object,
    skip?: number,
    sort?: object,
} = {}): AggregationCursor<Accounts> {
    // Setup MongoDB collection
    const db = client.db("EOS");
    const collection = db.collection("accounts");

    // Default optional paramters
    const limit = setDefaultLimit(options);

    // MongoDB Pipeline
    const pipeline: any = [];

    // Match by data entries
    if (options.match) { pipeline.push({$match: options.match}); }

    // Match if ABI exists or not
    if (options.abi) { pipeline.push({$match: {abi: {$exists: options.abi}}}); }

    // Sort by ascending or decending based on attribute
    if (options.sort) { pipeline.push({$sort: options.sort}); }

    // Support Pagination using Skip & Limit
    if (options.skip) { pipeline.push({$skip: options.skip }); }
    if (limit) { pipeline.push({$limit: limit }); }

    return collection.aggregate<Accounts>(pipeline);
}
