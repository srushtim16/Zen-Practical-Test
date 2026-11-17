import React, { useState, useEffect } from 'react';
import { getInvoices } from '../services/api';

const InvoiceListModal = ({ isOpen, onClose, refreshTrigger }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen, refreshTrigger]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getInvoices();
      if (res && res.data) {
        setInvoices(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title font-weight-bold">
              Saved Invoices History (Database Records)
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Loading invoices from database...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No invoices found in database yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Invoice No</th>
                      <th>Invoice Date</th>
                      <th>Customer Name</th>
                      <th>Items Count</th>
                      <th className="text-end">Total Amount</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <React.Fragment key={inv.Invoice_Id}>
                        <tr>
                          <td>
                            <strong>#{inv.Invoice_no}</strong>
                          </td>
                          <td>{inv.Invoice_Date}</td>
                          <td>{inv.CustomerName}</td>
                          <td>{inv.details?.length || 0} item(s)</td>
                          <td className="text-end">
                            <strong>Rs. {parseFloat(inv.TotalAmount).toFixed(2)}</strong>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                setSelectedInvoice(
                                  selectedInvoice?.Invoice_Id === inv.Invoice_Id ? null : inv
                                )
                              }
                            >
                              {selectedInvoice?.Invoice_Id === inv.Invoice_Id
                                ? 'Hide Details'
                                : 'View Details'}
                            </button>
                          </td>
                        </tr>

                        {selectedInvoice?.Invoice_Id === inv.Invoice_Id && (
                          <tr>
                            <td colSpan="6" className="bg-light p-3">
                              <h6 className="mb-2">
                                <strong>Invoice #{inv.Invoice_no} Line Items (Invoice_Detail Table)</strong>
                              </h6>
                              <table className="table table-sm table-bordered bg-white mb-0">
                                <thead>
                                  <tr>
                                    <th>Product</th>
                                    <th>Rate</th>
                                    <th>Unit</th>
                                    <th>Qty</th>
                                    <th>Disc%</th>
                                    <th>Net Amount</th>
                                    <th>Total Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {inv.details?.map((d) => (
                                    <tr key={d.InvoiceDetail_Id}>
                                      <td>{d.product?.Product_Name || `Product #${d.Product_Id}`}</td>
                                      <td>{parseFloat(d.Rate).toFixed(2)}</td>
                                      <td>{d.Unit}</td>
                                      <td>{parseFloat(d.Qty).toFixed(2)}</td>
                                      <td>{parseFloat(d.Disc_Percentage).toFixed(2)}%</td>
                                      <td>Rs. {parseFloat(d.NetAmount).toFixed(2)}</td>
                                      <td>Rs. {parseFloat(d.TotalAmount).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceListModal;

