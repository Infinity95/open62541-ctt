/*    Test 5.7.4-Err-1 prepared by compliance@opcfoundaiton.org; original work by: Dale Pope dale.pope@matrikon.com
      Description: Given an empty list of nodesToRegister[] When RegisterNodes is called Then the server returns service result Bad_NothingToDo */

function registerNodesErr001() {
    RegisterNodesHelper.Execute( { ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ) } );
    return( true );
}

Test.Execute( { Procedure: registerNodesErr001 } );