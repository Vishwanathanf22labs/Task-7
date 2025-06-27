const { jobSchema } = require("../utils/validators");
const Job = require("../models/Job");
const User = require("../models/User");
const { logger, logActivity } = require("../services/loggerService");
const { Op } = require("sequelize");

const getAllJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      jobType,
      salaryRange,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * limit;

    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (location) where.location = location;
    if (jobType) where.jobType = jobType;
    if (salaryRange) {
      const [min, max] = salaryRange.split("-").map(Number);
      where.salary = max ? { [Op.between]: [min, max] } : { [Op.gte]: min };
    }

    const jobs = await Job.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: User, as: "employer", attributes: ["id", "name"] }],
    });

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: User, as: "employer", attributes: ["id", "name"] }],
    });
    if (!job) throw new Error("Job not found");

    res.json({ job });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const result = jobSchema.safeParse(req.body);
    if (!result.success) throw new Error(result.error.errors[0].message);

    const job = await Job.create({ ...req.body, userId: req.user.id });
    await logActivity(req.user.id, "create_job", `Job ${job.title} created`);

    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const result = jobSchema.safeParse(req.body);
    if (!result.success) throw new Error(result.error.errors[0].message);

    const job = await Job.findByPk(req.params.id);
    if (!job) throw new Error("Job not found");
    if (job.userId !== req.user.id && req.user.role !== "admin")
      throw new Error("Unauthorized");

    await job.update(req.body);
    await logActivity(req.user.id, "update_job", `Job ${job.title} updated`);

    res.json({ job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) throw new Error("Job not found");
    if (job.userId !== req.user.id && req.user.role !== "admin")
      throw new Error("Unauthorized");

    await job.destroy();
    await logActivity(req.user.id, "delete_job", `Job ${job.title} deleted`);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const approveJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) throw new Error("Job not found");
    if (job.status === "approved") throw new Error("Job already approved");

    await job.update({ status: "approved" });
    await logger.logActivity(
      req.user.id,
      "approve_job",
      `Job ${job.title} approved`
    );

    res.json({ job });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  approveJob,
};
