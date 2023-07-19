import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class MembersController {
  public async getMembers({ response, request }: HttpContextContract) {

    const search = request.input("search");
    const page = request.input("page", 1);
    const limit = 10
    const offset =  (page - 1) * limit
    try {

     let whereCondition = (builder) => {
      builder.where('role', 'member').where('is_active', true)
      if (search){
        builder.where('name', 'like', `%${search}`).orWhere('username', 'like', `%${search}`).orWhere('email', 'like', `%${search}`)
      }
    }

    const membersQuery = User.query().where(whereCondition);
    const members = await membersQuery
      .select('id', 'name', 'nik', 'phone', 'address', 'username', 'email')
      .limit(limit)
      .offset(offset)

    // Menghitung total data dan total halaman
    const pagination = await membersQuery.paginate(page, limit);
    const totalCount = pagination.total;
    const totalPages = pagination.lastPage;

      if (!members.length) {
        return response.status(404).json({
          status: "404",
          message: "Members Not Founds",
        });
      }
      return response.status(200).json({
        status: "200",
        message: "Success Get Members",
        members: members,
        page: page,
        total_data: totalCount,
        total_page: totalPages,
      });
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }

  public async detailMember({ response, request }: HttpContextContract) {
    const userId = request.param("id");
    try {
      const member = await User.find(userId);

      if (!member) {
        return response.status(404).json({
          staus: "404",
          message: "Member with userId " + userId + " not found",
        });
      } else {
        return response.status(200).json({
          status: "200",
          message: "Success get member " + member.name,
          data: {
            name: member.name,
            username: member.username,
            email: member.email,
            nik: member.nik,
            address: member.address,
            phone: member.phone,
          },
        });
      }
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }

  public async storeMember({ response, request }: HttpContextContract) {
    const name = request.input("name");
    const username = request.input("username");
    const email = request.input("email");
    const password = request.input("password");
    const nik = request.input("nik");
    const address = request.input("address");
    const phone = request.input("phone");
    try {
      if (
        !name ||
        !username ||
        !email ||
        !password ||
        !nik ||
        !address ||
        !phone
      ) {
        return response.status(400).json({
          status: "400",
          message: "All Parameters must be filled",
        });
      }

      const existingUsername = await User.query()
        .where({ username: username, is_active: true })
        .orWhere({ username: username, is_active: false })
        .first();

      const existingEmail = await User.query()
        .where({ email: email, is_active: true })
        .orWhere({ email: email, is_active: false })
        .first();

      if (existingEmail && existingUsername) {
        return response.status(400).json({
          status: "400",
          message: "Username and Email already exist",
        });
      }

      if (existingUsername) {
        return response.status(400).json({
          status: "400",
          message: "Username has already been taken",
        });
      }

      if (existingEmail) {
        return response.status(400).json({
          status: "400",
          message: "Email has already been taken",
        });
      }

      const create = await User.create({
        name: name,
        username: username,
        email: email,
        password: password,
        nik: nik,
        address: address,
        phone: phone,
      });

      return response.status(200).json({
        status: "200",
        message: "Succes Create Member",
        data: {
          name: create.name,
          email: create.email,
        },
      });
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }

  public async updateMember({ response, request }: HttpContextContract) {
    const userId = request.param("id");
    const name = request.input("name");
    const username = request.input("username");
    const email = request.input("email");
    const password = request.input("password");
    const nik = request.input("nik");
    const address = request.input("address");
    const phone = request.input("phone");
    try {
      const member = await User.find(userId);

      if (!member) {
        return response.status(404).json({
          staus: "404",
          message: "Member with userId " + userId + " not found",
        });
      }

      const existingUsername = await User.query()
        .where({ username: username, is_active: true })
        .orWhere({ username: username, is_active: false })
        .first();

      const existingEmail = await User.query()
        .where({ email: email, is_active: true })
        .orWhere({ email: email, is_active: false })
        .first();

      if (username && existingUsername && existingUsername.id !== userId) {
        return response.status(400).json({
          status: "400",
          message: "Username has already been taken",
        });
      } else if (email && existingEmail && existingEmail.id !== userId) {
        return response.status(400).json({
          status: "400",
          message: "Email has already been taken",
        });
      }

      (member.name = name || member.name),
        (member.username = username || member.username),
        (member.email = email || member.email),
        (member.nik = nik || member.nik),
        (member.address = address || member.address),
        (member.phone = phone || member.phone),
        (member.password = password || member.password);

      await member.save();

      return response.status(200).json({
        status: "200",
        message: "Member account has succesfully updated",
        data: {
          name: member.name,
          username: member.username,
          email: member.email,
          nik: member.nik,
          address: member.address,
          phone: member.phone,
        },
      });
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }

  public async deleteMember({ response, request }: HttpContextContract) {
    const userId = await request.param("id");
    try {
      const active = false;
      const member = await User.find(userId);

      if (!member) {
        return response.status(404).json({
          staus: "404",
          message: "Member with userId " + userId + " not found",
        });
      }

      member.is_active = active;
      await member.save();

      return response.status(200).json({
        status: "200",
        message: "Member account has succesfully deleted",
      });
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }
}
