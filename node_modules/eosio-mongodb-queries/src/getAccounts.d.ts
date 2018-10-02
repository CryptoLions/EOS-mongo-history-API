import { AggregationCursor, MongoClient } from "mongodb";
import { Accounts } from "./types/accounts";
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
export declare function getAccounts(client: MongoClient, options?: {
    abi?: boolean;
    limit?: number;
    match?: object;
    skip?: number;
    sort?: object;
}): AggregationCursor<Accounts>;
