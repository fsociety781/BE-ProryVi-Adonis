import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class DashboardController {
  public async index({response, request, auth}: HttpContextContract){
    const filter = request.input('filter')
    const userId = auth.user?.id
  try{
    let startDate = new Date()
    let endDate = new Date()

    if (filter === "perminggu"){
      startDate = new Date()
      startDate.setDate(startDate.getDate() - 7);
      endDate =  new Date()
    }
    if (filter === "perbulan") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      endDate = new Date();
    }
    if (filter === "pertahun") {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setMonth(0);
      startDate.setDate(1);
      endDate = new Date();
    }

   if(userId){
    const lastRequest = await Database.from('items').where('userId', userId)
    .leftJoin('users', 'items.userId', 'users.id')
    .leftJoin('detail_items', 'items.id', 'detail_items.id')
    .leftJoin('categories', 'detail_items.categoryId', 'categories.id')
    .limit(5)
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
    ).orderBy('detail_items.duedate', 'desc')

    const totalCount = await Database.from('items').where('userId', userId).count('* as total')
    const itemsOnproccesResult = await Database.from('items').where('userId', userId).where('status', 'Onprocces').andWhereBetween('created_at', [startDate, endDate]).count('* as total')
    const itemsApproveResult = await Database.from('items').where('userId', userId).where('status', 'Approve').andWhereBetween('created_at', [startDate, endDate]).count('* as total')
    const itemsRejectResult = await Database.from('items').where('userId', userId).where('status', 'Reject').andWhereBetween('created_at', [startDate, endDate]).count('* as total')

    const allOnproccesResult = await Database.from('items').where('userId', userId).where('status', 'Onprocces').count('* as total').first();
    const allApproveResult = await Database.from('items').where('userId', userId).where('status', 'Approve').count('* as total').first();
    const allRejectResult = await Database.from('items').where('userId', userId).where('status', 'Reject').count('* as total').first();

    const itemsOnprocces = allOnproccesResult?.total || 0;
    const itemsApprove = allApproveResult?.total || 0;
    const itemsReject = allRejectResult?.total || 0;


    let filterMessage = "";
      if (filter === "perminggu") {
        filterMessage = "Data terfilter untuk satu minggu terakhir";
      } else if (filter === "perbulan") {
        filterMessage = "Data terfilter untuk satu bulan terakhir";
      } else if (filter === "pertahun") {
        filterMessage = "Data terfilter untuk satu tahun terakhir";
      }
      if(filterMessage){
        return response.status(200).json({
          status: '200',
          message: "get data for dashboard",
          total: totalCount[0].total,
          processed: itemsOnproccesResult[0].total,
          approved: itemsApproveResult[0].total,
          rejected: itemsRejectResult[0].total,
          lastRequest,
          filterMessage
        });
      }else{
      return response.status(200).json({
        status: '200',
        message: "get data for dashboard",
        total: totalCount[0].total,
        processed: itemsOnprocces,
        approved: itemsApprove,
        rejected: itemsReject,
        lastRequest,
        filterMessage
      });
      }
  }
    }catch (error){
      return response.status(500).json(error.message)
    }
  }
}
