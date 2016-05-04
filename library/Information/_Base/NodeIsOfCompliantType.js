/*  This function is responsible for validating a Node of a specific type and the validation
    that every entity of the Node is correct, per the UA Specifications.

    Revision History:
        12-Nov-2010 NP: Initial version.
*/
include( "./library/Base/assertions.js" );
include( "./library/Base/Objects/expectedResults.js" );
include( "./library/ServiceBased/AttributeServiceSet/Read.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse.js" );
include( "./library/Information/_Base/CttObjectHelpers.js" );

String.prototype.repeat = function(num) {    return new Array(isNaN(num)? 1 : ++num).join(this);    }

var __maxNodesToTest = 0;
var __maxErrors = 100;
var __nodesCounted = 0;
var __maxNodesReached;

const SUPPRESS_MESSAGES = true;
const EXPECT_ERR_NOT_FAIL = true;

function endOfWalkthroughTest() {
    if( __maxNodesReached === undefined ) {
        addLog( "Maximum number of nodes to test reached: " + __maxNodesToTest + ". Exiting test." );
        __maxNodesReached = true;
    }
}// function endOfWalkthroughTest()

function resetWalkthroughTest( newMaxValue ) {
    __maxNodesReached = undefined;
    __maxNodesToTest = newMaxValue;
    __nodesCounted = 0;
}// function resetWalkthroughTest( newMaxValue )

function findAttributeInReadRequest( attributeId, request ) {
    if( !isDefined( [ attributeId, request, request.length ] ) ){ throw( "NodeIsOfCompliantType::findAttribute() arguments not specified." ); }
    if( request.length > 0 ) for( var i=0; i<request.length; i++ ) if( request[i].AttributeId === attributeId ) return( i );
    return( -1 );
}// function findAttributeInReadRequest( attributeId, request )

/* FUNCTIONS IN THIS SCRIPT:
    Public: 
        function NodeAttributesComply( nodeToTest, validationFactory )
        function NodeReferencesComply( nodeToTest, validationFactory )
        function NodeStructureIsCompliant( nodeToTest, validationSub, level )
        function ReadNode( nodeToTest, factoryNodeValidator )
    Private: 
        function assertReferenceInReferences( referencesToFind, referencesToSearch, indent )
*/



/*  Description: 
        Reads the ATTRIBUTES of 'nodeToTest' and compares them to the definition 
        specified by 'validationSub'.

    Arguments:
        nodeToTest:   a UaNode to test of type MONITOREDITEM. This parameter may also be an array of MONITOREDITEM.
        validationSub: a reference to an actual function containing a single argument: NodeId
*/
function NodeAttributesComply( nodeToTest, validationFactory ) { 
    if( ( errCount ) >= __maxErrors ) { addError( "DEBUG: Exceeded the max. number of errors(" + __maxErrors + ") found within the address-space. Aborting test. [a]" ); return( false ); }
    // validate parameters
    if( !isDefined( nodeToTest ) ) throw( "[NodeAttributesComply] Argument error: 'nodeToTest' not specified." );
    if( !isDefined( validationFactory ) ) throw( "[NodeAttributesComply] Argument error: 'validationFactory' not specified." );

    var result = true;

    var expectedResults = [];
    var itemsToRead = [];
    // get the applicable attributes that we need to read from the factory
    var validationSub = validationFactory( nodeToTest );

    var msg = "\nValidating ATTRIBUTES of Node '" + nodeToTest.NodeId + "' comply with the definition of '" + validationSub.Name + "'. Attributes include:\n";

    // specify Read options, i.e. read all Attributes defined in validationSub , this basically means 
    // that we need to take the 'nodeToTest' and clone it multiple times, once per attribute needed.
    // We also need to prepare the read to accept missing attributes, i.e. those that are OPTIONAL
    for( var a=0; a<validationSub.Attributes.length; a++ ) {
        // clone the item and define the attribute to read on it
        var mClone = MonitoredItem.Clone( nodeToTest );
        mClone.AttributeId = validationSub.Attributes[a].AttributeId;
        itemsToRead.push( mClone );
        // define the expectation for reading this attribute
        var expectedResult = new ExpectedAndAcceptedResults( StatusCode.Good );
        // if attribute = Value, then also allow status Uncertain_InitialValue, or Bad_NotReadable
        expectedResult.addAcceptedResult( [ StatusCode.UncertainInitialValue, StatusCode.BadNotReadable ] );
        // if the attribute is optional, then allow the server to return BadAttributeIdInvalid
        if( false === validationSub.Attributes[a].Required ) expectedResult.addAcceptedResult( StatusCode.BadAttributeIdInvalid );
        expectedResults.push( expectedResult );
        // append the attribute to the message that we will log. Provides helpful diagnostic info.
        msg += "[" + a + "]=" + Attribute.toString( validationSub.Attributes[a].AttributeId ) + "; ";
    }//for a=... (a = attributes)

    addLog( msg );
    // Read all of the attributes
    ReadHelper.Execute( {
            NodesToRead: itemsToRead, 
            TimestampsToReturn: TimestampsToReturn.Both, 
            MaxAge: 0, 
            OperationResults: expectedResults, 
            SuppressMessages: true,
            SuppressWarnings: true } );

    // do we have WriteMask and UserWriteMask? if so, then make sure UserWriteMask is more restrictive than WriteMask
    var writeMaskIndex = findAttributeInReadRequest( Attribute.WriteMask, ReadHelper.Request.NodesToRead );
    if( writeMaskIndex !== -1 ) {
        var userWriteMaskIndex = findAttributeInReadRequest( Attribute.UserWriteMask, ReadHelper.Request.NodesToRead )
        if( !userWriteMaskIndex ) addWarning( "WriteMask is supported, but UserWriteMask is not." ); 
        else AssertBitmaskSameOrRestricted( ReadHelper.Response.Results[writeMaskIndex].Value, ReadHelper.Response.Results[userWriteMaskIndex].Value, "The UserWriteMask must be a restricted version of WriteMask (it cannot add capabilities)." );
    }

    return( result );
}// function NodeAttributesComply( nodeToTest, validationFactory )


/*  Description: 
        Browse the REFERENCES of 'nodeToTest' and compare them to the definition 
        specified by 'validationSub'.

    Arguments:
        nodeToTest:       a UaNode to test of type MONITOREDITEM. May also be an Array of MONITOREDITEM.
        validationFactory: a reference to a factory pattern object that will return the definition of the specified object.
*/
function NodeReferencesComply( nodeToTest, validationFactory ) {
    if( ( errCount ) >= __maxErrors ) { addError( "DEBUG: Exceeded the max. number of errors(" + __maxErrors + ") found within the address-space. Aborting test. [b]" ); return( false ); }

    // specify browse options, incl. inclSubTypes, nodeMask=unspecified, refType=hierarchical, resultMask=all;
    var definedNodeClass = nodeToTest.NodeClass;
    nodeToTest.SetBrowseOptions( BrowseDirection.Forward, true, NodeClass.Unspecified, new UaNodeId( Identifier.References ), BrowseResultMask.All );

    // read the references for all specified nodes
    if( BrowseHelper.Execute( { NodesToBrowse: nodeToTest, SuppressMessaging: false } ) ) {
        // recursively check each reference returned - if any
        for( var i=0; i<BrowseHelper.Response.Results.length; i++ ) {
            var currResult = BrowseHelper.Response.Results[i];
            if( currResult.References.length === 0 ) result = true;
            else {
                for( var r=0; r<currResult.References.length; r++ ) {
                    var currRef = currResult.References[r];
                    // turn the reference NodeId into a MonitoredItem object because we will test it next...
                    var newMi = MonitoredItem.fromNodeIds( currRef.NodeId.NodeId, 0 )[0];
                    newMi.NodeClass = currRef.NodeClass;

                    // validate the references received for this item match what is expected, if any are defined!
                    var validationObject = validationFactory( currRef.NodeClass );

                    // log an easy to read message about the references we seek for this node
                    var msg = "Validating REFERENCES of NodesToTest: " + nodeToTest.NodeId + " (Browse.NodesToBrowse: '" + BrowseHelper.Request.NodesToBrowse[0].NodeId + "' comply with the definition of '" + validationObject.Name + "'.";
                    for( var refNo=0; refNo<validationObject.References.length; refNo++ ) {
                        var cr = validationObject.References[refNo];
                        msg += "\n\t["+refNo+"] expects BrowseName: '" + cr.BrowseName + "'; ReferenceTypeId: '" + cr.ReferenceTypeId + "'.";
                    }//for r...
                    addLog( msg );

                    if( validationObject !== null && validationObject.References !== undefined ) {
                        nodeToTest.NodeClass = definedNodeClass;
                        result = assertReferenceInReferences( validationObject.References, currResult.References, undefined, nodeToTest )
                    }

                    // recursively dive deeper into this node... if the validation so far is good!
                    result = ReadNode( newMi, validationFactory );
                    if( result === null ) break;
                    if( result ) {
                        if( !result ) {
                            addError( "ReadNode returned " + result );
                            break; 
                        }
                    }
                }//for r... (r = References)
            }
        }// for i... (i = item)
    }
}// function NodeReferencesComply( nodeToTest, validationFactory )

/*  Description: 
        Reads the REFERENCES of 'nodeToTest' and compares its structure to the 
        definition specified by the 'validationSub' object.

    Arguments:
        nodeToTest:    a UaNode to test of type MONITOREDITEM.
        validationSub: a reference to an actual function containing a single argument: NodeId
        level:         internal use only; used for indenting messages
*/
function NodeStructureIsCompliant( nodeToTest, validationSub, level ) {
    if( ( errCount ) >= __maxErrors ) { addError( "Exceeded the max. number of errors(" + __maxErrors + ") found within the address-space. Aborting test. [a]" ); return( false ); }
    if( !isDefined( level) ) level = 0;
    var indent = "\t".repeat( level );

    // validate the parameters
    if( nodeToTest === undefined || nodeToTest === null ){ throw( "[NodeStructureIsCompliant] Argument error: 'nodeToTest' not specified." ); }
    if( validationSub === undefined || validationSub === null ){ throw( "[NodeStructureIsCompliant] Argument error: 'validationSub' not specified." ); }
    if( validationSub.References === undefined || validationSub.References === null ){ throw( "[NodeStructureIsCompliant] Argument error: 'validationSub' is not of the correct type; 'References' property not found." ); }

    // specify browse options, incl. inclSubTypes, nodeMask=unspecified, refType=hierarchical, resultMask=all;
    nodeToTest.SetBrowseOptions( BrowseDirection.Forward, true, NodeClass.Unspecified, new UaNodeId( Identifier.References ), BrowseResultMask.All );

    var result = true;

    // browse all references of the target node 
    if( BrowseHelper.Execute( { NodesToBrowse:nodeToTest, SuppressMessaging: true } ) ) {
        // get the names of the references into a string
        var referenceNames = [];
        for( var r=0; r<BrowseHelper.Response.Results[0].References.length; r++ ) referenceNames.push( BrowseHelper.Response.Results[0].References[r].BrowseName.Name );
        addLog( indent + "Validating " + validationSub.Name + "; received " + BrowseHelper.Response.Results[0].References.length + " references: [" + referenceNames.toString() + "]." );
        // iterate thru the References returned and compare to our definition in validationSub
        for( var r=0; r<validationSub.References.length; r++ ) {
            var currentRef = validationSub.References[r];
            var foundRefNodeId = assertReferenceInReferences( currentRef, BrowseHelper.Response.Results[0].References, indent, nodeToTest );
            // is this a nested type (sub-references)? if so, then recursively drill down further...
            if( foundRefNodeId !== null && currentRef.TypeInstance !== undefined && currentRef.TypeInstance !== null && foundRefNodeId !== true ) {
                var subNode = MonitoredItem.fromUaRefDescHelper( foundRefNodeId.NodeId, nodeToTest.BrowseDirection, nodeToTest.IncludeSubTypes, currentRef );
                Assert.True( NodeStructureIsCompliant( subNode, currentRef.TypeInstance, level+1 ), currentRef.TypeInstance.Name + " object type is not compliant per the UA Specifications." );
            }
        }//for r (references)
    }
    return( result );
}// function NodeStructureIsCompliant( nodeToTest, validationSub, level )

/* Internal only function that serves the methods above.
   This function looks for all of the references specified in 'referencesToFind' to see if they are present in
   the parameter 'referencesToSearch'.
*/
var errCount=0;
function assertReferenceInReferences( referencesToFind, referencesToSearch, indent, nodeToTest ) {
    var result = false;
    if( !isDefined( referencesToFind ) ){ return( result ); }
    if( !isDefined( referencesToSearch ) ){ return( result ); }
    // turn 'referenceToFind' into an array if itsn't already one!
    if( referencesToFind.length === undefined ){ referencesToFind = [ referencesToFind ]; }
    // iterate thru referencesToSearch looking for referenceToFind
    for( var f=0; f<referencesToFind.length; f++ ) {
        var currentlySoughtRef = referencesToFind[f];
        if( currentlySoughtRef.NodeClasss === undefined || currentlySoughtRef.NodeClass === null ) continue;

        if( !isDefined( currentlySoughtRef ) ) continue;
        if( referencesToFind[f].ReferenceTypeId === null ) continue;
        var found = false;
        for( var s=0; s<referencesToSearch.length; s++ ) {
            var currentRef = referencesToSearch[s];
            // check BrowseName (standard name, DisplayName is not important)
            if( !(currentlySoughtRef.BrowseName instanceof Array ) ) currentlySoughtRef.BrowseName = [ currentlySoughtRef.BrowseName ];
            for( var b=0; b<currentlySoughtRef.BrowseName.length; b++ ) {
                found = ( currentRef.BrowseName.Name === currentlySoughtRef.BrowseName[b]
                          && currentlySoughtRef.ReferenceTypeId === currentRef.ReferenceTypeId );
                if( referencesToFind.length === 1 ) result = currentRef.NodeId;
                else result = true;
                break;
            }// for b...
            if( found )break;
        }//for s... (s = searchable references)
        if( !found ) {
            // we didn't find the reference, but is it optional?
            var msg = "Reference (type: '" + currentlySoughtRef.ReferenceTypeId + "') with BrowseName '" + currentlySoughtRef.BrowseName + "' is missing on NodeId: " + nodeToTest.NodeId;
            if( currentlySoughtRef.BrowseName instanceof Array && currentlySoughtRef.BrowseName.length > 1 ) msg += " (only one would be necessary since they derive from the same type)";
            if( currentlySoughtRef.Required ) {
                msg += " , although it is required!";
                addError( msg  );
                errCount++;
            }
            else {
                msg += ", but it is OPTIONAL!";
                addWarning( msg  );
                result = true;
            }// else <- if( currentlySoughtRef.Required )
        }// if( !found )
    }//for f... (f = find reference);
    return( result );
}// function assertReferenceInReferences( referencesToFind, referencesToSearch, indent )



/* Validates a node for compliance by doing two things:
     1.) Reads the attributes of a node and validates all required attributes exist.
     2.) Reads all FORWARD references of the same node to validate all required references exist.

   Arguments:
       nodeToTest:    the MonitoredItem object that will receive testing.

    Revision History
        25-May-2011 NP: Initial version.
*/
function ReadNode( nodeToTest, factoryNodeValidator ) {
    if( __nodesCounted >= __maxNodesToTest ) {
        endOfWalkthroughTest();
        return( true );
    }
    var orginalNodeClass = nodeToTest.NodeClass;
    __nodesCounted++;
    print( "\t***** nodes counted: " + __nodesCounted + " of " + __maxNodesToTest + " *****" );
    var result = false;
    // read the item first; if it complies then read its references and follow them
    if( NodeAttributesComply( nodeToTest, factoryNodeValidator ) ) {
        // specify Browse options, incl. inclSubTypes, nodeMask=unspecified, refType=hierarchical, resultMask=all;
        nodeToTest.SetBrowseOptions( BrowseDirection.Forward, true, NodeClass.Unspecified, new UaNodeId( Identifier.References ), BrowseResultMask.All );
        // issue the Browse call
        if( BrowseHelper.Execute( { NodesToBrowse: nodeToTest, SuppressMessaging: true } ) ) {
            // loop thru each browseResult and follow each link (reference)
            for( var br=0; br<BrowseHelper.Response.Results.length; br++ ) {
                var currResult = BrowseHelper.Response.Results[br];
                if( currResult.StatusCode.isGood() ) {
                    for( var r=0; r<currResult.References.length; r++ ) {
                        var currRef = currResult.References[r];
                        // turn the reference NodeId into a MonitoredItem object
                        var newMi = MonitoredItem.fromNodeIds( currRef.NodeId.NodeId, 0 )[0];
                        newMi.NodeClass = currRef.NodeClass;
                        newMi.SetBrowseOptions( BrowseDirection.Forward, true, currRef.NodeClass, new UaNodeId( Identifier.References ), BrowseResultMask.All );
                        // recursively search the referred item, only if it exists!
                        if( isDefined( newMi ) ) {
                            result = ReadNode( newMi, factoryNodeValidator );
                            if( !result ) break; 
                        }

                    }// for r (r = references)
                    result = true; // [DEBUG NP] not sure if this is the right place yet. */
                }
            }//for br
        }// browse succeeded?
        if( __nodesCounted < __maxNodesToTest ) {
            nodeToTest.NodeClass = orginalNodeClass;
            NodeReferencesComply( nodeToTest, factoryNodeValidator );
        }
    }
    Assert.True( result, "Expected successful validation of NodeId: " + nodeToTest.NodeId + "." );
    return( result );
}// function ReadNode( nodeToTest, factoryNodeValidator )