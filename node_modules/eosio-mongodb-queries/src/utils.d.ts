/**
 * Set default limit
 *
 * @param {object} [options={}] Optional Parameters
 * @returns {number} Default Limit value
 * @example
 * setDefaultLimit() //=> 25
 */
export declare function setDefaultLimit(options?: {
    limit?: number;
}): number | null;
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
export declare function addBlockFiltersToPipeline(pipeline: object[], options?: {
    block_id?: string;
    block_num?: number;
    lte_block_num?: number;
    gte_block_num?: number;
    irreversible?: boolean;
}): void;
