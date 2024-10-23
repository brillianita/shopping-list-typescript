import { IGrocery, Grocery } from "../models/grocery";

export interface GroceryRepository {
  // findAll(): Promise<Grocery[]>;
  // findById(id: string): Promise <Grocery>;
  store(grocery: IGrocery): Promise<Grocery>;
  // update(id: string, grocery: IGrocery): Promise<Grocery>;
  // destroy(id: string): Promise<boolean>;
}