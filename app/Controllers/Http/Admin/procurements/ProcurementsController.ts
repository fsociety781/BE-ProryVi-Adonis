import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class ProcurementsController {
  public async getItem({ response }: HttpContextContract) {
    try {
      const items = await Database.from("items").select("*");
      const itemsId = items.map((items) => items.id);

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
      };

      return response.status(200).json({ status: "200", data });
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }

  public async getDetailItem({ response, request }: HttpContextContract) {
    const itemsId = request.param("id");
    try {
      const items = await Database.from("items")
        .where("id", itemsId)
        .select("*");
      const itemsIds = items.map((items) => items.id);

      if (items.length === 0) {
        return response.status(400).json({
          status: "400",
          message: "Item not found",
        });
      }

      const detailItems = await Database.from("detail_items")
        .whereIn("detail_items.id", itemsIds)
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
      };
      return response.status(200).json({ status: "200", data });
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
