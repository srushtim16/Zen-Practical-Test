const { sequelize, InvoiceMaster, InvoiceDetail, ProductMaster } = require('../models');

// Get the next invoice number
exports.getNextInvoiceNo = async (req, res) => {
  try {
    const lastInvoice = await InvoiceMaster.findOne({
      order: [['Invoice_no', 'DESC']],
      attributes: ['Invoice_no']
    });

    const nextInvoiceNo = lastInvoice ? lastInvoice.Invoice_no + 1 : 1;

    res.status(200).json({
      success: true,
      data: {
        nextInvoiceNo
      }
    });
  } catch (error) {
    console.error('Error getting next invoice no:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to determine next invoice number',
      error: error.message
    });
  }
};

// Create a new Invoice with Invoice_Detail items in a transaction
exports.createInvoice = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { CustomerName, items } = req.body;

    // Validations
    if (!CustomerName || typeof CustomerName !== 'string' || CustomerName.trim() === '') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Customer Name is required.'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please add at least one product before submitting.'
      });
    }

    // Determine last Invoice_no
    const lastInvoice = await InvoiceMaster.findOne({
      order: [['Invoice_no', 'DESC']],
      attributes: ['Invoice_no'],
      transaction: t,
      lock: true
    });

    const invoiceNo = lastInvoice ? lastInvoice.Invoice_no + 1 : 1;
    const invoiceDate = new Date();

    // Validate and calculate totals for all items
    let grandTotal = 0;
    const validatedItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const productId = Number(item.Product_Id);
      const rate = Number(item.Rate);
      const unit = String(item.Unit || '').trim();
      const qty = Number(item.Qty);
      const discPercentage = Number(item.Disc_Percentage) || 0;

      if (!productId || isNaN(productId)) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Invalid product at item #${i + 1}.`
        });
      }

      if (isNaN(rate) || rate <= 0) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Rate must be greater than zero for item #${i + 1}.`
        });
      }

      if (isNaN(qty) || qty <= 0) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Quantity must be greater than zero for item #${i + 1}.`
        });
      }

      if (isNaN(discPercentage) || discPercentage < 0 || discPercentage > 100) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Discount % must be between 0 and 100 for item #${i + 1}.`
        });
      }

      // Calculations as per requirements:
      // Net Amount = Rate - (Disc% of Rate)
      const discountAmount = (rate * discPercentage) / 100;
      const netAmount = Number((rate - discountAmount).toFixed(2));

      // Total Amount = Net Amount * Qty
      const totalAmount = Number((netAmount * qty).toFixed(2));

      grandTotal += totalAmount;

      validatedItems.push({
        Product_Id: productId,
        Rate: rate,
        Unit: unit,
        Qty: qty,
        Disc_Percentage: discPercentage,
        NetAmount: netAmount,
        TotalAmount: totalAmount
      });
    }

    grandTotal = Number(grandTotal.toFixed(2));

    // 1. Create Invoice_Master
    const invoiceMaster = await InvoiceMaster.create({
      Invoice_no: invoiceNo,
      Invoice_Date: invoiceDate,
      CustomerName: CustomerName.trim(),
      TotalAmount: grandTotal
    }, { transaction: t });

    // 2. Prepare and bulk create Invoice_Detail
    const detailRecords = validatedItems.map(item => ({
      Invoice_Id: invoiceMaster.Invoice_Id,
      Product_Id: item.Product_Id,
      Rate: item.Rate,
      Unit: item.Unit,
      Qty: item.Qty,
      Disc_Percentage: item.Disc_Percentage,
      NetAmount: item.NetAmount,
      TotalAmount: item.TotalAmount
    }));

    await InvoiceDetail.bulkCreate(detailRecords, { transaction: t });

    // Commit Transaction
    await t.commit();

    // Fetch the complete invoice with associations
    const completeInvoice = await InvoiceMaster.findByPk(invoiceMaster.Invoice_Id, {
      include: [
        {
          model: InvoiceDetail,
          as: 'details',
          include: [
            {
              model: ProductMaster,
              as: 'product',
              attributes: ['Product_Name']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully!',
      data: completeInvoice
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save invoice',
      error: error.message
    });
  }
};

// Get all invoices (history)
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceMaster.findAll({
      order: [['Invoice_no', 'DESC']],
      include: [
        {
          model: InvoiceDetail,
          as: 'details',
          include: [
            {
              model: ProductMaster,
              as: 'product',
              attributes: ['Product_Name']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
};

