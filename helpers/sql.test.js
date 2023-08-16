"use strict";

const { sqlForPartialUpdate } = require("./sql");
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


  test('bad request data', function(){

    try {
      const dataToUpdate = {};
      const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin"
      }

      const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql)

    } catch (err){
      expect(err instanceof BadRequestError).toBeTruthy();

  }

  });
})
