import { isNullOrUndefined } from "util";

/**
 * Set default limit
 *
 * @param {object} [options={}] Optional Parameters
 * @returns {number} Default Limit value
 * @example
 * setDefaultLimit() //=> 25
 */
export function setDefaultLimit(options: {limit?: number} = {}) {
    return isNullOrUndefined(options.limit) ? 25 :
        (options.limit === Infinity || options.limit === -1) ? null : options.limit;
}

/**
 * Add Block Filters to Pipeline
 *
 * @param {object[]} pipeline MongoDB Pipeline
 * @param {object} [options={}] Optional Parameters
 * @param {boolean} [options.irreversible] Irreversible transaction (eg: true/false)
 * @param {number} [options.block_num] Filter by exact Reference Block Number
 * @param {string} [options.block_id] Filter by exact Reference Block ID
 * @param {number} [options.lte_block_num] Filter by Less-than or equal (<=) the Reference Block Number
 * @param {number} [options.gte_block_num] Filter by Greater-than or equal (>=) the Reference Block Number
 * @returns {void} Appends results to pipeline
 */
export function addBlockFiltersToPipeline(pipeline: object[], options: {
    block_id?: string,
    block_num?: number,
    lte_block_num?: number,
    gte_block_num?: number,
    irreversible?: boolean,
} = {}) {
    const {block_id, block_num, lte_block_num, gte_block_num, irreversible} = options;

    // Irreversible
    if (irreversible) { pipeline.push({$match: { irreversible }}); }

    // Block ID
    if (block_id) { pipeline.push({$match: { block_id }}); }

    // Block Number
    if (!isNullOrUndefined(block_num)) { pipeline.push({$match: { block_num }}); }

    // Both greater & lesser Block Number
    if (!isNullOrUndefined(lte_block_num) && !isNullOrUndefined(gte_block_num)) {
        pipeline.push({$match: { block_num: {$lte: lte_block_num, $gte: gte_block_num }}});
    } else {
        if (!isNullOrUndefined(lte_block_num)) { pipeline.push({$match: { block_num: {$lte: lte_block_num }}}); }
        if (!isNullOrUndefined(gte_block_num)) { pipeline.push({$match: { block_num: {$gte: gte_block_num }}}); }
    }
}
