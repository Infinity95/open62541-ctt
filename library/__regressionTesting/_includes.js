// loads each and every script. In doing so will find any parser errors
// BASE
var LIB = "./library";
var BASE = LIB + "/Base/";
var BASEOBJECTS = BASE + "Objects/";
addLog( BASEOBJECTS );
include( BASEOBJECTS + "dictionary.js" );
include( BASEOBJECTS + "event.js" );
include( BASEOBJECTS + "expectedResults.js" );
include( BASEOBJECTS + "hostnames.js" );
include( BASEOBJECTS + "integerSet.js" );
include( BASEOBJECTS + "monitoredItem.js" );
include( BASEOBJECTS + "securityalgorithms.js" );
include( BASEOBJECTS + "subscription.js" );
include( BASEOBJECTS + "JSQueue.js" );
include( BASEOBJECTS + "keyPairCollection.js" );

var BASESETTINGSUTILITIES = BASE + "SettingsUtilities/";
addLog( BASESETTINGSUTILITIES );
include( BASESETTINGSUTILITIES + "NodeIds.js" );
include( BASESETTINGSUTILITIES + "validate_setting.js" );
include( BASESETTINGSUTILITIES + "NodeIdSetting.js" );
include( BASESETTINGSUTILITIES + "Setting.js" );
include( BASE + "NodeTypeAttributesMatrix.js" );
include( BASE + "StringMatching.js" );
include( BASE + "UaVariantToSimpleType.js" );
include( BASE + "array.js" );
include( BASE + "assertions.js" );
include( BASE + "certificates.js" );
include( BASE + "connectChannel.js" );
include( BASE + "identity.js" );
include( BASE + "indexRangeRelatedUtilities.js" );
include( BASE + "locales.js" );
include( BASE + "safeInvoke.js" );
include( BASE + "serverCapabilities.js" );
include( BASE + "warnOnce.js" );

var SERVICEBASED = LIB + "/ServiceBased";
var ATTRIBS = SERVICEBASED + "/AttributeServiceSet/";
addLog( ATTRIBS );
include( ATTRIBS + "Read.js" );
include( ATTRIBS + "Write.js" );
include( ATTRIBS + "Read/readAndCheckServerState.js" );
include( ATTRIBS + "Write/incrementValueByDataType.js" );
include( ATTRIBS + "Write/writeMask_writeValues.js" );
include( ATTRIBS + "Write/write_attribute.js" );
include( ATTRIBS + "HistoryRead/HAStructureHelpers.js" );
include( ATTRIBS + "HistoryRead/CttHistoryServer.js" );
include( ATTRIBS + "HistoryRead/historyRead.js" );
include( ATTRIBS + "HistoryRead/rawDataAnalysis.js" );
include( ATTRIBS + "HistoryUpdate/historyUpdate.js" );

var DISCO = SERVICEBASED + "/DiscoveryServiceSet/";
addLog( DISCO );
include( DISCO + "/FindServers.js" );
include( DISCO + "/GetEndpoints.js" );
include( DISCO + "/RegisterServer/check_registerServer_failed.js" );
include( DISCO + "/RegisterServer/check_registerServer_valid.js" );
