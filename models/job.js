"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilter } = require("../helpers/sql");

/** Related functions for jobs. */


class Job {

  /** Create a job (from data), update db, return new job data.
  *
  * data should be { title, salary, equity, company_handle }
  *
  * Returns { title, salary, equity, company_handle }
  *
  * Throws BadRequestError if job already in database.
  * */

  static async create({ title, salary, equity, company_handle}) {

  const result = await db.query(`
      INSERT INTO jobs (title,
                        salary,
                        equity,
                        company_handle)
      VALUES ($1, $2, $3, $4)
      RETURNING
        title,
        salary,
        equity,
        company_handle`, [
  title,
  salary,
  equity,
  company_handle
  ],
  );

  const job = result.rows[0];

  return job;

  }
}

//   /** Find all companies.
//   *
//   * Can filter on provided search filters:
//   * - minEmployees
//   * - maxEmployees
//   * - nameLike (will find case-insensitive, partial matches)
//   *
//   * if nothing to filter, return all companies
//   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
//   * */

//   static async findAll(dataToFilter);


//   /** Given a job handle, return data about job.
//  *
//  * Returns { handle, name, description, numEmployees, logoUrl, jobs }
//  *   where jobs is [{ id, title, salary, equity, jobHandle }, ...]
//  *
//  * Throws NotFoundError if not found.
//  **/

//   static async get(handle);



//   /** Update job data with `data`.
//  *
//  * This is a "partial update" --- it's fine if data doesn't contain all the
//  * fields; this only changes provided ones.
//  *
//  * Data can include: {name, description, numEmployees, logoUrl}
//  *
//  * Returns {handle, name, description, numEmployees, logoUrl}
//  *
//  * Throws NotFoundError if not found.
//  */

//   static async update(handle, data);


//   /** Delete given job from database; returns undefined.
//    *
//    * Throws NotFoundError if job not found.
//    **/

//   static async remove(handle);
// }



module.exports = Job;