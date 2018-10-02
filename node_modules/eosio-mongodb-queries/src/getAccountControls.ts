import { AggregationCursor, MongoClient } from "mongodb";
import { AccountControls } from "./types/account_controls";
import { setDefaultLimit } from "./utils";

/**
 * EOSIO MongoDB Account Controls
 *
 * @param {MongoClient} client MongoDB Client
 * @param {Object} [options={}] Optional Parameters
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
export function getAccountControls(client: MongoClient, options: {
    limit?: number,
    match?: object,
    skip?: number,
    sort?: object,
} = {}): AggregationCursor<AccountControls> {
    // Setup MongoDB collection
    const db = client.db("EOS");
    const collection = db.collection("account_controls");

    // Default optional paramters
    const limit = setDefaultLimit(options);

    // MongoDB Pipeline
    const pipeline: any = [];

    // Match by data entries
    if (options.match) { pipeline.push({$match: options.match}); }

    // Sort by ascending or decending based on attribute
    if (options.sort) { pipeline.push({$sort: options.sort}); }

    // Support Pagination using Skip & Limit
    if (options.skip) { pipeline.push({$skip: options.skip }); }
    if (limit) { pipeline.push({$limit: limit }); }

    return collection.aggregate<AccountControls>(pipeline);
}
