import type { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { TeamMember } from "../models/team.model.js";

type TeamMemberIdParams = {
  id: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createTeamMember(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const teamMember = await TeamMember.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: teamMember,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicTeamMembers(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const teamMembers = await TeamMember.find({
      status: "enabled",
    })
      .select(
        "name shortBio descriptionHtml designation email sortOrder socialLinks skills",
      )
      .sort({
        sortOrder: 1,
        name: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Team members fetched successfully",
      data: teamMembers,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminTeamMembers(
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
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          designation: {
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
      "name",
      "designation",
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

    const [teamMembers, total] = await Promise.all([
      TeamMember.find(filter)
        .select(
          "name designation sortOrder status createdAt updatedAt",
        )
        .sort({
          [sortField]: sortDirection,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      TeamMember.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Team members fetched successfully",
      data: teamMembers,
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

export async function getAdminTeamMemberById(
  req: Request<TeamMemberIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID",
      });
    }

    const teamMember = await TeamMember.findById(id).lean();

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Team member fetched successfully",
      data: teamMember,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTeamMember(
  req: Request<TeamMemberIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID",
      });
    }

    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: teamMember,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTeamMember(
  req: Request<TeamMemberIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID",
      });
    }

    const teamMember = await TeamMember.findByIdAndDelete(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}