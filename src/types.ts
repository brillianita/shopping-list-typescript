const TYPES = {
  Logger: Symbol.for("Logger"),
  Database: Symbol.for("Database"),
  Server: Symbol.for("Server"),
  HTTPRouter: Symbol.for("HTTPRouter"),

  GroceryRepository: Symbol.for("GroceryRepository"),

  // Service Layer
 GroceryService: Symbol.for("GroceryService"),
};

export { TYPES };
