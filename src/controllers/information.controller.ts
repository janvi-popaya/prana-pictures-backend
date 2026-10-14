import type { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { InformationPage } from "../models/information.model.js";

type InformationIdParams = {
  id: string;
};

type InformationSlugParams = {
  slug: string;
};

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/*
 * Converts:
 * { seo: { metaTitle: "New title" } }
 *
 * Into:
 * { "seo.metaTitle": "New title" }
 *
 * This prevents a partial SEO update from deleting the other SEO fields.
 */
function buildUpdateData(body: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {
    ...body,
  };

  const seo = body.seo;

  if (
    typeof seo === "object" &&
    seo !== null &&
    !Array.isArray(seo)
  ) {
    delete updateData.seo;

    for (const [key, value] of Object.entries(seo)) {
      updateData[`seo.${key}`] = value;
    }
  }

  return updateData;
}

export async function createInformation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const information = await InformationPage.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Information page created successfully",
      data: information,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        success: false,
        message: "An information page with this slug already exists",
      });
    }

    next(error);
  }
}

export async function getPublicInformationList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const filter: Record<string, unknown> = {
      status: "enabled",
    };

    // GET /api/v1/information?footer=true
    if (req.query.footer === "true") {
      filter.showInFooter = true;
    }

    const information = await InformationPage.find(filter)
      .select(
        "title slug icon showInFooter sortOrder createdAt updatedAt",
      )
      .sort({
        sortOrder: 1,
        title: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Information pages fetched successfully",
      data: information,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicInformationBySlug(
  req: Request<InformationSlugParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const information = await InformationPage.findOne({
      slug: req.params.slug.toLowerCase(),
      status: "enabled",
    }).lean();

    if (!information) {
      return res.status(404).json({
        success: false,
        message: "Information page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Information page fetched successfully",
      data: information,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminInformationList(
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
          slug: {
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

    const [information, total] = await Promise.all([
      InformationPage.find(filter)
        .select(
          "title slug showInFooter sortOrder status createdAt updatedAt",
        )
        .sort({
          [sortField]: sortDirection,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      InformationPage.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Information pages fetched successfully",
      data: information,
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

export async function getAdminInformationById(
  req: Request<InformationIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid information page ID",
      });
    }

    const information = await InformationPage.findById(id).lean();

    if (!information) {
      return res.status(404).json({
        success: false,
        message: "Information page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Information page fetched successfully",
      data: information,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateInformation(
  req: Request<InformationIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid information page ID",
      });
    }

    const updateData = buildUpdateData(req.body);

    const information = await InformationPage.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!information) {
      return res.status(404).json({
        success: false,
        message: "Information page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Information page updated successfully",
      data: information,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        success: false,
        message: "An information page with this slug already exists",
      });
    }

    next(error);
  }
}

export async function deleteInformation(
  req: Request<InformationIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid information page ID",
      });
    }

    const information = await InformationPage.findByIdAndDelete(id);

    if (!information) {
      return res.status(404).json({
        success: false,
        message: "Information page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Information page deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}