/*  Test prepared by compliance@opcfoundation.org
    Description: Call a method that requires input parameters, and provides output values, e.g. void method( in [], out [] ); */

function methodCallTest( session, objectId, methodId ) {
   // Read method name setting. If setting is empty, return
     var methodName = MonitoredItem.fromNodeIds( UaNodeId.fromString( Settings.ServerTest.NodeIds.Methods.IOArgs ) )[0];
     if ( !isDefined( methodName ) ) {
       addSkipped( "Method with 'in' and 'out' args not configured in settings." );
       return false;
    }
    // Read method object. If setting is empty, return
    var methodObject = init_GetMethodParent( methodName );
    if ( !isDefined( methodObject ) ) {
       addSkipped( "Method1 object is not configured within the setting:" );
       return false;
    }
    //Make sure method exists with both InputArguments and OutputArguments
    if(TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: methodName,
                                                      UaBrowsePaths: [ TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( methodName, [ "InputArguments" ] ),
                                                      TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( methodName, [ "OutputArguments" ] ) ],
                                                      OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ),
                                                      new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) ]
                                } ) ) {
        for( var i=0; i<TranslateBrowsePathsToNodeIdsHelper.Response.Results.length; i++ ) {
            if( !TranslateBrowsePathsToNodeIdsHelper.Response.Results[i].StatusCode.isGood() ) {
                addSkipped( "Method signature does not match." );
                return false;
            }
        }
        //Read input parameter
        var inputArgument  = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
        var outputArgument = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[1].Targets[0].TargetId.NodeId )[0];
        ReadHelper.Execute( { NodesToRead: [ inputArgument, outputArgument ] } );
        var dataType = [], testValue = [], args = [];
        var inputAugumentArray = inputArgument.Value.Value.toExtensionObjectArray();
        //Find datatype
        for( var i=0; i<inputAugumentArray.length; i++ ) {
            var inputArg = inputAugumentArray[i].toArgument();
            var dataTypeNodeId = inputArg.DataType;
            dataType[i]= getDataTypeFromNodeId( dataTypeNodeId );
            testValue[i] = getInitialValue( dataType[i] );
            args[i] = UaVariant.New( { Type: dataType[i], Value: testValue[i] } );
        }
        var callResult = CallHelper.Execute( {  ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ),OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good, StatusCode.BadNoMatch ) ],
                                                MethodsToCall: [ { MethodId: methodName.NodeId, ObjectId: methodObject.NodeId, InputArguments: args } ] } );
        // make sure the output parameters exist and contain values...
        if( !Assert.GreaterThan( 0, CallHelper.Response.Results[0].OutputArguments.length, "Expected 1 or more arguments to be returned." ) ) callResult = false;
        else {
            if( !Assert.Equal( ReadHelper.Response.Results[1].Value.getArraySize(), CallHelper.Response.Results[0].OutputArguments.length, "The # of OutputArguments[] received does not match expectations." ) ) result = false;
            else {
                for( var i=0; i<CallHelper.Response.Results[0].OutputArguments.length; i++ ) { // iterate thru all output args
                    if( CallHelper.Response.Results[0].OutputArguments[i].isEmpty() ) {
                        addError( "Call.Response.Results[0].OutputArguments[" + i + "] is empty." ); // make sure a value exists
                        callResult = false;
                    }
                }//for i...
            }
        }
    }
    print ( "Output Parameter[0] Value:", CallHelper.Response.Results[0].OutputArguments[0] );
    return( callResult );
}

function getInitialValue( valueDataType ) {
    var Value;
    switch ( valueDataType ) {
        case BuiltInType.Boolean: Value = true; break;
        case BuiltInType.String:  Value = "Hello World"; break;
        case BuiltInType.SByte:   Value = "10"; break;
        case BuiltInType.Byte:    Value = "1"; break;
        case BuiltInType.Int16:   Value = "16"; break;
        case BuiltInType.Int32:   Value = "32"; break;
        case BuiltInType.Int64:   Value = "64"; break;
        case BuiltInType.UInt16:  Value = "16"; break;
        case BuiltInType.UInt32:  Value = "32"; break;
        case BuiltInType.UInt64:  Value = "64"; break;
        case BuiltInType.Float:   Value = "10.2"; break;
        case BuiltInType.Double:  Value = "10.10"; break;
        default:
            print( "Data Type not defined: ");
            addItemToWriteList = false;
            Value = 10;
            break;
    }
    return ( Value );
}

Test.Execute( { Procedure: methodCallTest } );