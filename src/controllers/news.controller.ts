import type { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { News } from "../models/news.model.js";

type NewsIdParams = {
  id: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createNews(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const news = await News.create(req.body);

    return res.status(201).json({
      success: true,
      message: "News created successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicNews(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const news = await News.find({
      status: "enabled",
    })
      .select("title url description sortOrder createdAt")
      .sort({
        sortOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      message: "News fetched successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminNews(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const requestedPage = Number(req.query.page);
    const requestedLimit = Number(req.query.limit);

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;

    const limit =
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 10;

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    const filter: Record<string, unknown> = {};

    if (search) {
      const safeSearch = escapeRegExp(search);

      filter.$or = [
        {
          title: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    if (status === "enabled" || status === "disabled") {
      filter.status = status;
    }

    const allowedSortFields = [
      "title",
      "sortOrder",
      "createdAt",
      "updatedAt",
    ];

    const requestedSortField =
      typeof req.query.sortBy === "string"
        ? req.query.sortBy
        : "";

    const sortField = allowedSortFields.includes(requestedSortField)
      ? requestedSortField
      : "sortOrder";

    const sortDirection: 1 | -1 =
      req.query.sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find(filter)
        .select(
          "title url sortOrder status createdAt updatedAt",
        )
        .sort({
          [sortField]: sortDirection,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      News.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "News fetched successfully",
      data: news,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminNewsById(
  req: Request<NewsIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
      });
    }

    const news = await News.findById(id).lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News fetched successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateNews(
  req: Request<NewsIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
      });
    }

    const news = await News.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteNews(
  req: Request<NewsIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
      });
    }

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}