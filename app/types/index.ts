export interface Site {
  siteId: string;
  name: string;
  description: string;
  transformParameters: {
    deltaX: number;
    deltaY: number;
    deltaZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    scaleFactor: number;
  };
}

export enum PermissionsValues {
  ReadBlastDogConnectionTest = "read:blastdog:connection_test",
  CreateBlastDogStatus = "create:blastdog:status",
  UpdateBlastDogCommsboxConfig = "update:blastdog:commsbox_configuration",
  UpdateBlastDogDiagnosticLogFile = "update:blastdog:diagnostic_logfile",
  CreateSiteLoggedData = "create:site:logged_data",
  UpdateSitePatternStatus = "update:site:pattern_status",
  UpdateSitePatternManagement = "update:site:pattern_management",
  ReadBlastDogDetails = "read:blastdog:details",
  ReadBlastDogVersionHistory = "read:blastdog:version_history",
  ReadBlastDogEventLog = "read:blastdog:event_log",
  ReadAnswerProductPreprocessData = "read:answerproduct:preprocessed_data",
  ReadSiteOperationSummary = "read:site:operations_summary",
  ReadSitesList = "read:site:sites_list",
  ReadSiteDetails = "read:site:details",
  ReadSitePatterns = "read:site:patterns",
  ReadConfigurationSiteList = "read:configuration:site_list",
  UpdateConfigurationBlastDogSiteAssignment = "update:configuration:blastdog_site_assignment",
  ReadAnswerproductExport = "read:answerproduct:export",
  UdpdateConfigurationUsers = "update:configuration:users",
}

export interface Role {
  permissions: PermissionsValues[];
  roles: string[];
}

export interface SiteRole extends Role {
  siteId: string;
}

export interface UserAuthorisation {
  globalRoles: Role;
  siteRoles: SiteRole[];
  eulaAcceptanceRequired?: boolean;
}

export enum OperatingMode {
  Offline = "Offline",
  Online = "Online",
  Logging = "Logging",
}

export interface BlastDog {
  blastDogId: string;
  blastDogName: string;
  fuelLevelPercentage: number | null;
  lastLoggedPatternName: string | null;
  lastUpdateTime: string | null;
  operator: string | null;
  status: OperatingMode;
}

export interface PatternListItem {
  siteId: string;
  patternId: string;
  name: string;
  bench: string;
  dateTimeCreatedUtc: string;
  dateTimeUpdatedUtc: string;
  hasMergePending: boolean;
  holeCount: number;
  isActive: boolean;
  numberOfHolesToReview: number;
  percentageLogged: number;
}

export interface PatternsResponse {
  totalMatchedPatterns: number;
  activeMatchedPatterns: number;
  patterns: PatternListItem[];
}
