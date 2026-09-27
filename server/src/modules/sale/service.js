import Sale from './models/sale.js';
import SaleItem from './models/saleItem.js';
import throwError from '../../utils/throwError.js';
import Item from '../item/models/item.js';
import { Op } from 'sequelize';

/**
 * Create a sale
 *
 * @param {Object} customer
 * @param {string} customer.customerName
 * @param {string} customer.customerPhone
 * @returns {Promise<Object>} - Created sale data
 */
export async function createSale({ customerName, customerPhone }) {
    const sale = await Sale.create({
        customerName,
        customerPhone,
    });

    return {
        saleId: sale.id,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        saleDate: sale.date,
    };
}

/**
 * Retrieve list of sales
 *
 * @param {Object} options - Query paramters
 * @returns {Promise<Object>} - Paginated list of sales
 */
export async function getSales(options = {}) {
    const { search, page = 1, limit = 10 } = options;

    const offset = (page - 1) * limit;
    const where = search
        ? {
              customerName: {
                  [Op.like]: `%${search}%`,
              },
          }
        : undefined;

    const sales = await Sale.findAndCountAll({
        attributes: ['id', 'customerName', 'customerPhone', 'date'],
        where,
        offset,
        limit,
        order: [['date', 'DESC']],
    });

    return {
        page,
        limit,
        totalSales: sales.count,
        totalPages: Math.ceil(sales.count / limit),
        sales: sales.rows,
    };
}

/**
 * Retrieve the sale
 *
 * @param {string} saleId
 * @returns {Promise<Object>} - Sale data
 */
export async function getSale(saleId) {
    const sale = await Sale.findByPk(saleId, {
        include: [
            {
                model: SaleItem,
                include: [
                    {
                        model: Item,
                        attributes: ['id', 'name', 'description', 'price'],
                    },
                ],
            },
        ],
    });
    if (!sale) throwError('Sale not found', 404);

    const items = sale.SaleItems.map((saleItem) => saleItem.Item);
    const total = items.reduce((sum, item) => sum + Number(item.price), 0);

    return {
        saleId: sale.id,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        saleDate: sale.date,
        items,
        total,
    };
}

/**
 * Update sale
 *
 * @param {string} saleId
 * @param {Object} data - Sale data to be updated
 * @returns {Promise<Object>} - Updated sale data
 */
export async function updateSale(saleId, data) {
    const sale = await Sale.findByPk(saleId);
    if (!sale) throwError('Sale not found', 404);

    if (!data) throwError('No data is provided', 400);
    const { customerName, customerPhone } = data;

    const updatedData = {};
    if (customerName !== undefined) {
        updatedData.customerName = customerName;
    }
    if (customerPhone !== undefined) {
        updatedData.customerPhone = customerPhone;
    }

    await sale.update(updatedData);

    return {
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        saleDate: sale.date,
    };
}

/**
 * Delete the sale
 *
 * @param {string} saleId
 * @returns {Promise<void>}
 */
export async function deleteSale(saleId) {
    const sale = await Sale.findByPk(saleId);
    if (!sale) throwError('Sale not found', 404);

    await sale.destroy();
}

/**
 * Add item to the sale
 *
 * @param {string} saleId
 * @param {string} itemId
 * @returns {Promise<Object>} - Added item data
 */
export async function addItemToSale(saleId, itemId) {
    if (!itemId) {
        throwError('Item ID is required', 400);
    }

    const sale = await Sale.findByPk(saleId);
    if (!sale) {
        throwError('Sale not found', 404);
    }

    const item = await Item.findByPk(itemId);
    if (!item) {
        throwError('Item not found', 404);
    }

    await isItemSold(itemId);

    const saleItem = await SaleItem.create({
        itemId,
        saleId,
    });

    return {
        itemId: saleItem.itemId,
    };
}

// Helper to find if item is sold
async function isItemSold(itemId) {
    const saleItem = await SaleItem.findOne({
        where: {
            itemId,
        },
    });

    if (saleItem) {
        throwError(`Item with ID ${itemId} is already sold`, 400);
    }
}

/**
 * Delete item of the sale
 *
 * @param {string} saleId
 * @param {string} itemId
 * @returns {Promise<void>}
 */
export async function deleteItemOfSale(saleId, itemId) {
    const saleItem = await SaleItem.findOne({
        where: {
            saleId,
            itemId,
        },
    });

    if (!saleItem) throwError('Item is not added to sale', 404);

    await saleItem.destroy();
}
