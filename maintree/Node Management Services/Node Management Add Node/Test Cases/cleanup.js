print( "\t**** Node Management Add Node END ****" );
Test.Disconnect();
print( Test.Stats() );
Test.ResetStats();
Test.PostTestFunctions = [];
AddNodeIdsHelper.PostServiceCallFunction = null;
print( "Add Node CU wait 6-seconds" ); wait( 6000 );