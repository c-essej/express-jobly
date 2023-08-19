"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new",
    salary: 123456,
    equity: '0.1',
    company_handle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);

    const result = await db.query(
      `SELECT title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'new'`);
    expect(result.rows).toEqual([
      {
        title: "new",
        salary: 123456,
        equity: '0.1',
        company_handle: "c1",
      },
    ]);
  });

});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        title: "new",
        salary: 123456,
        equity: '0.1',
        company_handle: "c1",
      },
    ]);
  });

});
