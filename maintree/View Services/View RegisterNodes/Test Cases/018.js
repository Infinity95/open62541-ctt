/*    Test 5.7.5-10 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given a non-existent node; When UnregisterNodes is called; Then the server returns ServiceResult Good */

include( "./library/Base/array.js" );

function Test575010( nodeIdSetting ) {
    var maxLength = 1;
    var nodesToUnregister = [];
    AddNodeIdSettingToUniqueArray( nodesToUnregister, nodeIdSetting, maxLength );
    addLog( "Unregistering one non-existent node: " + nodesToUnregister[0] );
    if( nodesToUnregister.length !== maxLength ) {
        addError( "Test cannot be completed: found " + nodesToUnregister.length + " unique NodeIds of a required " + maxLength );
        return( false );
    }
    TestUnregisterRegisteredNodes( Test.Session.Session, nodesToUnregister, nodesToUnregister, 0 );
}

function registerNodes018() {
    Test575010( "/Advanced/NodeIds/Invalid/UnknownNodeId1" );
    Test575010( "/Advanced/NodeIds/Invalid/UnknownNodeId2" );
    Test575010( "/Advanced/NodeIds/Invalid/UnknownNodeId3" );
    Test575010( "/Advanced/NodeIds/Invalid/UnknownNodeId4" );
    Test575010( "/Advanced/NodeIds/Invalid/UnknownNodeId5" );
    return( true );
}

Test.Execute( { Procedure: registerNodes018 } );