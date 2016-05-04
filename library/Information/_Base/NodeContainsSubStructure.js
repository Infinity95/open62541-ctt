include( "./library/Base/Objects/expectedResults.js" );
include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds.js" );
include( "./library/Information/_Base/CttObjectHelpers.js" );
include( "./library/Information/_Base/InformationModelObjectHelper.js" );



var TBPTNI = new Object();

/*  Dynamically decorate the TranslateBrowsePath object with a new function that will
    convert the specified object definition into a series of requests and browse paths */
TBPTNI.GetBrowsePaths = function( nodeId, objectDefinition, parent ) {
    if( !isDefined( [ objectDefinition, nodeId ] ) ) throw( "TBPTNI.GetBrowsePaths argument(s) missing: objectDefinition or nodeId." );
    if( !isDefined( objectDefinition.Name ) ) throw( "TBPTNI.GetBrowsePaths argument of wrong type. Expected a 'Name' property, but wasnt found." );
    var browsePaths = [];
    // iteratively scour the references on the specified object, building the browse paths
    for( var r=0; r<objectDefinition.References.length; r++ ) {
        // create a new browse path
        var newBP = new UaBrowsePath();
        newBP.StartingNode = nodeId;
        newBP.RelativePath.Elements[0].IncludeSubTypes = true;
        // if any parent names were specified (this is a recursively called function) then insert them here
        var eIndex = 0;
        if( isDefined( parent ) ) {
            for( p=0; p<parent.length; p++ ) {
                newBP.RelativePath.Elements[eIndex].IncludeSubtypes = true;
                newBP.RelativePath.Elements[eIndex++].TargetName.Name = parent[p];
            }//for p...
        }
        // now add the "current" name to the path.
        newBP.RelativePath.Elements[eIndex].IncludeSubtypes = true;
        newBP.RelativePath.Elements[eIndex].TargetName.Name = objectDefinition.References[r].BrowseName;
        // add the browse path to the return collection
        browsePaths.push( newBP.clone() );
        // look for nested objects, and recursively build the nested objects...
        if( isDefined( objectDefinition.References[r].TypeInstance ) ) {
            if( !isDefined( parent ) ) parent = [];
            // get the "current" Name into the parent array
            parent.push( objectDefinition.References[r].BrowseName );
            var subPaths = TBPTNI.GetBrowsePaths( nodeId, objectDefinition.References[r].TypeInstance, parent );
            if( isDefined( subPaths ) ) {
                for( var s=0; s<subPaths.length; s++ ) {
                    browsePaths.push( subPaths[s] );
                }//for s...
            }
            parent.pop();
        }
    }//for r...
    return( browsePaths );
}


// params: Paths, Separator, ShowNumber
TBPTNI.BrowsePathsToString = function( args ) {
    // check params
    if( !isDefined( args ) ) throw( "TBPTNI.BrowsePathsToString::args not specified." );
    if( !isDefined( args.Paths ) ) throw( "TBPTNI.BrowsePathsToString::Paths not specified." );
    if( !isDefined( args.Separator ) ) args.Separator = " -> ";
    if( !isDefined( args.ShowNumber ) ) args.ShowNumber = true;
    // now to iterate thru all browsePaths
    var s = "";
    if( isDefined( args.Paths ) ) {
        if( args.Paths.length === undefined ) args.Paths = [args.Paths];
        for( var i=0; i<args.Paths.length; i++ ) {
            if( args.ShowNumber ) s += "[" + i + "] ";
            for( var e=0; e<args.Paths[i].RelativePath.Elements.length; e++ ) {
                s += args.Separator + args.Paths[i].RelativePath.Elements[e].TargetName.Name;
            }//for e...
            if( i < ( args.Paths.length - 1 ) ) s += "\n";
        }//for i...
    }
    return( s );
}


TBPTNI.BrowsePathsToExpectedErrors = function( objectDefinition ) {
    var errs = [];
    if( isDefined( objectDefinition ) ) {
        for( var r=0; r<objectDefinition.References.length; r++ ) {
            if( objectDefinition.References[r].Required ) errs.push( new ExpectedAndAcceptedResults( StatusCode.Good ) );
            else {
                errs.push( new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) );
            }
            // search for nested/sub-definitions
            if( isDefined( objectDefinition.References[r].TypeInstance ) ) {
                var innerErrs = TBPTNI.BrowsePathsToExpectedErrors( objectDefinition.References[r].TypeInstance );
                if( isDefined( innerErrs ) ) {
                    for( var i=0; i<innerErrs.length; i++ ) {
                        errs.push( innerErrs[i] );
                    }
                }// if innerErrs
            }
        }//for r
    }//if paths
    return( errs );
}


// params: StartingNode, ObjectDefinition, TranslateBrowsePathsToNodeIdsHelper
// out: True/False 
TBPTNI.CheckChildStructure = function( args ) {
    if( !isDefined( args ) ) throw( "TBPTNI.CheckChildStructure::args not specified." );
    if( !isDefined( [ args.StartingNode, args.ObjectDefinition, args.TranslateBrowsePathsToNodeIdsHelper ] ) ) throw( "TBPTNI.CheckChildStructure arguments missing." );
    // first, obtain the browsePath definitions, and the expectedResults
    var browsePaths = TBPTNI.GetBrowsePaths( args.StartingNode.NodeId, args.ObjectDefinition );
    var expectedResults = TBPTNI.BrowsePathsToExpectedErrors( args.ObjectDefinition );
    // invoke the TranslateBrowsePathsToNodeIds helper function call, while specifying the expected outcome
    print( "Structure verification on NodeId: " + args.StartingNode.NodeId + " (setting: " + args.StartingNode.NodeSetting + ")." );
    args.TranslateBrowsePathsToNodeIdsHelper.Execute( { 
            UaBrowsePaths: browsePaths,
            OperationResults: expectedResults,
            SuppressMessaging: true
            } );
    result = TBPTNI.GetTestResults( args );
    return( result );
}


// params: Item
// out: List of References.
TBPTNI.recursivelyGetReferences = function( args ) {
    if( !isDefined( args ) )throw( "TBPTNI.recursivelyGetReferences::args not specified." );
    if( !isDefined( args.Item ) ) throw( "TBPTNI.recursivelyGetReferences::args.Item not specified." );
    var _refs = [];
    if( isDefined( args.Item.References ) ) {
        // copy all references into our collection
        for( r in args.Item.References ) {
            var _cr = args.Item.References[r];
            _refs.push( _cr );
            // any nested types?
            if( isDefined( _cr.TypeInstance ) ) {
                var _nestedRefs = TBPTNI.recursivelyGetReferences( { Item: _cr.TypeInstance } );
                if( _nestedRefs.length > 0 ) for( r in _nestedRefs ) _refs.push( _nestedRefs[r] );
            }
        }
    }
    return( _refs );
}// TBPTNI.recursivelyGetReferences = function( args )


// params: StartingNode; ObjectDefinition; TranslateBrowsePathsToNodeIdsHelper, SuppressMessaging, Level
// out: string[] containing test-results 
TBPTNI.GetTestResults = function( args ) {
    if( !isDefined( args ) ) throw( "TBTNI.PrintTestResults::args not specified." );
    if( !isDefined( [ args.StartingNode, args.ObjectDefinition, args.TranslateBrowsePathsToNodeIdsHelper ] ) ) throw( "TBTNI.PrintTestResults::arguments not specified." );
    if( !isDefined( args.SuppressMessage ) ) args.SuppressMessaging = false;
    var result = true;
    // get the object definition in a flat list
    var allObjectDefinitionReferences = TBPTNI.recursivelyGetReferences( { Item: args.ObjectDefinition } );
    // there is a 1-to-1 mapping between the object-definition, and the results of TranslateBrowsePathsToNodeIds 
    for( var i=0; i<allObjectDefinitionReferences.length; i++ ) {
        // get the name of the item that we're looking for
        var msg = args.ObjectDefinition.Name + 
            TBPTNI.BrowsePathsToString( {
                    Paths: args.TranslateBrowsePathsToNodeIdsHelper.Request.BrowsePaths[i],
                    ShowNumber: false
                    } );
        // add a message that says if we found it or not
        msg += " ==>" + ( args.TranslateBrowsePathsToNodeIdsHelper.Response.Results[i].StatusCode.isGood() ? "[ok]" : "[NOT FOUND]" );
        // if it wasn't found, was it OPTIONAL? either log an error, or warning
        if( args.TranslateBrowsePathsToNodeIdsHelper.Response.Results[i].StatusCode.isBad() ) {
            if( allObjectDefinitionReferences[i].Required ) {
                msg += " REQUIRED";
                addError( msg );
                result = false;
            }
            else { 
                msg += " --- Optional"
                addWarning( msg );
            }
        }
        // show what was found:
        if( !args.SuppressMessaging ) print( msg );
    }//for i...
    // return our test results analysis
    return( result );
}


 /* Unit test code //
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/Objects/monitoredItem.js" );
include( "./maintree/Base Information/Base Info Core Structure/test cases/serverObject.js" );
var stopAt = UaDateTime.utcNow();
stopAt.addSeconds( 10 );
var n = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server ) )[0];
if( isDefined( n ) ) { 
    var g_channel = new UaChannel();
    var Test.Session.Session = new UaSession( g_channel );
    Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
    connect( g_channel, Test.Session.Session );
    activateSession( Test.Session.Session );
    try{

    var objectDef = new IM_ServerType();
    var tbptnidHelper = new TranslateBrowsePathsHelper( Test.Session.Session );
    TBPTNI.CheckChildStructure( n, objectDef, tbptnidHelper );
    print( "\n\n\n**** Test Results: \n" );
    TBPTNI.GetTestResults( {
                StartingNode: n, 
                ObjectDefinition: objectDef,
                TranslateBrowsePathsToNodeIdsHelper: tbptnidHelper } );
    }
    catch( e )
    {
        print( "** EXCEPTION: " + e.toString() );
    }
}

disconnect( g_channel, Test.Session.Session );
// */