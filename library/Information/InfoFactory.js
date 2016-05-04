/* ---------------------------------------------------------------------------------------------------------------
   Information Model Validation Routines, based on the test-cases defined by the Compliance Working Group (CMPWG).
   CMPWG Participants: Tim Fortin, Paul Hunkar, Alin Moldovean, Petr Staif, Nathan Pocock.
   Scripted by: Nathan Pocock (nathan.pocock@opcfoundation.org) Feb, 2015.
   ---------------------------------------------------------------------------------------------------------------
   About this Script:
       Tests are grouped by NodeClass, then by Attributes, References, or Other; test functions exist within each.
       An address-space "walker" will be invoked externally from this script; this script contains checks only.
       The address-space "walker" will recursively walk through the address space. Upon landing on a Node, that
       NodeId will be passed into the ***************** function within this script.
       The ***************** function will serve as a Factory to determine the NodeClass and retrieve the list
       of tests (within this script) to invoke. The factory will then recursively invoke all tests for the
       NodeClass. Each test may invoke further Browse and/or Read requests of its own.
   --------------------------------------------------------------------------------------------------------------- */
include( "./library/Base/Objects/dictionary.js" );
include( "./library/Base/Objects/keyPairCollection.js" );

const MAX_NODES_TO_CHECK = 50;


var TestResult = { NotImplemented: 4, Skipped: 3, Pass: 2, Fail: 1, Error: 0 };
TestResult.Set = function( cv, nv ) {
    return( cv > nv ? nv : cv );
}
TestResult.toString = function( obj ) { 
    for( var k in this ) if( obj === this[k] ) return( k );
}

/* Punch-list:
    Object:        DONE
    ObjectType:    DONE
    Variable:      References: TypeDefinition
    VariableType:  DONE
    Method:        DONE
    DataType:      References: HasEncoding
    ReferenceType: Others
    View:          Referneces: ServerObject, SourceNode.
*/

var InformationModelValidation = new Object();
InformationModelValidation = {
        Stash: new Dictionary(),
        Results: new KeyPairCollection(),
        Common: {
            References: {
                    HierarchicalReferences: function( args ) {
                                        var result = TestResult.Pass;
                                        if( !isDefined( args.BrowseResponse ) || !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        var found = false;
                                        for( var r=0; r<args.BrowseResponse.length; r++ ) { //search through all references, looking for any hierarchical types...
                                            if( HierarchicalReferences.Contains( args.BrowseResponse[r].ReferenceTypeId ) ) { //is this a hierarchical reference?
                                                found=true;
                                                // TEST ONE: SourceNode and TargetNode are NOT the same! (self-references are not allowed)
                                                // Excel: 42
                                                if( !Assert.NotEqual( args.ReadResponse[0].Value.toNodeId(), args.BrowseResponse[r].NodeId.NodeId, "Hierarchical References should not point to themselves. See UA Part 3, section 7.3." ) ) { 
                                                    result = TestResult.Fail;
                                                }//found a match?
                                            }//hierarchical ref found
                                        }//iterate thru references
                                        if( !found ) result = TestResult.Skipped;
                                        return( result );
                            },
                    HasModellingRule: function( args ) {
                                        // should ONLY apply to Object, Variable, or Method 
                                        // Excel: 46
                                        var result = TestResult.Pass;
                                        if( !isDefined( args.ReadResponse ) || !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        var expectedTypes = [ NodeClass.Object, NodeClass.Variable, NodeClass.Method ];
                                        var hasModellingRuleNodeId = new UaNodeId( Identifier.HasModellingRule );
                                        var found = false;
                                        for( var r=0; r<args.BrowseResponse.length; r++ ) { //iterate thru all browse results (references)
                                            if( hasModellingRuleNodeId.equals( args.BrowseResponse[r].ReferenceTypeId ) ) { // is this HasModellingRule?
                                                found = true;
                                                if( !Assert.True( ArrayContains( expectedTypes, args.ReadResponse[1].Value.toInt32() ), "HasModellingRule must be used by an Object, Variable, or Method. Detected NodeClass: " + NodeClass.toString( args.ReadResponse[1].Value.toInt32() ) + "." ) ) result = TestResult.Fail;
                                                // Now check that the TARGET is of type ModellingRule or Sub-type.
                                                var modellingRuleNodeIds = [
                                                    new UaNodeId( Identifier.ModellingRuleType ),
                                                    new UaNodeId( Identifier.ModellingRule_Mandatory ),
                                                    new UaNodeId( Identifier.ModellingRule_Optional ),
                                                    new UaNodeId( Identifier.ModellingRule_ExposesItsArray ),
                                                    new UaNodeId( Identifier.ModellingRule_CardinalityRestriction ),
                                                    new UaNodeId( Identifier.ModellingRule_MandatoryShared ) ];
                                                if( !( ArrayContains( modellingRuleNodeIds, args.BrowseResponse[r].NodeId.NodeId ) ) ) {
                                                    if( !_seekNodeIsOfType( { TypeSought: new UaNodeId( Identifier.ModellingRuleType ), NodeToSearch: args.BrowseResponse[r].NodeId } ) ) {
                                                        addError( "HasModellingRule '" + args.BrowseResponse[r].DisplayName + "' on NodeId: " + args.BrowseRequest[0].NodeId + " must point to a ModellingRule type, but points to NodeId '" + args.BrowseResponse[r].NodeId + "' which does not derive from ModellingRuleType." );
                                                        result = TestResult.Fail;
                                                    }
                                                }
                                            }// matched has modelling rule type?
                                        }//for r..
                                        if( !found ) result = TestResult.Skipped;
                                        return( result );
                            },
                    HasSubtype:   function( args ) {
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            if( !isDefined( args.BaseType ) ) return( TestResult.Skipped ); // if this isn't present, then it probably wasn't called in the controlled manner we want
                                            const NODECLASS=1;
                                            // Optional reference, so it might not be found; 0..* allowed
                                            var hasSubtypeNodeId = new UaNodeId( Identifier.HasSubtype );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( args.BrowseResponse[i].ReferenceTypeId.equals( hasSubtypeNodeId ) ) {
                                                    found = true;
                                                    // TEST ONE: make sure derived type inherits direcly from this node (excluding 'BaseDataType')
                                                    //           or derives from it...
                                                    // Excel: 21
                                                    // Excel: 44
                                                    if( args.ReadRequest[0].NodeId.equals( args.BaseType ) ) { // if it matches a base-type directly, then there's
                                                        found = true;                                          // no need to test it; just exist
                                                        break;
                                                    }
                                                    else if( args.BaseType.equals( args.BrowseResponse[i].NodeId.NodeId ) ) { // immediate reference to the parent type?
                                                        found = true;
                                                        break;
                                                    }
                                                    else { // recursively walk UP the chain to see if the target derives from ObjectType
                                                        if( !_seekNodeIsOfType( { NodeToSearch: args.BrowseResponse[i].NodeId, 
                                                                                    TypeSought: args.BaseType,
                                                                                    BrowsePath: args.BrowsePath } ) ) result = TestResult.Fail;
                                                    }
                                                    // follow the target references to see if there's a reference BACK to this type...
                                                    var xBrowseHelper = new BrowseService( { Session: Test.Session } );
                                                    var itemToBrowse = MonitoredItem.fromNodeIds( args.BrowseResponse[i].ReferenceTypeId )[0];
                                                    itemToBrowse.BrowseDirection = BrowseDirection.Inverse;
                                                    if( !xBrowseHelper.Execute( { NodesToBrowse: itemToBrowse, SuppressMessaging: true, SuppressWarnings: true } ) ) result = TestResult.Fail;
                                                    else {
                                                        // look for the inverse reference (HasSubtype) called "SubtypeOf"
                                                        for( var br=0; br<xBrowseHelper.Response.Results[0].References.length; br++ ) {
                                                            if( hasSubtypeNodeId.equals( xBrowseHelper.Response.Results[0].References[br].ReferenceTypeId ) ) {
                                                                if( xBrowseHelper.Response.Results[0].References[br].ReferenceTypeId.IsForward ) {
                                                                    addError( "Recipient of HasSubtype reference is marked 'IsForward=true' which is not valid." );
                                                                    result = TestResult.Fail;
                                                                }
                                                            }//found it
                                                        }//for br..
                                                    }//if !browse
                                                    // TEST TWO: TargetNode is of the same NodeClass as it's parent type (exceptBaseDataType)
                                                    // Excel: 21
                                                    var nodeClassValue = args.ReadResponse[NODECLASS].Value.toInt32();
                                                    if( !Assert.Equal( nodeClassValue, args.BrowseResponse[i].NodeClass, "NodeClass (" + NodeClass.toString( nodeClassValue ) + ") on derived type does not match the NodeClass (" + NodeClass.toString( args.BrowseResponse[i].NodeClass ) + ") on the parent type.\nNodeId: " + args.BrowseRequest[i].NodeId + "\nBrowse Path: " + args.BrowsePath ) ) result = TestResult.Fail;
                                                    // TEST THREE: Make sure the TypeDefinition node has derived types which each have a unique name
                                                    var browseNames = [];
                                                    for( var r=0; r<xBrowseHelper.Response.Results[0].References.length; r++ ) { // iterate thru all browse results 
                                                        if( xBrowseHelper.Response.Results[0].References[r].IsForward ) { // is this a forward ref? (that's all we are interested in)
                                                            if( hasSubtypeNodeId.equals( xBrowseHelper.Response.Results[0].References[r].ReferenceTypeId ) ) { // derives from the parent?
                                                                var thisBrowseName = xBrowseHelper.Response.Results[0].References[r].BrowseName.Name;
                                                                if( !Assert.False( ArrayContains( browseNames, thisBrowseName ), "BrowseName '" + thisBrowseName + "' is not unique. A type cannot be derived twice and have the same BrowseName" ) ) result = TestResult.Fail;
                                                                else browseNames.push( thisBrowseName ); // remember the browse name
                                                            }
                                                        }//forward ref is found
                                                    }//iterate thru all browse results
                                                    // clean up
                                                    xBrowseHelper = null;
                                                }
                                            }//for i...
                                            // TEST FOUR: Multiple inheritence test
                                            // Excel: 22
                                            var subtypeOfCount = 0;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {    // loop thru the browse searching for inverse refs; 'subtypeOf;'
                                                if( args.BrowseResponse[i].IsForward === false ) { // inverse ref?
                                                    if( hasSubtypeNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) subtypeOfCount++; // subtype?
                                                }
                                            }//for i...
                                            if( subtypeOfCount > 1 ) {
                                                addError( "Multiple inheritence detected on Node: " + args.BrowseRequest[0].NodeId + ". SubtypeOf count: " + subtypeOfCount + ".\nUA Part 3 section 5.3.3.3." );
                                                result = TestResult.Fail;
                                            }
                                            if( !found ) result = TestResult.Skipped;
                                            return( result );
                    },
            },
            Properties: {
                BrowseNameUniquenessTest: function( args ){ // OK
                                            if( !isDefined( args ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            var result = TestResult.Pass;
                                            // iterate over ALL properties and check that each has a unique name
                                            var propertyNameDictionary = new Dictionary();
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            for( var r=0; r<args.BrowseResponse.length; r++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[r].ReferenceTypeId ) ) {
                                                    // is the BrowseName in our dictionary? if not, add it
                                                    var browseName = args.BrowseResponse[r].BrowseName.Name;
                                                    if( !Assert.False( propertyNameDictionary.Contains( browseName ) ), "Property '" + browseName + "' is listed more than once under the same parent.\nBrowse Path: " + args.BrowsePath ) propertyNameDictionary.Add( browseName );
                                                }//found a property
                                            }//for r...
                                            propertyNameDictionary = null;
                                            return( result );  },
                SameServerTest:  function( args ){
                                            if( !isDefined( args ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            var result = TestResult.Pass;
                                            // iterate over ALL properties and check resides within same Server
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            for( var r=0; r<args.BrowseResponse.length; r++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[r].ReferenceTypeId ) ) {
                                                    // check the NodeId.ServerIndex is 0
                                                    if( !Assert.Equal( 0, args.BrowseResponse[r].NodeId.ServerIndex, "Properties must exist within *this* Server, as specified by the NodeId.ServerIndex.\nBrowse Path: " + args.BrowsePath ) ) result = TestResult.Fail;
                                                }//found a property
                                            }//for r...
                                        return( result );  },
            },
            },
        Object: {
            Attributes: {
                Mandatories: function( args ) { // Excel: 27
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                    // get the REQUIRED attributes for type OBJECT
                                    var requiredAttributes = new NodeTypeAttributesMatrix().Object;
                                    var requiredAttributeTypes = new NodeTypeAttributesMatrix().Object_Types;
                                    // iterate through all required attributes searching for them in the read response
                                    while( requiredAttributes.length > 0 ) {
                                        var currentAttribute = requiredAttributes.pop();
                                        var currentAttributeType = requiredAttributeTypes.pop();
                                        var found = false;
                                        // iterate through the read request to find the request, then use its' position to find the result
                                        for( var i=0; i<args.ReadRequest.length; i++ ) {
                                            if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                // make sure it exists and then make sure the type is correct
                                                if( Assert.Equal( StatusCode.Good, args.ReadResponse[i].StatusCode.StatusCode, "Attribute '" + Attribute.toString( currentAttribute ) + "' not found (Position: " + i + ")" ) ) found = TestResult.Fail;
                                                if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                // EventNotifier attribute? if so, value should be 0-3 only
                                                if( currentAttribute === Attribute.EventNotifier ) {
                                                    Assert.InRange( 0, 3, args.ReadResponse[i].Value.toByte(), "Attribute 'EventNotifier' value is set incorrectly." );
                                                }// if event notifier
                                                break;
                                            }//found the attribute
                                        }//for i...
                                        if( !found ) { 
                                            result = TestResult.Fail;
                                            addError( "Missing attribute '" + Attribute.toString( currentAttribute ) + "' on Node '" + args.Node.NodeId + "'. NodeClass: Object" );
                                        }
                                    }//while
                                    return( result ); }, //function
                Optionals:   function( args ){ // Excel: 27
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                    // get the OPTIONAL attributes for type OBJECT
                                    var optionalAttributes = new NodeTypeAttributesMatrix().Object_Optional;
                                    var optionalAttributeTypes = new NodeTypeAttributesMatrix().Object_Optional_Types;
                                    // iterate through all optional attributes searching for them in the read response
                                    var found = false;
                                    while( optionalAttributes.length > 0 ) {
                                        var currentAttribute = optionalAttributes.pop();
                                        var currentAttributeType = optionalAttributeTypes.pop();
                                        // iterate through the read request to find the request, then use its' position to find the result
                                        for( var i=0; i<args.ReadRequest.length; i++ ) {
                                            if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                found = true;
                                                // check the data-type ONLY if the status code is good
                                                if( args.ReadResponse[i].StatusCode.isGood() ) {
                                                    if( args.ReadResponse[i].Value.DataType != BuiltInType.Null ) {
                                                        if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    }
                                                }
                                                break;
                                            }//found the attribute
                                        }//for i...
                                    }//while
                                    if( !found ) result = TestResult.Skipped;
                                    return( result ); },
                Missing:     function( args ){ // Excel: 27
                                    var result = TestResult.Pass;
                                    if( !isDefined( args.ReadRequest ) || !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                    var nodetypeMatrix = new NodeTypeAttributesMatrix();
                                    var missingAttributes = nodetypeMatrix.AllExcept( nodetypeMatrix.Object.concat( nodetypeMatrix.Object_Optional ) );
                                    while( missingAttributes.length > 0 ) {
                                        var currentMissingAttribute = missingAttributes.pop();
                                        // iterate thru the read request to find the position of the read request 
                                        for( var i=0; i<args.ReadRequest.length; i++ ) {
                                            if( args.ReadRequest[i].AttributeId === currentMissingAttribute ) {
                                                // make sure the call failed
                                                if( !Assert.False( args.ReadResponse[i].StatusCode.isGood(), "Attribute '" + Attribute.toString( currentMissingAttribute ) + "' was found, which is neither Required or Optional." ) ) result = TestResult.Fail;
                                                break;
                                            }//found the attribute
                                        }//for i...
                                    }//while
                                    return( result ); },
                },
            References: {
                HasComponent:    function( args ){
                                    // Excel: 43
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                    // look for HasComponent; it's NOT required
                                    var hasComponentNodeId = new UaNodeId( Identifier.HasComponent );
                                    var found = false;
                                    for( var i=0; i<args.BrowseResponse.length; i++ ){
                                        if( args.BrowseResponse[i].IsForward ) { // we only care about forward references
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( hasComponentNodeId ) ) {
                                                found = true;
                                                // TEST ONE: Target must be Objects, DataVariables, or Methods.
                                                if( !Assert.True( ArrayContains( [ NodeClass.Object, NodeClass.Variable, NodeClass.Method ], args.BrowseResponse[i].NodeClass ), "HasComponent should point to an Object, Variable, or Method; when attached to an Object.\nFound: " + NodeClass.toString( args.BrowseResponse[i].NodeClass ) + "\nUA Part 3 section 8.8, paragraph 2" ) ) result = TestResult.Fail;
                                            }// we found the HasComponent
                                        }// forward ref?
                                    }//for i..
                                    if( !found ) result = TestResult.Skipped;
                                    return( result ); },// function
                HasProperty:      function( args ) { 
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) && !isDefined( args.BrowseRequest ) ) return( TestResult.Error );
                                    // look for HasProperty; it's NOT required
                                    var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                    for( var i=0; i<args.BrowseResponse.length; i++ ){
                                        if( args.BrowseResponse[i].ReferenceTypeId.equals( hasPropertyNodeId ) ) {
                                            // TEST ONE: make sure target is of type: Variable
                                            // Excel: 20
                                            if( !Assert.Equal( NodeClass.toString( NodeClass.Variable ), NodeClass.toString( args.BrowseResponse[i].NodeClass ), "HasProperty does not point to a Variable type.\nLook at NodeId: " + args.BrowseRequest[0].NodeId + "\nBrowse Path: " + args.BrowsePath ) ) result = TestResult.Fail;
                                            // TEST TWO: Browse the references of the node to make sure HasTypeDefinition = PropertyType.
                                            var item = MonitoredItem.fromNodeIds( args.BrowseRequest[0].NodeId )[0];
                                            var xBrowseHelper = new BrowseService( { Session: Test.Session } );
                                            if( !xBrowseHelper.Execute( { NodesToBrowse: item, SuppressMessaging: true, SuppressWarnings: true } ) ) result = TestResult.Error;
                                            else {
                                                // iterate through all references searching for HasTypeDefinition; there should be only one!
                                                if( !Assert.GreaterThan( 0, xBrowseHelper.Response.Results[0].References.length, "Property '" + item.NodeId + "' has no references. It MUST have HasTypeDefinition=PropertyType." ) ) result = TestResult.Fail;
                                                else {
                                                    var found = false;
                                                    var typeDefinitionNodeId = new UaNodeId( Identifier.PropertyType );
                                                    for( var r=0; r<xBrowseHelper.Response.Results[0].References.length; r++ ) {
                                                        if( typeDefinitionNodeId.equals( xBrowseHelper.Response.Results[0].References[r].TypeDefinition.NodeId ) ) {
                                                            // make sure the reference is FORWARD
                                                            if( !Assert.True( xBrowseHelper.Response.Results[0].References[r].IsForward, "HasTypeDefinition IsFoward must equal TRUE." ) ) result = TestResult.Fail;
                                                            else found = true;
                                                        }// found it!
                                                    }// for r...
                                                }// we have references
                                                // was it found?
                                                if( !found ) result = TestResult.Fail;
                                            }// browse
                                            xBrowseHelper = null;
                                        }
                                    }//for i...
                                    return( result ); },
                HasModellingRule: function( args ){
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look for HasModellingRule; part 3 table 6 says instances are 0..1
                                        var hasModellingRuleId = new UaNodeId( Identifier.HasModellingRule );
                                        var safeSourceNodeClasses = [ NodeClass.Object, NodeClass.Variable, NodeClass.Method ];
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( hasModellingRuleId ) && args.BrowseResponse[i].IsForward ) {
                                                found = true;
                                                // TEST ONE - Count of instances
                                                // we've found a modelling rule; does it exist? if not then let's catalog it 
                                                // and make sure there's only one instance; otherwise throw an error
                                                var keyName = args.ReadRequest[0].NodeId + "HasModellingRule";
                                                if( InformationModelValidation.Stash.Contains( keyName ) ) {
                                                    addError( "HasModellingRule exists more than once on NodeId '" + keyName + "'.\nTarget DisplayName: " + args.BrowseResponse[i].DisplayName.Text + "\nBrowse Path: " + args.BrowsePath + "\nPart 3 table 6 states 0..1 instances only." );
                                                    result = TestResult.Fail;
                                                }
                                                else {
                                                    InformationModelValidation.Stash.Add( keyName, 1 );
                                                }
                                                // TEST TWO: Source Node is an Object, Variable, or Method 
                                                if( !Assert.True( ArrayContains( safeSourceNodeClasses, args.ReadResponse[1].Value.toInt32() ), "SourceNode should be an Object, Variable, or Method (part 3, Table 6). SourceNode is '" + NodeClass.toString( args.ReadResponse[1].Value.toInt32() ) + "'" ) ) result = TestResult.Fail;
                                                // TEST THREE: Target Node is Object of type ModellingRule (or sub-type)
                                                if( !hasModellingRuleId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    if(! Assert.Equal( NodeClass.Object, args.BrowseResponse[i].NodeClass, "NodeClass must be Object, but is '" + NodeClass.toString( args.BrowseResponse[0].NodeClass ) + "'.\nCheck UA Part 3 7.12, paragraph 3." ) ) result = TestResult.Fail;
                                                }
                                            }// found our modelling rule?
                                        }//for i
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); },
                HasTypeDefinition:   function( args ){ 
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // TEST ONE: must be at least one instance, and more than one!
                                        // Excel: 28
                                        var hasTypeDefinitionNodeId = new UaNodeId( Identifier.HasTypeDefinition );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( hasTypeDefinitionNodeId ) ) {
                                                found = true;
                                                // make sure there is only ONE instance
                                                var keyName = args.ReadRequest[0].NodeId + "HasTypeDefinition";
                                                if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "HasTypeDefinition is defined more than once. One one instance of this Reference type is allowed per node." ) ) result = TestResult.Fail;
                                                else InformationModelValidation.Stash.Add( keyName, 1 );
                                                // TEST TWO: SourceNode is Object 
                                                var acceptableNodeClassTypes = [ NodeClass.Object ];
                                                if( !Assert.True( ArrayContains( acceptableNodeClassTypes, args.ReadResponse[1].Value.toInt32() ), "HasTypeDefinition should be used by an Object or Variable only." ) ) result = TestResult.Fail;
                                                // TEST THREE: If SourceNode is Object, then TargetNode is ObjectType.
                                                if( args.ReadResponse[1].Value.toInt32() === NodeClass.Object ) {
                                                    if( !Assert.Equal( NodeClass.ObjectType, args.BrowseResponse[i].NodeClass, "HasTypeDefinition, when SourceNode=Object then TargetNode must be ObjectType." ) ) result = TestResult.Fail;
                                                }// is Object
                                            }// we found it
                                        };//for i
                                        if( !Assert.True( found, "HasTypeDefinition is REQUIRED on an Object type." ) ) result = TestResult.Fail;
                                        return( result ); },
                HasEventSource: function( args ){ 
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // Optional reference, so it might not be found; any any number are allowed
                                        var hasEventSourceNodeId = new UaNodeId( Identifier.HasEventSource );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( hasEventSourceNodeId ) ) {
                                                found = true;
                                                // check the SOURCE node is an Object 
                                                if( !Assert.Equal( NodeClass.Object, args.ReadResponse[1].Value.toInt32(), "HasEventSource should be used on Object types only." ) ) result = TestResult.Fail;
                                                // check the SOURCE node has the EventNotifier attribute set to TRUE
                                                if( !Assert.Equal( EventNotifier.SubscribeToEvents, ( args.ReadResponse[11].Value.toByte() & EventNotifier.SubscribeToEvents ), "EventNotifier attribute must be set on the SourceNode whenever HasEventSource reference exists." ) ) result = TestResult.Fail;
                                            }//found our reference type
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); },
                HasNotifier:    function( args ){
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // Optional reference, so it might not be found; any number are allowed
                                        var hasNotifierNodeId = new UaNodeId( Identifier.HasNotifier );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( hasNotifierNodeId ) ) {
                                                found = true;
                                                // check the SOURCE node is an Object or View 
                                                if( !Assert.True( ArrayContains( [ NodeClass.Object, NodeClass.View ], args.ReadResponse[1].Value.toInt32() ), "HasNotifier should be used by an Object or View, only." ) ) result = TestResult.Fail;
                                                // check the SOURCE node has the EventNotifier attribute set to TRUE
                                                if( !Assert.Equal( EventNotifier.SubscribeToEvents, ( args.ReadResponse[11].Value.toByte() & EventNotifier.SubscribeToEvents ), "EventNotifier attribute must be set on the SourceNode whenever HasEventSource reference exists." ) ) result = TestResult.Fail;
                                            }//found our reference type
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); },
                Organizes:      function( args ){ 
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // Optional reference, so it might not be found; any number are allowed
                                        // Excel: 45
                                        var organizesNodeId = new UaNodeId( Identifier.Organizes );
                                        var folderTypeNodeId = new UaNodeId( Identifier.FolderType );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( organizesNodeId ) ) {
                                                found = true;
                                                // check the SOURCE node is an Object or View 
                                                if( !Assert.True( ArrayContains( [ NodeClass.Object, NodeClass.View ], args.ReadResponse[1].Value.toInt32() ), "HasNotifier should be used by an Object or View, only." ) ) result = TestResult.Fail;
                                                // If source is OBJECT, then the reference is of type FolderType (or sub-type)
                                                if( !args.BrowseResponse[i].TypeDefinition.NodeId.equals( folderTypeNodeId ) ) {
                                                    // do a recursive look up the type chain to see if the type derives from folder type 
                                                    if( !_seekNodeIsOfType( { NodeToSearch: args.BrowseResponse[i].ReferenceTypeId.NodeId, TypeSought: folderTypeNodeId, BrowsePath: args.BrowsePath } ) ) result = TestResult.Fail;
                                                }
                                            }//found our reference type
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); },
                HasDescription: function( args ){ 
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // Optional reference, so it might not be found; 0..1 allowed
                                        var hasDescriptionNodeId = new UaNodeId( Identifier.HasDescription );
                                        var dataEncodingTypeNodeId = new UaNodeId( Identifier.DataTypeEncodingType );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( hasDescriptionNodeId ) ) {
                                                found = true;
                                                // TEST ONE: make sure there is only ONE instance
                                                // Excel: 28
                                                var keyName = args.ReadRequest[0].NodeId + "HasDescription";
                                                if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "HasDescription is defined more than once. One one instance (0..1) of this Reference type is allowed per node." ) ) result = TestResult.Fail;
                                                else InformationModelValidation.Stash.Add( keyName, 1 );
                                                // TEST TWO: Used only by Objects and ObjectType "DataTypeEncodingType"
                                                if( Assert.True( ArrayContains( [ NodeClass.Object, NodeClass.ObjectType ], args.ReadResponse[1].Value.toInt32() ), "HasDescription must be used on Object or ObjectType (DataTypeEncodingType or sub-type) only." ) ) {
                                                    // dig deeper and make sure the ObjectType is of type DataTypeEncodingType, or sub-type
                                                    if( !( hasDescriptionNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) ) {
                                                        if( !_seekNodeIsOfType( { NodeToSearch: args.BrowseResponse[i].ReferenceTypeId, TypeSought: dataEncodingTypeNodeId, BrowsePath: args.BrowsePath } ) ) result = TestResult.Fail;
                                                    }
                                                }
                                                else result = TestResult.Fail;
                                            }
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result );  },
                HasSubtype:     function( args ) {                                
                                        args.BaseType = new UaNodeId( Identifier.BaseObjectType );
                                        return( InformationModelValidation.Common.References.HasSubtype( args ) ); },
                Others: function( args ) { return( recursiveTestOnNodeClass( { Factory: InformationModelValidation.Common.References, BrowseRequest: args.BrowseRequest, BrowseResponse: args.BrowseResponse, ReadRequest: args.ReadRequest, ReadResponse: args.ReadResponse, BrowsePath: args.BrowsePath } ) ); } },
            Properties: {
                BrowseNameUniquenessTest: function( args ){ return( InformationModelValidation.Common.Properties.BrowseNameUniquenessTest( args ) ); },
                SameServerTest:  function( args ){ return( InformationModelValidation.Common.Properties.SameServerTest( args ) ); },
                NodeVersion: function( args ){ 
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look through all references for Properties; locate "NodeVersion".
                                        // NodeVersion is optional!
                                        var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse[0].length; i++ ) {
                                            if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                // is this "NodeVersion" property?
                                                if( args.BrowseResponse[i].BrowseName.Text.equals( "NodeVersion" ) ) {
                                                    found = true;
                                                    // make sure there's only ONE NodeVersion property
                                                    var keyName = args.ReadRequest[0].NodeId + "NodeVersion";
                                                    if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "NodeVersion property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                    else InformationModelValidation.Stash.Add( keyName, 1 );
                                                    // check the property is a STRING
                                                    var xReadHelper = new ReadService( { Session: Test.Session } );
                                                    var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId )[0];
                                                    if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                        if( !Assert.Equal( BuiltInType.String, xReadHelper.Response.Results[0].Value.DataType, "NodeVersion property should be type: String." ) ) result = TestResult.Fail;
                                                    }
                                                    else result = TestResult.Fail;
                                                    // clean-up
                                                    xReadHelper = null;
                                                }// found NodeVersion
                                            }// if found
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); },
                Icon:        function( args ){ 
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look through all references for Properties; locate "Icon".
                                        // Icon is optional!
                                        var iconNodeId = new UaNodeId( Identifier.Icon );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                            if( iconNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                // is this "NodeVersion" property?
                                                if( args.BrowseResponse[i].BrowseName.Text.equals( "Icon" ) ) {
                                                    found = true;
                                                    // make sure there's only ONE iconNodeId property
                                                    var keyName = args.ReadRequest[0].NodeId + "Icon";
                                                    if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "Icon property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                    else InformationModelValidation.Stash.Add( keyName, 1 );
                                                    // check the property is a IMAGE
                                                    var xReadHelper = new ReadService( { Session: Test.Session } );
                                                    var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse.References[i].NodeId )[0];
                                                    if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                        if( !Assert.Equal( new UaNodeId( Identifier.Icon), xReadHelper.Response.Results[0].Value.DataType, "NodeVersion property should be type: Image (ByteString)." ) ) result = TestResult.Fail;
                                                    }
                                                    else result = TestResult.Fail;
                                                    // clean-up
                                                    xReadHelper = null;
                                                }// found NodeVersion
                                            }// if found
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result );  },
                NamingRule:  function( args ){ 
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look through all references for Properties; locate "NamingRule".
                                        // NamingRule is optional!
                                        var namingRuleTypeNodeId = new UaNodeId( Identifier.NamingRuleType );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                            if( namingRuleTypeNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                // is this "NodeVersion" property?
                                                if( args.BrowseResponse[i].BrowseName.Text.equals( "NamingRule" ) ) {
                                                    found = true;
                                                    // make sure there's only ONE property of this type
                                                    var keyName = args.ReadRequest[0].NodeId + "NamingRule";
                                                    if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "NamingRule property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                    else InformationModelValidation.Stash.Add( keyName, 1 );
                                                    // check the property points to a ModellingRule
                                                    var xReadHelper = new ReadService( { Session: Test.Session } );
                                                    if( xReadHelper.Execute( { NodesToRead: _getAttributesAsNodes( args.BrowseResponse.References[i].NodeId, new NodeTypeAttributesMatrix().All ), SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                        // check the item is an Object that derives from ModellingRuleType.
                                                        if( !Assert.Equal( NodeClass.Object, xReadHelper[0].Value.toInt32(), "NamingRule should be bound to an Object only." ) ) result = TestResult.Fail;
                                                        else {
                                                            if( !Assert.True( _seekNodeIsOfType( { NodeToSearch: args.BrowseResponse[i].NodeId, TypeSought: new UaNode( Identifier.ModellingRuleType ), BrowsePath: args.BrowsePath } ) ) ) result = TestResult.Fail;
                                                        }
                                                    }
                                                    else result = TestResult.Fail;
                                                    // clean-up
                                                    xReadHelper = null;
                                                }// found NodeVersion
                                            }// if found
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result );  }, } },
        ObjectType: {
            Attributes: {
                Mandatories: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        // get the REQUIRED attributes for type OBJECT
                                        var requiredAttributes = new NodeTypeAttributesMatrix().ObjectType;
                                        var requiredAttributeTypes = new NodeTypeAttributesMatrix().ObjectType_Types;
                                        // iterate through all required attributes searching for them in the read response
                                        while( requiredAttributes.length > 0 ) {
                                            var currentAttribute = requiredAttributes.pop();
                                            var currentAttributeType = requiredAttributeTypes.pop();
                                            var found = false;
                                            // iterate through the read request to find the request, then use its' position to find the result
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                    // make sure it exists and then make sure the type is correct
                                                    if( Assert.Equal( StatusCode.Good, args.ReadResponse[i].StatusCode.StatusCode, "Attribute '" + Attribute.toString( currentAttribute ) + "' not found (Position: " + i + ")" ) ) found = TestResult.Fail;
                                                    if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                            if( !found ) { 
                                                result = TestResult.Fail;
                                                addError( "Missing attribute '" + Attribute.toString( currentAttribute ) + "' on Node '" + args.Node.NodeId + "'. NodeClass: ObjectType" );
                                            }
                                        }//while
                                        return( result ); }, //function
                Optionals: function( args ) { // OK
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                    // get the OPTIONAL attributes for type OBJECT
                                    var optionalAttributes = new NodeTypeAttributesMatrix().Base_Optional;
                                    var optionalAttributeTypes = new NodeTypeAttributesMatrix().Base_Optional_Types;
                                    // iterate through all optional attributes searching for them in the read response
                                    var found = false;
                                    while( optionalAttributes.length > 0 ) {
                                        var currentAttribute = optionalAttributes.pop();
                                        var currentAttributeType = optionalAttributeTypes.pop();
                                        // iterate through the read request to find the request, then use its' position to find the result
                                        for( var i=0; i<args.ReadRequest.length; i++ ) {
                                            if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                found = true;
                                                // check the data-type ONLY if the status code is good
                                                if( args.ReadResponse[i].StatusCode.isGood() ) {
                                                    if( args.ReadResponse[i].Value.DataType != BuiltInType.Null ) {
                                                        if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    }
                                                }
                                                break;
                                            }//found the attribute
                                        }//for i...
                                    }//while
                                    if( !found ) result = TestResult.Skipped;
                                    return( result ); },
                Missing: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args.ReadRequest ) || !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        var nodetypeMatrix = new NodeTypeAttributesMatrix();
                                        var missingAttributes = nodetypeMatrix.AllExcept( nodetypeMatrix.ObjectType.concat( nodetypeMatrix.Base_Optional ) );
                                        while( missingAttributes.length > 0 ) {
                                            var currentMissingAttribute = missingAttributes.pop();
                                            // iterate thru the read request to find the position of the read request 
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentMissingAttribute ) {
                                                    // make sure the call failed
                                                    if( !Assert.False( args.ReadResponse[i].StatusCode.isGood(), "Attribute '" + Attribute.toString( currentMissingAttribute ) + "' was found, which is neither Required or Optional." ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                        }//while
                                        return( result ); }, },
            References: {
                HasComponent:        function( args ) {
                                        // Excel: 43
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look for HasComponent; it's NOT required
                                        var hasComponentNodeId = new UaNodeId( Identifier.HasComponent );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ){
                                            if( args.BrowseResponse[i].IsForward ) { // we only care about forward references
                                                if( args.BrowseResponse[i].ReferenceTypeId.equals( hasComponentNodeId ) ) {
                                                    found = true;
                                                    // TEST ONE: Target must be Objects, DataVariables, or Methods.
                                                    if( !Assert.True( ArrayContains( [ NodeClass.Object, NodeClass.Variable, NodeClass.Method ], args.BrowseResponse[i].NodeClass ), "HasComponent should point to an Object, Variable, or Method; when attached to an ObjectType.\nFound: " + NodeClass.toString( args.BrowseResponse[i].NodeClass ) + "\nUA Part 3 section 8.8, paragraph 2" ) ) result = TestResult.Fail;
                                                }// we found the HasComponent
                                            }// forward ref?
                                        }//for i..
                                        if( !found ) result = TestResult.Skipped; },
                HasProperty:  function( args ) {
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) && !isDefined( args.BrowseRequest ) ) return( TestResult.Error );
                                    // look for HasProperty; it's NOT required
                                    var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                    for( var i=0; i<args.BrowseResponse.length; i++ ){
                                        if( args.BrowseResponse[i].ReferenceTypeId.equals( hasPropertyNodeId ) ) {
                                            // TEST ONE: make sure target is of type: Variable
                                            // Excel: 20
                                            if( !Assert.Equal( NodeClass.toString( NodeClass.Variable ), NodeClass.toString( args.BrowseResponse[i].NodeClass ), "HasProperty does not point to a Variable type.\nLook at NodeId: " + args.BrowseRequest[0].NodeId + "\nBrowse Path: " + args.BrowsePath ) ) result = TestResult.Fail;
                                            // TEST TWO: Browse the references of the node to make sure HasTypeDefinition = PropertyType.
                                            var item = MonitoredItem.fromNodeIds( args.BrowseRequest[0].NodeId )[0];
                                            var xBrowseHelper = new BrowseService( { Session: Test.Session } );
                                            if( !xBrowseHelper.Execute( { NodesToBrowse: item, SuppressMessaging: true, SuppressWarnings: true } ) ) result = TestResult.Error;
                                            else {
                                                // iterate through all references searching for HasTypeDefinition; there should be only one!
                                                if( !Assert.GreaterThan( 0, xBrowseHelper.Response.Results[0].References.length, "Property '" + item.NodeId + "' has no references. It MUST have HasTypeDefinition=PropertyType." ) ) result = TestResult.Fail;
                                                else {
                                                    var found = false;
                                                    var typeDefinitionNodeId = new UaNodeId( Identifier.PropertyType );
                                                    for( var r=0; r<xBrowseHelper.Response.Results[0].References.length; r++ ) {
                                                        if( typeDefinitionNodeId.equals( xBrowseHelper.Response.Results[0].References[r].TypeDefinition.NodeId ) ) {
                                                            // make sure the reference is FORWARD
                                                            if( !Assert.True( xBrowseHelper.Response.Results[0].References[r].IsForward, "HasTypeDefinition IsFoward must equal TRUE." ) ) result = TestResult.Fail;
                                                            else found = true;
                                                        }// found it!
                                                    }// for r...
                                                }// we have references
                                                // was it found?
                                                if( !found ) result = TestResult.Fail;
                                            }// browse
                                            xBrowseHelper = null;
                                        }
                                    }//for i...
                                    return( result ); },
                HasSubtype:          function( args ){ args.BaseType = new UaNodeId( Identifier.BaseObjectType );
                                              return( InformationModelValidation.Common.References.HasSubtype( args ) ); },
                GeneratesEvent:      function( args ){ return( InformationModelValidation.Method.References.GeneratesEvent( args ) ); },
                Others: function( args ) { return( recursiveTestOnNodeClass( { Factory: InformationModelValidation.Common.References, BrowseRequest: args.BrowseRequest, BrowseResponse: args.BrowseResponse, ReadRequest: args.ReadRequest, ReadResponse: args.ReadResponse, BrowsePath: args.BrowsePath } ) ); } },
            Properties: {
                BrowseNameUniquenessTest: function( args ){ return( InformationModelValidation.Common.Properties.BrowseNameUniquenessTest( args ) ); },
                SameServerTest:  function( args ){ return( InformationModelValidation.Common.Properties.SameServerTest( args ) ); },
                NodeVersion: function( args ){ return( InformationModelValidation.Object.Properties.NodeVersion( args ) ); },
                Icon:        function( args ){ return( InformationModelValidation.Object.Properties.Icon( args ) ); } } },
        Variable: {
            Attributes: {
                Mandatories: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        // get the REQUIRED attributes for type OBJECT
                                        var requiredAttributes = new NodeTypeAttributesMatrix().Variable;
                                        var requiredAttributeTypes = new NodeTypeAttributesMatrix().Variable_Types;
                                        // iterate through all required attributes searching for them in the read response
                                        while( requiredAttributes.length > 0 ) {
                                            var currentAttribute = requiredAttributes.pop();
                                            var currentAttributeType = requiredAttributeTypes.pop();
                                            var found = false;
                                            // iterate through the read request to find the request, then use its' position to find the result
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                    // make sure it exists and then make sure the type is correct
                                                    if( Assert.Equal( StatusCode.Good, args.ReadResponse[i].StatusCode.StatusCode, "Attribute '" + Attribute.toString( currentAttribute ) + "' not found (Position: " + i + ")" ) ) found = TestResult.Fail;
                                                    // skip the VALUE attribute because it will vary from node to node, by design...
                                                    if( currentAttribute === Attribute.Value ) continue;
                                                    if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                            if( !found ) { 
                                                result = TestResult.Fail;
                                                addError( "Missing attribute '" + Attribute.toString( currentAttribute ) + "' on Node '" + args.Node.NodeId + "'. NodeClass: Variable" );
                                            }
                                        }//while
                                        return( result ); }, //function
                Optionals: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        // get the OPTIONAL attributes for type OBJECT
                                        var optionalAttributes = new NodeTypeAttributesMatrix().Variable_Optional;
                                        var optionalAttributeTypes = new NodeTypeAttributesMatrix().Variable_Optional_Types;
                                        // iterate through all optional attributes searching for them in the read response
                                        var found = false;
                                        while( optionalAttributes.length > 0 ) {
                                            var currentAttribute = optionalAttributes.pop();
                                            var currentAttributeType = optionalAttributeTypes.pop();
                                            // iterate through the read request to find the request, then use its' position to find the result
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                    found = true;
                                                    // check the data-type ONLY if the status code is good
                                                    if( args.ReadResponse[i].StatusCode.isGood() ) {
                                                        if( args.ReadResponse[i].Value.DataType != BuiltInType.Null ) {
                                                            if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + "). NodeId: " + args.Node.NodeId ) ) result = TestResult.Fail;
                                                        }
                                                    }
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                        }//while
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); },
                Missing: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args.ReadRequest ) || !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        var nodetypeMatrix = new NodeTypeAttributesMatrix();
                                        var missingAttributes = nodetypeMatrix.AllExcept( nodetypeMatrix.Variable.concat( nodetypeMatrix.Variable_Optional ) );
                                        while( missingAttributes.length > 0 ) {
                                            var currentMissingAttribute = missingAttributes.pop();
                                            // iterate thru the read request to find the position of the read request 
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentMissingAttribute ) {
                                                    // make sure the call failed
                                                    if( !Assert.False( args.ReadResponse[i].StatusCode.isGood(), "Attribute '" + Attribute.toString( currentMissingAttribute ) + "' was found, which is neither Required or Optional." ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                        }//while
                                        return( result ); }, },
            References: {
                HasModellingRule: function( args ){ return( InformationModelValidation.Object.References.HasModellingRule( args ) ); },
                HasProperty:      function( args ){ 
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                    // look for HasProperty; it's NOT required
                                    var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                    for( var i=0; i<args.BrowseResponse.length; i++ ){
                                        if( args.BrowseResponse[i].ReferenceTypeId.equals( hasPropertyNodeId ) ) {
                                            // TEST ONE: follow the target and make sure it is of type: Variable
                                            if( !Assert.Equal( NodeClass.toString( NodeClass.Variable ), NodeClass.toString( args.ReadResponse[1].Value.toInt32() ), "HasProperty[\"" + args.BrowseResponse[i].BrowseName.Name + "\"].Target should point to a Variable. Part 3 Section 7.8 'HasProperty'.\nResponse.References[" + i + "]" ) ) result = TestResult.Fail;
                                            // TEST TWO: Browse the references of the node to make sure HasTypeDefinition = PropertyType.
                                            var xBrowseHelper = new BrowseService( { Session: Test.Session } );
                                            var itemsToRead = MonitoredItem.fromNodeIds( args.BrowseRequest[0].NodeId );
                                            if( !xBrowseHelper.Execute( { NodesToBrowse: itemsToRead[0], SuppressMessaging: true, SuppressWarnings: true } ) ) result = TestResult.Error;
                                            else {
                                                // iterate through all references searching for HasTypeDefinition; there should be only one!
                                                if( !Assert.GreaterThan( 0, xBrowseHelper.Response.Results[0].References.length, "Property '" + itemsToRead[0].NodeId + "' has no references. It MUST have HasTypeDefinition=PropertyType." ) ) result = TestResult.Fail;
                                                else {
                                                    var found = false;
                                                    var hasTypeDefinitionNodeId = new UaNodeId( Identifier.HasTypeDefinition );
                                                    for( var r=0; r<xBrowseHelper.Response.Results[0].References.length; r++ ) {
                                                        if( hasTypeDefinitionNodeId.equals( xBrowseHelper.Response.Results[0].References[r].ReferenceTypeId ) ) {
                                                            // make sure the reference is FORWARD
                                                            if( !Assert.True( xBrowseHelper.Response.Results[0].References[r].IsForward, "HasTypeDefinition IsFoward must equal TRUE." ) ) result = TestResult.Fail;
                                                            // make sure there is only one HasTypeDefinition reference
                                                            if( !Assert.False( found, "Property '" + itemsToRead[0].NodeId + "' has more than one HasTypeDefinition." ) ) result = TestResult.Fail;
                                                            else found = true;
                                                        }// found it!
                                                    }// for r...
                                                }// we have references
                                                // was it found?
                                                if( !found ) result = TestResult.Fail;
                                            }// browse
                                            xBrowseHelper = null;
                                        }
                                    }//for i...
                                    return( result ); },
                HasComponent:     function( args ){ 
                                        // Excel: 43
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look for HasComponent; it's NOT required
                                        var hasComponentNodeId = new UaNodeId( Identifier.HasComponent );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ){
                                            if( args.BrowseResponse[i].IsForward ) { // we only care about forward references
                                                if( args.BrowseResponse[i].ReferenceTypeId.equals( hasComponentNodeId ) ) {
                                                    found = true;
                                                    // TEST ONE: Target must be Variable.
                                                    if( !Assert.True( ArrayContains( [ NodeClass.Variable ], args.BrowseResponse[i].NodeClass ), "HasComponent should point to a Variable; when attached to an Variable.\nFound: " + NodeClass.toString( args.BrowseResponse[i].NodeClass ) + "\nUA Part 3 section 8.8, paragraph 2" ) ) result = TestResult.Fail;
                                                }// we found the HasComponent
                                            }// forward ref?
                                        }//for i..
                                        if( !found ) result = TestResult.Skipped; },
                HasTypeDefinition: function( args ) {
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // TEST ONE: must be at least one instance, and more than one!
                                        var hasTypeDefinitionNodeId = new UaNodeId( Identifier.HasTypeDefinition );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( hasTypeDefinitionNodeId ) ) {
                                                found = true;
                                                // make sure there is only ONE instance
                                                var keyName = args.ReadRequest[0].NodeId + "HasTypeDefinition";
                                                if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "HasTypeDefinition is defined more than once. One one instance of this Reference type is allowed per node." ) ) result = TestResult.Fail;
                                                else InformationModelValidation.Stash.Add( keyName, 1 );
                                                // TEST TWO: SourceNode is Variable 
                                                var acceptableNodeClassTypes = [ NodeClass.Variable ];
                                                if( !Assert.True( ArrayContains( acceptableNodeClassTypes, args.ReadResponse[1].Value.toInt32() ), "HasTypeDefinition should be used by an Object or Variable only." ) ) result = TestResult.Fail;
                                                // TEST THREE: If SourceNode is Variable, then TargetNode is VariableType.
                                                if( args.ReadResponse[1].Value.toInt32() === NodeClass.Variable ) {
                                                    if( !Assert.Equal( NodeClass.VariableType, args.BrowseResponse[i].NodeClass, "HasTypeDefinition, when SourceNode=Variable then TargetNode must be VariableType." ) ) result = TestResult.Fail;
                                                }// is Variable
                                            }// we found it
                                        };//for i
                                        if( !Assert.True( found, "HasTypeDefinition is REQUIRED on an Object type." ) ) result = TestResult.Fail;
                                        return( result ); },
                TypeDefinition:    function( args ){ //print( "Variable.References.TypeDefinition" ); 
                                        return( TestResult.NotImplemented ); },
                Others: function( args ) { return( recursiveTestOnNodeClass( { Factory: InformationModelValidation.Common.References, BrowseRequest: args.BrowseRequest, BrowseResponse: args.BrowseResponse, ReadRequest: args.ReadRequest, ReadResponse: args.ReadResponse, BrowsePath: args.BrowsePath } ) ); } },
            Properties: {
                BrowseNameUniquenessTest: function( args ){ return( InformationModelValidation.Common.Properties.BrowseNameUniquenessTest( args ) ); },
                SameServerTest:  function( args ){ return( InformationModelValidation.Common.Properties.SameServerTest( args ) ); },
                NodeVersion:     function( args ){ return( InformationModelValidation.Object.Properties.NodeVersion( args ) ); },
                LocalTime:       function( args ){ 
                                            var result = TestResult.Pass;
                                            var propertyName = "LocalTime";
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; locate "LocalTime".
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property is a TimeZone data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            if( !Assert.Equal( new UaNodeId( Identifier.TimeZoneDataType ), xReadHelper.Response.Results[0].Value.toExtensionObject().TypeId.NodeId, propertyName + " property should be type: TimeZoneDataType." ) ) result = TestResult.Fail;
                                                        }
                                                        else result = TestResult.Fail;
                                                        // this property is ONLY used by DataVariables
                                                        if( !Assert.Equal( new UaNodeId( Identifier.Variable ), args.ReadResponse[13].Value.toNodeId(), properyName + " should be used by a Variable only." ) ) result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ); },
                DataTypeVersion: function( args ){
                                            var result = TestResult.Pass;
                                            var propertyName = "DataTypeVersion";
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; locate "DataTypeVersion".
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property is a STRING data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            if( !Assert.Equal( BuiltInType.String, xReadHelper.Response.Results[0].Value.DataType, propertyName + " property should be type: String." ) ) result = TestResult.Fail;
                                                        }
                                                        else result = TestResult.Fail;
                                                        // check the VARIABLE (parent) is of type DataTypeDictionaryType
                                                        var dataTypeDictionaryTypeNodeId = new UaNodeId( Identifier.DataTypeDictionaryType );
                                                        if( !Assert.Equal( dataTypeDictionaryTypeNodeId, args.ReadResponse[13].Value.toNodeId(), propertyName + " property should be used by a Variable of type DataTypeDictionary only." ) ) result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result );  },
                DictionaryFragment:   function( args ){
                                            var result = TestResult.Pass;
                                            var propertyName = "DictionaryFragment";
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; locate "DictionaryFragment".
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "" + propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property is a BYTESTRING data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            if( !Assert.Equal( BuiltInType.ByteString, xReadHelper.Response.Results[0].Value.DataType, "" + propertyName + " property should be type: String." ) ) result = TestResult.Fail;
                                                        }
                                                        else result = TestResult.Fail;
                                                        // check the VARIABLE (parent) is of type DataTypeDescription (or sub-type)
                                                        var dataTypeDictionaryTypeNodeId = new UaNodeId( Identifier.DataTypeDescriptionType );
                                                        if( !dataTypeDictionaryTypeNodeId.equals( args.ReadResponse[13].Value.toNodeId() ) ) {
                                                            if( !Assert.True( _seekNodeIsOfType( { NodeToSearch: args.ReadRequest[0].NodeId, TypeSought: dataTypeDictionaryTypeNodeId, BrowsePath: args.BrowsePath } ), "DataTypeVersion property should be used on a Variable of type DataTypeDictionary." ) ) result = TestResult.Fail;
                                                        }
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ); },
                AllowNulls:    function( args ){ 
                                            var propertyName = "AllowNulls";
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; locate "AllowNulls".
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "" + propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property is a BOOLEAN data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            if( !Assert.Equal( BuiltInType.Boolean, xReadHelper.Response.Results[0].Value.DataType, "" + propertyName + " property should be type: Boolean." ) ) result = TestResult.Fail;
                                                        }
                                                        else result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ); },
                ValueAsText:   function( args ){ 
                                            var propertyName = "ValueAsText";
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; that match *this*
                                            // property is optional!
                                            var valueAsTextNodeId = new UaNodeId( Identifier.LocalizedText );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( valueAsTextNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this "ValueAsText" property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "" + propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property is a LocalizedText data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            var expectedType = BuiltInType.LocalizedText;
                                                            if( !Assert.Equal( expectedType, xReadHelper.Response.Results[0].Value.DataType, "" + propertyName + " property should be type: " + BuiltInType.toString( expectedType ) ) ) result = TestResult.Fail;
                                                        }
                                                        else result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ); },
                MaxStringLength:   function( args ){
                                            var propertyName = "MaxStringLength";
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; that match *this*
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "" + propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            var expectedType = BuiltInType.UInt32;
                                                            if( !Assert.Equal( expectedType, xReadHelper.Response.Results[0].Value.DataType, "" + propertyName + " property should be type: " + BuiltInType.toString( expectedType ) ) ) result = TestResult.Fail;
                                                        }
                                                        else result = TestResult.Fail;
                                                        // check the variable is of type STRING
                                                        if( !Assert.Equal( BuiltInType.String, args.ReadResponse[12].Value.DataType, "" + property + " should be attached to a Variable of type String." ) ) result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ); },
                MaxArrayLength:    function( args ){ 
                                            var propertyName = "MaxArrayLength";
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; that match *this*
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "" + propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            var expectedType = BuiltInType.UInt32;
                                                            if( !Assert.Equal( expectedType, xReadHelper.Response.Results[0].Value.DataType, "" + propertyName + " property should be type: " + BuiltInType.toString( expectedType ) ) ) result = TestResult.Fail;
                                                        }
                                                        else result = TestResult.Fail;
                                                        // check the ValueRank attribute is NOT 'scalar'
                                                        if( !Assert.NotEqual( ValueRank.Scalar, args.ReadResponse[14].Value.DataType, "" + property + " should be attached to a Variable whose ValueRank attribute is NOT set to 'Scalar'." ) ) result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ); },
                EngineeringUnits:  function( args ){
                                            var propertyName = "EngineeringUnits";
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; that match *this*
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "" + propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property data-type
                                                        var euInfoNodeId = UaNodeId( Identifier.EUInformation );
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            // EUInfo is an extensionObject
                                                            var expectedType = BuiltInType.ExtensionObject;
                                                            if( !Assert.Equal( BuiltInType.toString( expectedType ), BuiltInType.toString( xReadHelper.Response.Results[0].Value.DataType ), propertyName + " property should be type: " + BuiltInType.toString( expectedType ) ) ) result = TestResult.Fail;
                                                            else {
                                                                // EUInfo types: xml plus binary
                                                                var euInfoTypes = [ new UaNodeId( Identifier.EUInformation_Encoding_DefaultXml ), new UaNodeId( Identifier.EUInformation_Encoding_DefaultBinary ) ];
                                                                var valueAsExtObj = xReadHelper.Response.Results[0].Value.toExtensionObject();
                                                                for( var t=0; t<euInfoTypes.length; t++ ) {
                                                                    if( euInfoTypes[t].equals( valueAsExtObj.TypeId.NodeId ) ) {
                                                                        found = true;
                                                                        break;
                                                                    }
                                                                }//for t...
                                                                if( !Assert.True( found, propertyName + " must be of type EUInformation. Conversion to ExtensionObject, and then EUInformation, failed because the EUInformation.Type shows a different type." )) result = TestResult.Fail;
                                                                else result = TestResult.Pass;
                                                            }
                                                        }
                                                        else result = TestResult.Fail;
                                                        // check the ValueRank attribute is NOT 'scalar'
                                                        if( !Assert.NotEqual( ValueRank.Scalar, args.ReadResponse[14].Value.DataType, propertyName + " should be attached to a Variable whose ValueRank attribute is NOT set to 'Scalar'." ) ) result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ); }, },
            Other: {
                Instances: function( args ){ // Excel: 31
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) || !isDefined( args.BrowseResponse ) ) return( TestResult.Fail );
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            // TEST ONE: Variables are either 'DataVariable' or 'Property' types
                                            // sub-step #1: check if it's a property
                                            var isProperty = false;
                                            for( var b=0; b<args.BrowseResponse.length; b++ ) { // iterate thru all browse responses
                                                if( !hasPropertyNodeId.equals( args.BrowseResponse[b].ReferenceTypeId ) ) { // has property?
                                                    isProperty = true;
                                                    break;
                                                }//has property?
                                            }//for b...
                                            return( result );
                           },
                Hiearachical: function( args ){ // print( "Variable.Other.Hierarchical: not the sourceNode of hieararhical references." ); 
                                        return( TestResult.NotImplemented );  } } },
        VariableType: {
            Attributes: {
                Mandatories: function( args ) { // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        // get the REQUIRED attributes for type OBJECT
                                        var requiredAttributes = new NodeTypeAttributesMatrix().VariableType;
                                        var requiredAttributeTypes = new NodeTypeAttributesMatrix().VariableType_Types;
                                        // iterate through all required attributes searching for them in the read response
                                        while( requiredAttributes.length > 0 ) {
                                            var currentAttribute = requiredAttributes.pop();
                                            var currentAttributeType = requiredAttributeTypes.pop();
                                            var found = false;
                                            // iterate through the read request to find the request, then use its' position to find the result
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                    // make sure it exists and then make sure the type is correct
                                                    if( Assert.Equal( StatusCode.Good, args.ReadResponse[i].StatusCode.StatusCode, "Attribute '" + Attribute.toString( currentAttribute ) + "' not found (Position: " + i + ")" ) ) found = TestResult.Fail;
                                                    if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                            if( !found ) { 
                                                result = TestResult.Fail;
                                                addError( "Missing attribute '" + Attribute.toString( currentAttribute ) + "' on Node '" + args.Node.NodeId + "'. NodeClass: Variable" );
                                            }
                                        }//while
                                        return( result ); }, //function
                Optionals: function( args ){ // OK
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                    // get the OPTIONAL attributes for type OBJECT
                                    var optionalAttributes = new NodeTypeAttributesMatrix().VariableType_Optional;
                                    var optionalAttributeTypes = new NodeTypeAttributesMatrix().VariableType_Optional_Types;
                                    // iterate through all optional attributes searching for them in the read response
                                    var found = false;
                                    while( optionalAttributes.length > 0 ) {
                                        var currentAttribute = optionalAttributes.pop();
                                        var currentAttributeType = optionalAttributeTypes.pop();
                                        // iterate through the read request to find the request, then use its' position to find the result
                                        for( var i=0; i<args.ReadRequest.length; i++ ) {
                                            if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                found = true;
                                                // check the data-type ONLY if the status code is good
                                                if( args.ReadResponse[i].StatusCode.isGood() ) {
                                                    if( args.ReadResponse[i].Value.DataType != BuiltInType.Null ) {
                                                        if( !Assert.Equal( Attribute.toString( currentAttributeType ), Attribute.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    }
                                                }
                                                break;
                                            }//found the attribute
                                        }//for i...
                                    }//while
                                    if( !found ) result = TestResult.Skipped;
                                    return( result ); },
                Missing: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args.ReadRequest ) || !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        var nodetypeMatrix = new NodeTypeAttributesMatrix();
                                        var missingAttributes = nodetypeMatrix.AllExcept( nodetypeMatrix.VariableType.concat( nodetypeMatrix.VariableType_Optional ) );
                                        while( missingAttributes.length > 0 ) {
                                            var currentMissingAttribute = missingAttributes.pop();
                                            // iterate thru the read request to find the position of the read request 
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentMissingAttribute ) {
                                                    // make sure the call failed
                                                    if( !Assert.False( args.ReadResponse[i].StatusCode.isGood(), "Attribute '" + Attribute.toString( currentMissingAttribute ) + "' was found, which is neither Required or Optional." ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                        }//while
                                        return( result ); }, },
            References: {
                HasProperty:  function( args ) {
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) && !isDefined( args.BrowseRequest ) ) return( TestResult.Error );
                                    // look for HasProperty; it's NOT required
                                    var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                    for( var i=0; i<args.BrowseResponse.length; i++ ){
                                        if( args.BrowseResponse[i].ReferenceTypeId.equals( hasPropertyNodeId ) ) {
                                            // TEST ONE: make sure target is of type: Variable
                                            // Excel: 20
                                            if( !Assert.Equal( NodeClass.toString( NodeClass.VariableType ), NodeClass.toString( args.BrowseResponse[i].NodeClass ), "HasProperty does not point to a Variable type.\nLook at NodeId: " + args.BrowseRequest[0].NodeId + "\nBrowse Path: " + args.BrowsePath ) ) result = TestResult.Fail;
                                            // TEST TWO: Browse the references of the node to make sure HasTypeDefinition = PropertyType.
                                            var item = MonitoredItem.fromNodeIds( args.BrowseRequest[0].NodeId )[0];
                                            var xBrowseHelper = new BrowseService( { Session: Test.Session } );
                                            if( !xBrowseHelper.Execute( { NodesToBrowse: item, SuppressMessaging: true, SuppressWarnings: true } ) ) result = TestResult.Error;
                                            else {
                                                // iterate through all references searching for HasTypeDefinition; there should be only one!
                                                if( !Assert.GreaterThan( 0, xBrowseHelper.Response.Results[0].References.length, "Property '" + item.NodeId + "' has no references. It MUST have HasTypeDefinition=PropertyType." ) ) result = TestResult.Fail;
                                                else {
                                                    var found = false;
                                                    var typeDefinitionNodeId = new UaNodeId( Identifier.PropertyType );
                                                    for( var r=0; r<xBrowseHelper.Response.Results[0].References.length; r++ ) {
                                                        if( typeDefinitionNodeId.equals( xBrowseHelper.Response.Results[0].References[r].TypeDefinition.NodeId ) ) {
                                                            // make sure the reference is FORWARD
                                                            if( !Assert.True( xBrowseHelper.Response.Results[0].References[r].IsForward, "HasTypeDefinition IsFoward must equal TRUE." ) ) result = TestResult.Fail;
                                                            else found = true;
                                                        }// found it!
                                                    }// for r...
                                                }// we have references
                                                // was it found?
                                                if( !found ) result = TestResult.Fail;
                                            }// browse
                                            xBrowseHelper = null;
                                        }
                                    }//for i...
                                    return( result ); },
                HasComponent: function( args ){ // Excel: 43
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look for HasComponent; it's NOT required
                                        var hasComponentNodeId = new UaNodeId( Identifier.HasComponent );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ){
                                            if( args.BrowseResponse[i].IsForward ) { // we only care about forward references
                                                if( args.BrowseResponse[i].ReferenceTypeId.equals( hasComponentNodeId ) ) {
                                                    found = true;
                                                    // TEST ONE: Target must be Variable.
                                                    if( !Assert.True( ArrayContains( [ NodeClass.Variable ], args.BrowseResponse[i].NodeClass ), "HasComponent should point to a Variable; when attached to an Variable.\nFound: " + NodeClass.toString( args.BrowseResponse[i].NodeClass ) + "\nUA Part 3 section 8.8, paragraph 2" ) ) result = TestResult.Fail;
                                                }// we found the HasComponent
                                            }// forward ref?
                                        }//for i..
                                        if( !found ) result = TestResult.Skipped; },
                HasSubtype:   function( args ){ args.BaseType = new UaNodeId( Identifier.BaseVariableType );
                                                return( InformationModelValidation.Common.References.HasSubtype( args ) ); },
                GeneratesEvent:  function( args ){ return( InformationModelValidation.Method.References.GeneratesEvent( args ) ); },
                Others: function( args ) { return( recursiveTestOnNodeClass( { Factory: InformationModelValidation.Common.References, BrowseRequest: args.BrowseRequest, BrowseResponse: args.BrowseResponse, ReadRequest: args.ReadRequest, ReadResponse: args.ReadResponse, BrowsePath: args.BrowsePath } ) ); } },
            Properties: {
                BrowseNameUniquenessTest: function( args ){ return( InformationModelValidation.Common.Properties.BrowseNameUniquenessTest( args ) ); },

                SameServerTest:  function( args ){ return( InformationModelValidation.Common.Properties.SameServerTest( args ) ); },
                NodeVersion: function( args ){ return( InformationModelValidation.Object.Properties.NodeVersion( args ) ); } } },
        Method: {
            Attributes: {
                Mandatories: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        // get the REQUIRED attributes for type OBJECT
                                        var requiredAttributes = new NodeTypeAttributesMatrix().Method;
                                        var requiredAttributeTypes = new NodeTypeAttributesMatrix().Method_Types;
                                        // iterate through all required attributes searching for them in the read response
                                        while( requiredAttributes.length > 0 ) {
                                            var currentAttribute = requiredAttributes.pop();
                                            var currentAttributeType = requiredAttributeTypes.pop();
                                            var found = false;
                                            // iterate through the read request to find the request, then use its' position to find the result
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                    // make sure it exists and then make sure the type is correct
                                                    if( Assert.Equal( StatusCode.Good, args.ReadResponse[i].StatusCode.StatusCode, "Attribute '" + Attribute.toString( currentAttribute ) + "' not found (Position: " + i + ")" ) ) found = TestResult.Fail;
                                                    if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                            if( !found ) { 
                                                result = TestResult.Fail;
                                                addError( "Missing attribute '" + Attribute.toString( currentAttribute ) + "' on Node '" + args.Node.NodeId + "'. NodeClass: Method" );
                                            }
                                        }//while
                                        return( result ); }, //function
                Optionals: function( args ){ // OK
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                    // get the OPTIONAL attributes for type OBJECT
                                    var optionalAttributes = new NodeTypeAttributesMatrix().Base_Optional;
                                    var optionalAttributeTypes = new NodeTypeAttributesMatrix().Base_Optional_Types;
                                    // iterate through all optional attributes searching for them in the read response
                                    var found = false;
                                    while( optionalAttributes.length > 0 ) {
                                        var currentAttribute = optionalAttributes.pop();
                                        var currentAttributeType = optionalAttributeTypes.pop();
                                        // iterate through the read request to find the request, then use its' position to find the result
                                        for( var i=0; i<args.ReadRequest.length; i++ ) {
                                            if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                found = true;
                                                // check the data-type ONLY if the status code is good
                                                if( args.ReadResponse[i].StatusCode.isGood() ) {
                                                    if( args.ReadResponse[i].Value.DataType != BuiltInType.Null ) {
                                                        if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    }
                                                }
                                                break;
                                            }//found the attribute
                                        }//for i...
                                    }//while
                                    if( !found ) result = TestResult.Skipped;
                                    return( result ); },
                Missing: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args.ReadRequest ) || !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        var nodetypeMatrix = new NodeTypeAttributesMatrix();
                                        var missingAttributes = nodetypeMatrix.AllExcept( nodetypeMatrix.Method.concat( nodetypeMatrix.Base_Optional ) );
                                        while( missingAttributes.length > 0 ) {
                                            var currentMissingAttribute = missingAttributes.pop();
                                            // iterate thru the read request to find the position of the read request 
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentMissingAttribute ) {
                                                    // make sure the call failed
                                                    if( !Assert.False( args.ReadResponse[i].StatusCode.isGood(), "Attribute '" + Attribute.toString( currentMissingAttribute ) + "' was found, which is neither Required or Optional." ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                        }//while
                                        return( result ); }, },
            References: {
                HasProperty: function( args ){ return( InformationModelValidation.Object.References.HasProperty( args ) );  },
                GeneratesEvent: function( args ){ 
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look for GeneratesEvent; it's NOT required; any number is allowed.
                                        var generatesEventNodeId = new UaNodeId( Identifier.GeneratesEvent );
                                        var eventTypeNodeId = new UaNodeId( Identifier.BaseEventType );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ){
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( generatesEventNodeId ) ) {
                                                found = true;
                                                // TEST ONE: Target is of type EventType, or derives from it.
                                                if( !args.BrowseResponse[i].TypeDefinition.NodeId.equals( eventTypeNodeId ) ) {
                                                    // recursively walk UP the chain to see if the target derives from ObjectType
                                                    if( !_seekNodeIsOfType( { NodeToSearch: new MonitoredItem( args.BrowseResponse[i].TypeDefinition.NodeId ), TypeSought: eventTypeNodeId, BrowsePath: args.BrowsePath } ) ) result = TestResult.Fail;
                                                }
                                            }//if found
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); },
                AlwaysGeneratesEvent: function( args ){ 
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look for GeneratesEvent; it's NOT required; any number is allowed.
                                        var generatesEventNodeId = new UaNodeId( Identifier.AlwaysGeneratesEvent );
                                        var eventTypeNodeId = new UaNodeId( Identifier.BaseEventType );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse.length; i++ ){
                                            if( args.BrowseResponse[i].ReferenceTypeId.equals( generatesEventNodeId ) ) {
                                                found = true;
                                                // TEST ONE: Target is of type EventType, or derives from it.
                                                if( !args.BrowseResponse[i].TypeDefinition.NodeId.equals( eventTypeNodeId ) ) {
                                                    // recursively walk UP the chain to see if the target derives from ObjectType
                                                    if( !_seekNodeIsOfType( { NodeToSearch: new MonitoredItem( args.BrowseResponse[i].TypeDefinition.NodeId ), TypeSought: eventTypeNodeId, BrowsePath: args.BrowsePath } ) ) result = TestResult.Fail;
                                                }
                                            }//if found
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); },
                Others: function( args ) { return( recursiveTestOnNodeClass( { Factory: InformationModelValidation.Common.References, BrowseRequest: args.BrowseRequest, BrowseResponse: args.BrowseResponse, ReadRequest: args.ReadRequest, ReadResponse: args.ReadResponse, BrowsePath: args.BrowsePath } ) ); } },
            Properties: {
                BrowseNameUniquenessTest: function( args ){ return( InformationModelValidation.Common.Properties.BrowseNameUniquenessTest( args ) ); },
                SameServerTest:  function( args ){ return( InformationModelValidation.Common.Properties.SameServerTest( args ) ); },
                NodeVersion: function( args ){ 
                                            var propertyName = "NodeVersion";
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; that match *this*
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "" + propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            // EUInfo is an extensionObject
                                                            var expectedType = BuiltInType.String;
                                                            if( !Assert.Equal( BuiltInType.toString( expectedType ), BuiltInType.toString( xReadHelper.Response.Results[0].Value.DataType ), propertyName + " property should be type: " + BuiltInType.toString( expectedType ) ) ) result = TestResult.Fail;
                                                        }
                                                        else result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ); },
                InputArguments: function( args ){ 
                                            var propertyName = "InputArguments";
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; that match *this*
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "" + propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            // Argument is an extensionObject; and Arguments is an array!
                                                            if( !Assert.Equal( VariantArrayType.Array, xReadHelper.Response.Results[0].Value.ArrayType, propertyName + " should be of type Array." ) ) result = TestResult.Fail;
                                                            else {
                                                                var argTypes = [ new UaNodeId( Identifier.Argument_Encoding_DefaultXml ), new UaNodeId( Identifier.Argument_Encoding_DefaultBinary ) ];
                                                                var valueAsExtObj = xReadHelper.Response.Results[0].Value.toExtensionObjectArray();
                                                                // do we have any inbound parameters to validate?
                                                                for( var v=0; v<valueAsExtObj.length; v++ ) {
                                                                    var innerFind = false;
                                                                    for( var t=0; t<argTypes.length; t++ ) {
                                                                        if( argTypes[t].equals( valueAsExtObj[v].TypeId.NodeId ) ) {
                                                                            innerFind = true;
                                                                            found = true;
                                                                            break;
                                                                        }
                                                                    }//for t...
                                                                    if( !Assert.True( innerFind, propertyName + " contains a value that is not of the right Argument type." ) ) result = TestResult.Fail;
                                                                }//for v...
                                                                if( !Assert.True( found, propertyName + " must be of type Argument. Conversion to ExtensionObject, and then Argument, failed because the Value.Type shows a different type." )) result = TestResult.Fail;
                                                                else result = TestResult.Pass;
                                                            }
                                                        }
                                                        else result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ); },
                OutputArguments: function( args ){ 
                                            var propertyName = "OutputArguments";
                                            var result = TestResult.Pass;
                                            if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            // look through all references for Properties; that match *this*
                                            // property is optional!
                                            var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                            var found = false;
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {
                                                if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                    // is this the right property?
                                                    if( args.BrowseResponse[i].BrowseName.Name.toString() === propertyName ) {
                                                        found = true;
                                                        // make sure there's only ONE instance of this property
                                                        var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                        if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), "" + propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                        else InformationModelValidation.Stash.Add( keyName, 1 );
                                                        // check the property data-type
                                                        var xReadHelper = new ReadService( { Session: Test.Session } );
                                                        var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId.NodeId )[0];
                                                        if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                            // Argument is an extensionObject; and Arguments is an array!
                                                            if( !Assert.Equal( VariantArrayType.Array, xReadHelper.Response.Results[0].Value.ArrayType, propertyName + " should be of type Array." ) ) result = TestResult.Fail;
                                                            else {
                                                                var argTypes = [ new UaNodeId( Identifier.Argument_Encoding_DefaultXml ), new UaNodeId( Identifier.Argument_Encoding_DefaultBinary ) ];
                                                                var valueAsExtObj = xReadHelper.Response.Results[0].Value.toExtensionObjectArray();
                                                                // do we have any inbound parameters to validate?
                                                                for( var v=0; v<valueAsExtObj.length; v++ ) {
                                                                    var innerFind = false;
                                                                    for( var t=0; t<argTypes.length; t++ ) {
                                                                        if( argTypes[t].equals( valueAsExtObj[v].TypeId.NodeId ) ) {
                                                                            innerFind = true;
                                                                            found = true;
                                                                            break;
                                                                        }
                                                                    }//for t...
                                                                    if( !Assert.True( innerFind, propertyName + " contains a value that is not of the right Argument type." ) ) result = TestResult.Fail;
                                                                }//for v...
                                                                if( !Assert.True( found, propertyName + " must be of type Argument. Conversion to ExtensionObject, and then Argument, failed because the Value.Type shows a different type." )) result = TestResult.Fail;
                                                                else result = TestResult.Pass;
                                                            }
                                                        }
                                                        else result = TestResult.Fail;
                                                        // clean-up
                                                        xReadHelper = null;
                                                    }// found NodeVersion
                                                }// if found
                                            }//for i...
                                            if( !found ) result = TestResult.Skipped;
                                            return( result ) } } },
        DataType: {
            Attributes: {
                Mandatories: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        // get the REQUIRED attributes for type OBJECT
                                        var requiredAttributes = new NodeTypeAttributesMatrix().DataType;
                                        var requiredAttributeTypes = new NodeTypeAttributesMatrix().DataType_Types;
                                        // iterate through all required attributes searching for them in the read response
                                        while( requiredAttributes.length > 0 ) {
                                            var currentAttribute = requiredAttributes.pop();
                                            var currentAttributeType = requiredAttributeTypes.pop();
                                            var found = false;
                                            // iterate through the read request to find the request, then use its' position to find the result
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                    // make sure it exists and then make sure the type is correct
                                                    if( Assert.Equal( StatusCode.Good, args.ReadResponse[i].StatusCode.StatusCode, "Attribute '" + Attribute.toString( currentAttribute ) + "' not found (Position: " + i + ")" ) ) found = TestResult.Fail;
                                                    if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                            if( !found ) { 
                                                result = TestResult.Fail;
                                                addError( "Missing attribute '" + Attribute.toString( currentAttribute ) + "' on Node '" + args.Node.NodeId + "'. NodeClass: Method" );
                                            }
                                        }//while
                                        return( result ); }, //function
                Optionals: function( args ){ // OK
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                    // get the OPTIONAL attributes for type OBJECT
                                    var optionalAttributes = new NodeTypeAttributesMatrix().Base_Optional;
                                    var optionalAttributeTypes = new NodeTypeAttributesMatrix().Base_Optional_Types;
                                    // iterate through all optional attributes searching for them in the read response
                                    var found = false;
                                    while( optionalAttributes.length > 0 ) {
                                        var currentAttribute = optionalAttributes.pop();
                                        var currentAttributeType = optionalAttributeTypes.pop();
                                        // iterate through the read request to find the request, then use its' position to find the result
                                        for( var i=0; i<args.ReadRequest.length; i++ ) {
                                            if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                found = true;
                                                // check the data-type ONLY if the status code is good
                                                if( args.ReadResponse[i].StatusCode.isGood() ) {
                                                    // optional attributes can contain a <NULL>..
                                                    if( args.ReadResponse[i].Value.DataType != BuiltInType.Null ) {
                                                        if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    }
                                                }
                                                break;
                                            }//found the attribute
                                        }//for i...
                                    }//while
                                    if( !found ) result = TestResult.Skipped;
                                    return( result ); },
                Missing: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args.ReadRequest ) || !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        var nodetypeMatrix = new NodeTypeAttributesMatrix();
                                        var missingAttributes = nodetypeMatrix.AllExcept( nodetypeMatrix.DataType.concat( nodetypeMatrix.Base_Optional ) );
                                        while( missingAttributes.length > 0 ) {
                                            var currentMissingAttribute = missingAttributes.pop();
                                            // iterate thru the read request to find the position of the read request 
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentMissingAttribute ) {
                                                    // make sure the call failed
                                                    if( !Assert.False( args.ReadResponse[i].StatusCode.isGood(), "Attribute '" + Attribute.toString( currentMissingAttribute ) + "' was found, which is neither Required or Optional." ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                        }//while
                                        return( result ); }, },
            References: {
                HasProperty: function( args ){ return( InformationModelValidation.Object.References.HasProperty( args ) ); },
                HasSubtype: function( args ){  return( InformationModelValidation.Object.References.HasSubtype( args ) );  },
                HasEncoding: function( args ){ 
                                        var result = TestResult.Pass;
                                        
                                        return( result );
                        },
                Others: function( args ) { return( recursiveTestOnNodeClass( { Factory: InformationModelValidation.Common.References, BrowseRequest: args.BrowseRequest, BrowseResponse: args.BrowseResponse, ReadRequest: args.ReadRequest, ReadResponse: args.ReadResponse, BrowsePath: args.BrowsePath } ) ); } },
            Properties: {
                BrowseNameUniquenessTest: function( args ){ return( InformationModelValidation.Common.Properties.BrowseNameUniquenessTest( args ) ); },
                SameServerTest:  function( args ){ return( InformationModelValidation.Common.Properties.SameServerTest( args ) ); },
                NodeVersion: function( args ){ return( InformationModelValidation.Object.Properties.NodeVersion( args ) ); },
                EnumStrings: function( args ){ 
                                        var result = TestResult.Pass;
                                        var propertyName = "EnumStrings";
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look through all references for Properties
                                        // property is optional!
                                        var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse[0].length; i++ ) {
                                            if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                // is this the right property?
                                                if( args.BrowseResponse[i].BrowseName.Text.equals( propertyName ) ) {
                                                    found = true;
                                                    // make sure there's only ONE NodeVersion property
                                                    var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                    if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                    else InformationModelValidation.Stash.Add( keyName, 1 );
                                                    // check the property is a LocalizedText array!
                                                    var xReadHelper = new ReadService( { Session: Test.Session } );
                                                    var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId )[0];
                                                    if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                        // is an array of LocalizedText!
                                                        if( !Assert.Equal( VariantArrayType.Array, xReadHelper.Response.Results[0].Value.ArrayType, propertyName + " should be of type Array." ) ) result = TestResult.Fail;
                                                        if( !Assert.Equal( BuiltInType.LocalizedText, xReadHelper.Response.Results[0].Value.DataType, "NodeVersion property should be type: String." ) ) result = TestResult.Fail;
                                                    }
                                                    else result = TestResult.Fail;
                                                    // clean-up
                                                    xReadHelper = null;
                                                }// found NodeVersion
                                            }// if found
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); },
                EnumValues:  function( args ){ 
                                        var result = TestResult.Pass;
                                        var propertyName = "EnumValues";
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look through all references for Properties
                                        // property is optional!
                                        var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse[0].length; i++ ) {
                                            if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                // is this the right property?
                                                if( args.BrowseResponse[i].BrowseName.Text.equals( propertyName ) ) {
                                                    found = true;
                                                    // make sure there's only ONE NodeVersion property
                                                    var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                    if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                    else InformationModelValidation.Stash.Add( keyName, 1 );
                                                    // check the property is a LocalizedText array!
                                                    var xReadHelper = new ReadService( { Session: Test.Session } );
                                                    var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId )[0];
                                                    if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                        // is an array of EnumValueType!
                                                        if( !Assert.Equal( VariantArrayType.Array, xReadHelper.Response.Results[0].Value.ArrayType, propertyName + " should be of type Array." ) ) result = TestResult.Fail;
                                                        if( !Assert.Equal( BuiltInType.ExtensionObject, xReadHelper.Response.Results[0].Value.DataType, "NodeVersion property should be type: String." ) ) result = TestResult.Fail;
                                                        else {
                                                            var argTypes = [ new UaNodeId( Identifier.EnumValueInfo_Encoding_DefaultXml ), new UaNodeId( Identifier.EnumValueInfo_Encoding_DefaultBinary ) ];
                                                            var valueAsExtObj = xReadHelper.Response.Results[0].Value.toExtensionObjectArray();
                                                            // do we have any inbound parameters to validate?
                                                            for( var v=0; v<valueAsExtObj.length; v++ ) {
                                                                var innerFind = false;
                                                                for( var t=0; t<argTypes.length; t++ ) {
                                                                    if( argTypes[t].equals( valueAsExtObj[v].TypeId.NodeId ) ) {
                                                                        innerFind = true;
                                                                        found = true;
                                                                        break;
                                                                    }
                                                                }//for t...
                                                                if( !Assert.True( innerFind, propertyName + " contains a value that is not of the right EnumValue type." ) ) result = TestResult.Fail;
                                                            }//for v...
                                                            if( !Assert.True( found, propertyName + " must be of type EnumValue. Conversion to ExtensionObject, and then EnumValue, failed because the Value.Type shows a different type." )) result = TestResult.Fail;
                                                            else result = TestResult.Pass;
                                                        }
                                                    }
                                                    else result = TestResult.Fail;
                                                    // clean-up
                                                    xReadHelper = null;
                                                }// found NodeVersion
                                            }// if found
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); }, } },
        ReferenceType: {
            Attributes: {
                Mandatories: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        // get the REQUIRED attributes for type OBJECT
                                        var requiredAttributes = new NodeTypeAttributesMatrix().ReferenceType;
                                        var requiredAttributeTypes = new NodeTypeAttributesMatrix().ReferenceType_Types;
                                        // iterate through all required attributes searching for them in the read response
                                        while( requiredAttributes.length > 0 ) {
                                            var currentAttribute = requiredAttributes.pop();
                                            var currentAttributeType = requiredAttributeTypes.pop();
                                            var found = false;
                                            // iterate through the read request to find the request, then use its' position to find the result
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                    // make sure it exists and then make sure the type is correct
                                                    if( Assert.Equal( StatusCode.Good, args.ReadResponse[i].StatusCode.StatusCode, "Attribute '" + Attribute.toString( currentAttribute ) + "' not found (Position: " + i + ")" ) ) found = TestResult.Fail;
                                                    if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                            if( !found ) { 
                                                result = TestResult.Fail;
                                                addError( "Missing attribute '" + Attribute.toString( currentAttribute ) + "' on Node '" + args.Node.NodeId + "'. NodeClass: ReferenceType" );
                                            }
                                        }//while
                                        return( result ); }, //function
                Optionals: function( args ){ // OK
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                    // get the OPTIONAL attributes for type OBJECT
                                    var optionalAttributes = new NodeTypeAttributesMatrix().ReferenceType_Optional;
                                    var optionalAttributeTypes = new NodeTypeAttributesMatrix().ReferenceType_Optional_Types;
                                    // iterate through all optional attributes searching for them in the read response
                                    var found = false;
                                    while( optionalAttributes.length > 0 ) {
                                        var currentAttribute = optionalAttributes.pop();
                                        var currentAttributeType = optionalAttributeTypes.pop();
                                        // iterate through the read request to find the request, then use its' position to find the result
                                        for( var i=0; i<args.ReadRequest.length; i++ ) {
                                            if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                found = true;
                                                // check the data-type ONLY if the status code is good
                                                if( args.ReadResponse[i].StatusCode.isGood() ) {
                                                    if( args.ReadResponse[i].Value.DataType != BuiltInType.Null ) {
                                                        if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    }
                                                }
                                                break;
                                            }//found the attribute
                                        }//for i...
                                    }//while
                                    if( !found ) result = TestResult.Skipped;
                                    return( result ); },
                Missing: function( args ){ // OK
                                        var result = TestResult.Pass;
                                        if( !isDefined( args.ReadRequest ) || !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        var nodetypeMatrix = new NodeTypeAttributesMatrix();
                                        var missingAttributes = nodetypeMatrix.AllExcept( nodetypeMatrix.ReferenceType.concat( nodetypeMatrix.ReferenceType_Optional ) );
                                        while( missingAttributes.length > 0 ) {
                                            var currentMissingAttribute = missingAttributes.pop();
                                            // iterate thru the read request to find the position of the read request 
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentMissingAttribute ) {
                                                    // make sure the call failed
                                                    if( !Assert.False( args.ReadResponse[i].StatusCode.isGood(), "Attribute '" + Attribute.toString( currentMissingAttribute ) + "' was found, which is neither Required or Optional." ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                        }//while
                                        return( result ); },
                IsAbstract: function( args ){ 
                                        var result = TestResult.Pass;
                                        // Step 1: get the value of IsAbstract; if TRUE then check if in the type system
                                        // Excel: 17
                                        const ISABSTRACT=7;
                                        if( args.ReadResponse[ISABSTRACT].StatusCode.isGood() ) { // we only care if the read was successful
                                            var isAbstractValue = args.ReadResponse[ISABSTRACT].Value.toBoolean();
                                            if( isAbstractValue ) { // IsAbstract=TRUE; we need to check that it's in the type system
                                                if( !_seekNodeIsOfType( { 
                                                                     NodeToSearch: args.ReadRequest[0].NodeId,
                                                                     TypeSought: [ new UaNodeId( Identifier.TypesFolder ),
                                                                                   new UaNodeId( Identifier.DataTypesFolder ),
                                                                                   new UaNodeId( Identifier.BaseDataType ),
                                                                                   new UaNodeId( Identifier.EventTypesFolder ),
                                                                                   new UaNodeId( Identifier.BaseEventType ),
                                                                                   new UaNodeId( Identifier.ObjectTypesFolder ),
                                                                                   new UaNodeId( Identifier.BaseObjectType ),
                                                                                   new UaNodeId( Identifier.ReferenceTypesFolder ),
                                                                                   new UaNodeId( Identifier.HierarchicalReferences ),
                                                                                   new UaNodeId( Identifier.NonHierarchicalReferences ),
                                                                                   new UaNodeId( Identifier.References ),
                                                                                   new UaNodeId( Identifier.VariableTypesFolder ),
                                                                                   new UaNodeId( Identifier.BaseVariableType ) ] } ) ) {
                                                   addError( "ReferenceType '" + args.ReadRequest[ISABSTRACT].NodeId + "'.IsAbstract is TRUE, but couldn't be found in the Type System.\nBrowse Path: " + args.BrowsePath );
                                                   result = TestResult.Fail;
                                                }
                                            }
                                        }//if available
                                        else {
                                            addError( "IsAbstract attribute unavailable. Read.Response[" + ISABSTRACT + "].StatusCode: " + args.ReadResult[ISABSTRACT].StatusCode + ". Error reading NodeId: " + args.ReadRequest[0].NodeId );
                                            result = TestResult.Fail;
                                        }
                                        return( result );  },
                SymmetricInverseName: function( args ){ 
                                        // Excel: 18
                                        var result = TestResult.Pass;
                                        const ISABSTRACT=7, SYMMETRIC=8, INVERSENAME=9, SPECLINK="UA Part 3 section 5.3.2";
                                        if( args.ReadResponse[ISABSTRACT].StatusCode.isGood() && args.ReadResponse[SYMMETRIC].StatusCode.isGood() ) {
                                            var _isAbstract = args.ReadResponse[ISABSTRACT].Value.toBoolean();
                                            var _symmetric  = args.ReadResponse[SYMMETRIC].Value.toBoolean();
                                            var _invseName  = args.ReadResponse[INVERSENAME].Value.toLocalizedText();
                                            /* the truth-table of how these two attributes operate:
                                               --------------------------------------------------
                                               - IsAbstract  | Symmetric | InverseName is present
                                               -    N        |     N     |  Y
                                               -    Y        |     Y     |  N
                                               -    Y        |     N     |  Y/N
                                               -    N        |     Y     |  N */
                                            if( !_isAbstract && !_symmetric )     { Assert.True ( args.ReadResponse[INVERSENAME].StatusCode.isGood(), "IsAbstract=N; Symmetric=N; so InverseName must be available, but it is not.\nNodeId: " + args.ReadRequest[0].NodeId + "\nBrowse Path: " + args.BrowsePath + "\n" + SPECLINK ); result = TestResult.Fail; }
                                            else if( _isAbstract && _symmetric )  { Assert.False( args.ReadResponse[INVERSENAME].StatusCode.isBad(),  "IsAbstract=Y; Symmetric=Y; so inverseName should be unavailable, but it is.\nNodeId: " + args.ReadRequest[0].NodeId + "\nBrowse Path: " + args.BrowsePath + "\n" + SPECLINK ); result = TestResult.Fail; }
                                            else if( !_isAbstract && _symmetric ) { Assert.False( args.ReadResponse[INVERSENAME].StatusCode.isBad(),  "IsAbstract=N; Symmetric=Y; so inverseName should be unavailable, but it is.\nNodeId: " + args.ReadRequest[0].NodeId + "\nBrowse Path: " + args.BrowsePath + "\n" + SPECLINK ); result = TestResult.Fail; }
                                        }
                                        else {
                                            addError( "IsAbstract/Symmetric/InverseName bad; IsAbstract=" + args.ReadResponse[ISABSTRACT].StatusCode + "; Symmetric=" + args.ReadResponse[SYMMETRIC].StatusCode + "; InverseName=" + args.ReadResponse[INVERSENAME].StatusCode + ". Unable to continue test." );
                                            result = TestResult.Fail;
                                        }
                                        return( result );  }, },
            References: {
                HasProperty: function( args ){ return( InformationModelValidation.Object.References.HasProperty( args ) ); },
                HasSubtype:  function( args ){ args.BaseType = new UaNodeId( Identifier.References );
                                               return( InformationModelValidation.Common.References.HasSubtype( args ) ); },
                NoOthers: function( args ) { 
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                    // look for hasProperty and hasSubtype; both are optional and with any quantity, but no other references allowed
                                    var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                    var hasSubtypeNodeId  = new UaNodeId( Identifier.HasSubtype  );
                                    var foundOthers = false;
                                    for( var i=0; i<args.BrowseResponse.length; i++ ){
                                        if( args.BrowseResponse[i].IsForward ) { // we only care about forward references
                                            if( !( args.BrowseResponse[i].ReferenceTypeId.equals( hasPropertyNodeId ) ||
                                                    args.BrowseResponse[i].ReferenceTypeId.equals( hasSubtypeNodeId ) ) ) {
                                                addError( "ReferenceType '" + args.BrowseRequest.NodesToBrowse[0].NodeId + "' should contain references for 'HasProperty' or 'HasSubtype' only, but found Browse.Response.Results[" + i + "].ReferenceTypeId: " + args.BrowseResponse[i].ReferenceTypeId + ".\nUA Specifications Part 3, Table 4 (ReferenceType NodeClass)" );
                                                result = TestResult.Fail;
                                                break;
                                            }
                                        }// if isForward
                                    }// for i...
                                    return( result ); },// function
                Others: function( args ) { return( recursiveTestOnNodeClass( { Factory: InformationModelValidation.Common.References, BrowseRequest: args.BrowseRequest, BrowseResponse: args.BrowseResponse, ReadRequest: args.ReadRequest, ReadResponse: args.ReadResponse, BrowsePath: args.BrowsePath } ) ); } },
            Properties: {
                BrowseNameUniquenessTest: function( args ){ return( InformationModelValidation.Common.Properties.BrowseNameUniquenessTest( args ) ); },
                SameServerTest:  function( args ){ return( InformationModelValidation.Common.Properties.SameServerTest( args ) ); },
                NodeVersion: function( args ) { return( InformationModelValidation.DataType.Properties.NodeVersion( args ) ); } },
            Others: {
                InfiniteLoop: function( args ){ return( TestResult.NotImplemented );  } } },
        View: {
            Attributes: {
                Mandatories: function( args ){ // OK
                                        // Excel: 23
                                        var result = TestResult.Pass;
                                        if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        // get the REQUIRED attributes for type OBJECT
                                        var requiredAttributes = new NodeTypeAttributesMatrix().View;
                                        var requiredAttributeTypes = new NodeTypeAttributesMatrix().View_Types;
                                        // iterate through all required attributes searching for them in the read response
                                        while( requiredAttributes.length > 0 ) {
                                            var currentAttribute = requiredAttributes.pop();
                                            var currentAttributeType = requiredAttributeTypes.pop();
                                            var found = false;
                                            // iterate through the read request to find the request, then use its' position to find the result
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                    // make sure it exists and then make sure the type is correct
                                                    if( Assert.Equal( StatusCode.Good, args.ReadResponse[i].StatusCode.StatusCode, "Attribute '" + Attribute.toString( currentAttribute ) + "' not found (Position: " + i + ")" ) ) found = TestResult.Fail;
                                                    if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                            if( !found ) { 
                                                result = TestResult.Fail;
                                                addError( "Missing attribute '" + Attribute.toString( currentAttribute ) + "' on Node '" + args.Node.NodeId + "'. NodeClass: ReferenceType" );
                                            }
                                        }//while
                                        return( result ); }, //function
                Optionals: function( args ){ // OK
                                        // Excel: 23
                                    var result = TestResult.Pass;
                                    if( !isDefined( args ) && !isDefined( args.ReadRequest ) && !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                    // get the OPTIONAL attributes for type OBJECT
                                    var optionalAttributes = new NodeTypeAttributesMatrix().View_Optional;
                                    var optionalAttributeTypes = new NodeTypeAttributesMatrix().View_Optional_Types;
                                    // iterate through all optional attributes searching for them in the read response
                                    var found = false;
                                    while( optionalAttributes.length > 0 ) {
                                        var currentAttribute = optionalAttributes.pop();
                                        var currentAttributeType = optionalAttributeTypes.pop();
                                        // iterate through the read request to find the request, then use its' position to find the result
                                        for( var i=0; i<args.ReadRequest.length; i++ ) {
                                            if( args.ReadRequest[i].AttributeId === currentAttribute ) {
                                                found = true;
                                                // check the data-type ONLY if the status code is good
                                                if( args.ReadResponse[i].StatusCode.isGood() ) {
                                                    if( args.ReadResponse[i].Value.DataType != BuiltInType.Null ) {
                                                        if( !Assert.Equal( BuiltInType.toString( currentAttributeType ), BuiltInType.toString( args.ReadResponse[i].Value.DataType ), "Attribute '" + Attribute.toString( currentAttribute ) + "' type mismatch (Position: " + i + ")" ) ) result = TestResult.Fail;
                                                    }
                                                }
                                                break;
                                            }//found the attribute
                                        }//for i...
                                    }//while
                                    if( !found ) result = TestResult.Skipped;
                                    return( result ); },
                Missing: function( args ){ // OK
                                        // Excel: 23
                                        var result = TestResult.Pass;
                                        if( !isDefined( args.ReadRequest ) || !isDefined( args.ReadResponse ) ) return( TestResult.Error );
                                        var nodetypeMatrix = new NodeTypeAttributesMatrix();
                                        var missingAttributes = nodetypeMatrix.AllExcept( nodetypeMatrix.View.concat( nodetypeMatrix.View_Optional ) );
                                        while( missingAttributes.length > 0 ) {
                                            var currentMissingAttribute = missingAttributes.pop();
                                            // iterate thru the read request to find the position of the read request 
                                            for( var i=0; i<args.ReadRequest.length; i++ ) {
                                                if( args.ReadRequest[i].AttributeId === currentMissingAttribute ) {
                                                    // make sure the call failed
                                                    if( !Assert.False( args.ReadResponse[i].StatusCode.isGood(), "Attribute '" + Attribute.toString( currentMissingAttribute ) + "' was found, which is neither Required or Optional." ) ) result = TestResult.Fail;
                                                    break;
                                                }//found the attribute
                                            }//for i...
                                        }//while
                                        return( result ); }, },
            References: {
                HierarchicalReferences: function( args ){ 
                                            if( !isDefined( args ) || !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                            var result = TestResult.Pass;
                                            // Excel: 26
                                            // TEST ONE: This 'View' node can be referenced by a Hierarchical reference only
                                            for( var i=0; i<args.BrowseResponse.length; i++ ) {   // iterate thru each browse result
                                                if( !args.BrowseResponse[i].IsForward ) {         // only care for inverse references
                                                    if( !Assert.True( HierarchicalReferences.Contains( args.BrowseResponse[i].ReferenceTypeId, "View (NodeId: " + args.BrowseRequest[0].NodeId + ") is referred to by a non-hierarchical node (NodeId: " + args.BrowseResponse[i].ReferenceTypeId + ")." ) ) ) result = TestResult.Fail;
                                                }// is inverse?
                                            }//for i...
                                            return( result );
                                        },
                HasProperty:  function( args ){ 
                                        // Excel: 24
                                        return( InformationModelValidation.Common.References.HasProperty( args ) ); },
                ServerObject: function( args ){ 
                                        // Excel: 25
                                        var result = TestResult.Pass;
                                        SERVERMAXDEPTH = 0; //global variable used as a fail-safe to prevent overly-extensive searches
                                        if( recursiveSeekNodeId( { RootNode: args.ReadRequest[0].NodeId, SoughtNodeId: new UaNodeId( Identifier.Server ) } ) ) result = TestResult.Fail;
                                        return( result ); },
                SourceNode:   function( args ){ //print( "View.SourceNode of Hierarchical References only." ); 
                                        var result = TestResult.Pass;
                                        var hierarchicalTypeRefNodeId = new UaNodeId( Identifier.HierarchicalReferences );
                                        var xBrowseHelper = new BrowseService( { Session: Test.Session } );
                                        for( var r=0; r<args.BrowseResponse.length; r++ ) { //iterate thru all Browse responses, that got us here
                                            if( !args.BrowseResponse[r].IsForward ) { // is this an inverse ref? we will look at the parent next to determine its type
                                                if( !_seekNodeIsOfType( { NodeToSearch: args.BrowseResponse[r].NodeId, SoughtType: hierarchicalTypeRefNodeId, BrowseHelper: xBrowseHelper, BrowsePath: args.BrowsePath } ) ) result = TestResult.Fail;
                                            }//if is inverse
                                        }//for r...
                                        xBrowseHelper = null;
                                        return( result ); },
                Organizes:      function( args ){ return( InformationModel.Object.References.Organizes( args ) ); },
                Others: function( args ) { return( recursiveTestOnNodeClass( { Factory: InformationModelValidation.Common.References, BrowseRequest: args.BrowseRequest, BrowseResponse: args.BrowseResponse, ReadRequest: args.ReadRequest, ReadResponse: args.ReadResponse, BrowsePath: args.BrowsePath } ) ); } },
            Properties: {
                BrowseNameUniquenessTest: function( args ){ return( InformationModelValidation.Common.Properties.BrowseNameUniquenessTest( args ) ); },
                SameServerTest:  function( args ){ return( InformationModelValidation.Common.Properties.SameServerTest( args ) ); },
                NodeVersion: function( args ){ return( InformationModelValidation.Object.Properties.NodeVersion( args ) ); },
                ViewVersion: function( args ){ 
                                        var result = TestResult.Pass;
                                        var propertyName = "ViewVersion";
                                        if( !isDefined( args ) && !isDefined( args.BrowseRequest ) && !isDefined( args.BrowseResponse ) ) return( TestResult.Error );
                                        // look through all references for Properties; locate "NodeVersion".
                                        // property is optional!
                                        var hasPropertyNodeId = new UaNodeId( Identifier.HasProperty );
                                        var found = false;
                                        for( var i=0; i<args.BrowseResponse[0].length; i++ ) {
                                            if( hasPropertyNodeId.equals( args.BrowseResponse[i].ReferenceTypeId ) ) {
                                                // is this the right property?
                                                if( args.BrowseResponse[i].BrowseName.Text.equals( propertyName ) ) {
                                                    found = true;
                                                    // make sure there's only ONE instance of this property
                                                    var keyName = args.ReadRequest[0].NodeId + propertyName;
                                                    if( !Assert.False( InformationModelValidation.Stash.Contains( keyName ), propertyName + " property is defined more than once. One one instance of this Property type is allowed per node." ) ) result = TestResult.Fail;
                                                    else InformationModelValidation.Stash.Add( keyName, 1 );
                                                    // check the property type
                                                    var xReadHelper = new ReadService( { Session: Test.Session } );
                                                    var itemToRead = MonitoredItem.fromNodeIds( args.BrowseResponse[i].NodeId )[0];
                                                    if( xReadHelper.Execute( { NodesToRead: itemToRead, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                                                        if( !Assert.Equal( BuiltInType.UInt32, xReadHelper.Response.Results[0].Value.DataType, propertyName + " property should be type: UInt32." ) ) result = TestResult.Fail;
                                                    }
                                                    else result = TestResult.Fail;
                                                    // clean-up
                                                    xReadHelper = null;
                                                }// found NodeVersion
                                            }// if found
                                        }//for i...
                                        if( !found ) result = TestResult.Skipped;
                                        return( result ); }, },
            }
}





var indent=-1;
function getIndentString() { var s=""; for( var i=0; i<indent; i++ ) s += "  + "; return( s ); }
function recursiveTestOnNodeClass( args ){
    if( isDefined( args ) && isDefined( args.Factory ) ) {
        var result = TestResult.Pass;
        indent++;
        var s = getIndentString();
        var currentFactory = ( isDefined( args.Pointer ) ? args.Pointer: args.Factory );
        for( var o in currentFactory ) {
            var objectType = typeof currentFactory[o];
            switch( objectType ) {
                case 'object': 
                    print( s + o + " =>" );
                    args.Pointer = currentFactory[o];
                    result = TestResult.Set( recursiveTestOnNodeClass( args ) );
                    break;
                case 'function' :
                    result = TestResult.Set( currentFactory[o]( args ) );
                    print( s + o  + "() => " + TestResult.toString( result ) );
                    break;
                default: 
                    print( s + "skip [" + o + "]: type: " + objectType );
                    break;
            }
        }//for f in func
        indent--;
        return( result );
    }//if func exists
    return( TestResult.Fail );
}





include( "./library/Base/safeInvoke.js" );
include( "./library/Base/NodeTypeAttributesMatrix.js" );





/* Converts a single node into an array of Nodes, with each having a different attribute related to it, as
   specified.
   Parameters: 
       nodeToClone: [nodeId] the node that will be cloned
       attributes: [array][Attribte] the attributes that will be applied to each item, individually */
function _getAttributesAsNodes( nodeToClone, attributes ) {
    var nodes = [];
    for( a in attributes ) {
        var newNode = nodeToClone.clone();
        newNode.AttributeId = attributes[a];
        nodes.push( newNode );
    }
    return( nodes );
}





/* Uses the Browse service to recursively walk UP the address-space (reverse direction) to see if a specified
   Node derives from a specified type.
   Parameters:
       NodeToSearch: [NodeId] The node to start browsing from (the one being checked)
       TypeSought: [NodeId] The desired Reference Type that we want to check is the super-type.
       BrowseHelper: [optional] [BrowseService library helper] -- if not specified, one will be created */
function _seekNodeIsOfType( args ) {
    if( !isDefined( args ) || !isDefined( args.NodeToSearch ) || !isDefined( args.TypeSought) ) return( false );               // exit if required params aren't specified
    if( !isDefined( args.TypeSought.length ) ) args.TypeSought = [ args.TypeSought ];                                          // convert typeSought to an array
    if(  isDefined( args.NodeToSearch.ServerIndex ) ) args.NodeToSearch = args.NodeToSearch.NodeId;                            // don't need expanded node id, just node id
    if( !isDefined( args.NodeToSearch.NodeSetting ) ) args.NodeToSearch = MonitoredItem.fromNodeIds( args.NodeToSearch )[0];   // convert nodeid to 'monitoredItem' object
    // use a temporary Browse service in this function only
    var xBrowseHelper = isDefined( args.BrowseHelper )? args.BrowseHelper : new BrowseService( { Session: Test.Session } );
    args.NodeToSearch.BrowseDirection = BrowseDirection.Inverse;
    args.NodeToSearch.ReferenceTypeId = new UaNodeId( Identifier.References );
    args.NodeToSearch.IncludeSubtypes = true;
    if( !xBrowseHelper.Execute( { NodesToBrowse: args.NodeToSearch, SuppressMessaging: true, SuppressWarnings: true  } ) ) {
        addError( "Browse failed on Path: " + args.BrowsePath + "; node: " + args.NodeToSearch );
        return( false );
    }
    // iterate through our browse results and check if ANY match our desired type
    var found = false, result = false;
    for( var i=0; i<xBrowseHelper.Response.Results[0].References.length; i++ ) {
        for( var t=0; t<args.TypeSought.length; t++ ) {
            if( args.TypeSought[t].equals( xBrowseHelper.Response.Results[0].References[i].ReferenceTypeId ) ||
                args.TypeSought[t].equals( xBrowseHelper.Response.Results[0].References[i].NodeId.NodeId ) ) {
                found = true;
                break;
            }//found it
        }//for t...
    }//for i..
    // did we find it? if not, iterate thru each reference and recursively try again, on each
    if( !found ) {
        for( var i=0; i<xBrowseHelper.Response.Results[0].References.length; i++ ) {
            if( _seekNodeIsOfType( { NodeToSearch: xBrowseHelper.Response.Results[0].References[i].NodeId,
                                     TypeSought: args.TypeSought,
                                     BrowsePath: args.BrowsePath } ) ) {
                 found = true;
                 break;
             }// found?
        }//for i..
    }// not found, recursively search
    else result = true;
    return( result );
}



/* Uses the Browse and Read services to [recursively] compare the attributes, properties, and references of the 
   child type against the definition of the parent type.
   Parameters: 
       ChildTypeNodeId:
       ParentTypeNodeId:
       BrowseHelper (optional): 
       ReadHelper   (optional): */
function _checkInheritence( args ) {
    if( !isDefined( args ) || !isDefined( args.ChildNodeId ) || !isDefined( args.ParentNodeId ) ) throw( "_checkInheritence() one or more arguments not specified." );
    if( !isDefined( args.BrowseHelper ) ) args.BrowseHelper = new BrowseService( { Session: Test.Session } );
    var result = true;
    // we have the child-type (browse response); so go get the parent type (we will dig-deeper into the structure later...)
    var childNode  = new MonitoredItem( args.ChildNodeId );
    childNode.BrowseDirection = BrowseDirection.Both;
    var parentNode = new MonitoredItem( args.ParentNodeId );
    parentNode.BrowseDirection = BrowseDirection.Both;
    if( !args.BrowseHelper.Execute( { NodesToBrowse: [ parentNode, childNode ], SuppressMessaging: true, SuppressWarnings: true  } ) ) return( false );
    else {
        var hasComponentNodeId = new UaNodeId( Identifier.HasComponent );
        var parentResults = args.BrowseHelper.Response.Results[0];
        var childResults  = args.BrowseHelper.Response.Results[1];                                       // capture browse results into separate variables
        for( var p=0; p<parentResults.References.length; p++ ) {                                         // iterate thru all of parent's references
            var matched = false, childRef = null, parentRef = parentResults.References[p];
            for( var c=0; c<childResults.References.length; c++ ) {                                      // iterate thru all child-references, looking for matching browse name
                childRef = childResults.References[c];
                if( parentRef.BrowseName.equals( childRef.BrowseName ) ) {
                    matched = true;
                    break;
                }
            }//for c...
            // check if MANDATATORY or OPTIONAL
            var modellingRuleP = _checkModellingRule( { NodeId: parentRef.NodeId.NodeId, BrowseHelper: args.BrowseHelper } ); // parent modelling rule
            if( !matched ) { // browse names match?
                if( modellingRuleP !== null && modellingRuleP === ModellingRule.Mandatory || modellingRuleP === ModellingRule.Constraint ) { 
                    addError( "Inheritence Failure: Parent.Reference[" + p + "].BrowseName='" + parentRef.BrowseName.Name + "' was not found in derived target type (NodeId: " + args.ChildTypeNodeId + ")." );
                    result = false;
                }
            }
            else { 
                // check if the sub-type honors Part 3 Table 15 where: Mandatory -> Mandatory; Optional -> Mandatory/Optional; Constraint -> Constraint
                var modellingRuleC = _checkModellingRule( { NodeId: parentRef.NodeId.NodeId, BrowseHelper: args.BrowseHelper } ); // parent modelling rule
                if( modellingRuleC !== undefined && modellingRuleC !== null ) {
                    if( !ModellingRule.SubtypeModellingRuleValid( { ParentModellingRule: modellingRuleP, ChildModellingRule: modellingRuleC } ) ) result = false;
                    // dig deeper? go recursively check sub-properties/objects etc.?
                    if( hasComponentNodeId.equals ( parentRef.ReferenceTypeId ) ) {
                        result = _checkInheritence( { ParentNodeId: parentRef.NodeId.NodeId,
                                                      ChildNodeId:  childRef.NodeId.NodeId,
                                                      BrowseHelper: args.BrowseHelper } );
                    }
                    break; // stop iterating thru child references
                }
            }
        }//for p...
    }
    return( result );
}


/* Uses Browse to find the HasModellingRule on a specified Node. The value returned is a ModellingRule (UaM.js) enumerated type.
   Parameters: 
       NodeId: the node that will be queried for a modelling rule
       BrowseHelper (optional):
   Returns: ModellingRule (UaM.js) enumerated type */
function _checkModellingRule( args ) {
    if( !isDefined( args ) || !isDefined( args.NodeId ) ) throw( "_checkModellingRule() arguments not specified" );
    if( !isDefined( args.BrowseHelper ) ) args.BrowseHelper = new BrowseService( { Session: Test.Session } );
    var nodeToBrowse = new MonitoredItem( args.NodeId );
    if( args.BrowseHelper.Execute( { NodesToBrowse: nodeToBrowse, SuppressMessaging: true, SuppressWarnings: true } ) ) {
        var hasModellingRuleNodeId = new UaNodeId( Identifier.HasModellingRule );
        for( var r=0; r<args.BrowseHelper.Response.Results.length; r++ ) {                  // iterate thru all results; should be just one
            if( args.BrowseHelper.Response.Results[r].StatusCode.isGood() ) {               // browse successful for this item?
                for( var f=0; f<args.BrowseHelper.Response.Results[r].References.length; f++ ) { // iterate thru all references
                    if( hasModellingRuleNodeId.equals( args.BrowseHelper.Response.Results[r].References[f].ReferenceTypeId ) ) {
                        var mrule = ModellingRule.FromNodeId( args.BrowseHelper.Response.Results[r].References[f].NodeId );
                        return( mrule );
                    }
                }//for f...
            }// is good?
        }//for r...
    }
    return( null );
}



// Determines which tests to conduct, based on the node-class
function informationModellingTestFactory( args ) {
    if( !isDefined( args ) && !isDefined( args.NodeClass ) ) return( false );
    indent++;
    args.BrowsePath = args.Path.join().replace( /,/g, "\\" ) + "\\";
    print( "\n\n" + getIndentString() + "Testing '" + args.ReadResponse[2].Value.toQualifiedName().Name + "' (NodeId: " + args.Node.NodeId.toString() + ") NodeClass: " + NodeClass.toString( args.ReadResponse[1].Value.toInt32() ) );
    print( getIndentString() + "Path: " + args.BrowsePath );
    indent++;
    switch( args.NodeClass ) { 
        case NodeClass.Object:       args.Factory = InformationModelValidation.Object;     break;
        case NodeClass.ObjectType:   args.Factory = InformationModelValidation.ObjectType; break;
        case NodeClass.Variable:     args.Factory = InformationModelValidation.Variable;   break;
        case NodeClass.VariableType: args.Factory = InformationModelValidation.VariableType;  break;
        case NodeClass.Method:       args.Factory = InformationModelValidation.Method;        break;
        case NodeClass.ReferenceType:args.Factory = InformationModelValidation.ReferenceType; break;
        case NodeClass.DataType:     args.Factory = InformationModelValidation.DataType; break;
        case NodeClass.View:         args.Factory = InformationModelValidation.View;     break;
        case NodeClass.Unspecified: throw( "Unspecified NodeClass selected: " + NodeClass.toString( args.NodeClass ) ); break;
        default:                    throw( "Invalid NodeClass selected: " + NodeClass.toString( args.NodeClass ) );     break;
    }//switch
    var result = TestResult.Set( recursiveTestOnNodeClass( args ) );
    print( "Test Result = " + TestResult.toString( result ) );
    indent-=2;
    return( result );
}




var _walkthroughCount = 0;
function walkThrough( args ) {
    if( !isDefined( args ) ) return( false );
    if( !isDefined( args.Path ) ) args.Path = [];
    _walkthroughCount++;
    // fail-safe: let's check max # items only and then exit -- 2DO: Remove AFTER development
    if( _walkthroughCount >= MAX_NODES_TO_CHECK ) return( false );
    // have we already tested the specified node? if so, exit already
    if( InformationModelValidation.Results.Contains( args.Node.NodeId ) ){
        print( "\n\n" + getIndentString() + "NodeId: " + args.Node.NodeId + " (Skip - already tested)" );
        return( InformationModelValidation.Results.Get( args.Node.NodeId ) );
    }
    // read ALL attributes for the given node; we don't care about errors at this point
    var itemsToRead = _getAttributesAsNodes( args.Node, new NodeTypeAttributesMatrix().All );
    var xReadHelper = new ReadService( { Session: Test.Session } );
    if( xReadHelper.Execute( { 
            NodesToRead: itemsToRead, 
            OperationResults: ExpectedResultsArray( { ExpectedResult: [ StatusCode.Good, StatusCode.BadAttributeIdInvalid ], Quantity: itemsToRead.length } ),
            SuppressMessaging: true, 
            SuppressWarnings: true } ) ) 
        {
        args.Node.BrowseDirection = BrowseDirection.Both;
        var xBrowseHelper = new BrowseService( { Session: Test.Session } );
        if( xBrowseHelper.Execute( { NodesToBrowse: args.Node, SuppressMessaging: true, SuppressWarnings: true } ) ) {
            // now, let's validate this node based on its NodeClass (2nd item, in Read)
            var result = informationModellingTestFactory( { 
                    Node: args.Node, 
                    Path: args.Path,
                    NodeClass: xReadHelper.Response.Results[1].Value.toInt32(), 
                    ReadRequest: xReadHelper.Request.NodesToRead, 
                    ReadResponse: xReadHelper.Response.Results,
                    BrowseRequest: xBrowseHelper.Request.NodesToBrowse, 
                    BrowseResponse: xBrowseHelper.Response.Results[0].References } );
            InformationModelValidation.Results.Set( args.Node.NodeId, result );
            // recursively walkthrough the results received
            for( var i=0; i<xBrowseHelper.Response.Results[0].References.length; i++ ) {
                // only follow FORWARD references that are HIERARCHICAL
                if( xBrowseHelper.Response.Results[0].References[i].IsForward ) {
                    if( HierarchicalReferences.Contains( xBrowseHelper.Response.Results[0].References[i].ReferenceTypeId  ) ) {
                        // add the current browse path to the ongoing variable (for display purposes)
                        args.Path.push( xReadHelper.Response.Results[2].Value.toQualifiedName().Name );
                        var nextNodeToCheck = MonitoredItem.fromNodeIds( xBrowseHelper.Response.Results[0].References[i].NodeId.NodeId )[0];
                        if( !walkThrough( { Node: nextNodeToCheck, Path: args.Path } ) ) break;
                        // remove the current browse path element from the stack; we're done using it.
                        args.Path.pop();
                    }
                    else {
                        print( "Skipping Reference[" + i + "] '" + xBrowseHelper.Response.Results[0].References[i].BrowseName.Name + "' because it is a NonHierarchicalReference." );
                        continue;
                    }
                }
            }//for i...
        }
        xBrowseHelper = null;
        xReadHelper = null;
    }
    return( true );
}




/* Recursively walks through the address-space, starting at a 'root node'
   Arguments:
       RootNode: the NodeId of the item to start browsing from 
       SoughtNodeId: the NodeId we are looking for 
   Returns: true=found; false=unavailable. */
var SERVERMAXDEPTH=0; //node counter; fail-safe to exit search after XXX nodes have been searched through
function recursiveSeekNodeId( args ) {
    if( !isDefined( args ) ) return( false );
    if( !isDefined( args.RootNode ) || !isDefined( args.SoughtNodeId ) ) return( false );
    if( SERVERMAXDEPTH == 1000 ) return( false );
    var rBrowseHelper = new BrowseService( { Session: Test.Session } ); // create a new browse helper object
    if( rBrowseHelper.Execute( { NodesToBrowse: MonitoredItem.fromNodeIds( args.RootNode )[0], SuppressMessaging: true, SuppressWarnings: true } ) ) {
        SERVERMAXDEPTH++;
        for( var r=0; r<rBrowseHelper.Response.Results[0].References.length; r++ ) { // iterate thru all returned references
            if( rBrowseHelper.Response.Results[0].References[r].IsForward ) { // forward ref? that's what we're looking for!
                if( HierarchicalReferences.Contains( rBrowseHelper.Response.Results[0].References[r].ReferenceTypeId ) ) { // needs to be a HIERARCHICAL reference only!
                    if( rBrowseHelper.Response.Results[0].References[r].NodeId.NodeId.equals( args.RootNode ) ) {
                        print( getIndentString() + "ServerObject found browsing Node '" + xBrowseHelper.Request.NodesToBrowse[0].NodeId + "' Response.Reference[" + r + "].NodeId=" + rBrowseHelper.Response.Results[0].References[r].NodeId );
                        return( true );
                    }//found?
                    if( recursiveSeekNodeId( { RootNode: rBrowseHelper.Response.Results[0].References[r].NodeId.NodeId, SoughtNodeId: args.SoughtNodeId } ) ) {
                        print( getIndentString() + "return TRUE by default (recursive)" );
                        return( true ); // recursively check nested nodes
                    }// recursive search...
                }//hierarchical reference?
            }//forward ref?
        }//for r...
    }// if browse is successful
    rBrowseHelper = null;
    return( false );
}



var HierarchicalReferences = new Object();
HierarchicalReferences = {
    References: [ new UaNodeId( Identifier.HierarchicalReferences ) ],
    FindAll: function( args ) {
                        var xBrowseHelper = new BrowseService( { Session: Test.Session } );
                        if( xBrowseHelper.Execute( { NodesToBrowse: args.Node, SuppressMessaging: true, SuppressWarnings: true } ) ) {
                            // cache all returned references, and then dive into each to find sub-types
                            for( var r=0; r<xBrowseHelper.Response.Results[0].References.length; r++ ) {
                                if( xBrowseHelper.Response.Results[0].References[r].IsForward ) {
                                    var currentNodeId = xBrowseHelper.Response.Results[0].References[r].NodeId.NodeId;
                                    this.References.push( currentNodeId );
                                    this.FindAll( { Node: MonitoredItem.fromNodeIds( currentNodeId )[0] } );
                                }//forward ref
                            }//for r...
                        }
                        xBrowseHelper = null; },
    Contains: function( nodeId ) { 
                        if( isDefined( nodeId ) ) {
                            for( var i=0; i<this.References.length; i++ ) {
                                if( nodeId.equals( this.References[i] ) ) return( true );
                            }//for i...
                        }
                        else return( false ); },
    toString: function(){ return( this.References.join().replace( /,/g, ", " ) ); }
}

/*
if( ! Test.Connect() ) {
    addError( "Unable to connect and establish a session");
}
else {
    // grab the hierarchical references first. We'll use them to determine which nodes to follow when walking through the address space.
    HierarchicalReferences.FindAll( { Node: MonitoredItem.fromNodeIds( new UaNodeId( Identifier.HierarchicalReferences ) )[0] } );
    //var rootNode = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server ) )[0];
    //var rootNode = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.ObjectTypesFolder ) )[0];
    //var rootNode = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.TypesFolder ) )[0];
    //var rootNode = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.ReferenceTypesFolder ) )[0];
    //var rootNode = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.VariableTypesFolder ) )[0];
    //var rootNode = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.EventTypesFolder ) )[0];
    //var rootNode = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.ViewsFolder ) )[0];
    var rootNode = MonitoredItem.fromNodeIds( UaNodeId.fromString( "ns=0;i=72" ) )[0];
    walkThrough( { Node: rootNode } );
    Test.Disconnect();
    print( "\n\n***** Stash Contents ***** (" + InformationModelValidation.Stash.length() + ")\n(temporary placeholder to ensure single instances)\n" );
    if( InformationModelValidation.Stash.length() > 0 ) for( var i=0; i<InformationModelValidation.Stash._values.length; i++ ) print( "\t" + InformationModelValidation.Stash._values[i] );
    print( "\n\n***** PASSED Nodes *****\n(Nodes that passed validation\n" );
    var resultKeys = InformationModelValidation.Results.Keys();
    for( var k=0; k<resultKeys.length; k++ ) if( InformationModelValidation.Results.Get( resultKeys[k] ) === TestResult.Pass ) print( "\t+ " + node );
    print( "\n\n***** FAILED Nodes *****\n(Nodes that failed validation)\n" );
    for( var k=0; k<resultKeys.length; k++ ) if( InformationModelValidation.Results.Get( resultKeys[k] ) === TestResult.Fail ) print( "\t" + node );
    print( "\n\n***** ALL Results ******\n(Displaying the results, just because...)\n" );
    for( var k=0; k<resultKeys.length; k++ ) print( "\t" + resultKeys[k] + " = " + TestResult.toString( InformationModelValidation.Results.Get( resultKeys[k] ) ) ); 
} // */