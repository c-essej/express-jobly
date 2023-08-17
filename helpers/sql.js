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

function sqlForFilter(dataToFilter) {
  console.log('is this file running');
  const keys = Object.keys(dataToFilter);

  if (keys.length === 0) return { filterCols: '', values: [] };


  let result = {
    filterCols: [],
    values: [],
  };
  const { nameLike, minEmployees, maxEmployees } = dataToFilter;

  if (keys.includes('nameLike')) {
    // Where name ILIKE $1 , ['%nameLike%']
    result.filterCols.push(`name ILIKE $1`);
    result.values.push(`%${nameLike}%`);

    if (keys.includes('minEmployees')) {
      result.filterCols.push(`num_employees >= $2`);
      result.values.push(minEmployees);

      if (keys.includes('maxEmployees')) {
        result.filterCols.push(`num_employees <= $3`);
        result.values.push(maxEmployees);
      }

    } else { // nameLike,  no minEmployees

      if (keys.includes('maxEmployees')) {
        result.filterCols.push(`num_employees <= $2`);
        result.values.push(maxEmployees);
      }

    }
  } else { // no nameLike

    if (keys.includes('minEmployees')) {
      result.filterCols.push(`num_employees >= $1`);
      result.values.push(minEmployees);

      if (keys.includes('maxEmployees')) {
        result.filterCols.push(`num_employees <= $2`);
        result.values.push(maxEmployees);
      }

    } else {// no nameLike and no minEmployees

      if (keys.includes('maxEmployees')) {
        result.filterCols.push(`num_employees <= $1`);
        result.values.push(maxEmployees);
      }


    }

  }

  result.filterCols = result.filterCols.join(' AND ');
  console.log('******result', result);

  return result;
}


module.exports = { sqlForPartialUpdate, sqlForFilter };
