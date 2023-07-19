import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class ProcurementsController {
  public async getItem({ response, request }: HttpContextContract) {
    const search =  request.input('request')
    const categoryId = request.input('categoryId')
    const status  = request.input('status')

    const page = request.input('page', 1)
    const limit = 10
    const offset =  (page - 1) * limit

    const allowedStatus = ["Onprocces", "Approve", "Reject"];
    try {

      let whereCondition = {}
      let statusCondition = "get all";

      if (search && categoryId) {
        whereCondition = {
          "detail_items.name": { $like: `%${search}%` },
          "detail_items.categoryId": categoryId
        };
        statusCondition = "search and category";
      } else if (search) {
        whereCondition = {
          "detail_items.name": { $like: `%${search}%` },
        };
        statusCondition = "search";
      } else if (categoryId) {
        whereCondition = {
          "detail_items.categoryId": categoryId,
        };
        statusCondition = "category";
      } else if (status) {
        if (!allowedStatus.includes(status)) {
          return response.status(400).json({
            status: "400",
            message: "Please choose an available status: onprocces, approve, reject",
          });
        }
        whereCondition = {
          "items.status": status,
        };
        statusCondition = "status";
      }

      const items = await Database.from("items")
      .leftJoin('users', 'items.userId', 'users.id')
      .leftJoin('detail_items', 'items.id', 'detail_items.id')
      .leftJoin('categories', 'detail_items.categoryId', 'categories.id')
      .where(whereCondition)
      .limit(limit)
      .offset(offset)
      .select(
          'items.*',
          'users.name as userName',
          "detail_items.name as itemName",
          'detail_items.categoryId as detail_items_categoryId',
          "categories.name as categoryName",
          "detail_items.description",
          "detail_items.url",
          "detail_items.quantity",
          "detail_items.price",
          "detail_items.total",
          "detail_items.duedate"
        );

      const totalCount = await Database.from("items")
      .leftJoin('users', 'items.userId', 'users.id')
      .leftJoin('detail_items', 'items.id', 'detail_items.id')
      .leftJoin('categories', 'detail_items.categoryId', 'categories.id')
      .where(whereCondition).count('* as total')
      const totalPages = Math.ceil(totalCount[0].total / limit)


         const data = {
        items,
        page: page,
        total_data: totalCount[0].total,
        total_page: totalPages,
      };

      if (items.length === 0){
        return response.status(404).json({
          status: "404",
          message: "Item Not Found",
        })
      }else{
        return response.status(200).json({
          status: "200",
          message: "Success Get Item",
          data,
          statusCondition
        });
      }
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }

  public async getDetailItem({ response, request }: HttpContextContract) {
    const itemsId = request.param("id");
    try {

      let whereCondition= (builder) => {
        builder.where('items.id', itemsId)
      }

      const items = await Database.from("items")
        .where(whereCondition)
        .select(
          'items.*',
          'users.name as userName',
          "detail_items.name as itemName",
          "detail_items.categoryId",
          "categories.name as categoryName",
          "detail_items.description",
          "detail_items.url",
          "detail_items.quantity",
          "detail_items.price",
          "detail_items.total",
          "detail_items.duedate"
        )  .leftJoin('users', 'items.userId', 'users.id')
        .leftJoin('detail_items', 'items.id', 'detail_items.id')
        .leftJoin('categories', 'detail_items.categoryId', 'categories.id')

      if (items.length === 0) {
        return response.status(400).json({
          status: "400",
          message: "Item not found",
        });
      }

    const data = {
        items,
      };

      return response.status(200).json({
        status: "200",
        message: "Success Get Item",
        data
      });
    } catch (error) {
      return response.status(500).json(error.massage);
    }
  }

  public async updateItem({ response, request }: HttpContextContract) {
    const itemsId = await request.param("id");
    const status = await request.input("status");
    let reason = await request.input("reason");
    try {
      const items = await Database.from("items")
        .where("id", itemsId)
        .select("*");

      const availableStatus = ["Approve", "Reject"];
      if (!availableStatus.includes(status)) {
        return response.status(400).json({
          status: "400",
          message: "Please choose an available status: approve, reject",
        });
      }

      if (items.length === 0) {
        return response.status(404).json({
          status: "404",
          message: "Item Not Found",
        });
      }

      const currentStatus = items[0].status;
      if (currentStatus === "Approve" || currentStatus === "Reject") {
        return response.status(400).json({
          status: "400",
          message: "Item has already been processed",
        });
      }

      if (status === "Reject" && !reason) {
        return response.status(400).json({
          status: "400",
          message: "Reason is required for reject status",
        });
      }

      const userId = items[0].userId;

      await Database.from("items").where("id", itemsId).update({ status });

      if (status === "Approve") {
        reason = undefined;
      }

      const history = {
        itemsId: itemsId,
        reason: reason,
      };

      await Database.table("histories").insert(history);

      const user = await Database.from("users")
        .where("id", userId)
        .select("email")
        .first();

      return response.status(200).json({
        status: "200",
        message: `Item status successfully changed to ${status} and Email Notification sent to ${user.email}`,
      });
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }
}
