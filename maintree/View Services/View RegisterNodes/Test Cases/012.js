/*    Test 5.7.5-2 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given five nodes in nodesToUnregister[]
            And the nodes exist
          When UnregisterNodes is called
          Then the server returns ServiceResult Good
            And unregisters the nodes */

include( "./library/Base/array.js" );

function test012() {
    TestUnregisterMultipleNodes( Test.Session.Session, 5, 0 );
    return( true );
}

Test.Execute( { Procedure: test012 } );