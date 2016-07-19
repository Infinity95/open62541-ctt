include( "./library/Base/warnOnce.js" );

var Settings = new Object();
Settings._bad_settings = [];
Settings.ArraysToFQPaths = function( folder, settings ) {
                            var s = [];
                            for( var i=0; i<settings.length; i++ )
                                s.push( folder + settings[i] );
                            return( s );
                      };
Settings.SafeRead = function( setting, args ) {
                          // search the _bad_settings first
                          for( var i=0; i<Settings._bad_settings.length; i++ ) {
                              if( Settings._bad_settings[i] === setting ) {
                                  _warning.store( "Setting '" + setting + "' is not configured." );
                                  return( null );
                              }
                          }
                          var v = null;
                          try {
                              v = readSetting( setting ).toString();
                          }
                          catch( excep ) {
                          }
                          if( v == null || v == "null" || v == "undefined" ) {
                              _warning.store( "Setting '" + setting + "' is not configured." );
                              return( null );
                          }
                          else {
                              if( args === undefined || args === null ) return( v );
                              if( args.Type !== undefined && args.Type === "bool" ) return( v == 2? true : false );
                          }
                      };
Settings = {
    ServerTest: {
        ServerUrl:                          Settings.SafeRead( "/Server Test/Server URL" ).toString(),
        DefaultSubscriptionPublishInterval: Settings.SafeRead( "/Server Test/Default Subscription Publish Interval" ),
        DiagnosticInfoResponseTesting:      Settings.SafeRead( "/Server Test/DiagnosticInfo Response Testing" ),
        TimeTolerance:                      Settings.SafeRead( "/Server Test/Time Tolerence" ),
        SubscriptionTimeout:                Settings.SafeRead( "/Server Test/Subscription Timeout" ),
        TimeSynchronizationChecking:        Settings.SafeRead( "/Server Test/Time Synchronization Checking" ),
        Capabilities: {
            MaxStringLength:                   parseInt( readSetting( "/Server Test/Capabilities/Max String Length" ) ),
            MaxSupportedSessions:              parseInt( readSetting( "/Server Test/Capabilities/Max Supported Sessions" ) ),
            MaxSupportedSubscriptions:         parseInt( readSetting( "/Server Test/Capabilities/Max Supported Subscriptions" ) ),
            MaxSupportedMonitoredItems:        parseInt( readSetting( "/Server Test/Capabilities/Max Supported MonitoredItems" ) ),
            RetransmissionQueueSizePerSession: parseInt( readSetting( "/Server Test/Capabilities/Retransmission QueueSize per Session" ) ),
            FastestPublishIntervalSupported:   parseInt( readSetting( "/Server Test/Capabilities/Fastest Publish Interval Supported" ) ),
            FastestSamplingIntervalSupported:  parseInt( readSetting( "/Server Test/Capabilities/Fastest Sampling Interval Supported" ) ),
            MaxPublishRequestsPerSession:      parseInt( readSetting( "/Server Test/Capabilities/Max Publish Requests per Session" ) ),
            MaxSecureChannels:                 parseInt( readSetting( "/Server Test/Capabilities/Max SecureChannels" ) ),
            SecurityNoneEnabled:               readSetting( "/Server Test/Capabilities/SecurityNone Enabled" ), 
        },
        SecureChannel: {
            MessageSecurityMode:        readSetting( "/Server Test/Secure Channel/MessageSecurityMode" ),
            NetworkTimeout:             parseInt( readSetting( "/Server Test/Secure Channel/NetworkTimeout" ) ),
            RequestedLifetime:          parseInt( readSetting( "/Server Test/Secure Channel/RequestedLifetime" ) ),
            RequestedSecurityPolicyUri: readSetting( "/Server Test/Secure Channel/RequestedSecurityPolicyUri" ),
        },
        Session: {
            UserAuthenticationPolicy:  readSetting( "/Server Test/Session/UserAuthenticationPolicy" ),
            LoginNameGranted1:         readSetting( "/Server Test/Session/LoginNameGranted1" ),
            LoginPasswordGranted1:     readSetting( "/Server Test/Session/LoginPasswordGranted1" ),
            LoginNameGranted2:         readSetting( "/Server Test/Session/LoginNameGranted2" ),
            LoginPasswordGranted2:     readSetting( "/Server Test/Session/LoginPasswordGranted2" ),
            LoginNameAccessDenied:     readSetting( "/Server Test/Session/LoginNameAccessDenied" ),
            LoginPasswordAccessDenied: readSetting( "/Server Test/Session/LoginPasswordAccessDenied" ),
            DefaultTimeoutHint:        parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) ),
            RequestedSessionTimeout:   parseInt( readSetting( "/Server Test/Session/RequestedSessionTimeout" ) ),
            MaxResponseMessageSize:    parseInt( readSetting( "/Server Test/Session/MaxResponseMessageSize" ) ),
        },
        NodeIds: {
            Static: {
                All: function() { return( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings.concat( 
                             Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings ).concat( 
                             Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings ).concat(
                             Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings).concat(
                             Settings.ServerTest.NodeIds.Static.DAProfile.AnalogTypeArrays.Settings).concat(
                             Settings.ServerTest.NodeIds.Static.DAProfile.DiscreteType.Settings ).concat(
                             Settings.ServerTest.NodeIds.Static.DAProfile.MultiStateValueDiscreteType.Settings ).concat(
                             Settings.ServerTest.NodeIds.Static.DAProfile.ArrayItemType.Settings ) ) },
                AllProfiles: {
                    Scalar: {
                        Settings:         Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/All Profiles/Scalar/", 
                                                        [ "Bool", "Byte", "ByteString", "DateTime", "Double", "Duration", "Float", "Guid", "Int16", "Int32", "Int64", 
                                                          "LocaleId", "LocalizedText", "NodeId", "Number", "QualifiedName", "SByte", "String", "Time", "UInteger",
                                                          "UInt16", "UInt32", "UInt64", "UtcTime", "XmlElement", "Variant", "Enumeration", "Image", "ImageBMP", "ImageGIF", "ImagePNG" ] ),
                        NumericSettings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/All Profiles/Scalar/", 
                                                        [ "Byte", "Double", "Float", "Int16", "Int32", "Int64", "SByte", "UInt16", "UInt32", "UInt64" ] ),
                        IntegerSettings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/All Profiles/Scalar/", 
                                                        [ "Byte", "Int16", "Int32", "Int64", "SByte", "UInt16", "UInt32", "UInt64" ] ),
                        FloatSettings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/All Profiles/Scalar/", 
                                                        [ "Double", "Float" ] ),
                        Bool:             Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Bool" ),
                        Byte:             Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Byte" ),
                        ByteString:       Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/ByteString" ),
                        DateTime:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/DateTime" ),
                        Double:           Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Double" ),
                        Duration:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Duration" ),
                        Float:            Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Float" ),
                        Guid:             Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Guid" ),
                        Integer:          Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Integer" ),
                        Int16:            Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Int16" ),
                        Int32:            Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32" ),
                        Int64:            Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Int64" ),
                        LocaleId:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/LocaleId" ),
                        LocalizedText:    Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/LocalizedText" ),
                        NodeId:           Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/NodeId" ),
                        Number:           Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Number" ),
                        QualifiedName:    Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/QualifiedName" ),
                        SByte:            Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/SByte" ),
                        String:           Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/String" ),
                        Time:             Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Time" ),
                        UInteger:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/UInteger" ),
                        UInt16:           Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt16" ),
                        UInt32:           Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32" ),
                        UInt64:           Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt64" ),
                        UtcTime:          Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/UtcTime" ),
                        XmlElement:       Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/XmlElement" ),
                        Variant:          Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Variant" ),
                        Enumeration:      Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Enumeration" ),
                        Image:            Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/Image" ),
                        ImageBMP:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/ImageBMP" ),
                        ImageGIF:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/ImageGIF" ),
                        ImagePNG:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Scalar/ImagePNG" ),
                    }, // scalar
                    Arrays: {
                        Settings:      Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/All Profiles/Arrays/", 
                                                        [ "Bool", "Byte", "ByteString", "DateTime", "Double", "Float", "Guid", 
                                                          "Int16", "Int32", "Int64", "SByte", "String",
                                                          "UInt16", "UInt32", "UInt64", "XmlElement", "Variant",
                                                          "LocalizedText", "QualifiedName" ] ),
                        NumericSettings:      Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/All Profiles/Arrays/", 
                                                        [ "Byte", "Double", "Float", "Int16", "Int32", "Int64", "SByte", "UInt16", "UInt32", "UInt64" ] ),
                        Bool:          Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/Bool" ),
                        Byte:          Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/Byte" ),
                        ByteString:    Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/ByteString" ),
                        DateTime:      Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/DateTime" ),
                        Double:        Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/Double" ),
                        Float:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/Float" ),
                        Guid:          Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/Guid" ),
                        Int16:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/Int16" ),
                        Int32:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/Int32" ),
                        Int64:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/Int64" ),
                        SByte:         Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/SByte" ),
                        String:        Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/String" ),
                        UInt16:        Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/UInt16" ),
                        UInt32:        Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/UInt32" ),
                        UInt64:        Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/UInt64" ),
                        XmlElement:    Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/XmlElement" ),
                        Variant:       Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/Variant" ),
                        LocalizedText: Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/LocalizedText" ),
                        QualifiedName: Settings.SafeRead( "/Server Test/NodeIds/Static/All Profiles/Arrays/QualifiedName" ),
                    }, // arrays
                }, // all profiles
                DAProfile: {
                    DataItem: { 
                        Settings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/DA Profile/DataItem/", [
                                                             "Byte", "Double", "Float", "Int16", "Int32", "Int64", "UInt16",
                                                             "UInt32", "UInt64", "SByte", "String", "DateTime" ] ),
                        Byte:      Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/Byte" ),
                        Double:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/Double" ),
                        Float:     Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/Float" ),
                        Int16:     Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/Int16" ),
                        Int32:     Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/Int32" ),
                        Int64:     Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/Int64" ),
                        UInt16:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/UInt16" ),
                        UInt32:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/UInt32" ),
                        UInt64:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/UInt64" ),
                        SByte:     Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/SByte" ),
                        String:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/String" ),
                        DateTime:  Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/DataItem/DateTime" ),
                    }, // data item
                    AnalogType: {
                        Settings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/DA Profile/AnalogType/", [
                                                             "Byte", "Double", "Float", "Int16", "Int32", "Int64", "UInt16",
                                                             "UInt32", "UInt64", "SByte", "NodeIdWithEngineeringUnits", "NodeIdWithInstrumentRange" ] ),
                        NumericSettings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/DA Profile/AnalogType/", [
                                                             "Byte", "Double", "Float", "Int16", "Int32", "Int64", "UInt16",
                                                             "UInt32", "UInt64", "SByte" ] ),
                        Byte:   Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/Byte" ),
                        Double: Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/Double" ),
                        Float:  Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/Float" ),
                        Int16:  Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/Int16" ),
                        Int32:  Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/Int32" ),
                        Int64:  Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/Int64" ),
                        UInt16: Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/UInt16" ),
                        UInt32: Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/UInt32" ),
                        UInt64: Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/UInt64" ),
                        SByte:  Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/SByte" ),
                        NodeIdWithEngineeringUnits: Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/NodeIdWithEngineeringUnits" ),
                        NodeIdWithInstrumentRange:  Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType/NodeIdWithInstrumentRange" ),
                    }, // analog type
                    AnalogTypeArrays: {
                        Settings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/DA Profile/AnalogType Arrays/", [
                                                             "Double", "Float", "Int16", "Int32", "UInt16", "UInt32" ] ),
                        Int16:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType Arrays/Int16" ),
                        Int32:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType Arrays/Int32" ),
                        UInt16:   Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType Arrays/UInt16" ),
                        UInt32:   Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType Arrays/UInt32" ),
                        Float:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType Arrays/Float" ),
                        Double:   Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/AnalogType Arrays/Double" ),
                    }, // analog type arrays
                    DiscreteType: { 
                        Settings:              Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/", [
                                                             "MultiStateDiscrete001", "MultiStateDiscrete002", "MultiStateDiscrete003",
                                                             "MultiStateDiscrete004", "MultiStateDiscrete005", "TwoStateDiscrete001",
                                                             "TwoStateDiscrete002", "TwoStateDiscrete003", "TwoStateDiscrete004", "TwoStateDiscrete005" ] ),
                        TwoStateDiscretes:     Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/", [
                                                             "TwoStateDiscrete001", "TwoStateDiscrete002", "TwoStateDiscrete003", "TwoStateDiscrete004", "TwoStateDiscrete005" ] ),
                        MultiStateDiscretes:   Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/", [
                                                             "MultiStateDiscrete001", "MultiStateDiscrete002", "MultiStateDiscrete003",
                                                             "MultiStateDiscrete004", "MultiStateDiscrete005" ] ),
                        MultiStateDiscrete001: readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/MultiStateDiscrete001" ),
                        MultiStateDiscrete002: readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/MultiStateDiscrete002" ),                       
                        MultiStateDiscrete003: readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/MultiStateDiscrete003" ),
                        MultiStateDiscrete004: readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/MultiStateDiscrete004" ),                    
                        MultiStateDiscrete005: readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/MultiStateDiscrete005" ),
                        TwoStateDiscrete001:   readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/TwoStateDiscrete001" ),
                        TwoStateDiscrete002:   readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/TwoStateDiscrete002" ),
                        TwoStateDiscrete003:   readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/TwoStateDiscrete003" ),
                        TwoStateDiscrete004:   readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/TwoStateDiscrete004" ),
                        TwoStateDiscrete005:   readSetting( "/Server Test/NodeIds/Static/DA Profile/DiscreteType/TwoStateDiscrete005" ),
                    }, // discrete types
                    MultiStateValueDiscreteType: { 
                        Settings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType/", [
                                                             "Byte", "SByte", "Int16", "Int32", "Int64", "UInt16", "UInt32", "UInt64" ] ),
                        Byte:     Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType/Byte" ),
                        SByte:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType/SByte" ),
                        Int16:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType/Int16" ),
                        Int32:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType/Int32" ),
                        Int64:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType/Int64" ),
                        UInt16:   Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType/UInt16" ),
                        UInt32:   Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType/UInt32" ),
                        UInt64:   Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType/UInt64" ),
                    }, // multi state value discrete types
                    ArrayItemType: { 
                        Settings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/DA Profile/ArrayItemType/", [
                                                             "YArrayItemType", "XYArrayItemType", "ImageItemType", "CubeItemType", "NDimensionArrayItemType" ] ),
                        YArrayItemType:  Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/ArrayItemType/YArrayItemType" ),
                        XYArrayItemType: Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/ArrayItemType/XYArrayItemType" ),
                        ImageItemType:   Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/ArrayItemType/ImageItemType" ),
                        CubeItemType:    Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/ArrayItemType/CubeItemType" ),
                        NDimensionArrayItemType: Settings.SafeRead( "/Server Test/NodeIds/Static/DA Profile/ArrayItemType/NDimensionArrayItemType" ),
                    }, // array item type
                }, // DA Profile
                HAProfile: {
                    NodeDoesNotSupportHistory:         Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/NodeDoesNotSupportHistory" ),
                    NodeDoesNotSupportSourceTimestamp: Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/NodeDoesNotSupportSourceTimestamp" ),
                    Debug:                             Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Debug" ),
                    Scalar: {
                        Settings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/HA Profile/Scalar/", [
                                                             "Bool", "Byte", "ByteString", "DateTime", "Double", "Float", "Int16", "Int32", "Int64", 
                                                             "UInt16", "UInt32", "UInt64", "SByte", "XmlElement" ] ),
                        Bool:       Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/Bool" ),
                        Byte:       Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/Byte" ),
                        ByteString: Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/ByteString" ),
                        DateTime:   Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/DateTime" ),
                        Double:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/Double" ),
                        Float:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/Float" ),
                        Int16:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/Int16" ),
                        Int32:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/Int32" ),
                        Int64:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/Int64" ),
                        SByte:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/SByte" ),
                        String:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/String" ),
                        UInt16:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/UInt16" ),
                        UInt32:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/UInt32" ),
                        UInt64:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/UInt64" ),
                        XmlElement: Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Scalar/XmlElement" ),
                    },
                    Arrays: {
                        Settings:   Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/HA Profile/Arrays/", [
                                                             "Bool", "Byte", "ByteString", "DateTime", "Double", "Float", "Int16", "Int32", "Int64", 
                                                             "SByte", "String", "UInt16", "UInt32", "UInt64", "XmlElement",
                                                             "Bool2D", "Byte2D", "ByteString2D", "DateTime2D", "Double2D", "Float2D", "Int162D", "Int322D", "Int642D", 
                                                             "SByte2D", "String2D", "UInt162D", "UInt322D", "UInt642D", "XmlElement2D",
                                                             ] ),
                        OneD:       Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/HA Profile/Arrays/", [
                                                             "Bool", "Byte", "ByteString", "DateTime", "Double", "Float", "Int16", "Int32", "Int64", 
                                                             "SByte", "String", "UInt16", "UInt32", "UInt64", "XmlElement",
                                                             ] ),
                        TwoDs:      Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/HA Profile/Arrays/", [
                                                             "Bool2D", "Byte2D", "ByteString2D", "DateTime2D", "Double2D", "Float2D", "Int162D", "Int322D", "Int642D", 
                                                             "SByte2D", "String2D", "UInt162D", "UInt322D", "UInt642D", "XmlElement2D",
                                                             ] ),
                        Bool:       Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Bool" ),
                        Byte:       Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Byte" ),
                        ByteString: Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/ByteString" ),
                        DateTime:   Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/DateTime" ),
                        Double:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Double" ),
                        Float:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Float" ),
                        Int16:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Int16" ),
                        Int32:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Int32" ),
                        Int64:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Int64" ),
                        SByte:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/SByte" ),
                        String:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/String" ),
                        UInt16:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/UInt16" ),
                        UInt32:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/UInt32" ),
                        UInt64:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/UInt64" ),
                        XmlElement: Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/XmlElement" ),
                        Bool2D:       Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Bool2D" ),
                        Byte2D:       Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Byte2D" ),
                        ByteString2D: Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/ByteString2D" ),
                        DateTime2D:   Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/DateTime2D" ),
                        Double2D:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Double2D" ),
                        Float2D:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Float2D" ),
                        Int162D:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Int162D" ),
                        Int322D:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Int322D" ),
                        Int642D:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/Int642D" ),
                        SByte2D:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/SByte2D" ),
                        String2D:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/String2D" ),
                        UInt162D:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/UInt162D" ),
                        UInt322D:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/UInt322D" ),
                        UInt642D:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/UInt642D" ),
                        XmlElement2D: Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/Arrays/XmlElement2D" ),
                    },
                    AccessRights: {
                        Settings:  Settings.ArraysToFQPaths( "/Server Test/NodeIds/Static/HA Profile/AccessRights/", [
                                                             "AccessLevel_ReadOnly", "AccessLevel_WriteOnly", "AccessLevel_None", "UserAccessLevel_ReadOnly",
                                                             "UserAccessLevel_WriteOnly", "UserAccessLevel_None" ] ),
                        AccessLevelReadOnly:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/AccessRights/AccessLevel_ReadOnly" ),
                        AccessLevelWriteOnly:     Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/AccessRights/AccessLevel_WriteOnly" ),
                        AccessLevelNone:          Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/AccessRights/AccessLevel_None" ),
                        UserAccessLevelReadOnly:  Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/AccessRights/UserAccessLevel_ReadOnly" ),
                        UserAccessLevelWriteOnly: Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/AccessRights/UserAccessLevel_WriteOnly" ),
                        UserAccessLevelNone:      Settings.SafeRead( "/Server Test/NodeIds/Static/HA Profile/AccessRights/UserAccessLevel_None" ),
                    },
                }, // HA Profile
            }, // static
            References: {
                Settings:          Settings.ArraysToFQPaths( "/Server Test/NodeIds/References/", 
                                                        [ "Has 3 Forward References 1", "Has 3 Forward References 2", "Has 3 Forward References 3", "Has 3 Forward References 4", "Has 3 Forward References 5",
                                                          "Has Inverse And Forward References", "Has References With Different Parent Types", "Has 3 Inverse References 1" ] ),
                Has3ForwardRefs1:   Settings.SafeRead( "/Server Test/NodeIds/References/Has 3 Forward References 1" ),
                Has3ForwardRefs2:   Settings.SafeRead( "/Server Test/NodeIds/References/Has 3 Forward References 2" ),
                Has3ForwardRefs3:   Settings.SafeRead( "/Server Test/NodeIds/References/Has 3 Forward References 3" ),
                Has3ForwardRefs4:   Settings.SafeRead( "/Server Test/NodeIds/References/Has 3 Forward References 4" ),
                Has3ForwardRefs5:   Settings.SafeRead( "/Server Test/NodeIds/References/Has 3 Forward References 5" ),
                HasInverseForward:  Settings.SafeRead( "/Server Test/NodeIds/References/Has Inverse And Forward References" ),
                HasRefsDiffParents: Settings.SafeRead( "/Server Test/NodeIds/References/Has References With Different Parent Types" ),
                Has3InverseRefs1:   Settings.SafeRead( "/Server Test/NodeIds/References/Has 3 Inverse References 1" ),
            }, // References 
            Paths: { 
                StartingNode:  Settings.SafeRead( "/Server Test/NodeIds/Paths/Starting Node 1" ),
                UnknownPath:   Settings.SafeRead( "/Server Test/NodeIds/Paths/Unknown Path 1" ),
                MaxDepth:      Settings.SafeRead( "/Server Test/NodeIds/Paths/Max Depth" ),
            }, // paths
            NodeClasses: { 
                Settings:          Settings.ArraysToFQPaths( "/Server Test/NodeIds/NodeClasses/", 
                                                        [ "Variable", "Object", "Method", "ObjectType",
                                                          "VariableType", "ReferenceType", "DataType", "View" ] ),
                Variable:      Settings.SafeRead( "/Server Test/NodeIds/NodeClasses/Variable" ),
                Object:        Settings.SafeRead( "/Server Test/NodeIds/NodeClasses/Object" ),
                Method:        Settings.SafeRead( "/Server Test/NodeIds/NodeClasses/Method" ),
                ObjectType:    Settings.SafeRead( "/Server Test/NodeIds/NodeClasses/ObjectType" ),
                VariableType:  Settings.SafeRead( "/Server Test/NodeIds/NodeClasses/VariableType" ),
                ReferenceType: Settings.SafeRead( "/Server Test/NodeIds/NodeClasses/ReferenceType" ),
                DataType:      Settings.SafeRead( "/Server Test/NodeIds/NodeClasses/DataType" ),
                View:          Settings.SafeRead( "/Server Test/NodeIds/NodeClasses/View" ),
            }, // node classes
            SecurityAccess: { 
                Settings:          Settings.ArraysToFQPaths( "/Server Test/NodeIds/SecurityAccess/", 
                                                        [ "AccessLevel_CurrentRead", "AccessLevel_CurrentWrite", "AccessLevel_CurrentRead_NotUser", "AccessLevel_CurrentWrite_NotUser",
                                                          "AccessLevel_CurrentRead_NotCurrentWrite", "AccessLevel_CurrentWrite_NotCurrentRead" ] ),
                AccessLevelCurentRead:                 Settings.SafeRead( "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead" ),
                AccessLevelCurrentWrite:               Settings.SafeRead( "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentWrite" ),
                AccessLevelCurrentReadNotUser:         Settings.SafeRead( "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead_NotUser" ),
                AccessLevelCurrentWriteNotUser:        Settings.SafeRead( "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentWrite_NotUser" ),
                AccessLevelCurrentReadNotCurrentWrite: Settings.SafeRead( "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead_NotCurrentWrite" ),
                AccessLevelCurrentWriteNotCurrentRead: Settings.SafeRead( "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentWrite_NotCurrentRead" ),
            }, // security access
            NodeManagement: { 
                RootNode:                  Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/RootNode" ),
                RequestedNodeId:           Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/RequestedNodeId" ),
                RequestedNodeId_Namespace: Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/RequestedNodeId_Namespace" ),
                RequestedNodeId_IdString:  Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/RequestedNodeId_IdString" ),
                RequestedNodeId_IdNumeric: Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/RequestedNodeId_IdNumeric" ),
                RequestedNodeId_IdGuid:    Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/RequestedNodeId_IdGuid" ),
                SupportedAttributes: {
                    AccessLevel:     Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/AccessLevel",     { Type: "bool" } ),
                    ArrayDimensions: Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/ArrayDimensions", { Type: "bool" } ),
                    BrowseName:      Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/BrowseName",      { Type: "bool" } ),
                    DataType:        Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/DataType",        { Type: "bool" } ),
                    Description:     Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/Description",     { Type: "bool" } ),
                    DisplayName:     Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/DisplayName",     { Type: "bool" } ),
                    EventNotifier:   Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/EventNotifier",   { Type: "bool" } ),
                    Executable:      Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/Executable",      { Type: "bool" } ),
                    Historizing:     Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/Historizing",     { Type: "bool" } ),
                    InverseName:     Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/InverseName",     { Type: "bool" } ),
                    Method:          Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/Method",          { Type: "bool" } ),
                    MinimumSamplingInterval: Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/MinimumSamplingInterval", { Type: "bool" } ),
                    NodeClass:       Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/NodeClass",       { Type: "bool" } ),
                    UserAccessLevel: Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/UserAccessLevel", { Type: "bool" } ),
                    UserExecutable:  Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/UserExecutable",  { Type: "bool" } ),
                    UserWriteMask:   Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/UserWriteMask",   { Type: "bool" } ),
                    WriteMask:       Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/WriteMask",       { Type: "bool" } ),
                    NodeId:          Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/NodeId",          { Type: "bool" } ),
                    Value:           Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/Value",           { Type: "bool" } ),
                    ValueRank:       Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedAttributes/ValueRank",       { Type: "bool" } ),
                },
                SupportedReferences: {
                    Organizes:         Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/Organizes",                      { Type: "bool" } ),
                    HasEventSource:    Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasEventSource",                 { Type: "bool" } ),
                    HasModellingRule:  Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasModellingRule",               { Type: "bool" } ),
                    HasEncoding:       Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasEncoding",                    { Type: "bool" } ),
                    HasDescription:    Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasDescription",                 { Type: "bool" } ),
                    HasTypeDefinition: Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasTypeDefinition",              { Type: "bool" } ),
                    GeneratesEvent:    Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/GeneratesEvent",                 { Type: "bool" } ),
                    AlwaysGeneratesEvent:  Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/AlwaysGeneratesEvent",       { Type: "bool" } ),
                    HasSubtype:            Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasSubtype",                 { Type: "bool" } ),
                    HasProperty:           Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasProperty",                { Type: "bool" } ),
                    HasComponent:          Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasComponent",               { Type: "bool" } ),
                    HasNotifier:           Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasNotifier",                { Type: "bool" } ),
                    FromState:             Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/FromState",                  { Type: "bool" } ),
                    HasCause:              Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasCause",                   { Type: "bool" } ),
                    HasEffect:             Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasEffect",                  { Type: "bool" } ),
                    HasSubStateMachine:    Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasSubStateMachine",         { Type: "bool" } ),
                    HasHistoricalConfig:   Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasHistoricalConfiguration", { Type: "bool" } ),
                    HasTrueSubState:       Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasTrueSubState",            { Type: "bool" } ),
                    HasFalseSubState:      Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasFalseSubState",           { Type: "bool" } ),
                    HasCondition:          Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedReferences/HasCondition",               { Type: "bool" } ),
                },
                SupportedNodeClasses: {
                    DataType:      Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedNodeClasses/DataType",      { Type: "bool" } ),
                    Method:        Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedNodeClasses/Method",        { Type: "bool" } ),
                    Object:        Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedNodeClasses/Object",        { Type: "bool" } ),
                    ObjectType:    Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedNodeClasses/ObjectType",    { Type: "bool" } ),
                    ReferenceType: Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedNodeClasses/ReferenceType", { Type: "bool" } ),
                    Variable:      Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedNodeClasses/Variable",      { Type: "bool" } ),
                    VariableType:  Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedNodeClasses/VariableType",  { Type: "bool" } ),
                    View:          Settings.SafeRead( "/Server Test/NodeIds/NodeManagement/SupportedNodeClasses/View",          { Type: "bool" } ),
                },
            }, // node management
            Methods: { 
                Settings:          Settings.ArraysToFQPaths( "/Server Test/NodeIds/Methods/", 
                                                        [ "MethodNoArgs", "MethodIO", "MethodI", "MethodO", "MultipleMethods" ] ),
                NoArgs:    Settings.SafeRead( "/Server Test/NodeIds/Methods/MethodNoArgs" ),
                IOArgs:    Settings.SafeRead( "/Server Test/NodeIds/Methods/MethodIO" ),
                IArgs:     Settings.SafeRead( "/Server Test/NodeIds/Methods/MethodI" ),
                OArgs:     Settings.SafeRead( "/Server Test/NodeIds/Methods/MethodO" ),
                Multiple:  Settings.SafeRead( "/Server Test/NodeIds/Methods/MultipleMethods" ),
            }, // methods
            Events: {
                TriggerNode01: Settings.SafeRead( "/Server Test/NodeIds/Events/TriggerNode01" ),
                TriggerNode02: Settings.SafeRead( "/Server Test/NodeIds/Events/TriggerNode02" ),
            },
        }, // node ids
    }, // server test
    Advanced: {
        Certificates: {
            Authority:                    Settings.SafeRead( "/Advanced/Certificates/CertificateAuthority" ),
            TrustListLocation:            Settings.SafeRead( "/Advanced/Certificates/CertificateTrustListLocation" ),
            RevocationListLocation:       Settings.SafeRead( "/Advanced/Certificates/CertificateRevocationListLocation" ),
            Certificate:                  Settings.SafeRead( "/Advanced/Certificates/ClientCertificate" ),
            PrivateKey:                   Settings.SafeRead( "/Advanced/Certificates/ClientPrivateKey" ),
            Expired:                      Settings.SafeRead( "/Advanced/Certificates/ExpiredClientCertificate" ),
            ExpiredPrivateKey:            Settings.SafeRead( "/Advanced/Certificates/ExpiredClientPrivateKey" ),
            IncorrectlySigned:            Settings.SafeRead( "/Advanced/Certificates/IncorrectlySignedClientCertificate" ),
            IncorrectlySignedPrivateKey:  Settings.SafeRead( "/Advanced/Certificates/IncorrectlySignedClientPrivateKey" ),
            NotTrusted:                   Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_NotTrusted" ),
            NotTrustedPrivateKey:         Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_NotTrustedPrivateKey" ),
            Revoked:                      Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_Revoked" ),
            RevokedPrivateKey:            Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_RevokedPrivateKey" ),
            NotYetValid:                  Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_NotYetValid" ),
            NotYetValidPrivateKey:        Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_NotYetValidPrivateKey" ),
            IssuerUnknown:                Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_IssuerUnknown" ),
            IssuerUnknownPrivateKey:      Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_IssuerUnknownPrivateKey" ),
            HostnameInvalid:              Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_HostnameInvalid" ),
            HostnameInvalidPrivateKey:    Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_HostnameInvalidPrivateKey" ),
            ExpiredNotTrusted:            Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_ExpiredNotTrusted" ),
            ExpiredNotTrustedPrivateKey:  Settings.SafeRead( "/Advanced/Certificates/ClientCertificate_ExpiredNotTrustedPrivateKey" ),
            User:                         Settings.SafeRead( "/Advanced/Certificates/UserCertificate" ),
            UserPrivate:                  Settings.SafeRead( "/Advanced/Certificates/UserCertificate_PrivateKey" ),
            UserCertNotTrusted:           Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Untrusted" ),
            UserCertNotTrustedPrivateKey: Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Untrusted_PrivateKey" ),
            UserCertNotYetValid:          Settings.SafeRead( "/Advanced/Certificates/UserCertificate_NotYetValid" ),
            UserCertNotYetValidPrivateKey:Settings.SafeRead( "/Advanced/Certificates/UserCertificate_NotYetValid_PrivateKey" ),
            UserCertExpired:              Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Expired" ),
            UserCertExpiredPrivateKey:    Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Expired_PrivateKey" ),
            UserCertIssued:               Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Issued" ),
            UserCertIssuedPrivateKey:     Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Issued_PrivateKey" ),
            UserCertRevoked:              Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Revoked" ),
            UserCertRevokedPrivateKey:    Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Revoked_PrivateKey" ),
            UserCertInvalid:              Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Invalid" ),
            UserCertInvalidPrivateKey:    Settings.SafeRead( "/Advanced/Certificates/UserCertificate_Invalid_PrivateKey" ),
        }, // certificates
        NodeIds: {
            Invalid: {
                Unknowns: Settings.ArraysToFQPaths( "/Advanced/NodeIds/Invalid/", [ "UnknownNodeId1", "UnknownNodeId2", "UnknownNodeId3", "UnknownNodeId4", "UnknownNodeId5" ] ),
                Invalids: Settings.ArraysToFQPaths( "/Advanced/NodeIds/Invalid/", [ "InvalidSyntaxNodeId1", "InvalidSyntaxNodeId2" ] ),
                NodeId1:  Settings.SafeRead( "/Advanced/NodeIds/Invalid/InvalidNodeId1" ),
                NodeId2:  Settings.SafeRead( "/Advanced/NodeIds/Invalid/InvalidNodeId2" ),
                Unknown1: Settings.SafeRead( "/Advanced/NodeIds/Invalid/UnknownNodeId1" ),
                Unknown2: Settings.SafeRead( "/Advanced/NodeIds/Invalid/UnknownNodeId2" ),
                Unknown3: Settings.SafeRead( "/Advanced/NodeIds/Invalid/UnknownNodeId3" ),
                Unknown4: Settings.SafeRead( "/Advanced/NodeIds/Invalid/UnknownNodeId4" ),
                Unknown5: Settings.SafeRead( "/Advanced/NodeIds/Invalid/UnknownNodeId5" ),
                Invalid1: Settings.SafeRead( "/Advanced/NodeIds/Invalid/InvalidSyntaxNodeId1" ),
                Invalid2: Settings.SafeRead( "/Advanced/NodeIds/Invalid/InvalidSyntaxNodeId2" ),
            },// invalid
        }, // node ids
        ResourceTesting: {
            CallCount: {
                Attribute:        Settings.SafeRead( "/Advanced/ResourceTesting/AttributeServicesCallCount" ),
                Discovery:        Settings.SafeRead( "/Advanced/ResourceTesting/DiscoveryServicesCallCount" ),
                MonitoredItem:    Settings.SafeRead( "/Advanced/ResourceTesting/MonitoredItemServicesCallCount" ),
                NodeManagement:   Settings.SafeRead( "/Advanced/ResourceTesting/NodeManagementServicesCallCount" ),
                Session:          Settings.SafeRead( "/Advanced/ResourceTesting/SessionServiceSetCallCount" ),
                Subscription:     Settings.SafeRead( "/Advanced/ResourceTesting/SubscriptionServiceSetCallCount" ),
                InterCallDelay:   Settings.SafeRead( "/Advanced/ResourceTesting/InterCallDelay" ),
                MaxTimeInSeconds: Settings.SafeRead( "/Advanced/ResourceTesting/MaxTestTimeInSeconds" ),
            },// call count
        }, // resource testing
        CertificateOverrides: {
            TimeInvalid:       Settings.SafeRead( "/Advanced/CertificateOverrides/DisableCertificateTimeInvalid",       { Type: "bool" } ),
            RevocationUnknown: Settings.SafeRead( "/Advanced/CertificateOverrides/DisableCertificateRevocationUnknown", { Type: "bool" } ),
            UseNotAllowed:     Settings.SafeRead( "/Advanced/CertificateOverrides/DisableCertificateUseNotAllowed",     { Type: "bool" } ),
        }, // certificate overrides
    }, // advanced
    Discovery: {
        EndpointUrl:                 Settings.SafeRead( "/Discovery/Endpoint Url" ),
        MessageSecurityMode:         Settings.SafeRead( "/Discovery/MessageSecurityMode" ),
        RequestedSecurityPolicyUri:  Settings.SafeRead( "/Discovery/RequestedSecurityPolicyUri" ),
        SemaphoreFilePath:           Settings.SafeRead( "/Discovery/SemaphoreFilePath" ),
    },
}

function getindent( indent ) { 
    var s = "";
    for( var i=0; i<indent; i++ ) s += "   ";
    return( s );
}

function printsettings( settings, indent ) {
    for( var setting in settings ) {
        var msg = setting;
        print( getindent( indent ) + msg + ": " + settings[setting] );
        if( typeof settings[setting] === "object" ) printsettings( settings[setting], 1 + indent );
    }
}

//printsettings( Settings, 0 );