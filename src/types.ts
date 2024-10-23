const TYPES = {
  Logger: Symbol.for("Logger"),
  Database: Symbol.for("Database"),
  Server: Symbol.for("Server"),
  HTTPRouter: Symbol.for("HTTPRouter"),

  GroceryRepository: Symbol.for("GroceryRepository"),
  ReceiptRepository: Symbol.for("ReceiptRepository"),

  // Service Layer
 GroceryService: Symbol.for("GroceryService"),
 ReceiptService: Symbol.for("ReceiptService"),
};

export { TYPES };
