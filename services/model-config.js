module.exports = {
  Role_Customer: {
    dataSource: 'db',
    public: true
  },
  Payment_Invoice: {
    dataSource: 'db',
    public: false
  },
  Payment_Invoice_Item: {
    dataSource: 'transient',
    public: false
  }
};
