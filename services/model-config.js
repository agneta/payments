module.exports = {
  Role_Customer: {
    dataSource: 'db',
    public: true
  },
  Payment_Receipt: {
    dataSource: 'db',
    public: false
  },
  Payment_Receipt_Item: {
    dataSource: 'transient',
    public: false
  }
};
