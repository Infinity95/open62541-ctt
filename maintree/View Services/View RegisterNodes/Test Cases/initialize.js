include( "./library/Base/safeInvoke.js" );
include( "./library/Base/array.js" );
include( "./library/ServiceBased/ViewServiceSet/RegisterNodes/assert_registernodes_valid.js" );
include( "./library/ServiceBased/ViewServiceSet/RegisterNodes/check_registerNodes_valid.js" );
include( "./library/ServiceBased/ViewServiceSet/RegisterNodes/register_nodes_test.js" );
include( "./library/ServiceBased/ViewServiceSet/UnregisterNodes/check_unregisterNodes_valid.js" );
include( "./library/ServiceBased/ViewServiceSet/UnregisterNodes/unregister_nodes_test.js" );
include( "./library/ClassBased/UaRegisterNodesRequest/create_default_request.js" );
include( "./library/ClassBased/UaUnregisterNodesRequest/create_default_request.js" );

if( !Test.Connect() ) stopCurrentUnit();