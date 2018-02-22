module.exports = {
  Role_Customer: {
    dataSource: 'db',
    public: true
  },
  Role_Member: {
    dataSource: 'db',
    public: true
  },
  Member_Order: {
    dataSource: 'db',
    public: false
  },
  Member_Topup: {
    dataSource: 'db',
    public: false
  },
  Order_Item: {
    dataSource: false,
    public: false
  },
  Order_Event: {
    dataSource: 'db',
    public: false
  },
  Order_Treasure: {
    dataSource: 'db',
    public: false
  },
  Order_Garden: {
    dataSource: 'db',
    public: false
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
