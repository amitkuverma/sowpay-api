import { Request, Response } from "express";
import { Op } from "sequelize";
import User from "../models/user/user.model";
import BasicDetails from "../models/user/user_details.model";

export const getNearbyShops = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "This endpoint is not implemented yet." });
  // try {
  //   const search = req.query.search?.toString() || "";
  //   const page = parseInt(req.query.page as string) || 1;
  //   const limit = parseInt(req.query.limit as string) || 10;
  //   const offset = (page - 1) * limit;

  //   const { count, rows } = await User.findAndCountAll({
  //     where: {
  //       userType: "shopkeeper",
  //       name: {
  //         [Op.like]: `%${search}%`,
  //       },
  //     },
  //     include: [
  //       {
  //         model: BasicDetails,
  //         as: "details",
  //       },
  //     ],
  //     limit,
  //     offset,
  //     order: [["name", "ASC"]],
  //   });

  //   const formatted = rows.map((user: any) => ({
  //     name: user.name,
  //     category: user.details?.category || "N/A",
  //     image: user.details?.image || "/default.png",
  //     review: user.details?.review || 0,
  //     distance: user.details?.distance || "N/A",
  //     path: `/shop/${user.id}`,
  //   }));

  //   res.json({
  //     data: formatted,
  //     total: count,
  //     page,
  //     totalPages: Math.ceil(count / limit),
  //   });
  // } catch (err) {
  //   console.error("Error fetching shops:", err);
  //   res.status(500).json({ message: "Failed to load shops" });
  // }
};
