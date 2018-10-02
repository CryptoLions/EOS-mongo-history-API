import { AggregationCursor, MongoClient } from "mongodb";
import { Blocks } from "./types/blocks";
/**
 * EOSIO MongoDB Blocks
 *
 * @param {MongoClient} client MongoDB Client
 * @param {Object} [options={}] Optional Parameters
 * @param {number} [options.limit=25] Limit the maximum amount of of actions returned
 * @param {number} [options.skip] Skips number of documents
 * @param {object} [options.sort] Sort by ascending order (1) or descending order (-1) (eg: {block_num: -1})
 * @param {object} [options.match] Match by entries (eg: {"block.producer": "eosio"})
 * @param {number} [options.block_num] Filter by exact Reference Block Number
 * @param {string} [options.block_id] Filter by exact Reference Block ID
 * @param {number} [options.lte_block_num] Filter by Less-than or equal (<=) the Reference Block Number
 * @param {number} [options.gte_block_num] Filter by Greater-than or equal (>=) the Reference Block Number
 * @returns {AggregationCursor<Blocks>} MongoDB Aggregation Cursor
 * @example
 * const options = {
 *     match: {"block.producer": "eosnationftw"},
 *     sort: {block_num: -1}
 * };
 * const results = await getBlocks(client, options);
 * console.log(await results.toArray());
 */
export declare function getBlocks(client: MongoClient, options?: {
    match?: object;
    block_num?: number;
    block_id?: string;
    lte_block_num?: number;
    gte_block_num?: number;
    skip?: number;
    limit?: number;
    sort?: object;
}): AggregationCursor<Blocks>;
