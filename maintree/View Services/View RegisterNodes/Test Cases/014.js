/*    Test 5.7.5-4 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given 50 nodes in nodesToUnregister[]
            And the nodes exist
          When UnregisterNodes is called
          Then the server returns ServiceResult Good
            And unregisters the nodes */

include( "./library/Base/array.js" );

function registerNodes014() {
    TestUnregisterMultipleNodes( Test.Session.Session, 50, 0 );
    return( true );
}

Test.Execute( { Procedure: registerNodes014 } );