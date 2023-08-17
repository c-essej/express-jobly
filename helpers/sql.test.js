"use strict";

const { sqlForPartialUpdate, sqlForFilter } = require("./sql");
const { BadRequestError } = require("../expressError");

describe('sqlForPartialUpdate', function() {

  test('updates first_name and age', function(){
    const dataToUpdate = {
      firstName: 'Aliya',
      age: 32
    };

    const jsToSql = {
    firstName: "first_name",
    lastName: "last_name",
    isAdmin: "is_admin"
  }

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql)
    expect(setCols).toEqual('"first_name"=$1, "age"=$2');
    expect(values).toEqual(['Aliya', 32]);
  });


  test('updates last_name', function(){
    const dataToUpdate = {
      lastName: 'newlastname',
    };

    const jsToSql = {
    firstName: "first_name",
    lastName: "last_name",
    isAdmin: "is_admin"
  }

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql)
    expect(setCols).toEqual('"last_name"=$1');
    expect(values).toEqual(['newlastname']);
  });

//TODO: throw a generic error on line 54
  test('bad request data', function(){

    try {
      const dataToUpdate = {};
      const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin"
      }

      const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql)
      throw new Error()
    } catch (err){
      expect(err instanceof BadRequestError).toBeTruthy();

  }

  });


})


describe('sqlForFilter', function() {
  test('filters correctly for nameLike', function() {
    const dataToUpdate = {
      nameLike: 'testcompany',
    };
    const { filterCols, values } = sqlForFilter(dataToUpdate);
    expect(filterCols).toEqual('name ILIKE $1');
    expect(values).toEqual(['%testcompany%'])
  });

  test('filters correctly for minEmployees', function() {
    const dataToUpdate = {
      minEmployees: 50,
    };
    const { filterCols, values } = sqlForFilter(dataToUpdate);
    expect(filterCols).toEqual('num_employees >= $1');
    expect(values).toEqual([50])
  });

  test('filters correctly for maxEmployees', function() {
    const dataToUpdate = {
      maxEmployees: 100,
    };
    const { filterCols, values } = sqlForFilter(dataToUpdate);
    expect(filterCols).toEqual('num_employees <= $1');
    expect(values).toEqual([100])
  });

  test('filters correctly for minEmployees and maxEmployees', function() {
    const dataToUpdate = {
      minEmployees: 50,
      maxEmployees: 100,
    };
    const { filterCols, values } = sqlForFilter(dataToUpdate);
    expect(filterCols).toEqual('num_employees >= $1 AND num_employees <= $2');
    expect(values).toEqual([50, 100])
  });

  test('filters correctly for all three fields', function() {
    const dataToUpdate = {
      nameLike: 'testcompany',
      minEmployees: 50,
      maxEmployees: 100,
    };
    const { filterCols, values } = sqlForFilter(dataToUpdate);
    expect(filterCols).toEqual('name ILIKE $1 AND num_employees >= $2 AND num_employees <= $3');
    expect(values).toEqual(['%testcompany%', 50, 100])
  });
//TODO: change the description
//TODO: rename dataToUpdate
  test('filters correctly for minEmployees and maxEmployees', function() {
    const dataToUpdate = {};
    const { filterCols, values } = sqlForFilter(dataToUpdate);
    expect(filterCols).toEqual('');
    expect(values).toEqual([])
  });

});
