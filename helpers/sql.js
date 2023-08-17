"use strict";

const { BadRequestError } = require("../expressError");

/** takes in an object dataToUpdate and and object jsToSql, and ouputs an
 * object with keys of setCols, and values as an array. if object is empty,
 * throw an error.
 *
 * dataToUpdate = {
 *  firstName: 'Aliya',
 *  age: 32
 * }
 *
 * jsToSql = {
 *  firstName: "first_name",
    lastName: "last_name",
    isAdmin: "is_admin"
  }

  returns {
    setCols: ' "first_name"=$1, "age"=$2 ',
    values: ['Aliya', 32]
  }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}


/** takes in an object dataToFilter and  converts them into queries and values
 * to insert into the queries.
 *
 * dataToFilter = {
 *  nameLike:'davis'
 *  minEmployees:600,
 *  maxEmployees:850
 * }
 *
  returns an object like: {
    filterCols: 'name ILIKE $1 AND num_employees >= $2 AND num_employees <= $3',
    values: ['%davis%', 600, 850]
  }
 */

function sqlForFilter(dataToFilter) {
  const keys = Object.keys(dataToFilter);

  const { nameLike, minEmployees, maxEmployees } = dataToFilter;

  let result = {
    filterCols: [],
    values: [],
  };

  for (let i = 0; i < keys.length; i++) {

    if (keys[i] === 'nameLike') {
      result.filterCols.push(`name ILIKE $${i + 1}`);
      result.values.push(`%${nameLike}%`);

    } else if (keys[i] === 'minEmployees') {
      result.filterCols.push(`num_employees >= $${i + 1}`);
      result.values.push(minEmployees);

    } else {//keys[i] === 'maxEmployees'
      result.filterCols.push(`num_employees <= $${i + 1}`);
      result.values.push(maxEmployees);

    }
  }

  result.filterCols = result.filterCols.join(' AND ');

  console.log('from sqlForFilter: result = ', result);
  return result;
}


module.exports = { sqlForPartialUpdate, sqlForFilter };
