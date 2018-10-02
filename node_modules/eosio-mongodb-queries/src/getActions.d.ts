import { AggregationCursor, MongoClient } from "mongodb";
import { Actions } from "./types/actions";
/**
 * EOSIO MongoDB Actions
 *
 * @param {MongoClient} client MongoDB Client
 * @param {Object} [options={}] Optional Parameters
 * @param {string|Array<string>} [options.account] Filter by account contracts (eg: ["eosio","eosio.token"])
 * @param {string|Array<string>} [options.name] Filter by action names (eg: ["undelegatebw", "delegatebw"])
 * @param {number} [options.limit=25] Limit the maximum amount of of actions returned
 * @param {number} [options.skip] Skips number of documents
 * @param {object} [options.sort] Sort by ascending order (1) or descending order (-1) (eg: {block_num: -1})
 * @param {object} [options.match] Match by entries using MongoDB's $match (eg: {"data.from": "eosio"})
 * @param {string} [options.trx_id] Filter by exact Transaction Id
 * @param {boolean} [options.irreversible] Irreversible transaction (eg: true/false)
 * @param {number} [options.block_num] Filter by exact Reference Block Number
 * @param {string} [options.block_id] Filter by exact Reference Block ID
 * @param {number} [options.lte_block_num] Filter by Less-than or equal (<=) the Reference Block Number
 * @param {number} [options.gte_block_num] Filter by Greater-than or equal (>=) the Reference Block Number
 * @returns {AggregationCursor<Actions>} MongoDB Aggregation Cursor
 * @example
 * const options = {
 *     account: "eosio",
 *     name: ["delegatebw", "undelegatebw"],
 *     match: {"data.from": "eosnationftw", "data.receiver": "eosnationftw"},
 *     irreversible: true,
 *     sort: {block_num: -1}
 * };
 * const results = await getActions(client, options);
 * console.log(await results.toArray());
 */
export declare function getActions(client: MongoClient, options?: {
    account?: string | string[];
    name?: string | string[];
    match?: object;
    trx_id?: string;
    block_num?: number;
    block_id?: string;
    lte_block_num?: number;
    gte_block_num?: number;
    irreversible?: boolean;
    skip?: number;
    limit?: number;
    sort?: object;
}): AggregationCursor<Actions>;
