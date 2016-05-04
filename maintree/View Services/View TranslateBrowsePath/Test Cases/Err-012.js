/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: A relativePath element specifies an invalid NodeId for the referenceTypeId.  */

function translate573err012() {
    // get an item
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
    if( !isDefined( item ) ) {
        addError( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }
    // define a valid browsePath
    var iBP = new UaBrowsePath();
    iBP.StartingNode = item.NodeId;
    // define an invalid relative path, and add it to the browsePath
    var e = new UaRelativePathElement();
    e.IncludeSubtypes = true;
    e.IsInverse = false;
    e.TargetName.Name = "EURange";
    e.ReferenceTypeId = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/InvalidNodeId1" ).toString() );
    iBP.RelativePath.Elements[0] = e;
    // invoke translate...
    return( TranslateBrowsePathsToNodeIdsHelper.Execute( {
            Node: item,
            UaBrowsePaths: iBP,
            OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadNoMatch ) ]
            } ) );
}

Test.Execute( { Procedure: translate573err012 } );