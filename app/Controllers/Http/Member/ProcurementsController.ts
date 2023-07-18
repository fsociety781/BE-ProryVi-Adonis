import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";


export default class ProcurementsController {
  public async getProfile({ response, auth }: HttpContextContract) {
    const userId = auth.user?.id
    try {
      const user = await User.find(userId)
      return response.status(200).json({
        status: '200',
        message: {
          name: user?.name,
          username: user?.username,
          email: user?.email,
          nik: user?.nik,
          phone: user?.phone,
          address: user?.address,
        }
      })
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }

  public async getItems({response, auth}: HttpContextContract){
    const usersId =  auth.user?.id
    try{
      if (usersId) {
        const items = await Database.from('items').where('userId', usersId).select('*');
        const itemsId = items.map((item) => item.id);

        const history =  await Database.from('histories')
        .whereIn('itemsId', itemsId)
        .select('reason')

        if(items.length === 0){
          return response.status(404).json({
            status: '404',
            message: 'No Procurements Found'
          })
        }

        const detailItems = await Database.from('detail_items')
          .whereIn('detail_items.id', itemsId)
          .select(
            'detail_items.name as itemName',
            'detail_items.categoryId',
            'categories.name as categoryName',
            'detail_items.description',
            'detail_items.url',
            'detail_items.quantity',
            'detail_items.price',
            'detail_items.total',
            'detail_items.duedate'
          )
          .leftJoin('categories', 'detail_items.categoryId', 'categories.id');

        const data = {
          items,
          detailItems,
          history
        };

        return response.status(200).json({ status: '200', data });
      } else {
        return response.status(401).json({ status: '401', message: 'User ID not found' });
      }
    }catch(error){
      return response.status(500).json(error.message)
    }
  }

  public async getDetailItems({response, request, auth}: HttpContextContract){
    const itemId = await request.param('id')
    try{
      if (!itemId) {
        return response.status(400).json({
          status: "400",
          message: "ID params must be filled",
        });
      }

      const items = await Database.from('items').where('id', itemId).select('*')
      const itemsId =  items.map((items)=> items.id)

      const history =  await Database.from('histories')
      .whereIn('itemsId', itemsId)
      .select('reason')

      const detailItems = await Database.from("detail_items")
        .whereIn("detail_items.id", itemsId)
        .select(
          "detail_items.name as itemName",
          "detail_items.categoryId",
          "categories.name as categoryName",
          "detail_items.description",
          "detail_items.url",
          "detail_items.quantity",
          "detail_items.price",
          "detail_items.total",
          "detail_items.duedate"
        )
        .leftJoin("categories", "detail_items.categoryId", "categories.id");

        const userId = items.map((items) => items.userId);

      const users = await Database.from("users")
        .whereIn("id", userId)
        .select("name");

      const data = {
        users,
        items,
        detailItems,
        history
      };

      if(!items){
        return response.status(404).json({
          status: "404",
          message: "Item not found",
        });
      }

      const userid = items[0].userId

      if(userid !== auth.user?.id){
        return response.status(403).json({
          status: "403",
          message: "You don't have accesss to this items",
        });
      }

      return response.status(200).json({ status: "200", data });

    }catch(error){
      return response.status(500).json(error.message)
    }
  }

  public async storeItem({response, request, auth}: HttpContextContract){
    const userId = auth.user?.id
    const name = await request.input('name')
    const description = await request.input('description')
    const categoryId = await request.input('categoryId')
    const url = await request.input('url')
    const quantity = await request.input('quantity')
    const price = await request.input('price')
    const duedate = await request.input('duedate')
    try{
      if (!name || !description || !categoryId || !url || !quantity || !price || !price || !duedate ){
        return response.status(400).json({
          status: "400",
          message: "All parameter must be filled!",
        });
      }
      const dueDateTime = new Date(duedate)
      const total =  price*quantity

      const data = {
        name: name,
        description: description,
        categoryId: categoryId,
        url: url,
        quantity: quantity,
        price: price,
        total: total,
        duedate: dueDateTime
      }

      const detailItems = await Database.table('detail_items').insert(data)
      const detailItemsId = detailItems[0]

      const item = await Database.table('items').insert({
        userId: userId,
        detailId: detailItemsId
      })

      return response.status(200).json({
         status: '200',
         message: 'Item has ben succesfully sent to admin',
         data: data
        });
    }catch(error){
      return response.status(500).json(error.message)
    }
  }
}
