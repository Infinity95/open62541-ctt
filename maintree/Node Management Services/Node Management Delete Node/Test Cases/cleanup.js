print( "\t**** Node Management Delete Node END ****" );
Test.Disconnect();
print( Test.Stats() );
Test.ResetStats();
Test.PostTestFunctions = [];
AddNodeIdsHelper.PostServiceCallFunction = null;
print( "Delete Node CU wait 6-seconds" ); wait( 6000 );