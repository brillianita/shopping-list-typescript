import { Receipt, ReceiptGroceries } from "../../infrastructure/database/models/receipt";
import { Grocery } from "../../infrastructure/database/models/grocery";
import { Op } from "sequelize";

interface IReceipt {
  id?: string;
  name: string;
  groceries: { id: string; quantity: number }[]; 
}

export class ReceiptSequelizeRepository {
  public async create(props: IReceipt): Promise<Receipt> {
    const { groceries, ...receiptProps } = props;
    const gcrs = await Grocery.findAll({where:{id:{[Op.in]:groceries.map(el => el.id)}}})
    const hashMap : {[key:string]:{model:Grocery, quantity:number}} = {}
    gcrs.forEach(el => {
      if(!hashMap[el.id]){
        hashMap[el.id] = {model:el,quantity:0}
      }
    })
    groceries.forEach(el =>{
      hashMap[el.id].quantity = el.quantity
    })

    const newGrocery = Object.entries(hashMap).map(([key,value])=>{
      return {
        model:value.model,
        quantity:value.quantity
      }
    })
    //validasi untuk grocery//

    // ===================== //
    const receipt = await Receipt.create(receiptProps);
    await Promise.all([...newGrocery].map(grocery => receipt.addGrocery(grocery.model,{through:{quantity:grocery.quantity}})))
    return receipt;
  }

  // public async getAll(): Promise<Receipt[]> {
  //   return await Receipt.findAll({
  //     include: Grocery, // Including groceries
  //   });
  // }

  public async getAll(): Promise<any[]> {
    const receipts = await Receipt.findAll({
      include: [
        {
          model: Grocery,
          through: { attributes: ['quantity'] }
        }
      ]
    });


    const formattedReceipts = receipts.map(receipt => ({
      id: receipt.id,
      name: receipt.name,
      createdAt: receipt.createdAt,
      updatedAt: receipt.updatedAt,
      Groceries: receipt.Groceries ? receipt.Groceries.map(grocery => ({
        id: grocery.id,
        name: grocery.name,
        unit: grocery.unit,
        price: grocery.price,
        quantity: (grocery as any).ReceiptGroceries.quantity 
      })) : []
    }));

    return formattedReceipts;
  }

  public async getById(id: string): Promise<Receipt | null> {
    return await Receipt.findByPk(id, {
      include: Grocery, 
    });
  }

  public async update(id: string, props: Partial<IReceipt>): Promise<[number, Receipt[]]> {
    const { groceries, ...receiptProps } = props;

    const updatedReceipt = await Receipt.update(receiptProps, {
      where: { id },
      returning: true
    });

    // If groceries array is provided, update the groceries in the pivot table
    if (groceries && groceries.length) {

      await ReceiptGroceries.destroy({ where: { ReceiptId: id } });

      // Then, add the new groceries
      for (const grocery of groceries) {
        await ReceiptGroceries.create({
          ReceiptId: id,
          GroceryId: grocery.id,
          quantity: grocery.quantity,
        });
      }
    }

    return updatedReceipt;
  }

  public async delete(id: string): Promise<number> {
    await ReceiptGroceries.destroy({ where: { ReceiptId: id } });
    return await Receipt.destroy({ where: { id } });
  }
}
