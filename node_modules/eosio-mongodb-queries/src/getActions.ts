import { AggregationCursor, MongoClient } from "mongodb";
import { Actions } from "./types/actions";
import { addBlockFiltersToPipeline, setDefaultLimit } from "./utils";

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
export function getActions(client: MongoClient, options: {
    account?: string|string[],
    name?: string|string[],
    match?: object,
    trx_id?: string,
    block_num?: number,
    block_id?: string,
    lte_block_num?: number,
    gte_block_num?: number,
    irreversible?: boolean,
    skip?: number,
    limit?: number,
    sort?: object,
} = {}): AggregationCursor<Actions> {
    // Setup MongoDB collection
    const db = client.db("EOS");
    const collection = db.collection("actions");

    // Default optional paramters
    const limit = setDefaultLimit(options);

    // Convert (string|string[]) => string[]
    const names: string[] = Array.isArray(options.name) ? options.name : options.name ? [options.name] : [];
    const accounts: string[] = Array.isArray(options.account) ? options.account : options.account ? [options.account] : [];

    // MongoDB Pipeline
    const pipeline: object[] = [];

    // Filter by Transaction ID
    if (options.trx_id) { pipeline.push({$match: { trx_id: options.trx_id }}); }

    // Filter account contracts
    // eg: ["eosio", "eosio.token"]
    if (accounts.length) {
        pipeline.push({
            $match: {
                $or: accounts.map((account) => {
                    return { account };
                }),
            },
        });
    }

    // Filter action names
    // eg: ["delegatebw", "undelegatebw"]
    if (names.length) {
        pipeline.push({
            $match: {
                $or: names.map((name) => {
                    return { name };
                }),
            },
        });
    }

    // Match by data entries
    // options.match //=> {"data.from": "eosio"}
    if (options.match) { pipeline.push({$match: options.match}); }

    // Get Reference Block Number from Transaction Id
    pipeline.push({
        $graphLookup: {
            from: "transactions",
            startWith: "$trx_id",
            connectFromField: "trx_id",
            connectToField: "trx_id",
            as: "transactions",
            // maxDepth: 2,
            // restrictSearchWithMatch: { "transactions.irreversible": true },
        },
    });

    // Add block_num + block_id and other fields
    pipeline.push({
        $project: {
            // actions
            _id: 1,
            action_num: 1,
            trx_id: 1,
            cfa: 1,
            account: 1,
            name: 1,
            authorization: 1,
            data: 1,
            // join transactions
            irreversible: { $arrayElemAt: [ "$transactions.irreversible", 0 ] },
            transaction_header: { $arrayElemAt: [ "$transactions.transaction_header", 0 ] },
            signing_keys: { $arrayElemAt: [ "$transactions.signing_keys", 0 ] },
            signatures: { $arrayElemAt: [ "$transactions.signatures", 0 ] },
            block_id: { $arrayElemAt: [ "$transactions.block_id", 0 ] },
            block_num: { $arrayElemAt: [ "$transactions.block_num", 0 ] },
        },
    });

    // Add block filters to Pipeline
    addBlockFiltersToPipeline(pipeline, options);

    // Sort by ascending or decending based on attribute
    // options.sort //=> {block_num: -1}
    // options.sort //=> {"data.from": -1}
    if (options.sort) { pipeline.push({$sort: options.sort}); }

    // Support Pagination using Skip & Limit
    if (options.skip) { pipeline.push({$skip: options.skip }); }
    if (limit) { pipeline.push({$limit: limit }); }

    return collection.aggregate<Actions>(pipeline);
}
