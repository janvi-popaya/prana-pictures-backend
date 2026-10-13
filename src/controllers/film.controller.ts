import type { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Film } from "../models/film.model.js";

type FilmSlugParams = {
  slug: string;
};

type FilmIdParams = {
  id: string;
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

export async function createFilm(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const film = await Film.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Film created successfully",
      data: film,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        success: false,
        message: "A film with this slug already exists",
      });
    }

    next(error);
  }
}

export async function getPublicFilms(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const films = await Film.find({
      status: "enabled",
    })
      .sort({
        sortOrder: 1,
        releaseDate: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Films fetched successfully",
      data: films,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicFilmBySlug(
  req: Request<FilmSlugParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const film = await Film.findOne({
      slug: req.params.slug.toLowerCase(),
      status: "enabled",
    }).lean();

    if (!film) {
      return res.status(404).json({
        success: false,
        message: "Film not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Film fetched successfully",
      data: film,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminFilms(
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

    if (
      status === "enabled" ||
      status === "disabled" ||
      status === "upcoming"
    ) {
      filter.status = status;
    }

    const allowedSortFields = [
      "title",
      "releaseDate",
      "sortOrder",
      "createdAt",
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

    const [films, total] = await Promise.all([
      Film.find(filter)
        .select(
          "title slug genres runtimeMinutes releaseDate sortOrder status createdAt updatedAt",
        )
        .sort({
          [sortField]: sortDirection,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Film.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Films fetched successfully",
      data: films,
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

export async function getAdminFilmById(
  req: Request<FilmIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid film ID",
      });
    }

    const film = await Film.findById(id).lean();

    if (!film) {
      return res.status(404).json({
        success: false,
        message: "Film not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Film fetched successfully",
      data: film,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFilm(
  req: Request<FilmIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid film ID",
      });
    }

    const film = await Film.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!film) {
      return res.status(404).json({
        success: false,
        message: "Film not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Film updated successfully",
      data: film,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        success: false,
        message: "A film with this slug already exists",
      });
    }

    next(error);
  }
}

export async function deleteFilm(
  req: Request<FilmIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid film ID",
      });
    }

    const film = await Film.findByIdAndDelete(id);

    if (!film) {
      return res.status(404).json({
        success: false,
        message: "Film not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Film deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}